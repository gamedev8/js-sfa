function _c2(a,b) { return String.prototype.concat(a,b); }
function _c3(a,b,c) { return String.prototype.concat(String.prototype.concat(a,b),c); }
function _c4(a,b,c,d) { return String.prototype.concat(String.prototype.concat(String.prototype.concat(a,b),c),d); }
/* Encapulates a new match */
var CreateMatch = function(team1,team2,stage)
{
    var defeatedTeam_ = -1;
    var isRoundOver_ = false;
    var gotoNewRoundFrame_ = CONSTANTS.NO_FRAME;
    var playerCount_ = -1;
    var physics_ = CreatePhysics();
    var stage_ = new Stage();
    var actionSystem_ = new HitSystem();
    var isSuperMoveActive_ = false;
    var dimBackground_ = window.document.getElementById("pnlDimBackground");
    var round_ = 1;
    var allowInput_ = false;

    var Match = function()
    {
        this.TeamA = CreateTeam(1);
        this.TeamB = CreateTeam(2);
        this.LoadAssets();
        this.GetStage().Setup(stage);
    }
    Match.prototype.GetPhysics = function() { return physics_; }
    Match.prototype.GetTeamA = function() { return this.TeamA; }
    Match.prototype.GetTeamB = function() { return this.TeamB; }
    Match.prototype.GetDefeatedTeam = function() { return defeatedTeam_; }
    Match.prototype.SetDefeatedTeam = function(value) { defeatedTeam_ = value; }
    Match.prototype.IsRoundOver = function() { return isRoundOver_; }
    Match.prototype.SetRoundOver = function(value) { isRoundOver_ = value; }
    Match.prototype.GetGotoNewRoundFrame = function() { return gotoNewRoundFrame_; }
    Match.prototype.SetGotoNewRoundFrame = function(value) { gotoNewRoundFrame_ = value; }
    Match.prototype.GetPlayerCount = function() { return playerCount_; }
    Match.prototype.SetPlayerCount = function(value) { playerCount_ = value; }
    Match.prototype.GetHitSystem = function() { return actionSystem_; }
    Match.prototype.SetActionSystem = function(value) { actionSystem_ = value; }
    Match.prototype.IsSuperMoveActive = function() { return isSuperMoveActive_; }
    Match.prototype.SetSuperMoveActive = function(value) { isSuperMoveActive_ = value; }
    Match.prototype.GetDimBackgroundElement = function() { return dimBackground_; }
    Match.prototype.GetRound = function() { return round_; }
    Match.prototype.SetRound = function(value) { round_ = value; }
    Match.prototype.GetAllowInput = function() { return allowInput_; }
    Match.prototype.SetAllowInput = function(value) { allowInput_ = value; }

    Match.prototype.GetStage = function() { return stage_; }
    Match.prototype.ResetKeys = function()
    {
        for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
            this.TeamA.GetPlayer(i).ClearInput();
        for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
            this.TeamB.GetPlayer(i).ClearInput();
    }
    Match.prototype.PlayerCount = function()
    {
        if(this.GetPlayerCount())
            this.SetPlayerCount(this.TeamA.GetPlayers().length + this.TeamB.GetPlayers().length);

        return this.GetPlayerCount();
        
    }
    Match.prototype.GetGame = function() { return game_; }
    Match.prototype.GetCurrentFrame = function() { return this.GetGame().GetCurrentFrame(); }

    Match.prototype.InitText = function()
    {
        this.TeamA.InitText();
        this.TeamB.InitText();

        this.TeamB.GetComboText().ChangeDirection();
    }


    /*Tells the result of the match*/
    Match.prototype.HandleMatchOver = function(frame)
    {
        if(frame > CONSTANTS.MAX_FRAME)
        {
            announcer_.TimeOver();
        }
    }
    /* Is the match over yet? */
    Match.prototype.IsMatchOver = function(frame)
    {
        return frame > CONSTANTS.MAX_FRAME;
    }

    Match.prototype.ShowTeamInfo = function()
    {
    }
    /*Changes the health value for a team*/
    Match.prototype.ChangeHealth = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {this.TeamA.GetHealthbar().Change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.TeamB.GetHealthbar().Change(changeAmount); break; }
        };
    }
    /*Changes the energy value for a team*/
    Match.prototype.ChangeEnergy = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {this.TeamA.GetEnergybar().Change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.TeamB.GetEnergybar().Change(changeAmount); break; }
        };
    }
    /*Returns the health for a team*/
    Match.prototype.GetHealth = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.TeamA.GetHealthbar().GetAmount();}
            case CONSTANTS.TEAM2: {return this.TeamB.GetHealthbar().GetAmount();}
        }
    }
    /*Returns the energy for a team*/
    Match.prototype.GetEnergy = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.TeamA.GetEnergybar().GetAmount();}
            case CONSTANTS.TEAM2: {return this.TeamB.GetEnergybar().GetAmount();}
        }
    }
    /*Gets the current frame*/
    Match.prototype.GetCurrentFrame = function()
    {
        return this.GetGame().GetCurrentFrame();
    }
    /*A team has just been defeated*/
    Match.prototype.DefeatTeam = function(team,attackDirection,loseIgnoreId)
    {
        announcer_.KO();
        this.ReleaseAllInput();

        this.SetAllowInput(false);
        var frame = this.GetGame().GetCurrentFrame();
        this.GetGame().SetSpeed(CONSTANTS.SLOW_SPEED);
        this.SetDefeatedTeam(team);
        switch(this.GetDefeatedTeam())
        {
            case CONSTANTS.TEAM1:
            {
                for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                    if(this.TeamA.GetPlayer(i).id_ != loseIgnoreId)
                        this.TeamA.GetPlayer(i).ForceLose(attackDirection);
                for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                    this.TeamB.GetPlayer(i).JustWon(frame);
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                    if(this.TeamB.GetPlayer(i).id_ != loseIgnoreId)
                        this.TeamB.GetPlayer(i).ForceLose(attackDirection);
                for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                    this.TeamA.GetPlayer(i).JustWon(frame);
                break;
            }
        }
    }
    /*Should be called after the player who was defeated hits the ground*/
    Match.prototype.DeadAnimationComplete = function(player,frame)
    {
        if(!this.IsRoundOver())
        {
            this.SetRoundOver(true);
            this.GetGame().SetSpeed(CONSTANTS.NORMAL_SPEED);
            this.SetGotoNewRoundFrame(frame);

            announcer_.EndRound();
        }
    }
    /*Registers an action*/
    Match.prototype.RegisterAction = function(details)
    {
        this.GetHitSystem().Register(details);
    }
    /**/
    Match.prototype.ReleaseAllInput = function()
    {
        this.GetGame().ResetKeys();
    }
    /*Restarts the match*/
    Match.prototype.Reset = function()
    {
        if(this.GetGotoNewRoundFrame() != CONSTANTS.NO_FRAME)
        {
            this.SetAllowInput(false);
            this.SetRound(this.GetRound() + 1);
            this.GetGame().SetSpeed(CONSTANTS.NORMAL_SPEED);
            this.SetGotoNewRoundFrame(CONSTANTS.NO_FRAME);
            this.TeamA.SetCursor(0);
            this.TeamB.SetCursor(0);
            this.SetSuperMoveActive(false);


            this.GetGame().ResetFrame();

            this.TeamA.GetEnergybar().Change(0,0);
            this.TeamB.GetEnergybar().Change(0,0);

            if(!!this.TeamA.GetPlayer(0))
                this.TeamA.GetPlayer(0).SetX(STAGE.START_X);
            if(!!this.TeamB.GetPlayer(0))
                this.TeamB.GetPlayer(0).SetX(STAGE.START_X);

            /*set the starting locations for each player*/
            for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
            {
                this.TeamA.GetPlayer(i).Reset(true);
                this.TeamA.GetPlayer(i).SetDirection(-1);
                this.TeamA.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }
            for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
            {
                this.TeamB.GetPlayer(i).Reset(true);
                this.TeamB.GetPlayer(i).SetDirection(1);
                this.TeamB.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }

            this.SetRoundOver(false);
            this.GetStage().Init();
            this.GetGame().ReleaseText();

            this.TeamA.GetHealthbar().Reset();
            this.TeamB.GetHealthbar().Reset();
        }
    }

    /**/
    Match.prototype.Pause = function()
    {
        this.GetStage().Pause();
        this.TeamA.Pause();
        this.TeamB.Pause();
    }

    /**/
    Match.prototype.Resume = function()
    {
        this.GetStage().Resume();
        this.TeamA.Resume();
        this.TeamB.Resume();
    }

    Match.prototype.PlayerIndex = 0;

    /*sets up the player to take part in the match*/
    Match.prototype.SetupPlayer = function(player,team)
    {
        var moveStageX          = function(thisValue,otherTeam) { return function(amount,dontOverrideSign) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) {amount = thisValue.GetStage().ScrollX(amount,this,otherTeam.GetPlayers()[i],thisValue,dontOverrideSign);}; return amount; } };
        var fixX                = function(thisValue,otherTeam) { return function(amount) {thisValue.GetPhysics().FixX(amount,this,false,true);  return 0; } };
        var moveX               = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.GetStage().ScrollX(amount,this,null,thisValue); thisValue.GetPhysics().MoveX(amount,this,false,true); return 0; } };
        var moveY               = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.GetPhysics().MoveY(amount,this); return 0; } };
        var moveToBack          = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.GetPlayers().length;++i) {otherTeam.GetPlayers()[i].MoveToBack(true);} } }
        var moveToFront         = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.GetPlayers().length;++i) {otherTeam.GetPlayers()[i].MoveToFront(true);} } }
        var projectileMoved     = function(thisValue,otherTeam) { return function(id,x,y) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { otherTeam.GetPlayers()[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),true,id,x,y); } } }
        var projectileGone      = function(thisValue,otherTeam) { return function(id)     { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { otherTeam.GetPlayers()[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),false,id); } } }
        var startAttack         = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { otherTeam.GetPlayers()[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
        var endAttack           = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { this.Flags.Combat.Remove(COMBAT_FLAGS.CAN_BE_BLOCKED); otherTeam.GetPlayers()[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
        var startAirAttack      = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { otherTeam.GetPlayers()[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
        var endAirAttack        = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { this.Flags.Combat.Remove(COMBAT_FLAGS.CAN_BE_AIR_BLOCKED); otherTeam.GetPlayers()[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
        var attack              = function(thisValue,otherTeam) { return function(hitDelayFactor, hitID, frame,points,flags,state,damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { thisValue.GetPhysics().TryAttack(hitDelayFactor, hitID,frame,points,flags,state,this,otherTeam.GetPlayers()[i],damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound); } } }
        var projectileAttack    = function(thisValue,otherTeam) { return function(frame,projectile) { for(var i = 0; i < otherTeam.GetPlayers().length;++i) { thisValue.GetPhysics().TryProjectileAttack(frame,projectile,this,otherTeam.GetPlayers()[i]); } } }
        var changeHealth        = function(thisValue)         { return function(amount) { thisValue.ChangeHealth(this.team_,amount); } }
        var getHealth           = function(thisValue)         { return function() { return thisValue.GetHealth(this.team_); } }
        var changeEnergy        = function(thisValue)         { return function(amount) { thisValue.ChangeEnergy(this.team_,amount); } }
        var getEnergy           = function(thisValue)         { return function() { return thisValue.GetEnergy(this.team_); } }
        var incCombo            = function(thisValue,team)    { return function() { return team.IncCombo(); } }
        var incComboRefCount    = function(thisValue,team)    { return function() { return team.IncComboRefCount(); } }
        var decComboRefCount    = function(thisValue,team)    { return function() { return team.DecComboRefCount(); } }
        var getCurrentComboCount= function(thisValue,team)    { return function() { return team.GetCurrentCombo(); } }

        var otherTeam = null;
        var myTeam = null;
        var dir = "";

        switch(team)
        {
            case 1: {dir = "l"; myTeam = this.TeamA; otherTeam = this.TeamB; break;}
            case 2: {dir = "r"; myTeam = this.TeamB; otherTeam = this.TeamA; break;}
        }

        var index = Match.prototype.PlayerIndex++;

        player.id_ = "t" + team + "p" + index;
        player.moveStageXFn_ = moveStageX(this,otherTeam);
        player.fixXFn_ = fixX(this,otherTeam);
        player.moveXFn_ = moveX(this,otherTeam);
        player.moveYFn_ = moveY(this,otherTeam);
        player.moveOtherPlayersToBackFn_ = moveToBack(this,otherTeam);
        player.moveOtherPlayersToFrontFn_ = moveToFront(this,otherTeam);
        player.takeDamageFn_ = changeHealth(this);
        player.changeEnergyFn_ = changeEnergy(this);
        player.attackFn_ = attack(this,otherTeam);
        player.projectileAttackFn_ = projectileAttack(this,otherTeam);
        player.SetupInfo(team,dir);
        player.getHealthFn_ = getHealth(this);
        player.getEnergyFn_ = getEnergy(this);
        player.onStartAttackFn_ = startAttack(this,otherTeam);
        player.onEndAttackFn_ = endAttack(this,otherTeam);
        player.onStartAirAttackFn_ = startAirAttack(this,otherTeam);
        player.onEndAirAttackFn_ = endAirAttack(this,otherTeam);
        player.onProjectileMovedFn_ = projectileMoved(this,otherTeam);
        player.onProjectileGoneFn_ = projectileGone(this,otherTeam);
        player.onIncComboFn_ = incCombo(this,myTeam);
        player.onIncComboRefCountFn_ = incComboRefCount(this,myTeam);
        player.onDecComboRefCountFn_ = decComboRefCount(this,myTeam);
        player.getCurrentComboCountFn_ = getCurrentComboCount(this,myTeam);
        player.InitSprite();
        if(team == 1)
            player.ChangeDirection(true);

    }

    /*Initializes a new match*/
    Match.prototype.Start = function(ignoreMusic)
    {
        this.GetStage().Start();


        this.TeamA.SetPlayers(team1);
        this.TeamB.SetPlayers(team2);
        this.InitText();
        /*init team 1*/
        for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
        {
            this.SetupPlayer(this.TeamA.GetPlayers()[i],CONSTANTS.TEAM1);
        }
        if(!!this.TeamA.GetPlayer(0))
            this.TeamA.GetPlayer(0).SetX(STAGE.START_X);

        /*init team 2*/
        for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
        {
            this.SetupPlayer(this.TeamB.GetPlayers()[i],CONSTANTS.TEAM2);
        }
        if(!!this.TeamB.GetPlayer(0))
            this.TeamB.GetPlayer(0).SetX(STAGE.START_X);

        /*set the starting locations for each player*/
        for(var i = 1, length = this.TeamA.GetPlayers().length; i < length; ++i)
            this.TeamA.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        for(var i = 1, length = this.TeamB.GetPlayers().length; i < length; ++i)
            this.TeamB.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

        this.GetStage().Init();
        this.TeamA.Init();
        this.TeamB.Init();

        if(!ignoreMusic)
            this.GetStage().PlayMusic();
    }
    /*Handles key state changes*/
    Match.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
    {
        if(this.GetAllowInput())
        {
            for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                this.TeamA.GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
            for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                this.TeamB.GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
        }
    }
    /*Dims the background when a player is starting a super move*/
    Match.prototype.SetBackgroundTransparent = function(player)
    {
        if(!!player)
        {
            this.GetDimBackgroundElement().style.display = "";
        }
        else
        {
            this.GetDimBackgroundElement().style.display = "none";
        }
    }
    Match.prototype.OnSuperMoveStarted = function(player)
    {
        if(!this.IsSuperMoveActive())
        {
            this.SetBackgroundTransparent(player);
            this.SetSuperMoveActive(true);
            for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                if(this.TeamA.GetPlayer(i).id_ != player.id_)
                    this.TeamA.GetPlayer(i).OnSuperMoveStarted();
            for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                if(this.TeamB.GetPlayer(i).id_ != player.id_)
                    this.TeamB.GetPlayer(i).OnSuperMoveStarted();
        }
    }
    Match.prototype.OnSuperMoveCompleted = function(player)
    {
        if(this.IsSuperMoveActive())
        {
            this.SetBackgroundTransparent();
            for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                if(this.TeamA.GetPlayer(i).id_ != player.id_)
                    this.TeamA.GetPlayer(i).OnSuperMoveCompleted();
            for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                if(this.TeamB.GetPlayer(i).id_ != player.id_)
                    this.TeamB.GetPlayer(i).OnSuperMoveCompleted();
            this.SetSuperMoveActive(false);
        }
    }
    Match.prototype.PreFrameMove = function(frame)
    {
        for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
            this.TeamA.GetPlayer(i).OnPreFrameMove(frame);
        for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
            this.TeamB.GetPlayer(i).OnPreFrameMove(frame);
    }
    Match.prototype.RenderComplete = function(frame)
    {
        for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
            this.TeamA.GetPlayer(i).OnRenderComplete(frame);
        for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
            this.TeamB.GetPlayer(i).OnRenderComplete(frame);
    }

    /**/
    Match.prototype.StartNewRound = function(frame)
    {
        announcer_.StartRound();
    }

    /**/
    Match.prototype.EndNewRound = function(frame)
    {
        this.SetAllowInput(true);
    }

    /*pre-render calculations to be performed here*/
    Match.prototype.FrameMove = function(frame,keyboardState)
    {

        this.GetStage().FrameMove(frame);
        this.GetHitSystem().FrameMove(frame);

        this.TeamA.FrameMove(frame,keyboardState,this.GetStage().x_, this.GetStage().y_);
        this.TeamB.FrameMove(frame,keyboardState,this.GetStage().x_, this.GetStage().y_);

        if((this.GetGotoNewRoundFrame() != CONSTANTS.NO_FRAME) && (frame > (this.GetGotoNewRoundFrame() + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
            this.Reset();
        if(frame == CONSTANTS.ANNOUNCE_NEW_ROUND_DELAY)
            this.StartNewRound(frame);
        if(frame == CONSTANTS.START_NEW_ROUND_DELAY)
            this.EndNewRound(frame);
    }

    /*All rendering and CSS manipulation to be done here*/
    Match.prototype.Render = function(frame)
    {

        this.TeamA.Render(frame,this.GetStage().x_ - this.GetStage().lastX_);
        this.TeamB.Render(frame,this.GetStage().x_ - this.GetStage().lastX_);

        this.GetStage().Render();

    }

    Match.prototype.Kill = function()
    {
        this.Release();
    }

    /*Remove elements from the DOM and remove any custom CSS*/
    Match.prototype.Release = function()
    {
        this.GetStage().Release();
        this.TeamA.Release();
        this.TeamB.Release();
    }


    Match.prototype.LoadAssets = function()
    {
        stuffLoader_.Queue("match.js",RESOURCE_TYPES.BASE64AUDIO);
        stuffLoader_.Queue("images/misc/misc/shadow-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/dirt-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/blast-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/bars-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl0.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl1.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl2.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/health-bar-life.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/health-bar-damage.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);
    }

    return new Match();
}
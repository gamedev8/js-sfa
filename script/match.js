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
    var isPresented_ = false;
    var announcedNewRound_ = false;
    var startedRound_ = false;
    var showedFaceoff_ = false;
    var teamsVisible_ = false;
    var startedTheme_ = false;
    var faceoff_ = null;

    var Match = function()
    {
        this.TeamA = CreateTeam(1);
        this.TeamB = CreateTeam(2);
        this.LoadAssets();
        stage_.Setup(stage);

        faceoff_ = CreateFaceoff(this);
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
    Match.prototype.GetCurrentFrame = function() { return game_.GetCurrentFrame(); }

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
        return game_.GetCurrentFrame();
    }
    /*A team has just been defeated*/
    Match.prototype.DefeatTeam = function(team,attackDirection,loseIgnoreId)
    {
        announcer_.KO();
        this.ReleaseAllInput();

        this.SetAllowInput(false);
        var frame = game_.GetCurrentFrame();
        game_.SetSpeed(CONSTANTS.SLOW_SPEED);
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
            game_.SetSpeed(CONSTANTS.NORMAL_SPEED);
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
        game_.ResetKeys();
    }
    /*Restarts the match*/
    Match.prototype.Reset = function()
    {
        if(this.GetGotoNewRoundFrame() != CONSTANTS.NO_FRAME)
        {
            game_.ShowLoading(true);
            isPresented_ = false;
            faceoff_.Reset();
            this.SetAllowInput(false);
            this.SetRound(this.GetRound() + 1);
            game_.SetSpeed(CONSTANTS.NORMAL_SPEED);
            this.SetGotoNewRoundFrame(CONSTANTS.NO_FRAME);
            this.TeamA.SetCursor(0);
            this.TeamB.SetCursor(0);
            this.SetSuperMoveActive(false);


            game_.ResetFrame();

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
            stage_.Init();
            game_.ReleaseText();

            this.TeamA.GetHealthbar().Reset();
            this.TeamB.GetHealthbar().Reset();

        }
    }

    /**/
    Match.prototype.Pause = function()
    {
        if(!faceoff_.IsActive())
        {
            stage_.Pause();
            this.TeamA.Pause();
            this.TeamB.Pause();
        }
        else
        {
            faceoff_.Pause();
        }
    }

    /**/
    Match.prototype.Resume = function()
    {
        if(!faceoff_.IsActive())
        {
            stage_.Resume();
            this.TeamA.Resume();
            this.TeamB.Resume();
        }
        else
        {
            faceoff_.Resume();
        }
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
        stage_.Start();
        faceoff_.Init();

        this.TeamA.SetPlayers(team1);
        this.TeamB.SetPlayers(team2);
        this.InitText();
        /*init team 1*/
        for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
        {
            this.SetupPlayer(this.TeamA.GetPlayers()[i],CONSTANTS.TEAM1);
        }
        if(!!this.TeamA.GetPlayer(0))
        {
            faceoff_.SetTeamA(this.TeamA.GetPlayer(0).name_);
            this.TeamA.GetPlayer(0).SetX(STAGE.START_X);
        }

        /*init team 2*/
        for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
        {
            this.SetupPlayer(this.TeamB.GetPlayers()[i],CONSTANTS.TEAM2);
        }
        if(!!this.TeamB.GetPlayer(0))
        {
            faceoff_.SetTeamB(this.TeamB.GetPlayer(0).name_);
            this.TeamB.GetPlayer(0).SetX(STAGE.START_X);
        }

        /*set the starting locations for each player*/
        for(var i = 1, length = this.TeamA.GetPlayers().length; i < length; ++i)
            this.TeamA.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        for(var i = 1, length = this.TeamB.GetPlayers().length; i < length; ++i)
            this.TeamB.GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

        stage_.Init();
        this.TeamA.Init();
        this.TeamB.Init();
    }
    /*Handles key state changes*/
    Match.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
    {
        //if(this.GetAllowInput())
        //{
            for(var i = 0; i < this.TeamA.GetPlayers().length; ++i)
                this.TeamA.GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
            for(var i = 0; i < this.TeamB.GetPlayers().length; ++i)
                this.TeamB.GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
        //}
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

    /**/
    Match.prototype.Present = function()
    {
        isPresented_ = true;
        game_.ShowLoading(false);
    }


    Match.prototype.HandleRound1 = function(frame)
    {
        faceoff_.HandleRound1(frame);
        if(!startedTheme_ && (frame > CONSTANTS.START_THEME_DELAY))
        {
            stage_.PlayMusic();
            startedTheme_ = true;
        }
        if(!teamsVisible_ && (frame > CONSTANTS.SHOW_TEAMS_DELAY))
        {
            faceoff_.Hide(frame);
            this.TeamA.Show();
            this.TeamB.Show();
            teamsVisible_ = true;
        }
        if((gotoNewRoundFrame_ != CONSTANTS.NO_FRAME) && (frame > (gotoNewRoundFrame_ + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
            this.Reset();
    }

    Match.prototype.HandleOtherRounds = function(frame)
    {
        if((gotoNewRoundFrame_ != CONSTANTS.NO_FRAME) && (frame > (gotoNewRoundFrame_ + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
        {
            this.Reset();
            frame = game_.GetCurrentFrame();
        }
        faceoff_.HandleOtherRounds(frame);
    }

    /*pre-render calculations to be performed here*/
    Match.prototype.FrameMove = function(frame,keyboardState)
    {
        stage_.FrameMove(frame);
        this.GetHitSystem().FrameMove(frame);

        this.TeamA.FrameMove(frame,keyboardState,stage_.x_, stage_.y_);
        this.TeamB.FrameMove(frame,keyboardState,stage_.x_, stage_.y_);

        if(round_ != 1)
            this.HandleOtherRounds(frame);
        else
        {
            this.HandleRound1(frame);
            faceoff_.FrameMove(frame);
        }
    }

    /*All rendering and CSS manipulation to be done here*/
    Match.prototype.Render = function(frame)
    {

        this.TeamA.Render(frame,stage_.x_ - stage_.lastX_);
        this.TeamB.Render(frame,stage_.x_ - stage_.lastX_);

        stage_.Render();

        if(!isPresented_ && (frame > CONSTANTS.PRESENT_DELAY))
            this.Present();
        if(round_ == 1)
            faceoff_.Render(frame);
    }

    Match.prototype.Kill = function()
    {
        this.Release();
    }

    /*Remove elements from the DOM and remove any custom CSS*/
    Match.prototype.Release = function()
    {
        stage_.Release();
        this.TeamA.Release();
        this.TeamB.Release();
        faceoff_.Release();
    }


    Match.prototype.LoadAssets = function()
    {
        stuffLoader_.Queue("match.js",RESOURCE_TYPES.BASE64AUDIO);
    }

    /**********************************************************************************/
    /*This prototype together with the Match prototype handles the announcing of round*/
    /**********************************************************************************/
    var CreateFaceoff = function(match)
    {
        var match_ = match;
        var showedFaceoff_ = false;
        var announcedNewRound_ = false;
        var startedRound_ = false;
        var areNamesHidden_ = true;
        var faceoffSound_ = "audio/misc/faceoff.zzz";

        var Faceoff = function()
        {
            this.faceoffElement_ = null;
            this.teamAFaceoffElement_ = null;
            this.teamBFaceoffElement_ = null;
            this.teamANameElement_ = null;
            this.teamBNameElement_ = null;
            this.vsElement_ = null;

            this.maxAngle_ = 360;
            this.maxScale_ = 1;

            this.angle_ = 0;
            this.scale_ = 0;

            var nbFrames = 20;

            this.rotateUpFn_ = (function(max,inc) { return function(t,value) { return Math.min(value + (max/nbFrames), max); } })(this.maxAngle_);
            this.rotateDownFn_ = (function(max,inc) { return function(t,value) { return Math.max(value + (max/nbFrames), 0); } })(this.maxAngle_);
            this.scaleUpFn_ = (function(max,inc) { return function(t,value) { return Math.min(value + (max/nbFrames), max); } })(this.maxScale_);
            this.scaleDownFn_ = (function(max,inc) { return function(t,value) { return Math.max(value - (max/nbFrames), 0); } })(this.maxScale_);
        }

        Faceoff.prototype.SetTeamA = function(name)
        {
            spriteLookup_.Set(this.teamAFaceoffElement_,"images/misc/misc/p2-select-" + name + ".png");
            spriteLookup_.Set(this.teamANameElement_,"images/misc/font3/name-" + name + ".png",false,true);
        }
        Faceoff.prototype.SetTeamB = function(name)
        {
            spriteLookup_.Set(this.teamBFaceoffElement_,"images/misc/misc/p2-select-" + name + ".png");
            spriteLookup_.Set(this.teamBNameElement_,"images/misc/font3/name-" + name + ".png",false,true);
        }

        Faceoff.prototype.Init = function()
        {
            this.faceoffElement_ = window.document.createElement("div");
            this.faceoffElement_.style.display = "none";
            this.faceoffElement_.className = "faceoff";

            this.teamAFaceoffElement_ = window.document.createElement("div");
            this.teamAFaceoffElement_.className = "team1-faceoff";

            this.teamBFaceoffElement_ = window.document.createElement("div");
            this.teamBFaceoffElement_.className = "team2-faceoff";

            this.faceoffElement_.appendChild(this.teamAFaceoffElement_);
            this.faceoffElement_.appendChild(this.teamBFaceoffElement_);

            this.teamANameElement_ = window.document.createElement("div");
            this.teamANameElement_.className = "faceoff-name flipped";
            this.teamAFaceoffElement_.appendChild(this.teamANameElement_);

            this.teamBNameElement_ = window.document.createElement("div");
            this.teamBNameElement_.className = "faceoff-name";
            this.teamBFaceoffElement_.appendChild(this.teamBNameElement_);

            this.vsElement_ = window.document.createElement("div");
            this.vsElement_.className = "vs";
            spriteLookup_.Set(this.vsElement_,"images/misc/misc/vs-0.png");
            this.faceoffElement_.appendChild(this.vsElement_);

            this.Reset();
            window.document.getElementById("pnlStage").appendChild(this.faceoffElement_);
        }

        Faceoff.prototype.IsActive = function()
        {
            return !startedRound_;
        }

        Faceoff.prototype.Reset = function()
        {
            showedFaceoff_ = false;
            announcedNewRound_ = false;
            startedRound_ = false;
            this.scale_ = 0;
            this.angle_ = 0;

            this.RotateScale();

            this.teamANameElement_.style.display = "none";
            this.teamBNameElement_.style.display = "none";
            this.vsElement_.style.display = "none";
            areNamesHidden_ = true;
        }

        Faceoff.prototype.Pause = function()
        {
            soundManager_.Pause(faceoffSound_);
        }

        Faceoff.prototype.Resume = function()
        {
            if(!startedRound_)
                soundManager_.Resume(faceoffSound_);
        }

        Faceoff.prototype.Release = function()
        {
            utils_.RemoveFromDOM(this.faceoffElement_);
        }

        Faceoff.prototype.Show = function(frame)
        {
            showedFaceoff_ = true;
            soundManager_.QueueSound(faceoffSound_);
            this.faceoffElement_.style.display = "";
        }


        Faceoff.prototype.Hide = function(frame)
        {
            this.faceoffElement_.style.display = "none";
        }

        Faceoff.prototype.StartNewRound = function(frame)
        {
            announcedNewRound_ = true;
            match_.StartNewRound(frame);
        }

        Faceoff.prototype.EndNewRound = function(frame)
        {
            startedRound_ = true;
            match_.EndNewRound(frame);
        }

        Faceoff.prototype.HandleRound1 = function(frame)
        {
            if(!showedFaceoff_ && (frame > CONSTANTS.SHOW_FACEOFF_DELAY))
                this.Show(frame);
            if(!announcedNewRound_ && (frame > CONSTANTS.ANNOUNCE_FIRST_ROUND_DELAY))
                this.StartNewRound(frame);
            if(!startedRound_ && (frame > CONSTANTS.START_FIRST_ROUND_DELAY))
                this.EndNewRound(frame);
        }

        Faceoff.prototype.HandleOtherRounds = function(frame)
        {
            if(!announcedNewRound_ && (frame > CONSTANTS.ANNOUNCE_NEW_ROUND_DELAY))
                this.StartNewRound(frame);
            if(!startedRound_ && (frame > CONSTANTS.START_NEW_ROUND_DELAY))
                this.EndNewRound(frame);
        }

        Faceoff.prototype.FrameMove = function(frame)
        {
            if((frame > CONSTANTS.SHOW_FACEOFF_PICS_DELAY) && (frame < CONSTANTS.REMOVE_FACEOFF_PICS_DELAY))
            {
                if(this.scale_ < this.maxScale_)
                {
                    this.scale_ = this.scaleUpFn_(frame, this.scale_);
                    this.angle_ = this.rotateUpFn_(frame, this.angle_);
                    this.RotateScale();
                }
                else if(!!areNamesHidden_)
                {
                    this.teamANameElement_.style.display = "";
                    this.teamBNameElement_.style.display = "";
                    this.vsElement_.style.display = "";
                    areNamesHidden_ = false;
                }
            }
            else if(frame > CONSTANTS.REMOVE_FACEOFF_PICS_DELAY)
            {
                if(!areNamesHidden_)
                {                
                    this.teamANameElement_.style.display = "none";
                    this.teamBNameElement_.style.display = "none";
                    this.vsElement_.style.display = "none";
                    areNamesHidden_ = true;
                }
                if(this.scale_ > 0)
                {
                    this.scale_ = this.scaleDownFn_(frame, this.scale_);
                    this.angle_ = this.rotateDownFn_(frame, this.angle_);
                    this.RotateScale();
                }
            }
        }

        Faceoff.prototype.RotateScale = function()
        {
            this.teamAFaceoffElement_.style["-webkit-transform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
            this.teamAFaceoffElement_.style["-moz-transform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
            this.teamAFaceoffElement_.style["MozTransform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
            this.teamAFaceoffElement_.style["-o-transform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotate(" + this.angle_ + "deg)";
            this.teamAFaceoffElement_.style["OTransform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotate(" + this.angle_ + "deg)";
            this.teamAFaceoffElement_.style["-ms-transform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";

            this.teamBFaceoffElement_.style["-webkit-transform"] = "scale(" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
            this.teamBFaceoffElement_.style["-moz-transform"] = "scale(" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
            this.teamBFaceoffElement_.style["MozTransform"] = "scale(" + this.scale_ + "," + this.scale_ + ") rotate(" + this.angle_ + "deg)";
            this.teamBFaceoffElement_.style["OTransform"] = "scale(" + this.scale_ + "," + this.scale_ + ") rotate(" + this.angle_ + "deg)";
            this.teamBFaceoffElement_.style["-ms-transform"] = "scale(-" + this.scale_ + "," + this.scale_ + ") rotateZ(" + this.angle_ + "deg)";
        }

        Faceoff.prototype.Render = function(frame)
        {
        }

        return new Faceoff();
    }

    return new Match();
}


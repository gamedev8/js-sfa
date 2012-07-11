function _c2(a,b) { return String.prototype.concat(a,b); }
function _c3(a,b,c) { return String.prototype.concat(String.prototype.concat(a,b),c); }
function _c4(a,b,c,d) { return String.prototype.concat(String.prototype.concat(String.prototype.concat(a,b),c),d); }
/* Encapulates a new match */
var CreateMatch = function()
{
    var teamA_ = CreateTeam(1);
    var teamB_ = CreateTeam(2);
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
        this.PreloadSounds();
    }
    Match.prototype.GetPhysics = function() { return physics_; }
    Match.prototype.GetTeamA = function() { return teamA_; }
    Match.prototype.GetTeamB = function() { return teamB_; }
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
        for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
            this.GetTeamA().GetPlayer(i).ClearInput();
        for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
            this.GetTeamB().GetPlayer(i).ClearInput();
    }
    Match.prototype.PlayerCount = function()
    {
        if(this.GetPlayerCount())
            this.SetPlayerCount(this.GetTeamA().GetPlayers().length + this.GetTeamB().GetPlayers().length);

        return this.GetPlayerCount();
        
    }
    Match.prototype.GetGame = function() { return game_; }
    Match.prototype.GetCurrentFrame = function() { return this.GetGame().GetCurrentFrame(); }

    Match.prototype.InitText = function()
    {
        this.GetTeamA().InitText();
        this.GetTeamB().InitText();

        this.GetTeamB().GetComboText().ChangeDirection();
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
            case CONSTANTS.TEAM1: {this.GetTeamA().GetHealthbar().Change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.GetTeamB().GetHealthbar().Change(changeAmount); break; }
        };
    }
    /*Changes the energy value for a team*/
    Match.prototype.ChangeEnergy = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {this.GetTeamA().GetEnergybar().Change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.GetTeamB().GetEnergybar().Change(changeAmount); break; }
        };
    }
    /*Returns the health for a team*/
    Match.prototype.GetHealth = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.GetTeamA().GetHealthbar().GetAmount();}
            case CONSTANTS.TEAM2: {return this.GetTeamB().GetHealthbar().GetAmount();}
        }
    }
    /*Returns the energy for a team*/
    Match.prototype.GetEnergy = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.GetTeamA().GetEnergybar().GetAmount();}
            case CONSTANTS.TEAM2: {return this.GetTeamB().GetEnergybar().GetAmount();}
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
                for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
                    if(this.GetTeamA().GetPlayer(i).id_ != loseIgnoreId)
                        this.GetTeamA().GetPlayer(i).ForceLose(attackDirection);
                for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
                    this.GetTeamB().GetPlayer(i).JustWon(frame);
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
                    if(this.GetTeamB().GetPlayer(i).id_ != loseIgnoreId)
                        this.GetTeamB().GetPlayer(i).ForceLose(attackDirection);
                for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
                    this.GetTeamA().GetPlayer(i).JustWon(frame);
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
            this.GetTeamA().SetCursor(0);
            this.GetTeamB().SetCursor(0);
            this.SetSuperMoveActive(false);


            this.GetGame().ResetFrame();

            this.GetTeamA().GetEnergybar().Change(0,0);
            this.GetTeamB().GetEnergybar().Change(0,0);

            if(!!this.GetTeamA().GetPlayer(0))
                this.GetTeamA().GetPlayer(0).SetX(STAGE.START_X);
            if(!!this.GetTeamB().GetPlayer(0))
                this.GetTeamB().GetPlayer(0).SetX(STAGE.START_X);

            /*set the starting locations for each player*/
            for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
            {
                this.GetTeamA().GetPlayer(i).Reset(true);
                this.GetTeamA().GetPlayer(i).SetDirection(-1);
                this.GetTeamA().GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }
            for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
            {
                this.GetTeamB().GetPlayer(i).Reset(true);
                this.GetTeamB().GetPlayer(i).SetDirection(1);
                this.GetTeamB().GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }

            this.SetRoundOver(false);
            this.GetStage().Reset();
            this.GetGame().ReleaseText();

            this.GetTeamA().GetHealthbar().Reset();
            this.GetTeamB().GetHealthbar().Reset();
        }
    }

    /**/
    Match.prototype.Pause = function()
    {
        this.GetStage().Pause();
    }

    /**/
    Match.prototype.Resume = function()
    {
        this.GetStage().Resume();
    }

    /*Initializes a new match*/
    Match.prototype.Start = function(team1,team2,stage)
    {
        this.GetStage().Set(stage);
        this.GetStage().Resume();
        var moveStageX          = function(thisValue,players) { return function(amount,dontOverrideSign) { for(var i = 0; i < players.length;++i) {amount = thisValue.GetStage().ScrollX(amount,this,players[i],thisValue,dontOverrideSign);}; return amount; } };
        var fixX                = function(thisValue,players) { return function(amount) {thisValue.GetPhysics().FixX(amount,this,false,true);  return 0; } };
        var moveX               = function(thisValue,players) { return function(amount) {amount = thisValue.GetStage().ScrollX(amount,this,null,thisValue); thisValue.GetPhysics().MoveX(amount,this,false,true); return 0; } };
        var moveY               = function(thisValue,players) { return function(amount) {amount = thisValue.GetPhysics().MoveY(amount,this); return 0; } };
        var moveToBack          = function(thisValue,players) { return function() { for(var i = 0; i < players.length;++i) {players[i].MoveToBack(true);} } }
        var moveToFront         = function(thisValue,players) { return function() { for(var i = 0; i < players.length;++i) {players[i].MoveToFront(true);} } }
        var projectileMoved     = function(thisValue,players) { return function(id,x,y) { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),true,id,x,y); } } }
        var projectileGone      = function(thisValue,players) { return function(id)     { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),false,id); } } }
        var startAttack         = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
        var endAttack           = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { this.Flags.Combat.Remove(COMBAT_FLAGS.CAN_BE_BLOCKED); players[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
        var startAirAttack      = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { players[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
        var endAirAttack        = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { this.Flags.Combat.Remove(COMBAT_FLAGS.CAN_BE_AIR_BLOCKED); players[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
        var attack              = function(thisValue,players) { return function(hitDelayFactor, hitID, frame,points,flags,state,damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound) { for(var i = 0; i < players.length;++i) { thisValue.GetPhysics().TryAttack(hitDelayFactor, hitID,frame,points,flags,state,this,players[i],damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound); } } }
        var projectileAttack    = function(thisValue,players) { return function(frame,projectile) { for(var i = 0; i < players.length;++i) { thisValue.GetPhysics().TryProjectileAttack(frame,projectile,this,players[i]); } } }
        var changeHealth        = function(thisValue)         { return function(amount) { thisValue.ChangeHealth(this.team_,amount); } }
        var getHealth           = function(thisValue)         { return function() { return thisValue.GetHealth(this.team_); } }
        var changeEnergy        = function(thisValue)         { return function(amount) { thisValue.ChangeEnergy(this.team_,amount); } }
        var getEnergy           = function(thisValue)         { return function() { return thisValue.GetEnergy(this.team_); } }
        var incCombo            = function(thisValue,team)    { return function() { return team.IncCombo(); } }
        var incComboRefCount    = function(thisValue,team)    { return function() { return team.IncComboRefCount(); } }
        var decComboRefCount    = function(thisValue,team)    { return function() { return team.DecComboRefCount(); } }
        var getCurrentComboCount= function(thisValue,team)    { return function() { return team.GetCurrentCombo(); } }


        this.GetTeamA().SetPlayers(team1);
        this.GetTeamB().SetPlayers(team2);
        this.InitText();
        /*init team 1*/
        for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
        {
            this.GetTeamA().GetPlayer(i).id_ = "t1p" + i;
            this.GetTeamA().GetPlayer(i).SetIndex(i);
            this.GetTeamA().GetPlayer(i).moveStageXFn_ = moveStageX(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).fixXFn_ = fixX(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).moveXFn_ = moveX(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).moveYFn_ = moveY(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).moveOtherPlayersToBackFn_ = moveToBack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).moveOtherPlayersToFrontFn_ = moveToFront(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).takeDamageFn_ = changeHealth(this);
            this.GetTeamA().GetPlayer(i).changeEnergyFn_ = changeEnergy(this);
            this.GetTeamA().GetPlayer(i).attackFn_ = attack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).projectileAttackFn_ = projectileAttack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).SetupInfo(1,"l");
            this.GetTeamA().GetPlayer(i).getHealthFn_ = getHealth(this);
            this.GetTeamA().GetPlayer(i).getEnergyFn_ = getEnergy(this);
            this.GetTeamA().GetPlayer(i).onStartAttackFn_ = startAttack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onEndAttackFn_ = endAttack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onStartAirAttackFn_ = startAirAttack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onEndAirAttackFn_ = endAirAttack(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onProjectileMovedFn_ = projectileMoved(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onProjectileGoneFn_ = projectileGone(this,this.GetTeamB().GetPlayers());
            this.GetTeamA().GetPlayer(i).onIncComboFn_ = incCombo(this,this.GetTeamA());
            this.GetTeamA().GetPlayer(i).onIncComboRefCountFn_ = incComboRefCount(this,this.GetTeamA());
            this.GetTeamA().GetPlayer(i).onDecComboRefCountFn_ = decComboRefCount(this,this.GetTeamA());
            this.GetTeamA().GetPlayer(i).getCurrentComboCountFn_ = getCurrentComboCount(this,this.GetTeamA());
            this.GetTeamA().GetPlayer(i).InitSprite();
            this.GetTeamA().GetPlayer(i).ChangeDirection(true);
        }
        if(!!this.GetTeamA().GetPlayer(0))
            this.GetTeamA().GetPlayer(0).SetX(STAGE.START_X);

        /*init team 2*/
        for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
        {
            this.GetTeamB().GetPlayer(i).id_ = "t2p" + i;
            this.GetTeamB().GetPlayer(i).SetIndex(i);
            this.GetTeamB().GetPlayer(i).moveStageXFn_ = moveStageX(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).fixXFn_ = fixX(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).moveXFn_ = moveX(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).moveYFn_ = moveY(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).moveOtherPlayersToBackFn_ = moveToBack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).moveOtherPlayersToFrontFn_ = moveToFront(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).takeDamageFn_ = changeHealth(this);
            this.GetTeamB().GetPlayer(i).changeEnergyFn_ = changeEnergy(this);
            this.GetTeamB().GetPlayer(i).attackFn_ = attack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).projectileAttackFn_ = projectileAttack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).SetupInfo(2,"r");
            this.GetTeamB().GetPlayer(i).getHealthFn_ = getHealth(this);
            this.GetTeamB().GetPlayer(i).getEnergyFn_ = getEnergy(this);
            this.GetTeamB().GetPlayer(i).onStartAttackFn_ = startAttack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onEndAttackFn_ = endAttack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onStartAirAttackFn_ = startAirAttack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onEndAirAttackFn_ = endAirAttack(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onProjectileMovedFn_ = projectileMoved(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onProjectileGoneFn_ = projectileGone(this,this.GetTeamA().GetPlayers());
            this.GetTeamB().GetPlayer(i).onIncComboFn_ = incCombo(this,this.GetTeamB());
            this.GetTeamB().GetPlayer(i).onIncComboRefCountFn_ = incComboRefCount(this,this.GetTeamB());
            this.GetTeamB().GetPlayer(i).onDecComboRefCountFn_ = decComboRefCount(this,this.GetTeamB());
            this.GetTeamB().GetPlayer(i).getCurrentComboCountFn_ = getCurrentComboCount(this,this.GetTeamB());
            this.GetTeamB().GetPlayer(i).InitSprite();
        }
        if(!!this.GetTeamB().GetPlayer(0))
            this.GetTeamB().GetPlayer(0).SetX(STAGE.START_X);

        /*set the starting locations for each player*/
        for(var i = 1; i < this.GetTeamA().GetPlayers().length; ++i)
            this.GetTeamA().GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        for(var i = 1; i < this.GetTeamB().GetPlayers().length; ++i)
            this.GetTeamB().GetPlayer(i).SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

        this.GetStage().Reset();

        this.GetTeamA().GetHealthbar().Init();
        this.GetTeamA().GetEnergybar().Init();

        this.GetTeamB().GetHealthbar().Init();
        this.GetTeamB().GetEnergybar().Init();

        this.GetStage().PlayMusic();
    }
    /*Handles key state changes*/
    Match.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
    {
        if(this.GetAllowInput())
        {
            for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
                this.GetTeamA().GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
            for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
                this.GetTeamB().GetPlayer(i).OnKeyStateChanged(isDown,keyCode,frame);
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
            for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
                if(this.GetTeamA().GetPlayer(i).id_ != player.id_)
                    this.GetTeamA().GetPlayer(i).OnSuperMoveStarted();
            for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
                if(this.GetTeamB().GetPlayer(i).id_ != player.id_)
                    this.GetTeamB().GetPlayer(i).OnSuperMoveStarted();
        }
    }
    Match.prototype.OnSuperMoveCompleted = function(player)
    {
        if(this.IsSuperMoveActive())
        {
            this.SetBackgroundTransparent();
            for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
                if(this.GetTeamA().GetPlayer(i).id_ != player.id_)
                    this.GetTeamA().GetPlayer(i).OnSuperMoveCompleted();
            for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
                if(this.GetTeamB().GetPlayer(i).id_ != player.id_)
                    this.GetTeamB().GetPlayer(i).OnSuperMoveCompleted();
            this.SetSuperMoveActive(false);
        }
    }
    Match.prototype.PreFrameMove = function(frame)
    {
        for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
            this.GetTeamA().GetPlayer(i).OnPreFrameMove(frame);
        for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
            this.GetTeamB().GetPlayer(i).OnPreFrameMove(frame);
    }
    Match.prototype.RenderComplete = function(frame)
    {
        for(var i = 0; i < this.GetTeamA().GetPlayers().length; ++i)
            this.GetTeamA().GetPlayer(i).OnRenderComplete(frame);
        for(var i = 0; i < this.GetTeamB().GetPlayers().length; ++i)
            this.GetTeamB().GetPlayer(i).OnRenderComplete(frame);
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

        this.GetTeamA().FrameMove(frame,keyboardState,this.GetStage().x_, this.GetStage().y_);
        this.GetTeamB().FrameMove(frame,keyboardState,this.GetStage().x_, this.GetStage().y_);

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

        this.GetTeamA().Render(frame,this.GetStage().x_ - this.GetStage().lastX_);
        this.GetTeamB().Render(frame,this.GetStage().x_ - this.GetStage().lastX_);

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
        this.GetTeamA().Release();
        this.GetTeamB().Release();
    }


    Match.prototype.PreloadSounds = function()
    {
        soundManager_.Load("audio/misc/lp.zzz",3);
        soundManager_.Load("audio/misc/mp.zzz",3);
        soundManager_.Load("audio/misc/hp.zzz",3);
        soundManager_.Load("audio/misc/lk.zzz",3);
        soundManager_.Load("audio/misc/mk.zzz",3);
        soundManager_.Load("audio/misc/hk.zzz",3);

        soundManager_.Load("audio/misc/block.zzz",3);
        soundManager_.Load("audio/misc/block-projectile.zzz",3);

        soundManager_.Load("audio/misc/grapple.zzz",3);

        soundManager_.Load("audio/misc/hit-lp.zzz",3);
        soundManager_.Load("audio/misc/hit-mp.zzz",3);
        soundManager_.Load("audio/misc/hit-hp.zzz",3);
        soundManager_.Load("audio/misc/hit-lk.zzz",3);
        soundManager_.Load("audio/misc/hit-mk.zzz",3);
        soundManager_.Load("audio/misc/hit-hk.zzz",3);
        soundManager_.Load("audio/misc/hit-hp-3.zzz",3);


        soundManager_.Load("audio/misc/super-charge.zzz",3);

        soundManager_.Load("audio/misc/round.zzz",1);
        soundManager_.Load("audio/misc/1.zzz",1);
        soundManager_.Load("audio/misc/2.zzz",1);
        soundManager_.Load("audio/misc/3.zzz",1);
        soundManager_.Load("audio/misc/4.zzz",1);
        soundManager_.Load("audio/misc/5.zzz",1);
        soundManager_.Load("audio/misc/6.zzz",1);
        soundManager_.Load("audio/misc/7.zzz",1);
        soundManager_.Load("audio/misc/8.zzz",1);
        soundManager_.Load("audio/misc/9.zzz",1);
        soundManager_.Load("audio/misc/ko.zzz",1);
        soundManager_.Load("audio/misc/draw.zzz",1);
        soundManager_.Load("audio/misc/fight.zzz",1);
        soundManager_.Load("audio/misc/final.zzz",1);
        soundManager_.Load("audio/misc/you.zzz",1);
        soundManager_.Load("audio/misc/win.zzz",1);
        soundManager_.Load("audio/misc/lose.zzz",1);
        soundManager_.Load("audio/misc/perfect.zzz",1);
    }

    return new Match();
}
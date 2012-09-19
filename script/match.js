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
    var nbAirborne_ = 0;

    var Match = function()
    {
        this.Stage = new Stage();
        this.TeamA = CreateTeam(1);
        this.TeamB = CreateTeam(2);
        this.loadAssets();
        this.Stage.setup(stage);

        faceoff_ = CreateFaceoff(this);
    }
    Match.prototype.incAirborne = function() { ++nbAirborne_; }
    Match.prototype.getNbAirborne = function() { return nbAirborne_; }
    Match.prototype.decAirborne = function()
    {
        nbAirborne_ = Math.max(nbAirborne_ - 1, 0);
        if(!nbAirborne_)
            this.Stage.requestScrollY(false,0,true);
    }
    Match.prototype.getPhysics = function() { return physics_; }
    Match.prototype.getTeamA = function() { return this.TeamA; }
    Match.prototype.getTeamB = function() { return this.TeamB; }
    Match.prototype.getDefeatedTeam = function() { return defeatedTeam_; }
    Match.prototype.setDefeatedTeam = function(value) { defeatedTeam_ = value; }
    Match.prototype.isRoundOver = function() { return isRoundOver_; }
    Match.prototype.setRoundOver = function(value) { isRoundOver_ = value; }
    Match.prototype.getGotoNewRoundFrame = function() { return gotoNewRoundFrame_; }
    Match.prototype.setGotoNewRoundFrame = function(value) { gotoNewRoundFrame_ = value; }
    Match.prototype.getPlayerCount = function() { return playerCount_; }
    Match.prototype.setPlayerCount = function(value) { playerCount_ = value; }
    Match.prototype.getHitSystem = function() { return actionSystem_; }
    Match.prototype.isSuperMoveActive = function() { return isSuperMoveActive_; }
    Match.prototype.setSuperMoveActive = function(value) { isSuperMoveActive_ = value; }
    Match.prototype.getDimBackgroundElement = function() { return dimBackground_; }
    Match.prototype.getRound = function() { return round_; }
    Match.prototype.setRound = function(value) { round_ = value; }
    Match.prototype.getAllowInput = function() { return allowInput_; }
    Match.prototype.setAllowInput = function(value) { allowInput_ = value; }

    Match.prototype.getStage = function() { return this.Stage; }
    Match.prototype.resetKeys = function()
    {
        for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
            this.TeamA.getPlayer(i).clearInput();
        for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
            this.TeamB.getPlayer(i).clearInput();
    }
    Match.prototype.playerCount = function()
    {
        if(this.getPlayerCount())
            this.setPlayerCount(this.TeamA.getPlayers().length + this.TeamB.getPlayers().length);

        return this.getPlayerCount();
        
    }
    Match.prototype.getGame = function() { return game_; }
    Match.prototype.getCurrentFrame = function() { return game_.getCurrentFrame(); }

    Match.prototype.initText = function()
    {
        this.TeamA.initText();
        this.TeamB.initText();
    }


    /*Tells the result of the match*/
    Match.prototype.handleMatchOver = function(frame)
    {
        if(frame > CONSTANTS.MAX_FRAME)
        {
            announcer_.timeOver();
        }
    }
    /* Is the match over yet? */
    Match.prototype.isMatchOver = function(frame)
    {
        return frame > CONSTANTS.MAX_FRAME;
    }

    Match.prototype.showTeamInfo = function()
    {
    }
    /*Changes the health value for a team*/
    Match.prototype.changeHealth = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {this.TeamA.getHealthbar().change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.TeamB.getHealthbar().change(changeAmount); break; }
        };
    }
    /*Changes the energy value for a team*/
    Match.prototype.changeEnergy = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {this.TeamA.getEnergybar().change(changeAmount); break; }
            case CONSTANTS.TEAM2: {this.TeamB.getEnergybar().change(changeAmount); break; }
        };
    }
    /*Returns the health for a team*/
    Match.prototype.getHealth = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.TeamA.getHealthbar().getAmount();}
            case CONSTANTS.TEAM2: {return this.TeamB.getHealthbar().getAmount();}
        }
    }
    /*Returns the energy for a team*/
    Match.prototype.getEnergy = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return this.TeamA.getEnergybar().getAmount();}
            case CONSTANTS.TEAM2: {return this.TeamB.getEnergybar().getAmount();}
        }
    }
    /*returns the highest Y value*/
    Match.prototype.getHighestY = function()
    {
        var retVal = 0;
        for(var i = 0; i < this.TeamA.Players.length; ++i)
            retVal = this.TeamA.Players[i].Y > retVal ? this.TeamA.Players[i].Y : retVal;
        for(var i = 0; i < this.TeamB.Players.length; ++i)
            retVal = this.TeamB.Players[i].Y > retVal ? this.TeamB.Players[i].Y : retVal;
        return retVal;
    }
    /*Gets the current frame*/
    Match.prototype.getCurrentFrame = function()
    {
        return game_.getCurrentFrame();
    }
    /*A team has just been defeated*/
    Match.prototype.defeatTeam = function(team,attackDirection,loseIgnoreId)
    {
        announcer_.kO();
        this.releaseAllInput();

        this.setAllowInput(false);
        var frame = game_.getCurrentFrame();
        game_.setSpeed(CONSTANTS.SLOW_SPEED);
        this.setDefeatedTeam(team);
        switch(this.getDefeatedTeam())
        {
            case CONSTANTS.TEAM1:
            {
                for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
                    if(this.TeamA.getPlayer(i).Id != loseIgnoreId)
                        this.TeamA.getPlayer(i).forceLose(attackDirection);
                for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
                    this.TeamB.getPlayer(i).justWon(frame);
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
                    if(this.TeamB.getPlayer(i).Id != loseIgnoreId)
                        this.TeamB.getPlayer(i).forceLose(attackDirection);
                for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
                    this.TeamA.getPlayer(i).justWon(frame);
                break;
            }
        }
    }
    /*Should be called after the player who was defeated hits the ground*/
    Match.prototype.deadAnimationComplete = function(player,frame)
    {
        if(!this.isRoundOver())
        {
            this.setRoundOver(true);
            game_.setSpeed(CONSTANTS.NORMAL_SPEED);
            this.setGotoNewRoundFrame(frame);

            announcer_.endRound();
        }
    }
    /*Registers an action*/
    Match.prototype.registerAction = function(details)
    {
        this.getHitSystem().register(details);
    }
    /**/
    Match.prototype.releaseAllInput = function()
    {
        game_.resetKeys();
    }
    /*Restarts the match*/
    Match.prototype.reset = function()
    {
        if(this.getGotoNewRoundFrame() != CONSTANTS.NO_FRAME)
        {
            game_.showLoading(true);
            isPresented_ = false;
            faceoff_.reset();
            this.setAllowInput(false);
            this.setRound(this.getRound() + 1);
            game_.setSpeed(CONSTANTS.NORMAL_SPEED);
            this.setGotoNewRoundFrame(CONSTANTS.NO_FRAME);
            this.TeamA.setCursor(0);
            this.TeamB.setCursor(0);
            this.setSuperMoveActive(false);


            game_.resetFrame();

            this.TeamA.getEnergybar().change(0,0);
            this.TeamB.getEnergybar().change(0,0);

            if(!!this.TeamA.getPlayer(0))
                this.TeamA.getPlayer(0).setX(STAGE.START_X);
            if(!!this.TeamB.getPlayer(0))
                this.TeamB.getPlayer(0).setX(STAGE.START_X);

            /*set the starting locations for each player*/
            for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
            {
                this.TeamA.getPlayer(i).reset(true);
                this.TeamA.getPlayer(i).setDirection(-1);
                this.TeamA.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }
            for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
            {
                this.TeamB.getPlayer(i).reset(true);
                this.TeamB.getPlayer(i).setDirection(1);
                this.TeamB.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }

            this.setRoundOver(false);
            this.Stage.init();
            game_.releaseText();

            this.TeamA.getHealthbar().reset();
            this.TeamB.getHealthbar().reset();

        }
    }

    /**/
    Match.prototype.pause = function()
    {
        this.Stage.pause();
        this.TeamA.pause();
        this.TeamB.pause();
    }

    /**/
    Match.prototype.resume = function()
    {
        this.Stage.resume();
        this.TeamA.resume();
        this.TeamB.resume();
    }

    Match.prototype.playerIndex = 0;

    /*sets up the player to take part in the match*/
    Match.prototype.setupPlayer = function(player,team)
    {
        var moveStageX          = function(thisValue,otherTeam) { return function(amount,dontOverrideSign) { for(var i = 0; i < otherTeam.getPlayers().length;++i) {amount = thisValue.getStage().scrollX(amount,this,otherTeam.getPlayers()[i],thisValue,dontOverrideSign);}; return amount; } };
        /*var fixX                = function(thisValue,otherTeam) { return function(amount) {thisValue.getPhysics().fixX(amount,this,false,true);  return 0; } };*/
        var fixX                = function(thisValue,otherTeam) { return function(amount) {thisValue.getPhysics().moveOtherPlayers(this);  return 0; } };
        var moveX               = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.getStage().scrollX(amount,this,null,thisValue); thisValue.getPhysics().moveX(amount,this,false,true); return 0; } };
        var moveY               = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.getPhysics().moveY(amount,this); return 0; } };
        var moveToBack          = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.getPlayers().length;++i) {otherTeam.getPlayers()[i].moveToBack(true);} } }
        var moveToFront         = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.getPlayers().length;++i) {otherTeam.getPlayers()[i].moveToFront(true);} } }
        var projectileMoved     = function(thisValue,otherTeam) { return function(id,x,y) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayers()[i].setAllowBlockFromProjectile(thisValue.getGame().getCurrentFrame(),true,id,x,y); } } }
        var projectileGone      = function(thisValue,otherTeam) { return function(id)     { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayers()[i].setAllowBlockFromProjectile(thisValue.getGame().getCurrentFrame(),false,id); } } }
        var startAttack         = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayers()[i].setAllowBlock(id,thisValue.getGame().getCurrentFrame(),true,this.getMidX(),this.getMidY()); } } }
        var endAttack           = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { this.Flags.Combat.remove(COMBAT_FLAGS.CAN_BE_BLOCKED); otherTeam.getPlayers()[i].setAllowBlock(id,thisValue.getGame().getCurrentFrame(),false); } } }
        var startAirAttack      = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayers()[i].setAllowAirBlock(id,thisValue.getGame().getCurrentFrame(),true,this.getMidX(),this.getMidY()); } } }
        var endAirAttack        = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { this.Flags.Combat.remove(COMBAT_FLAGS.CAN_BE_AIR_BLOCKED); otherTeam.getPlayers()[i].setAllowAirBlock(id,thisValue.getGame().getCurrentFrame(),false); } } }
        var attack              = function(thisValue,otherTeam) { return function(hitDelayFactor, hitID, frame,points,flags,state,damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { thisValue.getPhysics().tryAttack(hitDelayFactor, hitID,frame,points,flags,state,this,otherTeam.getPlayers()[i],damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound); } } }
        var projectileAttack    = function(thisValue,otherTeam) { return function(frame,projectile) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { thisValue.getPhysics().tryProjectileAttack(frame,projectile,this,otherTeam.getPlayers()[i]); } } }
        var changeHealth        = function(thisValue)         { return function(amount) { thisValue.changeHealth(this.Team,amount); } }
        var getHealth           = function(thisValue)         { return function() { return thisValue.getHealth(this.Team); } }
        var changeEnergy        = function(thisValue)         { return function(amount) { thisValue.changeEnergy(this.Team,amount); } }
        var getEnergy           = function(thisValue)         { return function() { return thisValue.getEnergy(this.Team); } }
        var incCombo            = function(thisValue,team)    { return function() { return team.incCombo(); } }
        var incComboRefCount    = function(thisValue,team)    { return function() { return team.incComboRefCount(); } }
        var decComboRefCount    = function(thisValue,team)    { return function() { return team.decComboRefCount(); } }
        var getCurrentComboCount= function(thisValue,team)    { return function() { return team.getCurrentCombo(); } }

        var otherTeam = null;
        var myTeam = null;
        var dir = "";

        switch(team)
        {
            case 1: {dir = "l"; myTeam = this.TeamA; otherTeam = this.TeamB; break;}
            case 2: {dir = "r"; myTeam = this.TeamB; otherTeam = this.TeamA; break;}
        }

        var index = Match.prototype.playerIndex++;

        player.Id = "t" + team + "p" + index;
        player.moveStageXFn = moveStageX(this,otherTeam);
        player.fixXFn = fixX(this,otherTeam);
        player.moveXFn = moveX(this,otherTeam);
        player.moveYFn = moveY(this,otherTeam);
        player.moveOtherPlayersToBackFn = moveToBack(this,otherTeam);
        player.moveOtherPlayersToFrontFn = moveToFront(this,otherTeam);
        player.takeDamageFn = changeHealth(this);
        player.changeEnergyFn = changeEnergy(this);
        player.attackFn = attack(this,otherTeam);
        player.projectileAttackFn = projectileAttack(this,otherTeam);
        player.setupInfo(team,dir);
        player.getHealthFn = getHealth(this);
        player.getEnergyFn = getEnergy(this);
        player.onStartAttackFn = startAttack(this,otherTeam);
        player.onEndAttackFn = endAttack(this,otherTeam);
        player.onStartAirAttackFn = startAirAttack(this,otherTeam);
        player.onEndAirAttackFn = endAirAttack(this,otherTeam);
        player.onProjectileMovedFn = projectileMoved(this,otherTeam);
        player.onProjectileGoneFn = projectileGone(this,otherTeam);
        player.onIncComboFn = incCombo(this,myTeam);
        player.onIncComboRefCountFn = incComboRefCount(this,myTeam);
        player.onDecComboRefCountFn = decComboRefCount(this,myTeam);
        player.getCurrentComboCountFn = getCurrentComboCount(this,myTeam);
        player.initSprite();
        player.setY(this.Stage.getGroundY());
        if(team == 1)
            player.changeDirection(true);

    }

    /*Initializes a new match*/
    Match.prototype.start = function(ignoreMusic)
    {
        this.Stage.start();
        faceoff_.init();
        announcer_.init();

        this.TeamA.setPlayers(team1);
        this.TeamB.setPlayers(team2);
        this.initText();
        /*init team 1*/
        for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
        {
            this.setupPlayer(this.TeamA.getPlayers()[i],CONSTANTS.TEAM1);
        }
        if(!!this.TeamA.getPlayer(0))
        {
            faceoff_.setTeamA(this.TeamA.getPlayer(0).Name);
            this.TeamA.getPlayer(0).setX(STAGE.START_X);
        }

        /*init team 2*/
        for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
        {
            this.setupPlayer(this.TeamB.getPlayers()[i],CONSTANTS.TEAM2);
        }
        if(!!this.TeamB.getPlayer(0))
        {
            faceoff_.setTeamB(this.TeamB.getPlayer(0).Name);
            this.TeamB.getPlayer(0).setX(STAGE.START_X);
        }

        /*set the starting locations for each player*/
        for(var i = 1, length = this.TeamA.getPlayers().length; i < length; ++i)
            this.TeamA.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        for(var i = 1, length = this.TeamB.getPlayers().length; i < length; ++i)
            this.TeamB.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

        this.Stage.init();
        this.TeamA.init();
        this.TeamB.init();
    }
    /*Handles key state changes*/
    Match.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
    {
        //if(this.getAllowInput())
        //{
            for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
                this.TeamA.getPlayer(i).onKeyStateChanged(isDown,keyCode,frame);
            for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
                this.TeamB.getPlayer(i).onKeyStateChanged(isDown,keyCode,frame);
        //}
    }
    /*Dims the background when a player is starting a super move*/
    Match.prototype.setBackgroundTransparent = function(player)
    {
        if(!!player)
        {
            this.getDimBackgroundElement().style.display = "";
        }
        else
        {
            this.getDimBackgroundElement().style.display = "none";
        }
    }
    Match.prototype.onSuperMoveStarted = function(player)
    {
        if(!this.isSuperMoveActive())
        {
            this.setBackgroundTransparent(player);
            this.setSuperMoveActive(true);
            for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
                if(this.TeamA.getPlayer(i).Id != player.Id)
                    this.TeamA.getPlayer(i).onSuperMoveStarted();
            for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
                if(this.TeamB.getPlayer(i).Id != player.Id)
                    this.TeamB.getPlayer(i).onSuperMoveStarted();
        }
    }
    Match.prototype.onSuperMoveCompleted = function(player)
    {
        if(this.isSuperMoveActive())
        {
            this.setBackgroundTransparent();
            for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
                if(this.TeamA.getPlayer(i).Id != player.Id)
                    this.TeamA.getPlayer(i).onSuperMoveCompleted();
            for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
                if(this.TeamB.getPlayer(i).Id != player.Id)
                    this.TeamB.getPlayer(i).onSuperMoveCompleted();
            this.setSuperMoveActive(false);
        }
    }
    Match.prototype.preFrameMove = function(frame)
    {
        for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
            this.TeamA.getPlayer(i).onPreFrameMove(frame);
        for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
            this.TeamB.getPlayer(i).onPreFrameMove(frame);
    }
    Match.prototype.renderComplete = function(frame)
    {
        for(var i = 0; i < this.TeamA.getPlayers().length; ++i)
            this.TeamA.getPlayer(i).onRenderComplete(frame);
        for(var i = 0; i < this.TeamB.getPlayers().length; ++i)
            this.TeamB.getPlayer(i).onRenderComplete(frame);
    }

    /**/
    Match.prototype.startNewRound = function(frame)
    {
        announcer_.startRound();
    }

    /**/
    Match.prototype.endNewRound = function(frame)
    {
        this.setAllowInput(true);
    }

    /**/
    Match.prototype.present = function()
    {
        isPresented_ = true;
        game_.showLoading(false);
    }


    Match.prototype.handleRound1 = function(frame)
    {
        faceoff_.handleRound1(frame);
        if(!startedTheme_ && (frame > CONSTANTS.START_THEME_DELAY))
        {
            this.Stage.playMusic();
            startedTheme_ = true;
        }
        if(!teamsVisible_ && (frame > CONSTANTS.SHOW_TEAMS_DELAY))
        {
            faceoff_.hide(frame);
            this.TeamA.show();
            this.TeamB.show();
            teamsVisible_ = true;
        }
        if((gotoNewRoundFrame_ != CONSTANTS.NO_FRAME) && (frame > (gotoNewRoundFrame_ + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
            this.reset();
    }

    Match.prototype.handleOtherRounds = function(frame)
    {
        if((gotoNewRoundFrame_ != CONSTANTS.NO_FRAME) && (frame > (gotoNewRoundFrame_ + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
        {
            this.reset();
            frame = game_.getCurrentFrame();
        }
        faceoff_.handleOtherRounds(frame);
    }

    /*calculations to be performed here*/
    Match.prototype.frameMove = function(frame,keyboardState)
    {
        this.Stage.frameMove(frame);
        this.getHitSystem().frameMove(frame);

        this.TeamA.frameMove(frame,keyboardState,this.Stage.X, this.Stage.getGroundY());
        this.TeamB.frameMove(frame,keyboardState,this.Stage.X, this.Stage.getGroundY());

        if(round_ != 1)
            this.handleOtherRounds(frame);
        else
        {
            this.handleRound1(frame);
            faceoff_.frameMove(frame);
        }
    }

    /*pre-render calculations to be performed here*/
    Match.prototype.preRender = function(frame)
    {
        this.Stage.preRender(frame);
        this.TeamA.preRender(frame);
        this.TeamB.preRender(frame);
    }

    /*All rendering and CSS manipulation to be done here*/
    Match.prototype.render = function(frame)
    {

        this.TeamA.render(frame,this.Stage.getDeltaX(),this.Stage.getDeltaY());
        this.TeamB.render(frame,this.Stage.getDeltaX(),this.Stage.getDeltaY());

        this.Stage.render();

        if(!isPresented_ && (frame > CONSTANTS.PRESENT_DELAY))
            this.present();
        if(round_ == 1)
            faceoff_.render(frame);
    }

    Match.prototype.kill = function()
    {
        this.release();
    }

    /*Remove elements from the DOM and remove any custom CSS*/
    Match.prototype.release = function()
    {
        this.Stage.release();
        this.TeamA.release();
        this.TeamB.release();
        faceoff_.release();
    }


    Match.prototype.loadAssets = function()
    {
        stuffLoader_.queue("match.js",RESOURCE_TYPES.BASE64AUDIO);
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
            this.FaceoffElement = null;
            this.TeamAFaceoffElement = null;
            this.TeamBFaceoffElement = null;
            this.TeamANameElement = null;
            this.TeamBNameElement = null;
            this.VsElement = null;

            this.MaxAngle = 360;
            this.MaxScale = 1;

            this.Angle = 0;
            this.Scale = 0;

            var nbFrames = 20;

            this.rotateUpFn = (function(max,inc) { return function(t,value) { return Math.min(value + (max/nbFrames), max); } })(this.MaxAngle);
            this.rotateDownFn = (function(max,inc) { return function(t,value) { return Math.max(value + (max/nbFrames), 0); } })(this.MaxAngle);
            this.scaleUpFn = (function(max,inc) { return function(t,value) { return Math.min(value + (max/nbFrames), max); } })(this.MaxScale);
            this.scaleDownFn = (function(max,inc) { return function(t,value) { return Math.max(value - (max/nbFrames), 0); } })(this.MaxScale);
        }

        Faceoff.prototype.setTeamA = function(name)
        {
            spriteLookup_.set(this.TeamAFaceoffElement,"images/misc/misc/p2-select-" + name + ".png");
            spriteLookup_.set(this.TeamANameElement,"images/misc/font3/name-" + name + ".png",false,true);
        }
        Faceoff.prototype.setTeamB = function(name)
        {
            spriteLookup_.set(this.TeamBFaceoffElement,"images/misc/misc/p2-select-" + name + ".png");
            spriteLookup_.set(this.TeamBNameElement,"images/misc/font3/name-" + name + ".png",false,true);
        }

        Faceoff.prototype.init = function()
        {
            this.FaceoffElement = window.document.createElement("div");
            this.FaceoffElement.style.display = "none";
            this.FaceoffElement.className = "faceoff";

            this.TeamAFaceoffElement = window.document.createElement("div");
            this.TeamAFaceoffElement.className = "team1-faceoff";

            this.TeamBFaceoffElement = window.document.createElement("div");
            this.TeamBFaceoffElement.className = "team2-faceoff";

            this.FaceoffElement.appendChild(this.TeamAFaceoffElement);
            this.FaceoffElement.appendChild(this.TeamBFaceoffElement);

            this.TeamANameElement = window.document.createElement("div");
            this.TeamANameElement.className = "faceoff-name flipped";
            this.TeamAFaceoffElement.appendChild(this.TeamANameElement);

            this.TeamBNameElement = window.document.createElement("div");
            this.TeamBNameElement.className = "faceoff-name";
            this.TeamBFaceoffElement.appendChild(this.TeamBNameElement);

            this.VsElement = window.document.createElement("div");
            this.VsElement.className = "vs";
            spriteLookup_.set(this.VsElement,"images/misc/misc/vs-0.png");
            this.FaceoffElement.appendChild(this.VsElement);

            this.reset();

            /*
            imageLookup_.getBgB64(this.TeamAFaceoffElement,"images/misc/head-sprites.png");
            imageLookup_.getBgB64(this.TeamBFaceoffElement,"images/misc/head-sprites.png");
            imageLookup_.getBgB64(this.TeamANameElement,"images/misc/name-sprites.png");
            imageLookup_.getBgB64(this.TeamBNameElement,"images/misc/name-sprites.png");
            imageLookup_.getBgB64(this.VsElement,"images/misc/head-sprites.png");
            */

            window.document.getElementById("pnlStage").appendChild(this.FaceoffElement);
        }

        Faceoff.prototype.isActive = function()
        {
            return !startedRound_;
        }

        Faceoff.prototype.reset = function()
        {
            showedFaceoff_ = !!__debugMode;
            announcedNewRound_ = !!__debugMode;
            startedRound_ = false;
            this.Scale = 0;
            this.Angle = 0;

            this.rotateScale();

            this.TeamANameElement.style.display = "none";
            this.TeamBNameElement.style.display = "none";
            this.VsElement.style.display = "none";
            areNamesHidden_ = true;
        }

        Faceoff.prototype.pause = function()
        {
            soundManager_.pause(faceoffSound_);
        }

        Faceoff.prototype.resume = function()
        {
            if(!startedRound_)
                soundManager_.resume(faceoffSound_);
        }

        Faceoff.prototype.release = function()
        {
            utils_.removeFromDOM(this.FaceoffElement);
        }

        Faceoff.prototype.show = function(frame)
        {
            showedFaceoff_ = true;
            soundManager_.queueSound(faceoffSound_);
            this.FaceoffElement.style.display = "";
        }


        Faceoff.prototype.hide = function(frame)
        {
            this.FaceoffElement.style.display = "none";
        }

        Faceoff.prototype.startNewRound = function(frame)
        {
            announcedNewRound_ = true;
            match_.startNewRound(frame);
        }

        Faceoff.prototype.endNewRound = function(frame)
        {
            startedRound_ = true;
            match_.endNewRound(frame);
        }

        Faceoff.prototype.handleRound1 = function(frame)
        {
            if(!showedFaceoff_ && (frame > CONSTANTS.SHOW_FACEOFF_DELAY))
                this.show(frame);
            if(!announcedNewRound_ && (frame > CONSTANTS.ANNOUNCE_FIRST_ROUND_DELAY))
                this.startNewRound(frame);
            if(!startedRound_ && (frame > CONSTANTS.START_FIRST_ROUND_DELAY))
                this.endNewRound(frame);
        }

        Faceoff.prototype.handleOtherRounds = function(frame)
        {
            if(!announcedNewRound_ && (frame > CONSTANTS.ANNOUNCE_NEW_ROUND_DELAY))
                this.startNewRound(frame);
            if(!startedRound_ && (frame > CONSTANTS.START_NEW_ROUND_DELAY))
                this.endNewRound(frame);
        }

        Faceoff.prototype.frameMove = function(frame)
        {
            if((frame > CONSTANTS.SHOW_FACEOFF_PICS_DELAY) && (frame < CONSTANTS.REMOVE_FACEOFF_PICS_DELAY))
            {
                if(this.Scale < this.MaxScale)
                {
                    this.Scale = this.scaleUpFn(frame, this.Scale);
                    this.Angle = this.rotateUpFn(frame, this.Angle);
                    this.rotateScale();
                }
                else if(!!areNamesHidden_)
                {
                    this.TeamANameElement.style.display = "";
                    this.TeamBNameElement.style.display = "";
                    this.VsElement.style.display = "";
                    areNamesHidden_ = false;
                }
            }
            else if(frame > CONSTANTS.REMOVE_FACEOFF_PICS_DELAY)
            {
                if(!areNamesHidden_)
                {                
                    this.TeamANameElement.style.display = "none";
                    this.TeamBNameElement.style.display = "none";
                    this.VsElement.style.display = "none";
                    areNamesHidden_ = true;
                }
                if(this.Scale > 0)
                {
                    this.Scale = this.scaleDownFn(frame, this.Scale);
                    this.Angle = this.rotateDownFn(frame, this.Angle);
                    this.rotateScale();
                }
            }
        }

        Faceoff.prototype.rotateScale = function()
        {
            this.TeamAFaceoffElement.style["-webkit-transform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
            this.TeamAFaceoffElement.style["-moz-transform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
            this.TeamAFaceoffElement.style["MozTransform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
            this.TeamAFaceoffElement.style["-o-transform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotate(" + this.Angle + "deg)";
            this.TeamAFaceoffElement.style["OTransform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotate(" + this.Angle + "deg)";
            this.TeamAFaceoffElement.style["-ms-transform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";

            this.TeamBFaceoffElement.style["-webkit-transform"] = "scale(" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
            this.TeamBFaceoffElement.style["-moz-transform"] = "scale(" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
            this.TeamBFaceoffElement.style["MozTransform"] = "scale(" + this.Scale + "," + this.Scale + ") rotate(" + this.Angle + "deg)";
            this.TeamBFaceoffElement.style["OTransform"] = "scale(" + this.Scale + "," + this.Scale + ") rotate(" + this.Angle + "deg)";
            this.TeamBFaceoffElement.style["-ms-transform"] = "scale(-" + this.Scale + "," + this.Scale + ") rotateZ(" + this.Angle + "deg)";
        }

        Faceoff.prototype.render = function(frame)
        {
        }

        return new Faceoff();
    }

    return new Match();
}


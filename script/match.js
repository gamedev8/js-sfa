﻿function _c2(a,b) { return String.prototype.concat(a,b); }
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
    var insertCoinElement_ = null;
    var pressStartElement_ = null;
    var isShowingMainInsertCoin_ = false;
    var hideInsertCoin_ = false;
    var mustUpdate_ = true;
    var faceoff_ = null;
    var parent_ = window.document.getElementById("pnlStage");
    var teamA_ = [];
    var teamB_ = [];
    var stage_ = null;
    var forceQuit_ = false;
    var forceQuitReason_ = 0;
    var isAIMatch_ = false;

    var nbAirborne_ = 0;
    game_.resetFrame();

    var Match = function()
    {
        stage_ = new Stage();
        teamA_ = CreateTeam(1);
        teamB_ = CreateTeam(2);
        this.loadAssets();
        stage_.setup(stage);

        faceoff_ = CreateFaceoff(this);
    }
    Match.prototype.checkAIMatch = function()
    {
        isAIMatch_ = 
        (teamB_.getPlayers().length == 0
        || teamA_.getPlayers().every(
            function(player) { return player.Ai.isRunning(); }))
        && (teamB_.getPlayers().length == 0
        || teamB_.getPlayers().every(
            function(player) { return player.Ai.isRunning(); }));

    }
    Match.prototype.forceQuit = function(reason) { forceQuit_ = true; forceQuitReason_ = reason; }
    Match.prototype.mustQuit = function() { return forceQuit_; }
    Match.prototype.getQuitReason = function() { return forceQuitReason_; }
    Match.prototype.incAirborne = function() { ++nbAirborne_; }
    Match.prototype.getNbAirborne = function() { return nbAirborne_; }
    Match.prototype.decAirborne = function()
    {
        nbAirborne_ = Math.max(nbAirborne_ - 1, 0);
        if(!nbAirborne_)
            stage_.requestScrollY(false,0,true);
    }
    Match.prototype.getStage = function() { return stage_; }
    Match.prototype.getPhysics = function() { return physics_; }
    Match.prototype.getTeamA = function() { return teamA_; }
    Match.prototype.getTeamB = function() { return teamB_; }
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
    Match.prototype.setSuperMoveActive = function(value) { isSuperMoveActive_ = value; if(!!value) {actionSystem_.pause();} else {actionSystem_.resume();}}
    Match.prototype.getDimBackgroundElement = function() { return dimBackground_; }
    Match.prototype.getRound = function() { return round_; }
    Match.prototype.setRound = function(value) { round_ = value; }
    Match.prototype.getAllowInput = function() { return allowInput_; }
    Match.prototype.setAllowInput = function(value) { allowInput_ = value; }

    Match.prototype.getStage = function() { return stage_; }
    Match.prototype.resetKeys = function()
    {
        for(var i = 0; i < teamA_.getPlayers().length; ++i)
            teamA_.getPlayer(i).clearInput();
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
            teamB_.getPlayer(i).clearInput();
    }
    Match.prototype.playerCount = function()
    {
        if(this.getPlayerCount())
            this.setPlayerCount(teamA_.getPlayers().length + teamB_.getPlayers().length);

        return this.getPlayerCount();
        
    }
    Match.prototype.getGame = function() { return game_; }
    Match.prototype.getCurrentFrame = function() { return game_.getCurrentFrame(); }

    Match.prototype.initText = function()
    {
        teamA_.initText();
        teamB_.initText();
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
            case CONSTANTS.TEAM1: {teamA_.getHealthbar().change(changeAmount); break; }
            case CONSTANTS.TEAM2: {teamB_.getHealthbar().change(changeAmount); break; }
        };
    }
    /*Changes the energy value for a team*/
    Match.prototype.changeEnergy = function(team, changeAmount)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {teamA_.getEnergybar().change(changeAmount); break; }
            case CONSTANTS.TEAM2: {teamB_.getEnergybar().change(changeAmount); break; }
        };
    }
    /*Returns the health for a team*/
    Match.prototype.getHealth = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return teamA_.getHealthbar().getAmount();}
            case CONSTANTS.TEAM2: {return teamB_.getHealthbar().getAmount();}
        }
    }
    /*Returns the energy for a team*/
    Match.prototype.getEnergy = function(team)
    {
        switch(team)
        {
            case CONSTANTS.TEAM1: {return teamA_.getEnergybar().getAmount();}
            case CONSTANTS.TEAM2: {return teamB_.getEnergybar().getAmount();}
        }
    }
    /*returns the highest Y value*/
    Match.prototype.getHighestY = function()
    {
        var retVal = 0;
        for(var i = 0; i < teamA_.getPlayers().length; ++i)
            retVal = teamA_.getPlayer(i).Y > retVal ? teamA_.getPlayer(i).Y : retVal;
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
            retVal = teamB_.getPlayer(i).Y > retVal ? teamB_.getPlayer(i).Y : retVal;
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
                for(var i = 0; i < teamA_.getPlayers().length; ++i)
                    if(teamA_.getPlayer(i).Id != loseIgnoreId)
                        teamA_.getPlayer(i).forceLose(attackDirection);
                for(var i = 0; i < teamB_.getPlayers().length; ++i)
                    teamB_.getPlayer(i).justWon(frame);
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < teamB_.getPlayers().length; ++i)
                    if(teamB_.getPlayer(i).Id != loseIgnoreId)
                        teamB_.getPlayer(i).forceLose(attackDirection);
                for(var i = 0; i < teamA_.getPlayers().length; ++i)
                    teamA_.getPlayer(i).justWon(frame);
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

            var t1Dead = teamA_.getHealthbar().getAmount() == 0;
            var t2Dead = teamB_.getHealthbar().getAmount() == 0;

            if(t1Dead && t2Dead)
            {
                teamA_.onDrawRound();
                teamB_.onDrawRound();
            }
            else if(t1Dead)
            {
                teamA_.onLostRound();
                teamB_.onWonRound();
            }
            else if(t2Dead)
            {
                teamA_.onWonRound();
                teamB_.onLostRound();
            }

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
            //check to see if the match is over
            if(teamA_.getWins() == game_.getMaxWinsPerMatch())
            {
                teamA_.advanceStoryMode();
                teamB_.disableStoryMode();
                
                if(!teamA_.getIsAI())
                    this.forceQuit(QUIT_MATCH.GOTO_STORYMODE);
                else
                    this.forceQuit(QUIT_MATCH.GOTO_INSERTCOIN)

                return;
            }
            else if(teamB_.getWins() == game_.getMaxWinsPerMatch())
            {
                teamA_.disableStoryMode();
                teamB_.advanceStoryMode();

                if(!teamB_.getIsAI())
                    this.forceQuit(QUIT_MATCH.GOTO_STORYMODE);
                else
                    this.forceQuit(QUIT_MATCH.GOTO_INSERTCOIN)

                return;
            }

            game_.showLoading(true);
            isPresented_ = false;
            faceoff_.reset();
            this.setAllowInput(false);
            this.setRound(this.getRound() + 1);
            game_.setSpeed(CONSTANTS.NORMAL_SPEED);
            this.setGotoNewRoundFrame(CONSTANTS.NO_FRAME);
            teamA_.setCursor(0);
            teamB_.setCursor(0);
            this.setSuperMoveActive(false);
            nbAirborne_ = 0;


            game_.resetFrame();

            teamA_.getEnergybar().change(0,0);
            teamB_.getEnergybar().change(0,0);

            if(!!teamA_.getPlayer(0))
                teamA_.getPlayer(0).setX(STAGE.START_X);
            if(!!teamB_.getPlayer(0))
                teamB_.getPlayer(0).setX(STAGE.START_X);

            /*set the starting locations for each player*/
            for(var i = 0; i < teamA_.getPlayers().length; ++i)
            {
                teamA_.getPlayer(i).reset(true);
                teamA_.getPlayer(i).setDirection(-1);
                teamA_.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }
            for(var i = 0; i < teamB_.getPlayers().length; ++i)
            {
                teamB_.getPlayer(i).reset(true);
                teamB_.getPlayer(i).setDirection(1);
                teamB_.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
            }

            this.setRoundOver(false);
            stage_.init();
            //game_.releaseText();

            teamA_.getHealthbar().reset();
            teamB_.getHealthbar().reset();

        }
    }

    /**/
    Match.prototype.pause = function()
    {
        stage_.pause();
        teamA_.pause();
        teamB_.pause();
    }

    /**/
    Match.prototype.resume = function()
    {
        stage_.resume();
        teamA_.resume();
        teamB_.resume();
    }

    Match.prototype.playerIndex = 0;

    /*sets up the player to take part in the match*/
    Match.prototype.setupPlayer = function(player,team)
    {
        var moveStageX           = function(thisValue,otherTeam) { return function(amount,dontOverrideSign) { for(var i = 0; i < otherTeam.getPlayers().length;++i) {amount = thisValue.getStage().scrollX(amount,this,otherTeam.getPlayer(i),thisValue,dontOverrideSign);}; return amount; } };
        /*var fixX               = function(thisValue,otherTeam) { return function(amount) {thisValue.getPhysics().fixX(amount,this,false,true);  return 0; } };*/
        var fixX                 = function(thisValue,otherTeam) { return function(amount) {thisValue.getPhysics().moveOtherPlayers(this);  return 0; } };
        var moveX                = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.getStage().scrollX(amount,this,null,thisValue); thisValue.getPhysics().moveX(amount,this,false,true); return 0; } };
        var moveY                = function(thisValue,otherTeam) { return function(amount) {amount = thisValue.getPhysics().moveY(amount,this); return 0; } };
        var moveToBack           = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.getPlayers().length;++i) {otherTeam.getPlayer(i).moveToBack(true);} } }
        var moveToFront          = function(thisValue,otherTeam) { return function() { for(var i = 0; i < otherTeam.getPlayers().length;++i) {otherTeam.getPlayer(i).moveToFront(true);} } }
        var attackPending        = function(thisValue,otherTeam) { return function(frame,x,y,isSuperMove) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyAttackPending(frame,x,y,this,isSuperMove); } } }
        var projectilePending    = function(thisValue,otherTeam) { return function(frame,x,y,isSuperMove) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyProjectilePending(frame,x,y,this,isSuperMove); } } }
        var projectileMoved      = function(thisValue,otherTeam) { return function(frame,id,x,y,projectile,isSuperMove) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyProjectileMoved(frame,id,x,y,projectile); otherTeam.getPlayer(i).setAllowBlockFromProjectile(thisValue.getGame().getCurrentFrame(),true,id,x,y); } } }
        var projectileGone       = function(thisValue,otherTeam) { return function(frame,id)     { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyProjectileGone(frame,id); otherTeam.getPlayer(i).setAllowBlockFromProjectile(thisValue.getGame().getCurrentFrame(),false,id); } } }
        var startAttack          = function(thisValue,otherTeam) { return function(id,hitPoints) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).allowBlock(id,thisValue.getGame().getCurrentFrame(),true,this.getMidX(),this.getMidY(),hitPoints,this); } } }
        var endAttack            = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { this.Flags.Combat.remove(COMBAT_FLAGS.CAN_BE_BLOCKED); otherTeam.getPlayer(i).removeBlock(id,thisValue.getGame().getCurrentFrame(),false,undefined,undefined,undefined,this); } } }
        var startAirAttack       = function(thisValue,otherTeam) { return function(id,hitPoints) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).allowAirBlock(id,thisValue.getGame().getCurrentFrame(),true,this.getMidX(),this.getMidY(),hitPoints); } } }
        var endAirAttack         = function(thisValue,otherTeam) { return function(id) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { this.Flags.Combat.remove(COMBAT_FLAGS.CAN_BE_AIR_BLOCKED); otherTeam.getPlayer(i).removeAirBlock(id,thisValue.getGame().getCurrentFrame(),false); } } }
        var attack               = function(thisValue,otherTeam) { return function(hitStop,hitID,attackID,maxNbHits,frame,points,flags,state,damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound,nbFreeze,otherParams) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { thisValue.getPhysics().tryAttack(hitStop,hitID,attackID,maxNbHits,frame,points,flags,state,this,otherTeam.getPlayer(i),damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound,nbFreeze,otherParams); } } }
        var projectileAttack     = function(thisValue,otherTeam) { return function(frame,projectile) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { thisValue.getPhysics().tryProjectileAttack(frame,projectile,this,otherTeam.getPlayer(i)); } } }
        var changeHealth         = function(thisValue)           { return function(amount) { thisValue.changeHealth(this.Team,amount); } }
        var getHealth            = function(thisValue)           { return function() { return thisValue.getHealth(this.Team); } }
        var changeEnergy         = function(thisValue)           { return function(amount) { thisValue.changeEnergy(this.Team,amount); } }
        var getEnergy            = function(thisValue)           { return function() { return thisValue.getEnergy(this.Team); } }
        var incCombo             = function(thisValue,team)      { return function() { return team.incCombo(); } }
        var incComboRefCount     = function(thisValue,team)      { return function() { return team.incComboRefCount(); } }
        var decComboRefCount     = function(thisValue,team)      { return function() { return team.decComboRefCount(); } }
        var getCurrentComboCount = function(thisValue,team)      { return function() { return team.getCurrentCombo(); } }

        var onStartAttackEnemies   = function(thisValue,otherTeam) { return function(frame) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyStartAttack(frame,this); } } }
        var onContinueAttackEnemies= function(thisValue,otherTeam) { return function(frame,hitPoints) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyContinueAttack(frame,this,hitPoints); } } }
        var onVulnerable           = function(thisValue,otherTeam) { return function(frame) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyVulerable(frame,this); } } }
        var onEndAttackEnemies     = function(thisValue,otherTeam) { return function(frame) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyEndAttack(frame,this); } } }
        var onDizzy                = function(thisValue,otherTeam) { return function(frame) { for(var i = 0; i < otherTeam.getPlayers().length;++i) { otherTeam.getPlayer(i).onEnemyDizzy(frame,this); } } }

        var otherTeam = null;
        var myTeam = null;
        var dir = "";

        switch(team)
        {
            case 1: {dir = "l"; myTeam = teamA_; otherTeam = teamB_; break;}
            case 2: {dir = "r"; myTeam = teamB_; otherTeam = teamA_; break;}
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

        player.onStartAttackEnemiesFn = onStartAttackEnemies(this,otherTeam);
        player.onContinueAttackEnemiesFn = onContinueAttackEnemies(this,otherTeam);
        player.onVulnerableFn = onVulnerable(this,otherTeam);
        player.onEndAttackEnemiesFn = onEndAttackEnemies(this,otherTeam);
        player.onDizzyFn = onDizzy(this,otherTeam);

        player.onStartAttackFn = startAttack(this,otherTeam);
        player.onEndAttackFn = endAttack(this,otherTeam);
        player.onStartAirAttackFn = startAirAttack(this,otherTeam);
        player.onEndAirAttackFn = endAirAttack(this,otherTeam);
        player.onAttackPendingFn = attackPending(this,otherTeam);
        player.onProjectilePendingFn = projectilePending(this,otherTeam);
        player.onProjectileMovedFn = projectileMoved(this,otherTeam);
        player.onProjectileGoneFn = projectileGone(this,otherTeam);
        player.onIncComboFn = incCombo(this,myTeam);
        player.onIncComboRefCountFn = incComboRefCount(this,myTeam);
        player.onDecComboRefCountFn = decComboRefCount(this,myTeam);
        player.getCurrentComboCountFn = getCurrentComboCount(this,myTeam);
        player.initSprite();
        player.setY(stage_.getGroundY());
        if(team == 1)
            player.changeDirection(true);

    }

    /*Initializes a new match*/
    Match.prototype.start = function(ignoreMusic)
    {
        forceQuit_ = false;
        stage_.start();
        faceoff_.init();
        announcer_.init();

        teamA_.setPlayers(team1);
        teamB_.setPlayers(team2);
        this.initText();
        /*init team 1*/
        for(var i = 0; i < teamA_.getPlayers().length; ++i)
        {
            this.setupPlayer(teamA_.getPlayer(i),CONSTANTS.TEAM1);
            teamA_.getPlayer(0).setX(STAGE.START_X);
        }
        if(!!teamA_.getPlayer(0))
        {
            faceoff_.setTeamA(teamA_.getPlayer(0).Name);
        }

        /*init team 2*/
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
        {
            this.setupPlayer(teamB_.getPlayer(i),CONSTANTS.TEAM2);
        }
        if(!!teamB_.getPlayer(0))
        {
            faceoff_.setTeamB(teamB_.getPlayer(0).Name);
            teamB_.getPlayer(0).setX(STAGE.START_X);
        }

        /*set the starting locations for each player*/
        for(var i = 1, length = teamA_.getPlayers().length; i < length; ++i)
            teamA_.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        for(var i = 1, length = teamB_.getPlayers().length; i < length; ++i)
            teamB_.getPlayer(i).setX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

        stage_.init();
        teamA_.init();
        teamB_.init();
        this.checkAIMatch();
        if(isAIMatch_)
            this.showMainInsertCoin();
    }
    /*Handles key state changes*/
    Match.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
    {
        if(game_.isPlayingVHS())
            game_.stopPlaying();
        //if(!!isAIMatch_ && !game_.isPaused())
        //{
        //    forceQuit_ = true;
        //    return;
        //}

        for(var i = 0; i < teamA_.getPlayers().length; ++i)
            teamA_.getPlayer(i).onKeyStateChanged(isDown,keyCode,frame);
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
            teamB_.getPlayer(i).onKeyStateChanged(isDown,keyCode,frame);
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
            for(var i = 0; i < teamA_.getPlayers().length; ++i)
                if(teamA_.getPlayer(i).Id != player.Id)
                    teamA_.getPlayer(i).onSuperMoveStarted();
            for(var i = 0; i < teamB_.getPlayers().length; ++i)
                if(teamB_.getPlayer(i).Id != player.Id)
                    teamB_.getPlayer(i).onSuperMoveStarted();
        }
    }
    Match.prototype.onSuperMoveCompleted = function(player)
    {
        if(this.isSuperMoveActive())
        {
            this.setBackgroundTransparent();
            for(var i = 0; i < teamA_.getPlayers().length; ++i)
                if(teamA_.getPlayer(i).Id != player.Id)
                    teamA_.getPlayer(i).onSuperMoveCompleted();
            for(var i = 0; i < teamB_.getPlayers().length; ++i)
                if(teamB_.getPlayer(i).Id != player.Id)
                    teamB_.getPlayer(i).onSuperMoveCompleted();
            this.setSuperMoveActive(false);
        }
    }
    Match.prototype.preFrameMove = function(frame)
    {
        for(var i = 0; i < teamA_.getPlayers().length; ++i)
            teamA_.getPlayer(i).onPreFrameMove(frame);
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
            teamB_.getPlayer(i).onPreFrameMove(frame);
    }
    Match.prototype.renderComplete = function(frame)
    {
        for(var i = 0; i < teamA_.getPlayers().length; ++i)
            teamA_.getPlayer(i).onRenderComplete(frame);
        for(var i = 0; i < teamB_.getPlayers().length; ++i)
            teamB_.getPlayer(i).onRenderComplete(frame);
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
            stage_.playMusic();
            startedTheme_ = true;
        }
        if(!teamsVisible_ && (frame > CONSTANTS.SHOW_TEAMS_DELAY))
        {
            faceoff_.hide(frame);
            teamA_.show();
            teamB_.show();
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
        if(!startedTheme_)
        {
            startedTheme_ = true;
            stage_.playMusic();
            teamA_.show();
            teamB_.show();
        }
        faceoff_.handleOtherRounds(frame);
    }

    /*calculations to be performed here*/
    Match.prototype.frameMove = function(frame,keyboardState)
    {
        stage_.frameMove(frame);
        this.getHitSystem().frameMove(frame);

        teamA_.frameMove(frame,stage_.X, stage_.getGroundY());
        teamB_.frameMove(frame,stage_.X, stage_.getGroundY());

        if(round_ != 1)
        {
            this.handleOtherRounds(frame);
        }
        else
        {
            this.handleRound1(frame);
            faceoff_.frameMove(frame);
        }

        //
        if(isAIMatch_)
        {
            if((frame % 80) == 0)
            {
                hideInsertCoin_ = false;
                mustUpdate_ = true;
            }
            else if((frame % 40) == 0)
            {
                hideInsertCoin_ = true;
                mustUpdate_ = true;
            }
        }
    }

    /*pre-frame move calculations to be performed here*/
    Match.prototype.preFrameMove = function(frame)
    {
        stage_.preFrameMove(frame);
        teamA_.preFrameMove(frame);
        teamB_.preFrameMove(frame);
    }

    /*pre-render calculations to be performed here*/
    Match.prototype.preRender = function(frame)
    {
        stage_.preRender(frame);
        teamA_.preRender(frame);
        teamB_.preRender(frame);
    }

    /*All rendering and CSS manipulation to be done here*/
    Match.prototype.render = function(frame)
    {

        teamA_.render(frame,stage_.getDeltaX(),stage_.getDeltaY());
        teamB_.render(frame,stage_.getDeltaX(),stage_.getDeltaY());

        stage_.render();

        if(!isPresented_ && (frame > CONSTANTS.PRESENT_DELAY))
            this.present();
        if(round_ == 1)
            faceoff_.render(frame);


        if(isAIMatch_ && !!mustUpdate_)
        {
            mustUpdate_ = false;
            if(user1_.hasCredits())
            {
                insertCoinElement_.style.display = "none";
                pressStartElement_.style.display = "";
                if(!!hideInsertCoin_)
                    pressStartElement_.style.display = "none";
                else
                    pressStartElement_.style.display = "";
            }
            else
            {
                pressStartElement_.style.display = "none";
                insertCoinElement_.style.display = "";
                if(!!hideInsertCoin_)
                    insertCoinElement_.style.display = "none";
                else
                    insertCoinElement_.style.display = "";
            }
        }

    }

    Match.prototype.kill = function()
    {
        this.release();
    }

    /*Remove elements from the DOM and remove any custom CSS*/
    Match.prototype.release = function()
    {
        stage_.release();
        teamA_.release();
        teamB_.release();
        faceoff_.release();
        utils_.removeFromDOM(insertCoinElement_);
        utils_.removeFromDOM(pressStartElement_);
        isShowingMainInsertCoin_ = false;
    }


    Match.prototype.loadAssets = function()
    {
        //stuffLoader_.queue("match.js",RESOURCE_TYPES.BASE64AUDIO);
    }

    Match.prototype.showMainInsertCoin = function()
    {
        if(!isShowingMainInsertCoin_)
        {
            isShowingMainInsertCoin_ = true;
            insertCoinElement_ = window.document.createElement("div");
            insertCoinElement_.className = "insert-coin";
            insertCoinElement_.id = "pnlInsertCoin";
            parent_.appendChild(insertCoinElement_);

            pressStartElement_ = window.document.createElement("div");
            pressStartElement_.className = "press-start";
            pressStartElement_.id = "pnlPressStart";
            parent_.appendChild(pressStartElement_);

        }
    }
    return new Match();
}


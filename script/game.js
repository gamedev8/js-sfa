
var GetWidth = function(element)
{
    return element.clientWidth;
}

var GetHeight = function(element)
{
    return element.clientHeight;
}


var spnFPS_ = window.document.getElementById("spnFPS");
var spnTargetFPS_ = window.document.getElementById("spnTargetFPS");
var spnLag_ = window.document.getElementById("spnLag");
var spnTargetFrames_ = window.document.getElementById("spnTargetFrames");
var spnFrameTime_ = window.document.getElementById("spnFrameTime");


var CreateGame = function()
{
    var user1_ = null;
    var user2_ = null;
    var users_ = [];
    var frame_ = 0;
    var keyboardState_ = {};
    var buttonState_ = {};
    var lastTime_ = 0;
    var speed_ = BrowserDetect.browser == "Chrome" ? CONSTANTS.FAST_SPEED : CONSTANTS.NORMAL_SPEED;
    var targetFPS_ = CONSTANTS.TARGET_FPS;
    var text_ = null;
    var state_ = 0;
    var isInitialized_ = false;
    var managed_ = null;
    var nextTimeout_ = 0;
    var charSelect_ = null;
    var insertCoinScreen_ = null;
    var pnlLoadingProgress_ = window.document.getElementById("pnlLoadingProgress");
    var pnlLoading_ = window.document.getElementById("pnlLoading");
    var vcr_ = CreateVCR();
    var mustRecordNextRound_ = true;
    var gameLoopState_ = GAME_STATES.INSERT_COIN;
    var start_ = 0;
    var end_ = 0;
    var delta_ = 0;
    var delay_ = 0;
    var match_ = null;
    var maxWinsPerMatch_ = 2;

    //Encapulates a new game
    var Game = function ()
    {
        lastTime_ = this.getCurrentTime();
        this.initGame();
        match_ = null;
        this.UsingGamepads = !!window.Gamepad && !!Gamepad.supported;
        this.VCR = vcr_;
    }

    Game.prototype.gameLoopState = function() { return gameLoopState_; }
    Game.prototype.isRecording = function() { return vcr_.isRecording(); }
    Game.prototype.isPlayingVHS = function() { return vcr_.isPlaying(); }
    Game.prototype.recordInput = function(team,index,folder,isDown,keyCode,frame,funcName) { vcr_.recordInput(team,index,folder,isDown,keyCode,frame,funcName); }
    Game.prototype.recordNextRound = function() { mustRecordNextRound_ = true; }
    Game.prototype.stopRecording = function() { mustRecordNextRound_ = false; vcr_.stop(); }
    Game.prototype.stopPlaying = function() { mustRecordNextRound_ = false; vcr_.stop(); }
    Game.prototype.getMaxWinsPerMatch = function() { return maxWinsPerMatch_; }
    Game.prototype.getMatch = function() { return match_; }
    Game.prototype.getCharSelect = function() { return charSelect_; }

    Game.prototype.startRandomMatch = function()
    {
        var chars = [0,3,14,0,3];
        var stages = ["ken", "ryu", "sodom", "dramatic_battle", "akuma", "sagat"];

        var t1 = [2];
        var t2 = [3];

        var p1 = chars.splice(getRand(chars.length),1)[0];
        var p2 = chars.splice(getRand(chars.length),1)[0];

        user3_.setChar(p1,false,true);
        user4_.setChar(p2,p1 == p2,true);

        var stage = stages_[stages[getRand(stages.length)]];

        this.startMatch(false,t1,t2,stage)
    }

    Game.prototype.loadVHS = function(id)
    {
        //function to call when the vhs is done playing
        var onPlaybackDone = (function(thisValue)
        {
            return function()
            {
                thisValue.onVHSPlaybackDone();
            }
        })(this);

        //function to call when the vcr has loaded its data
        var onLoadingDone = (function(thisValue)
        {
            return function(teamA,teamB,stage)
            {
                thisValue.onVHSLoadingDone(teamA,teamB,stage);
            }
        })(this);

        //start loading the vhs
        vcr_.load(onLoadingDone,onPlaybackDone,id);
    }

    Game.prototype.onVHSLoadingDone = function(teamA,teamB,stage)
    {
        //go to match
        this.startMatch(false,teamA,teamB,stages_[stage]);
    }

    Game.prototype.onVHSPlaybackDone = function()
    {
        //go to insert coin screen
        this.startInsertCoinScreen();
    }

    Game.prototype.isGameOver = function()
    {
        return frame_ >= CONSTANTS.MAX_FRAME;
    }

    Game.prototype.addManagedText = function(elementId,x,y,fontPath,isLeft)
    {
        return fontSystem_.addText(elementId,"",x,y,0,fontPath,isLeft);
    }

    Game.prototype.setSpeed = function(value)
    {
        speed_ = value;
    }

    Game.prototype.getSpeed = function() { return speed_; }
    Game.prototype.getCurrentFrame = function () { return frame_; }

    /*Resets the timer*/
    Game.prototype.resetFrame = function()
    {
        if(vcr_.isRecording())
        {
            mustRecordNextRound_ = false;
            vcr_.save();
        }
        else if(mustRecordNextRound_)
        {
            mustRecordNextRound_ = false;
            vcr_.record();
        }
        frame_ = 0;
    }

    /*Returns the current time in milliseconds*/
    Game.prototype.getCurrentTime = function()
    {
        if(!!Date.now)
            return Date.now();
        else
            return (new Date() - new Date(0));
    }
    Game.prototype.hasState = function(flag)
    {
        return (flag & state_) > 0
    }

    Game.prototype.addState = function(flag)
    {
        state_ |= flag;
    }

    Game.prototype.toggleState = function(flag)
    {
        state_ ^= flag;
    }

    Game.prototype.removeState = function(flag)
    {
        state_ = (state_ | (flag)) ^ (flag);
    }


    Game.prototype.onStageImagesLoaded = function()
    {
        if(!!match_)
            match_.getStage().init();
    }

    Game.prototype.releaseText = function()
    {
        fontSystem_.reset();
        text_ = fontSystem_.addText("pnlText","");
    }

    Game.prototype.resetKeys = function()
    {
        keyboardState_ = {};
        if(!!managed_)
            managed_.resetKeys();
    }

    Game.prototype.initGame = function()
    {
        Stage.prototype.center();
    }

    Game.prototype.init = function()
    {
        if(!isInitialized_)
        {
            var getKeyPressHandler = function(thisValue,isDown)
            {
                return function(e)
                {
                    thisValue.handleKeyPress(e,isDown);
                }
            }

            var resetKeys = function(thisValue)
            {
                return function(e)
                {
                    thisValue.resetKeys();
                }
            }

            if(!!window.document.attachEvent)
            {
                window.document.attachEvent("onkeydown",getKeyPressHandler(this,true),true);
                window.document.attachEvent("onkeyup",getKeyPressHandler(this,false),true);
                window.attachEvent("onblur", resetKeys(this), true);
                window.onblur = resetKeys(this);
            }
            else
            {
                window.document.addEventListener("keydown",getKeyPressHandler(this,true),true);
                window.document.addEventListener("keyup",getKeyPressHandler(this,false),true);
                window.addEventListener("onblur", resetKeys(this), true);
                window.onblur = resetKeys(this);
            }
        }
        isInitialized_ = true;

    }

    Game.prototype.preloadTextImages = function()
    {
        if(!!isInitialized_)
            return;
        fontSystem_.preload();
    }

    Game.prototype.showElements = function()
    {
        window.document.getElementById("pnlTeam1").style.display = "";
        window.document.getElementById("pnlTeam2").style.display = "";
        window.document.getElementById("bg0").style.display = "";
        window.document.getElementById("bg1").style.display = "";
    }

    Game.prototype.hideElements = function()
    {
        window.document.getElementById("pnlTeam1").style.display = "none";
        window.document.getElementById("pnlTeam2").style.display = "none";
        window.document.getElementById("bg0").style.display = "none";
        window.document.getElementById("bg1").style.display = "none";
    }

    Game.prototype.startMatch = function(startPaused,teamAIndexes,teamBIndexes,stage,callback)
    {
        this.StartPaused = startPaused;
        this.resetGameData();
        gameLoopState_ = GAME_STATES.MATCH;

        var teamA = teamAIndexes.map(function(i) { return users_[i]; });
        var teamB = teamBIndexes.map(function(i) { return users_[i]; });

        var fn = function(thisValue)
        {
            return function()
            {
                thisValue.createMatch(teamA,teamB,stage,callback);
            }
        }

        charSelect_ = charSelect_ || CreateCharSelect();
        charSelect_.loadUserAssets(teamA);
        charSelect_.loadUserAssets(teamB);

        this.startLoading(null,fn(this));
    }


    Game.prototype.createMatch = function(teamA,teamB,stage,callback)
    {
        gameLoopState_ = GAME_STATES.MATCH;
        var a = null;
        var b = null;

        if(!!charSelect_)
        {
            a = charSelect_.getPlayers(teamA);
            b = charSelect_.getPlayers(teamB);
            stage = stage || charSelect_.getStage();

            charSelect_.release();
        }

        match_ = CreateMatch(a,b,stage);
        managed_ = match_;
        if(vcr_.isPlaying())
            match_.setRound(vcr_.getData().Round);
        announcer_.setMatch(match_);
        this.showElements();


        this.go(this.runGameLoop,callback);
    }

    Game.prototype.getFirstUserForCharSelect = function()
    {
        if(users_.length > 0 && users_[0].isRequestingCharSelect())
            return users_[0];
        return null;
    }

    Game.prototype.getSecondUserForCharSelect = function()
    {
        for(var i = 1; i < users_.length; ++i)
            if(users_[i].isRequestingCharSelect())
                return users_[i];
        return users_[1];
    }

    Game.prototype.startCharSelect = function()
    {
        this.resetGameData();
        gameLoopState_ = GAME_STATES.CHAR_SELECT;
        charSelect_ = CreateCharSelect(users_);
        managed_ = charSelect_;

        this.go(this.runCharSelectLoop);
    }

    Game.prototype.startInsertCoinScreen = function()
    {
        this.resetGameData();
        gameLoopState_ = GAME_STATES.INSERT_COIN;
        insertCoinScreen_ = CreateInsertCoinScreen(user1_,user2_);
        managed_ = insertCoinScreen_;
        this.go(this.runInsertCoinScreenLoop);
    }

    Game.prototype.go = function(loopFn, callback)
    {
        this.init();
        this.preloadTextImages();
        Stage.prototype.center();
        isInitialized_ = true;
        frame_ = 0;
        this.startLoading(loopFn, callback);
    }
    /*shows the loading screen*/
    Game.prototype.showLoading = function(show)
    {
        if(!!show)
        {
            pnlLoadingProgress_.style.display = "";
            pnlLoading_.className = "loading";
        }
        else
        {
            pnlLoadingProgress_.style.display = "none";
            pnlLoading_.innerHTML = "done";
            pnlLoading_.className = "done-loading";
        }
    }
    /*starts loading assets*/
    Game.prototype.startLoading = function(loopFn, callback)
    {
        this.showLoading(true);
        var createClosure = function(thisRef,fn1, fn2) { return function() { thisRef.onDoneLoading(fn1,fn2); } }

        stuffLoader_.start(this.onProgress,createClosure(this, loopFn, callback),this);
    }
    /*executed when the assets are done loading*/
    Game.prototype.onDoneLoading = function(runLoopFn, callback)
    {
        if(!!runLoopFn)
        {
            managed_.start(!!this.StartPaused);
            runLoopFn.call(this);
            if(!!this.StartPaused)
                this.pause();
        }
        if(!!callback)
            callback();
    }
    /*executed when an asset is done loading*/
    Game.prototype.onProgress = function(nbRemaining)
    {
        if(!nbRemaining)
            pnlLoading_.innerHTML = "done";
        else
            pnlLoading_.innerHTML = nbRemaining;
    }
    /*resets common data*/
    Game.prototype.resetGameData = function()
    {
        gameLoopState_ = GAME_STATES.NONE;
        this.hideElements();
        this.stop();
        this.releaseText();
        announcer_.release();
        this.resetSpeed();
        if(!!charSelect_)
            charSelect_.release();
        if(!!match_)
            match_.release();
        if(!!insertCoinScreen_)
            insertCoinScreen_.release();
    }
    Game.prototype.resetSpeed = function()
    {
        speed_ = BrowserDetect.browser == "Chrome" ? CONSTANTS.FAST_SPEED : CONSTANTS.NORMAL_SPEED;
    }
    //Increases the game loop speed
    Game.prototype.speedUp = function()
    {
        if(speed_ > CONSTANTS.MIN_DELAY)
            speed_ -= CONSTANTS.SPEED_INCREMENT;
    }
    //Decreases the game loop speed
    Game.prototype.slowDown = function()
    {
        if(speed_ < CONSTANTS.MAX_DELAY)
            speed_ += CONSTANTS.SPEED_INCREMENT;
    }

    Game.prototype.isPaused = function() { return this.hasState(GAME_STATES.PAUSED); }

    Game.prototype.quickPause = function()
    {
        this.addState(GAME_STATES.PAUSED);
        this.addState(GAME_STATES.STEP_FRAME);
        window.document.getElementById("spnState").innerHTML = "State: <span>Frame by frame</span>"
        window.document.getElementById("spnState").className = "state paused"
        window.document.getElementById("spnStepFrame").className = "state running"
        window.document.getElementById("spnResume").className = "state running"
    }

    /*pauses the game*/
    Game.prototype.pause = function()
    {
        this.quickPause();
        if(!!managed_)
            managed_.pause();
        soundManager_.pauseAll();
    }
    /*resumes the game*/
    Game.prototype.resume = function()
    {
        this.removeState(GAME_STATES.PAUSED);
        window.document.getElementById("spnState").innerHTML = "State: <span>Running</span>";
        window.document.getElementById("spnState").className = "state running";
        window.document.getElementById("spnStepFrame").className = ""
        window.document.getElementById("spnResume").className = ""
        if(!!managed_)
            managed_.resume();
        soundManager_.resumeAll();
    }
    /*Returns true if the key is being released*/
    Game.prototype.wasKeyPressed = function(key,keyCode,isDown)
    {
        return (keyCode == key && !!keyboardState_["_" + key] && !isDown)
    }
    /*Helper method - forwards the button press to the key press handler function*/
    Game.prototype.handleGamePadHelper = function(pad,key)
    {
        if(!!pad[key] != keyboardState_["_" + key])
        {
            if(!!managed_)
            {
                this.handleKeyPress({which:key},!!pad[key]);
            }
        }
    }
    /*Handles gamepad button presses*/
    Game.prototype.handleGamePadButtonPresses = function()
    {
        if(!!this.UsingGamepads)
        {
            for(var i = 0, length = users_.length; i < length; ++i)
            {
                if(users_[i].GamepadIndex != undefined)
                {
                    var pad = Gamepad.getState([users_[i].GamepadIndex]);
                    if(!!pad)
                    {
                        this.handleGamePadHelper(pad,GAMEPAD.DOWN);
                        this.handleGamePadHelper(pad,GAMEPAD.LEFT);
                        this.handleGamePadHelper(pad,GAMEPAD.RIGHT);
                        this.handleGamePadHelper(pad,GAMEPAD.UP);
                        this.handleGamePadHelper(pad,GAMEPAD.B0);
                        this.handleGamePadHelper(pad,GAMEPAD.B1);
                        this.handleGamePadHelper(pad,GAMEPAD.B2);
                        this.handleGamePadHelper(pad,GAMEPAD.B3);
                        this.handleGamePadHelper(pad,GAMEPAD.LS0);
                        this.handleGamePadHelper(pad,GAMEPAD.LS1);
                        this.handleGamePadHelper(pad,GAMEPAD.RS0);
                        this.handleGamePadHelper(pad,GAMEPAD.RS1);
                        this.handleGamePadHelper(pad,GAMEPAD.START);
                        this.handleGamePadHelper(pad,GAMEPAD.SELECT);
                    }
                }
            }
        }
    }
    /*Handle game wide key events, or pass the event on to the match*/
    Game.prototype.handleKeyPress = function(e,isDown)
    {
        var keyCode = e.which || e.keyCode;
        /*Alert(keyCode);*/


        if(this.wasKeyPressed(KEYS.O,keyCode,isDown))
        {
            this.pause();
        }
        if(this.wasKeyPressed(KEYS.P,keyCode,isDown))
        {
            this.resume();
        }
        if(this.wasKeyPressed(KEYS.ESCAPE,keyCode,isDown))
        {
            frame_ = CONSTANTS.MAX_FRAME + 1;
            this.end();
        }
        if(this.wasKeyPressed(KEYS.EIGHT,keyCode,isDown))
            this.speedUp();
        if(this.wasKeyPressed(KEYS.NINE,keyCode,isDown))
            this.slowDown();

        keyboardState_["_" + keyCode] = isDown;

        if(isDown)
        {
            if(!buttonState_["_" + keyCode])
                buttonState_["_" + keyCode] = BUTTON_STATE.JUST_PRESSED;
            else
                buttonState_["_" + keyCode] = BUTTON_STATE.STILL_PRESSED;
        }
        else
        {
            buttonState_["_" + keyCode] = BUTTON_STATE.JUST_RELEASED;
        }

        if(!!managed_ && !!managed_.onKeyStateChanged)
        {
            managed_.onKeyStateChanged(isDown,keyCode,frame_);
            for(var i = 0; i < users_.length; ++i)
                users_[i].onKeyStateChanged(isDown,keyCode,frame_);
        }
    }

    Game.prototype.handleInput = function()
    {
        for(var i in buttonState_)
            if(buttonState_[i] == BUTTON_STATE.JUST_RELEASED)
                buttonState_[i] = BUTTON_STATE.NONE;

        this.handleGamePadButtonPresses();
    }

    Game.prototype.end = function()
    {
        this.releaseText();
        this.resetKeys();
        managed_.kill()
        managed_ = null;
        announcer_.release();
        this.stop();
    }

    Game.prototype.setUser1 = function(user)
    {
        user1_ = user;
    }

    Game.prototype.setUser2 = function(user)
    {
        user2_ = user;
    }

    Game.prototype.addUser1 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad)
    {
        user1_ = this.addUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad);
        return user1_;
    }
    Game.prototype.addUser2 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad)
    {
        user2_ = this.addUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad);
        return user2_;
    }
    Game.prototype.addUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad)
    {
        var user = null;
        if(gamepad != undefined)
            user = this.addGamepadUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad);
        else
            user = new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start);

        users_.push(user);
        return user;
    }
    Game.prototype.addGamepadUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad)
    {
        return new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,coin,start,gamepad);
    }

    Game.prototype.clearUsers = function()
    {
        var length = users_.length;
        for(var i = 0; i < length; ++i)
            delete users_[i];
        users_ = [];
    }


    /*Shows the frame rate on screen*/
    Game.prototype.showFPS = function()
    {
        if(frame_ % targetFPS_ == 0)
        {
            var now = this.getCurrentTime();
            var elapsed = now - lastTime_;
            spnFPS_.innerHTML = now - lastTime_;
            lastTime_ = now;

            //var fps = Math.floor(CONSTANTS.FPS_VALUE / elapsed);
            //spnFPS_.innerHTML = fps;
        }
    }

    Game.prototype.stop = function()
    {
        window.clearTimeout(nextTimeout_);
        nextTimeout_ = null;
    }

    /*Basic game loop*/
    Game.prototype.runGameLoop = function(start)
    {
        this.handleInput();
        if(!this.hasState(GAME_STATES.PAUSED) || this.hasState(GAME_STATES.STEP_FRAME))
        {
            this.removeState(GAME_STATES.STEP_FRAME);
            ++frame_;

            //frame move
            if(!!vcr_.isPlaying())
                vcr_.onFrameMove(frame_);

            //pre fame move
            match_.preFrameMove(frame_);

            match_.frameMove(frame_);
            if(!match_.mustQuit())
            {
                announcer_.frameMove(frame_);
                soundManager_.frameMove(frame_);
                if(!match_.isSuperMoveActive())
                    fontSystem_.frameMove(frame_);

                //pre render
                match_.preRender(frame_);

                //render
                match_.render(frame_);
                if(!match_.isSuperMoveActive())
                    fontSystem_.render(frame_);
                announcer_.render(frame_);
                soundManager_.render(frame_);

                //done
                match_.renderComplete(frame_);
                this.showFPS();
            }
        }

        if(match_.mustQuit())
        {
            switch(match_.getQuitReason())
            {
                case QUIT_MATCH.GOTO_STORYMODE:
                    {
                        this.startCharSelect();
                        break;
                    }
                default:
                    {
                        this.startInsertCoinScreen();
                        break;
                    }
            }
        }
        else if(!match_.isMatchOver(frame_))
        {
            if(gameLoopState_ != GAME_STATES.MATCH)
                return;

            end_ = this.getCurrentTime();
            delta_ = end_ - start;
            delay_ = delta_ > speed_ ? 0 : speed_ - delta_;

            nextTimeout_ = window.setTimeout(runGameLoop_,delay_);
        }
        else
        {
            window.clearTimeout(nextTimeout_);
            match_.handleMatchOver(frame_);
        }
    }

    Game.prototype.runInsertCoinScreenLoop = function()
    {
        this.handleInput();
        if(!this.hasState(GAME_STATES.PAUSED) || this.hasState(GAME_STATES.STEP_FRAME))
        {
            this.removeState(GAME_STATES.STEP_FRAME);
            ++frame_;
            insertCoinScreen_.frameMove(frame_);
            soundManager_.frameMove(frame_);
            fontSystem_.frameMove(frame_);


            insertCoinScreen_.render(frame_);
            soundManager_.render(frame_);
            fontSystem_.render(frame_);
            this.showFPS();
        }

        if(!insertCoinScreen_.isDone(frame_))
        {
            if(gameLoopState_ != GAME_STATES.INSERT_COIN)
                return;
            //nextTimeout_ = window.requestAnimFrame(runInsertCoinScreenLoop_,speed_);
            nextTimeout_ = window.setTimeout(runInsertCoinScreenLoop_,speed_);
        }
        else
        {
            match_.handleMatchOver(frame_);
        }
    }

    Game.prototype.runCharSelectLoop = function()
    {
        if(!!charSelect_)
        {
            this.handleInput();
            if(!this.hasState(GAME_STATES.PAUSED) || this.hasState(GAME_STATES.STEP_FRAME))
            {
                this.removeState(GAME_STATES.STEP_FRAME);
                ++frame_;
                charSelect_.frameMove(frame_);
                soundManager_.frameMove(frame_);

                if(!!charSelect_.IsDone && (frame_ >= charSelect_.getDelayAfterSelect()))
                {
                    managed_ = null;
                    this.startMatch(false,charSelect_.getTeamA(),charSelect_.getTeamB(),charSelect_.getStage());
                }
                charSelect_.render(frame_);
                soundManager_.render(frame_);
                this.showFPS();
            }

            if(!this.isGameOver())
            {
                if(gameLoopState_ != GAME_STATES.CHAR_SELECT)
                    return;
                //nextTimeout_ = window.requestAnimFrame(runCharSelectLoop_,speed_);

                nextTimeout_ = window.setTimeout(runCharSelectLoop_,speed_);
            }
            else
            {
                Alert("user aborted.");
            }
        }
    }

    return new Game();
}

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback){
                window.setTimeout(callback, 1000 / 30);
              };
    })();

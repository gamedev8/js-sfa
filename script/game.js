
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
    var keyState_ = 0;
    var keyStates_ = [];
    var lastTime_ = 0;
    var speed_ = CONSTANTS.NORMAL_SPEED;
    var targetFPS_ = CONSTANTS.TARGET_FPS;
    var extraSpeed_ = 0;
    var text_ = null;//fontSystem_.addText("pnlText");
    var useAlternateImageLoadingFunctions_ = window.navigator.userAgent.indexOf("Firefox") > -1;
    var state_ = 0;
    var isInitialized_ = false;
    var managed_ = null;
    var nextTimeout_ = 0;
    var charSelect_ = null;
    var insertCoinScreen_ = null;
    var pnlLoadingProgress_ = window.document.getElementById("pnlLoadingProgress");
    var pnlLoading_ = window.document.getElementById("pnlLoading");

    /*Encapulates a new game*/
    var Game = function ()
    {
        lastTime_ = this.getCurrentTime();
        this.initGame();
        this.Match = null;
        this.UsingGamepads = !!Gamepad.supported;
    }

    Game.prototype.getMatch = function() { return this.Match; }

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
        if(!!this.Match)
            this.Match.getStage().init();
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
                /*window.attachEvent("onblur", resetKeys(this), true);*/
                window.onblur = resetKeys(this);
            }
            else
            {
                window.document.addEventListener("keydown",getKeyPressHandler(this,true),true);
                window.document.addEventListener("keyup",getKeyPressHandler(this,false),true);
                /*window.addEventListener("onblur", resetKeys(this), true);*/
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

    Game.prototype.startMatch = function(startPaused,teamA,teamB,stage,callback)
    {
        this.StartPaused = startPaused;
        this.resetGameData();

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
        if(!!charSelect_)
        {
            a = charSelect_.getPlayers(teamA);
            b = charSelect_.getPlayers(teamB);
            stage = stage || charSelect_.getStage();

            charSelect_.release();
        }

        this.Match = CreateMatch(a,b,stage);
        managed_ = this.Match;
        announcer_.setMatch(this.Match);
        this.showElements();


        this.go(this.runGameLoop,callback);
    }

    Game.prototype.startCharSelect = function()
    {
        this.resetGameData();
        charSelect_ = CreateCharSelect(user1_,user2_);
        managed_ = charSelect_;

        this.go(this.runCharSelectLoop);
    }
    /**/
    Game.prototype.startInsertCoinScreen = function()
    {
        this.resetGameData();
        insertCoinScreen_ = CreateInsertCoinScreen(user1_,user2_);
        managed_ = insertCoinScreen_;
        this.go(this.runInsertCoinScreenLoop);
    }
    /**/
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
        this.hideElements();
        this.stop();
        this.releaseText();
        announcer_.release();
        speed_ = CONSTANTS.NORMAL_SPEED;
        if(!!charSelect_)
            charSelect_.release();
        if(!!this.Match)
            this.Match.release();
        if(!!insertCoinScreen_)
            insertCoinScreen_.release();
    }
    /*Increases the game loop speed*/
    Game.prototype.speedUp = function()
    {
        if(speed_ > CONSTANTS.MIN_DELAY)
            speed_ -= CONSTANTS.SPEED_INCREMENT;
    }
    /*Decreases the game loop speed*/
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
        window.document.getElementById("spnState").innerHTML = "State: Frame Step"
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
        window.document.getElementById("spnState").innerHTML = "State: Running";
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
        if(!!managed_)
        {
            managed_.onKeyStateChanged(isDown,keyCode,frame_);
        }
    }

    Game.prototype.handleInput = function()
    {
        this.handleGamePadButtonPresses();
    }

    Game.prototype.end = function()
    {
        this.releaseText();
        this.resetKeys();
        managed_.kill()
        managed_ = null;
        announcer_.release();
    }

    Game.prototype.addUser1 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        user1_ = this.addUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        return user1_;
    }
    Game.prototype.addUser2 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        user2_ = this.addUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        return user2_;
    }
    Game.prototype.addUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        var user = null;
        if(gamepad != undefined)
            user = this.addGamepadUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        else
            user = new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn);

        users_.push(user);
        return user;
    }
    Game.prototype.addGamepadUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        return new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
    }


    /*Shows the frame rate on screen*/
    Game.prototype.showFPS = function()
    {
        if(frame_ % targetFPS_ == 0)
        {
            var now = this.getCurrentTime();
            var elapsed = now - lastTime_;
            lastTime_ = now;

            var fps = Math.floor(CONSTANTS.FPS_VALUE / elapsed);
            spnFPS_.innerHTML = fps;
        }
    }

    Game.prototype.stop = function()
    {
        window.clearTimeout(nextTimeout_);
    }

    /*Basic game loop*/
    Game.prototype.runGameLoop = function()
    {
        this.handleInput();
        if(!this.hasState(GAME_STATES.PAUSED) || this.hasState(GAME_STATES.STEP_FRAME))
        {
            this.removeState(GAME_STATES.STEP_FRAME);
            ++frame_;
            //this.Match.preFrameMove(frame_);
            this.Match.frameMove(frame_, keyboardState_);
            announcer_.frameMove(frame_);
            soundManager_.frameMove(frame_);
            if(!this.Match.isSuperMoveActive())
                fontSystem_.frameMove(frame_);

            this.Match.render(frame_);
            if(!this.Match.isSuperMoveActive())
                fontSystem_.render(frame_);
            announcer_.render(frame_);
            soundManager_.render(frame_);

            this.Match.renderComplete(frame_);
            this.showFPS();
        }

        if(!this.Match.isMatchOver(frame_))
        {
            //nextTimeout_ = window.requestAnimFrame(runGameLoop_,speed_);
            nextTimeout_ = window.setTimeout(runGameLoop_,speed_);
        }
        else
        {
            this.Match.handleMatchOver(frame_);
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
            //nextTimeout_ = window.requestAnimFrame(runInsertCoinScreenLoop_,speed_);
            nextTimeout_ = window.setTimeout(runInsertCoinScreenLoop_,speed_);
        }
        else
        {
            this.Match.handleMatchOver(frame_);
        }
    }

    Game.prototype.runCharSelectLoop = function()
    {
        if(!!charSelect_ && charSelect_.DelayAfterSelect < CONSTANTS.DELAY_AFTER_CHARACTER_SELECT)
        {
            this.handleInput();
            if(!this.hasState(GAME_STATES.PAUSED) || this.hasState(GAME_STATES.STEP_FRAME))
            {
                this.removeState(GAME_STATES.STEP_FRAME);
                ++frame_;
                charSelect_.frameMove(frame_);
                soundManager_.frameMove(frame_);

                if(!!charSelect_.IsDone && charSelect_.DelayAfterSelect >= CONSTANTS.DELAY_AFTER_CHARACTER_SELECT)
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

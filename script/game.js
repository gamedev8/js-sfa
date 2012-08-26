
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
    var text_ = null;//fontSystem_.AddText("pnlText");
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
        lastTime_ = this.GetCurrentTime();
        this.InitGame();
        this.match_ = null;
        this.usingGamepads_ = !!Gamepad.supported;
    }

    Game.prototype.GetMatch = function() { return this.match_; }

    Game.prototype.IsGameOver = function()
    {
        return frame_ >= CONSTANTS.MAX_FRAME;
    }

    Game.prototype.AddManagedText = function(elementId,x,y,fontPath,isLeft)
    {
        return fontSystem_.AddText(elementId,"",x,y,0,fontPath,isLeft);
    }

    Game.prototype.SetSpeed = function(value)
    {
        speed_ = value;
    }

    Game.prototype.GetSpeed = function() { return speed_; }
    Game.prototype.GetCurrentFrame = function () { return frame_; }

    /*Resets the timer*/
    Game.prototype.ResetFrame = function()
    {
        frame_ = 0;
    }

    /*Returns the current time in milliseconds*/
    Game.prototype.GetCurrentTime = function()
    {
        if(!!Date.now)
            return Date.now();
        else
            return (new Date() - new Date(0));
    }
    Game.prototype.HasState = function(flag)
    {
        return (flag & state_) > 0
    }

    Game.prototype.AddState = function(flag)
    {
        state_ |= flag;
    }

    Game.prototype.ToggleState = function(flag)
    {
        state_ ^= flag;
    }

    Game.prototype.RemoveState = function(flag)
    {
        state_ = (state_ | (flag)) ^ (flag);
    }


    Game.prototype.OnStageImagesLoaded = function()
    {
        if(!!this.match_)
            this.match_.GetStage().Init();
    }

    Game.prototype.ReleaseText = function()
    {
        fontSystem_.Reset();
        text_ = fontSystem_.AddText("pnlText","");
    }

    Game.prototype.ResetKeys = function()
    {
        keyboardState_ = {};
        if(!!managed_)
            managed_.ResetKeys();
    }

    Game.prototype.InitGame = function()
    {
        Stage.prototype.Center();
    }

    Game.prototype.Init = function()
    {
        if(!isInitialized_)
        {
            var getKeyPressHandler = function(thisValue,isDown)
            {
                return function(e)
                {
                    thisValue.HandleKeyPress(e,isDown);
                }
            }

            var resetKeys = function(thisValue)
            {
                return function(e)
                {
                    thisValue.ResetKeys();
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

    Game.prototype.PreloadTextImages = function()
    {
        if(!!isInitialized_)
            return;
        fontSystem_.Preload();
    }

    Game.prototype.ShowElements = function()
    {
        window.document.getElementById("pnlTeam1").style.display = "";
        window.document.getElementById("pnlTeam2").style.display = "";
        window.document.getElementById("bg0").style.display = "";
        window.document.getElementById("bg1").style.display = "";
    }

    Game.prototype.HideElements = function()
    {
        window.document.getElementById("pnlTeam1").style.display = "none";
        window.document.getElementById("pnlTeam2").style.display = "none";
        window.document.getElementById("bg0").style.display = "none";
        window.document.getElementById("bg1").style.display = "none";
    }

    Game.prototype.StartMatch = function(startPaused,teamA,teamB,stage,callback)
    {
        this.startPaused_ = startPaused;
        this.ResetGameData();

        var fn = function(thisValue)
        {
            return function()
            {
                thisValue.CreateMatch(teamA,teamB,stage,callback);
            }
        }

        charSelect_ = charSelect_ || CreateCharSelect();
        charSelect_.LoadUserAssets(teamA);
        charSelect_.LoadUserAssets(teamB);

        this.StartLoading(null,fn(this));
    }


    Game.prototype.CreateMatch = function(teamA,teamB,stage,callback)
    {
        if(!!charSelect_)
        {
            a = charSelect_.GetPlayers(teamA);
            b = charSelect_.GetPlayers(teamB);
            stage = stage || charSelect_.GetStage();

            charSelect_.Release();
        }

        this.match_ = CreateMatch(a,b,stage);
        managed_ = this.match_;
        announcer_.SetMatch(this.match_);
        this.ShowElements();


        this.Go(this.RunGameLoop,callback);
    }

    Game.prototype.StartCharSelect = function()
    {
        this.ResetGameData();
        charSelect_ = CreateCharSelect(user1_,user2_);
        managed_ = charSelect_;

        this.Go(this.RunCharSelectLoop);
    }
    /**/
    Game.prototype.StartInsertCoinScreen = function()
    {
        this.ResetGameData();
        insertCoinScreen_ = CreateInsertCoinScreen(user1_,user2_);
        managed_ = insertCoinScreen_;
        this.Go(this.RunInsertCoinScreenLoop);
    }
    /**/
    Game.prototype.Go = function(loopFn, callback)
    {
        this.Init();
        this.PreloadTextImages();
        Stage.prototype.Center();
        isInitialized_ = true;
        frame_ = 0;
        this.StartLoading(loopFn, callback);
    }
    /*shows the loading screen*/
    Game.prototype.ShowLoading = function(show)
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
    Game.prototype.StartLoading = function(loopFn, callback)
    {
        this.ShowLoading(true);
        var createClosure = function(thisRef,fn1, fn2) { return function() { thisRef.OnDoneLoading(fn1,fn2); } }

        stuffLoader_.Start(this.OnProgress,createClosure(this, loopFn, callback),this);
    }
    /*executed when the assets are done loading*/
    Game.prototype.OnDoneLoading = function(runLoopFn, callback)
    {
        if(!!runLoopFn)
        {
            managed_.Start(!!this.startPaused_);
            runLoopFn.call(this);
            if(!!this.startPaused_)
                this.Pause();
        }
        if(!!callback)
            callback();
    }
    /*executed when an asset is done loading*/
    Game.prototype.OnProgress = function(nbRemaining)
    {
        if(!nbRemaining)
            pnlLoading_.innerHTML = "done";
        else
            pnlLoading_.innerHTML = nbRemaining;
    }
    /*resets common data*/
    Game.prototype.ResetGameData = function()
    {
        this.HideElements();
        this.Break();
        this.ReleaseText();
        announcer_.Release();
        speed_ = CONSTANTS.NORMAL_SPEED;
        if(!!charSelect_)
            charSelect_.Release();
        if(!!this.match_)
            this.match_.Release();
        if(!!insertCoinScreen_)
            insertCoinScreen_.Release();
    }
    /*Increases the game loop speed*/
    Game.prototype.SpeedUp = function()
    {
        if(speed_ > CONSTANTS.MIN_DELAY)
            speed_ -= CONSTANTS.SPEED_INCREMENT;
    }
    /*Decreases the game loop speed*/
    Game.prototype.SlowDown = function()
    {
        if(speed_ < CONSTANTS.MAX_DELAY)
            speed_ += CONSTANTS.SPEED_INCREMENT;
    }

    Game.prototype.IsPaused = function() { return this.HasState(GAME_STATES.PAUSED); }

    Game.prototype.QuickPause = function()
    {
        this.AddState(GAME_STATES.PAUSED);
        this.AddState(GAME_STATES.STEP_FRAME);
        window.document.getElementById("spnState").innerHTML = "State: Frame Step"
        window.document.getElementById("spnState").className = "state paused"
        window.document.getElementById("spnStepFrame").className = "state running"
        window.document.getElementById("spnResume").className = "state running"
    }

    /*pauses the game*/
    Game.prototype.Pause = function()
    {
        this.QuickPause();
        if(!!managed_)
            managed_.Pause();
        soundManager_.PauseAll();
    }
    /*resumes the game*/
    Game.prototype.Resume = function()
    {
        this.RemoveState(GAME_STATES.PAUSED);
        window.document.getElementById("spnState").innerHTML = "State: Running";
        window.document.getElementById("spnState").className = "state running";
        window.document.getElementById("spnStepFrame").className = ""
        window.document.getElementById("spnResume").className = ""
        if(!!managed_)
            managed_.Resume();
        soundManager_.ResumeAll();
    }
    /*Returns true if the key is being released*/
    Game.prototype.WasKeyPressed = function(key,keyCode,isDown)
    {
        return (keyCode == key && !!keyboardState_["_" + key] && !isDown)
    }
    /*Helper method - forwards the button press to the key press handler function*/
    Game.prototype.HandleGamePadHelper = function(pad,key)
    {
        if(!!pad[key] != keyboardState_["_" + key])
        {
            if(!!managed_)
            {
                this.HandleKeyPress({which:key},!!pad[key]);
            }
        }
    }
    /*Handles gamepad button presses*/
    Game.prototype.HandleGamePadButtonPresses = function()
    {
        if(!!this.usingGamepads_)
        {
            for(var i = 0, length = users_.length; i < length; ++i)
            {
                if(users_[i].GamepadIndex != undefined)
                {
                    var pad = Gamepad.getState([users_[i].GamepadIndex]);
                    if(!!pad)
                    {
                        this.HandleGamePadHelper(pad,GAMEPAD.DOWN);
                        this.HandleGamePadHelper(pad,GAMEPAD.LEFT);
                        this.HandleGamePadHelper(pad,GAMEPAD.RIGHT);
                        this.HandleGamePadHelper(pad,GAMEPAD.UP);
                        this.HandleGamePadHelper(pad,GAMEPAD.B0);
                        this.HandleGamePadHelper(pad,GAMEPAD.B1);
                        this.HandleGamePadHelper(pad,GAMEPAD.B2);
                        this.HandleGamePadHelper(pad,GAMEPAD.B3);
                        this.HandleGamePadHelper(pad,GAMEPAD.LS0);
                        this.HandleGamePadHelper(pad,GAMEPAD.LS1);
                        this.HandleGamePadHelper(pad,GAMEPAD.RS0);
                        this.HandleGamePadHelper(pad,GAMEPAD.RS1);
                        this.HandleGamePadHelper(pad,GAMEPAD.START);
                        this.HandleGamePadHelper(pad,GAMEPAD.SELECT);
                    }
                }
            }
        }
    }
    /*Handle game wide key events, or pass the event on to the match*/
    Game.prototype.HandleKeyPress = function(e,isDown)
    {
        var keyCode = e.which || e.keyCode;
        /*Alert(keyCode);*/


        if(this.WasKeyPressed(KEYS.O,keyCode,isDown))
        {
            this.Pause();
        }
        if(this.WasKeyPressed(KEYS.P,keyCode,isDown))
        {
            this.Resume();
        }
        if(this.WasKeyPressed(KEYS.ESCAPE,keyCode,isDown))
        {
            frame_ = CONSTANTS.MAX_FRAME + 1;
            this.End();
        }
        if(this.WasKeyPressed(KEYS.EIGHT,keyCode,isDown))
            this.SpeedUp();
        if(this.WasKeyPressed(KEYS.NINE,keyCode,isDown))
            this.SlowDown();

        keyboardState_["_" + keyCode] = isDown;
        if(!!managed_)
        {
            managed_.OnKeyStateChanged(isDown,keyCode,frame_);
        }
    }

    Game.prototype.HandleInput = function()
    {
        this.HandleGamePadButtonPresses();
    }

    Game.prototype.End = function()
    {
        this.ReleaseText();
        this.ResetKeys();
        managed_.Kill()
        managed_ = null;
        announcer_.Release();
    }

    Game.prototype.AddUser1 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        user1_ = this.AddUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        return user1_;
    }
    Game.prototype.AddUser2 = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        user2_ = this.AddUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        return user2_;
    }
    Game.prototype.AddUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        var user = null;
        if(gamepad != undefined)
            user = this.AddGamepadUser(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
        else
            user = new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn);

        users_.push(user);
        return user;
    }
    Game.prototype.AddGamepadUser = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad)
    {
        return new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepad);
    }


    /*Shows the frame rate on screen*/
    Game.prototype.ShowFPS = function()
    {
        if(frame_ % targetFPS_ == 0)
        {
            var now = this.GetCurrentTime();
            var elapsed = now - lastTime_;
            lastTime_ = now;

            var fps = Math.floor(CONSTANTS.FPS_VALUE / elapsed);
            spnFPS_.innerHTML = fps;
        }
    }

    Game.prototype.Break = function()
    {
        window.clearTimeout(nextTimeout_);
    }

    /*Basic game loop*/
    Game.prototype.RunGameLoop = function()
    {
        this.HandleInput();
        if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
        {
            this.RemoveState(GAME_STATES.STEP_FRAME);
            ++frame_;
            //this.match_.PreFrameMove(frame_);
            this.match_.FrameMove(frame_, keyboardState_);
            announcer_.FrameMove(frame_);
            soundManager_.FrameMove(frame_);
            if(!this.match_.IsSuperMoveActive())
                fontSystem_.FrameMove(frame_);

            this.match_.Render(frame_);
            if(!this.match_.IsSuperMoveActive())
                fontSystem_.Render(frame_);
            announcer_.Render(frame_);
            soundManager_.Render(frame_);

            this.match_.RenderComplete(frame_);
            this.ShowFPS();
        }

        if(!this.match_.IsMatchOver(frame_))
        {
            //nextTimeout_ = window.requestAnimFrame(runGameLoop_,speed_);
            nextTimeout_ = window.setTimeout(runGameLoop_,speed_);
        }
        else
        {
            this.match_.HandleMatchOver(frame_);
        }
    }

    Game.prototype.RunInsertCoinScreenLoop = function()
    {
        this.HandleInput();
        if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
        {
            this.RemoveState(GAME_STATES.STEP_FRAME);
            ++frame_;
            insertCoinScreen_.FrameMove(frame_);
            soundManager_.FrameMove(frame_);
            fontSystem_.FrameMove(frame_);


            insertCoinScreen_.Render(frame_);
            soundManager_.Render(frame_);
            fontSystem_.Render(frame_);
            this.ShowFPS();
        }

        if(!insertCoinScreen_.IsDone(frame_))
        {
            //nextTimeout_ = window.requestAnimFrame(runInsertCoinScreenLoop_,speed_);
            nextTimeout_ = window.setTimeout(runInsertCoinScreenLoop_,speed_);
        }
        else
        {
            this.match_.HandleMatchOver(frame_);
        }
    }

    Game.prototype.RunCharSelectLoop = function()
    {
        if(!!charSelect_ && charSelect_.delayAfterSelect_ < CONSTANTS.DELAY_AFTER_CHARACTER_SELECT)
        {
            this.HandleInput();
            if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
            {
                this.RemoveState(GAME_STATES.STEP_FRAME);
                ++frame_;
                charSelect_.FrameMove(frame_);
                soundManager_.FrameMove(frame_);

                if(!!charSelect_.isDone_ && charSelect_.delayAfterSelect_ >= CONSTANTS.DELAY_AFTER_CHARACTER_SELECT)
                {
                    managed_ = null;
                    this.StartMatch(false,charSelect_.GetTeamA(),charSelect_.GetTeamB(),charSelect_.GetStage());
                }
                charSelect_.Render(frame_);
                soundManager_.Render(frame_);
                this.ShowFPS();
            }

            if(!this.IsGameOver())
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

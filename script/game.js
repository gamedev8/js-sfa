
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

/*Encapulates a new game*/
var Game = function ()
{
    this.user1_ = null;
    this.user2_ = null;
    this.frame_ = 0;
    this.keyboardState_ = {};
    this.keyState_ = 0;
    this.keyStates_ = [];
    this.lastTime_ = this.GetCurrentTime();
    this.speed_ = CONSTANTS.NORMAL_SPEED;
    this.targetFPS_ = CONSTANTS.TARGET_FPS;
    this.extraSpeed_ = 0;
    this.fontSystem_ = new FontSystem();
    this.text_ = this.fontSystem_.AddText("pnlText");
    this.useAlternateImageLoadingFunctions_ = window.navigator.userAgent.indexOf("Firefox") > -1;
    this.state_ = 0;
    this.isInitialized_ = false;
}

Game.prototype.IsGameOver = function()
{
    return this.frame_ >= CONSTANTS.MAX_FRAME;
}

Game.prototype.AddManagedText = function(elementId,x,y,fontPath)
{
    return this.fontSystem_.AddText(elementId,"",x,y,0,fontPath);
}

Game.prototype.SetSpeed = function(value)
{
    this.speed_ = value;
}
Game.prototype.UseAlternateImageLoadingFunctions = function()
{
    return this.useAlternateImageLoadingFunctions_;
}
/*Resets the timer*/
Game.prototype.ResetFrame = function()
{
    this.frame_ = 0;
}
/*returns the current frame*/
Game.prototype.GetCurrentFrame = function ()
{
    return this.frame_;
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
    return (flag & this.state_) > 0
}

Game.prototype.AddState = function(flag)
{
    this.state_ |= flag;
}

Game.prototype.ToggleState = function(flag)
{
    this.state_ ^= flag;
}

Game.prototype.RemoveState = function(flag)
{
    this.state_ = (this.state_ | (flag)) ^ (flag);
}


Game.prototype.OnStageImagesLoaded = function()
{
    if(!!this.match_)
        this.match_.stage_.Reset();
}

Game.prototype.ReleaseText = function()
{
    this.fontSystem_.Reset();
    this.text_ = this.fontSystem_.AddText("pnlText","");
}

Game.prototype.ResetKeys = function()
{
    this.keyboardState_ = {};
    if(!!this.managed_)
        this.managed_.ResetKeys();
}

Game.prototype.Init = function()
{
    if(!this.isInitialized_)
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
    this.isInitialized_ = true;

}

Game.prototype.PreloadTextImages = function()
{
    if(!!this.isInitialized_)
        return;
    this.fontSystem_.Preload();
}

Game.prototype.InitDOM = function()
{
    window.document.getElementById("pnlTeam1").style.display = "";
    window.document.getElementById("pnlTeam2").style.display = "";
    window.document.getElementById("bg0").style.display = "";
    window.document.getElementById("bg1").style.display = "";
}

Game.prototype.ResetDOM = function()
{
    window.document.getElementById("pnlTeam1").style.display = "none";
    window.document.getElementById("pnlTeam2").style.display = "none";
    window.document.getElementById("bg0").style.display = "none";
    window.document.getElementById("bg1").style.display = "none";
}

Game.prototype.StartMatch = function(goodGuys,badGuys, stage)
{
    this.Break();
    this.speed_ = CONSTANTS.NORMAL_SPEED;
    var goodGuys = goodGuys;
    var badGuys = badGuys;
    var stage = stage;

    if(!!this.charSelect_)
    {
        goodGuys = goodGuys || this.charSelect_.GetGoodGuys();
        badGuys = badGuys || this.charSelect_.GetBadGuys();
        stage = stage || this.charSelect_.GetStage();

        this.charSelect_.Release();
    }

    this.match_ = new Match();
    this.Init();
    this.InitDOM();
    this.PreloadTextImages();

    this.managed_ = this.match_;

    this.match_.stage_.Set(stage);
    this.match_.Start(goodGuys,badGuys);
    this.isInitialized_ = true;
    this.frame_ = 0;
    this.RunGameLoop();
}

Game.prototype.StartCharSelect = function()
{
    this.Break();
    this.speed_ = CONSTANTS.NORMAL_SPEED;
    if(!!this.match_)
        this.match_.Release();
    this.ResetDOM();
    this.Init();
    this.PreloadTextImages();
    this.charSelect_ = new CharSelect(this.user1_,this.user2_);
    this.charSelect_.Init(window.document.getElementById("pnlStage"));
    this.managed_ = this.charSelect_;
    /*center the screen*/
    Stage.prototype.Center();
    this.managed_.Resume();
    this.isInitialized_ = true;
    this.frame_ = 0;
    this.RunCharSelectLoop();
}
/*Increases the game loop speed*/
Game.prototype.SpeedUp = function()
{
    if(this.speed_ > CONSTANTS.MIN_DELAY)
        this.speed_ -= CONSTANTS.SPEED_INCREMENT;
}
/*Decreases the game loop speed*/
Game.prototype.SlowDown = function()
{
    if(this.speed_ < CONSTANTS.MAX_DELAY)
        this.speed_ += CONSTANTS.SPEED_INCREMENT;
}
/*Returns true if the key is being released*/
Game.prototype.WasKeyPressed = function(key,keyCode,isDown)
{
    return (keyCode == key && !!this.keyboardState_["_" + key] && !isDown)
}
/*Handle game wide key events, or pass the event on to the match*/
Game.prototype.HandleKeyPress = function(e,isDown)
{
    var keyCode = e.which || e.keyCode;
    /*Alert(keyCode);*/


    if(this.WasKeyPressed(KEYS.O,keyCode,isDown))
    {
        this.AddState(GAME_STATES.PAUSED);
        this.AddState(GAME_STATES.STEP_FRAME);
        window.document.getElementById("spnState").innerHTML = "State: Frame Step"
        window.document.getElementById("spnState").className = "state paused"
        this.managed_.Pause();
    }
    if(this.WasKeyPressed(KEYS.P,keyCode,isDown))
    {
        this.RemoveState(GAME_STATES.PAUSED);
        window.document.getElementById("spnState").innerHTML = "State: Running"
        window.document.getElementById("spnState").className = "state running"
        this.managed_.Resume();
    }
    if(this.WasKeyPressed(KEYS.ESCAPE,keyCode,isDown))
    {
        this.frame_ = CONSTANTS.MAX_FRAME + 1;
        this.End();
    }
    if(this.WasKeyPressed(KEYS.EIGHT,keyCode,isDown))
        this.SpeedUp();
    if(this.WasKeyPressed(KEYS.NINE,keyCode,isDown))
        this.SlowDown();

    this.keyboardState_["_" + keyCode] = isDown;
    if(!!this.managed_)
        this.managed_.OnKeyStateChanged(isDown,keyCode,this.frame_);
}

Game.prototype.End = function()
{
    this.ReleaseText();
    this.ResetKeys();
    this.managed_.Kill()
    this.managed_ = null;
}

Game.prototype.HandleInput = function()
{
}

Game.prototype.AddUser1 = function(right,up,left,down,p1,p2,p3,k1,k2,k3)
{
    this.user1_ = new User(right,up,left,down,p1,p2,p3,k1,k2,k3);
    return this.user1_;
}
Game.prototype.AddUser2 = function(right,up,left,down,p1,p2,p3,k1,k2,k3)
{
    this.user2_ = new User(right,up,left,down,p1,p2,p3,k1,k2,k3);
    return this.user2_;
}

/*Helper function*/
Game.prototype.GetGameLoopClosure = function(thisValue)
{
    return function()
    {
        thisValue.RunGameLoop();
    }
}

/*Helper function*/
Game.prototype.GetCharSelectLoopClosure = function(thisValue)
{
    return function()
    {
        thisValue.RunCharSelectLoop();
    }
}

/*Shows the frame rate on screen*/
Game.prototype.ShowFPS = function()
{
    if(this.frame_ % this.targetFPS_ == 0)
    {
        var now = this.GetCurrentTime();
        var elapsed = now - this.lastTime_;
        this.lastTime_ = now;

        var fps = Math.floor(CONSTANTS.FPS_VALUE / elapsed);
        spnFPS_.innerHTML = fps;
    }
}

Game.prototype.Break = function()
{
    window.clearTimeout(this.nextTimeout_);
}

/*Basic game loop*/
Game.prototype.RunGameLoop = function()
{
    this.HandleInput();
    if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
    {
        this.RemoveState(GAME_STATES.STEP_FRAME);
        ++this.frame_;
        //this.match_.PreFrameMove(this.frame_);
        this.match_.FrameMove(this.frame_, this.keyboardState_);
        soundManager_.FrameMove(this.frame_);
        if(!this.match_.isSuperMoveActive_)
            this.fontSystem_.FrameMove(this.frame_);

        this.match_.Render(this.frame_);
        if(!this.match_.isSuperMoveActive_)
            this.fontSystem_.Render(this.frame_);
        soundManager_.Render(this.frame_);

        this.match_.RenderComplete(this.frame_);
        this.ShowFPS();
    }

    if(!this.match_.IsMatchOver(this.frame_))
    {
        this.nextTimeout_ = window.setTimeout(runGameLoop_,this.speed_);
        //this.nextTimeout_ = window.setTimeout(this.GetGameLoopClosure(this),this.speed_);
    }
    else
    {
        this.match_.HandleMatchOver(this.frame_);
    }
}

Game.prototype.RunCharSelectLoop = function()
{
    if(!!this.charSelect_ && !this.charSelect_.isDone_)
    {
        this.HandleInput();
        if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
        {
            this.RemoveState(GAME_STATES.STEP_FRAME);
            ++this.frame_;
            this.charSelect_.FrameMove(this.frame_);
            soundManager_.FrameMove();
            if(!!this.charSelect_.isDone_)
            {
                this.managed_ = null;
                this.StartMatch();
            }
            this.charSelect_.Render(this.frame_);
            soundManager_.Render();
            this.ShowFPS();
        }

        if(!this.IsGameOver())
        {
            //this.nextTimeout_ = window.setTimeout(this.GetCharSelectLoopClosure(this),this.speed_);
            this.nextTimeout_ = window.setTimeout(runCharSelectLoop_,this.speed_);
        }
        else
        {
            Alert("user aborted.");
        }
    }
}

function Alert(text)
{
    if(!!console && !!console.log)
        console.log(text);
}

/*
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
*/
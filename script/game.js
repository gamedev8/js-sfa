
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

/*
    Encapulates a new game
*/
var Game = function ()
{
    this.match_ = new Match();
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
    this.Init();
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


Game.prototype.ReleaseText = function()
{
    this.fontSystem_.Reset();
    this.text_ = this.fontSystem_.AddText("pnlText","");
}

Game.prototype.ResetKeys = function()
{
    this.keyboardState_ = {};
    this.match_.ResetKeys();
}

Game.prototype.Init = function()
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

    this.PreloadTextImages();
}

Game.prototype.PreloadTextImages = function()
{
    this.fontSystem_.Preload();
}

Game.prototype.StartMatch = function(goodGuys,badGuys)
{
    this.frame_ = 0;
    this.match_.Start(goodGuys,badGuys);
    this.RunGameLoop();
}
/*
Increases the game loop speed
*/
Game.prototype.SpeedUp = function()
{
    if(this.speed_ > CONSTANTS.MIN_DELAY)
        this.speed_ -= CONSTANTS.SPEED_INCREMENT;
}
/*
Decreases the game loop speed
*/
Game.prototype.SlowDown = function()
{
    if(this.speed_ < CONSTANTS.MAX_DELAY)
        this.speed_ += CONSTANTS.SPEED_INCREMENT;
}
/*
Returns true if the key is being released
*/
Game.prototype.WasKeyPressed = function(key,keyCode,isDown)
{
    return (keyCode == key && !!this.keyboardState_["_" + key] && !isDown)
}
/*
Handle game wide key events, or pass the event on to the match
*/
Game.prototype.HandleKeyPress = function(e,isDown)
{
    var keyCode = e.which || e.keyCode;
    /*Alert(keyCode);*/


    if(this.WasKeyPressed(KEYS.O,keyCode,isDown))
    {
        this.AddState(GAME_STATES.PAUSED);
        this.AddState(GAME_STATES.STEP_FRAME);
    }
    if(this.WasKeyPressed(KEYS.P,keyCode,isDown))
        this.ToggleState(GAME_STATES.PAUSED);
    if(this.WasKeyPressed(KEYS.ESCAPE,keyCode,isDown))
        this.frame_ = CONSTANTS.MAX_FRAME + 1;
    if(this.WasKeyPressed(KEYS.EIGHT,keyCode,isDown))
        this.SpeedUp();
    if(this.WasKeyPressed(KEYS.NINE,keyCode,isDown))
        this.SlowDown();

    this.keyboardState_["_" + keyCode] = isDown;
    this.match_.OnKeyStateChanged(isDown,keyCode,this.frame_);

}

Game.prototype.HandleInput = function()
{
}

/*
    Helper function
*/
Game.prototype.GetGameLoopClosure = function(thisValue)
{
    return function()
    {
        thisValue.RunGameLoop();
    }
}
/*
    Shows the frame rate on screen
*/
Game.prototype.ShowFPS = function()
{
    if(this.frame_ % this.targetFPS_ == 0)
    {
        var now = this.GetCurrentTime();
        var elapsed = now - this.lastTime_;
        spnLag_.innerHTML = 100 - this.speed_;
        this.lastTime_ = now;

        var fps = Math.floor(CONSTANTS.FPS_VALUE / elapsed);
        spnFPS_.innerHTML = fps;
    }
}
/*
    Basic game loop
*/
Game.prototype.RunGameLoop = function()
{
    this.HandleInput();
    if(!this.HasState(GAME_STATES.PAUSED) || this.HasState(GAME_STATES.STEP_FRAME))
    {
        this.RemoveState(GAME_STATES.STEP_FRAME);
        ++this.frame_;
        this.match_.FrameMove(this.frame_, this.keyboardState_);
        this.fontSystem_.FrameMove(this.frame_);
        this.match_.Render(this.frame_);
        this.fontSystem_.Render(this.frame_);
        this.ShowFPS();
    }

    if(!this.match_.IsMatchOver(this.frame_))
    {
        window.setTimeout(this.GetGameLoopClosure(this),this.speed_);
    }
    else
        this.match_.HandleMatchOver(this.frame_);
}


var spnMsg = window.document.getElementById("spnMsg");
function Alert(text)
{
    if(!!console && !!console.log)
        console.log(text);
    //else
    //    spnMsg.innerHTML += "<br />" + text;
}


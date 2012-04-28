
var GetWidth = function(element)
{
    return element.clientWidth;
}

var GetHeight = function(element)
{
    return element.clientHeight;
}


var STAGE = 
{
    MIN_X:0
    ,MAX_X:640
    ,MAX_BG0_SCROLL:-63
    ,MAX_BG1_SCROLL:-760
    ,MIN_STAGEX:0
    ,MAX_STAGEX:768
    ,START_X:150
    ,START_X_OFFSET:50
    ,FLOORY:57
    ,CSSWIDTH:768
}

var USER_DATA_TYPES = 
{
    OFFSET:0
}

var CONSTANTS =
{
    MAX_SPEED:0
    ,MAX_PRIORITY:1 << 30
    ,NORMAL_SPEED:14
    ,SLOW_SPEED:70
    ,MAX_FRAME:100000000000000 /*round will end when Game.prototype.frame_ reaches this value*/
    ,TARGET_FPS:64
    ,MS_PER_SEC:1000
    ,FPS_VALUE:60000

    ,SPEED_INCREMENT:1
    ,MIN_DELAY:0
    ,MAX_DELAY:1000
    ,MIN_FRAME_DELAY:-100
    ,FRAME_MAX:999
    ,UBER_FRAME_MAX:1000000

    ,MAX_KEYSTATES:15
    ,MAX_KEY_LIFE:25
    ,EXACT_MATCH:2
    ,PRIORITY_MATCH:1
    ,MAX_EXTRA_IMAGES:20
    ,MOVEMENT_THRESHOLD_LEFT:250
    ,MOVEMENT_THRESHOLD_RIGHT:510
    ,PI:3.14159265
    ,TWO_PI:2*3.14159265
    ,HALF_PI:3.14159265/2.0
    ,PI_INC:3.14159265/40.0
    ,SLIDE_INC:3.14159265/50.0
    ,USE_PLAYER_TOP:1
    ,USE_PLAYER_BOTTOM:2
    ,USE_PLAYER_XY:3
    ,SMALLDIRT:4
    ,DIRT_FREQUENCY:5
    ,X_DAMPING:0.1
    ,Y_DAMPING:0.1
    ,HALF_G:0.5*9.81
    ,SMALLDIRT_OFFSETY:15
    ,BIGDIRT_OFFSETY:70
    /*the following are just to help cut down on literals throughout the code*/
    ,FIRST_HIT:1
    ,SECOND_HIT:2
    ,THRID_HIT:3
    ,FOURTH_HIT:4
    ,FIFTH_HIT:5
    ,SIXTH_HIT:6
    ,SEVENTH_HIT:7
    ,EIGTH_HIT:8
    ,NINTH_HIT:9
    ,TENTH_HIT:10
    ,TEAM1:1
    ,TEAM2:2

    ,DEFAULT_TAKE_HIT_DELAY:15
    ,DEFAULT_GIVE_HIT_DELAY:10

    ,NO_FRAME:-1
    ,DEFEATED_FRAME:100
    ,DEFAULT_WIN_ANIMATION_NAME:"win 1"
    /*how many frames after the winning hit will a player start its win animation*/
    ,WIN_ANIMATION_DELAY:100
    /*how many frames after the losing player hits the ground will the round end*/
    ,GOTO_NEW_ROUND_DELAY:200
    ,DEFAULT_CROUCH_LIGHT_HRSLIDE:40
    ,DEFAULT_CROUCH_MEDIUM_HRSLIDE:60
    ,DEFAULT_CROUCH_HARD_HRSLIDE:80

    ,DEFAULT_LIGHT_HRSLIDE:40
    ,DEFAULT_MEDIUM_HRSLIDE:60
    ,DEFAULT_HARD_HRSLIDE:80

    ,DEFAULT_COMBO_TEXT_LIFE:100

    /*hits are buffered for the following number of frames - to allow the other player to also register a hit, removing any advantage for any player*/
    ,DEFAULT_ACTION_FRAME_DELAY:2

    ,DEFAULT_BASE_IMAGES_PATH:"images/misc/"
    ,DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT:20
    ,DEFAULT_BLOCK_FREEZE_FRAME_COUNT:20

    ,SINGLE:1
    ,DOUBLE:2
    ,TRIPLE:3
    ,QUADRUPLE:4

    ,ONE_LEVEL:96
    ,MAX_BLOCK_DISTANCE_SQ:90000
    ,RIGHT:1
    ,LEFT:2
    ,UP:4
    ,DOWN:8
    ,LEFT_AND_CHECK_RIGHT:16
    ,RIGHT_AND_CHECK_LEFT:32
};

var TEXT = 
{
    HIT_COMBO:"HIT COMBO"
};

var KEYS = 
{
    ESCAPE:27
    ,NUMPAD_PLUS:107
    ,NUMPAD_MINUS:109
    ,NUMPAD_1:97
    ,NUMPAD_2:98
    ,NUMPAD_3:99
    ,NUMPAD_4:100
    ,NUMPAD_5:101
    ,NUMPAD_6:102
    ,NUMPAD_7:103
    ,NUMPAD_8:104
    ,NUMPAD_9:105
    ,P:80
    ,EIGHT:56
    ,NINE:57
    ,ZERO:48

    ,ARROW_LEFT:37
    ,ARROW_UP:38
    ,ARROW_RIGHT:39
    ,ARROW_DOWN:40
    ,A:65
    ,S:83
    ,D:68
    ,Z:90
    ,X:88
    ,C:67


    ,NUMPAD_1:97
    ,NUMPAD_2:98
    ,NUMPAD_3:99
    ,NUMPAD_4:100
    ,NUMPAD_5:101
    ,NUMPAD_6:102
    ,NUMPAD_7:103
    ,NUMPAD_8:104
    ,NUMPAD_9:105

    ,H:72
    ,J:74
    ,K:75
    ,B:66
    ,N:78
    ,M:77

    ,O:79
};

var GAME_STATES = 
{
    PAUSED:1
    ,STEP_FRAME:2
};

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


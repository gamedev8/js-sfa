Array.prototype.indexOf = Array.prototype.indexOf || function(value)
{
    for(var i = 0, length = this.length; i < length; ++i)
        if(this[i] === value)
            return i;
    return -1;
}


var getRand = function(max)
{
    return (Math.random() * (max || 100)) >> 0;
}

var rand = function(min, max)
{
    return min + (Math.random() * (max - min)) >> 0;
}

var StageParams = function(key, name, bg0XOffset, maxLeftScroll, maxRightScroll, bg0YOffset, bg1YOffset)
{
    this.Key = key;
    this.Name = name;
    this.Bg0XOffset = bg0XOffset;
    this.Bg0YOffset = bg0YOffset || 0;
    this.Bg1YOffset = bg1YOffset || 0;
    this.MaxLeftScroll = maxLeftScroll;
    this.MaxRightScroll = maxRightScroll;
    this.Bg0Img = "images/misc/stage/" + name + ".back.png";
    this.Bg1Img = "images/misc/stage/" + name + ".front.png";
}

var stages_ = {};
stages_["ken"] = new StageParams("ken", "ken", 129, -62.5, 322.5, -21, -41);
stages_["ryu"] = new StageParams("ryu", "chunli", -192, -382, -2, -21, -41);
stages_["dramatic_battle"] = new StageParams("dramatic_battle", "mbison", -192, -382, -2, -21, -41);
stages_["mbison"] = new StageParams("mbison", "mbison", -192, -382, -2, -21, -41);
stages_["akuma"] = new StageParams("akuma", "akuma", -192, -382, -2, -21, -41);
stages_["sodom"] = new StageParams("sodom", "sodom", -192, -382, -2, -21, -41);
stages_["sagat"] = new StageParams("sagat", "sagat", -192, -382, -2, -21, -41);


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

function ApplyFlip(element,applied)
{
    if(!!applied)
    {
        element.className += " flipped";
    }
    else
    {
        element.className = element.className.replace(" flipped", "");
    }
}

function AutoApplyFlip(element,applied)
{
    if(!!applied && (element.className.indexOf(" flipped") == -1))
    {
        element.className += " flipped";
    }
    else if(!applied && (element.className.indexOf(" flipped") != -1))
    {
        element.className = element.className.replace(" flipped", "");
    }
}

function Alert(text)
{   
    if(!!console && !!console.log)
        console.log(text);
    
}
function AlertError(text)
{
    if(!!console && !!console.error)
        console.error(text);
}

var announcer_ = CreateAnnouncer();
var game_ = CreateGame();
var fontSystem_ = CreateFontSystem();

var runGameLoop_ = (function(thisValue)
{
    return function()
    {
        thisValue.runGameLoop(thisValue.getCurrentTime());
    }
})(game_);
var runCharSelectLoop_ = (function(thisValue) { return function() { thisValue.runCharSelectLoop(); } })(game_);
var runInsertCoinScreenLoop_ = (function(thisValue) { return function() { thisValue.runInsertCoinScreenLoop(); } })(game_);
var btn = function(button,state,min,max)
{
    return {Button:button, State:state, MinNbFrames:min || undefined, MaxNbFrames:max || undefined};
}

//overriden OnStageImagesLoaded function, just incase the images load too slow
function OnStageImagesLoaded()
{
    game_.onStageImagesLoaded();
}

//Human users
function InitUsers()
{
    delete window.user1_;
    delete window.user2_;
    delete window.user3_;
    delete window.user4_;
    delete window.user5_;
    delete window.user6_;

    var val = 10000000;

    window.user1_ = game_.addUser1(KEYS.ARROW_RIGHT,KEYS.ARROW_UP,KEYS.ARROW_LEFT,KEYS.ARROW_DOWN,KEYS.A,KEYS.S,KEYS.D,KEYS.Z,KEYS.X,KEYS.C,KEYS.Q,KEYS.CNTRL,KEYS.ENTER);
    window.user2_ = game_.addUser2(KEYS.NUMPAD_6,KEYS.NUMPAD_8,KEYS.NUMPAD_4,KEYS.NUMPAD_5,KEYS.H,KEYS.J,KEYS.K,KEYS.B,KEYS.N,KEYS.M,KEYS.L,KEYS.NUMPAD_7,KEYS.NUMPAD_9);
    window.user3_ = game_.addUser(GAMEPAD.RIGHT,GAMEPAD.UP,GAMEPAD.LEFT,GAMEPAD.DOWN,GAMEPAD.LS0,GAMEPAD.B3,GAMEPAD.B2,GAMEPAD.RS0,GAMEPAD.B1,GAMEPAD.B0,GAMEPAD.RS1,GAMEPAD.SELECT,GAMEPAD.START,0);

    val += 100;
    window.user4_ = game_.addUser(val+11,val+12,val+13,val+14,val+15,val+16,val+17,val+18,val+19,val+20,val+21);
    val += 100;
    window.user5_ = game_.addUser(val+11,val+12,val+13,val+14,val+15,val+16,val+17,val+18,val+19,val+20,val+21);
    val += 100;
    window.user6_ = game_.addUser(val+11,val+12,val+13,val+14,val+15,val+16,val+17,val+18,val+19,val+20,val+21);
}
InitUsers();

//This is more for debugging - starts a quick match right away with Ryu vs Ken
function StartQuickMatch()
{
    user1_.setChar(CHARACTERS.SAGAT);
    user2_.setChar(CHARACTERS.RYU);

    game_.startMatch(false,[0],[1], stages_["ryu"]);
}

//multi player battle 
function StartDramaticBattle()
{
    user1_.setChar(CHARACTERS.RYU);
    user2_.setChar(CHARACTERS.KEN);

    game_.startMatch(false,[0],[1], stages_["mbison"]);
}

function StartBattle()
{
    if(!__debugMode)
        StartQuickMatch();
    else
        StartQuickMatch();
}

//Goes to the character selection screen
function StartCharacterSelection()
{
    game_.resume();
    game_.startCharSelect();
}

//Goes to the character selection screen
function StartInsertCoin()
{
    //game_.resume();
    game_.startInsertCoinScreen();
}

/*******************************************************************************************************************************/
function Go()
{
    var sel = window.document.getElementById("sel");
    switch(sel.selectedIndex)
    {
        case 0: StartCharacterSelection(); break;
        case 1: StartDramaticBattle(); break;
    };
}
function MaxOutEnergy()
{
    game_.getMatch().getTeamA().getEnergybar().change(1000);
    game_.getMatch().getTeamB().getEnergybar().change(1000);
}
var debug_ = GetDebugInstance(game_);
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

//play
StartInsertCoin();

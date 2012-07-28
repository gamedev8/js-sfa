

var StageParams = function(name, bg0XOffset, maxLeftScroll, maxRightScroll, bg0Img, bg1Img)
{
    this.name_ = name;
    this.bg0XOffset_ = bg0XOffset;
    this.maxLeftScroll_ = maxLeftScroll;
    this.maxRightScroll_ = maxRightScroll;
    this.bg0Img_ = "images/misc/stage/" + name + ".back.png";
    this.bg1Img_ = "images/misc/stage/" + name + ".front.png";
}

var stages_ = {};
stages_["ken"] = new StageParams("ken", 129, -62.5, 322.5);
stages_["ryu"] = new StageParams("chunli", -192, -382, -2);
stages_["mbison"] = new StageParams("mbison", -192, -382, -2);
stages_["akuma"] = new StageParams("akuma", -192, -382, -2);
stages_["sodom"] = new StageParams("sodom", -192, -382, -2);


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
{    /*
    if(!!console && !!console.log)
        console.log(text);
    */
}
function AlertError(text)
{
    if(!!console && !!console.error)
        console.error(text);
}

var announcer_ = CreateAnnouncer();
var game_ = CreateGame();
var fontSystem_ = CreateFontSystem();

var runGameLoop_ = (function(thisValue) { return function() { thisValue.RunGameLoop(); } })(game_);
var runCharSelectLoop_ = (function(thisValue) { return function() { thisValue.RunCharSelectLoop(); } })(game_);
var runInsertCoinScreenLoop_ = (function(thisValue) { return function() { thisValue.RunInsertCoinScreenLoop(); } })(game_);

/*overriden OnStageImagesLoaded function, just incase the images load too slow*/
function OnStageImagesLoaded()
{
    game_.OnStageImagesLoaded();
}

/*Human users*/
var u1_ = game_.AddUser1(KEYS.NUMPAD_6,KEYS.NUMPAD_8,KEYS.NUMPAD_4,KEYS.NUMPAD_5,KEYS.H,KEYS.J,KEYS.K,KEYS.B,KEYS.N,KEYS.M,KEYS.L);
var u2_ = game_.AddUser2(KEYS.ARROW_RIGHT,KEYS.ARROW_UP,KEYS.ARROW_LEFT,KEYS.ARROW_DOWN,KEYS.A,KEYS.S,KEYS.D,KEYS.Z,KEYS.X,KEYS.C,KEYS.Q);
var val = 10000000;
var u3_ = game_.AddUser(val+1,val+2,val+3,val+4,val+5,val+6,val+7,val+8,val+9,val+10,val+11);
var u4_ = game_.AddUser(val+11,val+12,val+13,val+14,val+15,val+16,val+17,val+18,val+19,val+20,val+21);

//u3_.isAlternateChar_ = true;
u4_.isAlternateChar_ = true;


/*This is more for debugging - starts a quick match right away with Ryu vs Ken*/
function StartQuickMatch()
{
    u1_.SetChar(CHARACTERS.KEN);
    u2_.SetChar(CHARACTERS.RYU);

    game_.StartMatch(false,[u1_],[u2_], stages_["sodom"]);
}

/* multi player battle */
function StartDramaticBattle()
{
    u2_.SetChar(CHARACTERS.KEN);
    u1_.SetChar(CHARACTERS.RYU,true);
    u3_.SetChar(CHARACTERS.KEN,true);

    game_.StartMatch(false,[u2_],[u1_,u3_], stages_["mbison"], StartDramaticBattleAI);
}

function StartBattle()
{
    StartDramaticBattle();
}

function StartDramaticBattleAI()
{
    debug_.T2TestAI(0);
    debug_.T2TestAI(1);
}

/*Goes to the character selection screen*/
function StartCharacterSelection()
{
    game_.Resume();
    game_.StartCharSelect();
}

/*Goes to the character selection screen*/
function StartInsertCoin()
{
    game_.Resume();
    game_.StartInsertCoinScreen();
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
    game_.GetMatch().GetTeamA().GetEnergybar().Change(1000);
    game_.GetMatch().GetTeamB().GetEnergybar().Change(1000);
}
var debug_ = GetDebugInstance(game_);
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

/*play*/
//StartMayhem();
//StartQuickMatch();
//StartCharacterSelection();
StartInsertCoin();

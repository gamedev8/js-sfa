

var StageParams = function(name, bg0XOffset, maxLeftScroll, maxRightScroll, bg0Img, bg1Img)
{
    this.name_ = name;
    this.bg0XOffset_ = bg0XOffset;
    this.maxLeftScroll_ = maxLeftScroll;
    this.maxRightScroll_ = maxRightScroll;
    this.bg0Img_ = bg0Img;
    this.bg1Img_ = bg1Img;
}

var kensStage_ = new StageParams("ken", 129, -62.5, 322.5, "images/misc/stage/ken1.25.bg.jpg", "images/misc/stage/ken.bg.png");


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
function Alert(text)
{    /*
    if(!!console && !!console.log)
        console.log(text);
    */
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
var u3_ = game_.AddUser(1,2,3,4,5,6,7,8,9,10,11);
var u4_ = game_.AddUser(11,12,13,14,15,16,17,18,19,20,21);

//u3_.isAlternateChar_ = true;
u4_.isAlternateChar_ = true;


/*This is more for debugging - starts a quick match right away with Ryu vs Ken*/
function StartQuickMatch()
{
    u1_.SetChar(CHARACTERS.KEN);
    u2_.SetChar(CHARACTERS.RYU);

    game_.StartMatch([u1_],[u2], kensStage_);
    game_.Pause();
}

/* multi player battle */
function StartDramaticBattle()
{
    u2_.SetChar(CHARACTERS.KEN);
    u1_.SetChar(CHARACTERS.RYU,true);
    u3_.SetChar(CHARACTERS.KEN,true);

    game_.StartMatch([u2_],[u1_,u3_], kensStage_, StartDramaticBattleAI);
    game_.Pause();
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

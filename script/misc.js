var RemoveFromDOM = function(element)
{
    if(!!element)
    {
        while(element.children.length > 0)
            RemoveChildrenFromDOM(element.children[0]);
        var parentNode = element.parentNode;
        if(!!parentNode)
            parentNode.removeChild(element);
        else
            element = null;
    }
}

var RemoveChildrenFromDOM = function(element,keepOrginalElement)
{
    if(!!element)
    {
        if(!element.parentNode)
        {
            if(!keepOrginalElement)
                element = null;
        }
        else if(element.children.length == 0)
        {
            if(!keepOrginalElement)
                element.parentNode.removeChild(element);
        }
        else
        {
            while(element.children.length > 0)
            {
                RemoveChildrenFromDOM(element.children[0]);
            }
        }
    }
}

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

var announcer_ = CreateAnnouncer();
var game_ = new Game();

var runGameLoop_ = (function(thisValue) { return function() { thisValue.RunGameLoop(); } })(game_);
var runCharSelectLoop_ = (function(thisValue) { return function() { thisValue.RunCharSelectLoop(); } })(game_);

/*overriden OnStageImagesLoaded function, just incase the images load too slow*/
function OnStageImagesLoaded()
{
    game_.OnStageImagesLoaded();
}

/*Human users*/
var u1_ = game_.AddUser1(KEYS.NUMPAD_6,KEYS.NUMPAD_8,KEYS.NUMPAD_4,KEYS.NUMPAD_5,KEYS.H,KEYS.J,KEYS.K,KEYS.B,KEYS.N,KEYS.M,KEYS.L);
var u2_ = game_.AddUser2(KEYS.ARROW_RIGHT,KEYS.ARROW_UP,KEYS.ARROW_LEFT,KEYS.ARROW_DOWN,KEYS.A,KEYS.S,KEYS.D,KEYS.Z,KEYS.X,KEYS.C,KEYS.Q);


/*This is more for debugging - starts a quick match right away with Ryu vs Ken*/
function StartQuickMatch()
{
    var p1_ = Player.prototype.CreateRyu(u1_);
    var p2_ = Player.prototype.CreateKen(u2_);
    game_.StartMatch([p1_],[p2_], kensStage_);
    game_.Pause();
}

/*muhahahaha...*/
function StartMayhem()
{
    var p1_ = Player.prototype.CreateRyu(u1_);
    var p2_ = Player.prototype.CreateKen(u1_);
    var p3_ = Player.prototype.CreateRyu(u1_);
    var p4_ = Player.prototype.CreateKen(u2_);
    game_.StartMatch([p1_,p2_],[p3_,p4_], kensStage_);
    game_.Pause();
    debug_.T1TestAI(0);
    debug_.T1TestAI(1);
    debug_.T2TestAI(0);
}

/*Goes to the character selection screen*/
function StartCharacterSelection()
{
    game_.Resume();
    game_.StartCharSelect();
}

/*******************************************************************************************************************************/
function Go()
{
    var sel = window.document.getElementById("sel");
    switch(sel.selectedIndex)
    {
        case 0: StartCharacterSelection(); break;
        case 1: StartMayhem(); break;
    };
}
function MaxOutEnergy()
{
    game_.match_.teamA_.Energybar.Change(1000);
    game_.match_.teamB_.Energybar.Change(1000);
}
var debug_ = GetDebugInstance(game_);
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

/*play*/
//StartMayhem();
//StartQuickMatch();
//StartCharacterSelection();

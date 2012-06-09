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

var RemoveChildrenFromDOM = function(element)
{
    if(!!element)
    {
        if(element.children.length == 0)
            element.parentNode.removeChild(element);
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

var game_ = new Game();

/*overriden OnStageImagesLoaded function, just incase the images load too slow*/
function OnStageImagesLoaded()
{
    game_.OnStageImagesLoaded();
}

/*Human users*/
var u1_ = game_.AddUser1(KEYS.NUMPAD_6,KEYS.NUMPAD_8,KEYS.NUMPAD_4,KEYS.NUMPAD_5,KEYS.H,KEYS.J,KEYS.K,KEYS.B,KEYS.N,KEYS.M);
var u2_ = game_.AddUser2(KEYS.ARROW_RIGHT,KEYS.ARROW_UP,KEYS.ARROW_LEFT,KEYS.ARROW_DOWN,KEYS.A,KEYS.S,KEYS.D,KEYS.Z,KEYS.X,KEYS.C);


/*This is more for debugging - starts a quick match right away with Ryu vs Ken*/
function StartQuickMatch()
{
    var p1_ = Player.prototype.CreateRyu(u1_);
    var p2_ = Player.prototype.CreateKen(u2_);
    game_.StartMatch([p1_],[p2_], kensStage_);
}

/*Goes to the character selection screen*/
function StartCharacterSelection()
{
    game_.StartCharSelect();
}

/*******************************************************************************************************************************/
function MaxOutEnergy()
{
    game_.match_.teamA_.Energybar.Change(1000);
    game_.match_.teamB_.Energybar.Change(1000);
}
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

/*play*/
//StartQuickMatch();
StartCharacterSelection();

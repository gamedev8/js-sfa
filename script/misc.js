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
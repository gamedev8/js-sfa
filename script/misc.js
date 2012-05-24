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
/*Renders debug info*/
Player.prototype.RenderDebugInfo = function()
{
    /*
    var bottom = (this.GetBoxBottom() + (this.GetBoxHeight()/2)) + "px";
    this.debugB_.style.left = (this.GetRightX()) + "px";
    this.debugB_.style.bottom = bottom;
    this.debugF_.style.left = (this.GetLeftX()) + "px";
    this.debugF_.style.bottom = bottom

    this.MoveCircle();

    this.circle_.Render();

    var x = 0;
    if(this.direction_ < 0)
        x = this.GetX();
    else
        x = STAGE.MAX_X - this.GetX();

    this.circle_.DebugElement.style.bottom = this.circle_.RenderY + "px";
    this.circle_.DebugElement.style.left = (x + this.circle_.OffsetX) + "px";
    */


    if(!!this.Flags.Combat.Has(COMBAT_FLAGS.ATTACK) && this.currentFrame_.HitPoints.length > 0)
    {
        var points = this.currentFrame_.HitPoints;
        var x = this.GetX();
        this.debugHit_.style.bottom = (this.GetY() + points[0].y) + "px";

        if(this.direction_ < 0)
        {
            this.debugHit_.style.right = "";
            this.debugHit_.style.left = (x + points[0].x) + "px";
        }
        else
        {
            this.debugHit_.style.left = "";
            this.debugHit_.style.right = (x + points[0].x) + "px";
        }
        if(this.debugHit_.style.display != "")
            this.debugHit_.style.display = "";
    }
    else
    {
        if(this.debugHit_.style.display != "none")
            this.debugHit_.style.display = "none";
    }

}


/**/
Player.prototype.ReleaseDebugElements = function()
{
    utils_.RemoveFromDOM(this.debugHit_);
    utils_.RemoveFromDOM(this.debKeysElement_);
}


/**/
Player.prototype.CreateDebugElements = function(parentElement)
{
    /*
    this.debugB_ = window.document.createElement("b");
    this.debugB_.className = "right";
    this.debugB_.innerHTML = "r";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.debugB_);

    this.debugF_ = window.document.createElement("b");
    this.debugF_.className = "left";
    this.debugF_.innerHTML = "l";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.debugF_);
    

    var d = window.document.createElement("div");
    d.className = "circle-debug";
    this.circle_.DebugElement = d;
    this.circle_.Render();
    (parentElement || window.document.getElementById("pnlStage")).appendChild(d);
    */

    this.debugHit_ = window.document.createElement("b");
    this.debugHit_.style.display = "none";
    this.debugHit_.className = "hit";
    this.debugHit_.innerHTML = "h";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.debugHit_);
}

Player.prototype.CreateKeysElement =  function()
{
    this.debKeysElement_ = window.document.createElement("div");
    this.debKeysElement_.className = "show-keys";
    if(this.team_ == 1)
    {
        window.document.getElementById("pnlTeam1Keys").appendChild(this.debKeysElement_);
    }
    else
    {
        window.document.getElementById("pnlTeam2Keys").appendChild(this.debKeysElement_);
    }
    this.debKeysElement_.innerHTML = "&nbsp;"
}


Player.prototype.DebugShowKeysHelper = function(bit)
{
    var retVal = "";

    if(!!(bit & 16)) retVal += "+<img src='images/misc/buttons/lp.png' />";
    if(!!(bit & 32))  retVal += "+<img src='images/misc/buttons/mp.png' />";
    if(!!(bit & 64))  retVal += "+<img src='images/misc/buttons/hp.png' />";
    if(!!(bit & 128)) retVal += "+<img src='images/misc/buttons/lk.png' />";
    if(!!(bit & 256)) retVal += "+<img src='images/misc/buttons/mk.png' />";
    if(!!(bit & 512)) retVal += "+<img src='images/misc/buttons/hk.png' />";
    
    return retVal;
}


Player.prototype.DebugShowDirsHelper = function(bit)
{
    var retVal = "";
    if(!!(bit & 1) && !!(bit & 4)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/nw.png' />" : "<img src='images/misc/buttons/ne.png' />";
    if(!!(bit & 1) && !!(bit & 8)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/sw.png' />" : "<img src='images/misc/buttons/se.png' />";
    if(!!(bit & 2) && !!(bit & 8)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/se.png' />" : "<img src='images/misc/buttons/sw.png' />";
    if(!!(bit & 2) && !!(bit & 4)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/ne.png' />" : "<img src='images/misc/buttons/nw.png' />";

    if(!(bit & 4) && !(bit & 8) && !!(bit & 1)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/w.png' />" : "<img src='images/misc/buttons/e.png' />";
    if(!(bit & 4) && !(bit & 8) && !!(bit & 2)) retVal += this.direction_ == 1 ? "<img src='images/misc/buttons/e.png' />" : "<img src='images/misc/buttons/w.png' />";

    if(!(bit & 1) && !(bit & 2) && !!(bit & 4)) retVal += "<img src='images/misc/buttons/n.png' />";
    if(!(bit & 1) && !(bit & 2) && !!(bit & 8)) retVal += "<img src='images/misc/buttons/s.png' />";

    return retVal;
}


Player.prototype.DebugShowKeys = function()
{
    return;
    var output = "";
    var tmp = "";
    for(var i = 0, length = this.keyStates_.length; i < length; ++i)
    {
        tmp = "";
        var bit = this.keyStates_[i].Bit;
        var keys = ((((((((this.keyStates_[i].Bit | 1) ^ 1) | 2) ^ 2) | 4) ^ 4) | 8) ^ 8);
        var dir = ((((((((((((this.keyStates_[i].Bit | 16) ^ 16) | 32) ^ 32) | 64) ^ 64) | 128) ^ 128) | 256) ^ 256) | 512) ^ 512);
        
        tmp += this.DebugShowDirsHelper(dir);
        tmp += this.DebugShowKeysHelper(keys);

        if(!!tmp)
        {
            if(tmp[0] == "+")
                tmp = tmp.substring(1);
            if(!!output)
                output += ", ";
            output += tmp;
        }
    }

    if(!!output)
    {
        this.debKeysElement_.innerHTML = output;
    }
}


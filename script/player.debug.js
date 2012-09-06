/*Renders debug info*/
Player.prototype.renderDebugInfo = function()
{
    /*
    var bottom = (this.getBoxBottom() + (this.getBoxHeight()/2)) + "px";
    this.DebugB.style.left = (this.getRightX()) + "px";
    this.DebugB.style.bottom = bottom;
    this.DebugF.style.left = (this.getLeftX()) + "px";
    this.DebugF.style.bottom = bottom;

    this.moveCircle();
    this.Circle.render();

    var x = 0;
    if(this.Direction < 0)
        x = this.getX();
    else
        x = STAGE.MAX_X - this.getX();

    this.Circle.DebugElement.style.bottom = this.Circle.RenderY + "px";
    this.Circle.DebugElement.style.left = (x + this.Circle.OffsetX) + "px";
    */


    if(!!this.Flags.Combat.has(COMBAT_FLAGS.ATTACK) && this.CurrentFrame.HitPoints.length > 0)
    {
        var points = this.CurrentFrame.HitPoints;
        var x = this.getX();
        this.DebugHit.style.bottom = (this.getY() + points[0].y) + "px";

        if(this.Direction < 0)
        {
            this.DebugHit.style.right = "";
            this.DebugHit.style.left = (x + points[0].x) + "px";
        }
        else
        {
            this.DebugHit.style.left = "";
            this.DebugHit.style.right = (x + points[0].x) + "px";
        }
        if(this.DebugHit.style.display != "")
            this.DebugHit.style.display = "";
    }
    else
    {
        if(this.DebugHit.style.display != "none")
            this.DebugHit.style.display = "none";
    }

}


/**/
Player.prototype.releaseDebugElements = function()
{
    utils_.removeFromDOM(this.DebugHit);
    utils_.removeFromDOM(this.DebKeysElement);
}


/**/
Player.prototype.createDebugElements = function(parentElement)
{
    /*
    this.DebugB = window.document.createElement("b");
    this.DebugB.className = "right";
    this.DebugB.innerHTML = "r";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.DebugB);

    this.DebugF = window.document.createElement("b");
    this.DebugF.className = "left";
    this.DebugF.innerHTML = "l";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.DebugF);

    var d = window.document.createElement("div");
    d.className = "circle-debug";
    this.Circle.DebugElement = d;
    this.Circle.render();
    //(parentElement || window.document.getElementById("pnlStage")).appendChild(d);
    this.Element.appendChild(d);
    */

    this.DebugHit = window.document.createElement("b");
    this.DebugHit.style.display = "none";
    this.DebugHit.className = "hit";
    this.DebugHit.innerHTML = "h";
    (parentElement || window.document.getElementById("pnlStage")).appendChild(this.DebugHit);
}

Player.prototype.createKeysElement =  function()
{
    this.DebKeysElement = window.document.createElement("div");
    this.DebKeysElement.className = "show-keys";
    if(this.Team == 1)
    {
        window.document.getElementById("pnlTeam1Keys").appendChild(this.DebKeysElement);
    }
    else
    {
        window.document.getElementById("pnlTeam2Keys").appendChild(this.DebKeysElement);
    }
    this.DebKeysElement.innerHTML = "&nbsp;"
}


Player.prototype.debugShowKeysHelper = function(bit)
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


Player.prototype.debugShowDirsHelper = function(bit)
{
    var retVal = "";
    if(!!(bit & 1) && !!(bit & 4)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/nw.png' />" : "<img src='images/misc/buttons/ne.png' />";
    if(!!(bit & 1) && !!(bit & 8)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/sw.png' />" : "<img src='images/misc/buttons/se.png' />";
    if(!!(bit & 2) && !!(bit & 8)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/se.png' />" : "<img src='images/misc/buttons/sw.png' />";
    if(!!(bit & 2) && !!(bit & 4)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/ne.png' />" : "<img src='images/misc/buttons/nw.png' />";

    if(!(bit & 4) && !(bit & 8) && !!(bit & 1)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/w.png' />" : "<img src='images/misc/buttons/e.png' />";
    if(!(bit & 4) && !(bit & 8) && !!(bit & 2)) retVal += this.Direction == 1 ? "<img src='images/misc/buttons/e.png' />" : "<img src='images/misc/buttons/w.png' />";

    if(!(bit & 1) && !(bit & 2) && !!(bit & 4)) retVal += "<img src='images/misc/buttons/n.png' />";
    if(!(bit & 1) && !(bit & 2) && !!(bit & 8)) retVal += "<img src='images/misc/buttons/s.png' />";

    return retVal;
}


Player.prototype.debugShowKeys = function()
{
    return;
    var output = "";
    var tmp = "";
    for(var i = 0, length = this.KeyStates.length; i < length; ++i)
    {
        tmp = "";
        var bit = this.KeyStates[i].Bit;
        var keys = ((((((((this.KeyStates[i].Bit | 1) ^ 1) | 2) ^ 2) | 4) ^ 4) | 8) ^ 8);
        var dir = ((((((((((((this.KeyStates[i].Bit | 16) ^ 16) | 32) ^ 32) | 64) ^ 64) | 128) ^ 128) | 256) ^ 256) | 512) ^ 512);
        
        tmp += this.debugShowDirsHelper(dir);
        tmp += this.debugShowKeysHelper(keys);

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
        this.DebKeysElement.innerHTML = output;
    }
}


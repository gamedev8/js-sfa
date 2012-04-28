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


    if(!!this.HasState(FLAGS.ATTACK) && this.currentFrame_.HitPoints.length > 0)
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

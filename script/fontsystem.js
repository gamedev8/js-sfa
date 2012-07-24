﻿var ManagedText = function(elementID,text,x,y,fontSpacing,fontsPath)
{
    this.Text = text || "";
    this.Element = window.document.getElementById(elementID);
    this.FontsPath = fontsPath || "font1";
    this.FontSpacing = fontSpacing || 0;
    this.X = x || 0;
    this.Y = y || 0;

    this.dX = 0;
    this.dY = 0;
    this.TargetX = 0;
    this.TargetY = 0;

    this.AnimateCurrent = null;
    this.AnimateFunction = null;
    this.AnimateEndValue = null;
    this.HideFrame = -1;

    this.Width = 0;
    this.IsLeft = true;
    this.UpdateRate = 2;
    this.Init();
    this.Change(this.Text);
}

/*this text element will move toward the passed in X and Y coords*/
ManagedText.prototype.SetTarget = function(x,y)
{
    x = Math.ceil(+x);
    y = Math.ceil(+y);

    this.TargetX = x;
    this.TargetY = y;

    var dx = this.TargetX - this.X;
    var dy = this.TargetY - this.Y;

    var dirX = ((dx)/Math.abs(dx)) || 0;
    var dirY = ((dy)/Math.abs(dy)) || 0;

    this.dX = dirX;
    this.dY = dirY;
}

/*applies the step function to the startValue until end function is true*/
ManagedText.prototype.Animate = function(startValue,endFn,stepFn)
{
    this.AnimateCurrent = startValue;
    this.AnimateFunction = stepFn;
    this.AnimateEndValue = endFn;

    this.Change(this.AnimateCurrent);
}

ManagedText.prototype.AnimateIncNumber = function(startValue,endValue){this.Animate(startValue,function(value){return value < endValue;},function(value){return ++value;});}
ManagedText.prototype.AnimateDecNumber = function(startValue,endValue){this.Animate(startValue,function(value){return value > endValue;},function(value){return --value;});}

/*initialize the Text*/
ManagedText.prototype.Init = function()
{
    this.HideFrame = -1;
}

/*helper to get the source*/
ManagedText.prototype.GetSrc = function(letter)
{
    var value = letter.charCodeAt(0);
    switch(this.FontsPath)
    {
        case "font1": return font1_[value];
        case "font2": return font2_[value];
    }
    //return CONSTANTS.DEFAULT_BASE_IMAGES_PATH + this.FontsPath + "/" + value + ".png";
}

/*Changes the managed text*/
ManagedText.prototype.Change = function(newText,x,hideFrame)
{
    this.Text = "" + newText;
    this.MustUpdate = true;

    while(this.Element.children.length > this.Text.length)
        this.Element.removeChild(this.Element.children[0]);
    while(this.Element.children.length < this.Text.length)
        this.Element.appendChild(window.document.createElement("img"));

    this.Width = 0;
    for(var i = 0,length = this.Text.length; i < length;++i)
    {
        this.Element.children[i].style.marginRight = this.FontSpacing + "px";
        //var src = this.GetSrc(this.Text.charAt(i));
        //var currentSrc = ((this.Element.children[i].src || "").match(/.\.png$/) || []).join();

        //if(currentSrc != src)
        //{
            this.Element.children[i].onload = (function(thisValue,fontSpacing)
            {
                return function()
                {
                    thisValue.Width += this.width + fontSpacing; 
                }
            })(this,this.FontSpacing);
            this.Element.children[i].src = this.GetSrc(this.Text.charAt(i));
        //}
    }

    if(!!hideFrame)
    {
        this.ShowNow(x,hideFrame);
    }
}

/*increments the X*/
ManagedText.prototype.MoveX = function(dx)
{
    this.X += dx;
    this.MustUpdate = true;
}

/*increments the Y*/
ManagedText.prototype.MoveY = function(dy)
{
    this.Y += dy;
    this.MustUpdate = true;
}

ManagedText.prototype.HideNow = function() { this.Element.style.display = "none";}
ManagedText.prototype.Hide = function() { this.SetTarget(-this.Width,this.Y); }
ManagedText.prototype.ShowNow = function(x,hideFrame) { this.X = (x != 0 ? x : null) || 0; this.Element.style.display = ""; this.MustUpdate = true; if(!!hideFrame) {this.HideFrame = hideFrame;}}
ManagedText.prototype.Show = function(hideFrame) { this.SetTarget(0,this.Y); if(!!hideFrame) {this.HideFrame = hideFrame;}}

/*toggles between using the left and right css properties for horizontal positioning*/
ManagedText.prototype.ChangeDirection = function()
{
    this.IsLeft = !this.IsLeft;
    this.MustUpdate = true;
}

ManagedText.prototype.FrameMove = function(frame)
{
    if(frame == this.HideFrame)
        this.HideNow();
    if(frame % this.UpdateRate== 0)
    {
        if(!!this.AnimateFunction)
        {
            if(!this.AnimateEndValue(this.AnimateCurrent))
            {
                this.AnimateFunction = null;
            }
            else
            {
                this.AnimateCurrent = this.AnimateFunction(this.AnimateCurrent);
                this.Change(this.AnimateCurrent);
            }
        }
    }
    if(!!this.dX)
    {
        this.MoveX(this.dX);
        if(this.X == this.TargetX)
            this.dX = 0;
    }
    if(!!this.dY)
    {
        this.MoveY(this.dY);
        if(this.Y == this.TargetY)
            this.dY = 0;
    }
}


ManagedText.prototype.Render = function(frame)
{
    if(!!this.MustUpdate)
    {
        this.MustUpdate = false;
        if(this.IsLeft)
        {
            this.Element.style.right = "";
            this.Element.style.left = this.X + "px";
            this.Element.style.top = this.Y + "px";
        }
        else
        {
            this.Element.style.left = "";
            this.Element.style.right = this.X + "px";
            this.Element.style.top = this.Y + "px";
        }
    }
}

ManagedText.prototype.Reset = function()
{
    this.Init();
    this.Change("");
    this.Hide();
}

var CreateFontSystem = function()
{
    var FontSystem = function()
    {
        this.Text = [];
    }

    FontSystem.prototype.Preload = function()
    {
    }

    FontSystem.prototype.Reset = function(frame)
    {
        for(var i = 0, length = this.Text.length; i < length; ++i)
            this.Text[i].Reset();
    }


    /*adds some managed text to the system*/
    FontSystem.prototype.AddText = function(elementID,text,x,y,fontSpacing,fontsPath)
    {
        var ref = new ManagedText(elementID,text,x,y,fontSpacing,fontsPath);
        ref.Init();
        this.Text[this.Text.length] = ref;
        return ref;
    }


    FontSystem.prototype.FrameMove = function(frame)
    {
        for(var i = 0, length = this.Text.length; i < length; ++i)
        {
            this.Text[i].FrameMove(frame);
        }
    }

    FontSystem.prototype.Render = function(frame)
    {
        for(var i = 0, length = this.Text.length; i < length; ++i)
        {
            this.Text[i].Render(frame);
        }
    }

    return new FontSystem();
}

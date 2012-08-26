var Stage = function(bg0XOffset)
{
    this.BgImg0 =  {xOffset:0,element:window.document.getElementById("bg0")};
    this.BgImg1 = {element:window.document.getElementById("bg1")};
    this.Bg = {element:window.document.getElementById("pnlStage")};
    this.LastX = 0;
    this.X = 0;
    this.X0 = 0;
    this.X1 = 0;
    this.DeltaX = 0;
    this.Y = STAGE.FLOORY;
    this.OffsetY = 0;
    this.DeltaY = 0;

    this.Bg0XOffset = bg0XOffset;
    this.BgRate = 0;
    this.MaxLeftScroll = 0;
    this.MaxRightScroll = 0;
    this.Music = null;
    this.Params = null;
    this.CanMoveY = true;
}
Stage.prototype.GetGame = function() { return game_; }
Stage.prototype.GetMatch = function() { return game_.match_; }
Stage.prototype.GetPhysics = function() { return this.GetMatch().GetPhysics(); }
Stage.prototype.OnAudioLoaded = function()
{
    this.PlayMusic();
}
Stage.prototype.LoadAssets = function()
{
    this.Music = "audio/" + this.Params.name_.toLowerCase() + "/theme.zzz";
    stuffLoader_.Queue(this.Params.name_.toLowerCase() + "-theme.js",RESOURCE_TYPES.BASE64AUDIO);
    stuffLoader_.Queue(this.Params.bg0Img_,RESOURCE_TYPES.IMAGE);
    stuffLoader_.Queue(this.Params.bg1Img_,RESOURCE_TYPES.IMAGE);
}
Stage.prototype.Setup = function(params)
{
    this.Params = params;
    this.LoadAssets();
}
Stage.prototype.Start = function()
{
    this.BgImg0.xOffset = this.Params.bg0XOffset_;
    this.BgImg0.yOffset = this.Params.bg0YOffset_;
    this.BgImg1.yOffset = this.Params.bg1YOffset_;

    this.BgYScrollRate = this.Params.bg0YOffset_ / this.Params.bg1YOffset_;
    this.MaxScrollY = this.Params.bg1YOffset_ / STAGE.SCROLLY_FACTOR;

    this.BgImg0.element.src = this.Params.bg0Img_;
    this.BgImg1.element.src = this.Params.bg1Img_;
    this.BgImg0.element.className = "bg0 " + this.Params.name_ + "-bg0";
    this.BgImg1.element.className = "bg1 " + this.Params.name_ + "-bg1";
    this.MaxLeftScroll  = this.Params.maxLeftScroll_; 
    this.MaxRightScroll = this.Params.maxRightScroll_;

    this.CanMoveY = true;
}

Stage.prototype.RestartMusic = function()
{
    soundManager_.Restart(this.Music);
}

Stage.prototype.PlayMusic = function()
{
    soundManager_.Play(this.Music,true);
}

Stage.prototype.PauseMusic = function()
{
    soundManager_.Pause(this.Music);
}

/**/
Stage.prototype.Pause = function()
{
    this.PauseMusic();
}

/**/
Stage.prototype.Resume = function()
{
    soundManager_.Resume(this.Music);
}

/**/
Stage.prototype.Release = function()
{
    this.PauseMusic();
    this.BgImg0.element.src = "";
    this.BgImg1.element.src = "";
    this.BgImg0.element.className = "";
    this.BgImg1.element.className = "";
}

Stage.prototype.GetDeltaY = function() { return this.GetGroundY() - this.LastGroundY; }
Stage.prototype.GetDeltaX = function() { return this.X - this.LastX;}

Stage.prototype.GetOffsetY = function(flip)
{
    return this.OffsetY;
}

Stage.prototype.GetGroundY = function()
{
    return STAGE.FLOORY + this.OffsetY;
}

Stage.prototype.FrameMove = function(frame)
{
    this.LastX = this.X;
    this.LastGroundY = this.GetGroundY();
    this.DeltaX = 0;
    this.DeltaY = 0;
}

Stage.prototype.Render = function(frame)
{
    this.BgImg0.element.style.left = this.X0 + "px";
    this.BgImg1.element.style.left = this.X1 + "px";

    var offset = this.BgImg1.yOffset - this.GetOffsetY()

    this.BgImg0.element.style.top = this.BgImg0.yOffset - (this.BgYScrollRate * this.GetOffsetY()) + "px";
    this.BgImg1.element.style.top = this.BgImg1.yOffset - this.GetOffsetY() + "px";

    this.CanMoveY = true;
}

/* Returns true if the stage has been cornered */
Stage.prototype.IsCornered = function()
{
    return this.IsRightCornered() || this.IsLeftCornered();
}
/* Returns true if the stage has been cornered */
Stage.prototype.IsRightCornered = function()
{
    return this.X <= STAGE.MIN_STAGEX;
}
/* Returns true if the stage has been cornered */
Stage.prototype.IsLeftCornered = function()
{
    return this.X >= STAGE.MAX_STAGEX;
} 


/*Clamps the X value to be between the min and max*/
Stage.prototype.ClampX = function(x,delta)
{
    if(this.IsLeftCornered() && ((x + delta) < STAGE.MIN_STAGEX))
    {
        delta = STAGE.MIN_STAGEX - x;
    }
    else if(this.IsRightCornered() && ((x + delta) > STAGE.MAX_STAGEX))
    {
        delta = STAGE.MAX_STAGEX - x;
    }


    return delta;
}

/*Clamps the Y value to be between the min and max*/
Stage.prototype.ClampY = function(y,delta)
{
    if((y + delta) < this.GetGroundY())
    {
        delta = this.GetGroundY() - y;
    }
    /*
    TODO: add support for a max Y value!
    else if((y + delta) > STAGE.CEILY)
    {
        delta = STAGE.CIELY - y;
    }
    */

    return delta;
}

/**/
Stage.prototype.FixX = function(amount)
{
    var stageMovedX = game_.match_.deltaX_;
    if(!!stageMovedX)
    {
        /*ensure the directions are the opposite*/
        amount = 0.5 * (Math.abs(amount) * (Math.abs(stageMovedX) / stageMovedX));
        this.MoveX(amount);
    }

}

/*Aligns the players with the stage.*/
Stage.prototype.AlignPlayersX = function()
{
    var match = this.GetMatch();

    for(var i = 0, length = match.teamA_.GetPlayers().length; i < length; ++i)
        match.teamA_.players_[i].AlignX(this.DeltaX);
    for(var i = 0, length = match.teamB_.GetPlayers().length; i < length; ++i)
        match.teamB_.players_[i].AlignX(this.DeltaX);
}

/*Aligns the players with the stage.*/
Stage.prototype.AlignPlayersY = function()
{
    var match = this.GetMatch();

    for(var i = 0, length = match.teamA_.GetPlayers().length; i < length; ++i)
        match.teamA_.players_[i].AlignY(this.GetGroundY());
    for(var i = 0, length = match.teamB_.GetPlayers().length; i < length; ++i)
        match.teamB_.players_[i].AlignY(this.GetGroundY());
}


/*Scrolls the stage along the X axis*/
Stage.prototype.MoveX = function(amount)
{
    var retVal = amount;
    var match = this.GetMatch();
    var left = this.GetPhysics().GetLeftMostPlayer();
    var right = this.GetPhysics().GetRightMostPlayer();

    var isPlayerLeftCornered = left.IsLeftCornered();
    var isPlayerRightCornered = right.IsRightCornered();
    var isStageRightCornered = this.IsRightCornered();
    var isStageLeftCornered = this.IsLeftCornered();

    var farLeftX = left.GetLeftX();
    var farRightX = right.GetRightX();

    var isLeft = amount < 0;
    var canMove = true;

    if(!(isPlayerLeftCornered && isPlayerRightCornered))
    {
        if(isLeft)
        {
            if(isPlayerRightCornered || isStageLeftCornered)
            {
                canMove = false;
            }
            else
            {
                var dest = (farRightX + amount);
                if(dest > STAGE.MAX_STAGEX)
                {
                    retVal = dest - STAGE.MAX_STAGEX;
                }
            }
        }
        else
        {
            if(isPlayerLeftCornered || isStageRightCornered)
            {
                canMove = false;
            }
            else
            {
                var dest = (farLeftX + amount);
                if(dest < STAGE.MIN_STAGEX)
                {
                    amount = -farLeftX;
                }
            }
        }

        if(canMove)
        {
            //retVal = match.ScrollX(-amount);
            retVal = this._MoveX(-amount);
        }
    }


    return retVal * 2;
}

/**/
Stage.prototype.ScrollY = function()
{
    if(!!this.CanMoveY)
    {
        this.CanMoveY = false;

        var y = this.GetMatch().GetHighestY();

        if(y > STAGE.VERT_SCROLL_Y) /*moving up*/
        {
            this.OffsetY = Math.max(STAGE.VERT_SCROLL_Y - y, this.MaxScrollY) * STAGE.SCROLLY_FACTOR;
        }
        else
        {
            this.OffsetY = 0;
        }


        this.AlignPlayersY();
    }
}

/*Checks for physics with the stage*/
Stage.prototype.ScrollX = function(amount,p1,p2,match,dontOverrideSign)
{

    /*p1 must be the leftmost or right most player*/
    var retVal = amount;

    if(this.GetPhysics().IsLeftMostPlayer(p1.id_))
    {
        p2 = this.GetPhysics().GetRightMostPlayer();
    }
    else if(this.GetPhysics().IsRightMostPlayer(p1.id_))
    {
        p2 = this.GetPhysics().GetLeftMostPlayer();
    }
    else
        return retVal * 2;

    var direction = 1;
    /*decouple the direction of the amount from the players direction since we are using absolute positions in this function*/
    if(!dontOverrideSign)
    {
        if(p1.direction_ > 0)
        {
            if(amount > 0) {direction = -1;amount = -Math.abs(amount);} else {direction = 1;amount = Math.abs(amount);}
        } 
        else
        {
            if(amount > 0) {direction = 1;amount = Math.abs(amount);} else {direction = -1; amount = -Math.abs(amount);}
        }
    }

    if(!p2)
    {
        this._MoveX(-amount,true);
        return retVal;
    }

    /*physics with stage*/
    var p1x0 = p1.GetX();
    var p1x1 = p1x0 + retVal;
    var p2x0 = p2.GetX();


    var p1LeftX = p1.GetLeftX();
    var p1RightX = p1.GetRightX();
    var p1NewLeftX = p1LeftX + amount;
    var p1NewRightX = p1RightX + amount;
    var p1MidX = p1LeftX + (p1RightX - p1LeftX)/2;
    var p1NewMidX = p1MidX + amount;

    var p2LeftX = p2.GetLeftX();
    var p2RightX = p2.GetRightX();
    var p2NewLeftX = p2LeftX + amount;
    var p2NewRightX = p2RightX + amount;
    var p2MidX = p2LeftX + (p2RightX - p2LeftX)/2;
    var p2NewMidX = p2MidX + amount;


    var fn = function(p2NewX, canCheck, isMovingBackwards, canIncreaseDeltaX)
    {
        var tmp = amount;
        var diffX = p2x0 - p1x1
        
        if(p1x1 < (p2x0 - tmp) && canCheck)
        {
            if(!!isMovingBackwards)
            {
                tmp = Math.min(diffX,amount * 2);
            }
        }

        if(!!canIncreaseDeltaX)
            tmp *= 4;

        this._MoveX(-tmp,false,p2NewX);
        return retVal;
    }

    var isP1InLeftThreshold = p1NewMidX >= CONSTANTS.MOVEMENT_THRESHOLD_LEFT;
    var isP2InLeftThreshold = p2NewMidX >= CONSTANTS.MOVEMENT_THRESHOLD_LEFT;
    var isP1InRightThreshold = p1NewMidX <= CONSTANTS.MOVEMENT_THRESHOLD_RIGHT;
    var isP2InRightThreshold = p2NewMidX <= CONSTANTS.MOVEMENT_THRESHOLD_RIGHT;
    var areBothPlayersInRightThreshold = isP1InRightThreshold && isP2InRightThreshold;
    var areBothPlayersInLeftThreshold = isP1InLeftThreshold && isP2InLeftThreshold;

    var isP1InThreshold = p1NewMidX >= CONSTANTS.MOVEMENT_THRESHOLD_LEFT && p1NewMidX <= CONSTANTS.MOVEMENT_THRESHOLD_RIGHT;
    var isP2InThreshold = p2NewMidX >= CONSTANTS.MOVEMENT_THRESHOLD_LEFT && p2NewMidX <= CONSTANTS.MOVEMENT_THRESHOLD_RIGHT;
    var areBothPlayersInThreshold = isP1InThreshold && isP2InThreshold;
    var isStageLeftCornered = this.X >= STAGE.MAX_STAGEX;
    var isStageRightCornered = this.X <= STAGE.MIN_STAGEX;
    var isStageCornered = isStageLeftCornered || isStageRightCornered;

    var isLeftPlayer = p1LeftX < p2LeftX;
    var leftCornerGap = isLeftPlayer ? p1LeftX : p2LeftX;
    var rightCornerGap = !isLeftPlayer ? STAGE.MAX_STAGEX - p1RightX : STAGE.MAX_STAGEX - p2RightX;
    var p2NewX = p2.GetX() + (p2.direction_) * amount;

    var hasLargerLeftGap = leftCornerGap > rightCornerGap;
    var hasLargerRightGap = !hasLargerLeftGap;
    var isP1InAnyThreshold = isP1InThreshold ||  (isStageLeftCornered && isP1InLeftThreshold) || (isStageRightCornered && isP1InRightThreshold);
    var isMovingBackwards = !((p1.direction_ == -1 && amount > 0) || (p1.direction_ == 1 && amount < 0));
    var canIncreaseDeltaX = p1.JumpedOverAPlayer() && this.GetPhysics().IsWithinDistanceX(p1,p2,CONSTANTS.SO_CLOSE);
    /*if both players are in the threshold, then the stage should not move*/
    if(areBothPlayersInThreshold)
    {
        //retVal *= 2;
    }
    /*if the stage is NOT cornered, and one of the players is outside of the threshold, then the stage can move*/
    else if(!isStageCornered && !areBothPlayersInThreshold)
    {
        retVal = fn.call(this,p2NewX,!isP1InAnyThreshold,isMovingBackwards,canIncreaseDeltaX);
    }
    /*if the stage is left cornered, and the cornered player has moved far enough, and one of the players is beyond one of the right threshold, then the stage can move*/
    else if (isStageLeftCornered && hasLargerLeftGap && !areBothPlayersInRightThreshold)
    {
        retVal = fn.call(this,p2NewX,!isP1InAnyThreshold,isMovingBackwards,canIncreaseDeltaX);
    }
    /*if the stage is right cornered, and the cornered player has moved far enough, and one of the players is beyond one of the left threshold, then the stage can move*/
    else if (isStageRightCornered && hasLargerRightGap && !areBothPlayersInLeftThreshold)
    {
        retVal = fn.call(this,p2NewX,!isP1InAnyThreshold,isMovingBackwards,canIncreaseDeltaX);
    }


    return retVal * 2;
}


Stage.prototype.Center = function()
{
    var screenWidth = GetWidth(window.document.body);
    var screenHeight = GetHeight(window.document.body);
    var element = window.document.getElementById("pnlStage");
    var w = parseInt(GetWidth(element));
    var diff = (screenWidth - w) / 2;
    element.style.left = diff + "px";
}

/*inits the background images*/
Stage.prototype.Init = function()
{
    var screenWidth = GetWidth(window.document.body);
    var screenHeight = GetHeight(window.document.body);

    var w = parseInt(GetWidth(this.Bg.element));
    if(!w) w = 0;
    var diff = (screenWidth - w) / 2;
    this.Bg.element.style.left = diff + "px";

    
    var diff0 = (screenWidth - parseFloat(this.BgImg0.element.width)) / 2;
    var diff1 = (screenWidth - parseFloat(this.BgImg1.element.width)) / 2;
    var img1Left = diff1 - diff;

    this.BgImg0.element.style.left = this.BgImg0.xOffset + "px";
    this.BgImg1.element.style.left = img1Left + "px";
    this.X = Math.abs(diff1 - diff);
    var elementWidth = parseFloat(this.Bg.element.style.width);
    this.MaxRight = img1Left - (this.BgImg1.element.width - STAGE.MAX_STAGEX) - img1Left;

    /*If the browser doesn't allow decimal places in pixel values, then we have to set the bgRate_ to 0.
    The far background will not scroll with the screen. You won't notice unless you know it's happening.*/
    /*
    var leftTest = parseFloat(this.BgImg0.element.style.left);
    leftTest += 0.01;
    this.BgImg0.element.style.left = leftTest + "px";

    if(leftTest != parseFloat(this.BgImg0.element.style.left))
        this.BgRate = 0;
    else
        this.BgRate = (this.BgImg0.element.width - elementWidth) / (this.BgImg1.element.width - elementWidth);
    */

    this.X0 = parseFloat(this.BgImg0.element.style.left);
    this.X1 = parseFloat(this.BgImg1.element.style.left);

    var bgImg0RightGap = parseInt(this.BgImg0.element.width) + parseInt(this.BgImg0.element.style.left) - w;
    var bgImg1RightGap = parseInt(this.BgImg1.element.width) + parseInt(this.BgImg1.element.style.left) - w;

    this.BgRate =  bgImg0RightGap / bgImg1RightGap;

    this._MoveX(0,true);
}
/* If any two players are at the edges of the screen, then the screen can not be moved */
Stage.prototype.CanScrollX = function ()
{
    var flag = true;
    var match = this.GetMatch();
    for(var i = 0; i < match.teamA_.GetPlayers().length; ++i)
    {
        if(match.teamA_.players_[i].GetX() == STAGE.MIN_X)
        {
            if(!flag) return false;
            flag = false;
        }
    }
    for(var i = 0; i < match.teamB_.GetPlayers().length; ++i)
    {
        if(match.teamB_.players_[i].GetX() == STAGE.MIN_X)
        {
            if(!flag) return false;
            flag = false;
        }
    }

    return true;
}


/* Scrolls the backgrounds horizontally */
Stage.prototype._MoveHoriz = function(amount,px)
{
    if(!this.CanScrollX())
    {
        this.DeltaX = 0;
        return;
    }

    if(px <= 0 || px >= STAGE.MAX_X)
    {
        amount = 0;
    }
    this.X0 += amount * this.BgRate;
    this.X1 += amount;

    this.X += amount;

    this.DeltaX = amount;
    if(this.X1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.DeltaX = 0;
        this.X0 = 0;
        this.X1 = 0;
        this.X = STAGE.MAX_STAGEX;
    }
    if(this.X1 < this.MaxRight)
    {
        //floating point error will cause them to be off a little, this will fix
        this.DeltaX = 0;
        this.X0 = this.MaxRightScroll;
        this.X1 = this.MaxRight;
        this.X = 0;
    }
    this.AlignPlayersX();
}

/* Scrolls the backgrounds horizontally */
Stage.prototype._MoveX = function(amount,dontAlignPlayers,px)
{
    if(!this.CanScrollX())
    {
        this.DeltaX = 0;
        return 0;
    }

    if(!!px && (px <= 0 || px >= STAGE.MAX_X))
    {
        amount = 0;
    }

    this.X0 += amount * this.BgRate;
    this.X1 += amount;

    this.X += amount;

    this.DeltaX = amount;
    if(this.X1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.X0 = this.MaxRightScroll;
        this.X1 = 0;
        !dontAlignPlayers
            ? this.DeltaX = 0
            : this.DeltaX = this.X - STAGE.MAX_STAGEX;
        this.X = STAGE.MAX_STAGEX;
    }
    if(this.X1 < this.MaxRight)
    {
        //floating point error will cause them to be off a little, this will fix
        this.X0 = this.MaxLeftScroll;
        this.X1 = this.MaxRight;
        !dontAlignPlayers
            ? this.DeltaX = 0
            : this.DeltaX = 0 - this.X;
        this.X = 0;
    }
    if(!dontAlignPlayers)
        this.AlignPlayersX();
    return this.DeltaX;
}

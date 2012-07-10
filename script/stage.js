var Stage = function(bg0XOffset)
{
    this.bgImg0_ =  {xOffset:0,element:window.document.getElementById("bg0")};
    this.bgImg1_ = {element:window.document.getElementById("bg1")};
    this.bg_ = {element:window.document.getElementById("pnlStage")};
    this.lastX_ = 0;
    this.x_ = 0;
    this.x0 = 0;
    this.x1 = 0;
    this.deltaX_ = 0;
    this.y_ = 0;
    this.deltaY_ = 0;

    this.bg0XOffset_ = bg0XOffset;
    this.bgRate_ = 0;
    this.maxLeftScroll_ = 0;
    this.maxRightScroll_ = 0;
    this.music_ = null;
}

Stage.prototype.GetGame = function() { return game_; }
Stage.prototype.GetMatch = function() { return this.GetGame().GetMatch(); }
Stage.prototype.GetPhysics = function() { return this.GetMatch().GetPhysics(); }

Stage.prototype.Set = function(params)
{
    this.bgImg0_.xOffset = params.bg0XOffset_;
    this.bgImg0_.element.src = params.bg0Img_;
    this.bgImg1_.element.src = params.bg1Img_;
    this.bgImg0_.element.className = params.name_ + "-bg0";
    this.bgImg1_.element.className = params.name_ + "-bg1";
    this.maxLeftScroll_  = params.maxLeftScroll_; 
    this.maxRightScroll_ = params.maxRightScroll_;

    this.music_ = "audio/" + params.name_.toLowerCase() + "/theme.zzz";
    soundManager_.Load(this.music_);
    this.fadeOutMusic_ = 0;
}

Stage.prototype.FadeOutMusic = function()
{
    this.fadeOutMusic_ = 1;
}
Stage.prototype.RestartMusic = function()
{
    soundManager_.Restart(this.music_);
}

Stage.prototype.PlayMusic = function()
{
    soundManager_.Play(this.music_,true);
}

Stage.prototype.PauseMusic = function()
{
    soundManager_.Pause(this.music_);
}

/**/
Stage.prototype.Pause = function()
{
    this.PauseMusic();
}

/**/
Stage.prototype.Resume = function()
{
    soundManager_.Resume(this.music_);
}

/**/
Stage.prototype.Release = function()
{
    this.PauseMusic();
    this.bgImg0_.element.src = "";
    this.bgImg1_.element.src = "";
    this.bgImg0_.element.className = "";
    this.bgImg1_.element.className = "";
}

Stage.prototype.FrameMove = function(frame)
{
    this.lastX_ = this.x_;
    this.deltaX_ = 0;
    this.deltaY_ = 0;

    if(!!this.fadeOutMusic_)
    {
        this.fadeOutMusic_ = false;
        soundManager_.FadeOut(this.music_);
    }
}

Stage.prototype.Render = function(frame)
{
    this.bgImg0_.element.style.left = this.x0 + "px";
    this.bgImg1_.element.style.left = this.x1 + "px";
}

/* Returns true if the stage has been cornered */
Stage.prototype.IsCornered = function()
{
    return this.IsRightCornered() || this.IsLeftCornered();
}
/* Returns true if the stage has been cornered */
Stage.prototype.IsRightCornered = function()
{
    return this.x_ <= STAGE.MIN_STAGEX;
}
/* Returns true if the stage has been cornered */
Stage.prototype.IsLeftCornered = function()
{
    return this.x_ >= STAGE.MAX_STAGEX;
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
    if((y + delta) < STAGE.FLOORY)
    {
        delta = STAGE.FLOORY - y;
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
    var stageMovedX = game_.GetMatch().deltaX_;
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

    for(var i = 0, length = match.GetTeamA().GetPlayers().length; i < length; ++i)
        match.GetTeamA().GetPlayer(i).AlignX(this.deltaX_);
    for(var i = 0, length = match.GetTeamB().GetPlayers().length; i < length; ++i)
        match.GetTeamB().GetPlayer(i).AlignX(this.deltaX_);
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
    var isStageLeftCornered = this.x_ >= STAGE.MAX_STAGEX;
    var isStageRightCornered = this.x_ <= STAGE.MIN_STAGEX;
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
Stage.prototype.Reset = function()
{
    var screenWidth = GetWidth(window.document.body);
    var screenHeight = GetHeight(window.document.body);

    var w = parseInt(GetWidth(this.bg_.element));
    if(!w) w = 0;
    var diff = (screenWidth - w) / 2;
    this.bg_.element.style.left = diff + "px";

    
    var diff0 = (screenWidth - parseFloat(this.bgImg0_.element.width)) / 2;
    var diff1 = (screenWidth - parseFloat(this.bgImg1_.element.width)) / 2;

    this.bgImg0_.element.style.left = this.bgImg0_.xOffset + "px";
    this.bgImg1_.element.style.left = (diff1 - diff) + "px";
    this.x_ = Math.abs(diff1 - diff);
    var elementWidth = parseFloat(this.bg_.element.style.width);

    /*If the browser doesn't allow decimal places in pixel values, then we have to set the bgRate_ to 0.
    The far background will not scroll with the screen. You won't notice unless you know it's happening.*/
    /*
    var leftTest = parseFloat(this.bgImg0_.element.style.left);
    leftTest += 0.01;
    this.bgImg0_.element.style.left = leftTest + "px";

    if(leftTest != parseFloat(this.bgImg0_.element.style.left))
        this.bgRate_ = 0;
    else
        this.bgRate_ = (this.bgImg0_.element.width - elementWidth) / (this.bgImg1_.element.width - elementWidth);
    */

    this.x0 = parseFloat(this.bgImg0_.element.style.left);
    this.x1 = parseFloat(this.bgImg1_.element.style.left);

    var bgImg0RightGap = parseInt(this.bgImg0_.element.width) + parseInt(this.bgImg0_.element.style.left) - w;
    var bgImg1RightGap = parseInt(this.bgImg1_.element.width) + parseInt(this.bgImg1_.element.style.left) - w;

    this.bgRate_ =  bgImg0RightGap / bgImg1RightGap;

    this._MoveX(0,true);
}
/* If any two players are at the edges of the screen, then the screen can not be moved */
Stage.prototype.CanScrollX = function ()
{
    var flag = true;
    var match = this.GetMatch();
    for(var i = 0; i < match.GetTeamA().GetPlayers().length; ++i)
    {
        if(match.GetTeamA().GetPlayer(i).GetX() == STAGE.MIN_X)
        {
            if(!flag) return false;
            flag = false;
        }
    }
    for(var i = 0; i < match.GetTeamB().GetPlayers().length; ++i)
    {
        if(match.GetTeamB().GetPlayer(i).GetX() == STAGE.MIN_X)
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
        this.deltaX_ = 0;
        return;
    }

    if(px <= 0 || px >= STAGE.MAX_X)
    {
        amount = 0;
    }
    this.x0 += amount * this.bgRate_;
    this.x1 += amount;

    this.x_ += amount;

    this.deltaX_ = amount;
    if(this.x1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.deltaX_ = 0;
        this.x0 = 0;
        this.x1 = 0;
        this.x_ = STAGE.MAX_STAGEX;
    }
    if(this.x1 < STAGE.MAX_BG1_SCROLL)
    {
        //floating point error will cause them to be off a little, this will fix
        this.deltaX_ = 0;
        this.x0 = this.maxRightScroll_;
        this.x1 = STAGE.MAX_BG1_SCROLL;
        this.x_ = 0;
    }
    this.AlignPlayersX();
}

/* Scrolls the backgrounds horizontally */
Stage.prototype._MoveX = function(amount,dontAlignPlayers,px)
{
    if(!this.CanScrollX())
    {
        this.deltaX_ = 0;
        return 0;
    }

    if(!!px && (px <= 0 || px >= STAGE.MAX_X))
    {
        amount = 0;
    }

    this.x0 += amount * this.bgRate_;
    this.x1 += amount;

    this.x_ += amount;

    this.deltaX_ = amount;
    if(this.x1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.x0 = this.maxRightScroll_;
        this.x1 = 0;
        !dontAlignPlayers
            ? this.deltaX_ = 0
            : this.deltaX_ = this.x_ - STAGE.MAX_STAGEX;
        this.x_ = STAGE.MAX_STAGEX;
    }
    if(this.x1 < STAGE.MAX_BG1_SCROLL)
    {
        //floating point error will cause them to be off a little, this will fix
        this.x0 = this.maxLeftScroll_;
        this.x1 = STAGE.MAX_BG1_SCROLL;
        !dontAlignPlayers
            ? this.deltaX_ = 0
            : this.deltaX_ = 0 - this.x_;
        this.x_ = 0;
    }
    if(!dontAlignPlayers)
        this.AlignPlayersX();
    return this.deltaX_;
}

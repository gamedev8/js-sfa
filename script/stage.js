var Stage = function()
{
    this.x_ = 0;
    this.x0_ = 0;
    this.x1_ = 0;
}

Stage.prototype.GetGame = function() { return game_; }
Stage.prototype.GetMatch = function() { return game_.match_; }

Stage.prototype.IsLeftCornered = function()
{
    return this.GetMatch().IsStageLeftCornered();
}

Stage.prototype.IsRightCornered = function()
{
    return this.GetMatch().IsStageRightCornered();
}

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


Stage.prototype.MoveX = function(amount)
{
    var retVal = amount;
    var match = this.GetMatch();
    var left = match.GetLeftMostPlayer();
    var right = match.GetRightMostPlayer();

    var isPlayerLeftCornered = left.IsLeftCornered();
    var isPlayerRightCornered = right.IsRightCornered();
    var isStageRightCornered = match.IsStageRightCornered();
    var isStageLeftCornered = match.IsStageLeftCornered();

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
            retVal = match.MoveStageX(-amount);
        }
    }


    return retVal * 2;
}



/*Checks for physics with the stage*/
Stage.prototype.MoveStageX = function(amount,p1,p2,match,dontOverrideSign)
{

    /*p1 must be the leftmost or right most player*/
    var retVal = amount;

    if(match.IsLeftMostPlayer(p1.id_))
    {
        p2 = match.GetRightMostPlayer();
    }
    else if(match.IsRightMostPlayer(p1.id_))
    {
        p2 = match.GetLeftMostPlayer();
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

    var fn = function(p2NewX)
    {
        //match.MoveStageHoriz(-amount,p2NewX);
        match.MoveStageX(-amount,false,p2NewX);
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
    var isStageLeftCornered = match.x_ >= STAGE.MAX_STAGEX;
    var isStageRightCornered = match.x_ <= STAGE.MIN_STAGEX;
    var isStageCornered = isStageLeftCornered || isStageRightCornered;

    var isLeftPlayer = p1LeftX < p2LeftX;
    var leftCornerGap = isLeftPlayer ? p1LeftX : p2LeftX;
    var rightCornerGap = !isLeftPlayer ? STAGE.MAX_STAGEX - p1RightX : STAGE.MAX_STAGEX - p2RightX;
    var p2NewX = p2.GetX() + (p2.direction_) * amount;

    var hasLargerLeftGap = leftCornerGap > rightCornerGap;
    var hasLargerRightGap = !hasLargerLeftGap;

    /*if both players are in the threshold, then the stage should not move*/
    if(areBothPlayersInThreshold)
    {
        //retVal *= 2;
    }
    /*if the stage is NOT cornered, and one of the players is outside of the threshold, then the stage can move*/
    else if(!isStageCornered && !areBothPlayersInThreshold)
    {
        fn(p2NewX);
    }
    /*if the stage is left cornered, and the cornered player has moved far enough, and one of the players is beyond one of the right threshold, then the stage can move*/
    else if (isStageLeftCornered && hasLargerLeftGap && !areBothPlayersInRightThreshold)
    {
        fn(p2NewX);
    }
    /*if the stage is right cornered, and the cornered player has moved far enough, and one of the players is beyond one of the left threshold, then the stage can move*/
    else if (isStageRightCornered && hasLargerRightGap && !areBothPlayersInLeftThreshold)
    {
        fn(p2NewX);
    }
    else
    {
        //retVal *= 2;
    }

    return retVal * 2;
}

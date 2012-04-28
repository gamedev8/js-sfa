var _Physics = function()
{
}

_Physics.prototype.GetMatch = function() { return game_.match_; }


_Physics.prototype.CollideX = function(amount,p1,p2)
{
    /*if there is a collision then try to move p2 out of the way of p1*/
    return amount;
}

_Physics.prototype.HasIntersection = function(a, b)
{
    if((a.HasState(FLAGS.IGNORE_COLLISIONS) || b.HasState(FLAGS.IGNORE_COLLISIONS)) || (a.ignoreCollisionsWith_ == b.id_) || (b.ignoreCollisionsWith_ == a.id_))
        return false;

    var retVal = false;
    var rect = a.GetRect();
    var otherRect = b.GetRect();
    var padding = 30;

    var hasP1RightIntersection = (rect.Right > (otherRect.Left+padding) && rect.Right < (otherRect.Right-padding));
    var hasP1LeftIntersection = (rect.Left > (otherRect.Left+padding) && rect.Left < (otherRect.Right-padding));
    var hasP1TopIntersection = (rect.Top > (otherRect.Bottom+padding) && rect.Top < (otherRect.Top-padding));
    var hasP1BottomIntersection = (rect.Bottom > (otherRect.Bottom+padding) && rect.Bottom < (otherRect.Top-padding));

    /*
    var hasP2RightIntersection = (otherRect.Right > rect.Left && otherRect.Right < rect.Right);
    var hasP2LeftIntersection = (otherRect.Left > rect.Left && otherRect.Left < rect.Right);
    var hasP2TopIntersection = (otherRect.Top > rect.Bottom && otherRect.Top < rect.Top);
    var hasP2BottomIntersection = (otherRect.Bottom > rect.Bottom && otherRect.Bottom < rect.Top);

    retVal = (hasP1RightIntersection   ? CONSTANTS.RIGHT : 0) 
            | (hasP1LeftIntersection   ? CONSTANTS.LEFT : 0)
            | (hasP1TopIntersection    ? CONSTANTS.UP : 0)
            | (hasP1BottomIntersection ? CONSTANTS.DOWN : 0)
            ;
    */

    retVal = (hasP1TopIntersection || hasP1BottomIntersection) && (hasP1RightIntersection || hasP1LeftIntersection);


    return retVal;
}

_Physics.prototype.GetPlayersAtPosition = function(rect,who,type)
{
    var team = who.team_;
    var temp = [];
    var retVal = [];
    var match = this.GetMatch();
    var PADDING = 1;
    var players = (team == CONSTANTS.TEAM1) ? match.teamB_.Players : match.teamA_.Players;
    var distance = 0;
    var otherRect = {};
    var hasP1RightIntersection = 0;
    var hasP1LeftIntersection = 0;
    var hasP1TopIntersetion = 0;
    var hasP1BottomIntersection = 0;
    var hasP2RightIntersection = 0;
    var hasP2LeftIntersection = 0;
    var hasP2TopIntersetion = 0;
    var hasP2BottomIntersection = 0;


    for(var i = 0, length = players.length; i < length; ++i)
    {
        if((who.HasState(FLAGS.IGNORE_COLLISIONS) || players[i].HasState(FLAGS.IGNORE_COLLISIONS)) || (who.ignoreCollisionsWith_ == players[i].id_) || (players[i].ignoreCollisionsWith_ == who.id_))
            continue;

        distance = 0;
        otherRect = players[i].GetRect();

        hasP1RightIntersection = (rect.Right >= otherRect.Left && rect.Right <= otherRect.Right);
        hasP1LeftIntersection = (rect.Left >= otherRect.Left && rect.Left <= otherRect.Right);
        hasP1TopIntersection = (rect.Top >= otherRect.Bottom && rect.Top <= otherRect.Top);
        hasP1BottomIntersection = (rect.Bottom >= otherRect.Bottom && rect.Bottom <= otherRect.Top);

        hasP2RightIntersection = (otherRect.Right >= rect.Left && otherRect.Right <= rect.Right);
        hasP2LeftIntersection = (otherRect.Left >= rect.Left && otherRect.Left <= rect.Right);
        hasP2TopIntersection = (otherRect.Top >= rect.Bottom && otherRect.Top <= rect.Top);
        hasP2BottomIntersection = (otherRect.Bottom >= rect.Bottom && otherRect.Bottom <= rect.Top);

        switch(type)
        {
            case CONSTANTS.RIGHT: /*moving right*/
            {
                if(hasP1RightIntersection && hasP1BottomIntersection) distance = rect.Right - otherRect.Left;
                break;
            }
            case CONSTANTS.LEFT: /*moving left*/
            {
                if(hasP1LeftIntersection && hasP1BottomIntersection) distance = rect.Left - otherRect.Right;
                break;
            }
            case CONSTANTS.UP: /*moving up*/
            {
                if((hasP1TopIntersection || hasP2TopIntersection) && (hasP1RightIntersection || hasP2RightIntersection)) distance = rect.Top - otherRect.Bottom;
                break;
            }
            case CONSTANTS.DOWN: /*moving down*/
            {
                if((hasP1BottomIntersection || hasP2BottomIntersection) && (hasP1RightIntersection || hasP2RightIntersection)) distance = rect.Bottom - otherRect.Top;
                break;
            }
        };

        if(!!distance) temp[temp.length] = {Distance:Math.abs(distance), Player:players[i]};
    }


    /*arrange the list of items from closest to farthest*/
    var indices = [];
    var maxDist = -1;
    var index = -1;
    while(temp.length > 0)
    {
        maxDist = -1;
        index = -1;
        for(var i = 0, length = temp.length; i < length; ++i)
        {
            if(temp[i].Distance > maxDist)
            {
                index = i;
                maxDist = temp[i].Distance;
            }
        }
        if(index > -1)
            retVal[retVal.length] = temp.splice(index,1)[0].Player;
    }

    return retVal;
}

_Physics.prototype.MoveX = function(amount,player,dontOverrideSign,canFixStageX)
{
    if(!!amount)
    {
        var originalAmount = amount;
        if(!dontOverrideSign)
        {
            /*the amount is relative to the players direction, so it must be converted to "left/right" positive being right, and negative being left*/
            if(player.direction_ > 0)
            {
                if(amount > 0) {amount = -Math.abs(amount);} else {amount = Math.abs(amount);}
            } 
            else
            {
                if(amount > 0) {amount = Math.abs(amount);} else {amount = -Math.abs(amount);}
            }
        }

        player.MoveCircleToBottom();
        var match = this.GetMatch();
        var myRect = player.GetRect();
        var stageFixX = 0;

        if(amount > 0) /*moving right*/
        {
            amount = match.stage_.ClampX(myRect.Right,amount);
            if(!amount) return amount;

            myRect.OldRight = myRect.Right;
            myRect.Right += amount;

            var collisions = this.GetPlayersAtPosition(myRect,player,CONSTANTS.RIGHT);
            for(var i = 0, length = collisions.length; i < length; ++i)
            {
                collisions[i].MoveCircleToTop();
                var otherRect = collisions[i].GetRect();

                var impededAmount = myRect.Right - otherRect.Left;
                var unimpededAmount = otherRect.Left - myRect.OldRight;

                var amountPushed = 0;
                if(!!impededAmount)
                {
                    if(collisions[i].IsRightCornered())
                        impededAmount = this.GetMatch().stage_.MoveX(impededAmount/2);

                    /*if both players are on the ground, or both players in air, then they can push each other*/
                    if((player.IsOnGround() && collisions[i].IsOnGround()) || (!player.IsOnGround() && !collisions[i].IsOnGround()) || (collisions[i].IsRightCornered()))
                    {
                        amountPushed = this.MoveX(impededAmount/2,collisions[i],true);
                    }
                    /*if a player is on the ground, then they can not push each other - unless room needs to be made for the airborne player to land*/
                    else if(player.y_ != collisions[i].y_)
                    {
                        amountPushed = 0;
                        //unimpededAmount = 0;
                        stageFixX = impededAmount;
                    }
                }

                amount = unimpededAmount + amountPushed;
            }
        }
        else /*moving left*/
        {
            amount = match.stage_.ClampX(myRect.Left,amount);
            if(!amount) return amount;

            myRect.OldLeft = myRect.Left;
            myRect.Left += amount;


            var collisions = this.GetPlayersAtPosition(myRect,player,CONSTANTS.LEFT);
            for(var i = 0, length = collisions.length; i < length; ++i)
            {
                collisions[i].MoveCircleToTop();
                var otherRect = collisions[i].GetRect();

                var impededAmount = myRect.Left - otherRect.Right;
                var unimpededAmount = otherRect.Right - myRect.OldLeft;

                var amountPushed = 0;
                if(!!impededAmount)
                {
                    if(collisions[i].IsLeftCornered())
                        impededAmount = this.GetMatch().stage_.MoveX(impededAmount/2);
                    /*if both players are on the ground, or both players in air, then they can push each other*/
                    if((player.IsOnGround() && collisions[i].IsOnGround()) || (!player.IsOnGround() && !collisions[i].IsOnGround()) || (collisions[i].IsRightCornered()))
                    {
                        amountPushed = this.MoveX(impededAmount/2,collisions[i],true);
                    }
                    /*if a player is on the ground, then they can not push each other - unless room needs to be made for the airborne player to land*/
                    else if(player.y_ != collisions[i].y_)
                    {
                        amountPushed = 0;
                        //unimpededAmount = 0;
                        stageFixX = impededAmount;
                    }
                }

                amount = unimpededAmount + amountPushed;
            }
        }
        amount = player.WarpX(amount,true);
        if(!!canFixStageX && !!stageFixX)
            this.GetMatch().stage_.FixX(stageFixX);
    }


    return amount;
}




/* Returns the amount that can actually be used */
_Physics.prototype.MoveY = function(amount,player)
{
    if(!!amount)
    {
        var myRect = player.GetRect();
        var myMidX = player.GetMidX();
        if(amount > 0) /*moving up*/
        {
            amount = this.GetMatch().stage_.ClampY(myRect.Top,amount);
            if(!amount) return amount;
            player.MoveCircleToTop();

            myRect.OldTop = myRect.Top;
            myRect.Top += amount;

            var collisions = this.GetPlayersAtPosition(myRect,player,CONSTANTS.UP);
            for(var i = 0, length = collisions.length; i < length; ++i)
            {
                var otherPlayer = collisions[i];
                otherPlayer.MoveCircleToBottom();
                var otherMidX = otherPlayer.GetMidX();
                var amountRejected = player.circle_.RejectX(otherPlayer.circle_);
                
                
                if(!!amountRejected)
                {
                    if(myMidX > otherMidX) /*on right side of the other player*/
                    {
                        amountRejected = Math.abs(amountRejected);
                        /*must move the current player away from the play that was contacted*/
                        if(player.IsRightCornered())
                            this.MoveX(-amountRejected,otherPlayer,true);
                        else
                            this.MoveX(amountRejected,player,true);
                    }
                    else /*on left side of other player*/
                    {
                        amountRejected = -Math.abs(amountRejected);
                        /*must move the current player away from the play that was contacted*/
                        if(player.IsLeftCornered())
                            this.MoveX(-amountRejected,otherPlayer,true);
                        else
                            this.MoveX(amountRejected,player,true);
                    }
                }
            }
        }
        else /*moving down*/
        {
            amount = this.GetMatch().stage_.ClampY(myRect.Bottom,amount);
            if(!amount) return amount;
            player.MoveCircleToBottom();

            myRect.OldBottom = myRect.Bottom;
            myRect.Bottom += amount;


            var collisions = this.GetPlayersAtPosition(myRect,player,CONSTANTS.DOWN);
            for(var i = 0, length = collisions.length; i < length; ++i)
            {
                var otherPlayer = collisions[i];
                var otherRect = otherPlayer.GetRect();
                otherPlayer.MoveCircleToTop();
                var otherMidX = otherPlayer.GetMidX();
                var amountRejected = player.circle_.RejectX(otherPlayer.circle_);
                
                if(!!amountRejected)
                {
                    if(myMidX > otherMidX) /*on right side of the other player*/
                    {
                        amountRejected = Math.abs(amountRejected);
                        /*must move the current player away from the play that was contacted*/
                        if(player.IsRightCornered())
                            this.MoveX(-amountRejected,otherPlayer,true);
                        else
                            this.MoveX(amountRejected,player,true);
                    }
                    else /*on left side of other player*/
                    {
                        amountRejected = -Math.abs(amountRejected);
                        /*must move the current player away from the play that was contacted*/
                        if(player.IsLeftCornered())
                            this.MoveX(-amountRejected,otherPlayer,true);
                        else
                            this.MoveX(amountRejected,player,true);
                    }
                }
                /*special case: when the airborne player is jumping and cornered*/
                else if(this.HasIntersection(player, otherPlayer) && (player.IsLeftCornered() || player.IsRightCornered()))
                {
                    if(myMidX > otherMidX) /*on right side of the other player*/
                    {
                        amountRejected = myRect.Left - otherRect.Right;
                        /*must move the current player away from the play that was contacted*/
                        this.MoveX(amountRejected,otherPlayer,true);
                    }
                    else /*on left side of other player*/
                    {
                        amountRejected = myRect.Right - otherRect.Left;
                        /*must move the current player away from the play that was contacted*/
                        this.MoveX(amountRejected,otherPlayer,true);
                    }
                }
            }
        }
        amount = player.WarpY(amount);
    }
    return amount;
}


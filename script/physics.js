var CreatePhysics = function()
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/

    var GetMatch_ = function() { return game_.GetMatch(); }
    var GetStage_ = function() { return GetMatch_().GetStage(); }

    var HasIntersection_ = function(a, b)
    {
        if((a.flags_.Player.Has(PLAYER_FLAGS.IGNORE_COLLISIONS) || b.flags_.Player.Has(PLAYER_FLAGS.IGNORE_COLLISIONS)) || (a.ignoreCollisionsWith_ == b.id_) || (b.ignoreCollisionsWith_ == a.id_))
            return false;

        var retVal = false;
        var rect = a.GetRect();
        var otherRect = b.GetRect();
        var padding = 30;

        var hasP1RightIntersection = (rect.Right > (otherRect.Left) && rect.Right < (otherRect.Right));
        var hasP1LeftIntersection = (rect.Left > (otherRect.Left) && rect.Left < (otherRect.Right));
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

    var GetPlayersAtPosition_ = function(rect,who,type)
    {
        var team = who.team_;
        var temp = [];
        var retVal = [];
        var match = GetMatch_();
        var PADDING = 1;
        var players = (team == CONSTANTS.TEAM1) ? match.teamB_.Players : match.teamA_.Players;
        var distance = 0;
        var otherRect = {};
        var hasP1RightIntersection = false;
        var hasP1ExistsingRightIntersection = false;
        var hasP1LeftIntersection = false;
        var hasP1ExistsingLeftIntersection = false;
        var hasP1TopIntersetion = false;
        var hasP1BottomIntersection = false;
        var hasP2RightIntersection = false;
        var hasP2LeftIntersection = false;
        var hasP2TopIntersetion = false;
        var hasP2BottomIntersection = false;


        for(var i = 0, length = players.length; i < length; ++i)
        {
            if((who.flags_.Player.Has(PLAYER_FLAGS.IGNORE_COLLISIONS) || players[i].flags_.Player.Has(PLAYER_FLAGS.IGNORE_COLLISIONS)) || (who.ignoreCollisionsWith_ == players[i].id_) || (players[i].ignoreCollisionsWith_ == who.id_))
                continue;

            distance = 0;
            otherRect = players[i].GetRect();

            hasP1RightIntersection = (rect.Right >= otherRect.Left && rect.Right <= otherRect.Right);
            hasP1ExistsingRightIntersection = !!rect.OldRight && (rect.OldRight >= otherRect.Left && rect.OldRight <= otherRect.Right);
            hasP1LeftIntersection = (rect.Left >= otherRect.Left && rect.Left <= otherRect.Right);
            hasP1ExistsingLeftIntersection = !!rect.OldLeft && (rect.OldLeft >= otherRect.Left && rect.OldLeft <= otherRect.Right);
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
                    else if(hasP1ExistsingRightIntersection && hasP1BottomIntersection) distance = -(rect.OldRight - otherRect.Left);
                    break;
                }
                case CONSTANTS.LEFT: /*moving left*/
                {
                    if(hasP1LeftIntersection && hasP1BottomIntersection) distance = rect.Left - otherRect.Right;
                    else if(hasP1ExistsingLeftIntersection && hasP1BottomIntersection) distance = -(rect.OldLeft - otherRect.Right);
                    break;
                }
                case CONSTANTS.LEFT_AND_CHECK_RIGHT: /*moving left, but checks for right side collision as well*/
                {
                    if((hasP1LeftIntersection || hasP1RightIntersection) && hasP1BottomIntersection) distance = rect.Left - otherRect.Right;
                    break;
                }
                case CONSTANTS.RIGHT_AND_CHECK_LEFT: /*moving right, but checks for left side collision as well*/
                {
                    if((hasP1LeftIntersection || hasP1RightIntersection) && hasP1BottomIntersection) distance = rect.Right - otherRect.Left;
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

    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/

    /* Provides simple collisions testing between players */
    var Physics = function()
    {
    }


    /*Test each player to see if the hit region intersects with them*/
    Physics.prototype.TryAttack = function(hitDelayFactor,hitID,frame,points,flagsToSend,attackFlags,p1,p2,damage,moveOverrideFlags,energyToAdd,behaviorFlags,invokedAnimationName,hitSound,blockSound)
    {
        if(p2.flags_.Player.Has(PLAYER_FLAGS.IGNORE_ATTACKS))
            return;
        /*need to reform the "invulernable" flags - there are too many*/
        if(p2.flags_.Player.Has(PLAYER_FLAGS.SUPER_INVULNERABLE) && !(behaviorFlags & BEHAVIOR_FLAGS.THROW))
            return;
        /*frame can not hit more than once*/
        if(p2.lastHitFrame_[p1.id_] == p1.GetHitFrameID(hitID))
            return;
        /*if the attack is a throw, it can not grab more than one player*/
        if(!!p1.grappledPlayerId_ && (p1.grappledPlayerId_ != p2.id_))
            return;
        if(p2.IsAirborne() && !!(attackFlags & ATTACK_FLAGS.CAN_AIR_JUGGLE))
        {
            //return;
        }
        else if(p2.flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE))
            return;
        var p1Left = p1.GetLeftX(true);
        var p1Right = p1.GetRightX(true);
        var p1Top = p1.GetBoxTop();
        var p1Bottom = p1.GetBoxBottom();

        var p2Left = p2.GetLeftX(true);
        var p2Right = p2.GetRightX(true);
        var p2Top = p2.GetOffsetBoxTop();
        var p2Bottom = p2.GetOffsetBoxBottom();

        var fx = 1;
        var fy = 1;

        if(p1.direction_ < 0)
        {
            for(var i = 0; i < points.length; ++i)
            {
                fx = points[i].Fx || fx;
                fy = points[i].Fy || fy;

                var x = p1Left + points[i].x;
                var y = p1Bottom + points[i].y;
                if(((points[i].x == -1) && !!p2.isBeingThrown_) || (x >= p2Left && x < p2Right && y >= p2Bottom && y < p2Top))
                {
                    p1.SetGiveHit(attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
                    p2.SetRegisteredHit(attackFlags,points[i].state,flagsToSend,frame,damage,energyToAdd,false,STAGE.MAX_STAGEX - x,y,p1.direction_,p1.id_,p1.GetHitFrameID(hitID),moveOverrideFlags,p1,fx, fy, behaviorFlags,invokedAnimationName,hitSound,blockSound);
                    break;
                }
            }
        }
        else
        {
            for(var i = 0; i < points.length; ++i)
            {
                fx = points[i].Fx || fx;
                fy = points[i].Fy || fy;

                var x = p1Right - points[i].x;
                var y = p1Bottom + points[i].y;
                if(((points[i].x == -1) && !!p2.isBeingThrown_) || ((x <= p2Right && x > p2Left && y >= p2Bottom && y < p2Top)))
                {
                    p1.SetGiveHit(attackFlags,hitDelayFactor,energyToAdd, behaviorFlags,p2);
                    p2.SetRegisteredHit(attackFlags,points[i].state,flagsToSend,frame,damage,energyToAdd,false,x,y,p1.direction_,p1.id_,p1.GetHitFrameID(hitID),moveOverrideFlags,p1,fx, fy, behaviorFlags,invokedAnimationName,hitSound,blockSound);
                    break;
                }
            }
        }
    }

    /*Handles projectiles hitting a player*/
    Physics.prototype.TryProjectileAttack = function(frame,projectile,p1,p2)
    {
        if(p2.flags_.Player.Has(PLAYER_FLAGS.IGNORE_ATTACKS))
            return;
        if(p2.flags_.Player.Has(PLAYER_FLAGS.SUPER_INVULNERABLE))
            return;
        //if(p2.flags_.Player.Has(PLAYER_FLAGS.DEAD))
        //    return;
        if(p2.flags_.Player.Has(PLAYER_FLAGS.IGNORE_PROJECTILES))
            return;
        if(p2.IsAirborne() && !!projectile && !!(projectile.flagsToSend_ & ATTACK_FLAGS.SUPER) && !!projectile.canJuggle_)
        {
            /*allows super fireballs to hit multiple times in the air*/
        }

        else if(p2.flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE) || !projectile)
            return;
        if(!projectile.CanHit(frame))
            return;
        var p2Left = p2.GetLeftX(true);
        var p2Right = p2.GetRightX(true);
        var p2Top = p2.GetOffsetBoxTop();
        var p2Bottom = p2.GetOffsetBoxBottom();

        var y0 = projectile.GetTop();
        var y1 = projectile.GetBottom();
        var x0 = 0;
        var x1 = 0;

        if(projectile.direction_ < 0)
        {
            x0 = projectile.GetBackX();
            x1 = projectile.GetFrontX();
            if(((x0 >= p2Left && x0 < p2Right) || (x1 >= p2Left && x1 < p2Right)) && ((y0 >= p2Bottom && y0 < p2Top) || (y1 >= p2Bottom && y1 < p2Top)))
            {
                /*Calculate a general hit poisition.
                Since this function use left zeroed only values, we must convert, so that the right can be zeroed as well*/
                var hitX = ((x1 - x0) / 2) + x0;
                if(p2.direction_ > 0)
                    hitX = STAGE.MAX_STAGEX - hitX;
                var hitY = ((y1 - y0) / 2) + y0;
                if(p2.SetRegisteredHit(projectile.attackState_,projectile.hitState_,projectile.flagsToSend_,frame,projectile.baseDamage_,projectile.energyToAdd_,true,hitX,hitY,projectile.direction_,p1.id_,null,null,null,projectile.fx_,projectile.fy_,0,0,projectile.hitSound_,projectile.blockSound_))
                {
                    p1.ChangeEnergy(projectile.energyToAdd_);
                    projectile.HitPlayer(frame);
                }
            }
            else
            {
                /*test against the other player's projectiles*/
                for(var i = 0; i < p2.projectiles_.length; ++i)
                    this.TryProjectileHitProjectile(frame,x0,x1,y0,y1,projectile,p2.projectiles_[i]);
            }
        }
        else
        {
            x0 = projectile.GetBackX();
            x1 = projectile.GetFrontX();
            if(((x1 >= p2Left && x1 < p2Right) || (x0 >= p2Left && x0 < p2Right)) && ((y0 >= p2Bottom && y0 < p2Top) || (y1 >= p2Bottom && y1 < p2Top)))
            {
                /*Calculate a general hit poisition.*/
                var hitX = ((x1 - x0) / 2) + x0;
                var hitY = ((y1 - y0) / 2) + y0;
                if(p2.SetRegisteredHit(projectile.attackState_,projectile.hitState_,projectile.flagsToSend_,frame,projectile.baseDamage_,projectile.energyToAdd_,true,hitX,hitY,projectile.direction_,p1.id_,null,null,null,projectile.fx_,projectile.fy_,0,0,projectile.hitSound_,projectile.blockSound_))
                {
                    p1.ChangeEnergy(projectile.energyToAdd_);
                    projectile.HitPlayer(frame);
                }
            }
            else
            {
                /*test against the other player's projectiles*/
                for(var i = 0; i < p2.projectiles_.length; ++i)
                    this.TryProjectileHitProjectile(frame,x0,x1,y0,y1,projectile,p2.projectiles_[i]);
            }
        }

    }
    /*Handles projectiles hitting another projectile*/
    Physics.prototype.TryProjectileHitProjectile = function(frame,x0,x1,y0,y1,projectile,otherProjectile)
    {
        if(!!projectile.isDisintegrating_ || !!otherProjectile.isDisintegrating_)
            return;
        if(!otherProjectile.isActive_)
            return;
        var otherProjectileBottom = parseInt(otherProjectile.element_.style.bottom);
        var otherProjectileTop = parseInt(otherProjectile.element_.style.bottom) + parseInt(otherProjectile.element_.style.height);
        var otherProjectileLeft = 0;
        var otherProjectileRight = 0;

        if(projectile.direction_ < 0)
        {
            otherProjectileRight = STAGE.MAX_STAGEX - parseInt(otherProjectile.element_.style.right);
            otherProjectileLeft = STAGE.MAX_STAGEX - parseInt(otherProjectile.element_.style.right) - parseInt(otherProjectile.element_.style.width);

            if(((x0 >= otherProjectileLeft && x0 < otherProjectileRight) || (x1 >= otherProjectileLeft && x1 < otherProjectileRight)) && ((y0 >= otherProjectileBottom && y0 < otherProjectileTop) || (y1 >= otherProjectileBottom && y1 < otherProjectileTop)))
            {
                /*the projectiles may nullify, or one may vaporize the other - e.g. super moves*/
                projectile.HitProjectile(frame,otherProjectile)
            }
        }
        else
        {
            otherProjectileLeft = parseInt(otherProjectile.element_.style.left);
            otherProjectileRight = parseInt(otherProjectile.element_.style.width) + parseInt(otherProjectile.element_.style.left);

            if(((x1 >= otherProjectileLeft && x1 < otherProjectileRight) || (x0 >= otherProjectileLeft && x0 < otherProjectileRight)) && ((y0 >= otherProjectileBottom && y0 < otherProjectileTop) || (y1 >= otherProjectileBottom && y1 < otherProjectileTop)))
            {
                /*the projectiles may nullify, or one may vaporize the other - e.g. super moves*/
                projectile.HitProjectile(frame,otherProjectile)
            }
        }
    }




    Physics.prototype.FixX = function(amount,player,dontOverrideSign,canFixStageX)
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
            var direction = amount / Math.abs(amount);

            player.MoveCircleToBottom();
            var match = GetMatch_();
            var myRect = player.GetRect();
            var stageFixX = 0;

            if(amount > 0) /*moving right*/
            {
                amount = match.stage_.ClampX(myRect.Right,amount);
                if(!amount) return amount;

                myRect.OldRight = myRect.Right;
                myRect.Right += amount;

                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.RIGHT_AND_CHECK_LEFT).reverse();
                for(var i = 0, length = collisions.length; i < length; ++i)
                {
                    collisions[i].MoveCircleToTop();
                    var otherRect = collisions[i].GetRect();

                    var impededAmount = myRect.Right - otherRect.Left;

                    if(!!impededAmount)
                    {
                        if(myRect.Right <= otherRect.Right)
                        {
                            this.MoveX(-impededAmount,player,true,false,true);
                        }
                        else
                        {
                            impededAmount = Math.abs(otherRect.Right - myRect.Left) * direction;
                            this.MoveX(impededAmount,player,true,false,true);
                        }
                    }
                }
            }
            else /*moving left*/
            {
                amount = match.stage_.ClampX(myRect.Left,amount);
                if(!amount) return amount;

                myRect.OldLeft = myRect.Left;
                myRect.Left += amount;


                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.LEFT_AND_CHECK_RIGHT).reverse();
                for(var i = 0, length = collisions.length; i < length; ++i)
                {
                    collisions[i].MoveCircleToTop();
                    var otherRect = collisions[i].GetRect();

                    var impededAmount = myRect.Left - otherRect.Right;

                    if(!!impededAmount)
                    {
                        if(myRect.Left >= otherRect.Left)
                        {
                            this.MoveX(-impededAmount,player,true,false,true);
                        }
                        else
                        {
                            impededAmount = Math.abs(myRect.Right - otherRect.Left) * direction;
                            this.MoveX(impededAmount,player,true,false,true);
                        }
                    }
                }
            }
        }


        return amount;
    }



    Physics.prototype.MoveX = function(amount,player,dontOverrideSign,canFixStageX,doubleImpededAmount)
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
            var match = GetMatch_();
            var myRect = player.GetRect();
            var stageFixX = 0;

            if(amount > 0) /*moving right*/
            {
                amount = match.stage_.ClampX(myRect.Right,amount);
                if(!amount) return amount;

                myRect.OldRight = myRect.Right;
                myRect.Right += amount;

                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.RIGHT);
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
                            impededAmount = GetStage_().MoveX(impededAmount/2);

                        /*if both players are on the ground, or both players in air, then they can push each other*/
                        if((player.IsOnGround() && collisions[i].IsOnGround()) || (!player.IsOnGround() && !collisions[i].IsOnGround()) || (collisions[i].IsRightCornered()))
                        {
                            amountPushed = this.MoveX(!!doubleImpededAmount ? impededAmount : impededAmount/2,collisions[i],true,false,true);
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
                /*if the player is right cornered, then other players must be moved out of the way*/
                if(player.IsRightCornered())
                {
                    collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.LEFT);
                    for(var i = 0, length = collisions.length; i < length; ++i)
                    {
                        collisions[i].MoveCircleToTop();
                        var otherRect = collisions[i].GetRect();

                        var impededAmount = myRect.Left - otherRect.Right;

                        var amountPushed = 0;
                        if(!!impededAmount)
                        {
                            if(collisions[i].IsLeftCornered())
                                impededAmount = GetStage_().MoveX(impededAmount/2);

                            this.MoveX(impededAmount,collisions[i],true);
                        }
                    }
                }

            }
            else /*moving left*/
            {
                amount = match.stage_.ClampX(myRect.Left,amount);
                if(!amount) return amount;

                myRect.OldLeft = myRect.Left;
                myRect.Left += amount;


                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.LEFT);
                for(var i = 0, length = collisions.length; i < length; ++i)
                {
                    collisions[i].MoveCircleToTop();
                    var otherRect = collisions[i].GetRect();

                    var impededAmount = myRect.Left - otherRect.Right;
                    var unimpededAmount =  otherRect.Right - myRect.OldLeft;

                    var amountPushed = 0;
                    if(!!impededAmount)
                    {
                        if(collisions[i].IsLeftCornered())
                            impededAmount = GetStage_().MoveX(impededAmount/2);
                        /*if both players are on the ground, or both players in air, then they can push each other*/
                        if((player.IsOnGround() && collisions[i].IsOnGround()) || (!player.IsOnGround() && !collisions[i].IsOnGround()) || (collisions[i].IsRightCornered()))
                        {
                            amountPushed = this.MoveX(!!doubleImpededAmount ? impededAmount : impededAmount/2,collisions[i],true,false,true);
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
                /*if the player is left cornered, then other players must be moved out of the way*/
                if(player.IsLeftCornered())
                {
                    collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.RIGHT);
                    for(var i = 0, length = collisions.length; i < length; ++i)
                    {
                        collisions[i].MoveCircleToTop();
                        var otherRect = collisions[i].GetRect();

                        var impededAmount = myRect.Right - otherRect.Left;

                        if(!!impededAmount)
                        {
                            if(collisions[i].IsRightCornered())
                                impededAmount = GetStage_().MoveX(impededAmount/2);

                            this.MoveX(impededAmount,collisions[i],true);
                        }
                    }
                }

            }
            amount = player.WarpX(amount,true);
            if(!!canFixStageX && !!stageFixX)
                GetStage_().FixX(stageFixX);
        }


        return amount;
    }



    /* Returns the amount that can actually be used */
    Physics.prototype.MoveY = function(amount,player)
    {
        if(!!amount)
        {
            var myRect = player.GetRect();
            var myMidX = player.GetMidX();
            if(amount > 0) /*moving up*/
            {
                amount = GetStage_().ClampY(myRect.Top,amount);
                if(!amount) return amount;
                player.MoveCircleToTop();

                myRect.OldTop = myRect.Top;
                myRect.Top += amount;

                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.UP);
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
                amount = GetStage_().ClampY(myRect.Bottom,amount);
                if(!amount) return amount;
                player.MoveCircleToBottom();

                myRect.OldBottom = myRect.Bottom;
                myRect.Bottom += amount;


                var collisions = GetPlayersAtPosition_(myRect,player,CONSTANTS.DOWN);
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
                    else if(HasIntersection_(player, otherPlayer) && (player.IsLeftCornered() || player.IsRightCornered()))
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




    /*Returns the player closest to the left side of the screen*/
    Physics.prototype.GetLeftMostPlayer = function()
    {
        var match = GetMatch_();

        var minX = STAGE.MAX_STAGEX;
        var retVal = null;
        for(var i = 0, length = match.teamA_.Players.length; i < length; ++i)
        {
            if(match.teamA_.Players[i].GetLeftX() < minX)
            {
                minX = match.teamA_.Players[i].GetLeftX();
                retVal = match.teamA_.Players[i];
            }
        }
        for(var i = 0, length = match.teamB_.Players.length; i < length; ++i)
        {
            if(match.teamB_.Players[i].GetLeftX() < minX)
            {
                minX = match.teamB_.Players[i].GetLeftX();
                retVal = match.teamB_.Players[i];
            }
        }

        return retVal;
    }
    /*Returns the player closest to the right side of the screen*/
    Physics.prototype.GetRightMostPlayer = function()
    {
        var match = GetMatch_();

        var maxX = STAGE.MIN_STAGEX;
        var retVal = null;
        for(var i = 0, length = match.teamA_.Players.length; i < length; ++i)
        {
            if(match.teamA_.Players[i].GetLeftX() > maxX)
            {
                maxX = match.teamA_.Players[i].GetLeftX();
                retVal = match.teamA_.Players[i];
            }
        }
        for(var i = 0, length = match.teamB_.Players.length; i < length; ++i)
        {
            if(match.teamB_.Players[i].GetLeftX() > maxX)
            {
                maxX = match.teamB_.Players[i].GetLeftX();
                retVal = match.teamB_.Players[i];
            }
        }

        return retVal;
    }
    /**/
    Physics.prototype.IsLeftMostPlayer = function(id)
    {
        var p = this.GetLeftMostPlayer();
        return p.id_ == id;
    }
    /**/
    Physics.prototype.IsRightMostPlayer = function(id)
    {
        var p = this.GetRightMostPlayer();
        return p.id_ == id;
    }

    /*checks if any player from ther other team is within the given distance*/
    Physics.prototype.CanGrapple = function(team,x,y,distance,mustBeAirborne)
    {
        var match = GetMatch_();
        switch(team)
        {
            case CONSTANTS.TEAM1:
            {
                for(var i = 0; i < match.teamB_.Players.length; ++i)
                    if((Math.abs(x - match.teamB_.Players[i].GetMidX()) < distance)
                        && (Math.abs(y - match.teamB_.Players[i].y_) < distance)
                        && (!(match.teamB_.Players[i].flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE)))
                        && ((mustBeAirborne === null)
                            || (mustBeAirborne == (match.teamB_.Players[i].IsAirborne())))
                        && (!match.teamB_.Players[i].grappledPlayer_
                        && (!match.teamB_.Players[i].currentAnimation_.Animation.moveOverrideFlags_.HasOverrideFlag(OVERRIDE_FLAGS.THROW)))
                        && (!match.teamB_.Players[i].HasRegisteredHit())
                        )
                        return true;
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < match.teamA_.Players.length; ++i)
                    if((Math.abs(x - match.teamA_.Players[i].GetMidX()) < distance)
                        && (Math.abs(y - match.teamA_.Players[i].y_) < distance)
                        && (!(match.teamA_.Players[i].flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE)))
                        && ((mustBeAirborne === null)
                            || (mustBeAirborne == (match.teamA_.Players[i].IsAirborne())))
                        && (!match.teamA_.Players[i].grappledPlayer_)
                        && (!match.teamA_.Players[i].currentAnimation_.Animation.moveOverrideFlags_.HasOverrideFlag(OVERRIDE_FLAGS.THROW))
                        && (!match.teamA_.Players[i].HasRegisteredHit())
                        )
                        return true;
                break;
            }
        }
        return false;
    }

    /*checks if players are within the given distance*/
    Physics.prototype.IsWithinDistanceX = function(p1,p2,distance)
    {
        var x = p1.GetMidX();
        return (
               (Math.abs(x - p2.GetMidX()) < distance)
            );
    }

    /*Returns true if any player from the other team is on the left*/
    Physics.prototype.IsAnyPlayerFromOtherTeamMoreLeft = function(x,team)
    {
        var match = GetMatch_();
        switch(team)
        {
            case CONSTANTS.TEAM1:
            {
                for(var i = 0; i < match.teamB_.Players.length; ++i)
                    if(match.teamB_.Players[i].GetMidX() < x)
                        return true;
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < match.teamA_.Players.length; ++i)
                    if(match.teamA_.Players[i].GetMidX() < x)
                        return true;
                break;
            }
        }
        return false;
    }

    /*Returns true if any player from the other team is on the right*/
    Physics.prototype.IsAnyPlayerFromOtherTeamMoreRight = function(x,team)
    {
        var match = GetMatch_();
        switch(team)
        {
            case CONSTANTS.TEAM1:
            {
                for(var i = 0; i < match.teamB_.Players.length; ++i)
                    if(match.teamB_.Players[i].GetMidX() > x)
                        return true;
                break;
            }
            case CONSTANTS.TEAM2:
            {
                for(var i = 0; i < match.teamA_.Players.length; ++i)
                    if(match.teamA_.Players[i].GetMidX() > x)
                        return true;
                break;
            }
        }
        return false;
    }

    return new Physics();
}
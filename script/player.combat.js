Player.prototype.CanHit = function(otherFlags)
{
    if(!!(otherFlags.Player & PLAYER_FLAGS.IGNORE_COLLISIONS))
        return false;
    return true;
}

Player.prototype.OnProjectileMoved = function(id,x,y)
{
    this.onProjectileMovedFn_(id,x,y);
}

Player.prototype.OnProjectileGone = function(id)
{
    this.onProjectileGoneFn_(id);
}

/*Allows blocking from a projectile, if the projectile is within range*/
Player.prototype.SetAllowBlockFromProjectile = function(frame,isAllowed,projectileId,x,y)
{
    if(!!isAllowed)
    {
        this.SetAllowAirBlock(projectileId,frame,true,x,y);
    }
    else
    {
        this.SetAllowAirBlock(projectileId,frame,false,x,y)
    }
}
Player.prototype.AddBlockableAttack = function(attackId)
{
    for(var i = 0, length = this.blockedAttacks_.length; i < length; ++i)
    {
        if(this.blockedAttacks_[i].AttackId == attackId)
        {
            return true;
        }
    }
    return false;
}
Player.prototype.RemoveBlockableAttack = function(attackId)
{
    for(var i = 0, length = this.blockedAttacks_.length; i < length; ++i)
    {
        if(this.blockedAttacks_[i].AttackId == attackId)
        {
            this.blockedAttacks_.splice(i,1);
            return;
        }
    }
}
Player.prototype.AddBlockableAirAttack = function(attackId)
{
    for(var i = 0, length = this.blockedAirAttacks_.length; i < length; ++i)
    {
        if(this.blockedAirAttacks_[i].AttackId == attackId)
        {
            return true;
        }
    }
    return false;
}
Player.prototype.RemoveBlockableAirAttack = function(attackId)
{
    for(var i = 0, length = this.blockedAirAttacks_.length; i < length; ++i)
    {
        if(this.blockedAirAttacks_[i].AttackId == attackId)
        {
            this.blockedAirAttacks_.splice(i,1);
            return;
        }
    }
}
/*Allows/disallows blocking*/
Player.prototype.SetAllowBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        if(this.GetDistanceFromSq(x,y) > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
            return;

        /*Check if the move is already blockable*/
        if(!this.AddBlockableAttack(attackId))
            this.blockedAttacks_[this.blockedAttacks_.length] = {AttackId:attackId};
        
        /*allow the block animation*/
        this.flags_.Pose.Add(POSE_FLAGS.ALLOW_BLOCK);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        this.RemoveBlockableAttack(attackId)
        /*if there are no more attacks, remove the ability to block*/
        if(this.blockedAttacks_.length == 0)
        {
            this.flags_.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            if(this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING))
                this.ignoreHoldFrame_ = true; /*ignores the hold frame on the current animation, which then causes the animation to continue, and then end*/
        }
    }
}
/*Allows/disallows air blocking*/
Player.prototype.SetAllowAirBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        if(this.GetDistanceFromSq(x,y) > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
            return;

        /*Check if the move is already blockable*/
        if(!this.AddBlockableAirAttack(attackId))
            this.blockedAirAttacks_[this.blockedAirAttacks_.length] = {AttackId:attackId};
        /*allow block*/
        this.flags_.Pose.Add(POSE_FLAGS.ALLOW_AIR_BLOCK);
        /*air attacks can also be blocked on the ground*/
        this.SetAllowBlock(attackId,frame,isAllowed,x,y);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        this.RemoveBlockableAirAttack(attackId)

        /*if there are no more attacks, remove the ability to block*/
        if(this.blockedAirAttacks_.length == 0)
            this.flags_.Pose.Remove(POSE_FLAGS.ALLOW_AIR_BLOCK);
        /*air attacks can also be blocked on the ground*/
        this.SetAllowBlock(attackId,frame,isAllowed,x,y);
    }
}


/*Forced computation on the player who is being thrown by this player*/
Player.prototype.HandleGrapple = function(forcedFrameIndex,frame,stageX,stageY)
{
    if(!!this.grappledPlayer_.currentAnimation_.Animation)
    {
        var forcedFrame = this.grappledPlayer_.currentAnimation_.Animation.baseAnimation_.frames_[forcedFrameIndex];
        if(!!forcedFrame)
        {
            var offsetX = forcedFrame.X;
            var offsetY = forcedFrame.Y;

            var x = this.ConvertX(this.x_ + offsetX);
            var y = this.ConvertY(this.y_ + offsetY);

            this.grappledPlayer_.SetX(x);
            this.grappledPlayer_.SetY(y);

            this.grappledPlayer_.SetCurrentFrame(forcedFrame,frame,stageX,stageY,true);
        }
    }
}


/*Allows the players projectile to advance*/
Player.prototype.HandleProjectiles = function(frame,stageX,stageY)
{
    var i = 0;
    var hasActiveProjectiles = false;
    while(i < this.projectiles_.length)
    {
        if(this.projectiles_[i].IsActive())
        {
            hasActiveProjectiles = true;
            this.projectileAttackFn_(frame,this.projectiles_[i].Advance(frame,stageX,stageY));
        }
        else if(this.projectiles_[i].IsDisintegrating())
            this.projectileAttackFn_(frame,this.projectiles_[i].Advance(frame,stageX,stageY));
        ++i;
    }
    /*No projectiles are active, clear the projectile state and allow the player to throw another projectile*/
    if(!hasActiveProjectiles)
        this.flags_.Combat.Remove(COMBAT_FLAGS.PROJECTILE_ACTIVE);
}

/*Handles attacking players on the opposing team*/
Player.prototype.HandleAttack = function(frame, moveFrame)
{
    if(!!(moveFrame.FlagsToSet.Combat & COMBAT_FLAGS.CAN_BE_BLOCKED))
    {
        this.mustClearAllowBlock_ = true;
        this.onStartAttackFn_(this.currentAnimation_.ID);
    }
    if(!!(moveFrame.FlagsToClear.Combat & COMBAT_FLAGS.CAN_BE_BLOCKED))
    {
        this.mustClearAllowBlock_ = false;
        this.onEndAttackFn_(this.currentAnimation_.ID);
    }
    if(!!(moveFrame.FlagsToSet.Combat & COMBAT_FLAGS.CAN_BE_AIR_BLOCKED))
    {
        this.mustClearAllowAirBlock_ = true;
        this.onStartAirAttackFn_(this.currentAnimation_.ID);
    }
    if(!!(moveFrame.FlagsToClear.Combat & COMBAT_FLAGS.CAN_BE_AIR_BLOCKED))
    {
        this.mustClearAllowAirBlock_ = false;
        this.onEndAirAttackFn_(this.currentAnimation_.ID);
    }

    this.attackFn_(moveFrame.HitDelayFactor, moveFrame.HitID,frame,moveFrame.HitPoints,moveFrame.FlagsToSend,moveFrame.AttackState,moveFrame.BaseDamage,this.currentAnimation_.Animation.moveOverrideFlags_,moveFrame.EnergyToAdd,this.currentAnimation_.Animation.behaviorFlags_,this.currentAnimation_.Animation.invokedAnimationName_);
}

/*If the player gets hit - this function must be called to set all of the details of the hit*/
Player.prototype.SetRegisteredHit = function(attackState,hitState,flags,frame,damage,energyToAdd,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,otherPlayer,fx,fy,behaviorFlags,invokedAnimationName)
{
    this.lastHitFrame_[who] = hitID;
    this.registeredHit_.AttackState = attackState;
    this.registeredHit_.HitState = hitState;
    this.registeredHit_.Flags = flags;
    this.registeredHit_.Frame = frame;
    this.registeredHit_.Damage = damage;
    this.registeredHit_.EnergyToAdd = energyToAdd;
    this.registeredHit_.IsProjectile = isProjectile;
    this.registeredHit_.HitX = hitX;
    this.registeredHit_.HitY = hitY;
    this.registeredHit_.Who = who;
    this.registeredHit_.AttackDirection = attackDirection;
    this.registeredHit_.HitID = hitID;
    this.registeredHit_.MoveOverrideFlags = moveOverrideFlags;
    this.registeredHit_.AttackForceX = fx || 1;
    this.registeredHit_.AttackForceY = fy || 1;
    this.registeredHit_.BehaviorFlags = behaviorFlags;
    this.registeredHit_.InvokedAnimationName = invokedAnimationName;
    this.registeredHit_.OtherPlayer = otherPlayer;

    this.GetMatch().RegisterAction(new ActionDetails(this.currentAnimation_.Animation.moveOverrideFlags_,this,who,isProjectile,frame,otherPlayer));

    if(!!isProjectile && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.flags_.Combat & COMBAT_FLAGS.IGNORE_PROJECTILES))
        return false;
    return true;
}

Player.prototype.RegisterHit = function(frame)
{
    this.TakeHit(this.registeredHit_.AttackState
                ,this.registeredHit_.HitState
                ,this.registeredHit_.Flags
                ,this.registeredHit_.Frame
                ,this.registeredHit_.Damage
                ,this.registeredHit_.EnergyToAdd
                ,this.registeredHit_.IsProjectile
                ,this.registeredHit_.HitX
                ,this.registeredHit_.HitY
                ,this.registeredHit_.AttackDirection
                ,this.registeredHit_.Who
                ,this.registeredHit_.HitID
                ,this.registeredHit_.MoveOverrideFlags
                ,this.registeredHit_.AttackForceX
                ,this.registeredHit_.AttackForceY
                ,this.registeredHit_.OtherPlayer
                ,this.registeredHit_.BehaviorFlags
                ,this.registeredHit_.InvokedAnimationName);

}
/**/
Player.prototype.IsBlockingLow = function()
{
    return this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING) && this.flags_.Pose.Has(POSE_FLAGS.CROUCHING);
}
Player.prototype.IsBlockingInAir = function()
{
    return this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING) && this.IsAirborne();
}
Player.prototype.IsBlockingHigh = function()
{
    return this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING) && !this.flags_.Pose.Has(POSE_FLAGS.CROUCHING);
}
Player.prototype.IsBlocking = function()
{
    return this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING);
}
/*The player was just hit and must react*/
Player.prototype.TakeHit = function(attackState,hitState,flags,frame,damage,energyToAdd,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,fx,fy,otherPlayer,behaviorFlags,invokedAnimationName)
{
    this.freezeUntilFrame_ = 0;
    if(!!otherPlayer)
        otherPlayer.giveHitFn_(frame)
    this.lastHitFrame_[who] = hitID;
    this.lastHit_ = {x:hitX,y:hitY};
    if(!!isProjectile && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.flags_.Combat && !!(this.currentAnimation_.Animation.flags_.Combat.Has(COMBAT_FLAGS.IGNORE_PROJECTILES)))
        return false;
    var move = null;
    var slideAmount = 0;
    var hitDelayFactor_ = 1;

    if(!!(attackState & ATTACK_FLAGS.THROW_START))
    {
        /*can not block throws*/
        this.SetDirection(otherPlayer.direction_ * -1);
        if(this.IsBlocking())
        {
            /*player attempt to block is overriden*/
            this.flags_.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.flags_.Player.Remove(PLAYER_FLAGS.BLOCKING);
        }

        this.isBeingThrown_ = true;

        if(!!invokedAnimationName)
        {
            move = this.moves_[invokedAnimationName];
            if(!!move)
            {
                move.controllerAnimation_ = otherPlayer.currentAnimation_;
            }
        }
    }
    else if(!!(attackState & ATTACK_FLAGS.HITS_LOW) && this.IsBlockingLow()
        || !!(attackState & ATTACK_FLAGS.HITS_HIGH) && this.IsBlockingHigh()
        || !(attackState & ATTACK_FLAGS.HITS_LOW) && !(attackState & ATTACK_FLAGS.HITS_HIGH) && this.IsBlocking())
    {
        /*allow special moves to do some damage*/
        damage = 0;
        energyToAdd = 0;

        if(!!(attackState & ATTACK_FLAGS.LIGHT)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_LIGHT_HRSLIDE / 2;}
        if(!!(attackState & ATTACK_FLAGS.MEDIUM)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_MEDIUM_HRSLIDE / 2;}
        if(!!(attackState & ATTACK_FLAGS.HARD)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_HARD_HRSLIDE / 2;}
        this.freezeUntilFrame_ = frame + CONSTANTS.DEFAULT_BLOCK_FREEZE_FRAME_COUNT;
    }
    else
    {
        if(this.IsBlocking())
        {
            /*player attempt to block was overriden*/
            this.flags_.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.flags_.Player.Remove(PLAYER_FLAGS.BLOCKING);
        }

        if(!!damage)
            this.IncCombo();

        if(!!energyToAdd)
            energyToAdd = Math.ceil(energyToAdd/2);

        if(this.flags_.Pose.Has(POSE_FLAGS.CROUCHING))
        {
            if(!!(attackState & ATTACK_FLAGS.TRIP)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            if(!!(attackState & ATTACK_FLAGS.LIGHT)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cLN")];}
            if(!!(attackState & ATTACK_FLAGS.MEDIUM)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cMN")];}
            if(!!(attackState & ATTACK_FLAGS.HARD)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cHN")];}
        }
        else
        {
            if(!!(attackState & ATTACK_FLAGS.TRIP) && !!(hitState & HIT_FLAGS.NEAR)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            else if(!!(attackState & ATTACK_FLAGS.KNOCKDOWN)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];}

            else if(!!(attackState & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sLN")];}
            else if(!!(attackState & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sLF")];}

            else if(!!(attackState & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sMN")];}
            else if(!!(attackState & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sMF")];}

            else if(!!(attackState & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sHN")];}
            else if(!!(attackState & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sHF")];}
        }
    }

    if(!!move)
    {
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_});
        if(!!(attackState & ATTACK_FLAGS.THROW_START))
        {
            this.currentAnimation_.StartFrame = otherPlayer.currentAnimation_.StartFrame;
            this.ignoreCollisionsWith_ = otherPlayer.id_;
            return;
        }
    }
    /*get the direction of the attack*/
    var relAttackDirection = 0;
    if(!!isProjectile)
        relAttackDirection = this.GetProjectileDirection(attackDirection);
    else
        relAttackDirection = this.GetAttackDirection(attackDirection);


    this.TakeDamage(damage);
    this.ChangeEnergy(energyToAdd);
    if(this.IsDead())
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        /*if any player is dead, then the whole team is dead.*/
        this.ForceTeamLose(frame,attackDirection);
        if(!!this.isBeingThrown_)
        {
            this.isBeingThrown_ = false;
            attackDirection = -this.GetRelativeDirection(attackDirection);
            this.Eject(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        }
        else
        {
            this.KnockDownDefeat(frame,attackDirection);
        }

        return;
    }

    if(!!(attackState & ATTACK_FLAGS.THROW_EJECT))
    {
        this.isBeingThrown_ = false;
        attackDirection = -this.GetRelativeDirection(attackDirection);
        this.Eject(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        hitDelayFactor_ = 0;
    }
    else if(this.IsBlocking())
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.StartSlide(frame, slideAmount,attackDirection,fx);
    }
    else if(!!(attackState & ATTACK_FLAGS.TRIP))
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.TakeTrip(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackState & ATTACK_FLAGS.FLOOR_AIRBORNE_HARD) && !!this.IsAirborne())
    {
        attackDirection = this.GetRelativeDirection(attackDirection);

        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.Eject(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackState & ATTACK_FLAGS.KNOCKDOWN) || (!!(attackState & ATTACK_FLAGS.FLOOR_AIRBORNE) && !!this.IsAirborne()))
    {
        attackDirection = this.GetRelativeDirection(attackDirection);

        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.KnockDown(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(this.IsAirborne())
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        /*TODO: remove rear hit flags unless it is a special move*/
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.TakeAirborneHit(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!(attackState & ATTACK_FLAGS.THROW_START))
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.StartSlide(frame, slideAmount,attackDirection,fx);
    }

    if(!!(attackState & ATTACK_FLAGS.NO_HIT_DELAY))
        hitDelayFactor_ = 0;

    this.SetHoldFrame(this.baseTakeHitDelay_ * hitDelayFactor_);
    return true;
}
/*Setting "this.winningFrame_" will cause this player to execute its win animation after its current animation is done.*/
Player.prototype.JustWon = function(frame)
{
    this.forceImmobile_ = true;
    this.winningFrame_ = frame;
}
Player.prototype.ForceWin = function(frame)
{
    var name = this.winAnimationNames_[Math.ceil(Math.random() * this.winAnimationNames_.length) - 1];
    if(name == undefined) name = CONSTANTS.DEFAULT_WIN_ANIMATION_NAME;
    this.ExecuteAnimation(name);
}
/*Player is defeated*/
Player.prototype.ForceLose = function(attackDirection)
{
    this.forceImmobile_ = true;
    this.TakeDamage(this.GetHealth());
    var frame = this.GetMatch().GetCurrentFrame();
    var direction = attackDirection || -this.direction_;

    this.flags_.Player.Add(PLAYER_FLAGS.DEAD);
    this.KnockDownDefeat(frame,attackDirection);
}
/*Player gets is defeated*/
Player.prototype.ForceTeamLose = function(frame,attackDirection)
{
    this.forceImmobile_ = true;
    this.TakeDamage(this.GetHealth());
    var frame = this.GetMatch().GetCurrentFrame();
    var direction = attackDirection || -this.direction_;

    this.flags_.Player.Add(PLAYER_FLAGS.DEAD);
    this.GetMatch().DefeatTeam(this.team_,attackDirection,frame,this.id_);
}
Player.prototype.KnockDownDefeat = function(frame,attackDirection)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_dead")];
    if(!!move)
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.flags_.Player.Add(PLAYER_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.vx_,move.vy_);
    }
}

/*Player gets back up*/
Player.prototype._DEBUG_Getup = function()
{
    this.flags_.Player.Remove(PLAYER_FLAGS.DEAD);
    this.TakeDamage(-20);
    var move = this.moves_[_c3("_",MISC_FLAGS.NONE,"_getup")];
    this.SetCurrentAnimation({Animation:move,StartFrame:this.GetMatch().GetCurrentFrame(),Direction:this.direction_,AttackDirection:this.direction_});
}
/*Player gets tripped*/
Player.prototype.TakeTrip = function(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];
    if(!!move)
    {
        this.flags_.Pose.Add(POSE_FLAGS.AIRBORNE);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.PerformJump(direction * move.vx_ * fx,move.vy_ * fy);
    }
}
/*Player gets knocked down*/
Player.prototype.Eject = function(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_eject")];
    if(!!move)
    {
        //attackDirection = this.GetRelativeDirection(attackDirection);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.flags_.Pose.Add(POSE_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.vx_ * fx,move.vy_ * fy);
    }
}
/*Player gets knocked down*/
Player.prototype.KnockDown = function(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];
    if(!!move)
    {
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.flags_.Pose.Add(POSE_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.vx_ * fx,move.vy_ * fy);
    }
}
/*Player takes a hit while in the air*/
Player.prototype.TakeAirborneHit = function(attackState,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.AIRBORNE,"_hr_air")];
    if(!!move)
    {   
        var direction = -this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.PerformJump(direction * move.vx_ * fx,move.vy_ * fy);
    }
    
}
/*Sets up the closure to be called later*/
Player.prototype.SetGiveHit = function(attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
{
    if(!!(behaviorFlags & BEHAVIOR_FLAGS.THROW))
        this.grappledPlayerId_ = p2.id_;

    this.giveHitFn_ = (function(thisValue,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
    {
        return function (frame)
        {
            thisValue.GiveHit(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
        }
    })(this,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
}
/*This player just hit the other player*/
Player.prototype.GiveHit = function(frame,attackState,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer)
{
    if(!!(behaviorFlags & BEHAVIOR_FLAGS.THROW))
    {
        if(!this.grappledPlayer_)
            this.grappledPlayer_ = otherPlayer;
        else
        {
            this.HandleGrapple(this.currentAnimation_.FrameIndex-1,frame,0,0);
            this.grappledPlayer_ = null;
            this.grappledPlayerId_ = "";
            hitDelayFactor = 0;
        }
    }

    this.ChangeEnergy(energyToAdd);
    this.SetHoldFrame(this.baseGiveHitDelay_ * hitDelayFactor);
}

/*allows the animation to store some initial coordinates*/
Player.prototype.SetLastHit = function(animation,type,offsetX,offsetY)
{
    animation.direction_ = this.direction_;
    switch(type)
    {
        case CONSTANTS.USE_PLAYER_TOP:
        {
            animation.initialX_ = this.GetX() - this.headOffsetX_;
            animation.initialY_ = this.GetBoxTop() - this.headOffsetY_;
            break;
        };
        case CONSTANTS.USE_PLAYER_BOTTOM:
        {
            animation.initialX_ = this.GetX() + (this.width_/Math.ceil(Math.random() * 8));
            animation.initialY_ = this.y_ + 20;
            break;
        };
        case CONSTANTS.USE_PLAYER_XY:
        {
            animation.initialX_ = this.GetX() + offsetX;
            animation.initialY_ = STAGE.FLOORY + offsetY;
            break;
        };
        default:
        {
            animation.initialX_ = this.lastHit_.x;
            animation.initialY_ = this.lastHit_.y;
            break;
        }

    };
    animation.initialPlayerX_ = this.x_;
    animation.initialPlayerY_ = this.y_;
    animation.initialStageX_ = this.GetMatch().x_;
    animation.initialStageY_ = this.GetMatch().y_;
}

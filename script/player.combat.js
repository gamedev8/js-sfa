Player.prototype.HasRegisteredHit = function() { return !!this.registeredHit_.HitID; }

Player.prototype.IsVulnerable = function()
{
    var retVal = this.Flags.Player.Has(PLAYER_FLAGS.INVULNERABLE)
                || this.Flags.Player.Has(PLAYER_FLAGS.SUPER_INVULNERABLE)
                || this.Flags.Player.Has(PLAYER_FLAGS.IGNORE_ATTACKS)
        ;
    return !retVal;
}

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
            return true;
        }
    }
    return false;
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
            return true;
        }
    }
    return false;
}
/*Allows/disallows blocking*/
Player.prototype.SetAllowBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        var dist = this.GetDistanceFromSq(x,y);
        if(dist > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
        {
            if(!this.IsBlocking())
                return this.SetAllowBlock(attackId,frame,false,x,y);
            else if(dist > (CONSTANTS.MAX_BLOCK_DISTANCE_SQ2))
                return this.SetAllowBlock(attackId,frame,false,x,y);
        }

        /*Check if the move is already blockable*/
        if(!this.AddBlockableAttack(attackId))
            this.blockedAttacks_[this.blockedAttacks_.length] = {AttackId:attackId};
        
        /*allow the block animation*/
        this.Flags.Pose.Add(POSE_FLAGS.ALLOW_BLOCK);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        if(this.RemoveBlockableAttack(attackId))
        {
            /*if there are no more attacks, remove the ability to block*/
            if(this.blockedAttacks_.length == 0)
            {
                this.Flags.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
                /*if the player is blocking, then remove it*/
                if(this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING))
                    this.ignoreHoldFrame_ = true; /*ignores the hold frame on the current animation, which then causes the animation to continue, and then end*/
            }
        }
    }
}
/*Allows/disallows air blocking*/
Player.prototype.SetAllowAirBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        var dist = this.GetDistanceFromSq(x,y);
        if(dist > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
        {
            if(!this.IsBlocking())
                return this.SetAllowAirBlock(attackId,frame,false,x,y);
            else if(dist > (CONSTANTS.MAX_BLOCK_DISTANCE_SQ2))
                return this.SetAllowAirBlock(attackId,frame,false,x,y);
        }

        /*Check if the move is already blockable*/
        if(!this.AddBlockableAirAttack(attackId))
            this.blockedAirAttacks_[this.blockedAirAttacks_.length] = {AttackId:attackId};
        /*allow block*/
        this.Flags.Pose.Add(POSE_FLAGS.ALLOW_AIR_BLOCK);
        /*air attacks can also be blocked on the ground*/
        this.SetAllowBlock(attackId,frame,isAllowed,x,y);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        if(this.RemoveBlockableAirAttack(attackId))
        {
            /*if there are no more attacks, remove the ability to block*/
            if(this.blockedAirAttacks_.length == 0)
                this.Flags.Pose.Remove(POSE_FLAGS.ALLOW_AIR_BLOCK);
            /*air attacks can also be blocked on the ground*/
            this.SetAllowBlock(attackId,frame,isAllowed,x,y);
        }
    }
}

/*returns true if a grapple can be performed*/
Player.prototype.TryStartGrapple = function(move,frame)
{
    distance = move.GrappleDistance;
    airborneFlags = move.GetOtherPlayerAirborneFlags();

    var retVal = false;
    var grappledPlayer = this.GetPhysics().GetGrappledPlayer(this.team_,this.GetAbsFrontX(),this.y_,distance,airborneFlags,this.IsAirborne());
    if(!!grappledPlayer)
    {
        retVal = true;

        var firstFrame = move.GetFrame(0);
        this.SetGiveHit(firstFrame.AttackFlags,firstFrame.HitDelayFactor,firstFrame.EnergyToAdd,move.BehaviorFlags,grappledPlayer);
        grappledPlayer.TakeHit(firstFrame.AttackFlags,HIT_FLAGS.NEAR,firstFrame.FlagsToSend,frame,frame,firstFrame.BaseDamage,firstFrame.EnergyToAdd,false,0,0,this.direction_,this.id_,firstFrame.HitID,move.OverrideFlags,0,0,this,move.BehaviorFlags,move.InvokedAnimationName,firstFrame.FlagsToSet.HitSound,firstFrame.FlagsToSet.BlockSound);
        //this.attackFn_(moveFrame.HitDelayFactor, moveFrame.HitID,frame,moveFrame.HitPoints,moveFrame.FlagsToSend,moveFrame.AttackFlags,moveFrame.BaseDamage,this.currentAnimation_.Animation.OverrideFlags,moveFrame.EnergyToAdd,this.currentAnimation_.Animation.BehaviorFlags,this.currentAnimation_.Animation.InvokedAnimationName,moveFrame.FlagsToSet.HitSound,moveFrame.FlagsToSet.BlockSound);

    }

    return retVal;
}

/*returns true if this player can be grappled*/
Player.prototype.CanBeGrappled = function(x,y,distance,airborneFlags,isAirborne)
{
    /*player can not have a grapple on him already!*/
    if(this.HasPendingGrapple() || this.IsBeingGrappled())
        return false;

    if((airborneFlags == AIRBORNE_FLAGS.YES) && !this.IsAirborne())
        return false;
    else if((airborneFlags == AIRBORNE_FLAGS.NO) && this.IsAirborne())
        return false;
    else if((airborneFlags == AIRBORNE_FLAGS.EQUAL) && (isAirborne != this.IsAirborne()))
        return false;

    var retVal = false;

    if((Math.abs(x - this.GetMidX()) < distance)
        && (Math.abs(y - this.y_) < distance)
        && (!(this.Flags.Player.Has(PLAYER_FLAGS.INVULNERABLE)))
        && (!this.grappledPlayer_
        && (!this.currentAnimation_.Animation.OverrideFlags.HasOverrideFlag(OVERRIDE_FLAGS.THROW)))
        && (!this.HasRegisteredHit())
        )
            retVal = true;

    return retVal;
}

/*Forced computation on the player who is being thrown by this player*/
Player.prototype.HandleGrapple = function(forcedFrameIndex,frame,stageX,stageY)
{
    if(!!this.grappledPlayer_.currentAnimation_.Animation && !!this.grappledPlayer_.IsBeingGrappled())
    {
        var forcedFrame = this.grappledPlayer_.currentAnimation_.Animation.BaseAnimation.frames_[forcedFrameIndex];
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

Player.prototype.ClearProjectiles = function()
{
    for(var i = 0, length = this.projectiles_.length; i < length; ++i)
    {
        this.projectiles_[i].Cancel(true);
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
        this.Flags.Combat.Remove(COMBAT_FLAGS.PROJECTILE_ACTIVE);
}

/*Handles attacking players on the opposing team*/
Player.prototype.HandleAttack = function(frame, moveFrame)
{
    this.isInAttackFrame_ = true;
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

    this.attackFn_(moveFrame.HitDelayFactor, moveFrame.HitID,frame,moveFrame.HitPoints,moveFrame.FlagsToSend,moveFrame.AttackFlags,moveFrame.BaseDamage,this.currentAnimation_.Animation.OverrideFlags,moveFrame.EnergyToAdd,this.currentAnimation_.Animation.BehaviorFlags,this.currentAnimation_.Animation.InvokedAnimationName,moveFrame.FlagsToSet.HitSound,moveFrame.FlagsToSet.BlockSound);
}

/*If the player gets hit - this function must be called to set all of the details of the hit*/
Player.prototype.SetRegisteredHit = function(attackFlags,hitState,flags,frame,damage,energyToAdd,isGrapple,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,otherPlayer,fx,fy,behaviorFlags,invokedAnimationName,hitSound,blockSound)
{
    this.lastHitFrame_[who] = hitID;
    this.registeredHit_.AttackFlags = attackFlags;
    this.registeredHit_.HitState = hitState;
    this.registeredHit_.Flags = flags;
    this.registeredHit_.Frame = frame - 2;
    this.registeredHit_.StartFrame = this.currentAnimation_.StartFrame;
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
    this.registeredHit_.HitSound = hitSound || 0;
    this.registeredHit_.BlockSound = blockSound || 0;
    this.registeredHit_.OtherPlayer = otherPlayer;

    if(!!isGrapple)
        this.SetPendingGrapple(true);

    this.GetMatch().RegisterAction(new ActionDetails(this.currentAnimation_.Animation.OverrideFlags,this,who,isProjectile,isGrapple,this.currentAnimation_.StartFrame,frame,otherPlayer));

    if(!!isProjectile && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.IGNORE_PROJECTILES))
        return false;
    return true;
}

Player.prototype.RegisterHit = function(frame)
{
    this.TakeHit(this.registeredHit_.AttackFlags
                ,this.registeredHit_.HitState
                ,this.registeredHit_.Flags
                ,this.registeredHit_.StartFrame
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
                ,this.registeredHit_.InvokedAnimationName
                ,this.registeredHit_.HitSound
                ,this.registeredHit_.BlockSound
                );

}
/**/
Player.prototype.IsBlockingLow = function()
{
    return this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING) && this.Flags.Pose.Has(POSE_FLAGS.CROUCHING);
}
Player.prototype.IsBlockingInAir = function()
{
    return this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING) && this.IsAirborne();
}
Player.prototype.IsBlockingHigh = function()
{
    return this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING) && !this.Flags.Pose.Has(POSE_FLAGS.CROUCHING);
}
Player.prototype.IsBlocking = function()
{
    return this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING);
}
Player.prototype.DidntHit = function(frame)
{
}
/**/
Player.prototype.StopGettingDizzy = function()
{
    this.dizzyValue_ = 0;
}
/**/
Player.prototype.ClearDizzy = function()
{
    this.StopGettingDizzy();
    if(!!this.otherAnimations_.Dizzy[this.dizzyIndex_])
    {
        this.otherAnimations_.Dizzy[this.dizzyIndex_].Animation.Reset();
        this.otherAnimations_.Dizzy[this.dizzyIndex_].Element.style.display = "none";
    }
    this.GetFlags().Player.Remove(PLAYER_FLAGS.DIZZY);
    if(!this.IsDead())
        this.GoToStance();
    this.StopDizzyAudio();
}
Player.prototype.ChangeDizzy = function(value)
{
    if(this.IsDead())
        return;
    this.dizzyValue_ = Math.max(this.dizzyValue_ + value, 0);
}
Player.prototype.GetDizzyValue = function(value)
{
    return this.dizzyValue_;
}
Player.prototype.IsDizzy = function()
{
    return this.GetFlags().Player.Has(PLAYER_FLAGS.DIZZY);
}
Player.prototype.IncreaseDizziness = function(frame,attackFlags,damage)
{
    if(this.IsDead())
        return;
    var value = 0;

    if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {value += CONSTANTS.LIGHT_INCREASE_DIZZY;}
    if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)) {value += CONSTANTS.MEDIUM_INCREASE_DIZZY;}
    if(!!(attackFlags & ATTACK_FLAGS.HARD)) {value += CONSTANTS.HARD_INCREASE_DIZZY;}

    this.ChangeDizzy(value);
}
Player.prototype.DecreaseDizziness = function(frame)
{
    if(this.IsDizzy() && this.IsVulnerable())
    {
        var value = CONSTANTS.DECREASE_DIZZY;
        this.ChangeDizzy(value);

        if(!this.GetDizzyValue())
            this.ClearDizzy();
    }
}

/*The player was just hit and must react*/
Player.prototype.TakeHit = function(attackFlags,hitState,flags,startFrame,frame,damage,energyToAdd,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,fx,fy,otherPlayer,behaviorFlags,invokedAnimationName,hitSound,blockSound)
{
    if(this.IsDizzy())
        this.ClearDizzy();

    this.registeredHit_.HitID = null;
    this.freezeUntilFrame_ = 0;
    if(!!otherPlayer)
    {
        otherPlayer.giveHitFn_(frame);
        if(otherPlayer.IsAirborne() && this.IsAirborne())
            fx = 1;
    }
    this.lastHitFrame_[who] = hitID;
    this.lastHit_ = {x:hitX,y:hitY};
    if(!!isProjectile && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.Flags.Combat & COMBAT_FLAGS.IGNORE_PROJECTILES))
        return false;
    var move = null;
    var slideAmount = 0;
    var hitDelayFactor_ = 1;
    var isSpecial = attackFlags && ATTACK_FLAGS.SPECIAL || !!isProjectile;

    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        /*can not block throws*/
        this.SetDirection(otherPlayer.direction_ * -1);
        if(this.IsBlocking())
        {
            /*player attempt to block is overriden*/
            this.Flags.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.Flags.Player.Remove(PLAYER_FLAGS.BLOCKING);
        }

        this.SetBeingGrappled(true);

        if(!!invokedAnimationName)
        {
            move = this.moves_[invokedAnimationName];
            if(!!move)
            {
                move.ControllerAnimation = otherPlayer.currentAnimation_;
            }
        }
        this.QueueGrappleSound();
    }
    else if(!!(attackFlags & ATTACK_FLAGS.HITS_LOW) && this.IsBlockingLow()
        || !!(attackFlags & ATTACK_FLAGS.HITS_HIGH) && this.IsBlockingHigh()
        || !(attackFlags & ATTACK_FLAGS.HITS_LOW) && !(attackFlags & ATTACK_FLAGS.HITS_HIGH) && this.IsBlocking())
    {
        this.StopGettingDizzy();
        /*allow special moves to do some damage*/
        if(!!isSpecial)
        {
            damage = Math.floor(Math.max(damage * 0.05, 1));
        }
        else
        {
            damage = 0;
            energyToAdd = 0;
        }

        if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_LIGHT_HRSLIDE / 2;}
        if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_MEDIUM_HRSLIDE / 2;}
        if(!!(attackFlags & ATTACK_FLAGS.HARD)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_HARD_HRSLIDE / 2;}
        this.freezeUntilFrame_ = frame + CONSTANTS.DEFAULT_BLOCK_FREEZE_FRAME_COUNT;
    }
    else
    {
        if(this.IsBlocking())
        {
            /*player attempt to block was overriden*/
            this.Flags.Pose.Remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.Flags.Player.Remove(PLAYER_FLAGS.BLOCKING);
        }

        if(!!damage)
            this.IncCombo();

        if(!!energyToAdd && !(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT)))
            energyToAdd = Math.ceil(energyToAdd/2);

        if(this.Flags.Pose.Has(POSE_FLAGS.CROUCHING))
        {
            if(!!(attackFlags & ATTACK_FLAGS.TRIP)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cLN")];}
            if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cMN")];}
            if(!!(attackFlags & ATTACK_FLAGS.HARD)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cHN")];}
        }
        else
        {
            if(!!(attackFlags & ATTACK_FLAGS.TRIP) && !!(hitState & HIT_FLAGS.NEAR)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            else if(!!(attackFlags & ATTACK_FLAGS.KNOCKDOWN)) {move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];}

            else if(!!(attackFlags & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sLN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sLF")];}

            else if(!!(attackFlags & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sMN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sMF")];}

            else if(!!(attackFlags & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sHN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_sHF")];}
        }
    }

    if(!!move)
    {
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_});
        if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
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
    if(this.IsDead() && !this.isLosing_)
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        /*if any player is dead, then the whole team is dead.*/
        this.ForceTeamLose(frame,attackDirection);
        if(!!this.IsBeingGrappled())
        {
            this.SetBeingGrappled(false);
            attackDirection = -this.GetRelativeDirection(attackDirection);
            this.Eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        }
        else
        {
            this.KnockDownDefeat(frame,attackDirection);
        }

        this.QueueHitSound(hitSound);
        return;
    }

    this.IncreaseDizziness(frame,attackFlags,damage);

    if((this.GetDizzyValue() >= this.maxDizzyValue_) && !this.IsDizzy())
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.GetDizzy(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT) && !!this.IsBeingGrappled())
    {
        this.SetBeingGrappled(false);
        attackDirection = -this.GetRelativeDirection(attackDirection);
        this.Eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        hitDelayFactor_ = 0;
    }
    else if(this.IsBlocking())
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.StartSlide(frame, slideAmount,attackDirection,fx);
        if(!!isProjectile)
            this.QueueBlockProjectileSound();
        else
            this.QueueBlockSound();
    }
    else if(!!(attackFlags & ATTACK_FLAGS.TRIP))
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.TakeTrip(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.FLOOR_AIRBORNE_HARD) && !!this.IsAirborne())
    {
        attackDirection = this.GetRelativeDirection(attackDirection);

        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.Eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.KNOCKDOWN) || (!!(attackFlags & ATTACK_FLAGS.FLOOR_AIRBORNE) && !!this.IsAirborne()))
    {
        attackDirection = this.GetRelativeDirection(attackDirection);

        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.KnockDown(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(this.IsAirborne())
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        /*TODO: remove rear hit flags unless it is a special move*/
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.TakeAirborneHit(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        if(!!flags)
            this.SpawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.StartSlide(frame, slideAmount,attackDirection,fx);
    }

    if(!!(attackFlags & ATTACK_FLAGS.NO_HIT_DELAY))
        hitDelayFactor_ = 0;

    this.SetHoldFrame(this.baseTakeHitDelay_ * hitDelayFactor_);
    if(!this.IsBlocking())
        this.QueueHitSound(hitSound);

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
    this.ClearInput();
}
/*Player is defeated*/
Player.prototype.ForceLose = function(attackDirection)
{
    this.isLosing_ = true;
    this.forceImmobile_ = true;
    this.TakeDamage(this.GetHealth());
    var frame = this.GetMatch().GetCurrentFrame();
    var direction = attackDirection || -this.direction_;
    this.AbortThrow();

    this.Flags.Player.Add(PLAYER_FLAGS.DEAD);
    this.KnockDownDefeat(frame,attackDirection);
    this.QueueSound("audio/" + this.name_.toLowerCase() + "/dead.zzz");
    this.ClearInput();
    this.ClearDizzy();
}
/*Player gets is defeated*/
Player.prototype.ForceTeamLose = function(frame,attackDirection)
{
    if(!this.isLosing_)
    {
        this.isLosing_ = true;
        this.forceImmobile_ = true;
        this.TakeDamage(this.GetHealth());
        var frame = this.GetMatch().GetCurrentFrame();
        var direction = attackDirection || -this.direction_;

        this.Flags.Player.Add(PLAYER_FLAGS.DEAD);
        this.GetMatch().DefeatTeam(this.team_,attackDirection,frame,this.id_);
    }
    this.ClearDizzy();
}
Player.prototype.KnockDownDefeat = function(frame,attackDirection)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_dead")];
    if(!!move)
    {
        attackDirection = this.GetRelativeDirection(attackDirection);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.Flags.Player.Add(PLAYER_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.Vx,move.Vy);
        this.ClearDizzy();
    }
}
Player.prototype.GetDizzy = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    if(this.IsDead())
        return;

    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_dizzy")];
    if(!!move)
    {
        this.ResetCombo();
        this.GetFlags().Player.Add(PLAYER_FLAGS.DIZZY);
        this.GetFlags().Player.Add(PLAYER_FLAGS.IMMOBILE);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.Flags.Player.Add(PLAYER_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.Vx,move.Vy);
        this.SpawnDizzy(frame);
        this.QueueDizzy();
        this.maxDizzyValue_ += CONSTANTS.DIZZY_INC;
    }
}

/*Player gets back up*/
Player.prototype._DEBUG_Getup = function()
{
    this.Flags.Player.Remove(PLAYER_FLAGS.DEAD);
    this.TakeDamage(-20);
    var move = this.moves_[_c3("_",MISC_FLAGS.NONE,"_getup")];
    this.SetCurrentAnimation({Animation:move,StartFrame:this.GetMatch().GetCurrentFrame(),Direction:this.direction_,AttackDirection:this.direction_});
}
/*Player gets tripped*/
Player.prototype.TakeTrip = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];
    if(!!move)
    {
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.PerformJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player falls*/
Player.prototype.Drop = function()
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_eject")];
    if(!!move)
    {
        this.SetBeingGrappled(false);
        //attackDirection = this.GetRelativeDirection(attackDirection);
        var direction = this.GetAttackDirection(-this.direction_);
        this.SetCurrentAnimation({Animation:move,StartFrame:this.GetGame().GetCurrentFrame(),Direction:this.direction_,AttackDirection:direction,Vx:0,Vy:0});
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.Vx * 0,move.Vy * 0);
    }
}
/*Player aborts throw*/
Player.prototype.AbortThrow = function()
{
    if(!!this.grappledPlayer_)
    {
        this.grappledPlayer_.Drop();
        this.grappledPlayer_ = null;
        this.grappledPlayerId_ = "";
        hitDelayFactor = 0;
    }
}
/*Player gets knocked down*/
Player.prototype.Eject = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_eject")];
    if(!!move)
    {
        //attackDirection = this.GetRelativeDirection(attackDirection);
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move, StartFrame:frame, Direction:this.direction_, AttackDirection:direction, Vx:move.Vx * fx, Vy:move.Vy * fy});
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player gets knocked down*/
Player.prototype.KnockDown = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];
    if(!!move)
    {
        this.StopGettingDizzy();
        var direction = this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.Flags.Pose.Add(POSE_FLAGS.AIRBORNE);
        this.PerformJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player takes a hit while in the air*/
Player.prototype.TakeAirborneHit = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.moves_[_c3("_",POSE_FLAGS.AIRBORNE,"_hr_air")];
    if(!!move)
    {   
        var direction = -this.GetAttackDirection(attackDirection);
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_,AttackDirection:direction});
        this.PerformJump(direction * move.Vx * fx,move.Vy * fy);
    }
    
}
Player.prototype.SlideBack =  function(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer)
{
    var x = STAGE.MAX_STAGEX - this.x_;
    if(x < CONSTANTS.SLIDE_BACK_RANGE_FAR)
    {
        var slideAmount = CONSTANTS.DEFAULT_SLIDE_BACK_AMOUNT;
        if(x <= CONSTANTS.SLIDE_BACK_RANGE_NEAR)
        {
            slideAmount *= 1;
        }
        else
        {
            slideAmount *= (CONSTANTS.SLIDE_BACK_RANGE_FAR - x) / g_slideGap;
        }

        if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {slideAmount *= CONSTANTS.LIGHT_SLIDE_BACK_RATE;}
        else if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)){slideAmount *= CONSTANTS.MEDIUM_SLIDE_BACK_RATE;}
        else if(!!(attackFlags & ATTACK_FLAGS.HARD))  {slideAmount *= CONSTANTS.HARD_SLIDE_BACK_RATE;}

        this.StopSlide();
        this.StartSlide(frame,slideAmount,-this.direction_,1,true);
    }
}
/*Sets up the closure to be called later*/
Player.prototype.SetGiveHit = function(attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
{
    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
        this.grappledPlayerId_ = p2.id_;

    this.giveHitFn_ = (function(thisValue,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
    {
        return function (frame)
        {
            thisValue.GiveHit(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
        }
    })(this,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
    this.SetHoldFrame(this.baseGiveHitDelay_ * hitDelayFactor);
}
/*This player just hit the other player*/
Player.prototype.GiveHit = function(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer)
{
    this.StopGettingDizzy();
    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        this.grappledPlayer_ = otherPlayer;
    }
    else if(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT))
    {
        this.HandleGrapple(this.currentAnimation_.FrameIndex-1,frame,0,0);
        this.grappledPlayer_ = null;
        this.grappledPlayerId_ = "";
        hitDelayFactor = 0;
    }
    else
    {
        this.SlideBack(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer);
    }

    this.ChangeEnergy(energyToAdd);
    this.SetHoldFrame(this.baseGiveHitDelay_ * hitDelayFactor);
}

Player.prototype.IsGrappling = function(id)
{
    if(!!id)
        return this.grappledPlayerId_ == id;
    else
        return !!this.grappledPlayerId_;
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
    animation.initialStageX_ = this.GetStage().x_;
    animation.initialStageY_ = this.GetStage().y_;
}


Player.prototype.OnSuperMoveStarted = function(frame)
{
    this.SetPaused(true);
    this.forceImmobile_ = true;
}

Player.prototype.OnSuperMoveCompleted = function(frame)
{
    this.SetPaused(false);
    this.forceImmobile_ = false;
}
Player.prototype.hasRegisteredHit = function() { return !!this.RegisteredHit.HitID; }

Player.prototype.isVulnerable = function()
{
    var retVal = this.Flags.Player.has(PLAYER_FLAGS.INVULNERABLE)
                || this.Flags.Player.has(PLAYER_FLAGS.SUPER_INVULNERABLE)
                || this.Flags.Player.has(PLAYER_FLAGS.IGNORE_ATTACKS)
        ;
    return !retVal;
}

Player.prototype.canHit = function(otherFlags)
{
    if(!!(otherFlags.Player & PLAYER_FLAGS.IGNORE_COLLISIONS))
        return false;
    return true;
}

Player.prototype.onProjectileMoved = function(id,x,y)
{
    this.onProjectileMovedFn(id,x,y);
}

Player.prototype.onProjectileGone = function(id)
{
    this.onProjectileGoneFn(id);
}

/*Allows blocking from a projectile, if the projectile is within range*/
Player.prototype.setAllowBlockFromProjectile = function(frame,isAllowed,projectileId,x,y)
{
    if(!!isAllowed)
    {
        this.setAllowAirBlock(projectileId,frame,true,x,y);
    }
    else
    {
        this.setAllowAirBlock(projectileId,frame,false,x,y)
    }
}
Player.prototype.addBlockableAttack = function(attackId)
{
    for(var i = 0, length = this.BlockedAttacks.length; i < length; ++i)
    {
        if(this.BlockedAttacks[i].AttackId == attackId)
        {
            return true;
        }
    }
    return false;
}
Player.prototype.removeBlockableAttack = function(attackId)
{
    for(var i = 0, length = this.BlockedAttacks.length; i < length; ++i)
    {
        if(this.BlockedAttacks[i].AttackId == attackId)
        {
            this.BlockedAttacks.splice(i,1);
            return true;
        }
    }
    return false;
}
Player.prototype.addBlockableAirAttack = function(attackId)
{
    for(var i = 0, length = this.BlockedAirAttacks.length; i < length; ++i)
    {
        if(this.BlockedAirAttacks[i].AttackId == attackId)
        {
            return true;
        }
    }
    return false;
}
Player.prototype.removeBlockableAirAttack = function(attackId)
{
    for(var i = 0, length = this.BlockedAirAttacks.length; i < length; ++i)
    {
        if(this.BlockedAirAttacks[i].AttackId == attackId)
        {
            this.BlockedAirAttacks.splice(i,1);
            return true;
        }
    }
    return false;
}
/*Allows/disallows blocking*/
Player.prototype.setAllowBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        var dist = this.getDistanceFromSq(x,y);
        if(dist > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
        {
            if(!this.isBlocking())
                return this.setAllowBlock(attackId,frame,false,x,y);
            else if(dist > (CONSTANTS.MAX_BLOCK_DISTANCE_SQ2))
                return this.setAllowBlock(attackId,frame,false,x,y);
        }

        /*Check if the move is already blockable*/
        if(!this.addBlockableAttack(attackId))
            this.BlockedAttacks[this.BlockedAttacks.length] = {AttackId:attackId};
        
        /*allow the block animation*/
        this.Flags.Pose.add(POSE_FLAGS.ALLOW_BLOCK);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        if(this.removeBlockableAttack(attackId))
        {
            /*if there are no more attacks, remove the ability to block*/
            if(this.BlockedAttacks.length == 0)
            {
                this.Flags.Pose.remove(POSE_FLAGS.ALLOW_BLOCK);
                /*if the player is blocking, then remove it*/
                if(this.Flags.Player.has(PLAYER_FLAGS.BLOCKING))
                    this.IgnoreHoldFrame = true; /*ignores the hold frame on the current animation, which then causes the animation to continue, and then end*/
            }
        }
    }
}
/*Allows/disallows air blocking*/
Player.prototype.setAllowAirBlock = function(attackId,frame,isAllowed,x,y)
{
    if(!!isAllowed)
    {
        /*the attack must be within a certain distance for the block animation to be allowed*/
        var dist = this.getDistanceFromSq(x,y);
        if(dist > CONSTANTS.MAX_BLOCK_DISTANCE_SQ)
        {
            if(!this.isBlocking())
                return this.setAllowAirBlock(attackId,frame,false,x,y);
            else if(dist > (CONSTANTS.MAX_BLOCK_DISTANCE_SQ2))
                return this.setAllowAirBlock(attackId,frame,false,x,y);
        }

        /*Check if the move is already blockable*/
        if(!this.addBlockableAirAttack(attackId))
            this.BlockedAirAttacks[this.BlockedAirAttacks.length] = {AttackId:attackId};
        /*allow block*/
        this.Flags.Pose.add(POSE_FLAGS.ALLOW_AIR_BLOCK);
        /*air attacks can also be blocked on the ground*/
        this.setAllowBlock(attackId,frame,isAllowed,x,y);
    }
    else
    {
        /*remove the attack from the array of blocked attacks*/
        if(this.removeBlockableAirAttack(attackId))
        {
            /*if there are no more attacks, remove the ability to block*/
            if(this.BlockedAirAttacks.length == 0)
                this.Flags.Pose.remove(POSE_FLAGS.ALLOW_AIR_BLOCK);
            /*air attacks can also be blocked on the ground*/
            this.setAllowBlock(attackId,frame,isAllowed,x,y);
        }
    }
}

/*returns true if a grapple can be performed*/
Player.prototype.tryStartGrapple = function(move,frame)
{
    if(this.hasRegisteredHit())
        return false;

    distance = move.GrappleDistance;
    airborneFlags = move.getOtherPlayerAirborneFlags();

    var retVal = false;

    var grappledPlayer = this.getPhysics().getGrappledPlayer(this.Team,this.getAbsFrontX(),this.Y,distance,airborneFlags,this.isAirborne());
    if(!!grappledPlayer)
    {
        retVal = true;

        var firstFrame = move.getFrame(0);
        grappledPlayer.clearPendingHit();
        this.setGiveHit(firstFrame.AttackFlags,firstFrame.HitDelayFactor,firstFrame.EnergyToAdd,move.BehaviorFlags,grappledPlayer);
        grappledPlayer.takeHit(firstFrame.AttackFlags,HIT_FLAGS.NEAR,firstFrame.FlagsToSend,frame,frame,firstFrame.BaseDamage,firstFrame.EnergyToAdd,false,0,0,this.Direction,this.Id,firstFrame.HitID,move.OverrideFlags,0,0,this,move.BehaviorFlags,move.InvokedAnimationName,firstFrame.FlagsToSet.HitSound,firstFrame.FlagsToSet.BlockSound);
        //this.attackFn(moveFrame.HitDelayFactor, moveFrame.HitID,frame,moveFrame.HitPoints,moveFrame.FlagsToSend,moveFrame.AttackFlags,moveFrame.BaseDamage,this.CurrentAnimation.Animation.OverrideFlags,moveFrame.EnergyToAdd,this.CurrentAnimation.Animation.BehaviorFlags,this.CurrentAnimation.Animation.InvokedAnimationName,moveFrame.FlagsToSet.HitSound,moveFrame.FlagsToSet.BlockSound);
    }

    return retVal;
}

/*returns true if this player can be grappled*/
Player.prototype.canBeGrappled = function(x,y,distance,airborneFlags,isAirborne)
{
    /*visible will be false during teleportation moves*/
    if(!this.isVisible())
        return false;

    /*player can not have a grapple on him already!*/
    if(this.getHasPendingGrapple() || this.isBeingGrappled())
        return false;

    if((airborneFlags == AIRBORNE_FLAGS.YES) && !this.isAirborne())
        return false;
    else if((airborneFlags == AIRBORNE_FLAGS.NO) && this.isAirborne())
        return false;
    else if((airborneFlags == AIRBORNE_FLAGS.EQUAL) && (isAirborne != this.isAirborne()))
        return false;

    var retVal = false;

    if((Math.abs(x - this.getMidX()) < distance)
        && (Math.abs(y - this.Y) < distance)
        && (!(this.Flags.Player.has(PLAYER_FLAGS.INVULNERABLE)))
        && (!this.GrappledPlayer
        && (!this.CurrentAnimation.Animation.OverrideFlags.hasOverrideFlag(OVERRIDE_FLAGS.THROW)))
        && (!this.hasRegisteredHit())
        )
            retVal = true;

    return retVal;
}

/*Forced computation on the player who is being thrown by this player*/
Player.prototype.handleGrapple = function(forcedFrameIndex,frame,stageX,stageY)
{
    if(!!this.GrappledPlayer.CurrentAnimation.Animation && !!this.GrappledPlayer.isBeingGrappled())
    {
        var forcedFrame = this.GrappledPlayer.CurrentAnimation.Animation.BaseAnimation.Frames[forcedFrameIndex];
        if(!!forcedFrame)
        {
            var offsetX = forcedFrame.X;
            var offsetY = forcedFrame.Y;

            if(!!this.CurrentFrame.HitPoints[0])
            {
                offsetX *= this.CurrentFrame.HitPoints[0].Tx || 1;
                offsetY *= this.CurrentFrame.HitPoints[0].Ty || 1;
            }


            var x = this.convertX(this.X + offsetX);
            var y = this.convertY(this.Y + offsetY);

            this.GrappledPlayer.setX(x);
            this.GrappledPlayer.setY(y);

            this.GrappledPlayer.setCurrentFrame(forcedFrame,frame,stageX,stageY,true);
        }
    }
}

Player.prototype.clearProjectiles = function()
{
    for(var i = 0, length = this.Projectiles.length; i < length; ++i)
    {
        this.Projectiles[i].cancel(true);
    }
}

/*Allows the players projectile to advance*/
Player.prototype.handleProjectiles = function(frame,stageX,stageY)
{
    this.HasActiveProjectiles = false;
    for(var i = 0; i < this.Projectiles.length; ++i)
    {
        if(this.Projectiles[i].getIsActive())
        {
            this.HasActiveProjectiles = true;
            this.projectileAttackFn(frame,this.Projectiles[i].advance(frame,stageX,stageY));
        }
        else if(this.Projectiles[i].getIsDisintegrating())
            this.projectileAttackFn(frame,this.Projectiles[i].advance(frame,stageX,stageY));
    }
}

/*Handles attacking players on the opposing team*/
Player.prototype.handleAttack = function(frame, moveFrame)
{
    this.IsInAttackFrame = true;
    if(!!(moveFrame.FlagsToSet.Combat & COMBAT_FLAGS.CAN_BE_BLOCKED))
    {
        this.MustClearAllowBlock = true;
        this.onStartAttackFn(this.CurrentAnimation.ID);
    }
    if(!!(moveFrame.FlagsToClear.Combat & COMBAT_FLAGS.CAN_BE_BLOCKED))
    {
        this.MustClearAllowBlock = false;
        this.onEndAttackFn(this.CurrentAnimation.ID);
    }
    if(!!(moveFrame.FlagsToSet.Combat & COMBAT_FLAGS.CAN_BE_AIR_BLOCKED))
    {
        this.MustClearAllowAirBlock = true;
        this.onStartAirAttackFn(this.CurrentAnimation.ID);
    }
    if(!!(moveFrame.FlagsToClear.Combat & COMBAT_FLAGS.CAN_BE_AIR_BLOCKED))
    {
        this.MustClearAllowAirBlock = false;
        this.onEndAirAttackFn(this.CurrentAnimation.ID);
    }

    this.attackFn(moveFrame.HitDelayFactor, moveFrame.HitID,frame,moveFrame.HitPoints,moveFrame.FlagsToSend,moveFrame.AttackFlags,moveFrame.BaseDamage,this.CurrentAnimation.Animation.OverrideFlags,moveFrame.EnergyToAdd,this.CurrentAnimation.Animation.BehaviorFlags,this.CurrentAnimation.Animation.InvokedAnimationName,moveFrame.FlagsToSet.HitSound,moveFrame.FlagsToSet.BlockSound);
}

/*If the player gets hit - this function must be called to set all of the details of the hit*/
Player.prototype.setRegisteredHit = function(attackFlags,hitState,flags,frame,damage,energyToAdd,isGrapple,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,otherPlayer,fx,fy,behaviorFlags,invokedAnimationName,hitSound,blockSound)
{
    this.LastHitFrame[who] = hitID;
    this.RegisteredHit.AttackFlags = attackFlags;
    this.RegisteredHit.HitState = hitState;
    this.RegisteredHit.Flags = flags;
    this.RegisteredHit.Frame = frame - 2;
    this.RegisteredHit.StartFrame = this.CurrentAnimation.StartFrame;
    this.RegisteredHit.Damage = damage;
    this.RegisteredHit.EnergyToAdd = energyToAdd;
    this.RegisteredHit.IsProjectile = isProjectile;
    this.RegisteredHit.HitX = hitX;
    this.RegisteredHit.HitY = hitY;
    this.RegisteredHit.Who = who;
    this.RegisteredHit.AttackDirection = attackDirection;
    this.RegisteredHit.HitID = hitID;
    this.RegisteredHit.MoveOverrideFlags = moveOverrideFlags;
    this.RegisteredHit.AttackForceX = fx || 0;
    this.RegisteredHit.AttackForceY = fy || 0;
    this.RegisteredHit.BehaviorFlags = behaviorFlags;
    this.RegisteredHit.InvokedAnimationName = invokedAnimationName;
    this.RegisteredHit.HitSound = hitSound || 0;
    this.RegisteredHit.BlockSound = blockSound || 0;
    this.RegisteredHit.OtherPlayer = otherPlayer;

    if(!!isGrapple)
        this.setPendingGrapple(true);

    this.getMatch().registerAction(new ActionDetails(this.CurrentAnimation.Animation.OverrideFlags,this,who,isProjectile,isGrapple,this.CurrentAnimation.StartFrame,frame,otherPlayer));

    if(!!isProjectile && !!this.CurrentAnimation.Animation && !!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.IGNORE_PROJECTILES))
        return false;
    return true;
}

Player.prototype.clearPendingHit = function()
{
    this.getMatch().getHitSystem().clearPendingHit(this.Id);
}

Player.prototype.checkPendingHit = function()
{
    if(!!this.CurrentAnimation.Animation.BaseAnimation.IsAttack)
    {
        this.getMatch().getHitSystem().checkPendingHits(this.Id,this.CurrentAnimation.Animation.BaseAnimation.OverrideFlags);
    }
}

Player.prototype.registerHit = function(frame)
{
    this.takeHit(this.RegisteredHit.AttackFlags
                ,this.RegisteredHit.HitState
                ,this.RegisteredHit.Flags
                ,this.RegisteredHit.StartFrame
                ,this.RegisteredHit.Frame
                ,this.RegisteredHit.Damage
                ,this.RegisteredHit.EnergyToAdd
                ,this.RegisteredHit.IsProjectile
                ,this.RegisteredHit.HitX
                ,this.RegisteredHit.HitY
                ,this.RegisteredHit.AttackDirection
                ,this.RegisteredHit.Who
                ,this.RegisteredHit.HitID
                ,this.RegisteredHit.MoveOverrideFlags
                ,this.RegisteredHit.AttackForceX
                ,this.RegisteredHit.AttackForceY
                ,this.RegisteredHit.OtherPlayer
                ,this.RegisteredHit.BehaviorFlags
                ,this.RegisteredHit.InvokedAnimationName
                ,this.RegisteredHit.HitSound
                ,this.RegisteredHit.BlockSound
                );

}
/**/
Player.prototype.isBlockingLow = function()
{
    return this.Flags.Player.has(PLAYER_FLAGS.BLOCKING) && this.Flags.Pose.has(POSE_FLAGS.CROUCHING);
}
Player.prototype.isBlockingInAir = function()
{
    return this.Flags.Player.has(PLAYER_FLAGS.BLOCKING) && this.isAirborne();
}
Player.prototype.isBlockingHigh = function()
{
    return this.Flags.Player.has(PLAYER_FLAGS.BLOCKING) && !this.Flags.Pose.has(POSE_FLAGS.CROUCHING);
}
Player.prototype.isBlocking = function()
{
    return this.Flags.Player.has(PLAYER_FLAGS.BLOCKING);
}
Player.prototype.didntHit = function(frame)
{
}
/**/
Player.prototype.stopGettingDizzy = function()
{
    this.DizzyValue = 0;
}
/**/
Player.prototype.clearDizzy = function()
{
    this.stopGettingDizzy();
    if(!!this.OtherAnimations.Dizzy[this.DizzyIndex])
    {
        this.OtherAnimations.Dizzy[this.DizzyIndex].Animation.reset();
        this.OtherAnimations.Dizzy[this.DizzyIndex].Element.style.display = "none";
    }
    this.getFlags().Player.remove(PLAYER_FLAGS.DIZZY);
    if(!this.isDead())
        this.goToStance();
    this.stopDizzyAudio();
}
Player.prototype.changeDizzy = function(value)
{
    if(this.isDead())
        return;
    this.DizzyValue = Math.max(this.DizzyValue + value, 0);
}
Player.prototype.getDizzyValue = function(value)
{
    return this.DizzyValue;
}
Player.prototype.isDizzy = function()
{
    return this.getFlags().Player.has(PLAYER_FLAGS.DIZZY);
}
Player.prototype.increaseDizziness = function(frame,attackFlags,damage)
{
    if(this.isDead())
        return;
    var value = 0;

    if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {value += CONSTANTS.LIGHT_INCREASE_DIZZY;}
    if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)) {value += CONSTANTS.MEDIUM_INCREASE_DIZZY;}
    if(!!(attackFlags & ATTACK_FLAGS.HARD)) {value += CONSTANTS.HARD_INCREASE_DIZZY;}

    this.changeDizzy(value);
}
Player.prototype.decreaseDizziness = function(frame)
{
    if(this.isDizzy() && this.isVulnerable())
    {
        var value = CONSTANTS.DECREASE_DIZZY;
        this.changeDizzy(value);

        if(!this.getDizzyValue())
            this.clearDizzy();
    }
}

/*The player was just hit and must react*/
Player.prototype.takeHit = function(attackFlags,hitState,flags,startFrame,frame,damage,energyToAdd,isProjectile,hitX,hitY,attackDirection,who,hitID,moveOverrideFlags,fx,fy,otherPlayer,behaviorFlags,invokedAnimationName,hitSound,blockSound)
{
    if(this.isDizzy())
        this.clearDizzy();

    this.RegisteredHit.HitID = null;
    this.FreezeUntilFrame = 0;
    if(!!otherPlayer)
    {
        otherPlayer.giveHitFn(frame);
        if(otherPlayer.isAirborne() && this.isAirborne() && !this.Flags.Player.has(PLAYER_FLAGS.BLUE_FIRE))
            fx = 1;
    }
    this.LastHitFrame[who] = hitID;
    this.LastHit = {x:hitX,y:hitY};
    if(!!isProjectile && !!this.CurrentAnimation.Animation && !!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.IGNORE_PROJECTILES))
        return false;
    var move = null;
    var slideAmount = 0;
    var hitDelayFactor_ = 1;
    var isSpecial = attackFlags && ATTACK_FLAGS.SPECIAL || !!isProjectile;

    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        /*can not block throws*/
        this.setDirection(otherPlayer.Direction * -1);
        if(this.isBlocking())
        {
            /*player attempt to block is overriden*/
            this.Flags.Pose.remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.Flags.Player.remove(PLAYER_FLAGS.BLOCKING);
        }

        this.setBeingGrappled(true);

        if(!!invokedAnimationName)
        {
            move = this.Moves[invokedAnimationName];
            if(!!move)
            {
                move.ControllerAnimation = otherPlayer.CurrentAnimation;
            }
        }
        this.queueGrappleSound();
    }
    else if(!!(attackFlags & ATTACK_FLAGS.HITS_LOW) && this.isBlockingLow()
        || !!(attackFlags & ATTACK_FLAGS.HITS_HIGH) && this.isBlockingHigh()
        || !(attackFlags & ATTACK_FLAGS.HITS_LOW) && !(attackFlags & ATTACK_FLAGS.HITS_HIGH) && this.isBlocking())
    {
        this.stopGettingDizzy();
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
        this.FreezeUntilFrame = frame + CONSTANTS.DEFAULT_BLOCK_FREEZE_FRAME_COUNT;
    }
    else
    {
        if(this.isBlocking())
        {
            /*player attempt to block was overriden*/
            this.Flags.Pose.remove(POSE_FLAGS.ALLOW_BLOCK);
            /*if the player is blocking, then remove it*/
            this.Flags.Player.remove(PLAYER_FLAGS.BLOCKING);
        }

        if(!!damage)
        {
            this.incCombo();
        }

        if(!!energyToAdd && !(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT)))
            energyToAdd = Math.ceil(energyToAdd/2);

        if(this.Flags.Pose.has(POSE_FLAGS.CROUCHING))
        {
            if(!!(attackFlags & ATTACK_FLAGS.TRIP)) {move = this.Moves[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            if(!!(attackFlags & ATTACK_FLAGS.LIGHT)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_LIGHT_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cLN")];}
            if(!!(attackFlags & ATTACK_FLAGS.MEDIUM)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_MEDIUM_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cMN")];}
            if(!!(attackFlags & ATTACK_FLAGS.HARD)) {slideAmount = CONSTANTS.DEFAULT_CROUCH_HARD_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.CROUCHING,"_hr_cHN")];}
        }
        else
        {
            if(!!(attackFlags & ATTACK_FLAGS.TRIP) && !!(hitState & HIT_FLAGS.NEAR)) {move = this.Moves[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];}
            else if(!!(attackFlags & ATTACK_FLAGS.KNOCKDOWN)) {move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];}

            else if(!!(attackFlags & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sLN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.LIGHT) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_LIGHT_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sLF")];}

            else if(!!(attackFlags & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sMN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.MEDIUM) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_MEDIUM_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sMF")];}

            else if(!!(attackFlags & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.NEAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sHN")];}
            else if(!!(attackFlags & ATTACK_FLAGS.HARD) && !!(hitState & HIT_FLAGS.FAR)) {slideAmount = CONSTANTS.DEFAULT_HARD_HRSLIDE; move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_sHF")];}
        }
    }

    if(!!move)
    {
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction});
        if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
        {
            this.CurrentAnimation.StartFrame = otherPlayer.CurrentAnimation.StartFrame;
            this.IgnoreCollisionsWith = otherPlayer.Id;
            return;
        }
    }
    /*get the direction of the attack*/
    var relAttackDirection = 0;
    if(!!isProjectile)
        relAttackDirection = this.getProjectileDirection(attackDirection);
    else
        relAttackDirection = this.getAttackDirection(attackDirection);

    if(!__debugMode)
        this.takeDamage(damage);
    this.changeEnergy(energyToAdd);
    if(this.isDead() && !this.IsLosing)
    {
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        /*if any player is dead, then the whole team is dead.*/
        this.forceTeamLose(frame,attackDirection);
        if(!!this.isBeingGrappled())
        {
            this.setBeingGrappled(false);
            attackDirection = -this.getRelativeDirection(attackDirection);
            this.eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        }
        else
        {
            this.knockDownDefeat(frame,attackDirection);
        }

        this.queueHitSound(hitSound);
        return;
    }

    this.increaseDizziness(frame,attackFlags,damage);

    if((this.getDizzyValue() >= this.MaxDizzyValue) && !this.isDizzy())
    {
        attackDirection = this.getRelativeDirection(attackDirection);
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.getDizzy(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT) && !!this.isBeingGrappled())
    {
        this.setBeingGrappled(false);
        attackDirection = -this.getRelativeDirection(attackDirection);
        this.eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
        hitDelayFactor_ = 0;
    }
    else if(this.isBlocking())
    {
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.startSlide(frame, slideAmount,attackDirection,fx);
        if(!!isProjectile)
            this.queueBlockProjectileSound();
        else
            this.queueBlockSound();
    }
    else if(!!(attackFlags & ATTACK_FLAGS.TRIP))
    {
        attackDirection = this.getRelativeDirection(attackDirection);
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.takeTrip(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.FLOOR_AIRBORNE_HARD) && !!this.isAirborne())
    {
        attackDirection = this.getRelativeDirection(attackDirection);

        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.eject(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.BLUE_FIRE))
    {
        attackDirection = this.getRelativeDirection(attackDirection);
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.blueKnockDown(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!!(attackFlags & ATTACK_FLAGS.KNOCKDOWN) || (!!(attackFlags & ATTACK_FLAGS.FLOOR_AIRBORNE) && !!this.isAirborne()))
    {
        attackDirection = this.getRelativeDirection(attackDirection);

        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.knockDown(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(this.isAirborne())
    {
        attackDirection = this.getRelativeDirection(attackDirection);
        /*TODO: remove rear hit flags unless it is a special move*/
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.takeAirborneHit(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy);
    }
    else if(!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        if(!!flags)
            this.spawnHitReportAnimations(frame, flags, hitState, relAttackDirection);
        this.startSlide(frame, slideAmount,attackDirection,fx);
    }

    if(!!(attackFlags & ATTACK_FLAGS.NO_HIT_DELAY))
        hitDelayFactor_ = 0;

    if(this.ComboCount > 2)
        this.setHoldFrame(1);
    else
        this.setHoldFrame(this.BaseTakeHitDelay * hitDelayFactor_);

    if(!this.isBlocking())
        this.queueHitSound(hitSound);

    return true;
}
/*Setting "this.WinningFrame" will cause this player to execute its win animation after its current animation is done.*/
Player.prototype.justWon = function(frame)
{
    this.ForceImmobile = true;
    this.WinningFrame = frame;
}
Player.prototype.forceWin = function(frame)
{
    var name = this.WinAnimationNames[Math.ceil(Math.random() * this.WinAnimationNames.length) - 1];
    if(name == undefined) name = CONSTANTS.DEFAULT_WIN_ANIMATION_NAME;
    this.executeAnimation(name);
    this.clearInput();
}
/*Player is defeated*/
Player.prototype.forceLose = function(attackDirection)
{
    this.IsLosing = true;
    this.ForceImmobile = true;
    this.takeDamage(this.getHealth());
    var frame = this.getMatch().getCurrentFrame();
    var direction = attackDirection || -this.Direction;
    this.abortThrow();

    this.Flags.Player.add(PLAYER_FLAGS.DEAD);
    this.knockDownDefeat(frame,attackDirection);
    this.queueSound("audio/" + this.Name.toLowerCase() + "/dead.zzz");
    this.clearInput();
    this.clearDizzy();
}
/*Player gets is defeated*/
Player.prototype.forceTeamLose = function(frame,attackDirection)
{
    if(!this.IsLosing)
    {
        this.IsLosing = true;
        this.ForceImmobile = true;
        this.takeDamage(this.getHealth());
        var frame = this.getMatch().getCurrentFrame();
        var direction = attackDirection || -this.Direction;

        this.Flags.Player.add(PLAYER_FLAGS.DEAD);
        this.getMatch().defeatTeam(this.Team,attackDirection,frame,this.Id);
    }
    this.clearDizzy();
}
Player.prototype.knockDownDefeat = function(frame,attackDirection)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_dead")];
    if(!!move)
    {
        attackDirection = this.getRelativeDirection(attackDirection);
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.Flags.Player.add(PLAYER_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx,move.Vy);
        this.clearDizzy();
    }
}
Player.prototype.getDizzy = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    if(this.isDead())
        return;

    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_dizzy")];
    if(!!move)
    {
        this.resetCombo();
        this.getFlags().Player.add(PLAYER_FLAGS.DIZZY);
        this.getFlags().Player.add(PLAYER_FLAGS.IMMOBILE);
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.Flags.Player.add(PLAYER_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx,move.Vy);
        this.spawnDizzy(frame);
        this.queueDizzy();
        this.MaxDizzyValue += CONSTANTS.DIZZY_INC;
    }
}

/*Player gets back up*/
Player.prototype._DEBUG_Getup = function()
{
    this.Flags.Player.remove(PLAYER_FLAGS.DEAD);
    this.takeDamage(-20);
    var move = this.Moves[_c3("_",MISC_FLAGS.NONE,"_getup")];
    this.setCurrentAnimation({Animation:move,StartFrame:this.getMatch().getCurrentFrame(),Direction:this.Direction,AttackDirection:this.Direction});
}
/*Player gets tripped*/
Player.prototype.takeTrip = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"_hr_trip")];
    if(!!move)
    {
        this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.performJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player falls*/
Player.prototype.drop = function()
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_eject")];
    if(!!move)
    {
        this.setBeingGrappled(false);
        //attackDirection = this.getRelativeDirection(attackDirection);
        var direction = this.getAttackDirection(-this.Direction);
        this.setCurrentAnimation({Animation:move,StartFrame:game_.getCurrentFrame(),Direction:this.Direction,AttackDirection:direction,Vx:0,Vy:0});
        this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx * 0,move.Vy * 0);
    }
}
/*Player aborts throw*/
Player.prototype.abortThrow = function()
{
    if(!!this.GrappledPlayer)
    {
        this.GrappledPlayer.drop();
        this.GrappledPlayer = null;
        this.GrappledPlayerId = "";
        hitDelayFactor = 0;
    }
}
/*Player gets knocked down*/
Player.prototype.eject = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_eject")];
    if(!!move)
    {
        //attackDirection = this.getRelativeDirection(attackDirection);
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move, StartFrame:frame, Direction:this.Direction, AttackDirection:direction, Vx:move.Vx * fx, Vy:move.Vy * fy});
        this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player gets knocked down*/
Player.prototype.knockDown = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_knockdown")];
    if(!!move)
    {
        this.stopGettingDizzy();
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx * fx,move.Vy * fy);
    }
}
/*Player turns blue and gets knocked down*/
Player.prototype.blueKnockDown = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.STANDING,"_hr_dead")];
    if(!!move)
    {
        this.stopGettingDizzy();
        var direction = this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        this.performJump(direction * move.Vx * fx,move.Vy * fy);
        this.Flags.Player.add(PLAYER_FLAGS.BLUE_FIRE);
    }
}
/*Player takes a hit while in the air*/
Player.prototype.takeAirborneHit = function(attackFlags,hitState,flags,frame,damage,isProjectile,hitX,hitY,attackDirection,fx,fy)
{
    var move = this.Moves[_c3("_",POSE_FLAGS.AIRBORNE,"_hr_air")];
    if(!!move)
    {   
        var direction = -this.getAttackDirection(attackDirection);
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction,AttackDirection:direction});
        this.performJump(direction * move.Vx * fx,move.Vy * fy);
    }
    
}
Player.prototype.slideBack =  function(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer)
{
    var x = STAGE.MAX_STAGEX - this.X;
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

        this.stopSlide();
        this.startSlide(frame,slideAmount,-this.Direction,1,true);
    }
}
/*Sets up the closure to be called later*/
Player.prototype.setGiveHit = function(attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
{
    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
        this.GrappledPlayerId = p2.Id;

    this.giveHitFn = (function(thisValue,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2)
    {
        return function (frame)
        {
            thisValue.giveHit(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
        }
    })(this,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,p2);
    this.setHoldFrame(this.BaseGiveHitDelay * hitDelayFactor);
}
/*This player just hit the other player*/
Player.prototype.giveHit = function(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer)
{
    this.stopGettingDizzy();
    if(!!(attackFlags & ATTACK_FLAGS.THROW_START))
    {
        this.GrappledPlayer = otherPlayer;
    }
    else if(!!(attackFlags & ATTACK_FLAGS.THROW_EJECT))
    {
        this.handleGrapple(this.CurrentAnimation.FrameIndex-1,frame,0,0);
        this.GrappledPlayer = null;
        this.GrappledPlayerId = "";
        hitDelayFactor = 0;
    }
    else
    {
        this.slideBack(frame,attackFlags,hitDelayFactor,energyToAdd,behaviorFlags,otherPlayer);
    }

    this.changeEnergy(energyToAdd);
    if(!!this.CurrentAnimation.Animation.ChainOnHitAnimation)
    {
        this.tryChainOnHit(frame);
    }
    else
    {
        if(!!this.Flags.Player.has(PLAYER_FLAGS.BULLDOZE))
            this.setHoldFrame(0);
        else
            this.setHoldFrame(this.BaseGiveHitDelay * hitDelayFactor);
    }

    
    if(++this.NbHits >= this.CurrentAnimation.Animation.MaxNbHits)
    {
        this.tryChainAnimation(frame);
    }

}

Player.prototype.isGrappling = function(id)
{
    if(!!id)
        return this.GrappledPlayerId == id;
    else
        return !!this.GrappledPlayerId;
}

/*allows the animation to store some initial coordinates*/
Player.prototype.setLastHit = function(animation,type,offsetX,offsetY)
{
    animation.Direction = this.Direction;
    switch(type)
    {
        case CONSTANTS.USE_PLAYER_TOP:
        {
            animation.InitialX = this.getX() - this.HeadOffsetX;
            animation.InitialY = this.getBoxTop() - this.HeadOffsetY;
            break;
        };
        case CONSTANTS.USE_PLAYER_BOTTOM:
        {
            animation.InitialX = this.getX() + (this.Width/Math.ceil(Math.random() * 8));
            animation.InitialY = this.Y + 20;
            break;
        };
        case CONSTANTS.USE_PLAYER_XY:
        {
            animation.InitialX = this.getX() + offsetX;
            animation.InitialY = game_.Match.Stage.getGroundY() + offsetY;
            break;
        };
        default:
        {
            animation.InitialX = this.LastHit.x;
            animation.InitialY = this.LastHit.y;
            break;
        }

    };
    animation.InitialPlayerX = this.X;
    animation.InitialPlayerY = this.Y;
    animation.InitialStageX = this.getStage().X;
    animation.InitialStageY = this.getStage().getGroundY();
}


Player.prototype.onSuperMoveStarted = function(frame)
{
    this.setPaused(true);
    this.ForceImmobile = true;
}

Player.prototype.onSuperMoveCompleted = function(frame)
{
    this.setPaused(false);
    this.ForceImmobile = false;
}
/*Helper function - adds a projectile for the player*/
Player.prototype.AddProjectile = function(name,offsetX, offsetY,speedRate)
{
    var projectile = new Projectile(this,new Animation(name),new Animation(name + "-disintegrate"),offsetX,offsetY,speedRate);
    this.projectiles_[this.projectiles_.length] = projectile;
    //projectile.id_ = this.id_ + "_" + this.projectiles_.length;

    return projectile;
}

/* Helper function - adds a move for the player */
Player.prototype.AddThrow = function(requiredState,name,duration,keySequence,priority,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    var key = "_" + (requiredState == undefined ? "" : requiredState);
    for(var i = 0; i < keySequence.length; ++i)
        key += "_" + keySequence[i].toString();
    this.moves_[key] = new Animation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);
    this.moves_[key].baseAnimation_.isThrow_ = true;

    return this.moves_[key];
}

/* Helper function - adds a move for the player */
Player.prototype.AddAnimation = function(requiredState,name,duration,keySequence,priority,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    var key = "_" + (requiredState == undefined ? "" : requiredState);
    for(var i = 0; i < keySequence.length; ++i)
        key += "_" + keySequence[i].toString();
    this.moves_[key] = new Animation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);

    return this.moves_[key];
}
/* Helper function - adds a move for the player */
Player.prototype.AddGenericAnimation = function(state,team,name,moveFlags)
{
    var key = _c4("_",state,"_",team);
    this.otherAnimations_[key] = new GenericAnimation(name,[],moveFlags || MOVE_FLAGS.NONE);

    return this.otherAnimations_[key];
}
/* Helper function - adds a dirt animation for the player */
Player.prototype.AddDirtAnimation = function()
{
    var img = window.document.createElement("img");
    img.className = "dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.otherAnimations_.Dirt[this.otherAnimations_.Dirt.length] =
    {
        Direction:this.direction_
        ,StartFrame:0
        ,Element:img
        ,Animation:new GenericAnimation("dirt",[],MOVE_FLAGS.NONE)
    };

    return this.otherAnimations_.Dirt[this.otherAnimations_.Dirt.length-1].Animation;
}
/* Helper function - adds a big dirt for the player */
Player.prototype.AddBigDirtAnimation = function()
{
    var img = window.document.createElement("img");
    img.className = "big-dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.otherAnimations_.BigDirt[this.otherAnimations_.BigDirt.length] =
    {
        Direction:this.direction_
        ,StartFrame:0
        ,Element:img
        ,Animation:new GenericAnimation("big dirt",[],MOVE_FLAGS.NONE)
    };

    return this.otherAnimations_.BigDirt[this.otherAnimations_.BigDirt.length-1].Animation;
}
/*sets the current animation by looking up the name of the animation - this function can be called by AI*/
Player.prototype.ExecuteAnimation = function(name)
{
    var animation = null;
    if(this.flags_.Player.Has(PLAYER_FLAGS.MOBILE))
    {
        var currentEnergy = this.getEnergyFn_();

        for(var i in this.moves_)
        {
            if(!!animation)
                break;

            var move = this.moves_[i];
            if(this.moves_[i].baseAnimation_.name_ == name)
            {
                animation = this.moves_[i];
            }
            else
            {
                continue;
            }

            if(!!move.energyToSubtract_ && currentEnergy < move.energyToSubtract_)
                continue;
            var pstate = (move.requiredFlags_ | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
            var mustAllowBlock = !!(move.requiredFlags_ & POSE_FLAGS.ALLOW_BLOCK);
            var mustAllowAirBlock = !!(move.requiredFlags_ & POSE_FLAGS.ALLOW_AIR_BLOCK);
            if(!pstate || this.flags_.Pose.Has(pstate))
            {
            
                if(!!mustAllowBlock && !(this.flags_.Pose.Has(POSE_FLAGS.ALLOW_BLOCK)))
                    continue;
                if(!!mustAllowAirBlock && !(this.flags_.Pose.Has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
                    continue;

                if(!!this.IsProjectileInUse(move))
                    continue;

            }
        }

        if(!!animation)
        {
            this.SetCurrentAnimation({Animation:animation,StartFrame:this.GetMatch().GetCurrentFrame(),Direction:this.direction_});
            return true;
        }
    }
    return false;
}
/* Looks up a move */
Player.prototype.FindAnimation = function(value)
{
    var keys = value.Keys;
    var matches = [];
    var retVal = null;
    var priority = -1;
    var currentEnergy = this.getEnergyFn_();
    for(var i in this.moves_)
    {
        var move = this.moves_[i];

        if(!!move.isImplicit_)
            continue;

        if((move.keySequence_.length != keys.length)
            ||(!!move.duration_ && (value.Duration > move.duration_
            ||(!!move.energyToSubtract_ && currentEnergy < move.energyToSubtract_))))
            continue;
        var pstate = (move.requiredFlags_ | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
        var mustAllowBlock = !!(move.requiredFlags_ & POSE_FLAGS.ALLOW_BLOCK);
        var mustAllowAirBlock = !!(move.requiredFlags_ & POSE_FLAGS.ALLOW_AIR_BLOCK);
        if(!pstate || !!(this.flags_.Pose.Has(pstate)))
        {
            
            if(!!mustAllowBlock && !(this.flags_.Pose.Has(POSE_FLAGS.ALLOW_BLOCK)))
                continue;
            if(!!mustAllowAirBlock && !(this.flags_.Pose.Has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
                continue;

            if(!!this.IsProjectileInUse(move))
                continue;

            var cmpValue = this.CompareKeySequence(move,keys);
            if(!cmpValue)
                cmpValue = this.CompareAlternateKeySequences(move,keys);

            if(!!move.grappleDistance_)
                if(!this.GetPhysics().IsAnyPlayerWithinDistance(this.team_,this.GetAbsFrontX(),this.y_,move.grappleDistance_))
                    continue;

            if(cmpValue == CONSTANTS.EXACT_MATCH)
                return move;

            if(cmpValue == 0)
                continue;
            if((cmpValue == CONSTANTS.PRIORITY_MATCH) && move.priority_ > priority)
            {
                priority = move.priority_;
                retVal = move;
            }
        }
    }
    return retVal;
}
Player.prototype.GoToStance = function(frame)
{
    if(this.flags_.Player.Has(PLAYER_FLAGS.DEAD))
    {
        this.forceImmobile_ = true;
        this.flags_.Player.Remove(PLAYER_FLAGS.MOBILE);
        var move = this.moves_["_0_dead"];
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_},true);
        this.GetMatch().DeadAnimationComplete(this,frame);
    }
    else
    {
        if((this.winningFrame_ != CONSTANTS.NO_FRAME) && frame > (this.winningFrame_ + CONSTANTS.WIN_ANIMATION_DELAY))
        {
            this.ForceWin(frame);
            return;
        }
        this.flags_.Player.Add(PLAYER_FLAGS.MOBILE);
        var move = this.moves_["_0_stance"];
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_},true);
    }
    this.SetCurrentFrame(null);
}
/*returns the first free front hit report image*/
Player.prototype.GetNextFrontHitReportImage = function()
{
    for(var i = 0; i < this.frontHitReportImages_.length; ++i)
    {
        if(!this.frontHitReportImages_[i].isInUse)
        {
            this.frontHitReportImages_[i].isInUse = true;
            return this.frontHitReportImages_[i];
        }
    }

    return null;
}
/*returns the first free rear hit report image*/
Player.prototype.GetNextRearHitReportImage = function()
{
    for(var i = 0; i < this.rearHitReportImages_.length; ++i)
    {
        if(!this.rearHitReportImages_[i].isInUse)
        {
            this.rearHitReportImages_[i].isInUse = true;
            return this.rearHitReportImages_[i];
        }
    }

    return null;
}
/*returns the first free dirt image*/
Player.prototype.GetFreeDirtIndex = function()
{
    for(var i = 0; i < this.otherAnimations_.Dirt.length; ++i)
    {
        if(!this.otherAnimations_.Dirt[i].Animation.isActive_)
        {
            this.otherAnimations_.Dirt[i].Animation.isActive_ = true;
            return i;
        }
    }

    return -1;
}
/*returns the first free dirt image*/
Player.prototype.GetFreeBigDirtIndex = function()
{
    for(var i = 0; i < this.otherAnimations_.BigDirt.length; ++i)
    {
        if(!this.otherAnimations_.BigDirt[i].Animation.isActive_)
        {
            this.otherAnimations_.BigDirt[i].Animation.isActive_ = true;
            return i;
        }
    }

    return -1;
}


Player.prototype.SpawnSmallDirt = function(frame,offsetX)
{
    if(this.y_ > STAGE.FLOORY)
        return;
    /*spawn dirt*/
    var index = this.GetFreeDirtIndex();
    if(index > -1)
    {
        var instance = this.otherAnimations_.Dirt[index];
        instance.StartFrame = frame;
        instance.Animation.direction_ = this.direction_;
        if(!!offsetX)
            this.SetLastHit(instance.Animation,CONSTANTS.USE_PLAYER_XY,offsetX,CONSTANTS.SMALLDIRT_OFFSETY);
        else
            this.SetLastHit(instance.Animation,CONSTANTS.USE_PLAYER_BOTTOM);
        this.dirtIndices_[this.dirtIndices_.length] = index;
    }
}

Player.prototype.SpawnBigDirt = function(frame,offsetX)
{
    if(this.y_ > STAGE.FLOORY)
        return;

    /*spawn dirt*/
    var index = this.GetFreeBigDirtIndex();
    if(index > -1)
    {
        var instance = this.otherAnimations_.BigDirt[index];
        instance.StartFrame = frame;
        instance.Animation.direction_ = this.direction_;
        this.SetLastHit(instance.Animation,CONSTANTS.USE_PLAYER_XY,offsetX,CONSTANTS.BIGDIRT_OFFSETY);
        this.bigDirtIndices_[this.bigDirtIndices_.length] = index;
    }
}


/*Handles frames that spawn other animations*/
Player.prototype.SpawnHitReportAnimations = function(frame, flags, hitState, attackDirection)
{
    var frontKey = "";
         if(!!(this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING))) {frontKey = _c3("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.BLOCK,"_0");}
    else if(!!(flags & ATTACK_FLAGS.LIGHT))    {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.LIGHT,"_",this.team_);}
    else if(!!(flags & ATTACK_FLAGS.MEDIUM))   {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.MEDIUM,"_",this.team_);}
    else if(!!(flags & ATTACK_FLAGS.HARD))     {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.HARD,"_",this.team_);}

    var animation = this.otherAnimations_[frontKey];
    if(!!animation)
    {
        this.SetLastHit(animation);
        animation.direction_ = attackDirection;
        this.frontHitReport_[this.frontHitReport_.length] = {Animation:animation,StartFrame:frame,Direction:attackDirection,Element:this.GetNextFrontHitReportImage()};
    }

    if(!this.flags_.Player.Has(PLAYER_FLAGS.BLOCKING) && !!(flags & ATTACK_FLAGS.REAR))
    {
        var rearKey = "";
        if(!!(hitState & HIT_FLAGS.FAR) && !!(flags & ATTACK_FLAGS.SPIT1)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT1,"_0");}
        else if(!!(hitState & HIT_FLAGS.FAR) && !!(flags & ATTACK_FLAGS.SPIT2)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT2,"_0");}

        else if(!!(flags & ATTACK_FLAGS.SPECIAL))
        {
                 if(!!(flags & ATTACK_FLAGS.LIGHT)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,"_0");}
            else if(!!(flags & ATTACK_FLAGS.MEDIUM)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,"_0");}
            else if(!!(flags & ATTACK_FLAGS.HARD)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,"_0");}
        }

        else if(!!(flags & ATTACK_FLAGS.SPECIAL1)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,"_0");}
        else if(!!(flags & ATTACK_FLAGS.SPECIAL2)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,"_0");}
        else if(!!(flags & ATTACK_FLAGS.SPECIAL3)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,"_0");}

        else if(!!(flags & ATTACK_FLAGS.LIGHT)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.LIGHT,"_",this.team_);}
        else if(!!(flags & ATTACK_FLAGS.MEDIUM)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.MEDIUM,"_",this.team_);}
        else if(!!(flags & ATTACK_FLAGS.HARD)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.HARD,"_",this.team_);}


        var rearAnimation = this.otherAnimations_[rearKey];
        if(!!rearAnimation)
        {
            this.SetLastHit(rearAnimation,CONSTANTS.USE_PLAYER_TOP);
            this.rearHitReport_[this.rearHitReport_.length] = {Animation:rearAnimation,StartFrame:frame,Direction:attackDirection,Element:this.GetNextRearHitReportImage()};
        }
    }
}

/*Gets the hit ID of the current frame*/
Player.prototype.GetHitFrameID = function(hitID)
{
    return this.id_ + "-" + this.currentAnimation_.Animation.baseAnimation_.name_ + "-" + (hitID || this.currentFrame_.HitID) + "-" + this.moveCount_;
}

/*Sets the current image. This version is for browsers that load images instantly*/
Player.prototype.ShowCurrentFrameImage = function()
{
    if(this.currentAnimation_.Direction > 0)
    {
        if(this.currentFrame_.ImageOffsetX != undefined)
            this.OffsetImageX(this.currentFrame_.ImageOffsetX);
        if(this.currentFrame_.ImageOffsetY != undefined)
            this.OffsetImageY(this.currentFrame_.ImageOffsetY);
        if(!!this.currentFrame_.RightSrc && (this.image_.src != this.currentFrame_.RightSrc))
        {
            this.image_.src  = frameImages_.Get(this.currentFrame_.RightSrc).src;
            ++this.currentAnimation_.FrameIndex;
        }
    }
    else
    {
        if(this.currentFrame_.ImageOffsetX != undefined)
            this.OffsetImageX(this.currentFrame_.ImageOffsetX);
        if(this.currentFrame_.ImageOffsetY != undefined)
            this.OffsetImageY(this.currentFrame_.ImageOffsetY);
        if(!!this.currentFrame_.LeftSrc && (this.image_.src != this.currentFrame_.LeftSrc))
        {
            this.image_.src  = frameImages_.Get(this.currentFrame_.LeftSrc).src;
            ++this.currentAnimation_.FrameIndex;
        }
    }
}

/*Sets the current image. This version is used for browsers (FIREFOX) that dont load images instantly*/
Player.prototype._ShowCurrentFrameImage = function()
{
    this.image_.onload = (function(thisValue,offsetX,offsetY,hasOffsetX,hasOffsetY)
    {
        if(hasOffsetX || hasOffsetY)
            thisValue.image_.style.visibility = "hidden";
        return function()
        {
            if(hasOffsetX || hasOffsetY || hasOffsetX === 0 || hasOffsetY === 0)
            {
                thisValue.OffsetImageX(offsetX);
                thisValue.OffsetImageY(offsetY);
                this.style.visibility = "";
            }
        }
    })(this,this.currentFrame_.ImageOffsetX,this.currentFrame_.ImageOffsetY,this.currentFrame_.ImageOffsetX != undefined,this.currentFrame_.ImageOffsetY != undefined);
    

    if(this.currentAnimation_.Direction > 0)
    {
        if(!!this.currentFrame_.RightSrc && (this.image_.src.indexOf(this.currentFrame_.RightSrc) == -1))
        {
            this.image_.src  = frameImages_.Get(this.currentFrame_.RightSrc).src;
            ++this.currentAnimation_.FrameIndex;
        }
        else
            this.image_.style.visibility = "";
    }
    else
    {
        if(!!this.currentFrame_.LeftSrc && (this.image_.src.indexOf(this.currentFrame_.LeftSrc) == -1))
        {
            this.image_.src  = frameImages_.Get(this.currentFrame_.LeftSrc).src;
            ++this.currentAnimation_.FrameIndex;
        }
        else
            this.image_.style.visibility = "";
    }
}

/*If there is a chaining move, then it will be set to the current move*/
Player.prototype.TryChainAnimation = function(frame,stageX,stageY)
{
    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.flags_.Player & PLAYER_FLAGS.LOOP_IF_KEYDOWN))
    {
        this.keyStateChanged_ = true;
        //this.CheckForAnimation(frame);
    }
    if(!!this.mustChangeDirection_ && !this.IsDead() && (!this.currentAnimation_.Animation || (!!this.currentAnimation_.Animation && !this.currentAnimation_.Animation.chainAnimation_)))
    {
        this.ChangeDirection();
    }
    else if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.chainAnimation_)
    {
        var chained = this.currentAnimation_.Animation.chainAnimation_;
        /*dont allow chaining to getup if the player is dead*/
        if(chained.baseAnimation_.name_ == "bounce" && this.IsDead())
            chained = this.moves_._0_hr_deadbounce;
        var move = chained;
        var newFrame = move.baseAnimation_.frames_[this.currentAnimation_.Animation.chainAnimationFrame_];
        var attackDirection = this.currentAnimation_.AttackDirection;
        this.SetCurrentAnimation({Animation:move,StartFrame:frame - newFrame.FrameOffset,Direction:this.direction_,AttackDirection:attackDirection});
        this.SetCurrentFrame(newFrame,frame,stageX,stageY);
    }
    else
    {
        this.GoToStance(frame);
    }
}

/*Sets the current move*/
Player.prototype.SetCurrentAnimation = function(newAnimation)
{
    ++this.moveCount_;
    if(!!this.currentAnimation_ && this.currentAnimation_.Animation)
    {
        if(!!this.currentAnimation_.Animation.trail_)
            this.currentAnimation_.Animation.trail_.Disable();

        /*it is possible that the player was attacked before clearing the block state*/
        if(!!this.mustClearAllowBlock_)
        {
            this.mustClearAllowBlock_ = false;
            this.onEndAttackFn_(this.currentAnimation_.ID);
        }
        if(!!this.mustClearAllowAirBlock_)
        {
            this.mustClearAllowAirBlock_ = false;
            this.onEndAirAttackFn_(this.currentAnimation_.ID);
        }
        this.lastAnimation_ = this.currentAnimation_.Animation;

        this.currentAnimation_.Animation.controllerAnimation_ = null;
        if(!!(this.currentAnimation_.Animation.ignoresCollisions_))
        {
            this.flags_.Player.Remove(PLAYER_FLAGS.IGNORE_COLLISIONS);
            this.fixXFn_(1);
        }
        this.flags_.Pose.Remove(this.currentAnimation_.Animation.flags_.Pose);
    }

    this.currentAnimation_ = newAnimation;
    if(!!newAnimation && !!newAnimation.Animation)
    {
        this.currentAnimation_.ID = _c3(this.id_,this.currentAnimation_.Animation.baseAnimation_.name_,this.GetGame().frame_);
        this.currentAnimation_.FrameIndex = 0;
        this.ignoreHoldFrame_ = false;
        this.ignoreCollisionsWith_ = "";
        this.flags_.Pose.Add(newAnimation.Animation.flags_.Pose);
        this.adjustShadowPosition_ = newAnimation.Animation.adjustShadowPosition_;
        if(!(newAnimation.Animation.flags_.Player & PLAYER_FLAGS.HOLD_ZINDEX))
            this.MoveToFront();
        this.OffsetImageX(0);
        this.OffsetImageY(0);

        if(!!newAnimation.Animation.energyToSubtract_)
            this.ChangeEnergy(-newAnimation.Animation.energyToSubtract_);
        else if(!!newAnimation.Animation.energyToAdd_)
            this.ChangeEnergy(newAnimation.Animation.energyToAdd_);

        if(!!newAnimation.Animation.trail_)
            this.currentAnimation_.Animation.trail_.Enable(newAnimation.StartFrame,this.element_);
        this.ShowFirstAnimationFrame();
    }
}

Player.prototype.ShowFirstAnimationFrame = function()
{
    var firstFrame = this.currentAnimation_.Animation.GetFrame(0);
    this.SetCurrentFrame(firstFrame,this.GetGame().GetCurrentFrame(),0,0,true);
}

/*Sets the current frame*/
Player.prototype.SetCurrentFrame = function(newFrame,frame,stageX,stageY,ignoreTranslation)
{
    if(!!this.currentFrame_)
    {
        if(!!newFrame && (newFrame.ID == this.currentFrame_.ID))
            return;

        /*must remove the yOffset each frame*/
        if(this.flags_.Player.Has(PLAYER_FLAGS.SMALLER_AABB))
        {
            this.yBottomOffset_ = 0;
            this.yTopOffset_ = 0;
        }
        /*Remove the flags that were set by the current frame*/
        /*Except for the ones that must be cleared at a later time.*/

        this.flags_.Player.Remove((this.currentFrame_.FlagsToSet.Player
                    | PLAYER_FLAGS.MOBILE)
                    ^ PLAYER_FLAGS.MOBILE);

        this.flags_.Pose.Remove((this.currentFrame_.FlagsToSet.Pose
                    | POSE_FLAGS.AIRBORNE
                    | POSE_FLAGS.AIRBORNE_FB)
                    ^ POSE_FLAGS.AIRBORNE
                    ^ POSE_FLAGS.AIRBORNE_FB);

        this.flags_.Combat.Remove((this.currentFrame_.FlagsToSet.Combat
                    | COMBAT_FLAGS.PROJECTILE_ACTIVE
                    | COMBAT_FLAGS.CAN_BE_BLOCKED
                    | COMBAT_FLAGS.CAN_BE_AIR_BLOCKED)
                    ^ COMBAT_FLAGS.PROJECTILE_ACTIVE
                    ^ COMBAT_FLAGS.CAN_BE_BLOCKED
                    ^ COMBAT_FLAGS.CAN_BE_AIR_BLOCKED);
        
        /*
        this.RemoveState(
        (this.currentFrame_.FlagsToSet
        | FLAGS.AIRBORNE
        | FLAGS.AIRBORNE_FB
        | FLAGS.MOBILE
        | FLAGS.PROJECTILE_ACTIVE
        | FLAGS.CAN_BE_BLOCKED
        | FLAGS.CAN_BE_AIR_BLOCKED
        )
            ^ FLAGS.AIRBORNE
            ^ FLAGS.AIRBORNE_FB
            ^ FLAGS.MOBILE
            ^ FLAGS.PROJECTILE_ACTIVE
            ^ FLAGS.CAN_BE_AIR_BLOCKED
            ^ FLAGS.CAN_BE_BLOCKED);
        */
    }

    this.currentFrame_ = newFrame;
    if(!!newFrame)
    {
        /*if the new frame spawns a projectile, handle that here*/
        if(!this.flags_.Combat.Has(COMBAT_FLAGS.PROJECTILE_ACTIVE) && !!(newFrame.FlagsToSet.Combat & COMBAT_FLAGS.SPAWN_PROJECTILE))
        {
            /*this.onStartAirAttackFn_();*/
            /*this.onStartAttackFn_();*/
            this.projectiles_[newFrame.chainProjectile_].Throw(frame,stageX,stageY);
        }
        if(!!(newFrame.FlagsToSet.Spawn & SPAWN_FLAGS.SPAWN_BIGDIRT))
        {
            this.ShowBigDirt(frame);
        }
        else if(!!(newFrame.FlagsToSet.Spawn & SPAWN_FLAGS.SPAWN_SMALLDIRT))
        {
            /*StartSlide will show the dirt animations, but we set the amount to 0 so the player itself does not move.*/
            this.ShowSmallDirt(frame);
        }

        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.MOVE_TO_BACK) || !!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.BLOCKING))
            this.MoveToBack();
        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.MOVE_TO_FRONT))
            this.MoveToFront();

        ignoredFlags = POSE_FLAGS.AIRBORNE | POSE_FLAGS.AIRBORNE_FB; /*flags to be set in the OnFrame function*/
        this.flags_.Pose.Add((newFrame.FlagsToSet.Pose | ignoredFlags) ^ ignoredFlags);
        this.flags_.Combat.Add(newFrame.FlagsToSet.Combat);
        this.flags_.Player.Add(newFrame.FlagsToSet.Player);
        this.flags_.Spawn.Add(newFrame.FlagsToSet.Spawn);


        //if(!!(newFrame.FlagsToSet.Pose & POSE_FLAGS.AIRBORNE) || !!(newFrame.FlagsToSet.Pose & POSE_FLAGS.AIRBORNE_FB))
        //{
        //    this.SetPoseFlags((newFrame.FlagsToSet | ignoredFlags) ^ ignoredFlags);
        //}
        //this.RemoveState(newFrame.FlagsToClear);
        this.flags_.Pose.Remove(newFrame.FlagsToClear.Pose);
        this.flags_.Combat.Remove(newFrame.FlagsToClear.Combat);
        this.flags_.Player.Remove(newFrame.FlagsToClear.Player);
        this.flags_.Spawn.Remove(newFrame.FlagsToClear.Spawn);

        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.SMALLER_AABB))
        {
            var offsetData = this.currentAnimation_.Animation.userData_;
            if(!!offsetData)
            {
                this.yBottomOffset_ = offsetData.bottomOffset || 0;
                this.yTopOffset_ = offsetData.topOffset || 0;
            }
        }

        if(!ignoreTranslation)
        {
            if(!!newFrame.X)
                this.MoveX(newFrame.X);
            if(!!newFrame.Y)
                this.MoveY(newFrame.Y);
        }
        this.invokeShowCurrentFrameImageFn_();

        if(!!this.currentFrame_.ShadowImageSrc && (this.shadow_._relSrc != this.currentFrame_.ShadowImageSrc))
        {
            this.shadow_._relSrc  = this.currentFrame_.ShadowImageSrc;
            this.shadow_.src  = frameImages_.Get(this.currentFrame_.ShadowImageSrc).src;
        }
    }
}



/*Sets the x and y on the element*/
Player.prototype.Render = function(frame,stageDiffX)
{
    if(this.direction_ > 0)
        this.SetRight(this.x_);
    else
        this.SetLeft(this.x_);
    this.element_.style.bottom = Math.max(this.y_,STAGE.FLOORY) + "px";
    this.RenderShadow();
    this.RenderTrail(frame,stageDiffX);
    this.RenderDebugInfo();
}

/*renders the trail, if there is one*/
Player.prototype.RenderTrail = function(frame,stageDiffX)
{
    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.trail_)
        this.currentAnimation_.Animation.trail_.Render(frame,-this.direction_ * stageDiffX);
}
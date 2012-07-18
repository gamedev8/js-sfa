/*Helper function - adds a projectile for the player*/
Player.prototype.AddProjectile = function(name,offsetX, offsetY,speedRate)
{
    var projectile = CreateProjectile(this,CreateAnimation(name),CreateAnimation(name + "-disintegrate"),offsetX,offsetY,speedRate);
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
    this.moves_[key] = CreateAnimation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);
    this.moves_[key].BaseAnimation.IsThrow = true;

    return this.moves_[key];
}

/* Helper function - adds a move for the player */
Player.prototype.AddAnimation = function(requiredState,name,duration,keySequence,priority,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    var key = "_" + (requiredState == undefined ? "" : requiredState);
    for(var i = 0; i < keySequence.length; ++i)
        key += "_" + keySequence[i].toString();
    this.moves_[key] = CreateAnimation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);

    return this.moves_[key];
}
/* Helper function - adds a move for the player */
Player.prototype.AddGenericAnimation = function(state,team,name,moveFlags)
{
    var key = _c4("_",state,"_",team);
    this.otherAnimations_[key] = CreateGenericAnimation(name,[],moveFlags || MOVE_FLAGS.NONE);

    return this.otherAnimations_[key];
}
/*helper function - adds the dizzy stars animation*/
Player.prototype.AddDizzyAnimation = function(centeredOffset,topOffset)
{
    this.otherAnimations_.Dizzy[this.otherAnimations_.Dizzy.length] =
    {
        Direction:this.direction_
        ,StartFrame:0
        ,Element:this.dizzyElement_
        ,Animation:CreateGenericAnimation("dizzy",[],MOVE_FLAGS.MOVE_TO_PLAYER,0,0,centeredOffset,topOffset,true)
    };
    return this.otherAnimations_.Dizzy[this.otherAnimations_.Dizzy.length-1].Animation;
}
/* Helper function - adds a dirt animation for the player */
Player.prototype.AddDirtAnimation = function()
{
    var img = window.document.createElement("div");
    img.className = "dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.otherAnimations_.Dirt[this.otherAnimations_.Dirt.length] =
    {
        Direction:this.direction_
        ,StartFrame:0
        ,Element:img
        ,Animation:CreateGenericAnimation("dirt",[],MOVE_FLAGS.NONE)
    };

    return this.otherAnimations_.Dirt[this.otherAnimations_.Dirt.length-1].Animation;
}
/* Helper function - adds a big dirt for the player */
Player.prototype.AddBigDirtAnimation = function()
{
    var img = window.document.createElement("div");
    img.className = "big-dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.otherAnimations_.BigDirt[this.otherAnimations_.BigDirt.length] =
    {
        Direction:this.direction_
        ,StartFrame:0
        ,Element:img
        ,Animation:CreateGenericAnimation("big dirt",[],MOVE_FLAGS.NONE)
    };

    return this.otherAnimations_.BigDirt[this.otherAnimations_.BigDirt.length-1].Animation;
}
/*sets the current animation by looking up the name of the animation - this function can be called by AI*/
Player.prototype.ExecuteAnimation = function(name)
{
    var animation = null;
    if(this.Flags.Player.Has(PLAYER_FLAGS.MOBILE))
    {
        var currentEnergy = this.getEnergyFn_();

        for(var i in this.moves_)
        {
            if(!!animation)
                break;

            var move = this.moves_[i];
            if(this.moves_[i].BaseAnimation.name_ == name)
            {
                animation = this.moves_[i];
            }
            else
            {
                continue;
            }

            if(!!move.energyToSubtract_ && currentEnergy < move.energyToSubtract_)
                continue;
            var pstate = (move.RequiredFlags | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
            var mustAllowBlock = !!(move.RequiredFlags & POSE_FLAGS.ALLOW_BLOCK);
            var mustAllowAirBlock = !!(move.RequiredFlags & POSE_FLAGS.ALLOW_AIR_BLOCK);
            if(!pstate || this.Flags.Pose.Has(pstate))
            {
            
                if(!!mustAllowBlock && !(this.Flags.Pose.Has(POSE_FLAGS.ALLOW_BLOCK)))
                    continue;
                if(!!mustAllowAirBlock && !(this.Flags.Pose.Has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
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
Player.prototype.FindAnimation = function(value,frame)
{
    var keys = value.Keys;

    /*check if the player wants to turn around*/
    if(frame % 10 == 0)
    {
        for(var i = 0; i < keys.length; ++i)
        {
            if(!!(keys[i] & BUTTONS.TURN_AROUND))
            {
                this.TurnAround();
                return;
            }
        }
    }

    var matches = [];
    var retVal = null;
    var priority = -1;
    var currentEnergy = this.getEnergyFn_();
    for(var i in this.moves_)
    {
        var move = this.moves_[i];

        if(!!move.IsImplicit)
            continue;

        if((move.GetKeySequenceLength() != keys.length)
            ||(!!move.Duration && (value.Duration > move.Duration
            ||(!!move.energyToSubtract_ && currentEnergy < move.energyToSubtract_))))
            continue;
        var pstate = (move.RequiredFlags | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
        var mustAllowBlock = !!(move.RequiredFlags & POSE_FLAGS.ALLOW_BLOCK);
        var mustAllowAirBlock = !!(move.RequiredFlags & POSE_FLAGS.ALLOW_AIR_BLOCK);
        if(!pstate || !!(this.Flags.Pose.Has(pstate)))
        {
            
            if(!!mustAllowBlock && !(this.Flags.Pose.Has(POSE_FLAGS.ALLOW_BLOCK)))
                continue;
            if(!!mustAllowAirBlock && !(this.Flags.Pose.Has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
                continue;

            if(!!this.IsProjectileInUse(move))
                continue;

            var cmpValue = this.CompareKeySequence(move,keys);
            if(!cmpValue)
                cmpValue = this.CompareAlternateKeySequences(move,keys);


            if(cmpValue == CONSTANTS.EXACT_MATCH)
            {
                if(!!move.GrappleDistance)
                {
                    if(!!this.registeredHit_.HitID)
                        continue;
                    if(!this.TryStartGrapple(move.GrappleDistance,move.GetOtherPlayerAirborneFlags()))
                        continue;
                }

                return move;
            }
            else
            {
                if(!!move.GrappleDistance)
                    continue;
            }

            if(cmpValue == 0)
                continue;
            if((cmpValue == CONSTANTS.PRIORITY_MATCH) && move.Priority > priority)
            {
                priority = move.Priority;
                retVal = move;
            }
        }
    }
    return retVal;
}
Player.prototype.GoToStance = function(frame)
{
    if(this.Flags.Player.Has(PLAYER_FLAGS.DEAD))
    {
        this.forceImmobile_ = true;
        this.Flags.Player.Remove(PLAYER_FLAGS.MOBILE);
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
        this.Flags.Player.Add(PLAYER_FLAGS.MOBILE);
        var move = this.moves_["_0_stance"];
        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_},true);
    }
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

Player.prototype.SpawnDizzy = function(frame)
{   
    this.dizzyIndex_ = +!this.dizzyIndex_;
    var instance = this.otherAnimations_.Dizzy[this.dizzyIndex_];
    instance.StartFrame = frame;
    instance.Animation.direction_ = this.direction_;
    instance.Animation.initialX_ = this.GetX() - this.headOffsetX_;
    instance.Animation.initialY_ = this.GetConstOffsetTop() - this.headOffsetY_;
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
         if(!!(this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING))) {frontKey = _c3("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.BLOCK,"_0");}
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

    if(!this.Flags.Player.Has(PLAYER_FLAGS.BLOCKING) && !!(flags & ATTACK_FLAGS.REAR))
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
    return this.id_ + "-" + this.currentAnimation_.Animation.BaseAnimation.name_ + "-" + (hitID || this.currentFrame_.HitID) + "-" + this.moveCount_;
}

/*Gets the hit ID of the current frame*/
Player.prototype.GetFrameImageID = function(hitID)
{
    return this.currentFrame_.ImageID;
}


/*If there is a chaining move, then it will be set to the current move*/
Player.prototype.TryChainAnimation = function(frame,stageX,stageY)
{
    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!(this.currentAnimation_.Animation.Flags.Player & PLAYER_FLAGS.LOOP_IF_KEYDOWN))
    {
        this.keyStateChanged_ = true;
        
        /*the last key in the keySequence must be the required key*/
        var key = this.currentAnimation_.Animation.GetKey(this.currentAnimation_.Animation.GetKeySequenceLength() - 1);
        if(this.IsKeyDown(key)) /*... and was the key pressed?*/
        {
            this.currentAnimation_.StartFrame = frame;
            //var firstFrame = this.currentAnimation_.Animation.BaseAnimation.frames_[0];
            //this.SetCurrentFrame(firstFrame,frame,stageX,stageY);
            this.CheckMustChangeDirection();
            return;
        }
    }
    if(!!this.currentAnimation_ && !!this.mustChangeDirection_ && !this.IsDead() && (!this.currentAnimation_.Animation || (!!this.currentAnimation_.Animation && !this.currentAnimation_.Animation.ChainAnimation)))
    {
        this.ChangeDirection();
    }
    else if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.ChainAnimation)
    {
        var chained = this.currentAnimation_.Animation.ChainAnimation;
        /*dont allow chaining to getup if the player is dead*/
        if(chained.BaseAnimation.name_ == "bounce" && this.IsDead())
            chained = this.moves_._0_hr_deadbounce;
        var move = chained;
        var newFrame = move.BaseAnimation.frames_[this.currentAnimation_.Animation.ChainAnimationFrame];
        var attackDirection = this.currentAnimation_.AttackDirection;

        var tmp = {Animation:move,StartFrame:frame - newFrame.FrameOffset,Direction:this.direction_,AttackDirection:attackDirection};
        this.SetCurrentAnimation(tmp);
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
        if(!!newAnimation && !!this.currentAnimation_.Animation.ChainAnimation)
        {
            if(!!(this.currentAnimation_.Animation.ChainAnimation.Flags.Player & PLAYER_FLAGS.USE_CURRENT_VX))
                newAnimation.Vx = (this.currentAnimation_.Animation.ChainAnimation.ChainVxFunc(this.currentAnimation_.Vx));
            if(!!(this.currentAnimation_.Animation.ChainAnimation.Flags.Player & PLAYER_FLAGS.USE_CURRENT_VY))
                newAnimation.Vy = (this.currentAnimation_.Animation.ChainAnimation.ChainVyFunc(this.currentAnimation_.Vy));
        }

        if(!!this.currentAnimation_.Animation.Trail)
            this.currentAnimation_.Animation.Trail.Disable();

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

        this.currentAnimation_.Animation.ControllerAnimation = null;
        if(!!(this.currentAnimation_.Animation.IgnoresCollisions))
        {
            if(!(newAnimation.Animation.IgnoresCollisions))
                this.Flags.Player.Remove(PLAYER_FLAGS.IGNORE_COLLISIONS);
            this.fixXFn_(1);
        }
        this.Flags.Pose.Remove(this.currentAnimation_.Animation.Flags.Pose);
    }

    this.currentAnimation_ = newAnimation;
    if(!!newAnimation && !!newAnimation.Animation)
    {
        this.SetPendingGrapple(false);
        if(this.IsExecutingSuperMove())
        {
            this.GetMatch().OnSuperMoveCompleted(this);
            this.SetExecutingSuperMove(false);
        }
        if(!!newAnimation.Animation.IsSuperMove)
        {
            this.SetZOrder(20);
            this.GetMatch().OnSuperMoveStarted(this);
            this.QueueSuperMoveChargeSound();
            this.SetExecutingSuperMove(true);
        }


        /*must start a move on the ground to hold airborne*/
        if(this.IsAirborne())
            this.canHoldAirborne_ = false;
        else
            this.canHoldAirborne_ = true;

        if(this.currentAnimation_.Vx === undefined)
            this.currentAnimation_.Vx = this.currentAnimation_.Animation.Vx;
        if(this.currentAnimation_.Vy === undefined)
            this.currentAnimation_.Vy = this.currentAnimation_.Animation.Vy;

        this.canInterrupt_ = false;
        this.ClearVxFn();
        this.ClearVyFn();
        this.currentAnimation_.ID = _c3(this.id_,this.currentAnimation_.Animation.BaseAnimation.name_,this.GetGame().GetCurrentFrame());
        this.currentAnimation_.FrameIndex = 0;
        this.ignoreHoldFrame_ = false;
        this.ignoreCollisionsWith_ = "";
        this.Flags.Pose.Add(newAnimation.Animation.Flags.Pose);
        this.SetAdjustShadowPosition(newAnimation.Animation.AdjustShadowPosition);
        if(!(newAnimation.Animation.Flags.Player & PLAYER_FLAGS.HOLD_ZINDEX))
            this.MoveToFront();

        this.OffsetImageX(0);
        this.OffsetImageY(0);


        if(!!newAnimation.Animation.energyToSubtract_)
            this.ChangeEnergy(-newAnimation.Animation.energyToSubtract_);
        else if(!!newAnimation.Animation.EnergyToAdd)
            this.ChangeEnergy(newAnimation.Animation.EnergyToAdd);

        if(!!newAnimation.Animation.Trail)
            this.currentAnimation_.Animation.Trail.Enable(newAnimation.StartFrame,this.element_);
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
        if(this.Flags.Player.Has(PLAYER_FLAGS.SMALLER_AABB))
        {
            this.yBottomOffset_ = 0;
            this.yTopOffset_ = 0;
        }
        /*Remove the flags that were set by the current frame*/
        /*Except for the ones that must be cleared at a later time.*/

        this.Flags.Player.Remove((this.currentFrame_.FlagsToSet.Player
                    | PLAYER_FLAGS.MOBILE)
                    ^ PLAYER_FLAGS.MOBILE);

        this.Flags.Pose.Remove((this.currentFrame_.FlagsToSet.Pose
                    | POSE_FLAGS.AIRBORNE
                    | POSE_FLAGS.AIRBORNE_FB)
                    ^ POSE_FLAGS.AIRBORNE
                    ^ POSE_FLAGS.AIRBORNE_FB);


        this.Flags.Combat.Remove((this.currentFrame_.FlagsToSet.Combat
                    | COMBAT_FLAGS.PROJECTILE_ACTIVE
                    | COMBAT_FLAGS.CAN_BE_BLOCKED
                    | COMBAT_FLAGS.CAN_BE_AIR_BLOCKED)
                    ^ COMBAT_FLAGS.PROJECTILE_ACTIVE
                    ^ COMBAT_FLAGS.CAN_BE_BLOCKED
                    ^ COMBAT_FLAGS.CAN_BE_AIR_BLOCKED);


        this.Flags.SwingSound.Remove(this.currentFrame_.FlagsToSet.SwingSound);
        this.Flags.HitSound.Remove(this.currentFrame_.FlagsToSet.HitSound);
        this.Flags.BlockSound.Remove(this.currentFrame_.FlagsToSet.BlockSound);
        
    }

    var isNewFrame = false;
    
    if(!!newFrame && !!this.currentFrame_ && newFrame.ID != this.currentFrame_.ID)
    {
        if(!!newFrame.LeftSrc && !!this.currentFrame_.LeftSrc && spriteLookup_.GetLeft(newFrame.LeftSrc) != spriteLookup_.GetLeft(this.currentFrame_.LeftSrc))
        {
            isNewFrame = true;
        }
    }
    var isNewSound = !!newFrame
                && ((!!newFrame.soundFilename_ && ((!this.currentFrame_) || (!!this.currentFrame_ && (this.currentFrame_.soundFilename_ != newFrame.soundFilename_))))
                || !!newFrame.FlagsToSet.SwingSound);


    this.currentFrame_ = newFrame;
    if(!!newFrame)
    {
        /*used to force the other player to change frames during a throw*/
        if(!!isNewFrame)
            ++this.currentAnimation_.FrameIndex;

        if(!!(newFrame.FlagsToClear.Combat & COMBAT_FLAGS.SUPER_MOVE_PAUSE))
        {
            this.GetMatch().OnSuperMoveCompleted(this);
            this.SetExecutingSuperMove(false);
        }
        /*if the new frame spawns a projectile, handle that here*/
        if(!this.Flags.Combat.Has(COMBAT_FLAGS.PROJECTILE_ACTIVE) && !!(newFrame.FlagsToSet.Combat & COMBAT_FLAGS.SPAWN_PROJECTILE))
            this.projectiles_[newFrame.chainProjectile_].Throw(frame,stageX,stageY);
        if(!!this.isSliding_ && !!(newFrame.FlagsToSet.Combat & COMBAT_FLAGS.STOP_SLIDE_BACK))
            this.StopSlide();
        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.RESET_Y_FUNC))
            this.ResetVyFn();
        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.RESET_X_FUNC))
            this.ResetVxFn();
        if(!!(newFrame.FlagsToSet.Spawn & SPAWN_FLAGS.SPAWN_BIGDIRT))
            this.ShowBigDirt(frame);
        /*StartSlide will show the dirt animations, but we set the amount to 0 so the player itself does not move.*/
        else if(!!(newFrame.FlagsToSet.Spawn & SPAWN_FLAGS.SPAWN_SMALLDIRT))
            this.ShowSmallDirt(frame);

        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.MOVE_TO_BACK) || !!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.BLOCKING))
            this.MoveToBack();
        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.MOVE_TO_FRONT))
            this.MoveToFront();

        ignoredFlags = POSE_FLAGS.AIRBORNE | POSE_FLAGS.AIRBORNE_FB; /*flags to be set in the OnFrame function*/
        this.Flags.Pose.Add((newFrame.FlagsToSet.Pose | ignoredFlags) ^ ignoredFlags);
        this.Flags.Combat.Add(newFrame.FlagsToSet.Combat);
        this.Flags.Player.Add(newFrame.FlagsToSet.Player);
        this.Flags.Spawn.Add(newFrame.FlagsToSet.Spawn);

        //this.Flags.MotionSound.Add(newFrame.FlagsToSet.MotionSound);
        //this.Flags.SwingSound.Add(newFrame.FlagsToSet.SwingSound);
        //this.Flags.HitSound.Add(newFrame.FlagsToSet.HitSound);
        //this.Flags.BlockSound.Add(newFrame.FlagsToSet.BlockSound);


        if(!!this.canHoldAirborne_ && (!!(newFrame.FlagsToClear.Pose & POSE_FLAGS.AIRBORNE) || !!(newFrame.FlagsToClear.Pose & POSE_FLAGS.AIRBORNE_FB)))
            this.StopJump();

        this.Flags.Pose.Remove(newFrame.FlagsToClear.Pose);
        this.Flags.Combat.Remove(newFrame.FlagsToClear.Combat);
        this.Flags.Player.Remove(newFrame.FlagsToClear.Player);
        this.Flags.Spawn.Remove(newFrame.FlagsToClear.Spawn);

        if(!!(newFrame.FlagsToSet.Player & PLAYER_FLAGS.SMALLER_AABB))
        {
            var offsetData = this.currentAnimation_.Animation.UserData;
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

        /*this must run before SetSprite*/
        if((!!newFrame.soundFilename_ || !!newFrame.FlagsToSet.SwingSound) && !!isNewSound)
        {
            this.QueueSwingSound(newFrame.FlagsToSet.SwingSound);
            if(!!newFrame.soundFilename_)
                this.QueueSound(newFrame.soundFilename_,newFrame.soundVolume_);
        }
    }
}

Player.prototype.InitSprite = function()
{
    var src = "images/misc/" + this.folder_.toLowerCase() + "/sprites.png";
    this.spriteElement_.style.backgroundImage = "url('" + src + "')";
}

Player.prototype.SetSpriteData = function(base64Data)
{
    this.spriteElement_.style.backgroundImage = "url(" + base64Data + ")";
}

Player.prototype.SetSprite = function()
{
    if(this.currentAnimation_.Direction > 0)
    {
        data = spriteLookup_.Get(this.currentFrame_.RightSrc);
        if(!!data)
        {
            this.spriteElement_.style.backgroundPosition = data.Left + " " + data.Bottom;
            this.spriteElement_.style.width = data.Width;
            this.spriteElement_.style.height = data.Height;
            this.element_.style.width = data.Width;
        }
    }
    else
    {
        data = spriteLookup_.Get(this.currentFrame_.LeftSrc);
        if(!!data)
        {
            this.spriteElement_.style.backgroundPosition = data.Left + " " + data.Bottom;
            this.spriteElement_.style.width = data.Width;
            this.spriteElement_.style.height = data.Height;
            this.element_.style.width = data.Width;
        }
    }
    if(this.currentFrame_.ImageOffsetX != undefined)
        this.OffsetImageX(this.currentFrame_.ImageOffsetX);
    if(this.currentFrame_.ImageOffsetY != undefined)
        this.OffsetImageY(this.currentFrame_.ImageOffsetY);
}

/*Sets the x and y on the element*/
Player.prototype.Render = function(frame,stageDiffX)
{
    this.CheckZOrder();
    if(!this.isPaused_)
    {
        if(!!this.currentFrame_)
        {
            this.SetSprite();
            if(!!this.currentFrame_.ShadowImageSrc && (this.shadow_._relSrc != this.currentFrame_.ShadowImageSrc))
            {
                this.shadow_._relSrc  = this.currentFrame_.ShadowImageSrc;
                spriteLookup_.Set(this.shadow_, this.currentFrame_.ShadowImageSrc);
            }
        }


        if(this.direction_ > 0)
            this.SetRight(this.x_);
        else
            this.SetLeft(this.x_);
        this.element_.style.bottom = Math.max(this.y_,STAGE.FLOORY) + "px";
        this.RenderShadow();
        this.RenderTrail(frame,stageDiffX);
        this.RenderDebugInfo();
        this.PlaySounds();
    }
}

/*renders the trail, if there is one*/
Player.prototype.RenderTrail = function(frame,stageDiffX)
{
    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.Trail)
        this.currentAnimation_.Animation.Trail.Render(frame,-this.direction_ * stageDiffX);
}

Player.prototype.RenderShadow = function()
{

    if(this.direction_ > 0)
    {
        if(this.lastShadowRight_ != this.x_)
        {
            this.lastShadowLeft_ = 0;
            this.lastShadowRight_ = this.x_;
            this.shadowContainer_.style.right = this.x_ + "px";
        }
        if(!!this.GetAdjustShadowPosition())
        {
            this.shadow_.style.right = this.spriteElement_.style.right;
        }
    }
    else
    {
        if(this.lastShadowLeft_ != this.x_)
        {
            this.lastShadowRight_ = 0;
            this.lastShadowLeft_ = this.x_;
            this.shadowContainer_.style.left = this.x_ + "px";
        }
        if(!!this.GetAdjustShadowPosition())
        {
            this.shadow_.style.left = this.spriteElement_.style.left;
        }
    }


}

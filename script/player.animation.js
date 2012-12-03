/*Helper function - adds a projectile for the player*/
Player.prototype.addProjectile = function(name,offsetX, offsetY,speedRate)
{
    var projectile = CreateProjectile(this,CreateAnimation(name),CreateAnimation(name + "-disintegrate"),offsetX,offsetY,speedRate);
    this.Projectiles[this.Projectiles.length] = projectile;
    //projectile.Id = this.Id + "_" + this.Projectiles.length;

    return projectile;
}

/* Helper function - adds a move for the player */
Player.prototype.addThrow = function(requiredState,name,duration,keySequence,priority,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    var key = "_" + (requiredState == undefined ? "" : requiredState);
    for(var i = 0; i < keySequence.length; ++i)
        key += "_" + keySequence[i].toString();
    this.Throws[key] = CreateAnimation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);
    this.Throws[key].BaseAnimation.IsThrow = true;

    return this.Throws[key];
}

/* Helper function - adds a move for the player */
Player.prototype.addAnimation = function(requiredState,name,duration,keySequence,priority,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    var key = "_" + (requiredState == undefined ? "" : requiredState);
    var ignoreDepressedKeys = false;
    for(var i = 0; i < keySequence.length; ++i)
    {
        key += "_" + keySequence[i].toString();
        if(hasFlag(keySequence[i],BUTTONS.CHARGE))
            ignoreDepressedKeys = true;
    }
    this.Moves[key] = CreateAnimation(requiredState,name,duration,null,keySequence,null,priority,0,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName);
    this.Moves[key].IgnoreDepressedKeys = ignoreDepressedKeys;
    return this.Moves[key];
}
/* Helper function - adds a move for the player */
Player.prototype.addGenericAnimation = function(state,team,name,moveFlags)
{
    var key = _c4("_",state,"_",team);
    this.OtherAnimations[key] = CreateGenericAnimation(name,[],moveFlags || MOVE_FLAGS.NONE);

    return this.OtherAnimations[key];
}
/*helper function - adds the dizzy stars animation*/
Player.prototype.addDizzyAnimation = function(centeredOffset,topOffset)
{
    this.OtherAnimations.Dizzy[this.OtherAnimations.Dizzy.length] =
    {
        Direction:this.Direction
        ,StartFrame:0
        ,Element:this.DizzyElement
        ,Animation:CreateGenericAnimation("dizzy",[],MOVE_FLAGS.MOVE_TO_PLAYER,0,0,centeredOffset,topOffset,true)
    };
    return this.OtherAnimations.Dizzy[this.OtherAnimations.Dizzy.length-1].Animation;
}
/*helper function - adds the blue fire animation*/
Player.prototype.addBlueFireAnimation = function(centeredOffset,topOffset)
{
    this.OtherAnimations.BlueFire =
    {
        Direction:this.Direction
        ,StartFrame:0
        ,Element:this.FireElement
        ,Animation:CreateGenericAnimation("blue-fire",[],MOVE_FLAGS.MOVE_TO_PLAYER,0,0,centeredOffset,topOffset,true)
    };
    return this.OtherAnimations.BlueFire.Animation;
}
/*helper function - adds the red fire animation*/
Player.prototype.addRedFireAnimation = function(centeredOffset,topOffset)
{
    this.OtherAnimations.RedFire =
    {
        Direction:this.Direction
        ,StartFrame:0
        ,Element:this.FireElement
        ,Animation:CreateGenericAnimation("red-fire",[],MOVE_FLAGS.MOVE_TO_PLAYER,0,0,centeredOffset,topOffset,true)
    };
    return this.OtherAnimations.RedFire.Animation;
}
/* Helper function - adds a dirt animation for the player */
Player.prototype.addDirtAnimation = function()
{
    var img = window.document.createElement("div");
    img.className = "dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.OtherAnimations.Dirt[this.OtherAnimations.Dirt.length] =
    {
        Direction:this.Direction
        ,StartFrame:0
        ,Element:img
        ,Animation:CreateGenericAnimation("dirt",[],MOVE_FLAGS.NONE)
    };

    return this.OtherAnimations.Dirt[this.OtherAnimations.Dirt.length-1].Animation;
}
/* Helper function - adds a big dirt for the player */
Player.prototype.addBigDirtAnimation = function()
{
    var img = window.document.createElement("div");
    img.className = "big-dirt";
    img.style.display = "none";
    window.document.getElementById("pnlStage").appendChild(img);


    this.OtherAnimations.BigDirt[this.OtherAnimations.BigDirt.length] =
    {
        Direction:this.Direction
        ,StartFrame:0
        ,Element:img
        ,Animation:CreateGenericAnimation("big dirt",[],MOVE_FLAGS.NONE)
    };

    return this.OtherAnimations.BigDirt[this.OtherAnimations.BigDirt.length-1].Animation;
}
/*sets the current animation by looking up the name of the animation - this function can be called by AI*/
Player.prototype.executeAnimation = function(name)
{
    var animation = null;
    if(this.Flags.Player.has(PLAYER_FLAGS.MOBILE))
    {
        var currentEnergy = this.getEnergyFn();

        for(var i in this.Moves)
        {
            if(!!animation)
                break;

            var move = this.Moves[i];
            if(this.Moves[i].BaseAnimation.Name == name)
            {
                animation = this.Moves[i];
            }
            else
            {
                continue;
            }

            if(!!move.EnergyToSubtract && currentEnergy < move.EnergyToSubtract)
                continue;
            var pstate = (move.RequiredFlags | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
            var mustAllowBlock = hasFlag(move.RequiredFlags,POSE_FLAGS.ALLOW_BLOCK);
            var mustAllowAirBlock = hasFlag(move.RequiredFlags,POSE_FLAGS.ALLOW_AIR_BLOCK);
            if(!pstate || this.Flags.Pose.has(pstate))
            {
            
                if(!!mustAllowBlock && !(this.Flags.Pose.has(POSE_FLAGS.ALLOW_BLOCK)))
                    continue;
                if(!!mustAllowAirBlock && !(this.Flags.Pose.has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
                    continue;

                if(!!this.isProjectileInUse(move))
                    continue;
            }
        }

        if(!!animation)
        {
            this.setCurrentAnimation({Animation:animation,StartFrame:this.getMatch().getCurrentFrame(),Direction:this.Direction});
            return true;
        }
    }
    return false;
}
//looks up a throw
Player.prototype.findThrow = function(value,frame)
{
    var keys = value.Keys;

    /*check if the player wants to turn around*/
    if(frame % 10 == 0)
    {
        for(var i = 0; i < keys.length; ++i)
        {
            if(hasFlag(keys[i].Bit,BUTTONS.TURN_AROUND))
            {
                this.turnAround();
                return null;
            }
        }
    }

    var matches = [];
    var retVal = {Priority:-999999,Move:null};
    var val = 0;
    var currentEnergy = this.getEnergyFn();

    //check for a throw first
    for(var i in this.Throws)
    {
        if(-1 != this.testAnimation(frame,currentEnergy,keys,value.Duration,this.Throws[i],retVal))
            break;
    }

    return retVal.Move;
}

/* Looks up a move */
Player.prototype.findAnimation = function(value,frame)
{
    var keys = value.Keys;

    /*check if the player wants to turn around*/
    if(frame % 10 == 0)
    {
        for(var i = 0; i < keys.length; ++i)
        {
            if(hasFlag(keys[i].Bit,BUTTONS.TURN_AROUND))
            {
                this.turnAround();
                return null;
            }
        }
    }

    var matches = [];
    var retVal = {Priority:-999999,Move:null};
    var val = 0;
    var currentEnergy = this.getEnergyFn();

    //check for block chaining
    if(!!this.isBlockingHigh() && keys.length == 1 && (keys[0].NbFrames > 2) && (keys[0].Bit == (BUTTONS.CROUCH|BUTTONS.BACK)))
    {
        //this.chainToAnimation(frame, this.CurrentAnimation.Animation.ChainOnKeyAnimation,this.CurrentAnimation.Animation.ChainOnKeyAnimationFrame);
        this.chainToAnimation(frame, this.Moves["_160_10"],2);
        return -1;
    }

    //check for block chaining
    else if(!!this.isBlockingLow() && keys.length == 1 && (keys[0].NbFrames > 2) && (keys[0].Bit == (BUTTONS.BACK)) && !this.isKeyDown(BUTTONS.CROUCH))
    {
        //this.chainToAnimation(frame, this.CurrentAnimation.Animation.ChainOnKeyAnimation,this.CurrentAnimation.Animation.ChainOnKeyAnimationFrame);
        this.chainToAnimation(frame, this.Moves["_198_2"],2);
        return -1;
    }


    for(var i in this.Moves)
    {
        if(-1 != this.testAnimation(frame,currentEnergy,keys,value.Duration,this.Moves[i],retVal))
            break;
    }
    return retVal.Move;
}

//
Player.prototype.testAnimation = function(frame,currentEnergy,keys,keyDuration,move,retVal)
{
    var continueCode = -1;

    if(!!move.IsImplicit)
        return continueCode;

    var tmp = move.filterKeySequence(keys,move.NbChargeFrames);
    var tmpKeys = tmp.Keys;

    if(!(move.compareKeySequenceLength(tmpKeys.length))
        ||(!!move.Duration && (keyDuration > move.Duration)
        ||(!!move.EnergyToSubtract && currentEnergy < move.EnergyToSubtract)))
        return continueCode;
    var pstate = (move.RequiredFlags | POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK) ^ (POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_AIR_BLOCK);
    var mustAllowBlock = hasFlag(move.RequiredFlags,POSE_FLAGS.ALLOW_BLOCK);
    var mustAllowAirBlock = hasFlag(move.RequiredFlags,POSE_FLAGS.ALLOW_AIR_BLOCK);
    if(!pstate || !!(this.Flags.Pose.has(pstate)))
    {
            
        if(!!mustAllowBlock && !(this.Flags.Pose.has(POSE_FLAGS.ALLOW_BLOCK)))
            return continueCode;
        if(!!mustAllowAirBlock && !(this.Flags.Pose.has(POSE_FLAGS.ALLOW_AIR_BLOCK)))
            return continueCode;

        if(!!this.isProjectileInUse(move))
            return continueCode;

        /*the move may have already been an exact match from the FilterKeySequence function call*/
        var cmpValue = tmp.Match || this.compareKeySequence(move,tmpKeys);
        if(!cmpValue)
            cmpValue = this.compareAlternateKeySequences(move,tmpKeys);


        if(cmpValue == CONSTANTS.EXACT_MATCH)
        {
            if(!!move.GrappleDistance)
            {
                if(!!this.RegisteredHit.HitID)
                    return continueCode;
                if(!this.tryStartGrapple(move,frame))
                    return continueCode;
            }

            retVal.Move = move;
            return null;
        }
        else
        {
            if(!!move.GrappleDistance)
                return continueCode;
        }

        if(cmpValue == 0)
            return continueCode;
        if((cmpValue == CONSTANTS.PRIORITY_MATCH) && move.Priority > retVal.Priority)
        {
            retVal.Priority = move.Priority;
            retVal.Move = move;
        }
    }

    return continueCode;
}
//
Player.prototype.goToStance = function(frame)
{
    if(this.Flags.Player.has(PLAYER_FLAGS.DEAD))
    {
        this.ForceImmobile = true;
        this.Flags.Player.remove(PLAYER_FLAGS.MOBILE);
        var move = this.Moves["_0_dead"];
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction},true);
        this.getMatch().deadAnimationComplete(this,frame);
    }
    else
    {
        if((this.WinningFrame != CONSTANTS.NO_FRAME) && frame > (this.WinningFrame + CONSTANTS.WIN_ANIMATION_DELAY))
        {
            this.forceWinAnimation(frame);
            return;
        }
        this.Flags.Player.add(PLAYER_FLAGS.MOBILE);
        var move = this.Moves["_0_stance"];
        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction},true);
    }
}
/*returns the first free front hit report image*/
Player.prototype.getNextFrontHitReportImage = function()
{
    for(var i = 0; i < this.FrontHitReportImages.length; ++i)
    {
        if(!this.FrontHitReportImages[i].isInUse)
        {
            this.FrontHitReportImages[i].isInUse = true;
            return this.FrontHitReportImages[i];
        }
    }

    return null;
}
/*returns the first free rear hit report image*/
Player.prototype.getNextRearHitReportImage = function()
{
    for(var i = 0; i < this.RearHitReportImages.length; ++i)
    {
        if(!this.RearHitReportImages[i].isInUse)
        {
            this.RearHitReportImages[i].isInUse = true;
            return this.RearHitReportImages[i];
        }
    }

    return null;
}
/*returns the first free dirt image*/
Player.prototype.getFreeDirtIndex = function()
{
    for(var i = 0; i < this.OtherAnimations.Dirt.length; ++i)
    {
        if(!this.OtherAnimations.Dirt[i].Animation.IsActive)
        {
            this.OtherAnimations.Dirt[i].Animation.IsActive = true;
            return i;
        }
    }

    return continueCode;
}
/*returns the first free dirt image*/
Player.prototype.getFreeBigDirtIndex = function()
{
    for(var i = 0; i < this.OtherAnimations.BigDirt.length; ++i)
    {
        if(!this.OtherAnimations.BigDirt[i].Animation.IsActive)
        {
            this.OtherAnimations.BigDirt[i].Animation.IsActive = true;
            return i;
        }
    }

    return continueCode;
}

Player.prototype.spawnDizzy = function(frame)
{   
    this.DizzyIndex = +!this.DizzyIndex;
    var instance = this.OtherAnimations.Dizzy[this.DizzyIndex];
    instance.StartFrame = frame;
    instance.Animation.Direction = this.Direction;
    instance.Animation.InitialX = this.getX() - this.HeadOffsetX;
    instance.Animation.InitialY = this.getConstOffsetTop() - this.HeadOffsetY - STAGE.FLOORY;
    instance.Animation.InitialStageY = game_.Match.Stage.getGroundY();
}

Player.prototype.spawnRedFire = function(frame)
{   
    var instance = this.OtherAnimations.RedFire;
    instance.StartFrame = frame;
    instance.Animation.Direction = this.Direction;
    instance.Animation.InitialX = this.getX() - this.HeadOffsetX;
    instance.Animation.InitialY = this.getConstOffsetTop() - this.HeadOffsetY - STAGE.FLOORY;
    instance.Animation.InitialStageY = game_.Match.Stage.getGroundY();
}

Player.prototype.spawnBlueFire = function(frame)
{   
    var instance = this.OtherAnimations.RedFire;
    instance.StartFrame = frame;
    instance.Animation.Direction = this.Direction;
    instance.Animation.InitialX = this.getX() - this.HeadOffsetX;
    instance.Animation.InitialY = this.getConstOffsetTop() - this.HeadOffsetY - STAGE.FLOORY;
    instance.Animation.InitialStageY = game_.Match.Stage.getGroundY();
}

Player.prototype.spawnSmallDirt = function(frame,offsetX)
{
    if(!this.isOnGround())
        return;
    /*spawn dirt*/
    var index = this.getFreeDirtIndex();
    if(index > -1)
    {
        var instance = this.OtherAnimations.Dirt[index];
        instance.StartFrame = frame;
        instance.Animation.Direction = this.Direction;
        if(!!offsetX)
            this.setLastHit(instance.Animation,CONSTANTS.USE_PLAYER_XY,offsetX,CONSTANTS.SMALLDIRT_OFFSETY);
        else
            this.setLastHit(instance.Animation,CONSTANTS.USE_PLAYER_BOTTOM);
        this.DirtIndices[this.DirtIndices.length] = index;
    }
}

Player.prototype.spawnBigDirt = function(frame,offsetX)
{
    if(!this.isOnGround())
        return;

    /*spawn dirt*/
    var index = this.getFreeBigDirtIndex();
    if(index > -1)
    {
        var instance = this.OtherAnimations.BigDirt[index];
        instance.StartFrame = frame;
        instance.Animation.Direction = this.Direction;
        this.setLastHit(instance.Animation,CONSTANTS.USE_PLAYER_XY,offsetX,CONSTANTS.BIGDIRT_OFFSETY);
        this.BigDirtIndices[this.BigDirtIndices.length] = index;
    }
}


/*Handles frames that spawn other animations*/
Player.prototype.spawnHitReportAnimations = function(frame, flags, hitState, attackDirection)
{
    var frontKey = "";
         if(!!(this.Flags.Player.has(PLAYER_FLAGS.BLOCKING))) {frontKey = _c3("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.BLOCK,"_0");}
    else if(hasFlag(flags,ATTACK_FLAGS.LIGHT))    {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.LIGHT,"_",this.Team);}
    else if(hasFlag(flags,ATTACK_FLAGS.MEDIUM))   {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.MEDIUM,"_",this.Team);}
    else if(hasFlag(flags,ATTACK_FLAGS.HARD))     {frontKey = _c4("_",ATTACK_FLAGS.FRONT|ATTACK_FLAGS.HARD,"_",this.Team);}

    var animation = this.OtherAnimations[frontKey];
    if(!!animation)
    {
        this.setLastHit(animation);
        animation.Direction = attackDirection;
        this.FrontHitReport[this.FrontHitReport.length] = {Animation:animation,StartFrame:frame,Direction:attackDirection,Element:this.getNextFrontHitReportImage()};
    }

    if(!this.Flags.Player.has(PLAYER_FLAGS.BLOCKING) && hasFlag(flags,ATTACK_FLAGS.REAR))
    {
        var rearKey = "";
        if(hasFlag(hitState,HIT_FLAGS.FAR) && hasFlag(flags,ATTACK_FLAGS.SPIT1)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT1,"_0");}
        else if(hasFlag(hitState,HIT_FLAGS.FAR) && hasFlag(flags,ATTACK_FLAGS.SPIT2)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT2,"_0");}

        else if(hasFlag(flags,ATTACK_FLAGS.SPECIAL))
        {
                 if(hasFlag(flags,ATTACK_FLAGS.LIGHT)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,"_0");}
            else if(hasFlag(flags,ATTACK_FLAGS.MEDIUM)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,"_0");}
            else if(hasFlag(flags,ATTACK_FLAGS.HARD)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,"_0");}
        }

        else if(hasFlag(flags,ATTACK_FLAGS.SPECIAL1)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,"_0");}
        else if(hasFlag(flags,ATTACK_FLAGS.SPECIAL2)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,"_0");}
        else if(hasFlag(flags,ATTACK_FLAGS.SPECIAL3)) {rearKey = _c3("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,"_0");}

        else if(hasFlag(flags,ATTACK_FLAGS.LIGHT)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.LIGHT,"_",this.Team);}
        else if(hasFlag(flags,ATTACK_FLAGS.MEDIUM)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.MEDIUM,"_",this.Team);}
        else if(hasFlag(flags,ATTACK_FLAGS.HARD)) {rearKey = _c4("_",ATTACK_FLAGS.REAR|ATTACK_FLAGS.HARD,"_",this.Team);}


        var rearAnimation = this.OtherAnimations[rearKey];
        if(!!rearAnimation)
        {
            this.setLastHit(rearAnimation,CONSTANTS.USE_PLAYER_TOP);
            this.RearHitReport[this.RearHitReport.length] = {Animation:rearAnimation,StartFrame:frame,Direction:attackDirection,Element:this.getNextRearHitReportImage()};
        }
    }
}

/*Gets the hit ID of the current frame*/
Player.prototype.getHitFrameID = function(hitID)
{
    return this.Id + "-" + this.CurrentAnimation.Animation.BaseAnimation.Name + "-" + (hitID || this.CurrentFrame.HitID) + "-" + this.MoveCount;
}

/*Gets the hit ID of the current frame*/
Player.prototype.getFrameImageID = function(hitID)
{
    return this.CurrentFrame.ImageID;
}


/*If there is a chaining move after a hit, then it will be set to the current move*/
Player.prototype.tryChainOnHit = function(frame)
{
    if(!!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!this.CurrentAnimation.Animation.ChainOnHitAnimation)
    {
        var chained = this.CurrentAnimation.Animation.ChainOnHitAnimation;
        this.chainToAnimation(frame, chained);
    }
}

/*If there is a chaining move, then it will be set to the current move*/
Player.prototype.tryChainAnimation = function(frame,stageX,stageY)
{
    if(!!this.CurrentAnimation && !!this.CurrentAnimation.Animation && hasFlag(this.CurrentAnimation.Animation.Flags.Player,PLAYER_FLAGS.LOOP_IF_KEYDOWN))
    {
        this.KeyStateChanged = true;
        
        //the last key in the keySequence must be the required key
        var key = this.CurrentAnimation.Animation.getKey(this.CurrentAnimation.Animation.getKeySequenceLength() - 1);
        //... and was the key pressed?
        if(this.isKeyDown(key))
        {
            this.CurrentAnimation.StartFrame = frame;
            //var firstFrame = this.CurrentAnimation.Animation.BaseAnimation.Frames[0];
            //this.setCurrentFrame(firstFrame,frame,stageX,stageY);
            this.checkMustChangeDirection();
            return;
        }
    }
    if(!!this.CurrentAnimation && !!this.MustChangeDirection && !this.isDead() && (!this.CurrentAnimation.Animation || (!!this.CurrentAnimation.Animation && !this.CurrentAnimation.Animation.ChainAnimation)))
    {
        if(this.getMustChangeDirection(true))
        {
            if(!!this.CurrentAnimation.Animation.Flags.Pose && hasFlag(this.CurrentAnimation.Animation.Flags.Pose,POSE_FLAGS.QUICK_CHANGE_DIRECTION))
                this.changeDirection(true);
            else
                this.changeDirection();
        }
        else
        {
            this.goToStance(frame);
        }
    }
    else if(!!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!this.CurrentAnimation.Animation.ChainAnimation)
    {
        var chained = this.CurrentAnimation.Animation.ChainAnimation;
        //dont allow chaining to getup if the player is dead
        if(chained.BaseAnimation.Name == "bounce" && this.isDead())
            chained = this.Moves._0_hr_deadbounce;
        var move = chained;
        this.chainToAnimation(frame, move);
    }
    else
    {
        this.goToStance(frame);
    }
}

Player.prototype.chainToAnimation = function(frame,move,frameOffset,stageX,stageY)
{
    var newFrame = move.BaseAnimation.Frames[frameOffset || this.CurrentAnimation.Animation.ChainAnimationFrame];
    var attackDirection = this.CurrentAnimation.AttackDirection;

    var tmp = {ID:this.Id + move.BaseAnimation.Name + frame.toString() ,Animation:move,StartFrame:frame - newFrame.FrameOffset,Direction:this.Direction,AttackDirection:attackDirection};
    this.setCurrentAnimation(tmp,true);
    this.setCurrentFrame(newFrame,frame,stageX,stageY);
}

/*clear interupt flags from the pose state*/
Player.prototype.clearInterupt = function()
{
    this.Flags.Pose.Value = (this.Flags.Pose.Value
                    | POSE_FLAGS.ALLOW_INTERUPT_1
                    | POSE_FLAGS.ALLOW_INTERUPT_2
                    | POSE_FLAGS.ALLOW_INTERUPT_3
                    | POSE_FLAGS.ALLOW_INTERUPT_4
                    | POSE_FLAGS.ALLOW_INTERUPT_5
                    | POSE_FLAGS.ALLOW_INTERUPT_6)
                    ^ POSE_FLAGS.ALLOW_INTERUPT_1
                    ^ POSE_FLAGS.ALLOW_INTERUPT_2
                    ^ POSE_FLAGS.ALLOW_INTERUPT_3
                    ^ POSE_FLAGS.ALLOW_INTERUPT_4
                    ^ POSE_FLAGS.ALLOW_INTERUPT_5
                    ^ POSE_FLAGS.ALLOW_INTERUPT_6
                    ;
}

Player.prototype.clearUnclearedFlags = function()
{
    this.Flags.Player.remove(PLAYER_FLAGS.BULLDOZE);
}

/*Sets the current move*/
Player.prototype.setCurrentAnimation = function(newAnimation,isChaining)
{
    ++this.MoveCount;
    this.NbHits = 0;
    this.MaintainYPosition = false;
    this.clearUnclearedFlags();
    if(!!this.CurrentAnimation && this.CurrentAnimation.Animation)
    {
        //this.LastAnimation = this.CurrentAnimation.Animation;
        //this.onEndAttackEnemiesFn(0);
        this.CurrentAnimation.Animation.hideChildren();
        //maintain the same velocity if required
        if(!!newAnimation && !!this.CurrentAnimation.Animation.ChainAnimation)
        {
            if(hasFlag(this.CurrentAnimation.Animation.ChainAnimation.Flags.Player,PLAYER_FLAGS.USE_CURRENT_VX))
                newAnimation.Vx = (this.CurrentAnimation.Animation.ChainAnimation.chainVxFn(this.CurrentAnimation.Vx));
            if(hasFlag(this.CurrentAnimation.Animation.ChainAnimation.Flags.Player,PLAYER_FLAGS.USE_CURRENT_VY))
                newAnimation.Vy = (this.CurrentAnimation.Animation.ChainAnimation.chainVyFn(this.CurrentAnimation.Vy));
        }

        if(!!this.CurrentAnimation.Animation.Trail)
            this.CurrentAnimation.Animation.Trail.disable();

        //it is possible that the player was attacked before clearing the block state
        if(!!this.MustClearAllowBlock)
        {
            this.MustClearAllowBlock = false;
            this.onEndAttackFn(this.CurrentAnimation.ID);
        }
        if(!!this.MustClearAllowAirBlock)
        {
            this.MustClearAllowAirBlock = false;
            this.onEndAirAttackFn(this.CurrentAnimation.ID);
        }

        this.CurrentAnimation.Animation.ControllerAnimation = null;
        if(!!(this.CurrentAnimation.Animation.IgnoresCollisions))
        {
            if(!newAnimation.Animation || !(newAnimation.Animation.IgnoresCollisions))
                this.Flags.Player.remove(PLAYER_FLAGS.IGNORE_COLLISIONS);
            this.fixXFn(1);
        }
        this.Flags.Pose.remove(this.CurrentAnimation.Animation.Flags.Pose);
    }

    this.CurrentAnimation = newAnimation;
    var ignoreClearFire = false;
    if(!!newAnimation && !!newAnimation.Animation)
    {
        this.MaintainYPosition = newAnimation.Animation.MaintainYPosition;
        if(!!this.CurrentAnimation.Animation.Flags.Player)
        {
            //used for moves like MBison's head stomp - where you need to jump to the enemy's position
            if(hasFlag(this.CurrentAnimation.Animation.Flags.Player,PLAYER_FLAGS.MOVE_TO_ENEMY))
                this.CurrentAnimation.Animation.Vx = this.getPhysics().getInitialCloseGapVelocityX(this,this.getTarget(),this.CurrentAnimation.Animation.Vy);
            //turn around if required
            if(hasFlag(this.CurrentAnimation.Animation.Flags.Player,PLAYER_FLAGS.FACE_ENEMY))
            {
                if(!!this.MustChangeDirection)
                    this.changeDirection(true);
            }
            //clear fire if required
            ignoreClearFire = !hasFlag(this.CurrentAnimation.Animation.Flags.Combat,COMBAT_FLAGS.IGNORE_CLEAR_FIRE);
        }

        if(!!ignoreClearFire)
            this.clearFire();

        this.IsInAttackFrame = false;
        this.IgnoreOverrides = false;
        this.clearInterupt();
        this.checkPendingHit();
        this.setPendingGrapple(false);
        if(this.getIsExecutingSuperMove())
        {
            this.getMatch().onSuperMoveCompleted(this);
            this.setExecutingSuperMove(false);
        }
        if(!!newAnimation.Animation.IsSuperMove)
        {
            this.setZOrder(20);
            this.getMatch().onSuperMoveStarted(this);
            this.queueSuperMoveChargeSound();
            this.setExecutingSuperMove(true);
        }


        //must start a move on the ground to hold airborne (unless FORCE_START_AIRBORNE is set on a frame in the move)
        if(this.isAirborne())
            this.CanHoldAirborne = false;
        else
            this.CanHoldAirborne = true;

        if(!this.CurrentAnimation.Animation.KeepAirborneFunctions)
        {
            if(this.CurrentAnimation.Vx === undefined) 
                this.CurrentAnimation.Vx = this.CurrentAnimation.Animation.Vx;
            if(this.CurrentAnimation.Vy === undefined)
                this.CurrentAnimation.Vy = this.CurrentAnimation.Animation.Vy;

            this.clearVxFn();
            this.clearVyFn();
        }

        this.CanInterrupt = false;
        this.CurrentAnimation.ID = _c3(this.Id,this.CurrentAnimation.Animation.BaseAnimation.Name,game_.getCurrentFrame());
        this.CurrentAnimation.FrameIndex = 0;
        this.IgnoreHoldFrame = false;
        this.IgnoreCollisionsWith = "";
        this.Flags.Pose.add(newAnimation.Animation.Flags.Pose);
        this.setAdjustShadowPosition(newAnimation.Animation.AdjustShadowPosition);
        if(!hasFlag(newAnimation.Animation.Flags.Player,PLAYER_FLAGS.HOLD_ZINDEX))
            this.moveToFront();

        this.offsetImageX(0);
        this.offsetImageY(0);


        if(!__debugMode)
        {
            if(!!newAnimation.Animation.EnergyToSubtract)
                this.changeEnergy(-newAnimation.Animation.EnergyToSubtract);
            else if(!!newAnimation.Animation.EnergyToAdd)
                this.changeEnergy(newAnimation.Animation.EnergyToAdd);
        }

        if(!!newAnimation.Animation.Trail)
            this.CurrentAnimation.Animation.Trail.enable(newAnimation.StartFrame,this.Element,this.Direction);

        if(!isChaining)
            this.showFirstAnimationFrame();

        //if this move is an attack, then raise the event
        if(!!this.CurrentAnimation.Animation.BaseAnimation.IsAttack)
        {
            this.IsInAttackFrame = true;
            this.onStartAttackEnemiesFn(0);
        }
    }
}

Player.prototype.showFirstAnimationFrame = function()
{
    var firstFrame = this.CurrentAnimation.Animation.getFrame(0);
    this.setCurrentFrame(firstFrame,game_.getCurrentFrame(),0,0,true);
}

Player.prototype.AirborneFlags = POSE_FLAGS.AIR_COMBO_1 | POSE_FLAGS.AIR_COMBO_2 | POSE_FLAGS.AIRBORNE | POSE_FLAGS.AIRBORNE_FB;

/*flags that should be ignore when a frame's pose flags are cleared*/
Player.prototype.PoseFlagsToIgnore = POSE_FLAGS.AIR_COMBO_1
                    | POSE_FLAGS.AIR_COMBO_2
                    | POSE_FLAGS.AIRBORNE
                    | POSE_FLAGS.AIRBORNE_FB
                    | POSE_FLAGS.ALLOW_INTERUPT_1
                    | POSE_FLAGS.ALLOW_INTERUPT_2
                    | POSE_FLAGS.ALLOW_INTERUPT_3
                    | POSE_FLAGS.ALLOW_INTERUPT_4
                    | POSE_FLAGS.ALLOW_INTERUPT_5
                    | POSE_FLAGS.ALLOW_INTERUPT_6;

/*flags that should be ignore when a frame's combat flags are cleared*/
Player.prototype.CombatFlagsToIgnore = COMBAT_FLAGS.PROJECTILE_ACTIVE
                    | COMBAT_FLAGS.CAN_BE_BLOCKED
                    | COMBAT_FLAGS.CAN_BE_AIR_BLOCKED;

/*flags that should be ignore when a frame's player flags are cleared*/
Player.prototype.PlayerFlagsToIgnore = PLAYER_FLAGS.MOBILE | PLAYER_FLAGS.BULLDOZE;

Player.prototype.ResetClip = function()
{
    this.ClipMoveFront = 0;
    this.ClipMoveBack = 0;
    this.ClipMoveTop = 0;
    this.ClipHitBottom = 0;
    this.ClipHitFront = 0;
    this.ClipHitBack = 0;
    this.ClipHitTop = 0;
    this.ClipHitBottom = 0;
}

/*Sets the current frame*/
Player.prototype.setCurrentFrame = function(newFrame,frame,stageX,stageY,ignoreTranslation)
{
    if(!!this.CurrentFrame)
    {
        if(!!newFrame && (newFrame.ID == this.CurrentFrame.ID))
            return;

        //must remove the clip values each frame
        this.ResetClip();

        if(this.Flags.Player.has(PLAYER_FLAGS.INVISIBLE))
        {
            this.Element.style.display = "";
            this.ShadowContainer.style.display = "";
        }
        //Remove the flags that were set by the current frame, except for the ones that must be cleared at a later time.

        this.Flags.Player.remove((this.CurrentFrame.FlagsToSet.Player | Player.prototype.PlayerFlagsToIgnore) ^ Player.prototype.PlayerFlagsToIgnore);
        this.Flags.Pose.remove((this.CurrentFrame.FlagsToSet.Pose | Player.prototype.PoseFlagsToIgnore ) ^ Player.prototype.PoseFlagsToIgnore);
        this.Flags.Combat.remove((this.CurrentFrame.FlagsToSet.Combat | Player.prototype.CombatFlagsToIgnore) ^ Player.CombatFlagsToIgnore);
        this.Flags.Combo.remove(this.CurrentFrame.FlagsToSet.Combo);


        this.Flags.SwingSound.remove(this.CurrentFrame.FlagsToSet.SwingSound);
        this.Flags.HitSound.remove(this.CurrentFrame.FlagsToSet.HitSound);
        this.Flags.BlockSound.remove(this.CurrentFrame.FlagsToSet.BlockSound);
        
    }

    this.IsNewFrame = false;
    
    if(!!newFrame && !!this.CurrentFrame && newFrame.ID != this.CurrentFrame.ID)
        if(!!newFrame.RightSrc && !!this.CurrentFrame.RightSrc && spriteLookup_.getLeft(newFrame.RightSrc) != spriteLookup_.getLeft(this.CurrentFrame.RightSrc))
            this.IsNewFrame = true;

    var isNewSound = !!newFrame
                && ((!!newFrame.SoundFilename && ((!this.CurrentFrame) || (!!this.CurrentFrame && (this.CurrentFrame.SoundFilename != newFrame.SoundFilename))))
                || !!newFrame.FlagsToSet.SwingSound);


    this.CurrentFrame = newFrame;
    if(!!newFrame)
    {
        //During an attack - after the attack frames the player is vulernable and we should ignore the overrides
        this.IgnoreOverrides = this.CurrentFrame.Vulernable;

        //used to force the other player to change frames during a throw
        if(!!this.IsNewFrame)
        {
            if(!!__debugMode)
                debug_.setOffsets(this.CurrentFrame.ImageOffsetX,this.CurrentFrame.ImageOffsetY);

            ++this.CurrentAnimation.FrameIndex;
            if(!!this.CurrentFrame.SlideForce)
                this.startSlide(frame,this.CurrentFrame.SlideForce,this.Direction,this.CurrentFrame.SlideFactor,true,true);
        }

        this.IgnoreHoldFrame = hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.IGNORE_HOLD_FRAME);

        if(hasFlag(newFrame.FlagsToClear.Combat,COMBAT_FLAGS.SUPER_MOVE_PAUSE))
        {
            this.getMatch().onSuperMoveCompleted(this);
            this.setExecutingSuperMove(false);
        }
        if(hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.INVISIBLE))
        {
            this.Element.style.display = "none";
            this.ShadowContainer.style.display = "none";
        }


        if(hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.TELEPORT_BEHIND))
            this.setTeleportTarget(COMBAT_FLAGS.TELEPORT_BEHIND,newFrame.Frames);
        if(hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.TELEPORT_INFRONT))
            this.setTeleportTarget(COMBAT_FLAGS.TELEPORT_INFRONT,newFrame.Frames);
        if(hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.TELEPORT_MIDDLE))
            this.setTeleportTarget(COMBAT_FLAGS.TELEPORT_MIDDLE,newFrame.Frames);
        if(hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.TELEPORT_BACK))
            this.setTeleportTarget(COMBAT_FLAGS.TELEPORT_BACK,newFrame.Frames);

        //if the new frame spawns a projectile, handle that here
        if(!this.Flags.Combat.has(COMBAT_FLAGS.PROJECTILE_ACTIVE) && hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.SPAWN_PROJECTILE))
            this.Projectiles[newFrame.ChainProjectile].execute(frame,stageX,stageY);
        if(!!this.IsSliding && hasFlag(newFrame.FlagsToSet.Combat,COMBAT_FLAGS.STOP_SLIDE_BACK))
            this.stopSlide();
        if(hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.RESET_Y_FUNC))
            this.resetVyFn();
        if(hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.RESET_X_FUNC))
            this.resetVxFn();

        if(hasFlag(newFrame.FlagsToSet.Spawn,SPAWN_FLAGS.SPAWN_BIGDIRT))
            this.showBigDirt(frame);
        else if(hasFlag(newFrame.FlagsToSet.Spawn,SPAWN_FLAGS.SPAWN_SMALLDIRT))
            this.showSmallDirt(frame);

        if(hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.MOVE_TO_BACK) || hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.BLOCKING))
            this.moveToBack();
        if(hasFlag(newFrame.FlagsToSet.Player,PLAYER_FLAGS.MOVE_TO_FRONT))
            this.moveToFront();

        ignoredFlags = Player.prototype.AirborneFlags; /*flags to be set in the OnFrame function*/
        this.Flags.Pose.add((newFrame.FlagsToSet.Pose | ignoredFlags) ^ ignoredFlags);
        this.Flags.Combat.add(newFrame.FlagsToSet.Combat);
        this.Flags.Player.add(newFrame.FlagsToSet.Player);
        this.Flags.Spawn.add(newFrame.FlagsToSet.Spawn);
        this.Flags.Combo.add(newFrame.FlagsToSet.Combo);


        if(!!this.CanHoldAirborne && newFrame.isClearingAirborneFlag())
            this.stopJump();

        this.Flags.Pose.remove(newFrame.FlagsToClear.Pose);
        this.Flags.Combat.remove(newFrame.FlagsToClear.Combat);
        this.Flags.Player.remove(newFrame.FlagsToClear.Player);
        this.Flags.Spawn.remove(newFrame.FlagsToClear.Spawn);
        this.Flags.Combo.remove(newFrame.FlagsToClear.Combo);

        this.ClipHitFront = newFrame.ClipHitFront || 0;
        this.ClipHitBack = newFrame.ClipHitBack || 0;
        this.ClipHitBottom = newFrame.ClipHitBottom || 0;
        this.ClipHitTop = newFrame.ClipHitTop || 0;

        this.ClipMoveFront = newFrame.ClipMoveFront || 0;
        this.ClipMoveBack = newFrame.ClipMoveBack || 0;
        this.ClipMoveBottom = newFrame.ClipMoveBottom || 0;
        this.ClipMoveTop = newFrame.ClipMoveTop || 0;

        if(!ignoreTranslation)
        {
            if(!!newFrame.X)
                this.moveX(newFrame.X);
            if(!!newFrame.Y)
                this.moveY(newFrame.Y);
        }

        if((!!newFrame.SoundFilename || !!newFrame.FlagsToSet.SwingSound) && !!isNewSound)
        {
            this.queueSwingSound(newFrame.FlagsToSet.SwingSound);
            if(!!newFrame.SoundFilename)
                this.queueSound(newFrame.SoundFilename,newFrame.SoundVolume);
        }
    }
}

Player.prototype.initSprite = function()
{
    var src = "images/misc/" + this.Folder.toLowerCase() + "/sprites.png";
    this.SpriteElement.style.backgroundImage = "url('" + src + "')";
    for(var i = 0; i < this.Projectiles.length; ++i)
        this.Projectiles[i].Element.style.backgroundImage = "url(images/misc/" + this.Folder.toLowerCase() + "/projectiles.png)";
}

Player.prototype.setBgBase64 = function()
{
    /*
    var src = "images/misc/" + this.Folder.toLowerCase() + "/sprites.png";
    this.SpriteElement.style.backgroundImage = imageLookup_.getB64(src,true);
    this.Shadow.style.backgroundImage = imageLookup_.getB64("images/misc/shadow-sprites.png",true);
    for(var i = 0; i < this.Projectiles.length; ++i)
        this.Projectiles[i].Element.style.backgroundImage = imageLookup_.getB64("images/misc/" + this.Folder.toLowerCase() + "/projectiles.png",true);
    this.setBgBase64Helper(this.FrontHitReportImages,"", "images/misc/blast-sprites.png");
    this.setBgBase64Helper(this.RearHitReportImages,"", "images/misc/blast-sprites.png");
    this.setBgBase64Helper(this.OtherAnimations.Dirt,"Element", "images/misc/dirt-sprites.png");
    this.setBgBase64Helper(this.OtherAnimations.BigDirt,"Element", "images/misc/dirt-sprites.png");
    this.setBgBase64Helper(this.OtherAnimations.Dizzy,"Element", "images/misc/misc-sprites.png");
    */
}

Player.prototype.setBgBase64Helper = function(arr,attrib,key)
{
    for(var i = 0, length = arr.length; i < length; ++i)
        imageLookup_.getBgB64((!!attrib ? arr[i][attrib] : arr[i]),key);
}

Player.prototype.setSprite = function(frame)
{
    if(!!this.IsNewFrame)
    {
        data = spriteLookup_.get(this.CurrentFrame.RightSrc);
        if(!!data)
        {
            this.SpriteElement.style.backgroundPosition = data.Left + " " + data.Bottom;
            this.SpriteElement.style.width = data.Width;
            this.SpriteElement.style.height = data.Height;
            this.Element.style.width = data.Width;
            if(this.CurrentFrame.ImageOffsetX != undefined)
            {
                this.OffsetWidth = data.WidthInt+ this.CurrentFrame.ImageOffsetX;
                this.OffsetHeight = data.HeightInt+ this.CurrentFrame.ImageOffsetY;
                this.Element.style.width = this.OffsetWidth + "px";
            }
            else
            {
                this.OffsetWidth = data.WidthInt;
                this.OffsetHeight = data.HeightInt;
                this.Element.style.width = this.OffsetWidth + "px";
            }
        }
    }
    if(!!this.CurrentFrame.IsFlipped)
    {
        if(this.Direction == -1 && !!this.IsFlipped)
            this.flip(false);
        else if(this.Direction == 1 && !this.IsFlipped)
            this.flip(true);
    }
    else
    {
        if(this.Direction == -1 && !this.IsFlipped)
            this.flip(true);
        else if(this.Direction == 1 && !!this.IsFlipped)
            this.flip(false);
    }
    if(this.Direction == -1)// && (this.CurrentFrame.ImageOffsetX != undefined))
        this.offsetImageX(this.CurrentFrame.ImageOffsetX);
    if(this.CurrentFrame.ImageOffsetY != undefined)
        this.offsetImageY(this.CurrentFrame.ImageOffsetY);
    if(!!this.CurrentAnimation && !!this.CurrentAnimation.Animation)
        this.CurrentAnimation.Animation.renderChildren(frame,this.CurrentAnimation.StartFrame,this.CurrentAnimation.Direction,parseInt(this.Element.style.zIndex) + 1,this.X,this.Y);
}

/*Sets the x and y on the element*/
Player.prototype.render = function(frame,stageDiffX,stageDiffY)
{
    this.checkZOrder();
    this.setAirborneY();
    if(!this.IsPaused)
    {
        if(!!this.CurrentFrame)
        {
            this.setSprite(frame);
            if(!!this.CurrentFrame.ShadowImageSrc && (this.Shadow._relSrc != this.CurrentFrame.ShadowImageSrc))
            {
                this.Shadow._relSrc  = this.CurrentFrame.ShadowImageSrc;
                spriteLookup_.set(this.Shadow, this.CurrentFrame.ShadowImageSrc);
            }
        }


        if(this.Direction > 0)
            this.setRight(this.X);
        else
            this.setLeft(this.X);
        this.Element.style.bottom = Math.max(this.Y,game_.Match.Stage.getGroundY()) + "px";
        this.setImgRect();

        this.renderShadow();
        this.renderTrail(frame,stageDiffX,stageDiffY);

        if(!!__debugMode)
            this.renderDebugInfo();
    }
    this.IsNewFrame = false;
}

/*renders the trail, if there is one*/
Player.prototype.renderTrail = function(frame,stageDiffX,stageDiffY)
{
    if(!!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!this.CurrentAnimation.Animation.Trail)
        this.CurrentAnimation.Animation.Trail.render(frame,-this.Direction * stageDiffX,stageDiffY);
}

Player.prototype.renderShadow = function()
{

    if(this.Direction > 0)
    {
        this.ShadowContainer.style.right = this.X + (!!this.CurrentFrame ? this.CurrentFrame.ShadowOffsetX : 0) + "px";
        this.Shadow.style.left = "";
        if(!this.Shadow.style.right)
            this.Shadow.style.right = "0px";
        if(!!this.getAdjustShadowPosition() && !this.ForceNoAdjustShadowPosition)
        {
            this.Shadow.style.right = this.SpriteElement.style.right;
        }
    }
    else
    {
        this.ShadowContainer.style.left = this.X + (!!this.CurrentFrame ? this.CurrentFrame.ShadowOffsetX : 0) + "px";
        this.Shadow.style.right = "";
        if(!this.Shadow.style.left)
            this.Shadow.style.left = "0px";
        if(!!this.getAdjustShadowPosition() && !this.ForceNoAdjustShadowPosition)
        {
            this.Shadow.style.left = this.SpriteElement.style.left;
        }
    }
    this.Shadow.style.bottom = game_.Match.Stage.getOffsetY(true) + "px";
}

var Flags = function()
{
    this.Value = 0;
}

Flags.prototype.Clear = function() { this.Set(0); }
Flags.prototype.Set = function(value) { this.Value = value; return this.Value; }
Flags.prototype.Get = function()      { return this.Value; }
Flags.prototype.Has = function(value) { return !!(this.Value & value); }
Flags.prototype.Add = function(value) { return this.Value |= value; }
Flags.prototype.Remove = function(value) { return this.Value = (this.Value | value) ^ value; }

var PlayerFlags = function()
{
    this.PlayerFlags = new Flags();
    this.PoseFlags = new Flags();
    this.CombatFlags = new Flags();
}


/*Encapsulates a new player*/
var Player = function (name,width,right,jump,left,crouch,p1,p2,p3,k1,k2,k3,nameImageSrc,portriatImageSrc,slideFactor)
{
    this.name_ = name;
    this.nameImageSrc_ = nameImageSrc || "images/misc/" + name +"/name-1.png";
    this.portriatImageSrc_ = portriatImageSrc || "images/misc/" + name + "/x-portriat-1.png";

    /*these 2 are used so we can easily swap left and right when the player changes directions*/
    this.leftKey_ = left;
    this.rightKey_ = right;
    /*store all of the key mappings*/
    this.buttons_ = {};
    this.buttons_[left] = {Ascii:left,Bit:1};
    this.buttons_[right] = {Ascii:right,Bit:2};
    this.buttons_[jump] = {Ascii:jump,Bit:4};
    this.buttons_[crouch] = {Ascii:crouch,Bit:8};
    this.buttons_[p1] = {Ascii:p1,Bit:16};
    this.buttons_[p2] = {Ascii:p2,Bit:32};
    this.buttons_[p3] = {Ascii:p3,Bit:64};
    this.buttons_[k1] = {Ascii:k1,Bit:128};
    this.buttons_[k2] = {Ascii:k2,Bit:256};
    this.buttons_[k3] = {Ascii:k3,Bit:512};


    this.moves_ = {};
    this.jumpAnimation_ = {};

    this.otherAnimations_ = {};
    this.otherAnimations_.Dirt = [];
    this.otherAnimations_.BigDirt = [];
    this.frontHitReport_ = [];
    this.rearHitReport_ = [];
    this.dirtIndices_ = [];
    this.bigDirtIndices_ = [];
    
    this.frontHitReportImages_ = []
    this.rearHitReportImages_ = []
    
    this.currentAnimation_ = null;
    this.currentFrame_ = null;


    this.element_ = null;
    this.image_ = null;
    this.shadowContainer_;
    this.shadow_ = null;

    this.moveStageXFn_ = null;
    this.moveOtherPlayersToBackFn_ = null;
    this.moveOtherPlayersToFrontFn_ = null;
    this.moveXFn_ = null;
    this.moveYFn_ = null;
    this.takeDamageFn_ = null;
    this.changeEnergyFn_ = null;
    this.attackFn_ = null;
    this.projectileAttackFn_ = null;
    this.getHealthFn_ = null;
    this.getEnergyFn_ = null;
    this.onStartAttackFn_ = null;
    this.onEndAttackFn_ = null;
    this.onStartAirAttackFn_ = null;
    this.onEndAirAttackFn_ = null;
    this.onProjectileMovedFn_ = null;
    this.onProjectileGoneFn_ = null;
    this.onIncComboFn_ = null;
    this.onIncComboRefCountFn_ = null;
    this.onDecComboRefCountFn_ = null;
    this.getCurrentComboCountFn_ = null;

    this.projectiles_ = [];
    this.width_ = width;
    this.halfWidth_ = width/2;
    this.circle_ = new Circle(this.halfWidth_,this.halfWidth_,this.halfWidth_);
    this.headOffsetX_ = 40;
    this.headOffsetY_ = 10;
    /**/
    this.slideFactor_ = slideFactor || 30;
    this.baseTakeHitDelay_ = CONSTANTS.DEFAULT_TAKE_HIT_DELAY;
    this.baseGiveHitDelay_ = CONSTANTS.DEFAULT_GIVE_HIT_DELAY;
    this.id_ = "";
    this.team_ = 0;
    this.defaultShadowImageSrc_ = "images/misc/misc/shadow.png";
    this.winAnimationNames_ = [];
    this.CreateElement();
    this.Reset();
    this.AddGenericAnimations();
}
Player.prototype.PlayerCount = 0;
Player.prototype.TakeDamage = function(amount) { this.takeDamageFn_(amount); }
Player.prototype.ChangeEnergy = function(amount) { if(!!amount) this.changeEnergyFn_(amount); }
Player.prototype.GetMatch = function() { return game_.match_; }
Player.prototype.GetGame = function() { return game_; }
Player.prototype.GetHealth = function() { return this.getHealthFn_(); }
Player.prototype.GetEnergy = function() { return this.getEnergyFn_(); }
Player.prototype.GetName = function() { return this.name_; }
Player.prototype.IsDead = function() { return !this.GetHealth(); }
Player.prototype.HasState = function(flag){return (flag & this.state_) > 0}
Player.prototype.RemoveState = function(flag){this.state_ = (this.state_ | flag) ^ flag;}
Player.prototype.AddState = function(flag)
{
    if(!!(flag & FLAGS.MOBILE) && !(this.state_ & FLAGS.MOBILE))
    {
        this.ResetCombo();
    }
    this.state_ |= flag;
}

Player.prototype.HasPoseFlags = function(flag){return !!(flag & this.poseState_);}
Player.prototype.RemovePoseFlags = function(flag){this.poseState_ = (this.poseState_ | flag) ^ flag;}
Player.prototype.AddPoseFlags = function (flag){this.poseState_ |= flag;}
Player.prototype.SetPoseFlags = function(flag)
{
    if(!!(this.poseState_ & FLAGS.AIRBORNE_FB))
        flag |= FLAGS.AIRBORNE_FB;
    if(!!(this.poseState_ & FLAGS.AIRBORNE))
        flag |= FLAGS.AIRBORNE;
    if(!!(this.poseState_ & FLAGS.ALLOW_BLOCK))
        flag |= FLAGS.ALLOW_BLOCK;
    if(!!(this.poseState_ & FLAGS.ALLOW_AIR_BLOCK))
        flag |= FLAGS.ALLOW_AIR_BLOCK;
    
    this.poseState_ = flag;
}
Player.prototype.RemoveFlags = function(flags)
{
    if(!!flags)
    {
        if(flags.hasOwnProperty("PlayerFlags"))
        {
            this.flags_.PlayerFlags.Remove(
                (flags.PlayerFlags | PLAYER_FLAGS.MOBILE)
                ^ PLAYER_FLAGS.MOBILE);
        }
        if(flags.hasOwnProperty("CombatFlags"))
        {
            this.flags_.CombatFlags.Remove(
                (flags.CombatFlags | COMBAT_FLAGS.PROJECTILE_ACTIVE | COMBAT_FLAGS.CAN_BE_BLOCKED | COMBAT_FLAGS.CAN_BE_AIR_BLOCKED)
                ^ COMBAT_FLAGS.PROJECTILE_ACTIVE ^ COMBAT_FLAGS.CAN_BE_BLOCKED ^ COMBAT_FLAGS.CAN_BE_AIR_BLOCKED);
        }
        if(flags.hasOwnProperty("PoseFlags"))
        {
            this.flags_.PoseFlags.Remove(
                (flags.PoseFlags | POSE_FLAGS.AIRBORNE_FB | POSE_FLAGS.AIRBORNE)
                ^ POSE_FLAGS.AIRBORNE_FB ^ POSE_FLAGS.AIRBORNE);
        }
    }
}
Player.prototype.ResetCombo = function()
{
    if(!!this.onDecComboRefCountFn_)    
        this.onDecComboRefCountFn_();
}
Player.prototype.IncCombo = function()
{
    if(!this.getCurrentComboCountFn_())
        this.onIncComboRefCountFn_();
    this.onIncComboFn_();
}

Player.prototype.Reset = function(ignoreDirection)
{
    this.ignoreCollisionsWith_ = "";
    this.ignoreCollisionsWithOtherTeam_ = false;
    this.forceImmobile_ = false;
    this.ignoreHoldFrame_ = false;
    this.mustClearAllowBlock_ = false;
    this.mustClearAllowAirBlock_ = false;
    /*this is the combo against THIS player! Not against other players*/
    this.ResetCombo();
    this.currentAnimation_ = null;
    this.currentFrame_ = null;
    this.onAnimationCompleteFn_ = null;
    this.isFacingRight_ = true;
    if(!ignoreDirection)
        this.direction_ = 1;
    this.health_ = 100;
    this.flags_ = new PlayerFlags();
    this.state_ = FLAGS.MOBILE;
    this.poseState_ = FLAGS.STANDING;
    this.keyState_ = 0;
    this.keyStates_ = [];
    /*only used for optimization*/
    this.lastKeyStates_ = [];
    this.clearKeyStateCount_ = 0;
    this.adjustShadowPosition_ = true;
    this.mustChangeDirection_ = 0;
    this.blockedProjectiles_ = {};
    this.blockedAttacks_ = [];
    this.blockedAirAttacks_ = [];

    this.giveHitFn_ = null;
    this.isBeingThrown_  = false;
    this.grappledPlayer_ = null;
    this.x_ = 0;
    this.y_ = 0;
    this.yBottomOffset_ = 0;
    this.yTopOffset_ = 0;
    this.fx_ = 0;
    this.fy_ = 0;
    this.lastFx_ = 0;
    this.lastFy_ = 0;
    /*jump velocity*/
    this.jumpVelocityX_ = 0;
    this.jumpVelocityY_ = 0;
    /**/
    this.t_ = 0;
    this.frameFreeze_ = 0;
    this.isSliding_ = false;
    this.slideCount_ = 0;
    this.isDead_ = false;
    this.moveCount_ = 0;
    this.registeredHit_ = new RegisteredHit();
    this.lastHitFrame_ = {};
    this.winningFrame_ = CONSTANTS.NO_FRAME;
    this.SetX(0);
    this.SetY(STAGE.FLOORY);
}


Player.prototype.CreateElement = function(x,y,parentElement)
{
    parentElement = (parentElement || window.document.getElementById("pnlStage"));
    this.element_ = window.document.createElement("div");
    this.element_.className = "player";

    var createImage = function(className,attrib,value,parent)
    {
        var i = window.document.createElement("img");
        i.className = className;
        if(!!attrib)
            i.style[attrib] = value;
        (parent || this.element_).appendChild(i);
        return i;
    }

    this.image_ = createImage.call(this,"player");

    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
        this.frontHitReportImages_[this.frontHitReportImages_.length] = createImage.call(this,"front-hit-report","display","none",parentElement);
    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
        this.rearHitReportImages_[this.rearHitReportImages_.length] = createImage.call(this,"rear-hit-report","display","none",parentElement);


    /*firefox gets the slow function, since it does not seem to load preloaded images instantly*/
    if(this.GetGame().UseAlternateImageLoadingFunctions())
        this.invokeShowCurrentFrameImageFn_ = this._ShowCurrentFrameImage;
    else
        this.invokeShowCurrentFrameImageFn_ = this.ShowCurrentFrameImage;



    this.shadowContainer_ = window.document.createElement("div");
    this.shadowContainer_.className = "shadow";
    this.shadow_ = createImage.call(this,"shadow","","",this.shadowContainer_);
    this.shadow_.src = "images/misc/misc/shadow.png";

    parentElement.appendChild(this.shadowContainer_);
    parentElement.appendChild(this.element_);

    this.CreateDebugElements();
}

Player.prototype.MoveToBack = function(dontAnimationOtherPlayers)
{
    this.element_.style.zIndex = 1;
    if(!dontAnimationOtherPlayers)
        this.moveOtherPlayersToFrontFn_();
}
Player.prototype.MoveToFront = function(dontAnimationOtherPlayers)
{
    this.element_.style.zIndex = 2;
    if(!dontAnimationOtherPlayers)
        this.moveOtherPlayersToBackFn_();
}
/*Change the speed of the moves for this player*/
Player.prototype.ChangeSpeed = function(amount)
{
    var fastestFrame = 999999;
    for(var i in this.moves_)
        for(var x = 0; x < this.moves_[i].baseAnimation_.frames_.length; ++x)
            fastestFrame = Math.min(this.moves_[i].baseAnimation_.frames_[x].Frames,fastestFrame);
    fastestFrame -= 1;
    for(var i in this.moves_)
        this.moves_[i].frameSpeed_ = Math.min(Math.max(this.moves_[i].frameSpeed_ + amount, CONSTANTS.MIN_FRAME_DELAY), fastestFrame);
}
Player.prototype.ResetSpeed = function()
{
    for(var i in this.moves_)
        this.moves_[i].frameSpeed_ = 0;
}
/*Simply returns the count of all of the frames, plus 1*/
Player.prototype.GetNextFrameID = function()
{
    var id = 0;
    for(var i in this.moves_)
        for(var x = 0; x < this.moves_[i].baseAnimation_.frames_.length; ++x)
            ++id;

    return id + 1;
}
/*If the move is a projectile, and a projectile is already active, then this returns true;*/
Player.prototype.IsProjectileInUse = function(move)
{
    return (!!(move.state_ & FLAGS.PROJECTILE_ACTIVE)) && !!this.HasState(FLAGS.PROJECTILE_ACTIVE);
}

/*Gets the direction of the attack relative to the current player*/
Player.prototype.GetAttackDirection = function(attackDirection)
{
    var direction = -this.direction_;
    if(this.direction_ > 0 && attackDirection > 0)
        direction = -1
    else if(this.direction_ < 0 && attackDirection < 0)
        direction = 1
    else if(this.direction_ > 0 && attackDirection < 0)
        direction = 1
    else if(this.direction_ < 0 && attackDirection > 0)
        direction = -1
    return direction;
}
/*Gets the direction of the attack relative to the current player*/
Player.prototype.GetRelativeDirection = function(attackDirection)
{
    var direction = -this.direction_;
    if(this.direction_ > 0 && attackDirection > 0)
        direction = -1
    else if(this.direction_ < 0 && attackDirection < 0)
        direction = -1
    else if(this.direction_ > 0 && attackDirection < 0)
        direction = 1
    else if(this.direction_ < 0 && attackDirection > 0)
        direction = 1
    return direction;
}
/*Gets the direction of the attack relative to the current player*/
Player.prototype.GetProjectileDirection = function(attackDirection)
{
    var direction = -this.direction_;
    if(this.direction_ > 0 && attackDirection > 0)
        direction = -1
    else if(this.direction_ < 0 && attackDirection < 0)
        direction = -1
    else if(this.direction_ > 0 && attackDirection < 0)
        direction = 1
    else if(this.direction_ < 0 && attackDirection > 0)
        direction = -1
    return direction;
}
/*Holds the current frame*/
Player.prototype.SetHoldFrame = function(nbFrames)
{
    this.frameFreeze_ = nbFrames;
}

/*
Handles other animations
*/
Player.prototype.OtherAnimationFrameMove = function(frame,stageX,stageY)
{
    /*front hit report images*/
    var fhrIndex = -1;
    while(++fhrIndex < this.frontHitReport_.length)
    {
        var item = this.frontHitReport_[fhrIndex];
        var element = item.Element;
        if(!item.Animation.TryRender(frame,item.StartFrame,element,stageX,stageY,this.x_,this.y_))
            this.frontHitReport_.splice(fhrIndex,1);
    }
    /*rear hit report images*/
    var rhrIndex = -1;
    while(++rhrIndex < this.rearHitReport_.length)
    {
        var item = this.rearHitReport_[rhrIndex];
        var element = item.Element;
        if(!item.Animation.TryRender(frame,item.StartFrame,element,stageX,stageY,this.x_,this.y_))
            this.rearHitReport_.splice(rhrIndex,1);
    }
    /*dirt images*/
    var dirtIndex = -1;
    while(++dirtIndex < this.dirtIndices_.length)
    {
        var item = this.otherAnimations_.Dirt[this.dirtIndices_[dirtIndex]];
        var element = item.Element;
        if(!item.Animation.TryRender(frame,item.StartFrame,element,stageX,stageY,this.x_,this.y_))
            this.dirtIndices_.splice(dirtIndex,1);
    }
    /*big dirt images*/
    var bigDirtIndex = -1;
    while(++bigDirtIndex < this.bigDirtIndices_.length)
    {
        var item = this.otherAnimations_.BigDirt[this.bigDirtIndices_[bigDirtIndex]];
        var element = item.Element;
        if(!item.Animation.TryRender(frame,item.StartFrame,element,stageX,STAGE.FLOORY,this.x_,STAGE.FLOORY))
            this.bigDirtIndices_.splice(bigDirtIndex,1);
    }
}
/*Prevents the animation from continuing for one frame*/
Player.prototype.HoldFrame = function(frame)
{
    this.frameFreeze_ = Math.max(this.frameFreeze_ - 1, 0);
    if(!!this.currentFrame_)
    {
        ++this.currentAnimation_.StartFrame;
    }
}
/*Prevents the animation from continuing for one frame*/
Player.prototype.ForceHoldFrame = function(frame)
{
    if(!!this.currentFrame_)
    {
        ++this.currentAnimation_.StartFrame;
    }
}

Player.prototype.OnFrameMove = function(frame,stageX,stageY)
{
    this.FrameMove(frame,stageX,stageY);
    if(!!this.currentFrame_ && !!(this.currentFrame_.FlagsToSet & FLAGS.ATTACK))
        this.HandleAttack(frame, this.currentFrame_);
    if(!!this.grappledPlayer_)
        this.HandleGrapple(this.currentAnimation_.FrameIndex - 1,frame,stageX,stageY);
    if(!!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.trail_)
        this.FrameMoveTrail(frame,this.GetMatch().deltaX_,stageY);
}


Player.prototype.FrameMoveTrail = function(frame,stageX,stageY)
{
    var index = this.currentAnimation_.Animation.GetFrameIndex(this.currentFrame_.ID)
    this.currentAnimation_.Animation.trail_.FrameMove(frame,index,this.direction_,stageX,stageY);
}


/*Show the image at the current frame in the current animation*/
Player.prototype.FrameMove = function(frame,stageX,stageY)
{

    this.CheckDirection();
    if(this.isSliding_)
        this.Slide(frame);

    this.HandleProjectiles(frame,stageX,stageY);
    this.OtherAnimationFrameMove(frame, stageX, stageY);

    if(!!this.isBeingThrown_)
        return;

    if(!!this.frameFreeze_)
        this.HoldFrame(frame);

    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation)
    {
        var delta = frame - this.currentAnimation_.StartFrame;
        var currentFrame = this.currentAnimation_.Animation.GetFrame(delta);
        if(!!currentFrame || (!!this.currentFrame_ && (!!(this.currentFrame_.FlagsToSet & FLAGS.HOLD_FRAME))))
        {

            /*check to see if the move allows you to change direction mid-move*/
            if(!!this.mustChangeDirection_ && !!(this.currentAnimation_.Animation.state_ & FLAGS.ALLOW_CHANGE_DIRECTION))
            {
                this.ChangeDirection();
                return;
            }

            /*check to see if the new frame needs to be airborne*/
            if(!this.IsAirborne() && (!!currentFrame && (!!(currentFrame.FlagsToSet & FLAGS.AIRBORNE) || !!(currentFrame.FlagsToSet & FLAGS.AIRBORNE_FB))))
            {
                var direction = 1;
                if(!!(currentFrame.FlagsToSet & FLAGS.USE_ATTACK_DIRECTION))
                    direction = this.currentAnimation_.AttackDirection;
                this.PerformJump(direction * this.currentAnimation_.Animation.vx_,this.currentAnimation_.Animation.vy_,this.currentAnimation_.Animation.GetXModifier(),this.currentAnimation_.Animation.GetYModifier());
            }
            if(!this.frameFreeze_)
            {
                /*if the player is still airborne then apply next step*/
                if(this.IsAirborne())
                {
                    if(this.HasState(FLAGS.BLOCKING))
                    {
                        this.RemoveState(FLAGS.MOBILE);
                        this.ForceHoldFrame(frame);
                    }
                    if(!this.AdvanceJump())
                    {
                        this.TryChainAnimation(frame);
                        return;
                    }
                    /*
                    if(this.flags_.CombatFlags.Has(COMBAT_FLAGS.BLOCKING))
                    {
                        this.flags.PlayerFlags.Remove(PLAYER_FLAGS.MOBILE);
                        this.ForceHoldFrame(frame);
                    }
                    if(!this.AdvanceJump())
                    {
                        this.TryChainAnimation(frame);
                        return;
                    }
                    */
                }
            }
            /*some moves (crouch) require frame to not change, this simulates that.*/
            if(!!this.currentFrame_ && !!(this.currentFrame_.FlagsToSet & FLAGS.HOLD_FRAME) && !this.ignoreHoldFrame_)
            {
                /*get the key that must be pressed*/
                var key = this.currentAnimation_.Animation.keySequence_[this.currentAnimation_.Animation.keySequence_.length - 1];
                /*if the key is NOT pressed, then offset into the next frame in the current move*/
                if(!this.IsKeyDown(key))
                {
                    this.HoldFrame(frame);
                    /*must clear frame because the current frame has a HOLD_FRAME flag*/
                    this.SetCurrentFrame(null,frame);
                }
            }
            else if(!!currentFrame && !!(currentFrame.FlagsToSet & FLAGS.MUST_HOLD_KEY)) /*Does the move require the key to be held? ... */
            {
                /*the last key in the keySequence must be the required key*/
                var key = this.currentAnimation_.Animation.keySequence_[this.currentAnimation_.Animation.keySequence_.length - 1];
                if(this.IsKeyDown(key)) /*... and was the key pressed?*/
                {
                    this.SetCurrentFrame(currentFrame,frame,stageX,stageY);
                }
                else
                {
                    /*the required key is not pressed, look for a new move*/
                    this.TryChainAnimation(frame,stageX,stageY);
                }
            }
            else if(!currentFrame)
            {
                this.TryChainAnimation(frame,stageX,stageY);
            }
            else
            {
                if(!this.currentFrame_ || (currentFrame.ID != this.currentFrame_.ID))
                {
                    this.SetCurrentFrame(currentFrame,frame,stageX,stageY);
                }
            }
        }
        else
        {
            /*No more frames for the move.*/
            this.TryChainAnimation(frame);
        }
    }
    else
    {
        this.TryChainAnimation(frame);
    }

    this.checkedForAnimation_ = false;
    this.CleanUpKeyStateChanges(frame);
}


/*Sets the team and initializes the energy bar and portriat*/
Player.prototype.SetupInfo = function(value,side)
{
    this.team_ = value;
    this.portriatImageSrc_ = this.portriatImageSrc_.replace("x-",side + "-")

    frameImages_.Load(this.nameImageSrc_);
    frameImages_.Load(this.portriatImageSrc_);
}


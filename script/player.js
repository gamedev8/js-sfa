

/*Encapsulates a new player*/
var Player = function (name,width,user,nameImageSrc,portriatImageSrc,slideFactor)
{
    this.name_ = name;
    this.nameImageSrc_ = nameImageSrc || "images/misc/misc/" + name.toLowerCase() +"-name-1.png";
    this.portriatImageSrc_ = portriatImageSrc || "images/misc/misc/" + name.toLowerCase() + "-x-portriat-1.png";

    /*these 2 are used so we can easily swap left and right when the player changes directions*/
    this.leftKey_ = user.Left;
    this.rightKey_ = user.Right;
    /*store all of the key mappings*/
    this.buttons_ = {};
    this.buttons_[user.Left] =   {Ascii:user.Left,Bit:1};
    this.buttons_[user.Right] =  {Ascii:user.Right,Bit:2};
    this.buttons_[user.Up] =   {Ascii:user.Up,Bit:4};
    this.buttons_[user.Down] = {Ascii:user.Down,Bit:8};
    this.buttons_[user.P1] =     {Ascii:user.P1,Bit:16};
    this.buttons_[user.P2] =     {Ascii:user.P2,Bit:32};
    this.buttons_[user.P3] =     {Ascii:user.P3,Bit:64};
    this.buttons_[user.K1] =     {Ascii:user.K1,Bit:128};
    this.buttons_[user.K2] =     {Ascii:user.K2,Bit:256};
    this.buttons_[user.K3] =     {Ascii:user.K3,Bit:512};
    this.buttons_[user.Turn] =   {Ascii:user.Turn,Bit:1024};


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
    this.spriteElement_ = null;
    this.shadowContainer_ = null;
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

    this._showCurrentFrameImageHelperParams = 
    {
        ImageOffsetX:0
        ,ImageOffsetY:0
        ,HasOffsetX:false
        ,HasOffsetY:false
    }


    this.nbFrames_ = 0;
    this.projectiles_ = [];
    this.width_ = width;
    this.halfWidth_ = width/2;
    this.circle_ = new Circle(this.halfWidth_,this.halfWidth_,this.halfWidth_);
    this.headOffsetX_ = 40;
    this.headOffsetY_ = 10;
    this.ai_ = new CreateAIProxy(this);
    this.hasPendingGrapple_ = false;
    /**/
    this.slideFactor_ = slideFactor || 30;
    this.baseTakeHitDelay_ = CONSTANTS.DEFAULT_TAKE_HIT_DELAY;
    this.baseGiveHitDelay_ = CONSTANTS.DEFAULT_GIVE_HIT_DELAY;
    this.index_ = 0;
    this.id_ = "";
    this.team_ = 0;
    this.defaultShadowImageSrc_ = "images/misc/misc/shadow.png";
    this.winAnimationNames_ = [];
    this.InitSounds();
    this.CreateElement();
    this.Reset();
    this.AddGenericAnimations();
}
Player.prototype.SetIndex = function(index) { this.index_ = index; }
Player.prototype.GetIndex = function() { return this.index_; }
Player.prototype.SetAI = function(createAiFn) { this.ai_.SetAI(createAiFn); }
Player.prototype.PlayerCount = 0;
Player.prototype.TakeDamage = function(amount) { this.takeDamageFn_(amount); }
Player.prototype.ChangeEnergy = function(amount) { if(!!amount) this.changeEnergyFn_(amount); }
Player.prototype.GetMatch = function() { return this.GetGame().GetMatch(); }
Player.prototype.GetPhysics = function() { return this.GetMatch().GetPhysics(); }
Player.prototype.GetStage = function() { return this.GetMatch().GetStage(); }
Player.prototype.GetGame = function() { return game_; }
Player.prototype.GetHealth = function() { return this.getHealthFn_(); }
Player.prototype.GetEnergy = function() { return this.getEnergyFn_(); }
Player.prototype.IsExecutingSuperMove = function () { return this.isExecutingSuperMove_; }
Player.prototype.SetExecutingSuperMove = function (value) { this.isExecutingSuperMove_ = value; }
Player.prototype.IsBeingGrappled = function() { return this.isBeingThrown_; }
Player.prototype.SetBeingGrappled = function(value) { this.isBeingThrown_ = value; }
Player.prototype.GetNameImageSrc = function() { return this.nameImageSrc_; }
Player.prototype.GetPortriatImageSrc = function() { return this.portriatImageSrc_; }
Player.prototype.GetName = function() { return this.name_; }

Player.prototype.GetEnergyLevel = function()
{
    var value = this.GetEnergy();
    if(value >= ENERGYBAR.MAX_LEVEL2)
        return ENERGYBAR.LEVELMAXED;
    else if(value >= ENERGYBAR.MAX_LEVEL1)
        return ENERGYBAR.LEVEL2;
    else if(value >= ENERGYBAR.MAX_LEVEL0)
        return ENERGYBAR.LEVEL1;
    else
        return ENERGYBAR.LEVEL0;

}

Player.prototype.GetName = function() { return this.name_; }
Player.prototype.IsDead = function() { return !this.GetHealth(); }
Player.prototype.HasPendingGrapple = function() { return this.hasPendingGrapple_; }
Player.prototype.SetPendingGrapple = function(value) { this.hasPendingGrapple_ = value; }
Player.prototype.SetPaused = function(paused) { this.isPaused_ = paused; }
Player.prototype.GetAdjustShadowPosition = function() { return this.adjustShadowPosition_; }
Player.prototype.SetAdjustShadowPosition = function(value) { this.adjustShadowPosition_ = value; }
Player.prototype.SetFlags = function(value) { this.Flags = value; }
Player.prototype.GetFlags = function() { return this.Flags; }

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
    this.SetPendingGrapple(false);
    this.isExecutingSuperMove_ = false;
    this.isLosing_ = false;
    this.lastShadowLeft_ = null;
    this.lastShadowRight_ = null;
    this.canHoldAirborne_ = true;
    this.showSlideDirt_ = true;
    this.isPaused_ = false;

    //this.canInterrupt_ = false;
    this.ignoreCollisionsWith_ = "";
    this.ignoreCollisionsWithOtherTeam_ = false;
    this.forceImmobile_ = false;
    this.ignoreHoldFrame_ = false;
    this.mustClearAllowBlock_ = false;
    this.mustClearAllowAirBlock_ = false;
    /*this is the combo against THIS player! Not against other players*/
    this.ResetCombo();
    this.interuptAnimation_ = null;
    this.currentAnimation_ = null;
    this.currentFrame_ = null;
    this.onAnimationCompleteFn_ = null;
    this.isFacingRight_ = true;
    if (!ignoreDirection)
        this.direction_ = 1;
    this.health_ = 100;
    this.Flags = new PlayerFlags(this);
    this.keyState_ = 0;
    this.keyStates_ = [];
    this.isInAttackFrame_ = false;

    this.lastKeyStates_ = [];
    this.clearKeyStateCount_ = 0;
    this.adjustShadowPosition_ = true;
    this.mustChangeDirection_ = 0;
    this.blockedProjectiles_ = {};
    this.blockedAttacks_ = [];
    this.blockedAirAttacks_ = [];

    this.giveHitFn_ = null;
    this.isBeingThrown_ = false;
    this.grappledPlayer_ = null;
    this.x_ = 0;
    this.y_ = 0;
    this.lastFrameY_ = 0;
    this.constY_ = 0;
    this.yBottomOffset_ = 0;
    this.yTopOffset_ = 0;
    this.fx_ = 0;
    this.fy_ = 0;
    this.lastFx_ = 0;
    this.lastFy_ = 0;
    /*jump velocity*/
    this.jumpVelocityX_ = 0;
    this.jumpVelocityY_ = 0;
    this.zOrder_ = null;
    this.sounds_ = [];
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
    this.target_ = 0;
    this.SetX(0);
    this.SetY(STAGE.FLOORY);
    this.ClearProjectiles();
}

Player.prototype.CreateElement = function(x,y,parentElement)
{
    parentElement = (parentElement || window.document.getElementById("pnlStage"));
    this.element_ = window.document.createElement("div");
    this.element_.className = "player";

    var createElement = function(tagName,className,attrib,value,parent)
    {
        var i = window.document.createElement(tagName);
        i.className = className;
        if(!!attrib)
            i.style[attrib] = value;
        (parent || this.element_).appendChild(i);
        return i;
    }

    //this.image_ = createImage.call(this,"player");


    this.spriteElement_ = window.document.createElement("div");
    this.spriteElement_.className = "player-sprite";
    this.element_.appendChild(this.spriteElement_);

    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
        this.frontHitReportImages_[this.frontHitReportImages_.length] = createElement.call(this,"div","front-hit-report","display","none",parentElement);
    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
        this.rearHitReportImages_[this.rearHitReportImages_.length] = createElement.call(this,"div","rear-hit-report","display","none",parentElement);


    this.shadowContainer_ = window.document.createElement("div");
    this.shadowContainer_.className = "shadow";
    this.shadow_ = createElement.call(this,"div","shadow","","",this.shadowContainer_);

    parentElement.appendChild(this.shadowContainer_);
    parentElement.appendChild(this.element_);

    this.CreateDebugElements();
}
Player.prototype.SetZOrder = function(value)
{
    this.zOrder_ = value;
}
Player.prototype.CheckZOrder = function()
{
    if(this.zOrder_ != null)
    {
        this.element_.style.zIndex = this.zOrder_;
        this.zOrder_ = null;
    }
}
Player.prototype.MoveToBack = function(dontMoveOtherPlayers)
{
    this.SetZOrder(1);
    if(!dontMoveOtherPlayers)
        this.moveOtherPlayersToFrontFn_();
}
Player.prototype.MoveToFront = function(dontMoveOtherPlayers)
{
    if(this.IsExecutingSuperMove())
        this.SetZOrder(16);
    else
        this.SetZOrder(14);

    if(!dontMoveOtherPlayers)
        this.moveOtherPlayersToBackFn_();
}
/*Change the speed of the moves for this player*/
Player.prototype.ChangeSpeed = function(amount)
{
    var fastestFrame = 999999;
    for(var i in this.moves_)
        for(var x = 0; x < this.moves_[i].BaseAnimation.frames_.length; ++x)
            fastestFrame = Math.min(this.moves_[i].BaseAnimation.frames_[x].Frames,fastestFrame);
    fastestFrame -= 1;
    for(var i in this.moves_)
        this.moves_[i].frameSpeed_ = Math.min(Math.max(this.moves_[i].frameSpeed_ + amount, CONSTANTS.MIN_FRAME_DELAY), fastestFrame);
}
Player.prototype.ResetSpeed = function()
{
    for(var i in this.moves_)
        this.moves_[i].frameSpeed_ = 0;
}
/*Simply returns the count of all of the frames*/
Player.prototype.GetNextFrameID = function()
{
    return this.nbFrames_;
}
/*If the move is a projectile, and a projectile is already active, then this returns true;*/
Player.prototype.IsProjectileInUse = function(move)
{
    return (!!(move.Flags.Combat & COMBAT_FLAGS.PROJECTILE_ACTIVE)) && !!this.Flags.Combat.Has(COMBAT_FLAGS.PROJECTILE_ACTIVE);
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
        if(!item.Animation.TryRender(frame,item.StartFrame,item.Element,stageX,stageY,this.x_,this.y_))
            this.frontHitReport_.splice(fhrIndex,1);
    }
    /*rear hit report images*/
    var rhrIndex = -1;
    while(++rhrIndex < this.rearHitReport_.length)
    {
        var item = this.rearHitReport_[rhrIndex];
        if(!item.Animation.TryRender(frame,item.StartFrame,item.Element,stageX,stageY,this.x_,this.y_))
            this.rearHitReport_.splice(rhrIndex,1);
    }
    /*dirt images*/
    var dirtIndex = -1;
    while(++dirtIndex < this.dirtIndices_.length)
    {
        var item = this.otherAnimations_.Dirt[this.dirtIndices_[dirtIndex]];
        if(!item.Animation.TryRender(frame,item.StartFrame,item.Element,stageX,stageY,this.x_,this.y_))
            this.dirtIndices_.splice(dirtIndex,1);
    }
    /*big dirt images*/
    var bigDirtIndex = -1;
    while(++bigDirtIndex < this.bigDirtIndices_.length)
    {
        var item = this.otherAnimations_.BigDirt[this.bigDirtIndices_[bigDirtIndex]];
        if(!item.Animation.TryRender(frame,item.StartFrame,item.Element,stageX,STAGE.FLOORY,this.x_,STAGE.FLOORY))
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
        ++this.currentAnimation_.StartFrame;
}

/*Can the current move be interrupted by a speial move?*/
Player.prototype.CheckForInterupt = function(frame)
{
    if(!!this.interuptAnimation_)
    {
        if((--this.interuptAnimation_.Delay <= 0))// && !!this.canInterrupt_)
        {
            var temp = this.interuptAnimation_;
            temp.StartFrame = frame;
            this.interuptAnimation_ = null;
            this.SetCurrentAnimation(temp);
        }
    }
}

Player.prototype.OnPreFrameMove = function(frame)
{
}

Player.prototype.OnRenderComplete = function(frame)
{
    this.lastFrameY_ = this.constY_;
    this.constY_ = this.y_;
}


Player.prototype.PlaySounds = function()
{
    while(this.sounds_.length > 0)
        soundManager_.Play(this.sounds_.splice(0,1)[0]);
}

Player.prototype.OnFrameMove = function(frame,stageX,stageY)
{
    if(!this.isPaused_)
    {
        if(this.ai_.IsRunning())
            this.ai_.FrameMove(frame);
        this.CheckForInterupt(frame);
        this.FrameMove(frame,stageX,stageY);
        this.isInAttackFrame_ = false;
        if(!!this.currentFrame_ && !!(this.currentFrame_.FlagsToSet.Combat & COMBAT_FLAGS.ATTACK))
            this.HandleAttack(frame, this.currentFrame_);
        if(!!this.grappledPlayer_)
            this.HandleGrapple(this.currentAnimation_.FrameIndex - 1,frame,stageX,stageY);
        if(!!this.currentAnimation_.Animation && !!this.currentAnimation_.Animation.Trail)
            this.FrameMoveTrail(frame,this.GetStage().deltaX_,stageY);
        if(!this.forceImmobile_ && this.IsDead())
            this.ForceTeamLose(frame);
    }
    else
    {
        this.ForceHoldFrame(frame);
    }
}


Player.prototype.FrameMoveTrail = function(frame,stageX,stageY)
{
    var index = this.currentAnimation_.Animation.GetFrameIndex(this.currentFrame_.ID)
    this.currentAnimation_.Animation.Trail.FrameMove(frame,index,this.direction_,stageX,stageY);
}


/*Show the image at the current frame in the current animation*/
Player.prototype.FrameMove = function(frame,stageX,stageY)
{
    this.CheckDirection();
    if(this.isSliding_)
        this.Slide(frame);

    this.HandleProjectiles(frame,stageX,stageY);
    this.OtherAnimationFrameMove(frame, stageX, stageY);

    if(!!this.IsBeingGrappled())
        return;

    if(!!this.frameFreeze_)
        this.HoldFrame(frame);

    if(!!this.currentAnimation_ && !!this.currentAnimation_.Animation)
    {
        var delta = frame - this.currentAnimation_.StartFrame;
        var currentFrame = this.currentAnimation_.Animation.GetFrame(delta);
        if(!!currentFrame || (!!this.currentFrame_ && (!!(this.currentFrame_.FlagsToSet.Player & PLAYER_FLAGS.HOLD_FRAME))))
        {
            /*check to see if the move allows you to change direction mid-move*/
            if(!!this.mustChangeDirection_ && !!(this.currentAnimation_.Animation.Flags.Player & PLAYER_FLAGS.ALLOW_CHANGE_DIRECTION))
            {
                this.ChangeDirection();
                return;
            }

            /*check to see if the new frame needs to be airborne*/
            if((!!currentFrame && (!!(currentFrame.FlagsToSet.Pose & POSE_FLAGS.AIRBORNE) || !!(currentFrame.FlagsToSet.Pose & POSE_FLAGS.AIRBORNE_FB))))
            {
                if(!this.IsAirborne())
                {
                    var direction = 1;
                    if(!!(currentFrame.FlagsToSet.Player & PLAYER_FLAGS.USE_ATTACK_DIRECTION))
                        direction = this.currentAnimation_.AttackDirection;
                    //this.PerformJump(direction * this.currentAnimation_.Animation.Vx,this.currentAnimation_.Animation.Vy,this.currentAnimation_.Animation.GetXModifier(),this.currentAnimation_.Animation.GetYModifier());
                    this.PerformJump(direction * this.currentAnimation_.Vx,this.currentAnimation_.Vy,this.currentAnimation_.Animation.GetXModifier(),this.currentAnimation_.Animation.GetYModifier());
                }
                else
                {
                    this.SetVxFn(this.currentAnimation_.Animation.GetAirXModifier());
                    this.SetVyFn(this.currentAnimation_.Animation.GetAirYModifier());
                }
            }
            if(!this.frameFreeze_)
            {
                /*if the player is still airborne then apply next step*/
                if(this.IsAirborne())
                {
                    if(this.IsBlocking())
                    {
                        this.Flags.Player.Remove(PLAYER_FLAGS.MOBILE);
                        this.ForceHoldFrame(frame);
                    }
                    if(!this.AdvanceJump() && !this.currentAnimation_.Animation.IsThrow)
                    {
                        this.TryChainAnimation(frame);
                        return;
                    }
                }
            }
            /*some moves (crouch) require frame to not change, this simulates that.*/
            if(!!this.currentFrame_ && !!(this.currentFrame_.FlagsToSet.Player & PLAYER_FLAGS.HOLD_FRAME) && !this.ignoreHoldFrame_)
            {
                /*get the key that must be pressed*/
                var key = this.currentAnimation_.Animation.GetKey(this.currentAnimation_.Animation.GetKeySequenceLength() - 1);
                /*if the key is NOT pressed, then offset into the next frame in the current move*/
                if(!this.IsKeyDown(key))
                {
                    this.HoldFrame(frame);
                    /*must clear frame because the current frame has a HOLD_FRAME flag*/
                    this.SetCurrentFrame(null,frame);
                }
            }
            else if(!!currentFrame && !!(currentFrame.FlagsToSet.Player & PLAYER_FLAGS.MUST_HOLD_KEY)) /*Does the move require the key to be held? ... */
            {
                /*the last key in the keySequence must be the required key*/
                var key = this.currentAnimation_.Animation.GetKey(this.currentAnimation_.Animation.GetKeySequenceLength() - 1);
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
    /*this.DebugShowKeys();*/
}


/*Sets the team and initializes the energy bar and portriat*/
Player.prototype.SetupInfo = function(value,side)
{
    this.team_ = value;
    this.portriatImageSrc_ = this.portriatImageSrc_.replace("x-",side + "-")

    this.CreateKeysElement();
}

/*remove any DOM element that was added by this instance*/
Player.prototype.Release = function()
{
    var parentElement = (parentElement || window.document.getElementById("pnlStage"));

    for(var i = 0; i < this.frontHitReportImages_.length; ++i)
        RemoveFromDOM(this.frontHitReportImages_[i]);
    for(var i = 0; i < this.rearHitReportImages_.length; ++i)
        RemoveFromDOM(this.rearHitReportImages_[i]);
    for(var i = 0; i < this.otherAnimations_.Dirt.length; ++i)
        RemoveFromDOM(this.otherAnimations_.Dirt[i].Element);
    for(var i = 0; i < this.otherAnimations_.BigDirt.length; ++i)
        RemoveFromDOM(this.otherAnimations_.BigDirt[i].Element);
    this.ClearProjectiles();
    for(var i = 0; i < this.projectiles_.length; ++i)
        this.projectiles_[i].Release();

    this.ReleaseDebugElements();

    RemoveFromDOM(this.shadowContainer_);
    RemoveFromDOM(this.element_);
}

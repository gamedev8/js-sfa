var BUTTONS = 
{
    FORWARD:1
    ,BACK:2
    ,JUMP:4
    ,CROUCH:8
    ,LIGHT_PUNCH:16
    ,MEDIUM_PUNCH:32
    ,HARD_PUNCH:64
    ,LIGHT_KICK:128
    ,MEDIUM_KICK:256
    ,HARD_KICK:512
}
var IGNORE_FLAGS = 
{
    NONE:0
    ,THROWS:1 << 0
};
var FLAGS =
{
    NONE:0
    ,FORWARD:1 << 0
    ,MOBILE:1 << 0
    ,BACK:1 << 0
    ,INVULNERABLE:1 << 1
    ,MUST_HOLD_KEY:1 << 2
    ,ATTACK:1 << 3
    ,HOLD_FRAME:1 << 4
    ,AIRBORNE:1 << 5
    ,DEAD:1 << 6
    ,BLOCKING:1 << 7
    ,ALLOW_BLOCK:1 << 8
    ,SPAWN_PROJECTILE:1 << 9
    ,PROJECTILE_ACTIVE:1 << 10
    ,LOOP_IF_KEYDOWN:1 << 11
    ,CROUCHING:1 << 12
    ,STANDING:1 << 13
    ,WALKING_FORWARD:1 << 14
    ,WALKING_BACKWARD:1 << 15
    ,AIRBORNE_FB:1 << 16
    ,ALLOW_CHANGE_DIRECTION:1 << 17
    ,HOLD_ZINDEX:1 << 18
    ,ATTACK:1 << 19
    ,MOVE_TO_FRONT:1 << 20
    ,MOVE_TO_BACK:1 << 21
    ,IGNORE_PROJECTILES:1 << 22
    ,USE_ATTACK_DIRECTION:1 << 23
    ,CAN_BE_BLOCKED:1 << 24
    ,CAN_BE_AIR_BLOCKED:1 << 25
    ,SPAWN_BIGDIRT:1 << 26
    ,SPAWN_SMALLDIRT:1 << 27
    ,SMALLER_AABB:1 << 28
    ,IGNORE_COLLISIONS:1 << 29
    ,ALLOW_AIR_BLOCK:1 << 30
    ,MORE:1 << 31
};
var MORE_FLAGS = 
{
};
var BEHAVIOR_FLAGS = 
{
    THROW:1 << 0
};
var ATTACK_FLAGS = 
{
     FRONT:1 << 0
    ,REAR:1 << 1
    ,LIGHT:1 << 2
    ,MEDIUM:1 << 3
    ,HARD:1 << 4
    ,SPIT1:1 << 5
    ,SPIT2:1 << 6
    ,DIRT:1 << 7
    ,SPECIAL:1 << 8
    ,SPECIAL1:1 << 9
    ,SPECIAL2:1 << 10
    ,SPECIAL3:1 << 11
    ,SUPER:1 << 12
    ,BLOCK:1 << 13
    ,TRIP:1 << 14
    ,FLOOR_AIRBORNE:1 << 15
    ,KNOCKDOWN:1 << 16
    ,HITS_LOW:1 << 17
    ,HITS_HIGH:1 << 18
    ,THROW_START:1 << 19
    ,THROW_EJECT:1 << 20
    ,PROJECTILE:1 << 21
    ,NO_HIT_DELAY:1 << 22
    ,FLOOR_AIRBORNE_HARD:1 << 23
    ,CAN_AIR_JUGGLE:1 << 24
};
var MOVE_FLAGS = 
{
    NONE:1 << 0
    ,MOVE_WITH_PLAYER:1 << 1
};
var HIT_FLAGS = 
{
    FAR:1 << 0
    ,MEDIUM:1 << 1
    ,NEAR:1 << 2
    ,TRIP:1 << 3
}
var JUGGLE_FLAGS
{
    
}
var MAX = 
{
    KEY_SEQUENCE:20
    ,FRAME:999
    ,MAX_IMAGES:10
};
var DEAD_TIME = 1000;
/************************************************************************/
/************************************************************************/
var Key = function(name,keyCode,bit)
{
    this.IsPressed = false;
    this.KeyCode = keyCode || null;
    this.Name = name;
    this.Bit = bit;
}
/*
    Determines whether this instance has the passed in key code
*/
Key.prototype.HandleKey = function(keyCode)
{
    this.IsPressed = (this.KeyCode === keyCode);

    return !!this.IsPressed ? this.Bit : 0;
}
/************************************************************************/
/************************************************************************/
var Animation = function(requiredFlags,name,duration,frames,keySequence,flags,priority,energyToAdd,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{
    this.baseAnimation_ = new BaseAnimation(frames,name,isAttack,allowAirBlock);
    this.keySequence_ = keySequence;
    this.alternateKeySequences_ = [];
    this.adjustShadowPosition_ = true;
    this.state_ = flags || 0;
    this.poseState_ = 0;
    this.requiredPoseState_ = requiredFlags;
    this.behaviorFlags_ = behaviorFlags || 0;
    this.duration_ = duration || 0;
    //jump to another move after this one is done
    this.chainAnimation_ = null;
    //jump to a specific frame in the chained move
    this.chainAnimationFrame_ = 0;
    this.grappleDistance_ = 0;
    this.isImplicit_ = false;
    this.priority_ = priority || 100;
    this.moveOverrideFlags_ = new MoveOverrideFlags();
    this.vx_ = 0;
    this.vy_ = 0;

    this.vyFn_ = function(a) {return function(b) {return b}};
    this.vxFn_ = function(a) {return function(b) {return b}};

    this.vxFnArgs_ = {};
    this.vyFnArgs_ = {};

    this.userData_ = null;
    this.energyToAdd_ = energyToAdd || 0;
    this.energyToSubtract_ = 0;
    this.invokedAnimationName_ = invokedAnimationName || "";
    this.controllerAnimation_ = null;
    this.controlledAnimation_ = null;
    this.trail_ = null;
    this.allowJuggle_ = false;
    this.ignoresCollisions_ = false;
}

Animation.prototype.EndBlock = function()
{
    this.baseAnimation_.skipFrameBlockCheck_ = true;
    this.baseAnimation_.canAddStopBlock_ = true;
}

Animation.prototype.AddAlternateKeySequence = function(sequence)
{
    this.alternateKeySequences_[this.alternateKeySequences_.length] = sequence;
}

Animation.prototype.GetXModifier = function() { return this.XModifier(this.vxFnArgs_); }
Animation.prototype.GetYModifier = function() { return this.YModifier(this.vyFnArgs_); }
Animation.prototype.XModifier = function(args) { return this.vxFn_(args); }
Animation.prototype.YModifier = function(args) { return this.vyFn_(args); }

Animation.prototype.Chain = function(move,frameOffset)
{
    this.chainAnimation_ = move;
    this.chainAnimationFrame_ = frameOffset || 0;
}

Animation.prototype.AddFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
{
    this.ignoresCollisions_ = !!(flagsToSet & FLAGS.IGNORE_COLLISIONS);
    return this.baseAnimation_.AddFrame.apply(this.baseAnimation_,arguments);
}
Animation.prototype.AddRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
{
    this.ignoresCollisions_ = !!(flagsToSet & FLAGS.IGNORE_COLLISIONS);
    return this.baseAnimation_.AddRepeatingFrame.apply(this.baseAnimation_,arguments);
}
Animation.prototype.GetNextFrameOffset = function(id) { return this.baseAnimation_.GetNextFrameOffset.apply(this.baseAnimation_,arguments); }
Animation.prototype.GetFrame = function(frameDelta)
{
    if(!!this.controllerAnimation_ && !!this.controllerAnimation_.Animation)
    {
        var index = this.controllerAnimation_.FrameIndex-1;
        if(index > -1)
            return this.baseAnimation_.frames_[index];
    }
    else
        return this.baseAnimation_.GetFrame.apply(this.baseAnimation_,arguments);

    return null;
}
Animation.prototype.GetFrameIndex  = function(id)
{
    return this.baseAnimation_.GetFrameIndex(id);
}
Animation.prototype.SetGrappleDistance = function(x)
{
    this.grappleDistance_ = x;
    this.behaviorFlags_ = BEHAVIOR_FLAGS.THROW;
}
Animation.prototype.AddUserDataToFrame = function(index,data)
{
    var frame = this.baseAnimation_.frames_[index];
    frame.UserData[frame.UserData.length] = data;
}
Animation.prototype.ClearAllFrameUserData = function()
{
    for(var i = 0, length = this.baseAnimation_.frames_.length; i < length; ++i)
        this.baseAnimation_.frames_[i].UserData = [];
}

/************************************************************************/
/************************************************************************/
var GenericAnimation = function(name,frames,moveFlags,requiredState,state)
{
    this.baseAnimation_ = new BaseAnimation(frames,name,false);
    this.state_ = state || 0;
    this.moveFlags_ = moveFlags || 0;
    this.requiredPoseState_ = requiredState || 0;
    this.initialX_ = 0;
    this.initialStageX_ = 0;
    this.initialPlayerX_ = 0;
    this.initialY_ = 0;
    this.initialStageY_ = 0;
    this.initialPlayerY_ = 0;
    this.isActive_ = false;
    this.direction_ = 0;
}
GenericAnimation.prototype.HasUserData = function(index)
{
    var frame = this.baseAnimation_.frames_[index];
    return !!frame.UserData && (frame.UserData.length > 0);
}
GenericAnimation.prototype.AddUserDataToFrame = function(index,data)
{
    var frame = this.baseAnimation_.frames_[index];
    if(!!frame)
        frame.UserData[frame.UserData.length] = data;
}
GenericAnimation.prototype.ClearAllFrameUserData = function()
{
    for(var i = 0, length = this.baseAnimation_.frames_.length; i < length; ++i)
        this.baseAnimation_.frames_[i].UserData = [];
}

GenericAnimation.prototype.AddFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.baseAnimation_.AddFrame.apply(this.baseAnimation_,arguments); }
GenericAnimation.prototype.AddRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.baseAnimation_.AddRepeatingFrame.apply(this.baseAnimation_,arguments); }
GenericAnimation.prototype.AddTrailFrame = function(player,image,nbFrames)
{
    return this.baseAnimation_.AddFrame(player,null,image,nbFrames);
}
GenericAnimation.prototype.AddRepeatingTrailFrame = function(player,image,nbFrames)
{
    return this.baseAnimation_.AddRepeatingFrame(player,null,image,nbFrames);
}
GenericAnimation.prototype.GetFrame = function(frameDelta) { return this.baseAnimation_.GetFrame.apply(this.baseAnimation_,arguments); }
GenericAnimation.prototype.GetNextFrameOffset = function(id) { return this.baseAnimation_.GetNextFrameOffset.apply(this.baseAnimation_,arguments); }
GenericAnimation.prototype.TryRender = function(frame,startFrame,element,stageX,stageY,playerX,playerY)
{
    var offsetX = 0;
    var offsetY = 0;
    var delta = frame - startFrame;
    var newFrame = this.GetFrame(delta);
    if(!newFrame)
    {
        /*free the element so it can be reused in other animations*/
        element.style.display="none";
        element.src = "";
        element.isInUse = false;
        this.isActive_ = false;
        return false;
    }
    else
    {
        if(element.style.display != "")
            element.style.display = "";
        offsetX = newFrame.X;
        offsetY = newFrame.Y;
        if(this.direction_ > 0)
        {
            if(!!newFrame.RightSrc && (element.src != newFrame.RightSrc))
                element.src  = frameImages_.Get(newFrame.RightSrc).src;
            /*move the image to the middle of the point*/
            offsetX -= (element.width/2);
            offsetY -= (element.height/2);
        }
        else
        {
            if(!!newFrame.LeftSrc && (element.src != newFrame.LeftSrc))
                element.src  = frameImages_.Get(newFrame.LeftSrc).src;
            /*move the image to the middle of the point*/
            offsetX -= (element.width/2);
            offsetY -= (element.height/2);
        }

        if(!!(this.moveFlags_ & MOVE_FLAGS.MOVE_WITH_PLAYER))
        {
            offsetX += playerX - this.initialPlayerX_;
            offsetY += playerY - this.initialPlayerY_;
        }
    }
    /*Must add the change in stageX to the position to keep the animation in one place on the screen,
     unless the animation must move with the player - in which case we disregard the stageX*/
    if(this.direction_ > 0)
    {
        element.style.left = "";
        if(!!(this.moveFlags_ & MOVE_FLAGS.MOVE_WITH_PLAYER))
            element.style.right = (offsetX + this.initialX_) + "px";
        else
            element.style.right = (offsetX + this.initialX_ + (this.initialStageX_ - stageX)) + "px";
    }
    else
    {
        element.style.right = "";
        if(!!(this.moveFlags_ & MOVE_FLAGS.MOVE_WITH_PLAYER))
            element.style.left = (offsetX + this.initialX_) + "px";
        else
            element.style.left = (offsetX + this.initialX_  - (this.initialStageX_ - stageX)) + "px";
    }
    element.style.bottom = (offsetY + this.initialY_ + (this.initialStageY_ - stageY)) + "px";
    return true;
}


/************************************************************************/
/************************************************************************/
var FrameImageLookup = function()
{
    this.images_ = {};
    this.nbImages_ = 0;
    this.nbImagesLoading_ = 0;
    this.element_ = window.document.getElementById("spnImagesLoading");
}
/*
Image only loaded once
*/
FrameImageLookup.prototype.Load = function(src)
{
    if(!this.images_.hasOwnProperty(src))
    {
        ++this.nbImagesLoading_;
        ++this.nbImages_;

        this.element_.innerHTML = "0";
        this.images_[src] = new Image();
        //this.images_[src] = window.document.createElement("img");
        this.images_[src].onload = (function(thisValue)
        {
            return function()
            {
                if(!!--thisValue.nbImagesLoading_)
                {
                    thisValue.element_.innerHTML = (100*(thisValue.nbImages_-thisValue.nbImagesLoading_)/thisValue.nbImages_).toFixed(1);
                }
                else if(thisValue.nbImages_ > 100)
                {
                    thisValue.element_.parentElement.style.display = "none";
                    window.document.getElementById("pnlStage").style.visibility = "visible";
                }
            }
        })(this);
        this.images_[src].src = src;
    }
    return this.images_[src];
}
FrameImageLookup.prototype.Get = function(src)
{
    return this.images_[src];
}
var frameImages_ = new FrameImageLookup();
/************************************************************************/
/************************************************************************/
var Frame = function(index,id,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,frameOffset,chainProjectile,imageOffsetX,imageOffsetY,attackState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    this.EnergyToAdd = energyToAdd || 0;
    this.Index = index;
    this.ID = +id; /* the "+" is a fast conversion to numeric*/
    this.HitID = hitID || 0;
    this.HitDelayFactor = hitDelayFactor || 1;
    this.ShadowImageSrc = !!shadowImage ? "images/misc/misc/shadow-" + shadowImage + ".png" : null;
    if(!!this.ShadowImageSrc)
        frameImages_.Load(this.ShadowImageSrc);
    this.RightSrc = !!image ? image.replace("#-","l-").replace("x-","r-") : "";
    this.LeftSrc =  !!image ? image.replace("#-","r-").replace("x-","l-") : "";
    this.AttackState = attackState || 0;
    this.HitPoints = hitPoints || [];
    if(!!this.RightSrc)
        frameImages_.Load(this.RightSrc);
    if((this.RightSrc != this.LeftSrc) && !!this.LeftSrc)
        frameImages_.Load(this.LeftSrc);

    this.Frames = nbFrames || 0;
    this.FrameOffset = frameOffset || 0;
    this.FlagsToSet = flagsToSet || FLAGS.NONE;
    this.FlagsToClear = flagsToClear || FLAGS.NONE;
    this.FlagsToSend = flagsToSend || FLAGS.NONE;
    this.Priority = priority || 0;
    this.BaseDamage = baseDamage || 0;
    this.X = x || 0;
    this.Y = y || 0;
    this.ImageOffsetX = imageOffsetX === 0 ? 0 : (imageOffsetX || null);
    this.ImageOffsetY = imageOffsetY === 0 ? 0 : (imageOffsetY || null);
    this.chainProjectile_ = chainProjectile;

}
Frame.prototype.HasFlag = function(flag) { return (this.FlagsToSet & flag) > 0; }
Frame.prototype.GetEndFrameOffset = function() { return this.Frames + this.FrameOffset; }
Frame.prototype.GetImageSrc = function(direction){if(direction > 0) { return this.RightSrc; } else { return this.LeftSrc; } }

/************************************************************************/
/************************************************************************/
var Projectile = function(player,animation,disintegrationAnimation, xOffset, yOffset, xSpeed, ySpeed, xFunc, yFunc, attackState, hitState, baseDamage, energyToAdd)
{
    this.energyToAdd_ = energyToAdd || 0;
    this.owner_ = player;
    this.animation_ = animation;
    this.disintegrationAnimation_ = disintegrationAnimation;
    this.offsetX_ = xOffset;
    this.offsetY_ = yOffset;
    this.initialX_ = xOffset;
    this.initialY_ = yOffset;
    this.x_ = xOffset;
    this.y_ = yOffset;
    this.xSpeed_ = xSpeed || 1;
    this.ySpeed_ = ySpeed || 0;
    this.xFunc_ = xFunc || function(y){return this.xSpeed_ * 3;}
    this.yFunc_ = yFunc || function(x){return this.ySpeed_ * 1;}
    this.direction_ = player.direction_;
    this.startFrame_ = 0;
    this.element_ = window.document.createElement("img");
    this.element_.className="projectile";
    this.element_.style.display="none";
    window.document.getElementById("pnlStage").appendChild(this.element_);
    this.isActive_ = false;
    this.attackState_ = attackState || 0;
    this.hitState_ = hitState || 0;
    this.baseDamage_ = baseDamage || 0;
    this.flagsToSend_ = FLAGS.NONE;
    this.isDisintegrating_ = false;
    this.t_ = 0;
    this.vxFn_ = null;
    this.vyFn_ = null;
    this.nbHits_ = 0;
    this.maxHits_ = 1;
    this.hitStopFrameCount_ = CONSTANTS.DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT;
    this.lastHitFrame_ = 0;
    this.fx_ = 1;
    this.fy_ = 1;
    this.id_ = "" + Projectile.prototype.Count;
    this.canJuggle_ = false;
    ++Projectile.prototype.Count;
}
Projectile.prototype.Count = 0;
/*Stops the projectile*/
Projectile.prototype.Cancel = function()
{
    this.element_.style.display="none";
    this.x_ = this.offsetX_;
    this.y_ = this.offsetY_;
    this.t_ = 0;
    this.isActive_ = false;
    this.isDisintegrating_ = false;
    this.owner_.onProjectileGoneFn_(this.id_);
}

/*
Fires the projectile
*/
Projectile.prototype.Throw = function(frame,stageX,stageY)
{
    this.startFrame_ = frame;
    this.t_ = 0;
    this.element_.style.display="none";
    this.direction_ = this.owner_.direction_;
    this.x_ += this.owner_.GetX();
    this.y_ += this.owner_.GetY();
    this.stageX_ = stageX;
    this.stageY_ = stageY;
    this.isActive_ = true;
    this.isDisintegrating_ = false;
    this.vxFn_ = this.animation_.GetXModifier();
    this.vyFn_ = this.animation_.GetYModifier();
    this.setAndMoveImageFn_ = game_.UseAlternateImageLoadingFunctions() ? this._SetAndMoveImage : this.SetAndMoveImage;
    this.trimX_ = 15;
    this.trimY_ = 15;
    this.nbHits_ = 0;
    this.lastHitFrame_ = 0;
}

Projectile.prototype.GetTop = function()
{
    return parseInt(this.element_.style.bottom) + parseInt(this.element_.height) - this.trimY_;
}

Projectile.prototype.GetBottom = function()
{
    return parseInt(this.element_.style.bottom) + this.trimY_;
}

Projectile.prototype.GetBackX = function()
{
    if(this.direction_ < 0)
        return parseInt(this.element_.style.left) + (this.trimX_);
    else
        return STAGE.MAX_STAGEX - (parseInt(this.element_.style.right) + (this.trimX_));
}

Projectile.prototype.GetFrontX = function()
{
    if(this.direction_  < 0)
        return (parseInt(this.element_.width) + parseInt(this.element_.style.left)) - this.trimX_;
    else
        return (STAGE.MAX_STAGEX - (parseInt(this.element_.style.right) + parseInt(this.element_.width))) - this.trimX_;
}
Projectile.prototype.GetLeftX = function() { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.x_ + this.element_.width;}else{return this.x_;}}
Projectile.prototype.GetRightX = function() { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.x_;}else{return this.x_ + this.element_.width;}}
Projectile.prototype.GetMidX = function()
{
    var left = this.GetBackX();
    var right = this.GetFrontX();

    return right - ((right-left)/2);
}
Projectile.prototype.GetMidY = function()
{
    var bottom = this.GetBottom();
    var top = this.GetTop();

    return top - ((top-bottom)/2);
}

/*Is the projectile active?*/
Projectile.prototype.IsActive = function()
{
    if(this.IsDisintegrating())
        return false;
    return this.isActive_;
}

/*Is the projectile active?*/
Projectile.prototype.IsDisintegrating = function()
{
    return this.isDisintegrating_;
}

/*Is the projectile still visible?*/
Projectile.prototype.IsVisible = function(stageX,stageY)
{
    return (this.x_ < STAGE.MAX_STAGEX && this.x_ > -100) && (this.y_ > 0 && this.y_ < 1000);
}


Projectile.prototype.CanHit = function(frame)
{
    return !this.isDisintegrating_ && ((!this.lastHitFrame_) || (frame > (this.lastHitFrame_ + this.hitStopFrameCount_)));
}

Projectile.prototype.IsInHitStop = function(frame)
{
    return ((!!this.lastHitFrame_) && (frame < (this.lastHitFrame_ + this.hitStopFrameCount_)));
}

/*Advances the projectile*/
Projectile.prototype.Advance = function(frame,stageX,stageY)
{
    /*Is the projectile still on screen?*/
    if(!this.IsVisible(0,0))
    {
        this.Cancel();
        return null;
    }

    ++this.t_;
    this.isActive_ = true;



    if(!this.IsInHitStop(frame))
    {
        if(!this.isDisintegrating_)
        {
            var dx = (this.xSpeed_ * 2) + (this.direction_ > 0 ? (this.stageX_ - stageX) : (stageX - this.stageX_));
            var dy = (this.ySpeed_) + (this.stageY_ - stageY);

            dx = this.vxFn_(dx,this.t_);
            dy = this.vyFn_(dy,this.t_);

            this.x_ += dx;
            this.y_ += dy;
        }

    }
    if(!!this.isDisintegrating_)
    {
        this.x_ += this.direction_ > 0 ? (this.stageX_ - stageX) : (stageX - this.stageX_);
        this.y_ += this.stageY_ - stageY;
    }




    var offsetX = 0;
    var offsetY = 0;

    var delta = frame - this.startFrame_;
    var newFrame = null;
    if(!this.isDisintegrating_)
    {
        newFrame = this.animation_.GetFrame(delta);
        if(!newFrame)
        {
            newFrame = this.animation_.baseAnimation_.frames_[0];
            this.startFrame_ = frame;
        }
    }
    else
    {
        newFrame = this.disintegrationAnimation_.GetFrame(delta);
        if(!newFrame)
        {
            this.Cancel();
            return null;
        }
    }

    this.setAndMoveImageFn_(newFrame,offsetX,offsetY,stageX,stageY);
    this.stageX_ = stageX;
    this.stageY_ = stageY;

    /*Allow players on the other team to deal with projectile coming toward them.*/
    this.owner_.OnProjectileMoved(this.id_,this.GetMidX(),this.GetMidY());

    return this;
}


/*sets and moves the image - for browsers that load preloaded images instantly when the src property is set*/
Projectile.prototype.SetAndMoveImage = function(newFrame,offsetX,offsetY,stageX,stageY)
{
    if(!!newFrame)
    {
        offsetX = newFrame.X;
        offsetY = newFrame.Y;

        if(this.direction_ > 0)
        {
            if(!!newFrame.RightSrc && (this.element_.src != newFrame.RightSrc))
                this.element_.src  = frameImages_.Get(newFrame.RightSrc).src;
        }
        else
        {
            if(!!newFrame.LeftSrc && (this.element_.src != newFrame.LeftSrc))
                this.element_.src  = frameImages_.Get(newFrame.LeftSrc).src;
        }
        if(this.element_.style.display != "")
            this.element_.style.display="";
    }
    if(this.isDisintegrating_)
    {
        if(this.direction_ > 0)
        {
            this.element_.style.left = (offsetX + FlipCoord(this.x_,this.element_.width)) + "px";
            this.element_.style.right = "";
        }
        else
        {
            this.element_.style.right = (offsetX + FlipCoord(this.x_,this.element_.width)) + "px";
            this.element_.style.left = "";
        }
    }
    else
    {
        if(this.direction_ > 0)
        {
            this.element_.style.left = "";
            this.element_.style.right = (offsetX + this.x_) + "px";
        }
        else
        {
            this.element_.style.right = "";
            this.element_.style.left = (offsetX + this.x_) + "px";
        }
    }
    var imgOffsetY = this.y_ - (this.element_.height/2);
    this.element_.style.bottom = imgOffsetY + "px";
}


/*sets and moves the image - for browsers that dont load preloaded images instantly when the src property is set (FIREFOX)*/
Projectile.prototype._SetAndMoveImage = function(newFrame,offsetX,offsetY,stageX,stageY)
{
    if(!!newFrame)
    {
        offsetX = newFrame.X;
        offsetY = newFrame.Y;

        this.element_.onload = (function(thisValue,offsetX,offsetY,hasOffsetX,hasOffsetY)
        {
            return function()
            {
                if(hasOffsetX || hasOffsetY)
                {
                    if(!!thisValue.isDisintegrating_)
                    {
                        if(this.direction_ > 0)
                        {
                            this.style.left = (offsetX + FlipCoord(thisValue.x_,this.width)) + "px";
                            this.style.right = "";
                        }
                        else
                        {
                            this.style.right = (offsetX + FlipCoord(thisValue.x_,this.width)) + "px";
                            this.style.left = "";
                        }
                    }
                    else
                    {
                        if(thisValue.direction_ > 0)
                        {
                            this.style.left = "";
                            this.style.right = (offsetX + thisValue.x_) + "px";
                        }
                        else
                        {
                            this.style.right = "";
                            this.style.left = (offsetX + thisValue.x_) + "px";
                        }
                    }

                }
                /*this.style.bottom = (offsetY + thisValue.y_) + "px";*/
                var imgOffsetY = thisValue.y_ - (this.height/2);
                this.style.bottom = imgOffsetY + "px";

            }
        })(this,offsetX,offsetY,offsetX != undefined,offsetY != undefined);


        if(this.direction_ > 0)
        {
            if(!!newFrame.RightSrc && (this.element_.src != newFrame.RightSrc))
                this.element_.src  = frameImages_.Get(newFrame.RightSrc).src;
        }
        else
        {
            if(!!newFrame.LeftSrc && (this.element_.src != newFrame.LeftSrc))
                this.element_.src  = frameImages_.Get(newFrame.LeftSrc).src;
        }
        if(this.element_.style.display != "")
            this.element_.style.display="";
    }

}

Projectile.prototype.Disintegrate = function(frame)
{
    this.isDisintegrating_ = true;
    this.startFrame_ = frame;
}
/*The projectile has hit a player*/
Projectile.prototype.HitPlayer = function(frame)
{
    this.lastHitFrame_ = frame;
    if(++this.nbHits_ >= this.maxHits_)
        this.Disintegrate(frame);
}
/*The projectile has hit another projectile*/
Projectile.prototype.HitProjectile = function(frame,otherProjectile)
{
    var isSuper = !!(this.flagsToSend_ & ATTACK_FLAGS.SUPER);
    var isOtherSuper = !!(otherProjectile.flagsToSend_ & ATTACK_FLAGS.SUPER);
    var areBothSupers = isSuper && isOtherSuper;

    if(!isSuper || areBothSupers)
        this.Disintegrate(frame);
    if(!isOtherSuper || areBothSupers)
        otherProjectile.Disintegrate(frame);
}
var FlipCoord = function(x,width)
{
    return STAGE.MAX_STAGEX - (x + width);
}
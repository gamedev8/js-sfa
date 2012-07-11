
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
var CreateAnimation = function(requiredFlags,name,duration,frames,keySequence,flags,priority,energyToAdd,isAttack,allowAirBlock,behaviorFlags,invokedAnimationName)
{

    var Animation = function()
    {
        this.BaseAnimation = CreateBaseAnimation(frames,name,isAttack,allowAirBlock);
        this.KeySequence = keySequence;
        this.AlternateKeySequences = [];
        this.AdjustShadowPosition = true;
        this.Duration = duration || 0;
        this.ChainAnimation = null;
        this.ChainAnimationFrame = 0;
        this.GrappleDistance = 0;
        this.IsImplicit = false;
        this.Priority = priority || 100;
        this.Vx = 0;
        this.Vy = 0;
        this.ChainVxFunc = function(x) { return x; };
        this.ChainVyFunc = function(y) { return y; };
        this.VyFn = function(a) {return function(b) {return b}};
        this.VxFn = function(a) {return function(b) {return b}};
        this.VyAirFn = function(a) {return function(b) {return b}};
        this.VxAirFn = function(a) {return function(b) {return b}};
        this.EnergyToAdd = energyToAdd || 0;
        this.EnergyToSubtract = 0;
        this.InvokedAnimationName = invokedAnimationName || "";
        this.ControllerAnimation = null;
        this.Trail = null;
        this.AllowJuggle = false;
        this.IgnoresCollisions = false;
        this.OtherPlayerAirborneFlags;
        this.IsThrow = false;
        this.IsSuperMove = false;
        this.IsSpecialMove = false;

        this.Flags = {};
        this.RequiredFlags = requiredFlags;
        this.BehaviorFlags = behaviorFlags || 0;
        this.OverrideFlags = new MoveOverrideFlags();

        this.VyAirFnArgs = {};
        this.VxAirFnArgs = {};
        this.VxFnArgs = {};
        this.VyFnArgs = {};

        this.UserData = null;
    }

    Animation.prototype.GetAlternateKeySequencesLength = function() { return this.AlternateKeySequences.length; }
    Animation.prototype.GetAlternateKeySequenceLength = function(i) { return this.AlternateKeySequences[i].length; }
    Animation.prototype.GetAlternateKeySequence = function(i,j) { return this.AlternateKeySequences[i][j]; }
    Animation.prototype.SetAlternateKeySequence = function(i,value) { return this.AlternateKeySequences[i] = value; }
    Animation.prototype.GetKeySequenceLength = function() { return this.KeySequence.length; }
    Animation.prototype.GetKey = function(index) { return this.KeySequence[index]; }

    Animation.prototype.GetXModifier = function() { return this.XModifier(this.VxFnArgs); }
    Animation.prototype.GetYModifier = function() { return this.YModifier(this.VyFnArgs); }
    Animation.prototype.GetAirYModifier = function() { return this.AirYModifier(this.VyAirFnArgs); }
    Animation.prototype.GetAirXModifier = function() { return this.AirXModifier(this.VxAirFnArgs); }
    Animation.prototype.XModifier = function(args) { return this.VxFn(args); }
    Animation.prototype.YModifier = function(args) { return this.VyFn(args); }
    Animation.prototype.AirYModifier = function(args) { return this.VyAirFn(args); }
    Animation.prototype.AirXModifier = function(args) { return this.VxAirFn(args); }
    Animation.prototype.SetOtherPlayerAirborneFlags = function(flags) { this.OtherPlayerAirborneFlags = flags; }
    Animation.prototype.GetOtherPlayerAirborneFlags = function() { return this.OtherPlayerAirborneFlags; }
    Animation.prototype.IsAttack = function() { return this.BaseAnimation.isAttack_; }

    Animation.prototype.EndBlock = function()
    {
        this.BaseAnimation.skipFrameBlockCheck_ = true;
        this.BaseAnimation.canAddStopBlock_ = true;
    }

    Animation.prototype.AddAlternateKeySequence = function(sequence)
    {
        this.AlternateKeySequences[this.AlternateKeySequences.length] = sequence;
    }

    Animation.prototype.Chain = function(move,frameOffset)
    {
        this.ChainAnimation = (move);
        this.ChainAnimationFrame = (frameOffset || 0);
    }

    Animation.prototype.AddFrameWithSound = function(player,volume,soundFilename,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
    {
        this.IgnoresCollisions = !!flagsToSet && !!(flagsToSet.Player & PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.AddFrameWithSound.apply(this.BaseAnimation,arguments);
    }

    Animation.prototype.AddFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
    {
        this.IgnoresCollisions = !!flagsToSet && !!(flagsToSet.Player & PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.AddFrame.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.AddRepeatingFrameWithSound = function(player,volume,soundFilename,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
    {
        this.IgnoresCollisions = !!flagsToSet && !!(flagsToSet.Player & PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.AddRepeatingFrameWithSound.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.AddRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd)
    {
        this.IgnoresCollisions = !!flagsToSet && !!(flagsToSet.Player & PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.AddRepeatingFrame.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.GetNextFrameOffset = function(id) { return this.BaseAnimation.GetNextFrameOffset.apply(this.BaseAnimation,arguments); }
    Animation.prototype.GetFrame = function(frameDelta)
    {
        if(!!this.ControllerAnimation && !!this.ControllerAnimation.Animation)
        {
            var index = this.ControllerAnimation.FrameIndex-1;
            if(index > -1)
                return this.BaseAnimation.frames_[index];
        }
        else
            return this.BaseAnimation.GetFrame.apply(this.BaseAnimation,arguments);

        return null;
    }
    Animation.prototype.GetFrameIndex  = function(id) { return this.BaseAnimation.GetFrameIndex(id); }
    Animation.prototype.SetGrappleDistance = function(x)
    {
        grappleDistance_ = x;
        this.BehaviorFlags = BEHAVIOR_FLAGS.THROW;
        this.IsThrow = true;
    }
    Animation.prototype.AddUserDataToFrame = function(index,data)
    {
        var frame = this.BaseAnimation.frames_[index];
        frame.UserData[frame.UserData.length] = data;
    }
    Animation.prototype.ClearAllFrameUserData = function()
    {
        for(var i = 0, length = this.BaseAnimation.frames_.length; i < length; ++i)
            this.BaseAnimation.frames_[i].UserData = [];
    }

    Animation.prototype.SetMediumAttack = function()
    {
        this.EnergyToAdd = (2);
    }

    Animation.prototype.SetHardAttack = function()
    {
        this.EnergyToAdd = (3);
    }

    return new Animation();
}
/************************************************************************/
/************************************************************************/
var CreateGenericAnimation = function(name,frames,moveFlags,requiredState,state)
{
    var GenericAnimation = function()
    {
        this.BaseAnimation = CreateBaseAnimation(frames,name,false);
        this.state_ = state || 0;
        this.moveFlags_ = moveFlags || 0;
        this.RequiredFlags = requiredState || 0;
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
        var frame = this.BaseAnimation.frames_[index];
        return !!frame.UserData && (frame.UserData.length > 0);
    }
    GenericAnimation.prototype.AddUserDataToFrame = function(index,data)
    {
        var frame = this.BaseAnimation.frames_[index];
        if(!!frame)
            frame.UserData[frame.UserData.length] = data;
    }
    GenericAnimation.prototype.ClearAllFrameUserData = function()
    {
        for(var i = 0, length = this.BaseAnimation.frames_.length; i < length; ++i)
            this.BaseAnimation.frames_[i].UserData = [];
    }

    GenericAnimation.prototype.AddFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.BaseAnimation.AddFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.AddRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.BaseAnimation.AddRepeatingFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.AddTrailFrame = function(player,image,nbFrames)
    {
        return this.BaseAnimation.AddFrame(player,null,image,nbFrames);
    }
    GenericAnimation.prototype.AddRepeatingTrailFrame = function(player,image,nbFrames)
    {
        return this.BaseAnimation.AddRepeatingFrame(player,null,image,nbFrames);
    }
    GenericAnimation.prototype.GetFrame = function(frameDelta) { return this.BaseAnimation.GetFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.GetNextFrameOffset = function(id) { return this.BaseAnimation.GetNextFrameOffset.apply(this.BaseAnimation,arguments); }
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
                var data = spriteLookup_.Get(newFrame.RightSrc)
                if(!!data && (element.style.backgroundPositionX != data.Left))
                {
                    element.style.backgroundPosition = data.Left + " " + data.Bottom;
                    element.style.width = data.Width;
                    element.style.height = data.Height;
                }
                /*move the image to the middle of the point*/
                offsetX -= (parseInt(element.style.width)/2);
                offsetY -= (parseInt(element.style.height)/2);
            }
            else
            {
                var data = spriteLookup_.Get(newFrame.LeftSrc)
                if(!!data && (element.style.backgroundPositionX != data.Left))
                {
                    element.style.backgroundPosition = data.Left + " " + data.Bottom;
                    element.style.width = data.Width;
                    element.style.height = data.Height;
                }

                /*move the image to the middle of the point*/
                offsetX -= (parseInt(element.style.width)/2);
                offsetY -= (parseInt(element.style.height)/2);
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
    return new GenericAnimation();
}
/************************************************************************/
/************************************************************************/
var CreateBasicAnimation = function(name,frames,isLooping,direction)
{
    var BasicAnimation = function()
    {
        this.BaseAnimation = CreateBasicBaseAnimation(frames,name);
        this.isLooping_ = isLooping || false;
        this.internalFrame_ = 0;
        this.direction_  = direction || 0;
    }

    BasicAnimation.prototype.GetFrame = function(frameDelta)
    {
        return this.BaseAnimation.GetFrame.apply(this.BaseAnimation,arguments);
    }

    BasicAnimation.prototype.AddFrame = function(owner,image,nbFrames)
    {
        this.BaseAnimation.AddFrame.apply(this.BaseAnimation,arguments);
    }

    BasicAnimation.prototype.TryRender = function(frame,object,direction)
    {
        direction = direction || this.direction_;
        var element = object.Element;
        var startFrame = object.StartFrame;

        var offsetX = object.X || 0;
        var offsetY = object.Y || 0;
        var delta = 0;
        if(!!this.isLooping_)
        {
            if(this.internalFrame_ > this.BaseAnimation.nbFrames_)
                this.internalFrame_ = 0;
            delta = this.internalFrame_++;
        }
        else
            delta = frame - startFrame;

        var newFrame = this.GetFrame(delta);
        if(!newFrame)
        {
            /*free the element so it can be reused in other animations*/
            element.style.display="none";
            return false;
        }
        else
        {
            offsetX += newFrame.X;
            offsetY += newFrame.Y;
            if(direction > 0)
            {
                /*
                if(!!newFrame.RightSrc && (element.src != newFrame.RightSrc))
                    element.src  = frameImages_.Get(newFrame.RightSrc).src;
                */

                var data = spriteLookup_.Get(newFrame.RightSrc)
                if(!!data && (element.style.backgroundPositionX != data.Left))
                {
                    element.style.backgroundPosition = data.Left + " " + data.Bottom;
                    /*element.style.backgroundImage = "url(" + data.Sprite + ")";*/
                    element.style.width = data.Width;
                    element.style.height = data.Height;
                }


                if(offsetX != undefined)
                {
                    element.style.left = "";
                    element.style.right = offsetX + "px";
                }
            }
            else
            {
                /*
                if(!!newFrame.LeftSrc && (element.src != newFrame.LeftSrc))
                    element.src  = frameImages_.Get(newFrame.LeftSrc).src;
                */
                var data = spriteLookup_.Get(newFrame.LeftSrc)
                if(!!data && (element.style.backgroundPositionX != data.Left))
                {
                    element.style.backgroundPosition = data.Left + " " + data.Bottom;
                    /*element.style.backgroundImage = "url(" + data.Sprite + ")";*/
                    element.style.width = data.Width;
                    element.style.height = data.Height;
                }

                if(offsetX != undefined)
                {
                    element.style.right = "";
                    element.style.left = offsetX + "px";
                }
            }
        }

        if(offsetY != undefined)
            element.style.bottom = offsetY + "px";
        if(element.style.display != "")
            element.style.display = "";
        return true;
    }
    return new BasicAnimation();
}
/************************************************************************/
/************************************************************************/
var CreateFrameImageLookup = function()
{
    var images_ = {};
    var nbImages_ = 0;
    var nbImagesLoading_ = 0;
    var element_ = window.document.getElementById("spnImagesLoading");
    
    var FrameImageLookup = function()
    {
    }
    
    FrameImageLookup.prototype.GetNbImages = function() { return nbImages_; }
    FrameImageLookup.prototype.GetNbImagesLoading = function() { return nbImagesLoading_; }
    FrameImageLookup.prototype.GetElement = function() { return element_; }
    
    /*Image only loaded once*/
    FrameImageLookup.prototype.Load = function(src)
    {
        if(!images_.hasOwnProperty(src))
        {
            ++nbImagesLoading_;
            ++nbImages_;
    
            element_.innerHTML = "0";
            images_[src] = new Image();
            //images_[src] = window.document.createElement("img");
            images_[src].onload = (function(thisValue)
            {
                return function()
                {
                    if(!!--thisValue.nbImagesLoading_)
                    {
                        thisValue.GetElement().innerHTML = (100*(thisValue.GetNbImages()-thisValue.GetNbImagesLoading())/thisValue.GetNbImages()).toFixed(1);
                    }
                    else
                    {
                        thisValue.GetElement().innerHTML = "100";
                    }
                }
            })(this);
            images_[src].src = src;
        }
        return images_[src];
    }
    FrameImageLookup.prototype.Get = function(src)
    {
        return images_[src];
    }
    return new FrameImageLookup();
}
var frameImages_ = CreateFrameImageLookup();
/************************************************************************/
/************************************************************************/
var CreateSpriteLookup = function()
{
    var data_ = {};
    var nbImages_ = 0;
    var nbImagesLoading_ = 0;
    var element_ = window.document.getElementById("spnImagesLoading");
    
    
    var SpriteLookup = function()
    {
    }
    
    /*Image only loaded once*/
    SpriteLookup.prototype.Load = function(key,spriteFilename,left,bottom,width,height)
    {
    
        if(!!spriteFilename && (spriteFilename[0] != "|"))
            frameImages_.Load(spriteFilename);
    
        spriteFilename = spriteFilename.replace("|","");
    
        if(!this.Get(key))
        {
            data_[key] = {Key:key, Sprite:spriteFilename, Left:left, Bottom:bottom, Width:width, Height:height};
        }
        return data_[key];
    }
    SpriteLookup.prototype.Get = function(key)
    {
        return data_[key];
    }
    SpriteLookup.prototype.GetLeft = function(key)
    {
        return (data_[key] || {}).Left || "";
    }
    SpriteLookup.prototype.Set = function(element, key)
    {
        var data = this.Get(key);
        if(!!data)
        {
            element.style.backgroundPosition = data.Left + " " + data.Bottom;
            element.style.width = data.Width;
            element.style.height = data.Height;
            if(element.style.display != "")
                element.style.display = "";
        }
    }
    return new SpriteLookup();
}
var spriteLookup_ = CreateSpriteLookup();
/************************************************************************/
/************************************************************************/
var CreateFrame = function(index,id,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,frameOffset,chainProjectile,imageOffsetX,imageOffsetY,attackState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    var Frame = function()
    {
        this.EnergyToAdd = energyToAdd || 0;
        this.Index = index;
        this.ID = +id; /* the "+" is a fast conversion to numeric*/
        this.ImageID = this.ID;
        this.HitID = hitID || 0;
        this.HitDelayFactor = hitDelayFactor || 1;
        this.ShadowImageSrc = !!shadowImage ? "images/misc/misc/shadow-" + shadowImage + ".png" : null;
        this.RightSrc = !!image ? image.replace("#-","l-").replace("x-","r-") : "";
        this.LeftSrc =  !!image ? image.replace("#-","r-").replace("x-","l-") : "";
        this.AttackState = attackState || 0;
        this.HitPoints = hitPoints || [];
        if(!!this.RightSrc && (this.RightSrc[0] != "|"))
            frameImages_.Load(this.RightSrc);
        if((this.RightSrc != this.LeftSrc) && (!!this.LeftSrc && this.LeftSrc[0] != "|"))
            frameImages_.Load(this.LeftSrc);

        this.RightSrc = this.RightSrc.replace("|","");
        this.LeftSrc  = this.LeftSrc.replace("|","");

        this.Frames = nbFrames || 0;
        this.FrameOffset = frameOffset || 0;

        this.FlagsToSet = new FrameFlags();
        this.FlagsToSet.Player = !!flagsToSet ? (flagsToSet.Player || 0) : 0;
        this.FlagsToSet.Pose = !!flagsToSet ? (flagsToSet.Pose || 0) : 0;
        this.FlagsToSet.Combat = !!flagsToSet ? (flagsToSet.Combat || 0) : 0;
        this.FlagsToSet.Spawn = !!flagsToSet ? (flagsToSet.Spawn || 0) : 0;
        this.FlagsToSet.MotionSound = !!flagsToSet ? (flagsToSet.MotionSound || 0) : 0;
        this.FlagsToSet.SwingSound = !!flagsToSet ? (flagsToSet.SwingSound || 0) : 0;
        this.FlagsToSet.HitSound = !!flagsToSet ? (flagsToSet.HitSound || 0) : 0;
        this.FlagsToSet.BlockSound = !!flagsToSet ? (flagsToSet.BlockSound || 0) : 0;

        this.FlagsToClear = new FrameFlags();
        this.FlagsToClear.Player = !!flagsToClear ? (flagsToClear.Player || 0) : 0;
        this.FlagsToClear.Pose = !!flagsToClear ? (flagsToClear.Pose || 0) : 0;
        this.FlagsToClear.Combat = !!flagsToClear ? (flagsToClear.Combat || 0) : 0;
        this.FlagsToClear.Spawn = !!flagsToClear ? (flagsToClear.Spawn || 0) : 0;
        this.FlagsToClear.SwingSound = !!flagsToClear ? (flagsToClear.SwingSound || 0) : 0;
        this.FlagsToClear.HitSound = !!flagsToClear ? (flagsToClear.HitSound || 0) : 0;
        this.FlagsToClear.BlockSound = !!flagsToClear ? (flagsToClear.BlockSound || 0) : 0;

        this.FlagsToSend = flagsToSend || MISC_FLAGS.NONE;
    
        this.Priority = priority || 0;
        this.BaseDamage = baseDamage || 0;
        this.X = x || 0;
        this.Y = y || 0;
        this.ImageOffsetX = imageOffsetX === 0 ? 0 : (imageOffsetX || null);
        this.ImageOffsetY = imageOffsetY === 0 ? 0 : (imageOffsetY || null);
        this.chainProjectile_ = chainProjectile;
        this.soundFilename_ = "";
        this.soundVolume_ = 1;

    }
    Frame.prototype.GetEndFrameOffset = function() { return this.Frames + this.FrameOffset; }
    Frame.prototype.GetImageSrc = function(direction){if(direction > 0) { return this.RightSrc; } else { return this.LeftSrc; } }
    return new Frame();
}
/************************************************************************/
/************************************************************************/
var CreateProjectile = function(player,animation,disintegrationAnimation, xOffset, yOffset, xSpeed, ySpeed, xFunc, yFunc, attackState, hitState, baseDamage, energyToAdd)
{
    var energyToAdd_ = energyToAdd || 0;
    var Projectile = function()
    {
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
        this.element_ = window.document.createElement("div");
        this.element_.className="projectile";
        this.element_.style.display="none";
        this.element_.style.backgroundImage = "url(images/misc/" + player.name_.toLowerCase() + "/projectiles.png)";
        window.document.getElementById("pnlStage").appendChild(this.element_);
        this.isActive_ = false;
        this.attackState_ = attackState || 0;
        this.hitState_ = hitState || 0;
        this.baseDamage_ = baseDamage || 0;
        this.flagsToSend_ = MISC_FLAGS.NONE;
        this.isDisintegrating_ = false;
        this.t_ = 0;
        this.VxFn = null;
        this.VyFn = null;
        this.nbHits_ = 0;
        this.maxHits_ = 1;
        this.hitStopFrameCount_ = CONSTANTS.DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT;
        this.lastHitFrame_ = 0;
        this.fx_ = 1;
        this.fy_ = 1;
        this.id_ = "" + Projectile.prototype.Count;
        this.canJuggle_ = false;
        this.trimX_ = 20;
        this.trimY_ = 70;
        ++Projectile.prototype.Count;
    }
    Projectile.prototype.SetEnergyToAdd = function(value) { energyToAdd_ = value; }
    Projectile.prototype.GetVxFunc = function() { return this.VxFn; }
    Projectile.prototype.SetVxFunc = function(value) { this.VxFn = value; }
    Projectile.prototype.GetVyFunc = function() { return this.VyFn; }
    Projectile.prototype.SetVyFunc = function(value) { this.VyFn = value; }
    Projectile.prototype.Count = 0;
    /*Stops the projectile*/
    Projectile.prototype.Cancel = function(ignoreOnGoneEvent)
    {
        this.element_.style.display="none";
        this.x_ = this.offsetX_;
        this.y_ = this.offsetY_;
        this.t_ = 0;
        this.isActive_ = false;
        this.isDisintegrating_ = false;
        if(!ignoreOnGoneEvent)
            this.owner_.onProjectileGoneFn_(this.id_);
    }

    Projectile.prototype.Release = function()
    {
        RemoveFromDOM(this.element_);
    }

    /*Fires the projectile*/
    Projectile.prototype.Throw = function(frame,stageX,stageY)
    {
        if(!!this.isDisintegrating_)
            this.Cancel();
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
        this.VxFn = (this.animation_.GetXModifier());
        this.VyFn = (this.animation_.GetYModifier());
        this.nbHits_ = 0;
        this.lastHitFrame_ = 0;
    }

    Projectile.prototype.GetTop = function()
    {
        return parseInt(this.element_.style.bottom) + parseInt(this.element_.style.height) - this.trimY_;
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
            return (parseInt(this.element_.style.width) + parseInt(this.element_.style.left)) - this.trimX_;
        else
            return (STAGE.MAX_STAGEX - (parseInt(this.element_.style.right) + parseInt(this.element_.style.width) - this.trimX_));
    }
    Projectile.prototype.GetLeftX = function() { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.x_ + parseInt(this.element_.style.width);}else{return this.x_;}}
    Projectile.prototype.GetRightX = function() { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.x_;}else{return this.x_ + parseInt(this.element_.style.width);}}
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
        this.element_.style.display = "none";
        ++this.t_;
        this.isActive_ = true;



        if(!this.IsInHitStop(frame))
        {
            if(!this.isDisintegrating_)
            {
                var xSpeed = this.VxFn(this.xSpeed_,this.t_);
                var ySpeed = this.VyFn(this.ySpeed_,this.t_);

                var dx = (xSpeed) + (this.direction_ > 0 ? (this.stageX_ - stageX) : (stageX - this.stageX_));
                var dy = (ySpeed) + (this.stageY_ - stageY);


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
                newFrame = this.animation_.BaseAnimation.frames_[0];
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

        this.SetSprite(newFrame,offsetX,offsetY,stageX,stageY);
        this.stageX_ = stageX;
        this.stageY_ = stageY;

        /*Allow players on the other team to deal with projectile coming toward them.*/
        this.owner_.OnProjectileMoved(this.id_,this.GetMidX(),this.GetMidY());

        return this;
    }


    /*sets and moves the image - for browsers that load preloaded images instantly when the src property is set*/
    Projectile.prototype.SetSprite = function(newFrame,offsetX,offsetY,stageX,stageY)
    {
        if(!!newFrame)
        {
            offsetX = newFrame.X;
            offsetY = newFrame.Y;

            if(this.direction_ > 0)
            {
                var data = spriteLookup_.Get(newFrame.RightSrc)
                if(!!data && (this.element_.style.backgroundPositionX != data.Left))
                {
                    this.element_.style.width = data.Width;
                    this.element_.style.height = data.Height;
                    this.element_.style.backgroundPosition = data.Left + " " + data.Bottom;
                }

            }
            else
            {

                var data = spriteLookup_.Get(newFrame.LeftSrc)
                if(!!data && (this.element_.style.backgroundPositionX != data.Left))
                {
                    this.element_.style.width = data.Width;
                    this.element_.style.height = data.Height;
                    this.element_.style.backgroundPosition = data.Left + " " + data.Bottom;
                }

            }
        }

        if(this.isDisintegrating_)
        {
            if(this.direction_ > 0)
            {
                this.element_.style.left = (offsetX + FlipCoord(this.x_,parseInt(this.element_.style.width))) + "px";
                this.element_.style.right = "";
            }
            else
            {
                this.element_.style.right = (offsetX + FlipCoord(this.x_,parseInt(this.element_.style.width))) + "px";
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
        var imgOffsetY = this.y_ - (parseInt(this.element_.style.height)/2);
        this.element_.style.bottom = imgOffsetY + "px";
        if(this.element_.style.display != "")
            this.element_.style.display="";
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
    return new Projectile();
}
var FlipCoord = function(x,width)
{
    return STAGE.MAX_STAGEX - (x + width);
}
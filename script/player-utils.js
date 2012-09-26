
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
Key.prototype.handleKey = function(keyCode)
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
        this.ChainOnHitAnimation = null;
        this.ChainAnimationFrame = 0;
        this.ChainOnHitAnimationFrame = 0;
        this.GrappleDistance = 0;
        this.IsImplicit = false;
        this.Priority = priority || 100;
        this.Vx = 0;
        this.Vy = 0;
        this.chainVxFn = function(x) { return x; };
        this.chainVyFn = function(y) { return y; };
        this.vyFn = function(a) {return function(b) {return b}};
        this.vxFn = function(a) {return function(b) {return b}};
        this.vyAirFn = function(a) {return function(b) {return b}};
        this.vxAirFn = function(a) {return function(b) {return b}};
        this.EnergyToAdd = energyToAdd || 0;
        this.EnergyToSubtract = 0;
        this.InvokedAnimationName = invokedAnimationName || "";
        this.ControllerAnimation = null;
        this.Trail = null;
        this.Animations = [];
        this.AllowJuggle = false;
        this.IgnoresCollisions = false;
        this.OtherPlayerAirborneFlags;
        this.IsThrow = false;
        this.IsSuperMove = false;
        this.IsSpecialMove = false;
        this.MaxNbHits = CONSTANTS.MAX_NBHITS;

        this.Flags = {};
        this.RequiredFlags = requiredFlags;
        this.BehaviorFlags = behaviorFlags || 0;
        this.OverrideFlags = new MoveOverrideFlags();
        this.KeepAirborneFunctions = false;
        this.UseJumpSpeed = false;

        this.VyAirFnArgs = {};
        this.VxAirFnArgs = {};
        this.VxFnArgs = {};
        this.VyFnArgs = {};

        this.UserData = null;
        this.InteruptAnimation = null;
        this.InteruptAnimationFlags = null;
        this.IgnoreDepressedKeys = false;
        /*by setting the following value, the jump will start at a different point. It is almost like skipping frames to a certain point in a jump.*/
        this.NbFramesAirborneAdvance = 0;
        /*by setting the following value the initial jump Y position will be set*/
        this.AirborneStartDeltaY = 0;
        this.MaintainYPosition = false;
    }

    Animation.prototype.getAlternateKeySequencesLength = function() { return this.AlternateKeySequences.length; }
    Animation.prototype.getAlternateKeySequenceLength = function(i) { return this.AlternateKeySequences[i].length; }
    Animation.prototype.getAlternateKeySequence = function(i,j) { return !!+this.AlternateKeySequences[i][j] ? ((this.AlternateKeySequences[i][j] | BUTTONS.CHARGE | BUTTONS.EXACT) ^ (BUTTONS.CHARGE | BUTTONS.EXACT)) : this.AlternateKeySequences[i][j]; }
    Animation.prototype.setAlternateKeySequence = function(i,value) { return this.AlternateKeySequences[i] = value; }
    Animation.prototype.getKeySequenceLength = function() { return this.KeySequence.length; }
    Animation.prototype.checkKey = function(index, userKey, userKeys)
    {
        var thisKey = this.getKey(index);
        var chargeCheck = this.mustChargeKey(index);
        if(!chargeCheck || (userKey.NbFrames > CONSTANTS.NBCHARGE_FRAMES))
        {
            var userKeyStripped = this.stripAttackKeys(userKey.Bit);
            var thisKeyStripped = this.stripAttackKeys(thisKey);

            var userAtackKeys = this.stripDirectionKeys(userKey.Bit);
            var thisAtackKeys = this.stripDirectionKeys(thisKey);

            /*attack keys must match*/
            if((!!userAtackKeys || !!thisAtackKeys) && !hasFlag(userAtackKeys,thisAtackKeys))
            {
                return false;
            }

            if(!userKey.Bit && !thisKey)
            {
                return true;
            }
            else if((thisKey & userKey.Bit) == thisKey)
            {
                return true;
            }
        }

        return false;
    }
    Animation.prototype.compareKeySequenceLength = function(length)
    {
        return (this.KeySequence.length == length) || (!!this.IgnoreDepressedKeys && (this.KeySequence.length <= length));
    }
    Animation.prototype.filterKeySequence = function(userKeys)
    {
        if(!!this.IgnoreDepressedKeys && (userKeys.length > 0))
        {
            /*there must be enough keys in the array to see if every key is there*/
            /*the first and last keys must match*/
            if((userKeys.length == this.KeySequence.length || userKeys.length > this.KeySequence.length) && this.checkKey(0,userKeys[0],userKeys) && (this.checkKey(keySequence.length-1,userKeys[userKeys.length - 1],userKeys)))
            {
                var retVal = [];
                var keysIndex = -1;
                var keysSequenceIndex = 0;
                var lastDirKey = 0;
                var lastUserDirKey = 0
                var dirKey = 0;
                var userDirKey = 0
                /*check if the users userKeys all exist in the keySequence, in order*/
                while(++keysIndex < userKeys.length)
                {
                    /*if the user key is not equal to the current keySequence, then check the next user key against the key in this move's sequence*/
                    /*if they are equal, then move on to the next key in both sequences*/
                    if(this.checkKey(keysSequenceIndex,userKeys[keysIndex],userKeys))
                    {
                        dirKey = this.stripAttackKeys(this.getKey(keysSequenceIndex));
                        userDirKey = this.stripAttackKeys(userKeys[keysIndex].Bit);
                        if(keysIndex > 0)
                        {
                            if((dirKey != lastDirKey) && (userDirKey == lastUserDirKey))
                            {
                                continue;
                            }
                        }

                        lastDirKey = dirKey;
                        lastUserDirKey = userDirKey;

                        ++keysSequenceIndex;
                        retVal.push(userKeys[keysIndex]);

                    }
                }

                /*if all of the userKeys were found, in order, then return the exact match (retVal)*/
                if(keysSequenceIndex == this.KeySequence.length)
                {
                    return {Keys:retVal,Match:CONSTANTS.EXACT_MATCH};
                }
            }
        }

        return {Keys:userKeys,Match:0};
    }
    /*uses bitwise operations to strip the attack keys from the bit pattern*/
    Animation.prototype.stripAttackKeys = function(bit)
    {
        return (bit | BUTTONS.LIGHT_PUNCH
                    | BUTTONS.MEDIUM_PUNCH
                    | BUTTONS.HARD_PUNCH
                    | BUTTONS.LIGHT_KICK
                    | BUTTONS.MEDIUM_KICK
                    | BUTTONS.HARD_KICK
                    | BUTTONS.SELECT
                    | BUTTONS.START
                    | BUTTONS.TURN_AROUND
                    | BUTTONS.EXACT
                    | BUTTONS.CHARGE
                    )
                    ^ BUTTONS.LIGHT_PUNCH
                    ^ BUTTONS.MEDIUM_PUNCH
                    ^ BUTTONS.HARD_PUNCH
                    ^ BUTTONS.LIGHT_KICK
                    ^ BUTTONS.MEDIUM_KICK
                    ^ BUTTONS.HARD_KICK
                    ^ BUTTONS.SELECT
                    ^ BUTTONS.START
                    ^ BUTTONS.TURN_AROUND
                    ^ BUTTONS.EXACT
                    ^ BUTTONS.CHARGE
                    ;
    }
    /*uses bitwise operations to strip the direction keys from the bit pattern*/
    Animation.prototype.stripDirectionKeys = function(bit)
    {
        return (bit | BUTTONS.JUMP
                    | BUTTONS.FORWARD
                    | BUTTONS.BACK
                    | BUTTONS.CROUCH
                    | BUTTONS.SELECT
                    | BUTTONS.START
                    | BUTTONS.TURN_AROUND
                    | BUTTONS.EXACT
                    | BUTTONS.CHARGE
                    )
                    ^ BUTTONS.JUMP
                    ^ BUTTONS.FORWARD
                    ^ BUTTONS.BACK
                    ^ BUTTONS.CROUCH
                    ^ BUTTONS.SELECT
                    ^ BUTTONS.START
                    ^ BUTTONS.TURN_AROUND
                    ^ BUTTONS.EXACT
                    ^ BUTTONS.CHARGE
                    ;
    }
    Animation.prototype.hasAttackKeys = function(index)
    {
        return hasFlag(this.KeySequence[index],BUTTONS.LIGHT_PUNCH) 
            ? true : hasFlag(this.KeySequence[index],BUTTONS.MEDIUM_PUNCH) 
            ? true : hasFlag(this.KeySequence[index],BUTTONS.HARD_PUNCH) 
            ? true : hasFlag(this.KeySequence[index],BUTTONS.LIGHT_KICK) 
            ? true : hasFlag(this.KeySequence[index],BUTTONS.MEDIUM_KICK) 
            ? true : hasFlag(this.KeySequence[index],BUTTONS.HARD_KICK) 
            ;
    }
    Animation.prototype.keyHasAttackKeys = function(key)
    {
        return hasFlag(key.Bit,BUTTONS.LIGHT_PUNCH) 
            ? true : hasFlag(key.Bit,BUTTONS.MEDIUM_PUNCH) 
            ? true : hasFlag(key.Bit,BUTTONS.HARD_PUNCH) 
            ? true : hasFlag(key.Bit,BUTTONS.LIGHT_KICK) 
            ? true : hasFlag(key.Bit,BUTTONS.MEDIUM_KICK) 
            ? true : hasFlag(key.Bit,BUTTONS.HARD_KICK) 
            ;
    }
    Animation.prototype.getKey = function(index) { return !!+this.KeySequence[index] ? ((this.KeySequence[index] | BUTTONS.CHARGE | BUTTONS.EXACT) ^ (BUTTONS.CHARGE | BUTTONS.EXACT)) : this.KeySequence[index]; }
    Animation.prototype.mustChargeKey = function(index) { return !!+this.KeySequence[index] ? (hasFlag(this.KeySequence[index],BUTTONS.CHARGE)) : false; }
    Animation.prototype.mustChargeAlternateKey = function(i,j) { return !!+this.AlternateKeySequences[i][j] ? (hasFlag(this.AlternateKeySequences[i][j],BUTTONS.CHARGE)) : false; }
    Animation.prototype.mustMatchExactKey = function(index) { return !!+this.KeySequence[index] ? (hasFlag(this.KeySequence[index],BUTTONS.EXACT)) : false; }
    Animation.prototype.mustMatchExactAlternateKey = function(i,j) { return !!+this.AlternateKeySequences[i][j] ? (hasFlag(this.AlternateKeySequences[i][j],BUTTONS.EXACT)) : false; }

    Animation.prototype.getXModifier = function() { return this.xModifier(this.VxFnArgs); }
    Animation.prototype.getYModifier = function() { return this.yModifier(this.VyFnArgs); }
    Animation.prototype.getAirYModifier = function() { return this.airYModifier(this.VyAirFnArgs); }
    Animation.prototype.getAirXModifier = function() { return this.airXModifier(this.VxAirFnArgs); }
    Animation.prototype.xModifier = function(args) { return this.vxFn(args); }
    Animation.prototype.yModifier = function(args) { return this.vyFn(args); }
    Animation.prototype.airYModifier = function(args) { return this.vyAirFn(args); }
    Animation.prototype.airXModifier = function(args) { return this.vxAirFn(args); }
    Animation.prototype.setOtherPlayerAirborneFlags = function(flags) { this.OtherPlayerAirborneFlags = flags; }
    Animation.prototype.getOtherPlayerAirborneFlags = function() { return this.OtherPlayerAirborneFlags; }
    Animation.prototype.isAttack = function() { return this.BaseAnimation.IsAttack; }

    Animation.prototype.endBlock = function()
    {
        this.BaseAnimation.SkipFrameBlockCheck = true;
        this.BaseAnimation.CanAddStopBlock = true;
        this.BaseAnimation.SetFramesToVulnerable = true;
    }

    Animation.prototype.addAlternateKeySequence = function(sequence)
    {
        this.AlternateKeySequences[this.AlternateKeySequences.length] = sequence;
    }

    Animation.prototype.chain = function(move,frameOffset)
    {
        this.ChainAnimation = (move);
        this.ChainAnimationFrame = (frameOffset || 0);
    }

    Animation.prototype.chainOnHit = function(move,frameOffset)
    {
        this.ChainOnHitAnimation = (move);
        this.ChainOnHitAnimationFrame = (frameOffset || 0);
    }
   
    Animation.prototype.allowInterupt = function(move,frameOffset,flags)
    {
        this.InteruptAnimation = move;
        this.ChainAnimationFrame = (frameOffset || 0);
        this.InteruptAnimationFlags = flags;
    }

    Animation.prototype.addAnimation = function(animation)
    {
        this.Animations.push(animation);
    }

    Animation.prototype.addFrameWithSound = function(player,volume,soundFilename,shadowOffsetX,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd,slideForce,slideFactor)
    {
        this.IgnoresCollisions = !!flagsToSet && hasFlag(flagsToSet.Player,PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.addFrameWithSound.apply(this.BaseAnimation,arguments);
    }

    Animation.prototype.addFrame = function(player,shadowOffsetX,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd,slideForce,slideFactor)
    {
        this.IgnoresCollisions = !!flagsToSet && hasFlag(flagsToSet.Player,PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.addFrame.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.addOffsetFrame = function(player,shadowOffsetX,shadowImage,image,nbFrames,x,y)
    {
        return this.BaseAnimation.addOffsetFrame.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.addRepeatingFrameWithSound = function(player,volume,soundFilename,shadowOffsetX,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd,slideForce,slideFactor)
    {
        this.IgnoresCollisions = !!flagsToSet && hasFlag(flagsToSet.Player,PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.addRepeatingFrameWithSound.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.addRepeatingFrame = function(player,shadowOffsetX,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energytoAdd,slideForce,slideFactor)
    {
        this.IgnoresCollisions = !!flagsToSet && hasFlag(flagsToSet.Player,PLAYER_FLAGS.IGNORE_COLLISIONS);
        return this.BaseAnimation.addRepeatingFrame.apply(this.BaseAnimation,arguments);
    }
    Animation.prototype.getNextFrameOffset = function(id) { return this.BaseAnimation.getNextFrameOffset.apply(this.BaseAnimation,arguments); }
    Animation.prototype.getFrame = function(frameDelta)
    {
        if(!!this.ControllerAnimation && !!this.ControllerAnimation.Animation)
        {
            var index = this.ControllerAnimation.FrameIndex;
            if(index > -1)
                return this.BaseAnimation.Frames[index];
        }
        else
            return this.BaseAnimation.getFrame.apply(this.BaseAnimation,arguments);

        return null;
    }
    Animation.prototype.getFrameIndex  = function(id) { return this.BaseAnimation.getFrameIndex(id); }
    Animation.prototype.setGrappleDistance = function(x)
    {
        this.GrappleDistance = x;
        this.BehaviorFlags = BEHAVIOR_FLAGS.THROW;
        this.IsThrow = true;
    }
    Animation.prototype.addUserDataToFrame = function(index,data)
    {
        var frame = this.BaseAnimation.Frames[index];
        frame.UserData[frame.UserData.length] = data;
    }
    Animation.prototype.clearAllFrameUserData = function()
    {
        for(var i = 0,length = this.BaseAnimation.Frames.length; i < length; ++i)
            this.BaseAnimation.Frames[i].UserData = [];
    }

    Animation.prototype.setMediumAttack = function()
    {
        this.EnergyToAdd = (2);
    }

    Animation.prototype.setHardAttack = function()
    {
        this.EnergyToAdd = (3);
    }

    Animation.prototype.renderChildren = function(frame,startFrame,direction,zIndex,x,y)
    {
        for(var i = 0,length = this.Animations.length; i < length; ++i)
            this.Animations[i].tryRender(frame,{StartFrame:startFrame,ZIndex:zIndex,X:x,Y:y},direction);
    }

    Animation.prototype.hideChildren = function()
    {
        for(var i = 0,length = this.Animations.length; i < length; ++i)
            this.Animations[i].hide();
    }

    return new Animation();
}
/************************************************************************/
/************************************************************************/
var CreateGenericAnimation = function(name,frames,moveFlags,requiredState,state,centeredOffset,topOffset,isLooping)
{
    var GenericAnimation = function()
    {
        this.BaseAnimation = CreateBaseAnimation(frames,name,false);
        this.State = state || 0;
        this.MoveFlags = moveFlags || 0;
        this.RequiredFlags = requiredState || 0;
        this.InitialX = 0;
        this.InitialStageX = 0;
        this.InitialPlayerX = 0;
        this.InitialY = 0;
        this.InitialStageY = 0;
        this.InitialPlayerY = 0;
        this.IsActive = false;
        this.Direction = 0;
        this.CenteredOffset = centeredOffset;
        this.TopOffset = topOffset;
        this.IsLooping = isLooping || false;
        this.InternalFrame = 0;
    }
    GenericAnimation.prototype.reset = function()
    {
        this.InternalFrame = 0;
    }
    GenericAnimation.prototype.hasUserData = function(index)
    {
        var frame = this.BaseAnimation.Frames[index];
        return !!frame.UserData && (frame.UserData.length > 0);
    }
    GenericAnimation.prototype.addUserDataToFrame = function(index,data)
    {
        var frame = this.BaseAnimation.Frames[index];
        if(!!frame)
            frame.UserData[frame.UserData.length] = data;
    }
    GenericAnimation.prototype.clearAllFrameUserData = function()
    {
        for(var i = 0,length = this.BaseAnimation.Frames.length; i < length; ++i)
            this.BaseAnimation.Frames[i].UserData = [];
    }

    GenericAnimation.prototype.addFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.BaseAnimation.addFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.addRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints) { return this.BaseAnimation.addRepeatingFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.addTrailFrame = function(player,image,nbFrames)
    {
        return this.BaseAnimation.addFrame(player,0,null,image,nbFrames);
    }
    GenericAnimation.prototype.addRepeatingTrailFrame = function(player,image,nbFrames)
    {
        return this.BaseAnimation.addRepeatingFrame(player,0,null,image,nbFrames);
    }
    GenericAnimation.prototype.getFrame = function(frameDelta) { return this.BaseAnimation.getFrame.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.getNextFrameOffset = function(id) { return this.BaseAnimation.getNextFrameOffset.apply(this.BaseAnimation,arguments); }
    GenericAnimation.prototype.tryRender = function(frame,startFrame,element,stageX,stageY,playerX,playerY,playerWidth)
    {
        var offsetX = 0;
        var offsetY = 0;
        var delta = 0;
        if(!!this.IsLooping)
        {
            if(this.InternalFrame > this.BaseAnimation.NbFrames)
                this.InternalFrame = 0;
            delta = this.InternalFrame++;
        }
        else
            delta = frame - startFrame;

        var newFrame = this.getFrame(delta);
        if(!newFrame)
        {
            /*free the element so it can be reused in other animations*/
            element.style.display="none";
            element.isInUse = false;
            this.IsActive = false;
            return false;
        }
        else
        {
            if(element.style.display != "")
                element.style.display = "";
            offsetX = newFrame.X;
            offsetY = newFrame.Y;

            if(!!this.CenteredOffset)
                offsetX = playerWidth * this.CenteredOffset;
            if(!!this.TopOffset)
                offsetY = this.TopOffset;

            var data = spriteLookup_.get(newFrame.RightSrc)
            if(!!data && (element.style.backgroundPositionX != data.Left))
            {
                element.style.backgroundPosition = data.Left + " " + data.Bottom;
                element.style.width = data.Width;
                element.style.height = data.Height;
            }
            AutoApplyFlip(element,this.Direction == -1);
            if(this.Direction > 0)
            {
                /*move the image to the middle of the point*/
                offsetX -= (parseInt(element.style.width)/2);
                offsetY -= (parseInt(element.style.height)/2);
            }
            else
            {
                /*move the image to the middle of the point*/
                offsetX -= (parseInt(element.style.width)/2);
                offsetY -= (parseInt(element.style.height)/2);
            }

            if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_TO_PLAYER))
            {
                offsetX += playerX;
                offsetY += playerY;
            }
            else if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_WITH_PLAYER))
            {
                offsetX += playerX - this.InitialPlayerX;
                offsetY += playerY - this.InitialPlayerY;
            }
        }
        /*Must add the change in stageX to the position to keep the animation in one place on the screen,
         unless the animation must move with the player - in which case we disregard the stageX*/
        if(this.Direction > 0)
        {
            element.style.left = "";
            if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_TO_PLAYER))
                element.style.right = offsetX + "px";
            else if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_WITH_PLAYER))
                element.style.right = (offsetX + this.InitialX) + "px";
            else
                element.style.right = (offsetX + this.InitialX + (this.InitialStageX - stageX)) + "px";
        }
        else
        {
            element.style.right = "";
            if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_TO_PLAYER))
                element.style.left = offsetX + "px";
            else if(hasFlag(this.MoveFlags,MOVE_FLAGS.MOVE_WITH_PLAYER))
                element.style.left = (offsetX + this.InitialX) + "px";
            else
                element.style.left = (offsetX + this.InitialX  - (this.InitialStageX - stageX)) + "px";
        }
        element.style.bottom = (offsetY + this.InitialY + (stageY - this.InitialStageY)) + "px";
        return true;
    }
    return new GenericAnimation();
}
/************************************************************************/
/************************************************************************/
var CreateBasicAnimation = function(name,frames,isLooping,direction,bgImg)
{
    var BasicAnimation = function()
    {
        this.BaseAnimation = CreateBasicBaseAnimation(frames,name);
        this.IsLooping = isLooping || false;
        this.InternalFrame = 0;
        this.Direction  = direction || 0;
        this.InitialStageY = 0;
        if(!!bgImg)
            this.createElement(bgImg);
    }

    BasicAnimation.prototype.count = 0;

    BasicAnimation.prototype.createElement = function(bgImg)
    {
        this.Element = window.document.createElement("div");
        this.Element.className = "basic-animation";
        this.Element.style.display = "none";
        this.Element.style.backgroundImage = "url(" + bgImg + ")";
        window.document.getElementById("pnlStage").appendChild(this.Element);
    }

    BasicAnimation.prototype.getFrame = function(frameDelta)
    {
        return this.BaseAnimation.getFrame.apply(this.BaseAnimation,arguments);
    }

    BasicAnimation.prototype.addEmptyFrame = function(owner,nbFrames)
    {
        this.BaseAnimation.addEmptyFrame.apply(this.BaseAnimation,arguments);
    }

    BasicAnimation.prototype.addFrame = function(owner,image,nbFrames)
    {
        this.BaseAnimation.addFrame.apply(this.BaseAnimation,arguments);
    }

    BasicAnimation.prototype.hide = function()
    {
        if(!!this.Element)
            this.Element.style.display = "none";
    }

    BasicAnimation.prototype.tryRender = function(frame,object,direction)
    {
        direction = direction || this.Direction;
        var element = this.Element || object.Element;
        var startFrame = object.StartFrame;
        AutoApplyFlip(element,direction == -1);

        var offsetX = object.X || 0;
        var offsetY = object.Y || 0;
        if(!!object.ZIndex)
            element.style.zIndex = object.ZIndex;
        var delta = 0;
        if(!!this.IsLooping)
        {
            if(this.InternalFrame > this.BaseAnimation.NbFrames)
                this.InternalFrame = 0;
            delta = this.InternalFrame++;
        }
        else
            delta = frame - startFrame;

        var newFrame = this.getFrame(delta);
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
            var data = spriteLookup_.get(newFrame.RightSrc)
            if(!!data && (element.style.backgroundPositionX != data.Left))
            {
                element.style.backgroundPosition = data.Left + " " + data.Bottom;
                /*element.style.backgroundImage = "url(" + data.Sprite + ")";*/
                element.style.width = data.Width;
                element.style.height = data.Height;
            }
            if(direction > 0)
            {
                if(offsetX != undefined)
                {
                    element.style.left = "";
                    element.style.right = offsetX + "px";
                }
            }
            else
            {
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
        this.Data = {}
    }
    
    FrameImageLookup.prototype.getNbImages = function() { return nbImages_; }
    FrameImageLookup.prototype.getNbImagesLoading = function() { return nbImagesLoading_; }
    FrameImageLookup.prototype.getElement = function() { return element_; }
    FrameImageLookup.prototype.loadBase64Audio = function(key,value)
    {
        if(!this.Data[key])
        {
            this.Data[key] = value;
        }
        else
        {
            return null;
        }
    }
    
    /*Image only loaded once*/
    FrameImageLookup.prototype.load = function(src)
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
                    if(!!--thisValue.NbImagesLoading)
                    {
                        thisValue.getElement().innerHTML = (100*(thisValue.getNbImages()-thisValue.getNbImagesLoading())/thisValue.getNbImages()).toFixed(1);
                    }
                    else
                    {
                        thisValue.getElement().innerHTML = "100";
                    }
                }
            })(this);
            images_[src].src = src;
        }
        return images_[src];
    }
    FrameImageLookup.prototype.get = function(src)
    {
        return images_[src];
    }
    FrameImageLookup.prototype.getBgB64 = function(element,src)
    {
        element.style.backgroundImage = this.getB64(src,true);
    }
    FrameImageLookup.prototype.getB64 = function(src,isBg)
    {
        if(!!isBg)
            return "url('" + this.Data[src] + "')";
        else
            return this.Data[src];
    }
    return new FrameImageLookup();
}
var imageLookup_ = CreateFrameImageLookup();
/************************************************************************/
/************************************************************************/
var CreateSpriteLookup = function()
{
    var nbImages_ = 0;
    var nbImagesLoading_ = 0;
    var element_ = window.document.getElementById("spnImagesLoading");
    
    
    var SpriteLookup = function()
    {
        this.Data = {};
    }
    
    /*Image only loaded once*/
    SpriteLookup.prototype.load = function(key,src,left,bottom,width,height)
    {
        src = src.replace("|","");
    
        if(!this.get(key))
        {
            this.Data[key] = {Key:key,Sprite:src,Left:left,Bottom:bottom,Width:width,Height:height,WidthInt:parseInt(width),HeightInt:parseInt(height)};
        }
        return this.Data[key];
    }
    SpriteLookup.prototype.get = function(key)
    {
        return this.Data[key];
    }
    SpriteLookup.prototype.getLeft = function(key)
    {
        return (this.Data[key] || {}).Left || "";
    }
    SpriteLookup.prototype.set = function(element,key,setBackgroundImage,displayNone,isBase64)
    {
        var data = this.get(key);
        if(!!data)
        {
            if(!!setBackgroundImage)
            {
                if(!isBase64)
                {
                    if(!element.style.backgroundImage)
                        element.style.backgroundImage = "url(" + data.Sprite + ")";
                }
                else
                {
                    if(!element.style.backgroundImage)
                        element.style.backgroundImage = "url(" + imageLookup_.Data[data.Sprite] + ")";
                }
            }
            if(element.style.backgroundPosition != data.Left + " " + data.Bottom)
            {
                element.style.backgroundPosition = data.Left + " " + data.Bottom;
                element.style.width = data.Width;
                element.style.height = data.Height;
                if(!displayNone && (element.style.display != ""))
                    element.style.display = "";
            }
        }
    }
    return new SpriteLookup();
}
var spriteLookup_ = CreateSpriteLookup();
/************************************************************************/
/************************************************************************/
var CreateFrame = function(index,id,shadowOffsetX,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,frameOffset,chainProjectile,imageOffsetX,imageOffsetY,attackFlags,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd,slideForce,slideFactor)
{
    var Frame = function()
    {
        this.SlideForce = slideForce || 0;
        this.SlideFactor = slideFactor || 1;
        this.EnergyToAdd = energyToAdd || 0;
        this.Index = index;
        this.ID = +id; /* the "+" is a fast conversion to numeric*/
        this.ImageID = this.ID;
        this.HitID = hitID || 0;
        this.HitDelayFactor = hitDelayFactor || 1;
        this.ShadowImageSrc = !!shadowImage ? "images/misc/misc/shadow-" + shadowImage + ".png" : null;
        this.ShadowOffsetX = shadowOffsetX || 0;
        this.IsFlipped = image.indexOf("#") > -1;
        this.RightSrc = !!image ? image.replace("#-","r-").replace("x-","r-") : "";
        this.LeftSrc =  !!image ? image.replace("#-","l-").replace("x-","l-") : "";
        this.AttackFlags = attackFlags || 0;
        this.HitPoints = hitPoints || [];

        this.RightSrc = this.RightSrc.replace("|","");
        this.LeftSrc  = this.LeftSrc.replace("|","");

        this.Frames = nbFrames || 0;
        this.FrameOffset = frameOffset || 0;

        this.FlagsToSet = new FrameFlags();
        this.FlagsToSet.Clip = !!flagsToSet ? (flagsToSet.Clip || null) : null;
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
        this.Vulnerable = false;
        this.ChainProjectile = chainProjectile;
        this.SoundFilename = "";
        this.SoundVolume = 1;

    }
    Frame.prototype.getEndFrameOffset = function() { return this.Frames + this.FrameOffset; }
    Frame.prototype.getImageSrc = function(direction){ return this.RightSrc; }
    Frame.prototype.isSettingAirborneFlag = function()  { return hasFlag(this.FlagsToSet.Pose,POSE_FLAGS.AIR_COMBO_1) || hasFlag(this.FlagsToSet.Pose,POSE_FLAGS.AIR_COMBO_2) || hasFlag(this.FlagsToSet.Pose,POSE_FLAGS.AIRBORNE) || hasFlag(this.FlagsToSet.Pose,POSE_FLAGS.AIRBORNE_FB) }
    Frame.prototype.isClearingAirborneFlag = function() { return hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIR_COMBO_1) || hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIR_COMBO_2) || hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIRBORNE) || hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIRBORNE_FB) }
    Frame.prototype.isClearingAirborne = function() { return hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIRBORNE) || hasFlag(this.FlagsToClear.Pose,POSE_FLAGS.AIRBORNE_FB) }
    return new Frame();
}
/************************************************************************/
/************************************************************************/
var CreateProjectile = function(player,animation,disintegrationAnimation,xOffset,yOffset,xSpeed,ySpeed,xFunc,yFunc,attackFlags,hitState,baseDamage,energyToAdd)
{
    var energyToAdd_ = energyToAdd || 0;
    var Projectile = function()
    {
        this.Owner = player;
        this.Animation = animation;
        this.DisintegrationAnimation = disintegrationAnimation;
        this.OffsetX = xOffset;
        this.OffsetY = yOffset;
        this.InitialX = xOffset;
        this.InitialY = yOffset;
        this.X = xOffset;
        this.Y = yOffset;
        this.XSpeed = xSpeed || 1;
        this.YSpeed = ySpeed || 0;
        this.XFunc = xFunc || function(y){return this.XSpeed * 3;}
        this.YFunc = yFunc || function(x){return this.YSpeed * 1;}
        this.Direction = player.Direction;
        this.StartFrame = 0;
        this.Element = window.document.createElement("div");
        this.Element.className="projectile";
        this.Element.style.display="none";
        window.document.getElementById("pnlStage").appendChild(this.Element);
        this.IsActive = false;
        this.AttackState = attackFlags || 0;
        this.HitState = hitState || 0;
        this.BaseDamage = baseDamage || 0;
        this.FlagsToSend = MISC_FLAGS.NONE;
        this.IsDisintegrating = false;
        this.T = 0;
        this.vxFn = null;
        this.vyFn = null;
        this.NbHits = 0;
        this.MaxHits = 1;
        this.HitStopFrameCount = CONSTANTS.DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT;
        this.LastHitFrame = 0;
        this.Fx = 1;
        this.Fy = 1;
        this.Id = "" + Projectile.prototype.count;
        this.CanJuggle = false;
        this.TrimX = 20;
        this.TrimY = 70;
        ++Projectile.prototype.count;
    }
    Projectile.prototype.setEnergyToAdd = function(value) { energyToAdd_ = value; }
    Projectile.prototype.getVxFn = function() { return this.vxFn; }
    Projectile.prototype.setVxFn = function(value) { this.vxFn = value; }
    Projectile.prototype.getVyFn = function() { return this.vyFn; }
    Projectile.prototype.setVyFn = function(value) { this.vyFn = value; }
    Projectile.prototype.count = 0;
    /*Stops the projectile*/
    Projectile.prototype.cancel = function(ignoreOnGoneEvent)
    {
        this.Element.style.display="none";
        this.X = this.OffsetX;
        this.Y = this.OffsetY;
        this.T = 0;
        this.IsActive = false;
        this.IsDisintegrating = false;
        if(!ignoreOnGoneEvent)
            this.Owner.onProjectileGoneFn(this.Id);
    }

    Projectile.prototype.release = function()
    {
        utils_.removeFromDOM(this.Element);
    }

    /*Fires the projectile*/
    Projectile.prototype.execute = function(frame,stageX,stageY)
    {
        if(!!this.IsDisintegrating)
            this.cancel();
        this.StartFrame = frame;
        this.T = 0;
        this.Element.style.display="none";
        this.Direction = this.Owner.Direction;
        if(this.Direction == -1)
            this.Element.className="projectile flipped";
        else
            this.Element.className="projectile";

        this.X += this.Owner.getX();
        this.Y += this.Owner.getY();
        this.StageX = stageX;
        this.StageY = stageY;
        this.IsActive = true;
        this.IsDisintegrating = false;
        this.vxFn = (this.Animation.getXModifier());
        this.vyFn = (this.Animation.getYModifier());
        this.NbHits = 0;
        this.LastHitFrame = 0;
    }

    Projectile.prototype.getTop = function()
    {
        return parseInt(this.Element.style.bottom) + parseInt(this.Element.style.height) - this.TrimY;
    }

    Projectile.prototype.getBottom = function()
    {
        return parseInt(this.Element.style.bottom) + this.TrimY;
    }

    Projectile.prototype.getBackX = function()
    {
        if(this.Direction < 0)
            return parseInt(this.Element.style.left) + (this.TrimX);
        else
            return STAGE.MAX_STAGEX - (parseInt(this.Element.style.right) + (this.TrimX));
    }

    Projectile.prototype.getFrontX = function()
    {
        if(this.Direction  < 0)
            return (parseInt(this.Element.style.width) + parseInt(this.Element.style.left)) - this.TrimX;
        else
            return (STAGE.MAX_STAGEX - (parseInt(this.Element.style.right) + parseInt(this.Element.style.width) - this.TrimX));
    }
    Projectile.prototype.getLeftX = function() { if(this.Direction > 0){return STAGE.MAX_STAGEX - this.X + parseInt(this.Element.style.width);}else{return this.X;}}
    Projectile.prototype.getRightX = function() { if(this.Direction > 0){return STAGE.MAX_STAGEX - this.X;}else{return this.X + parseInt(this.Element.style.width);}}
    Projectile.prototype.getMidX = function()
    {
        var left = this.getBackX();
        var right = this.getFrontX();

        return right - ((right-left)/2);
    }
    Projectile.prototype.getMidY = function()
    {
        var bottom = this.getBottom();
        var top = this.getTop();

        return top - ((top-bottom)/2);
    }

    /*Is the projectile active?*/
    Projectile.prototype.getIsActive = function()
    {
        if(this.getIsDisintegrating())
            return false;
        return this.IsActive;
    }

    /*Is the projectile active?*/
    Projectile.prototype.getIsDisintegrating = function()
    {
        return this.IsDisintegrating;
    }

    /*Is the projectile still visible?*/
    Projectile.prototype.isVisible = function(stageX,stageY)
    {
        return (this.X < STAGE.MAX_STAGEX && this.X > -100) && (this.Y > 0 && this.Y < 1000);
    }


    Projectile.prototype.canHit = function(frame)
    {
        return !this.IsDisintegrating && ((!this.LastHitFrame) || (frame > (this.LastHitFrame + this.HitStopFrameCount)));
    }

    Projectile.prototype.isInHitStop = function(frame)
    {
        return ((!!this.LastHitFrame) && (frame < (this.LastHitFrame + this.HitStopFrameCount)));
    }

    /*Advances the projectile*/
    Projectile.prototype.advance = function(frame,stageX,stageY)
    {
        /*Is the projectile still on screen?*/
        if(!this.isVisible(0,0))
        {
            this.cancel();
            return null;
        }
        //this.Element.style.display = "none";
        ++this.T;
        this.IsActive = true;



        if(!this.isInHitStop(frame))
        {
            if(!this.IsDisintegrating)
            {
                var xSpeed = this.vxFn(this.XSpeed,this.T);
                var ySpeed = this.vyFn(this.YSpeed,this.T);

                var dx = (xSpeed) + (this.Direction > 0 ? (this.StageX - stageX) : (stageX - this.StageX));
                var dy = (ySpeed) + (stageY - this.StageY);


                this.X += dx;
                this.Y += dy;
            }

        }
        if(!!this.IsDisintegrating)
        {
            this.X += this.Direction > 0 ? (this.StageX - stageX) : (stageX - this.StageX);
            this.Y += stageY - this.StageY;
        }




        var offsetX = 0;
        var offsetY = 0;

        var delta = frame - this.StartFrame;
        var newFrame = null;
        if(!this.IsDisintegrating)
        {
            newFrame = this.Animation.getFrame(delta);
            if(!newFrame)
            {
                newFrame = this.Animation.BaseAnimation.Frames[0];
                this.StartFrame = frame;
            }
        }
        else
        {
            newFrame = this.DisintegrationAnimation.getFrame(delta);
            if(!newFrame)
            {
                this.cancel();
                return null;
            }
        }

        this.setSprite(newFrame,offsetX,offsetY,stageX,stageY);
        this.StageX = stageX;
        this.StageY = stageY;

        /*Allow players on the other team to deal with projectile coming toward them.*/
        this.Owner.onProjectileMoved(this.Id,this.getMidX(),this.getMidY());

        return this;
    }


    /*sets and moves the image - for browsers that load preloaded images instantly when the src property is set*/
    Projectile.prototype.setSprite = function(newFrame,offsetX,offsetY,stageX,stageY)
    {
        if(!!newFrame)
        {
            offsetX = newFrame.X;
            offsetY = newFrame.Y;

            var data = spriteLookup_.get(newFrame.RightSrc)
            if(!!data && (this.Element.style.backgroundPosition != data.Left + " " + data.Bottom))
            {
                this.Element.style.width = data.Width;
                this.Element.style.height = data.Height;
                this.Element.style.backgroundPosition = data.Left + " " + data.Bottom;
            }
        }

        if(this.IsDisintegrating)
        {
            if(this.Direction > 0)
            {
                this.Element.style.left = (offsetX + FlipCoord(this.X,parseInt(this.Element.style.width))) + "px";
                this.Element.style.right = "";
            }
            else
            {
                this.Element.style.right = (offsetX + FlipCoord(this.X,parseInt(this.Element.style.width))) + "px";
                this.Element.style.left = "";
            }
        }
        else
        {
            if(this.Direction > 0)
            {
                this.Element.style.left = "";
                this.Element.style.right = (offsetX + this.X) + "px";
            }
            else
            {
                this.Element.style.right = "";
                this.Element.style.left = (offsetX + this.X) + "px";
            }
        }
        var imgOffsetY = this.Y - (parseInt(this.Element.style.height)/2);
        this.Element.style.bottom = imgOffsetY + "px";
        if(this.Element.style.display != "")
            this.Element.style.display="";
    }


    Projectile.prototype.disintegrate = function(frame)
    {
        this.IsDisintegrating = true;
        this.StartFrame = frame;
    }
    /*The projectile has hit a player*/
    Projectile.prototype.hitPlayer = function(frame)
    {
        this.LastHitFrame = frame;
        if(++this.NbHits >= this.MaxHits)
            this.disintegrate(frame);
    }
    /*The projectile has hit another projectile*/
    Projectile.prototype.hitProjectile = function(frame,otherProjectile)
    {
        var isSuper = hasFlag(this.FlagsToSend,ATTACK_FLAGS.SUPER);
        var isOtherSuper = hasFlag(otherProjectile.FlagsToSend,ATTACK_FLAGS.SUPER);
        var areBothSupers = isSuper && isOtherSuper;

        if(!isSuper || areBothSupers)
            this.disintegrate(frame);
        if(!isOtherSuper || areBothSupers)
            otherProjectile.disintegrate(frame);
    }
    return new Projectile();
}
var FlipCoord = function(x,width)
{
    return STAGE.MAX_STAGEX - (x + width);
}
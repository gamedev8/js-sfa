var BaseAnimation = function(frames,name,isAttack,allowAirBlock)
{
    this.frames_ = frames || [];
    this.frameSpeed_ = 4;
    this.name_ = name;
    this.isAttack_ = isAttack == undefined ? true : isAttack;
    this.allowAirBlock_ = allowAirBlock;
    this.lastFrameOffset = 0;
}

/*Adds a frame to the move*/
BaseAnimation.prototype.AddFrameWithSound = function(player,volume,soundFilename,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    this.AddFrame(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd);
    var currentFrame = this.frames_[this.frames_.length-1];
    currentFrame.soundFilename_ = soundFilename;
    currentFrame.soundVolume_ = volume;
    soundManager_.Load(currentFrame.soundFilename_,3,volume);
}

/*Adds a frame to the move*/
BaseAnimation.prototype.AddFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    if(!!this.frames_.length > 0)
        this.lastFrameOffset += this.frames_[this.frames_.length - 1].Frames;
    var frameOffset = this.lastFrameOffset;
    //for(var i = 0; i < this.frames_.length; ++i)
    //    frameOffset += this.frames_[i].Frames;


    if(shadowImage == "" && !!player)
        shadowImage = player.defaultShadowImageSrc_;
    ++player.nbFrames_;
    this.frames_[this.frames_.length] = new Frame(this.frames_.length,player.GetNextFrameID(),shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,frameOffset,chainProjectile,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd);

    var currentFrame = this.frames_[this.frames_.length-1];

    if(!!this.isThrow_)
    {
        currentFrame.FlagsToSet.Player = (currentFrame.FlagsToSet.Player || MISC_FLAGS.NONE) | PLAYER_FLAGS.INVULNERABLE;
    }

    if(!!this.isAttack_)
    {

        /*Moves that can be air blocked (jump attacks), can ALSO be blocked on the ground, but not in the crouch*/
        var flags = MISC_FLAGS.NONE;
        if(!!this.allowAirBlock_)
            flags = COMBAT_FLAGS.CAN_BE_AIR_BLOCKED;
        else
            flags = COMBAT_FLAGS.CAN_BE_BLOCKED;


        if(!this.skipFrameBlockCheck_)
        {
            currentFrame.FlagsToSet.Combat = (currentFrame.FlagsToSet.Combat || MISC_FLAGS.NONE) | flags;
        }
        else if(!!this.canAddStopBlock_)
        {
            this.canAddStopBlock_ = null;
            currentFrame.FlagsToClear.Combat = (currentFrame.FlagsToClear.Combat || MISC_FLAGS.NONE) | flags;
        }
    }
}

/*Adds a frame multiple times, and adds the sound effect on the first frame only.*/
BaseAnimation.prototype.AddRepeatingFrameWithSound = function(player,volume,soundFilename,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    for(var i = 0; i < nbFrames; ++i)
    {
        if(i == 0)
        {
            this.AddFrame(player,shadowImage,image,1,flagsToSet,flagsToClear,x,y,priority,baseDamage,null,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd);
            var currentFrame = this.frames_[this.frames_.length-1];
            currentFrame.soundFilename_ = soundFilename;
            currentFrame.soundVolume_ = volume;
            soundManager_.Load(currentFrame.soundFilename_,3,volume);
        }
        else
            this.AddFrame(player,shadowImage,image,1,flagsToSet,flagsToClear,x,y,priority,baseDamage,null,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,0);
    }

}


/*Adds a frame multiple times*/
BaseAnimation.prototype.AddRepeatingFrame = function(player,shadowImage,image,nbFrames,flagsToSet,flagsToClear,x,y,priority,baseDamage,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd)
{
    for(var i = 0; i < nbFrames; ++i)
    {
        if(i == 0)
            this.AddFrame(player,shadowImage,image,1,flagsToSet,flagsToClear,x,y,priority,baseDamage,null,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,energyToAdd);
        else
            this.AddFrame(player,shadowImage,image,1,flagsToSet,flagsToClear,x,y,priority,baseDamage,null,imageOffsetX,imageOffsetY,hitState,hitPoints,flagsToSend,hitID,hitDelayFactor,0);
    }
}
/*Returns the frame that should be run at a given time*/
BaseAnimation.prototype.GetFrame = function(frameDelta)
{
    var count = 0;
    for(var i = 0; i < this.frames_.length; ++i)
        if((count += this.frames_[i].Frames) >= frameDelta)
            return this.frames_[i];
    return null;
}
/*Returns the frame index of a frame*/
BaseAnimation.prototype.GetFrameIndex = function(id)
{
    var count = 0;
    for(var i = 0; i < this.frames_.length; ++i)
    {
        if(this.frames_[i].ID == id)
        {
            return i;
        }
    }
    return -1;
}
/*Returns the first frame with an ID greater than the passed in ID*/
BaseAnimation.prototype.GetNextFrameOffset = function(id)
{
    var count = 0;
    for(var i = 0; i < this.frames_.length; ++i)
    {
        count += this.frames_[i].Frames;
        if(this.frames_[i].ID == id)
            return count;
    }
    return 0;
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

var BasicBaseAnimation = function(frames,name)
{
    this.frames_ = frames || [];
    this.nbFrames_ = 0;
    this.name_ = name;
    this.lastFrameOffset_ = 0;
}

/*Returns the frame that should be run at a given time*/
BasicBaseAnimation.prototype.GetFrame = function(frameDelta)
{
    var count = 0;
    for(var i = 0; i < this.frames_.length; ++i)
        if((count += this.frames_[i].Frames) >= frameDelta)
            return this.frames_[i];
    return null;
}
/*Adds a frame to the move*/
BasicBaseAnimation.prototype.AddFrame = function(owner,image,nbFrames)
{
    if(!!this.frames_.length > 0)
        this.lastFrameOffset_ += this.frames_[this.frames_.length - 1].Frames;

    var frameOffset = this.lastFrameOffset;

    ++owner.nbFrames_;
    this.frames_[this.frames_.length] = new Frame(this.frames_.length,owner.GetNextFrameID(),"",image,nbFrames,0,0,0,0,0,0,frameOffset);
    this.nbFrames_ += this.frames_[this.frames_.length - 1].Frames;
}

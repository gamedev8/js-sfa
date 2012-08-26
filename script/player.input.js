/*Some moves require the key to be held, this function can be used to check that.*/
Player.prototype.IsKeyDown = function(key)
{
    return !!(this.keyState_ & key);
}


Player.prototype.HandleInput = function(keyboardState,frame)
{
    if(!this.forceImmobile_ && this.keyState_ > 0)
        this.CheckForAnimation(frame);
}

Player.prototype.ClearInput = function()
{
    this.keyStates_ = [];
    this.keyState_ = 0;
}

/*Ensures that the keyStateChange array doesn't get too big*/
Player.prototype.CleanUpKeyStateChanges = function(frame)
{
    if(this.keyStates_.length > CONSTANTS.MAX_KEYSTATES)
        this.keyStates_ = this.keyStates_.slice(this.keyStates_.length - CONSTANTS.MAX_KEYSTATES);

    var i = 0;
    while(i < this.keyStates_.length)
    {
        if(this.keyStates_[i].Bit == 0 && (frame - this.keyStates_[i].Frame) > CONSTANTS.MAX_KEY_LIFE)
            this.keyStates_ = this.keyStates_.slice(i+1);
        ++i;
    }

}

/*Simuates pressing keys*/
Player.prototype.SendInput = function(input)
{
    if(!input || !this.GetMatch().GetAllowInput())
        return;

    var frame = this.GetMatch().GetCurrentFrame();
    var key;
    for(var i = 0; i < input.length; ++i)
    {
        key = null;
        for(var a in this.buttons_)
        {
            if(this.buttons_[a].Bit == input[i].Button)
            {
                key = a;
                break;
            }
        }

        if(!!key) this.OnKeyStateChanged(input[i].IsDown,key,frame);
    }
}

/*Adds a state change to the keyStateChange array*/
Player.prototype.AddKeyStateChange = function(frame,keyCode,isDown)
{
    var frameOffset = 0;
    if(this.keyStates_.length > 0)
    {
        frameOffset = frame - this.keyStates_[this.keyStates_.length-1].Frame + this.keyStates_[this.keyStates_.length-1].FrameOffset;
    }
    this.keyStates_[this.keyStates_.length] = {Bit:this.keyState_,Frame:frame,FrameOffset:frameOffset,KeyCode:keyCode,NbFrames:1};
    
    /*if the key was let go calculate the number frames it was pressed*/
    if(!isDown)
    {
        for(var i = this.keyStates_.length-1; i > -1; --i)
        {
            if(this.keyStates_[i].KeyCode == keyCode && !!(this.keyStates_[i].Bit & this.buttons_[keyCode].Bit))
            {
                this.keyStates_[i].NbFrames = frame - this.keyStates_[i].Frame;
                return;
            }
        }
    }
}


/*Handles key state changes*/
Player.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
{

    if(!!this.buttons_[keyCode])
    {
        var oldState = this.keyState_;

        /*key state just changed to pressed*/
        if(!!isDown &&  !(this.keyState_ & this.buttons_[keyCode].Bit))
        {
            this.keyState_ |= this.buttons_[keyCode].Bit;
        }
        /*key state just changed to released*/
        else if(!isDown && !!(this.keyState_ & this.buttons_[keyCode].Bit))
        {
            this.keyState_ = (this.keyState_ | this.buttons_[keyCode].Bit) ^ this.buttons_[keyCode].Bit;
        }

        /*if the state has changed, then log it*/
        if(oldState != this.keyState_)
        {
            this.keyStateChanged_ = true;
            this.AddKeyStateChange(frame,keyCode,isDown);

            if(!!isDown)
                this.DebugShowKeys();
        }
    }
}

/*
Returns 2 if there is an exact match.
Returns 1 if there is a priority match.
Returns 0 if there is no match
*/
Player.prototype.CompareKeySequence = function(move,keys)
{
    var keyIndex = 0;
    var isExactMatch = true;
    var isMatch = true;
    do
    {
        var userKey = keys[keyIndex].Bit;
        var moveKey = move.GetKey(keyIndex);

        if(keyIndex > 0)
        {
            var userDirKeys = move.StripAttackKeys(userKey);
            var moveDirKeys = move.StripAttackKeys(moveKey);

            var prevUserDirKeys = move.StripAttackKeys(keys[keyIndex-1].Bit);
            var prevMoveDirKeys = move.StripAttackKeys(move.GetKey(keyIndex-1));

            if((moveDirKeys != prevMoveDirKeys) && (userDirKeys == prevUserDirKeys))
            {
                return 0;
            }
        }

        if(!(!move.MustChargeKey(keyIndex) || keys[keyIndex].NbFrames > CONSTANTS.NBCHARGE_FRAMES))
        {
            return 0;
        }

        if(moveKey != userKey)
        {
            isExactMatch = false;
        }
        /*check if the key was pressed at all*/
        if((moveKey & userKey) != moveKey)
        {
            isMatch = false;
            break;
        }
        ++keyIndex;
    }while(keyIndex < keys.length);
    
    return !!isExactMatch ? CONSTANTS.EXACT_MATCH : (!!isMatch ? CONSTANTS.PRIORITY_MATCH : 0);
}

/*
Returns 2 if there is an exact match.
Returns 1 if there is a priority match.
Returns 0 if there is no match
*/
Player.prototype.CompareAlternateKeySequences = function(move,keys)
{
    var isExactMatch = false;
    var isMatch = false;
    outer : for(var i = 0, length = move.GetAlternateKeySequencesLength(); i < length; ++i)
    {
        isExactMatch = true;
        isMatch = true;

        inner : for(var j = 0, iLength = move.GetAlternateKeySequenceLength(i); j < iLength; ++j)
        {
            if(!(!move.MustChargeAlternateKey(i,j) || keys[keyIndex].NbFrames > CONSTANTS.NBCHARGE_FRAMES))
                return 0;

            if(move.GetAlternateKeySequence(i,j) != keys[j].Bit)
            {
                isExactMatch = false;
            }
            if((move.GetAlternateKeySequence(i,j) & keys[j].Bit) != move.GetAlternateKeySequence(i,j))
            {
                isMatch = false;
                break inner;
            }
        }

        if(isExactMatch || isMatch)
            break outer;
    }

    return !!isExactMatch ? CONSTANTS.EXACT_MATCH : (!!isMatch ? CONSTANTS.PRIORITY_MATCH : 0);
}


/*Returns a string from the keys*/
Player.prototype.CutKey = function(keys,frame)
{
    var retVal = {Duration:keys[keys.length-1].FrameOffset - keys[0].FrameOffset,Keys:[],Key:""};
    while(keys.length > 0)
    {
        retVal.Keys[retVal.Keys.length] = {Bit:keys[0].Bit,NbFrames:keys[0].NbFrames};
        retVal.Key += "_" + keys[0].Bit;
        keys = keys.slice(1);
    }
    return retVal;
}
/*returns true if the player is in a state where the current animation can be interupted with another animation*/
Player.prototype.AllowInterupt = function()
{
    return this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_1)
            || this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_2)
            || this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_3)
            || this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_4)
            || this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_5)
            || this.Flags.Pose.Has(POSE_FLAGS.ALLOW_INTERUPT_6)
        ;
}
/*Check the current key sequence for a move to execute*/
Player.prototype.CheckForAnimation = function(frame)
{
    if(!this.GetMatch().GetAllowInput())
        return;
    if(!!this.checkedForAnimation_)
        return;
    this.checkedForAnimation_ = true;


    if(this.Flags.Player.Has(PLAYER_FLAGS.MOBILE) || (this.AllowInterupt() && !this.interuptAnimation_))
    {
        this.keyStateChanged_ = false;
        var keys = [];
        for(var i = 0; i < this.keyStates_.length; ++i)
            keys[keys.length] = this.keyStates_[i];

        var cb = 0;
        while(keys.length > 0)
        {
            var value = this.CutKey(keys,frame);
            var move = this.FindAnimation(value,frame);
            if(!!move && (!move.Duration || (value.Duration <= move.Duration)))
            {
                /*is there no current move, or is the user executing a new move*/
                if(!this.currentAnimation_ || (this.currentAnimation_.Animation.BaseAnimation.name_ != move.BaseAnimation.name_))
                {
                    if(this.AllowInterupt())
                        this.interuptAnimation_ = {Delay:CONSTANTS.INTERUPT_DELAY,Animation:move,StartFrame:frame,Direction:this.direction_};
                    else
                        this.SetCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.direction_});
                }
                return;
            }
            /*Nope, so lets check the next key sequence*/
            else
            {
                keys = keys.slice(1);
                key = keys.join("_");
            }

            if(++cb > 100)
                break;
        }
        if(!this.keyState_)
        {
            this.GoToStance(frame);
        }
    }
}

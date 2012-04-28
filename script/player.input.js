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

Player.prototype.ClearKeys = function()
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

/*Adds a state change to the keyStateChange array*/
Player.prototype.AddKeyStateChange = function(frame)
{
    var frameOffset = 0;
    if(this.keyStates_.length > 0)
        frameOffset = frame - this.keyStates_[this.keyStates_.length-1].Frame + this.keyStates_[this.keyStates_.length-1].FrameOffset;
    this.keyStates_[this.keyStates_.length] = {Bit:this.keyState_,Frame:frame,FrameOffset:frameOffset};
}


/*Handles key state changes*/
Player.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
{
    var oldState = this.keyState_;

    if(!!this.buttons_[keyCode])
    {
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
    }

    /*if the state has changed, then log it*/
    if(oldState != this.keyState_)
    {
        this.keyStateChanged_ = true;
        this.AddKeyStateChange(frame);
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
        if(move.keySequence_[keyIndex] != keys[keyIndex])
        {
            isExactMatch = false;
        }
        if((move.keySequence_[keyIndex] & keys[keyIndex]) != move.keySequence_[keyIndex])
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
    outer : for(var i = 0; i < move.alternateKeySequences_.length; ++i)
    {
        isExactMatch = true;
        isMatch = true;

        inner : for(var j = 0; j < move.alternateKeySequences_[i].length; ++j)
        {
            if(move.alternateKeySequences_[i][j] != keys[j])
            {
                isExactMatch = false;
            }
            if((move.alternateKeySequences_[i][j] & keys[j]) != move.alternateKeySequences_[i][j])
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
Player.prototype.CutKey = function (keys,frame)
{
    var retVal = {Duration:keys[keys.length-1].FrameOffset - keys[0].FrameOffset,Keys:[],Key:""};
    while(keys.length > 0)
    {
        retVal.Keys[retVal.Keys.length] = keys[0].Bit;
        retVal.Key += "_" + keys[0].Bit;
        keys = keys.slice(1);
    }
    return retVal;
}
/*Check the current key sequence for a move to execute*/
Player.prototype.CheckForAnimation = function(frame)
{
    if(!!this.checkedForAnimation_)
        return;
    this.checkedForAnimation_ = true;


    if(this.flags_.Player.Has(PLAYER_FLAGS.MOBILE))
    {
        this.keyStateChanged_ = false;
        var keys = [];
        for(var i = 0; i < this.keyStates_.length; ++i)
            keys[keys.length] = this.keyStates_[i];

        var cb = 0;
        while(keys.length > 0)
        {
            var value = this.CutKey(keys,frame);
            /*first attempt the O(1) lookup*/
            var move = this.moves_[_c3("_",this.poseState_,value.Key)];
            //var move = this.moves_[_c3("_",this.flags_.PoseFlags.Get(),value.Key)];
            if(!move || !!move && !!this.IsProjectileInUse(move))
            {
                /*otherwise do the slow lookup*/
                move = this.FindAnimation(value);
            }
            if(!!move && (!move.duration_ || (value.Duration <= move.duration_)))
            {
                /*is there no current move, or is the user executing a new move*/
                if(!this.currentAnimation_ || (this.currentAnimation_.Animation.baseAnimation_.name_ != move.baseAnimation_.name_))
                {
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

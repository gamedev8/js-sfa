/*Some moves require the key to be held, this function can be used to check that.*/
Player.prototype.isKeyDown = function(key)
{
    return hasFlag(this.KeyState,key);
}


Player.prototype.handleInput = function(keyboardState,frame)
{
    if(!this.ForceImmobile && this.KeyState > 0)
        this.checkForAnimation(frame);
}

Player.prototype.clearInput = function()
{
    this.KeyStates = [];
    this.KeyState = 0;
}

/*Ensures that the keyStateChange array doesn't get too big*/
Player.prototype.cleanUpKeyStateChanges = function(frame)
{
    if(this.KeyStates.length > CONSTANTS.MAX_KEYSTATES)
        this.KeyStates = this.KeyStates.slice(this.KeyStates.length - CONSTANTS.MAX_KEYSTATES);

    var i = 0;
    while(i < this.KeyStates.length)
    {
        if(this.KeyStates[i].Bit == 0 && (frame - this.KeyStates[i].Frame) > CONSTANTS.MAX_KEY_LIFE)
            this.KeyStates = this.KeyStates.slice(i+1);
        ++i;
    }

}

/*Simuates pressing keys*/
Player.prototype.sendInput = function(input)
{
    if(!input || !this.getMatch().getAllowInput())
        return;

    var frame = this.getMatch().getCurrentFrame();
    var key;
    for(var i = 0; i < input.length; ++i)
    {
        key = null;
        for(var a in this.Buttons)
        {
            if(this.Buttons[a].Bit == input[i].Button)
            {
                key = a;
                break;
            }
        }

        if(!!key) this.onKeyStateChanged(input[i].IsDown,key,frame);
    }
}

/*Adds a state change to the keyStateChange array*/
Player.prototype.addKeyStateChange = function(frame,keyCode,isDown)
{
    var frameOffset = 0;
    if(this.KeyStates.length > 0)
    {
        frameOffset = frame - this.KeyStates[this.KeyStates.length-1].Frame + this.KeyStates[this.KeyStates.length-1].FrameOffset;
    }
    this.KeyStates[this.KeyStates.length] = {Bit:this.KeyState,Frame:frame,FrameOffset:frameOffset,KeyCode:keyCode};
    
    /*if the key was let go calculate the number frames it was pressed
    if(!isDown)
    {
        for(var i = this.KeyStates.length-1; i > -1; --i)
        {
            if(this.KeyStates[i].KeyCode == keyCode && hasFlag(this.KeyStates[i].Bit,this.Buttons[keyCode].Bit))
            {
                this.KeyStates[i].NbFrames = frame - this.KeyStates[i].Frame;
                return;
            }
        }
    }*/
}


/*Handles key state changes*/
Player.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
{

    if(!!this.Buttons[keyCode])
    {
        var oldState = this.KeyState;

        /*key state just changed to pressed*/
        if(!!isDown &&  !hasFlag(this.KeyState,this.Buttons[keyCode].Bit))
        {
            this.KeyState |= this.Buttons[keyCode].Bit;
        }
        /*key state just changed to released*/
        else if(!isDown && hasFlag(this.KeyState,this.Buttons[keyCode].Bit))
        {
            this.KeyState = (this.KeyState | this.Buttons[keyCode].Bit) ^ this.Buttons[keyCode].Bit;
        }

        /*if the state has changed, then log it*/
        if(oldState != this.KeyState)
        {
            this.KeyStateChanged = true;
            this.addKeyStateChange(frame,keyCode,isDown);

            if(!!isDown)
                this.debugShowKeys();
        }
    }
}

/*
Returns 2 if there is an exact match.
Returns 1 if there is a priority match.
Returns 0 if there is no match
*/
Player.prototype.compareKeySequence = function(move,keys)
{
    var keyIndex = 0;
    var isExactMatch = true;
    var isMatch = true;
    do
    {
        var userKey = keys[keyIndex].Bit;
        var moveKey = move.getKey(keyIndex);

        if(keyIndex > 0)
        {
            var userDirKeys = move.stripAttackKeys(userKey);
            var moveDirKeys = move.stripAttackKeys(moveKey);

            var prevUserDirKeys = move.stripAttackKeys(keys[keyIndex-1].Bit);
            var prevMoveDirKeys = move.stripAttackKeys(move.getKey(keyIndex-1));

            if((moveDirKeys != prevMoveDirKeys) && (userDirKeys == prevUserDirKeys))
            {
                return 0;
            }
        }

        if(!(!move.mustChargeKey(keyIndex) || keys[keyIndex].NbFrames > move.NbChargeFrames))
        {
            return 0;
        }
        //check if an exact match was required
        if(!!move.mustMatchExactKey(keyIndex) && moveDirKeys != userDirKeys)
            return 0;

        if(moveKey != userKey)
        {
            isExactMatch = false;
        }
        //check if the key was pressed at all
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
Player.prototype.compareAlternateKeySequences = function(move,keys)
{
    var isExactMatch = false;
    var isMatch = false;
    outer : for(var i = 0, length = move.getAlternateKeySequencesLength(); i < length; ++i)
    {
        isExactMatch = true;
        isMatch = true;

        inner : for(var j = 0, iLength = move.getAlternateKeySequenceLength(i); j < iLength; ++j)
        {
            if(!(!move.mustChargeAlternateKey(i,j) || keys[j].NbFrames > move.NbChargeFrames))
                return 0;

            if(move.getAlternateKeySequence(i,j) != keys[j].Bit)
            {
                isExactMatch = false;
            }
            if((move.getAlternateKeySequence(i,j) & keys[j].Bit) != move.getAlternateKeySequence(i,j))
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
Player.prototype.cutKey = function(keys,frame)
{
    var retVal = {Duration:keys[keys.length-1].FrameOffset - keys[0].FrameOffset,Keys:[],Key:""};
    while(keys.length > 0)
    {
        retVal.Keys[retVal.Keys.length] = {Bit:keys[0].Bit,NbFrames:frame - keys[0].Frame};
        retVal.Key += "_" + keys[0].Bit;
        keys = keys.slice(1);
    }
    return retVal;
}
/*returns true if the player is in a state where the current animation can be interupted with another animation*/
Player.prototype.allowInterupt = function()
{
    return this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_1)
            || this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_2)
            || this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_3)
            || this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_4)
            || this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_5)
            || this.Flags.Pose.has(POSE_FLAGS.ALLOW_INTERUPT_6)
        ;
}
/*Check the current key sequence for a move to execute*/
Player.prototype.checkForAnimation = function(frame)
{
    if(!this.getMatch().getAllowInput())
        return;
    if(!!this.CheckedForAnimation)
        return;
    this.CheckedForAnimation = true;


    if(this.Flags.Player.has(PLAYER_FLAGS.MOBILE) || (this.allowInterupt() && !this.InteruptAnimation))
    {
        this.KeyStateChanged = false;
        var throwKeys = [];
        var keys = [];
        for(var i = 0; i < this.KeyStates.length; ++i)
        {
            keys[keys.length] = this.KeyStates[i];
            throwKeys[throwKeys.length] = this.KeyStates[i];
        }

        var cb = 0;
        while(throwKeys.length > 0)
        {
            var value = this.cutKey(throwKeys,frame);
            var move = this.findThrow(value,frame);
            if(!!move)// && (!move.Duration || (value.Duration <= move.Duration)))
            {
                //is there no current move, or is the user executing a new move
                if(!this.CurrentAnimation || (this.CurrentAnimation.Animation.BaseAnimation.Name != move.BaseAnimation.Name))
                {
                    if(this.allowInterupt())
                        this.InteruptAnimation = {Delay:CONSTANTS.INTERUPT_DELAY,Animation:move,StartFrame:frame,Direction:this.Direction};
                    else
                        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction});
                }
                return;
            }
            //Nope, so lets check the next key sequence
            else
            {
                throwKeys = throwKeys.slice(1);
            }

            if(++cb > 100)
                break;
        }

        cb = 0;
        while(keys.length > 0)
        {
            var value = this.cutKey(keys,frame);
            var move = this.findAnimation(value,frame);
            if(!!move && (!move.Duration || (value.Duration <= move.Duration)))
            {
                /*is there no current move, or is the user executing a new move*/
                if(move == -1)
                {
                    //do nothing for now, the move was already chained
                }
                else if(!this.CurrentAnimation || (this.CurrentAnimation.Animation.BaseAnimation.Name != move.BaseAnimation.Name))
                {
                    if(this.allowInterupt())
                        this.InteruptAnimation = {Delay:CONSTANTS.INTERUPT_DELAY,Animation:move,StartFrame:frame,Direction:this.Direction};
                    else
                        this.setCurrentAnimation({Animation:move,StartFrame:frame,Direction:this.Direction});
                }
                return;
            }
            /*Nope, so lets check the next key sequence*/
            else
            {
                keys = keys.slice(1);
            }

            if(++cb > 100)
                break;
        }
        if(!this.KeyState)
        {
            this.goToStance(frame);
        }
    }
}

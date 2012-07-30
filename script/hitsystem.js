

var RegisteredHit = function(behavior,hitState,flags,startFrame,frame,damage,energyToAdd,isProjectile,isGrapple,hitX,hitY,attackDirection,who,hitID,priorityFlags,playerPoseState,playerState,fx,fy,otherPlayer,behaviorFlags,invokedAnimationName)
{
    this.BehaviorFlags = behaviorFlags;
    this.HitState = hitState;
    this.Flags = flags;
    this.Frame = frame;
    this.StartFrame = 0;
    this.Damage = damage;
    this.EnergyToAdd = energyToAdd;
    this.IsProjectile = isProjectile;
    this.IsGrapple = isGrapple;
    this.HitX = hitX;
    this.HitY = hitY;
    this.Who = who;
    this.AttackDirection = attackDirection;
    this.HitID = hitID;
    this.PriorityFlags = priorityFlags;
    this.PlayerPoseState = priorityFlags;
    this.PlayerState = playerState;
    this.AttackForceX = fx;
    this.AttackForceY = fy;
    this.OtherPlayer = otherPlayer;
    this.InvokedAnimationName = invokedAnimationName;
}




/*controls if a move can override another. To allow a double hit, set both the allowOverridgeFlags and overideFlags to OVERRIDE_FLAGS.NONE*/
var MoveOverrideFlags = function(allowOverrideFlags,overrideFlags)
{
    this.AllowOverrideFlags = allowOverrideFlags || OVERRIDE_FLAGS.ALL;
    this.OverrideFlags = overrideFlags || OVERRIDE_FLAGS.NULL;
}

MoveOverrideFlags.prototype.HasAllowOverrideFlag = function(flag) { return !!flag && !!(this.AllowOverrideFlags & flag); }
MoveOverrideFlags.prototype.HasOverrideFlag = function(flag) { return !!flag && !!(this.OverrideFlags & flag); }


var ActionDetails = function(overrideFlags,player,otherID,isProjectile,isGrapple,startFrame,frame,otherPlayer)
{
    this.MoveOverrideFlags = overrideFlags;
    this.Frame = frame || 0;
    this.OtherAttackStartFrame = startFrame;

    this.Key = this.GetKey(player.id_,otherID);
    this.IsProjectile = isProjectile;
    this.IsGrapple = isGrapple;
    this.Player = player;
    this.OtherPlayer = otherPlayer;
    this.PlayerID = player.id_;
}


ActionDetails.prototype.GetKey = function(playerID,otherID)
{
    var retVal = "";
    /*ensure that the team 1 is always first*/
    if(playerID.charAt(1) == "1")
        retVal = playerID + otherID;
    else
        retVal = otherID + playerID;

    return retVal;
}


var HitSystem = function(actionFrameDelay)
{
    this.Actions = {};
    this.ActionFrameDelay = actionFrameDelay || CONSTANTS.DEFAULT_ACTION_FRAME_DELAY;
}


HitSystem.prototype.CanOverride = function(key,index)
{
    var first = index == 0 ? this.Actions[key][0] : this.Actions[key][1];
    var second = index == 0 ? this.Actions[key][1] : this.Actions[key][0];

    var retVal  = false;
    if(!!first.OtherPlayer && !!first.Player.currentAnimation_.Animation)
    {
        var a = first.Player.currentAnimation_.Animation.OverrideFlags.HasOverrideFlag(OVERRIDE_FLAGS.ALL)
        var b = first.OtherPlayer.currentAnimation_.Animation.OverrideFlags.HasAllowOverrideFlag(OVERRIDE_FLAGS.ALL)
        var c = first.Player.currentAnimation_.Animation.OverrideFlags.HasOverrideFlag(first.OtherPlayer.currentAnimation_.Animation.OverrideFlags.AllowOverrideFlags);
        var d = first.IsProjectile;
        var e = !!second && second.IsGrapple;
        var f = first.IsGrapple;
        var ignore = first.Player.Flags.Player.Has(PLAYER_FLAGS.IGNORE_MOVE_OVERRIDE);

        retVal = !!ignore && (a || b || (c && first.Player.isInAttackFrame_) || d);
        if(!!e)
            return false;
        if(!!f)
            return false;
    }
    return retVal;
}

HitSystem.prototype.ClearPendingHit = function(id)
{
    for(var i in this.Actions)
    {
        for(var index in this.Actions[i])
        {
            if(this.Actions[i][index].PlayerID == id)
            {
                this.Actions[i][index] = null;
                delete this.Actions[i][index];
            }
        }
        if(!this.Actions[i][0] && !this.Actions[i][1])
        {
            this.Actions[i] = null;
            delete this.Actions[i];
        }
    }
}

HitSystem.prototype.FrameMove = function(frame)
{
    for(var i in this.Actions)
    {
        var item = this.Actions[i];
        if(!!item && !!item.ActionFrame && (item.ActionFrame == frame))
        {
            var canP1Hit = !!item[0] && this.Test(item[0].Key,0);
            var canP2Hit = !!item[1] && this.Test(item[1].Key,1);

            var canP1HitBeOverriden = !!item[0] && this.CanOverride(item[0].Key,0);
            var canP2HitBeOverriden = !!item[1] && this.CanOverride(item[1].Key,1);

            if(canP1HitBeOverriden && canP2HitBeOverriden)
            {
                canP1Hit = true;
                canP2Hit = true;
            }
            else
            {
                if(canP1HitBeOverriden) canP1Hit = false;
                if(canP2HitBeOverriden) canP2Hit = false;
            }

            /*if both hits can hit, or if nobody can hit, then allow double hit*/
            var canDoubleHit =     ((canP1Hit && !canP1HitBeOverriden) && (canP2Hit && !canP2HitBeOverriden))
                                || ((canP1Hit && canP1HitBeOverriden) && (canP2Hit && canP2HitBeOverriden))
                                || ((!canP1Hit && !canP1HitBeOverriden) && (!canP2Hit && !canP2HitBeOverriden))
                                || ((!canP1Hit && canP1HitBeOverriden) && (!canP2Hit && canP2HitBeOverriden));

            /*if nobody can hit, then allow the move executed last to register the hit*/
            if((!canDoubleHit) && (!canP1Hit && !canP2Hit) && !canP1HitBeOverriden)
            {
                if(!!item[0] && !item[1])
                {
                    if(item[0].Player.currentAnimation_.StartFrame < item[0].OtherPlayer.currentAnimation_.StartFrame)
                    {
                        canP1Hit = true;
                        canP2Hit = false;
                        canDoubleHit = false;
                    }
                }
            }

            if(!!item[0] && (canP1Hit || canDoubleHit))
            {
                /*player 1 registers action*/
                item[0].Player.RegisterHit(frame);
            }
            else if(!!item[0])
            {
                item[0].Player.DidntHit(frame);
            }
            if(!!item[1] && (canP2Hit || canDoubleHit))
            {
                /*player 2 registers action*/
                item[1].Player.RegisterHit(frame);
            }
            else if(!!item[1])
            {
                item[1].Player.DidntHit(frame);
            }
            /*clear the action*/
            this.Actions[i] = null;
            delete this.Actions[i];
        }
    }
}

HitSystem.prototype.Register = function(details)
{
    if(!this.Actions[details.Key])
        this.Actions[details.Key] = {ActionFrame:details.Frame + this.ActionFrameDelay}
    if(!this.Actions[details.Key][0] || (this.Actions[details.Key][0].PlayerID == details.PlayerID))
        this.Actions[details.Key][0] = details;
    else
        this.Actions[details.Key][1] = details;
}

HitSystem.prototype.Test = function(key,index)
{
    var first = index == 0 ? this.Actions[key][0] : this.Actions[key][1];
    var second = index == 0 ? this.Actions[key][1] : this.Actions[key][0];


    if(!second)
    {
        return true;
    }
    if(first.MoveOverrideFlags.HasAllowOverrideFlag(OVERRIDE_FLAGS.NONE))
    {
        return false;
    }
    return (second.MoveOverrideFlags.HasOverrideFlag(OVERRIDE_FLAGS.ALL)
        || first.MoveOverrideFlags.HasAllowOverrideFlag(OVERRIDE_FLAGS.ALL)
        || second.MoveOverrideFlags.HasOverrideFlag(first.MoveOverrideFlags.AllowOverrideFlags)
        || first.IsProjectile
        || first.IsGrapple)
        && !second.IsGrapple
        ;
}
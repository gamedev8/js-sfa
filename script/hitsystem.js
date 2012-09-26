

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
    this.NoFrameDelay = false;
}




/*controls if a move can override another. To allow a double hit, set both the allowOverridgeFlags and overideFlags to OVERRIDE_FLAGS.NONE*/
var MoveOverrideFlags = function(allowOverrideFlags,overrideFlags)
{
    this.AllowOverrideFlags = allowOverrideFlags || OVERRIDE_FLAGS.ALL;
    this.OverrideFlags = overrideFlags || OVERRIDE_FLAGS.NULL;
}

MoveOverrideFlags.prototype.hasAllowOverrideFlag = function(flag) { return !!flag && hasFlag(this.AllowOverrideFlags,flag); }
MoveOverrideFlags.prototype.hasOverrideFlag = function(flag) { return !!flag && hasFlag(this.OverrideFlags,flag); }


var ActionDetails = function(overrideFlags,player,otherID,isProjectile,isGrapple,startFrame,frame,otherPlayer)
{
    this.MoveOverrideFlags = overrideFlags;
    this.Frame = frame || 0;
    this.OtherAttackStartFrame = startFrame;

    this.Key = this.getKey(player.Id,otherID);
    this.IsProjectile = isProjectile;
    this.IsGrapple = isGrapple;
    this.Player = player;
    this.OtherPlayer = otherPlayer;
    this.PlayerID = player.Id;
}


ActionDetails.prototype.getKey = function(playerID,otherID)
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


HitSystem.prototype.checkPendingHits = function(id,overrideFlags)
{
}

HitSystem.prototype.canHit = function(key,index)
{
    var first = index == 0 ? this.Actions[key][0] : this.Actions[key][1];
    var second = index == 0 ? this.Actions[key][1] : this.Actions[key][0];

    var retVal  = true;
    if(!!first.OtherPlayer && !!first.Player.CurrentAnimation.Animation)
    {
        /*grapples can not be overriden*/
        if(first.IsGrapple || (!!second && second.IsGrapple))
            return true;
        if(first.Player.isGrappling())
            return false;
        var flags = first.Player.CurrentAnimation.Animation.OverrideFlags;

        var isHitOverriden = flags.hasOverrideFlag(OVERRIDE_FLAGS.ALL) /*overrides all*/
            || (!flags.hasOverrideFlag(OVERRIDE_FLAGS.NONE) && flags.hasOverrideFlag(first.OtherPlayer.CurrentAnimation.Animation.OverrideFlags.AllowOverrideFlags)); /*overrides yours*/

        return !isHitOverriden || !!first.Player.IgnoreOverrides;


    }
    return retVal;
}

HitSystem.prototype.clearPendingHit = function(id)
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

HitSystem.prototype.frameMove = function(frame)
{
    for(var i in this.Actions)
    {
        var item = this.Actions[i];
        if(!!item && !!item.ActionFrame && (item.ActionFrame <= frame))
        {
            var canP1Hit = !!item[0] && this.canHit(item[0].Key,0);
            var canP2Hit = !!item[1] && this.canHit(item[1].Key,1);
            var canDoubleHit = !canP1Hit && !canP2Hit

            if(!!item[0] && canP1Hit)
            {
                /*player 1 registers action*/
                item[0].Player.registerHit(frame);
            }
            else if(!!item[0])
            {
                item[0].Player.didntHit(frame);
            }

            if(!!item[1] && canP2Hit)
            {
                /*player 2 registers action*/
                item[1].Player.registerHit(frame);
            }
            else if(!!item[1])
            {
                item[1].Player.didntHit(frame);
            }
            /*clear the action*/
            this.Actions[i] = null;
            delete this.Actions[i];
        }
    }
}

HitSystem.prototype.register = function(details)
{
    if(!this.Actions[details.Key])
        this.Actions[details.Key] = {ActionFrame:details.Frame + (!!details.NoFrameDelay ? 0 : this.ActionFrameDelay)}
    if(!this.Actions[details.Key][0] || (this.Actions[details.Key][0].PlayerID == details.PlayerID))
        this.Actions[details.Key][0] = details;
    else
        this.Actions[details.Key][1] = details;

    if(!!details.NoFrameDelay)
    {
        this.frameMove(details.Frame);
    }

}

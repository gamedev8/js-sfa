var PRIORITYFLAGS = 
{
     LOWEST:0
    ,HIGHEST:1 << 30
    ,JUMP_ATTACKS:1 << 1
}

var OVERRIDE_FLAGS = 
{
     NOTHING:0
    ,ALL:1 << 31
    ,NONE:1 << 0
    ,P1:1 << 1,P2:1 << 2,P3:1 << 3
    ,K1:1 << 5,K2:1 << 6,K3:1 << 7
    ,PROJECTILE:1 << 9
    ,HPROJECTILE:1 << 10
};


var RegisteredHit = function(behavior,hitState,flags,frame,damage,energyToAdd,isProjectile,hitX,hitY,attackDirection,who,hitID,priorityFlags,playerPoseState,playerState,fx,fy,otherPlayer,behaviorFlags,invokedAnimationName)
{
    this.BehaviorFlags = behaviorFlags;
    this.HitState = hitState;
    this.Flags = flags;
    this.Frame = frame;
    this.Damage = damage;
    this.EnergyToAdd = energyToAdd;
    this.IsProjectile = isProjectile;
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



var OVERRIDE_FLAGS = 
{
     NULL:1 << 0
    ,NONE:1 << 1
    ,ALL:1 << 30
    ,THROW:1 << 29
    ,P1:1 << 1,P2:1 << 2,P3:1 << 3
    ,K1:1 << 5,K2:1 << 6,K3:1 << 7
    ,PROJECTILE:1 << 9
    ,HPROJECTILE:1 << 10
};



var MoveOverrideFlags = function(allowOverrideFlags,overrideFlags)
{
    this.AllowOverrideFlags = allowOverrideFlags || OVERRIDE_FLAGS.ALL;
    this.OverrideFlags = overrideFlags || OVERRIDE_FLAGS.NULL;
}

MoveOverrideFlags.prototype.HasAllowOverrideFlag = function(flag) { return !!flag && !!(this.AllowOverrideFlags & flag); }
MoveOverrideFlags.prototype.HasOverrideFlag = function(flag) { return !!flag && !!(this.OverrideFlags & flag); }


var ActionDetails = function(overrideFlags,player,otherID,isProjectile,frame,otherPlayer)
{
    this.MoveOverrideFlags = overrideFlags;
    this.Frame = frame || 0;

    this.Key = this.GetKey(player.id_,otherID);
    this.IsProjectile = isProjectile;
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


var ActionSystem = function(actionFrameDelay)
{
    this.Actions = {};
    this.ActionFrameDelay = actionFrameDelay || CONSTANTS.DEFAULT_ACTION_FRAME_DELAY;
}


ActionSystem.prototype.FrameMove = function(frame)
{
    for(var i in this.Actions)
    {
        var item = this.Actions[i];
        if(!!item && !!item.ActionFrame && (item.ActionFrame == frame))
        {
            if(!!item[0] && this.Test(item[0].Key,0))
            {
                /*player 1 registers action*/
                item[0].Player.RegisterHit(frame);
            }
            if(!!item[1] && this.Test(item[1].Key,1))
            {
                /*player 2 registers action*/
                item[1].Player.RegisterHit(frame);
            }
            /*clear the action*/
            this.Actions[i] = null;
        }
    }
}

ActionSystem.prototype.Register = function(details)
{
    if(!this.Actions[details.Key])
        this.Actions[details.Key] = {ActionFrame:details.Frame + this.ActionFrameDelay}
    if(!this.Actions[details.Key][0] || (this.Actions[details.Key][0].PlayerID == details.PlayerID))
        this.Actions[details.Key][0] = details;
    else
        this.Actions[details.Key][1] = details;
}

ActionSystem.prototype.Test = function(key,index)
{
    var first = index == 0 ? this.Actions[key][0] : this.Actions[key][1];
    var second = index == 0 ? this.Actions[key][1] : this.Actions[key][0];

    if(!second)
    {
        if(!first.OtherPlayer)
        {
            return true;
        }
        else
        {
            /*Is the current player doing a move that overrides the one that is hitting him?*/
            if(!!first.Player.currentAnimation_.Animation && first.Player.currentAnimation_.Animation.moveOverrideFlags_.HasOverrideFlag(first.OtherPlayer.currentAnimation_.Animation.moveOverrideFlags_.AllowOverrideFlags))
            {
                first.OtherPlayer.GoToStance(game_.frame_);
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    if(first.MoveOverrideFlags.HasAllowOverrideFlag(OVERRIDE_FLAGS.NONE))
    {
        return false;
    }
    return second.MoveOverrideFlags.HasOverrideFlag(OVERRIDE_FLAGS.ALL)
        || first.MoveOverrideFlags.HasAllowOverrideFlag(OVERRIDE_FLAGS.ALL)
        || second.MoveOverrideFlags.HasOverrideFlag(first.MoveOverrideFlags.AllowOverrideFlags)
        ;
}
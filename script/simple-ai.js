var SimpleAI = function()
{
}


SimpleAI.prototype.FrameMove = function(frame, player)
{
    if(player.flags_.Pose.Has(POSE_FLAGS.ALLOW_BLOCK))
    {
        if(player.IsCrouching())
        {
            player.ExecuteAnimation("crouch block");
        }
        else
        {
            player.ExecuteAnimation("block");
        }
    }
}
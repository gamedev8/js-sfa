
Player.prototype.CreateMBison = function(right,up,left,down,p1,p2,p3,k1,k2,k3)
{
    var player = new Player("mbison",201,right,up,left,down,p1,p2,p3,k1,k2,k3);
    player.defaultShadowImageSrc_ = "200"
    player.circle_.OffsetY = 50;

    var stance = player.AddAnimation(MISC_FLAGS.NONE,"stance",0,["stance"],0,false);
    //stance.poseState_ = POSE_FLAGS.STANDING;
    stance.flags_ = {Player:PLAYER_FLAGS.ALLOW_CHANGE_DIRECTION | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.STANDING};
    stance.AddFrame(player,"","images/misc/mbison/x-stance-1.png",4,{Player:PLAYER_FLAGS.MOBILE});
    stance.AddFrame(player,"","images/misc/mbison/x-stance-0.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-1.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-2.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-3.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-2.png",4);


    return player;
}
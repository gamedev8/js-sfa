
Player.prototype.CreateMBison = function(right,up,left,down,p1,p2,p3,k1,k2,k3)
{
    var player = new Player("mbison",201,right,up,left,down,p1,p2,p3,k1,k2,k3);
    player.defaultShadowImageSrc_ = "200"
    player.circle_.OffsetY = 50;

    var stance = player.AddAnimation(FLAGS.NONE,"stance",0,["stance"],0,false);
    stance.poseState_ = FLAGS.STANDING;
    stance.state_ = FLAGS.ALLOW_CHANGE_DIRECTION | FLAGS.HOLD_ZINDEX;
    stance.AddFrame(player,"","images/misc/mbison/x-stance-1.png",4,FLAGS.MOBILE);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-0.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-1.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-2.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-3.png",4);
    stance.AddFrame(player,"","images/misc/mbison/x-stance-2.png",4);


    return player;
}

Player.prototype.CreateMBison = function(user)
{
    var player = new Player("mbison",201,user);
    var folder = "|images/misc/" + player.folder_;

    player.defaultShadowImageSrc_ = "200"
    player.circle_.OffsetY = 50;

    var stance = player.AddAnimation(MISC_FLAGS.NONE,"stance",0,["stance"],0,false);
    stance.Flags = ({Player:PLAYER_FLAGS.ALLOW_CHANGE_DIRECTION | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.STANDING});
    stance.AddFrame(player,"",folder + "/x-stance-1.png",4,{Player:PLAYER_FLAGS.MOBILE});
    stance.AddFrame(player,"",folder + "/x-stance-0.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-1.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-2.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-3.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-2.png",4);


    return player;
}
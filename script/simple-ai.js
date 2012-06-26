var CreateSimpleRyuAI = function(player)
{
    /*private member*/
    var lightFireballInput_ = [ {IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:false,Button:8} ,{IsDown:true,Button:16} ];
    var mediumFireballInput_ = [ {IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:false,Button:8} ,{IsDown:true,Button:32} ];
    var hardFireballInput_ = [ {IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:false,Button:8} ,{IsDown:true,Button:64} ];

    /*private member*/
    var lightUppercutInput_ = [ {IsDown:true,Button:1} ,{IsDown:false,Button:1} ,{IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:true,Button:16} ];
    var mediumUppercutInput_ = [ {IsDown:true,Button:1} ,{IsDown:false,Button:1} ,{IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:true,Button:32} ];
    var hardUppercutInput_ = [ {IsDown:true,Button:1} ,{IsDown:false,Button:1} ,{IsDown:true,Button:8} ,{IsDown:true,Button:1} ,{IsDown:true,Button:64} ];

    /*private member*/
    var blockInput_ = [{IsDown:true,Button:2}];

    /*private member*/
    var player_ = player;

    /*private function*/
    var GetOtherTeam_ = function()
    {
        if(player_.team_ == 1)
            return player_.GetMatch().teamB_.Players;
        else
            return player_.GetMatch().teamA_.Players;
    }

    /*private member*/
    var IsOtherTeamOnGround_ = function()
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
            if(otherPlayers[i].IsAirborne())
                return false;

        return true;
    }

    /*private member*/
    var GetCloseAirborneEnemy_ = function()
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
        {
            if(otherPlayers[i].IsAirborne())
            {
                if(player_.GetPhysics().IsWithinDistanceX(player_,otherPlayers[i],300))
                {
                    return otherPlayers[i];
                }
            }
        }

        return null;
    }


    /**/
    var SimpleRyuAI = function()
    {
    }



    SimpleRyuAI.prototype.FrameMove = function(frame)
    {
        player_.ClearInput();
        if(player_.flags_.Pose.Has(POSE_FLAGS.ALLOW_BLOCK))
        {
            player_.SendInput(blockInput_);
        }
        else
        {
            /*are all players on the other team on the ground?*/
            if(IsOtherTeamOnGround_())
            {
                player_.SendInput(lightFireballInput_);
            }
            else
            {
                var enemy = GetCloseAirborneEnemy_();
                if(!!enemy)
                {
                    player_.SendInput(hardUppercutInput_);
                }
                else
                {
                    player_.SendInput(lightFireballInput_);
                }
            }
        }
    }

    return new SimpleRyuAI();
}
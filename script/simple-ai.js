var CreateSimpleRyuAI = function(player)
{
    /*private member*/
    var lightSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    /*private member*/
    var lightFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    /*private member*/
    var lightUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:16} ];
    var mediumUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:32} ];
    var hardUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:64} ];

    /*private member*/
    var blockInput_ = [{IsDown:true,Button:BUTTONS.BACK}];

    /*private member*/
    var player_ = player;

    /*private function*/
    var GetOtherTeam_ = function()
    {
        if(player_.team_ == BUTTONS.FORWARD)
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
    var GetAirborneEnemy_ = function(distance)
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
        {
            if(otherPlayers[i].IsAirborne() && otherPlayers[i].IsVulnerable())
            {
                if(player_.GetPhysics().IsWithinDistanceX(player_,otherPlayers[i],distance))
                {
                    return otherPlayers[i];
                }
            }
        }

        return null;
    }

    /*private member*/
    var GetCloseEnemy_ = function(distance)
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
        {
            if(player_.GetPhysics().IsWithinDistanceX(player_,otherPlayers[i],distance))
            {
                return otherPlayers[i];
            }
        }

        return null;
    }


    var ThrowSuperFireball_ = function()
    {
        var energyLevel = player_.GetEnergyLevel();
        if(energyLevel > 0)
        {
            if(Math.floor(Math.random() * 10) > 8)
            {
                var which = Math.floor(Math.random() * energyLevel) + 1
                switch(which)
                {
                    case ENERGYBAR.LEVELMAXED: player_.SendInput(hardSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL2: player_.SendInput(mediumSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL1: player_.SendInput(lightSuperFireballInput_); break;
                    default: return false;

                }
                return true;
            }
        }
        return false;
    }


    /*private member*/
    var ThrowFireball_ = function()
    {
        if(ThrowSuperFireball_())
            return;
        
        if(GetCloseEnemy_(200))
            player_.SendInput(lightFireballInput_);
        else
            player_.SendInput(hardFireballInput_);
    }

    /*private member*/
    var DoUppercut_ = function()
    {
        if(!!GetAirborneEnemy_(200))
        {
            player_.SendInput(lightUppercutInput_);
            return true;
        }
        else if(!!GetAirborneEnemy_(300))
        {
            player_.SendInput(hardUppercutInput_);
            return true;
        }
        return false;
    }

    /**/
    var SimpleRyuAI = function()
    {
    }



    SimpleRyuAI.prototype.FrameMove = function(frame)
    {
        player_.ClearInput();
        if((frame % 20) == 0)
            player.TargetLastAttacker();

        if(player_.flags_.Pose.Has(POSE_FLAGS.ALLOW_BLOCK))
        {
            if(!DoUppercut_())
            {
                player_.SendInput(blockInput_);
            }
        }
        else
        {
            /*are all players on the other team on the ground?*/
            if(IsOtherTeamOnGround_())
            {
                ThrowFireball_();
            }
            else
            {
                if(!DoUppercut_())
                {
                    ThrowFireball_();
                }
            }
        }
    }

    return new SimpleRyuAI();
}
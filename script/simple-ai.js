var CreateSimpleRyuAI = function(player)
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/


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
    var throwInput_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.FORWARD|64}];

    /*private member*/
    var player_ = player;

    /*private member*/
    var inputToSend_ = [];

    /*private function*/
    var GetOtherTeam_ = function()
    {
        if(player_.Team == BUTTONS.FORWARD)
            return player_.getMatch().getTeamB().getPlayers();
        else
            return player_.getMatch().getTeamA().getPlayers();
    }

    /*private member*/
    var IsOtherTeamOnGround_ = function()
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
            if(otherPlayers[i].isAirborne())
                return false;

        return true;
    }

    /*private member*/
    var GetAirborneEnemy_ = function(distance)
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
        {
            if(otherPlayers[i].isAirborne() && otherPlayers[i].isVulnerable())
            {
                if(player_.getPhysics().isWithinDistanceX(player_,otherPlayers[i],distance))
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
            if(player_.getPhysics().isWithinDistanceX(player_,otherPlayers[i],distance))
            {
                return otherPlayers[i];
            }
        }

        return null;
    }


    var ThrowSuperFireball_ = function()
    {
        var energyLevel = player_.getEnergyLevel();
        if(energyLevel > 0)
        {
            if(Math.floor(Math.random() * 10) > 8)
            {
                var which = Math.floor(Math.random() * energyLevel) + 1
                switch(which)
                {
                    case ENERGYBAR.LEVELMAXED: player_.sendInput(hardSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL2: player_.sendInput(mediumSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL1: player_.sendInput(lightSuperFireballInput_); break;
                    default: return false;

                }
                return true;
            }
        }
        return false;
    }

    var SendInput_ = function(frame, input)
    {
        inputToSend_.push({Frame:frame,Input:input});
    }

    /**/
    var DoThrow_ = function(frame)
    {
        SendInput_(frame,[{IsDown:true,Button:BUTTONS.FORWARD}]);
        SendInput_(frame+1,[{IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.HARD_PUNCH}]);
    }

    /*private member*/
    var ThrowFireball_ = function(frame)
    {
        if(ThrowSuperFireball_())
            return;
        if(GetCloseEnemy_(200))
            SendInput_(frame,lightFireballInput_);
        else
            SendInput_(frame,hardFireballInput_);
    }

    /*private member*/
    var DoUppercut_ = function(frame)
    {
        if(!!GetAirborneEnemy_(200))
        {
            SendInput_(frame,lightUppercutInput_);
            return true;
        }
        else if(!!GetAirborneEnemy_(300))
        {
            SendInput_(frame,hardUppercutInput_);
            return true;
        }
        return false;
    }

    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/


    /**/
    var SimpleRyuAI = function()
    {
    }



    SimpleRyuAI.prototype.frameMove = function(frame)
    {
        
        if(inputToSend_.length == 0)
        {
            player_.clearInput();
            if((frame % 20) == 0)
                player.targetLastAttacker(frame);

            if(player_.Flags.Pose.has(POSE_FLAGS.ALLOW_BLOCK))
            {
                if(!DoUppercut_(frame))
                {
                    SendInput_(frame,blockInput_);
                }
            }
            else
            {
                /*are all players on the other team on the ground?*/
                if(IsOtherTeamOnGround_(frame))
                {
                    ThrowFireball_(frame);
                }
                else
                {
                    if(!DoUppercut_(frame))
                    {
                        ThrowFireball_(frame);
                    }
                }
            }
        }

        var i = 0;
        while(i < inputToSend_.length)
        {
            if(inputToSend_[i].Frame == frame)
            {
                player_.sendInput(inputToSend_[i].Input);
                inputToSend_.splice(i,1);
            }
            else
            {
                ++i;
            }
        }
    }

    return new SimpleRyuAI();
}
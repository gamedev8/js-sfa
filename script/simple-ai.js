var CreateSimpleRyuAI = function(player)
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/

    var CreateAction = function(frame,flags,input,action)
    {
        return {Flags:flags||0,Action:action||0,Frame:frame||0,Input:input||[]}
    }

    var RYU_FLAGS =  {
        DONE: 1 << 1
        ,MOVE_TO_ENEMY: 1 << 2
        ,MOBILE_ME: 1 << 3
        ,GROUNDED_ENEMY: 1 << 4
        ,CLEAR_INPUT: 1 << 5
    };

    var RYU_ACTIONS =  {
        ATTACK_SUPER_FB: 1
    };

    /*private member*/
    var lightSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    /*private member*/
    var lightFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    /*private member*/
    var lightSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ];
    var mediumSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ];
    var hardSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.HARD_KICK} ];

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

    /*private member*/
    var combo_ = [];

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
                if(player_.getPhysics().isWithinDistanceX(player_,otherPlayers[i],distance, true))
                {
                    return otherPlayers[i];
                }
            }
        }

        return null;
    }

    /*private member*/
    var GetCloseEnemy_ = function(distance,isAirborne,isVulernable)
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
        {
            if(player_.getPhysics().isWithinDistanceX(player_,otherPlayers[i],distance,true))
            {
                if((isAirborne === undefined || isAirborne == otherPlayers[i].isAirborne()) && (isVulernable === undefined || isVulernable == otherPlayers[i].isVulnerable()))
                {
                    return otherPlayers[i];
                }
            }
        }

        return null;
    }


    var ThrowSuperFireball_ = function(chance)
    {
        var energyLevel = player_.getEnergyLevel();
        if(energyLevel > 0)
        {
            if(Math.floor(Math.random() * 10) > chance)
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

    var SendAction_ = function(action, frame)
    {
        //inputToSend_.push({Frame:frame,Input:input});
        combo_.push(CreateAction(frame,null,null,action));
    }

    var SendInput_ = function(flags, frame, input)
    {
        //combo_.push({Flags:flags,Frame:pressFrame,Input:input});
        combo_.push(CreateAction(frame,flags,input));
    }

    var PressBlock_ = function()
    {
        var blockKey = player_.MustChangeDirection ? BUTTONS.FORWARD : BUTTONS.BACK;
        PressButton_(RYU_FLAGS.NONE,blockKey);
    }

    var PressButton_ = function(flags, button, pressFrame, releaseFrame)
    {
        //combo_.push({Flags:flags,Frame:pressFrame,Input:[{IsDown:true,Button:button}]});
        combo_.push(CreateAction(pressFrame,flags,[{IsDown:true,Button:button}]));
        ReleaseButton_(button,releaseFrame);
    }

    var ReleaseButton_ = function(button, releaseFrame)
    {
        if(!!releaseFrame)
        {
            //combo_.push({Action:0,Frame:releaseFrame,Input:[{IsDown:false,Button:button}]});
            combo_.push(CreateAction(releaseFrame,null,[{IsDown:false,Button:button}]));
        }
    }
    /*AI player will move to the enemy it is facing*/
    var MoveToEnemy_ = function(flags)
    {
        //combo_.push({Flags:flags||0,Action:RYU_ACTIONS.MOVE_TO_ENEMY,Frame:1,Input:[{IsDown:true,Button:BUTTONS.FORWARD}]});
        combo_.push(CreateAction(null,RYU_FLAGS.MOVE_TO_ENEMY|flags,[{IsDown:true,Button:BUTTONS.FORWARD}]));
    }
    /*AI player will move to the enemy it is facing*/
    var StopCombo_ = function()
    {
        //combo_.push({Action:RYU_FLAGS.DONE,Frame:1,Input:[]});
        combo_.push(CreateAction(null,RYU_FLAGS.DONE));
    }
    /*AI player will move to the enemy it is facing*/
    var ClearInput_ = function()
    {
        //combo_.push({Action:RYU_FLAGS.DONE,Frame:1,Input:[]});
        combo_.push(CreateAction(null,RYU_FLAGS.CLEAR_INPUT));
    }

    var ParseAndSendInput_ = function()
    {
        var action = combo_[0].Action;
        if(action == RYU_ACTIONS.ATTACK_SUPER_FB)
        {
            ThrowSuperFireball_(1);
        }
        else
        {
            player_.sendInput(combo_[0].Input);
        }
        combo_.splice(0,1);
    }


    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/


    /**/
    var SimpleRyuAI = function()
    {
    }

    SimpleRyuAI.prototype.reset = function()
    {
        combo_ = [];
        inputToSend_ = [];
        player_.clearInput();
    }

    SimpleRyuAI.prototype.clearInput = function()
    {
        player_.clearInput();
    }

    SimpleRyuAI.prototype.onStartNonAttack = function(frame, attacker)
    {
    }
    //fired when any enemy attack ends
    SimpleRyuAI.prototype.onEnemyEndAttack = function(frame, attacker)
    {
        player_.clearInput();
    }
    //fired when any enemy attack ends
    SimpleRyuAI.prototype.onEnemyVulnerable = function(frame, attacker)
    {
        player_.clearInput();
    }
    //fired every frame an ememy projectile is active
    SimpleRyuAI.prototype.onProjectileMoved = function(frame,id,x,y,projectile)
    {
        if(player_.canBlock())
        {
            PressBlock_();
        }
    }
    //fired when a projectile is off screen
    SimpleRyuAI.prototype.onProjectileGone = function(frame, id)
    {
        this.reset();
    }
    //fired every attack frame
    SimpleRyuAI.prototype.onEnemyContinueAttack = function(frame, attacker, hitPoints)
    {
        var blockKey = player_.MustChangeDirection ?  BUTTONS.FORWARD : BUTTONS.BACK;
        if(player_.canBlock())
        {
            if(attacker.isCrouching() && !player.isKeyState(BUTTONS.CROUCH|blockKey))
            {
                this.reset();
                PressButton_(RYU_FLAGS.NONE,BUTTONS.CROUCH);
                PressButton_(RYU_FLAGS.NONE,blockKey);
                //PressBlock_();
            }
            else if(!attacker.isCrouching() && !player.isKeyState(blockKey))
            {
                this.reset();
                PressButton_(RYU_FLAGS.NONE,blockKey);
                //PressBlock_();
            }
        }
    }
    //fired at the start of any enemy attack
    SimpleRyuAI.prototype.onEnemyStartAttack = function(frame, attacker)
    {
    }


    SimpleRyuAI.prototype.frameMove = function(frame)
    {
        this.handleCombo(frame);
    }


    SimpleRyuAI.prototype.handleCombo = function(frame)
    {
        if(combo_.length > 0)
        {
            if((combo_[0].Frame == 0))
            {
                ParseAndSendInput_();
                this.handleCombo(frame);
            }
            else
            {
                combo_[0].Frame = Math.max(combo_[0].Frame - 1,0);
            }
        }

    }

    return new SimpleRyuAI();
}
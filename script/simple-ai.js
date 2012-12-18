var CreateSimpleRyuAI = function(player)
{
    //*****************************************************
    //******************  PRIVATE STATE    ****************
    //*****************************************************

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
        ,CLEAR_OTHER_INPUT: 1 << 6
        ,RESET: 1 << 7
    };

    var RYU_ACTIONS =  {
        ATTACK_SUPER_FB: 1
    };

    //private member
    var lightSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    //private member
    var lightFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    //private member
    var lightSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ];
    var mediumSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ];
    var hardSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.HARD_KICK} ];

    //private member
    var lightUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:16} ];
    var mediumUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:32} ];
    var hardUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:64} ];

    var kicks_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var punches_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];
    var lowKicks_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var lowPunches_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];
    var jumpIn_ = [ {IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var jumpOut_ = [ {IsDown:true,Button:BUTTONS.BACK}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var crouch_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ];
    var allowOverrideBlock_ = true;
    //private member
    var blockInput_ = [{IsDown:true,Button:BUTTONS.BACK}];

    //private member
    var stopBlockInput_ = [{IsDown:false,Button:BUTTONS.BACK}];

    //private member
    var clearInput_ = [{IsDown:false,Button:BUTTONS.BACK},{IsDown:false,Button:BUTTONS.JUMP},{IsDown:false,Button:BUTTONS.CROUCH},{IsDown:false,Button:BUTTONS.FORWARD},{IsDown:false,Button:BUTTONS.LIGHT_PUNCH},{IsDown:false,Button:BUTTONS.MEDIUM_PUNCH},{IsDown:false,Button:BUTTONS.HARD_PUNCH},{IsDown:false,Button:BUTTONS.LIGHT_KICK},{IsDown:false,Button:BUTTONS.MEDIUM_KICK},{IsDown:false,Button:BUTTONS.HARD_KICK}];
    var getOtherInputCleared_ = function(button)
    {
        return clearInput_.filter(function(a) { return a.Button != button; });
    }

    //private member
    var fwd_ = [{IsDown:true,Button:BUTTONS.FORWARD}];

    //private member
    var bk_ = [{IsDown:true,Button:BUTTONS.BACK}];

    //private member
    var throwInput1_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.HARD_PUNCH}];
    var throwInput2_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.HARD_KICK}];

    //private member
    var player_ = player;

    //private member
    var inputToSend_ = [];

    //private member
    var combo_ = [];

    //private function
    var GetOtherTeam_ = function()
    {
        if(player_.Team == BUTTONS.FORWARD)
            return player_.getMatch().getTeamB().getPlayers();
        else
            return player_.getMatch().getTeamA().getPlayers();
    }

    //private member
    var IsOtherTeamOnGround_ = function()
    {
        var otherPlayers = GetOtherTeam_();
        for(var i = 0; i < otherPlayers.length; ++i)
            if(otherPlayers[i].isAirborne())
                return false;

        return true;
    }

    //private member
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

    //private member
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


    var ThrowSuperFireball_ = function()
    {
        var energyLevel = player_.getEnergyLevel();
        if(energyLevel > 0)
        {
            if(getRand() > 50)
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

    var GetForwardKey_ = function() {player_.MustChangeDirection ? BUTTONS.BACK : BUTTONS.FORWARD;}

    var WanderForward_ = function(nbFrames)
    {
        combo_.push(CreateAction(0,null,fwd_));
        combo_.push(CreateAction(nbFrames,RYU_FLAGS.CLEAR_INPUT));
    }

    var WanderBackward_ = function(nbFrames)
    {
        combo_.push(CreateAction(0,null,bk_));
        combo_.push(CreateAction(nbFrames,RYU_FLAGS.CLEAR_INPUT));
    }

    var ExecuteThrow_ = function(which)
    {
        MoveToEnemy_();
        combo_.push(CreateAction(0,null,fwd_));
        if(!which)
            combo_.push(CreateAction(5,null,punches_[1]));
        else
            combo_.push(CreateAction(5,null,kicks_[1]));
        combo_.push(CreateAction(6,RYU_FLAGS.CLEAR_INPUT));
    }

    var ExecuteFireball_ = function(rnd)
    {
        if(!player_.isMobile())
            return false;
        if(rnd > 66)
        {
            combo_.push(CreateAction(0,RYU_FLAGS.CLEAR_INPUT,lightFireballInput_));
            combo_.push(CreateAction(1,RYU_FLAGS.CLEAR_INPUT));
            return true;
        }
        else
        {
            combo_.push(CreateAction(0,RYU_FLAGS.CLEAR_INPUT,hardFireballInput_));
            combo_.push(CreateAction(1,RYU_FLAGS.CLEAR_INPUT));
            return true;
        }
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
        PressButton_(RYU_FLAGS.CLEAR_OTHER_INPUT,blockKey);
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
    //AI player will move to the enemy it is facing
    var MoveToEnemy_ = function(flags)
    {
        //combo_.push({Flags:flags||0,Action:RYU_ACTIONS.MOVE_TO_ENEMY,Frame:1,Input:[{IsDown:true,Button:BUTTONS.FORWARD}]});
        combo_.push(CreateAction(null,RYU_FLAGS.MOVE_TO_ENEMY|flags,[{IsDown:true,Button:BUTTONS.FORWARD}]));
    }
    //AI player will move to the enemy it is facing
    var StopCombo_ = function()
    {
        combo_.push(CreateAction(null,RYU_FLAGS.RESET));
    }
    //AI player will move to the enemy it is facing
    var ClearInput_ = function()
    {
        //combo_.push({Action:RYU_FLAGS.DONE,Frame:1,Input:[]});
        combo_.push(CreateAction(null,RYU_FLAGS.CLEAR_INPUT));
    }

    var ParseAndSendInput_ = function()
    {
        var retVal = 1;

        var action = combo_[0].Action;
        var canClear = true;
        if(hasFlag(combo_[0].Flags, RYU_FLAGS.CLEAR_INPUT))
        {
            player_.clearInput();
        }
        else if(hasFlag(combo_[0].Flags, RYU_FLAGS.RESET))
        {
            this.reset();
            return null;
        }
        else if(hasFlag(combo_[0].Flags, RYU_FLAGS.CLEAR_OTHER_INPUT))
        {
            player_.sendInput(getOtherInputCleared_(combo_[0].Button));
        }
        if(hasFlag(combo_[0].Flags, RYU_FLAGS.MOVE_TO_ENEMY))
        {
            if(GetCloseEnemy_(0))
            {
                player_.sendInput(stopBlockInput_);
            }
            else
            {
                canClear = false;
                retVal = null;
            }
        }


        player_.sendInput(combo_[0].Input);
        if(!!canClear)
            combo_.splice(0,1);

        return retVal;
    }


    //*****************************************************
    //******************  PUBLIC  STATE    ****************
    //*****************************************************


    //
    var SimpleRyuAI = function()
    {
    }

    SimpleRyuAI.prototype.reset = function()
    {
        combo_ = [];
        inputToSend_ = [];
        player_.clearInput();
        allowOverrideBlock_ = true;
    }

    SimpleRyuAI.prototype.test = function()
    {
    }

    SimpleRyuAI.prototype.clearInput = function()
    {
        player_.clearInput();
    }

    SimpleRyuAI.prototype.onStartNonAttack = function(frame, attacker)
    {
    }
    //fired when the player gets hit
    SimpleRyuAI.prototype.onTakeHit = function(frame, attacker)
    {
        this.reset();
    }
    //fired when the player gets hit
    SimpleRyuAI.prototype.onBlocked = function(frame, attacker)
    {
        //this.reset();
        //this.react(frame, attacker)
        allowOverrideBlock_ = true;
    }
    //fired when any enemy attack ends
    SimpleRyuAI.prototype.onEnemyEndAttack = function(frame, attacker)
    {
        ClearInput_();
    }
    //fired when any enemy attack ends
    SimpleRyuAI.prototype.onEnemyVulnerable = function(frame, attacker)
    {
        ClearInput_();
        this.react(frame, attacker)
    }
    //fired every frame an ememy projectile is active
    SimpleRyuAI.prototype.onProjectileMoved = function(frame,id,x,y,projectile)
    {
        var blockKey = player_.MustChangeDirection ?  BUTTONS.FORWARD : BUTTONS.BACK;
        if(player_.canBlock() && !player.isKeyDown(blockKey))
        {
            //PressBlock_();
            this.reset();
            allowOverrideBlock_ = false;
            PressButton_(RYU_FLAGS.NONE,blockKey);
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
            if(attacker.isCrouching() && (!player.isKeyDown(BUTTONS.CROUCH) || !player.isKeyDown(blockKey)))
            {
                this.reset();
                allowOverrideBlock_ = false;
                PressButton_(RYU_FLAGS.NONE,BUTTONS.CROUCH);
                PressButton_(RYU_FLAGS.NONE,blockKey);
            }
            else if(!attacker.isCrouching() && !player.isKeyDown(blockKey))
            {
                this.reset();
                allowOverrideBlock_ = false;
                PressButton_(RYU_FLAGS.NONE,blockKey);
            }
        }
    }

    //fired at the start of any enemy attack
    SimpleRyuAI.prototype.onEnemyStartAttack = function(frame, attacker)
    {
    }

    //fired at the start of any enemy attack
    SimpleRyuAI.prototype.onStartAttack = function()
    {
        //player_.clearInput();
    }

    SimpleRyuAI.prototype.reactAirborne = function(frame,attacker)
    {
        var retVal = false;
        if(!player.isMobile())
            return retVal;

        var rnd = getRand();
        if(GetAirborneEnemy_(50))
        {
            if(rnd > 90)
            {
                this.reset();
                SendInput_(RYU_FLAGS.CLEAR_INPUT,0,kicks_[2]);
                SendInput_(RYU_FLAGS.CLEAR_INPUT,20);
                retVal = true;
            }
            else if(rnd > 50)
            {
                this.reset();
                SendInput_(RYU_FLAGS.CLEAR_INPUT,0,lightUppercutInput_);
                SendInput_(RYU_FLAGS.CLEAR_INPUT,20);
                retVal = true;
            }
            else if(rnd > 40)
            {
                this.reset();
                SendInput_(RYU_FLAGS.CLEAR_INPUT,0,hardUppercutInput_);
                SendInput_(RYU_FLAGS.CLEAR_INPUT,20);
                retVal = true;
            }
        }
        if(GetAirborneEnemy_(100))
        {
            if(rnd > 90)
            {
                this.reset();
                SendInput_(RYU_FLAGS.CLEAR_INPUT,0,kicks_[2]);
                SendInput_(RYU_FLAGS.CLEAR_INPUT,20);
                retVal = true;
            }
            else if(rnd > 50)
            {
                this.reset();
                SendInput_(RYU_FLAGS.CLEAR_INPUT,0,lightUppercutInput_);
                SendInput_(RYU_FLAGS.CLEAR_INPUT,20);
                retVal = true;
            }
        }
        return retVal;
    }

    SimpleRyuAI.prototype.reactNotAirborne = function(frame,attacker)
    {
        var retVal = false;
        if(!player.isMobile())
            return retVal;

        var rnd = getRand();
        if(rnd > 50)
        {
        }
        else
        {
        }

        return retVal;
    }

    SimpleRyuAI.prototype.onEnemyDizzy = function(frame,attacker)
    {
        ThrowSuperFireball_();
    }

    SimpleRyuAI.prototype.react = function(frame,attacker)
    {
        if(!player.isMobile())
            return;
        if(!!this.reactAirborne(frame,attacker))
        {
        }
        else if(!!this.reactNotAirborne(frame,null))
        {
        }
    }

    SimpleRyuAI.prototype.proact = function(frame)
    {
        if(!player.isMobile())
            return;
        var rnd = getRand();
        if(!!this.reactAirborne(frame,null))
        {
        }
        else if(!!GetCloseEnemy_(50))
        {
            if(combo_.length == 0)
            {
                if(rnd > 50)
                {
                    this.reset();
                    ExecuteThrow_();
                }
                else
                {
                    this.reset();
                    ExecuteThrow_(1);
                }
            }
        }
        else
        {
            if(rnd > 98)
            {
                this.reset();
                ExecuteThrow_();
            }
            else if(rnd > 95)
            {
                this.reset();
                ExecuteFireball_(getRand());
            }
            else if(rnd > 92)
            {
                this.reset();
                WanderForward_(10);
            }
            else if(rnd > 90)
            {
                this.reset();
                WanderBackward_(10);
            }
        }
    }

    SimpleRyuAI.prototype.process = function(frame)
    {
        if(!allowOverrideBlock_ && !player_.canBlock())
            allowOverrideBlock_ = true;

        if(!!allowOverrideBlock_)
        {
            if(!player.isMobile())
                return;

            var rnd = getRand();
            this.proact(frame);
        }
    }


    SimpleRyuAI.prototype.frameMove = function(frame)
    {
        this.handleCombo(frame);
        this.process(frame);
    }


    SimpleRyuAI.prototype.handleCombo = function(frame)
    {
        if(combo_.length > 0)
        {
            if((combo_[0].Frame == 0))
            {
                var retVal = ParseAndSendInput_();
                switch(retVal)
                {
                    case 1: { this.handleCombo(frame); break; }
                    default: break;
                }
            }
            else
            {
                combo_[0].Frame = Math.max(combo_[0].Frame - 1,0);
            }
        }
    }

    return new SimpleRyuAI();
}
var CreateAkumaAI = function(player)
{
    //*****************************************************
    //******************  PRIVATE STATE    ****************
    //*****************************************************

    var FLAGS =  {
        DONE: 1 << 1
        ,MOVE_TO_ENEMY: 1 << 2
        ,MOBILE_ME: 1 << 3
        ,GROUNDED_ENEMY: 1 << 4
        ,CLEAR_INPUT: 1 << 5
        ,CLEAR_OTHER_INPUT: 1 << 6
        ,RESET: 1 << 7
        ,JUMP_IN: 1 << 8
        ,CANCEL_IF_ANIMATION_CHANGED: 1 << 9
        ,ROLL_TO_ENEMY: 1 << 10
    };
    //private member
    var teleportCloseBackInput_ = [ {IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ,{IsDown:true,Button:BUTTONS.HARD_PUNCH} ];
    var teleportFarBackInput_ = [ {IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ,{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ,{IsDown:true,Button:BUTTONS.HARD_KICK} ];
    var teleportCloseFowardInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ,{IsDown:true,Button:BUTTONS.HARD_PUNCH} ];
    var teleportFarForwardInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ,{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ,{IsDown:true,Button:BUTTONS.HARD_KICK} ];


    //private member
    var lightSuperUppercutInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumSuperUppercutInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardSuperUppercutInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    //private member
    var lightSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:LIGHT_KICK} ];
    var mediumSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:MEDIUM_KICK} ];
    var hardSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:HARD_KICK} ];

    //private member
    var lightAirSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:LIGHT_PUNCH} ];
    var mediumAirSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:MEDIUM_PUNCH} ];
    var hardAirSuperFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:HARD_PUNCH} ];

    //private member
    var lightFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:16} ];
    var mediumFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:32} ];
    var hardFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:64} ];

    //private member
    var lightRedFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:LIGHT_KICK} ];
    var mediumRedFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:MEDIUM_KICK} ];
    var hardRedFireballInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:HARD_KICK} ];

    //private member
    var lightSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ];
    var mediumSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ];
    var hardSKickInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.HARD_KICK} ];

    var hardRollInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.HARD_PUNCH} ];
    var mediumRollInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ];
    var lightRollInput_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ];

    //private member
    var lightUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:16} ];
    var mediumUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:32} ];
    var hardUppercutInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:64} ];

    var kicks_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var punches_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.HARD_PUNCH} ], [ {IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ];
    var lowKicks_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var lowPunches_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];
    var jump_ = [ {IsDown:true,Button:BUTTONS.JUMP} ];
    var jumpInInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var jumpOutInput_ = [ {IsDown:true,Button:BUTTONS.BACK}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var crouch_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ];

    var blockInput_ = [{IsDown:true,Button:BUTTONS.BACK}];
    var stopBlockInput_ = [{IsDown:false,Button:BUTTONS.BACK}];

    var fwd_ = [{IsDown:true,Button:BUTTONS.FORWARD}];
    var bk_ = [{IsDown:true,Button:BUTTONS.BACK}];

    var throwInput1_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.HARD_PUNCH}];
    var throwInput2_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.HARD_KICK}];

    ////////////////////////




    //*****************************************************
    //******************  PUBLIC  STATE    ****************
    //*****************************************************


    //
    var AkumaAI = function()
    {
        this.AI = CreateGenericAI(player);
        this.initCombos();
    }

    AkumaAI.prototype.initCombos = function()
    {
        this.AI.SingleMoves = {
            "u1" : [{A:0, B:"u1"}]
            ,"u2" : [{A:0, B:"u2"}]
            ,"u3" : [{A:0, B:"u3"}]
            ,"lp3" : [{A:0, B:"lp3"}]
            ,"p1" : [{A:0, B:"p1"}]
            ,"p2" : [{A:0, B:"p2"}]
            ,"p3" : [{A:0, B:"p3"}]
            ,"k1" : [{A:0, B:"k1"}]
            ,"k2" : [{A:0, B:"k2"}]
            ,"k3" : [{A:0, B:"k3"}]
        };
    }



    AkumaAI.prototype.throwSuperFireball = function(forced)
    {
        var energyLevel = this.AI.Player.getEnergyLevel();
        if(energyLevel > 0)
        {
            if((getRand() > 50) || !!forced)
            {
                var which = Math.floor(Math.random() * energyLevel) + 1
                switch(which)
                {
                    case ENERGYBAR.LEVELMAXED: this.reset(); this.AI.Player.sendInput(hardSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL2: this.reset(); this.AI.Player.sendInput(mediumSuperFireballInput_); break;
                    case ENERGYBAR.LEVEL1: this.reset(); this.AI.Player.sendInput(lightSuperFireballInput_); break;
                    default: return false;
                }
                
                this.AI.sendInput(FLAGS.CLEAR_INPUT,10);
                return true;
            }
        }
        return false;
    }

    AkumaAI.prototype.getForwardKey = function() {this.AI.Player.MustChangeDirection ? BUTTONS.BACK : BUTTONS.FORWARD;}
    AkumaAI.prototype.wanderForward = function(nbFrames) { this.AI.Actions.push(this.AI.createAction(0,null,fwd_)); this.AI.Actions.push(this.AI.createAction(nbFrames,FLAGS.CLEAR_INPUT)); }
    AkumaAI.prototype.wanderBackward = function(nbFrames) { this.AI.Actions.push(this.AI.createAction(0,null,bk_)); this.AI.Actions.push(this.AI.createAction(nbFrames,FLAGS.CLEAR_INPUT)); }

    AkumaAI.prototype.executeThrow = function(which,igoreMoveToEnemy)
    {
        if(!igoreMoveToEnemy)
            this.AI.moveToEnemy();
        this.AI.Actions.push(this.AI.createAction(0,null,fwd_));
        if(!which)
            this.AI.Actions.push(this.AI.createAction(0,null,punches_[1]));
        else
            this.AI.Actions.push(this.AI.createAction(0,null,kicks_[1]));
        this.AI.Actions.push(this.AI.createAction(CONSTANTS.ATTACKBUTTON_FRAMES,FLAGS.CLEAR_INPUT));
    }

    AkumaAI.prototype.executeFireball = function(rnd)
    {
        rnd = rnd || getRand();
        if(!this.AI.Player.isMobile())
            return false;
        if(rnd > 66)
        {
            this.AI.Actions.push(this.AI.createAction(0,FLAGS.CLEAR_INPUT,lightFireballInput_));
            this.AI.Actions.push(this.AI.createAction(1,FLAGS.CLEAR_INPUT));
            return true;
        }
        else
        {
            this.AI.Actions.push(this.AI.createAction(0,FLAGS.CLEAR_INPUT,hardFireballInput_));
            this.AI.Actions.push(this.AI.createAction(1,FLAGS.CLEAR_INPUT));
            return true;
        }
    }


    AkumaAI.prototype.parseAndSendInput = function()
    {
        return this.AI.parseAndSendInput();
    }

    AkumaAI.prototype.onNewRound = function()
    {
        this.AI.reset();
    }

    AkumaAI.prototype.reset = function()
    {
        this.AI.reset();
    }

    AkumaAI.prototype.test = function()
    {
    }

    AkumaAI.prototype.clearInput = function()
    {
        this.AI.clearInput();
    }

    AkumaAI.prototype.onStartNonAttack = function(frame, attacker)
    {
        this.AI.onStartNonAttack(frame,attacker);
    }
    //fired when the player gets hit
    AkumaAI.prototype.onTakeHit = function(frame, attacker)
    {
        this.AI.onTakeHit(frame, attacker);
    }
    //fired when the player gets hit
    AkumaAI.prototype.onBlocked = function(frame, attacker)
    {
        this.AI.onBlocked(frame,attacker);
    }
    //fired when any enemy attack ends
    AkumaAI.prototype.onEnemyEndAttack = function(frame, attacker)
    {
        this.reactAirborne(frame,attacker);
        this.AI.clearInput();
    }
    //fired when any enemy attack ends
    AkumaAI.prototype.onEnemyVulnerable = function(frame, attacker)
    {
        this.AI.clearInput();
        this.react(frame, attacker)
    }
    //fired every frame an enemy attack is pending
    AkumaAI.prototype.onEnemyAttackPending = function(frame,x,y,player,isSuperMove)
    {
    }
    //fired every frame an enemy projectile is pending
    AkumaAI.prototype.onEnemyProjectilePending = function(frame,x,y,player,isSuperMove)
    {
        //just before the projectile is actually thrown, the attacker will be used instead of the projectile
        //if the player is facing the projectile, then counter it
        if(!this.AI.isProjectileReactBusy() 
            && !this.AI.Player.isAirborne() 
            && !this.AI.Player.isBlocking() 
            && !!this.AI.Player.isMobile()
            && !isSuperMove
            && this.AI.Player.isFacingPlayer(player))
        {
            var dist = this.AI.Player.getDistanceFromSq(x,y);
        }
    }


    //fired every frame an enemy projectile is active
    AkumaAI.prototype.onEnemyProjectileMoved = function(frame,id,x,y,projectile,isSuperMove)
    {
        if(!!this.AI.IgnoreProjectileGone)
            return;
        if(!this.AI.Player.isAirborne()
            && this.AI.Actions.length == 0 
            && !this.AI.Player.isBlocking() 
            && !!this.AI.Player.isMobile()
            && !isSuperMove
            && this.AI.Player.isFacingProjectile(projectile))
        {
            var dist = this.AI.Player.getDistanceFromSq(x,y);

        }
        this.AI.onEnemyProjectileMoved(frame,x,y,projectile,isSuperMove);
    }
    //fired when a projectile is off screen
    AkumaAI.prototype.onEnemyProjectileGone = function(frame, id)
    {
        this.AI.onEnemyProjectileGone();
    }
    //fired when an enemy has been hit
    AkumaAI.prototype.onAttackStateChanged = function(who,state)
    {
        this.AI.onAttackStateChanged(who,state);
    }
    //fired every attack frame
    AkumaAI.prototype.onEnemyContinueAttack = function(frame, attacker, hitPoints)
    {
        this.AI.onEnemyContinueAttack(frame,attacker,hitPoints);
        this.reactAirborne(frame,attacker);
    }

    //fired at the start of any enemy attack
    AkumaAI.prototype.onEnemyStartAttack = function(frame, attacker)
    {
        this.AI.onEnemyStartAttack(frame,attacker);
    }

    //fired at the start of any enemy attack
    AkumaAI.prototype.onStartAttack = function()
    {
        this.AI.onStartAttack();
    }

    //fired at the end of any attack
    AkumaAI.prototype.onAnimationEnded = function(name)
    {
        this.AI.onAnimationEnded();
    }

    //fired at the start of any attack
    AkumaAI.prototype.onAnimationChanged = function(name)
    {
        this.AI.onAnimationChanged(name);
    }

    AkumaAI.prototype.reactAirborne = function(frame,attacker)
    {
        var retVal = false;

        if(!this.AI.Player.isMobile())
            return retVal;

        if(!this.AI.Player.isBlocking())
        {
            if(this.AI.isAirborneReactBusy())
                return retVal;
        }
        
        var nbFrames = this.AI.Player.isBlocking() ? 4 : 0;
        var item = this.AI.getClosestAirborneEnemy();

        var rnd = getRand();

        return retVal;
    }

    AkumaAI.prototype.reactNotAirborne = function(frame,attacker)
    {
        var retVal = false;
        if(!this.AI.Player.isMobile())
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

    AkumaAI.prototype.doMove = function(key) { this.execute(this.AI.SingleMoves[key]); }

    AkumaAI.prototype.execute = function(sequence)
    {
        var input = null;
        for(var i = 0; i < sequence.length; ++i)
        {
            input = null;
            switch(sequence[i].B)
            {
                case "get_close" : { this.AI.moveToEnemy(0,sequence[i].C); break; } case "jump_in" : { if(this.AI.getClosestEnemy().X < (sequence[i].D || this.AI.TOO_CLOSE)) { return; }; this.AI.jumpInToEnemy(0,sequence[i].C); break; }
                case "j" : { this.AI.jumpUp(); break; } case "fj" : { this.AI.jumpTowardEnemy(); break; } case "bj" : { this.AI.jumpAwayFromEnemy(); break; }
                case "lp1" : { input = lowPunches_[0]; break; } case "lp2" : { input = lowPunches_[1]; break; } case "lp3" : { input = lowPunches_[2]; break; }
                case "p1" : { input = punches_[0]; break; } case "p2" : { input = punches_[1]; break; } case "fp2" : { input = punches_[3]; break; } case "p3" : { input = punches_[2]; break; }
                case "k1" : { input = kicks_[0]; break; } case "k2" : { input = kicks_[1]; break; } case "k3" : { input = kicks_[2]; break; }
                case "lk1" : { input = lowKicks_[0]; break; } case "lk2" : { input = lowKicks_[1]; break; } case "lk3" : { input = lowKicks_[2]; break; }
                case "fb1" : { input = lightFireballInput_; break; } case "fb2" : { input = mediumFireballInput_; break; } case "fb3" : { input = hardFireballInput_; break; }
                case "rfb1" : { input = lightRedFireballInput_; break; } case "rfb2" : { input = mediumRedFireballInput_; break; } case "rfb3" : { input = hardRedFireballInput_; break; }
                case "sfb1" : { input = lightSuperFireballInput_; break; } case "sfb2" : { input = mediumSuperFireballInput_; break; } case "sfb3" : { input = hardSuperFireballInput_; break; }
                case "su1" : { input = lightSuperUppercutInput_; break; } case "su2" : { input = mediumSuperUppercutInput_; break; } case "su3" : { input = hardSuperUppercutInput_; break; }
                case "hk1" : { input = lightSKickInput_; break; } case "hk2" : { input = mediumSKickInput_; break; } case "hk3" : { input = hardSKickInput_; break; }
                case "u1" : { input = lightUppercutInput_; break; } case "u2" : { input = mediumUppercutInput_; break; } case "u3" : { input = hardUppercutInput_; break; }
                case "t1" : { this.executeThrow(0,true); break; } case "t2" : { this.executeThrow(1,true); break; }
            };
            this.AI.sendInput(FLAGS.CLEAR_INPUT,sequence[i].A || 0,input,sequence[i].H);
        }
        this.AI.sendInput(FLAGS.CLEAR_INPUT,2);
    }

    AkumaAI.prototype.onEnemyDizzy = function(frame,attacker)
    {
        this.AI.reset();
        this.throwSuperFireball();
        this.AI.setBusy();
    }

    AkumaAI.prototype.react = function(frame,attacker)
    {
        if(!this.AI.Player.isMobile())
            return;
        if(!!this.reactAirborne(frame,attacker))
        {
        }
        else if(!!this.reactNotAirborne(frame,null))
        {
        }
    }

    AkumaAI.prototype.proact = function(frame)
    {
        if(!this.AI.Player.isMobile())
            return;

        if(!!this.reactAirborne(frame,null))
            return;

        var item = this.AI.getClosestEnemy();

        var rnd = getRand();
        var ignoreSetBusy = false;

        if(this.AI.Actions.length != 0)
            return;
    }

    AkumaAI.prototype.process = function(frame)
    {
        if(!this.AI.AllowOverrideBlock && !this.AI.Player.canBlock())
            this.AI.AllowOverrideBlock = true;

        if(!!this.AI.AllowOverrideBlock)
        {
            if(!this.AI.Player.isMobile())
            {
                if(!!this.AI.JustAttacked)
                    this.AI.JustBecameMobile = 3;
                return;
            }

            var rnd = getRand();
            this.proact(frame);

            this.AI.JustAttacked = false;
            this.AI.JustBecameMobile = (this.AI.JustBecameMobile > 0) ? this.AI.JustBecameMobile - 1 : 0;
        }
    }


    AkumaAI.prototype.frameMove = function(frame)
    {
        this.handleCombo(frame);
        this.process(frame);
    }


    AkumaAI.prototype.handleCombo = function(frame)
    {
        if(this.AI.Actions.length > 0)
        {
            if((this.AI.Actions[0].Frame == 0))
            {
                var retVal = this.parseAndSendInput();
                switch(retVal)
                {
                    case 1: { this.handleCombo(frame); break; }
                    default: break;
                }
            }
            else
            {
                this.AI.Actions[0].Frame = Math.max(this.AI.Actions[0].Frame - 1,0);
            }
        }
    }

    return new AkumaAI();

}

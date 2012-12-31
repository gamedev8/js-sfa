var CreateMbisonAI = function(player)
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
    var teleportFarInput_ = [ {IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ];
    var teleportMiddleInput_ = [ {IsDown:true,Button:BUTTONS.BACK} ,{IsDown:false,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.BACK} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ];
    var teleportFrontInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ];
    var teleportBehindInput_ = [ {IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:false,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.CROUCH} ,{IsDown:true,Button:BUTTONS.FORWARD} ,{IsDown:true,Button:BUTTONS.LIGHT_KICK} ];

    var jkicks_ = [ [ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var jpunches_ = [ [ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.JUMP},{IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];

    var fkicks_ = [ [ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var fpunches_ = [ [ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.FORWARD},{IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];

    var kicks_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var punches_ = [ [ {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.HARD_PUNCH} ], [ {IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ];
    var lowKicks_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_KICK} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_KICK} ] ];
    var lowPunches_ = [ [ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.LIGHT_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.MEDIUM_PUNCH} ] ,[ {IsDown:true,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.HARD_PUNCH} ] ];
    var jump_ = [ {IsDown:false,Button:BUTTONS.CROUCH}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var jumpInInput = [ {IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var jumpOutInput = [ {IsDown:true,Button:BUTTONS.BACK}, {IsDown:true,Button:BUTTONS.JUMP} ];
    var crouch_ = [ {IsDown:true,Button:BUTTONS.CROUCH} ];
    var crouchBack_ = [  {IsDown:true,Button:BUTTONS.BACK},{IsDown:true,Button:BUTTONS.CROUCH} ];

    var blockInput_ = [{IsDown:true,Button:BUTTONS.BACK}];
    var stopBlockInput_ = [{IsDown:false,Button:BUTTONS.BACK}];

    var fwd_ = [{IsDown:false,Button:BUTTONS.BACK},{IsDown:true,Button:BUTTONS.FORWARD}];
    var bk_ = [{IsDown:true,Button:BUTTONS.BACK},{IsDown:false,Button:BUTTONS.FORWARD}];

    var throwInput1_ = [{IsDown:true,Button:BUTTONS.FORWARD}, {IsDown:true,Button:BUTTONS.HARD_PUNCH}];

    ////////////////////////




    //*****************************************************
    //******************  PUBLIC  STATE    ****************
    //*****************************************************


    //
    var MBisonAI = function()
    {
        this.AI = CreateGenericAI(player);
        this.initCombos();
    }

    MBisonAI.prototype.initCombos = function()
    {
        this.AI.SingleMoves = {
            "tf" : [{A:0, B:"tf"}]
            ,"tm" : [{A:0, B:"tm"}]
            ,"ti" : [{A:0, B:"ti"}]
            ,"tb" : [{A:0, B:"tb"}]
            ,"lp3" : [{A:0, B:"lp3"}]
            ,"lk3" : [{A:0, B:"lk3"}]
            ,"p1" : [{A:0, B:"p1"}]
            ,"p2" : [{A:0, B:"p2"}]
            ,"p3" : [{A:0, B:"p3"}]
            ,"k1" : [{A:0, B:"k1"}]
            ,"k2" : [{A:0, B:"k2"}]
            ,"k3" : [{A:0, B:"k3"}]
        };

        this.AI.VeryCloseCombos = [
             [{A:0,B:"get_close", C:CONSTANTS.GRAPPLE_DISTANCE+30,D:-999}, {A:0,B:"t1"}]
        ];

        this.AI.CloseCombos = [
             [{A:0,B:"get_close", C:CONSTANTS.GRAPPLE_DISTANCE+30,D:-999}, {A:0,B:"t1"}]
             ,[{A:0,B:"get_close",C:130},{A:0,B:"k2"}]
             ,[{A:0,B:"get_close",C:130},{A:0,B:"k2"},{A:12,B:"tf"}]
             ,[{A:0,B:"lk3"},{A:10,B:"tf"}]
             ,[{A:0,B:"lk3"},{A:20,B:"k2"}]
        ];

        this.AI.JumpInCombos = [
        ];

        this.AI.CounterProjectileCombos = [
            [{A:0,B:"tb"},{A:26,B:"ti"}]
            ,[{A:1,B:"jump_in"},{A:26,B:"k3"},{A:24,B:"k3"},{A:24,B:"k2"}]
            ,[{A:1,B:"jump_in"},{A:26,B:"k3"},{A:24,B:"k3"}]
            ,[{A:1,B:"jump_in"},{A:26,B:"k3"},{A:24,B:"p2"}]
            ,[{A:1,B:"jump_in"},{A:26,B:"k3"},{A:24,B:"k2"}]
            ,[]
        ];

        this.AI.CounterProjectileMovedCombos = [
            [{A:5,B:"tb"},{A:26,B:"ti"}]
            ,[{A:5,B:"ti"}]
            ,[]
        ];

        this.AI.CounterAttackCombos = [
            [{A:0,B:"tm"}]
            ,[{A:0,B:"tf"}]
            ,[]
        ];

        this.AI.RollInCombos = [
        ];

        this.AI.CounterCloseJumpInCombos = [
        ];
    }



    MBisonAI.prototype.throwSuperFireball = function()
    {
        var energyLevel = this.AI.Player.getEnergyLevel();
        if(energyLevel > 0)
        {
            if(getRand() > 50)
            {
                var which = Math.floor(Math.random() * energyLevel) + 1
                switch(which)
                {
                    case ENERGYBAR.LEVELMAXED: this.AI.Player.sendInput([]); break;
                    case ENERGYBAR.LEVEL2: this.AI.Player.sendInput([]); break;
                    case ENERGYBAR.LEVEL1: this.AI.Player.sendInput([]); break;
                    default: return false;
                }
                this.AI.sendInput(FLAGS.CLEAR_INPUT,10);
                return true;
            }
        }
        return false;
    }

    MBisonAI.prototype.getForwardKey = function() {this.AI.Player.MustChangeDirection ? BUTTONS.BACK : BUTTONS.FORWARD;}
    MBisonAI.prototype.wanderForward = function(nbFrames) { this.AI.Actions.push(this.AI.createAction(0,null,fwd_)); this.AI.Actions.push(this.AI.createAction(nbFrames,FLAGS.CLEAR_INPUT)); }
    MBisonAI.prototype.wanderBackward = function(nbFrames) { this.AI.Actions.push(this.AI.createAction(0,null,bk_)); this.AI.Actions.push(this.AI.createAction(nbFrames,FLAGS.CLEAR_INPUT)); }

    MBisonAI.prototype.executeThrow = function(which,igoreMoveToEnemy)
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

    MBisonAI.prototype.executeFireball = function(which)
    {
        if(!this.AI.Player.isMobile())
            return false;

        this.AI.Actions.push(this.AI.createAction(0,FLAGS.CLEAR_INPUT,bk_));
        this.AI.Actions.push(this.AI.createAction(CONSTANTS.NBCHARGE_FRAMES,null,fwd_));
        which = which || getRand(3);

        switch(which)
        {
            case 1: { this.AI.Actions.push(this.AI.createAction(2,null,fpunches_[0])); break; }
            case 2: { this.AI.Actions.push(this.AI.createAction(2,null,fpunches_[1])); break; }
            default:{ this.AI.Actions.push(this.AI.createAction(2,null,fpunches_[2])); break; }
        }
        this.AI.Actions.push(this.AI.createAction(2,FLAGS.CLEAR_INPUT));
        return true;
    }

    MBisonAI.prototype.executeScissorKick = function(which)
    {
        if(!this.AI.Player.isMobile())
            return false;

        this.AI.Actions.push(this.AI.createAction(0,FLAGS.CLEAR_INPUT,bk_));
        this.AI.Actions.push(this.AI.createAction(CONSTANTS.NBCHARGE_FRAMES,null,fwd_));
        which = which || getRand(3);

        switch(which)
        {
            case 1: { this.AI.Actions.push(this.AI.createAction(2,null,fkicks_[0])); break; }
            case 2: { this.AI.Actions.push(this.AI.createAction(2,null,fkicks_[1])); break; }
            case 3: { this.AI.Actions.push(this.AI.createAction(2,null,fkicks_[2])); break; }
        }
        this.AI.Actions.push(this.AI.createAction(2,FLAGS.CLEAR_INPUT));

        return true;
    }

    MBisonAI.prototype.executeHeadStomp = function(which)
    {
        if(!this.AI.Player.isMobile())
            return false;

        this.AI.Actions.push(this.AI.createAction(0,FLAGS.CLEAR_INPUT,crouchBack_));
        this.AI.Actions.push(this.AI.createAction(CONSTANTS.NBCHARGE_FRAMES,null,jump_));
        which = which || getRand(3);

        switch(which)
        {
            case 1: { this.AI.Actions.push(this.AI.createAction(2,null,jkicks_[0])); break; }
            case 2: { this.AI.Actions.push(this.AI.createAction(2,null,jkicks_[1])); break; }
            case 3: { this.AI.Actions.push(this.AI.createAction(2,null,jkicks_[2])); break; }
        }
        this.AI.Actions.push(this.AI.createAction(2,FLAGS.CLEAR_INPUT));

        return true;
    }

    MBisonAI.prototype.parseAndSendInput = function()
    {
        return this.AI.parseAndSendInput();
    }

    MBisonAI.prototype.onNewRound = function()
    {
        this.AI.reset();
    }

    MBisonAI.prototype.reset = function()
    {
        this.AI.reset();
    }

    MBisonAI.prototype.test = function()
    {
    }

    MBisonAI.prototype.clearInput = function()
    {
        this.AI.clearInput();
    }

    MBisonAI.prototype.onStartNonAttack = function(frame, attacker)
    {
        this.AI.onStartNonAttack(frame,attacker);
    }
    //fired when the player gets hit
    MBisonAI.prototype.onTakeHit = function(frame, attacker)
    {
        this.AI.onTakeHit(frame, attacker);
    }
    //fired when the player gets hit
    MBisonAI.prototype.onBlocked = function(frame, attacker)
    {
        this.AI.onBlocked(frame,attacker);
    }
    //fired when any enemy attack ends
    MBisonAI.prototype.onEnemyEndAttack = function(frame, attacker)
    {
        this.reactAirborne(frame,attacker);
        this.AI.clearInput();
    }
    //fired when any enemy attack ends
    MBisonAI.prototype.onEnemyVulnerable = function(frame, attacker)
    {
        this.AI.clearInput();
        this.react(frame, attacker)
    }
    //fired every frame an enemy attack is pending
    MBisonAI.prototype.onEnemyAttackPending = function(frame,x,y,player,isSuperMove)
    {
        //just before the projectile is actually thrown, the attacker will be used instead of the projectile
        //if the player is facing the projectile, then counter it
        if(!this.AI.isAttackReactBusy() 
            && !this.AI.Player.isAirborne() 
            && !this.AI.Player.isBlocking() 
            && !!this.AI.Player.isMobile()
            && !isSuperMove
            && this.AI.Player.isFacingPlayer(player))
        {
            var dist = this.AI.Player.getDistanceFromSq(x,y);

            var rnd = getRand();

            if(dist < 40000)
            {
                this.reset();
                this.doCounterCloseAttackCombo();
                this.AI.setAttackReactBusy();
            }
        }
    }
    //fired every frame an enemy projectile is pending
    MBisonAI.prototype.onEnemyProjectilePending = function(frame,x,y,player,isSuperMove)
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

            //console.log(dist);

            //jump in
            if(player.isAirborne())
            {
                this.reset();
                this.doMove("tf");
                this.AI.setProjectileReactBusy();
            }
            else if(dist < 170000 && dist > 40000)
            {
                this.reset();
                this.doCounterProjectileCombo();
                this.AI.setProjectileReactBusy();
            }
        }
        else
        {
            var dist = this.AI.Player.getDistanceFromSq(x,y);
            if(dist < 40000)
            {
                this.AI.onEnemyProjectileMoved();
            }
        }
        //this.AI.onEnemyProjectileMoved(frame,x,y,player,isSuperMove);
    }
    //fired every frame an ememy projectile is active
    MBisonAI.prototype.onEnemyProjectileMoved = function(frame,id,x,y,projectile,isSuperMove)
    {
        if(!!this.AI.IgnoreProjectileGone)
            return;
        if(!this.AI.Player.isAirborne()
            && this.AI.Actions.length == 0 
            && !!this.AI.Player.isMobile()
            && !isSuperMove
            && this.AI.Player.isFacingProjectile(projectile))
        {
            var dist = this.AI.Player.getDistanceFromSq(x,y);


            var rnd = getRand();
            if(dist > 72000)
            {
                this.reset();
                this.doCounterProjectileMovedCombo();
                this.AI.IgnoreProjectileGone = true;
                return;
            }
        }
        this.AI.onEnemyProjectileMoved(frame,x,y,projectile,isSuperMove);
    }
    //fired when a projectile is off screen
    MBisonAI.prototype.onEnemyProjectileGone = function(frame, id)
    {
        this.AI.onEnemyProjectileGone();
    }
    //fired when an enemy has been hit
    MBisonAI.prototype.onAttackStateChanged = function(who,state)
    {
        this.AI.onAttackStateChanged(who,state);
    }
    //fired every attack frame
    MBisonAI.prototype.onEnemyContinueAttack = function(frame, attacker, hitPoints)
    {
        this.AI.onEnemyContinueAttack(frame,attacker,hitPoints);
        this.reactAirborne(frame,attacker);
    }

    //fired at the start of any enemy attack
    MBisonAI.prototype.onEnemyStartAttack = function(frame, attacker)
    {
        this.AI.onEnemyStartAttack(frame,attacker);
    }

    //fired at the start of any enemy attack
    MBisonAI.prototype.onStartAttack = function()
    {
        this.AI.onStartAttack();
    }

    //fired at the end of any attack
    MBisonAI.prototype.onAnimationEnded = function(name)
    {
        this.AI.onAnimationEnded();
    }

    //fired at the start of any attack
    MBisonAI.prototype.onAnimationChanged = function(name)
    {
        this.AI.onAnimationChanged(name);
    }

    MBisonAI.prototype.reactAirborne = function(frame,attacker)
    {
        var retVal = false;

        if(!this.AI.Player.isMobile())
            return true;
        if(!this.AI.AllowOverrideBlock)
            return true;
        if(!this.AI.Player.isBlocking())
        {
            if(!!this.AI.isAirborneReactBusy())
                return true;
        }
        else if(!!this.AI.Player.isBlocking())
        {
            return true;
        }
        
        var nbFrames = this.AI.Player.isBlocking() ? 4 : 0;
        var item = this.AI.getClosestAirborneEnemy();

        var rnd = getRand();
        if(item.X < 200)
        {
            if(!!attacker)
            {
                if(rnd > 50)
                {
                    this.AI.reset();
                    this.doMove("tf");
                    retVal = true;
                    this.AI.setAirborneReactBusy();
                }
            }
            else
            {
                //TBD
            }
        }
        return retVal;
    }

    MBisonAI.prototype.reactNotAirborne = function(frame,attacker)
    {
        var retVal = false;
        if(!this.AI.Player.isMobile())
            return retVal;


        return retVal;
    }


    MBisonAI.prototype.doMove = function(key) { this.execute(this.AI.SingleMoves[key]); }
    MBisonAI.prototype.doCloseCombo = function(key) { this.execute(this.AI.CloseCombos[key !== undefined ? key : (getRand(this.AI.CloseCombos.length-1))]); }
    MBisonAI.prototype.doVeryCloseCombo = function(key) { this.execute(this.AI.VeryCloseCombos[key !== undefined ? key : (getRand(this.AI.VeryCloseCombos.length-1))]); }
    MBisonAI.prototype.doJumpInCombo = function(key) { this.execute(this.AI.JumpInCombos[key]); }
    MBisonAI.prototype.doCloseJumpInCounterCombo = function(key) { this.execute(this.AI.CounterCloseJumpInCombos[key]); }
    MBisonAI.prototype.doCounterProjectileCombo = function(key) { this.execute(this.AI.CounterProjectileCombos[getRand(this.AI.CounterProjectileCombos.length-1)]); }
    MBisonAI.prototype.doCounterProjectileMovedCombo = function(key) { this.execute(this.AI.CounterProjectileMovedCombos[getRand(this.AI.CounterProjectileMovedCombos.length-1)]); }
    MBisonAI.prototype.doCounterCloseAttackCombo = function(key) { this.execute(this.AI.CounterAttackCombos[getRand(this.AI.CounterAttackCombos.length-1)]); }

    MBisonAI.prototype.execute = function(sequence)
    {
        var input = null;
        for(var i = 0; i < sequence.length; ++i)
        {
            input = null;
            switch(sequence[i].B)
            {
                case "fb1" : { this.executeFireball(1); continue; } case "fb2" : { this.executeFireball(2); continue; } case "fb3" : { this.executeFireball(3); continue; }
                case "sk1" : { this.executeScissorKick(1); continue; } case "sk2" : { this.executeScissorKick(2); continue; } case "sk3" : { this.executeScissorKick(3); continue; }
                case "hs1" : { this.executeHeadStomp(1); continue; } case "hs2" : { this.executeHeadStomp(2); continue; } case "hs3" : { this.executeHeadStomp(3); continue; }
                case "b" : { input = bk_; break; } case "f" : { input = fwd_; break; } case "c" : { input = crouch_; break; } case "cb" : { input = crouchBack_; break; }
                case "j" : { this.AI.jumpUp(); break; } case "fj" : { this.AI.jumpTowardEnemy(); break; } case "bj" : { this.AI.jumpAwayFromEnemy(); break; }
                case "get_close" : { this.AI.moveToEnemy(0,sequence[i].C); break; } case "jump_in" : { if(this.AI.getClosestEnemy().X < (sequence[i].D || this.AI.TOO_CLOSE)) { return; }; this.AI.jumpInToEnemy(0,sequence[i].C); break; }
                case "lp1" : { input = lowPunches_[0]; break; } case "lp2" : { input = lowPunches_[1]; break; } case "lp3" : { input = lowPunches_[2]; break; }
                case "lk1" : { input = lowKicks_[0]; break; } case "lk2" : { input = lowKicks_[1]; break; } case "lk3" : { input = lowKicks_[2]; break; }
                case "p1" : { input = punches_[0]; break; } case "p2" : { input = punches_[1]; break; } case "p3" : { input = punches_[2]; break; }
                case "k1" : { input = kicks_[0]; break; } case "k2" : { input = kicks_[1]; break; } case "k3" : { input = kicks_[2]; break; }
                case "fp1" : { input = fpunches_[0]; break; } case "fp2" : { input = fpunches_[1]; break; } case "fp3" : { input = fpunches_[2]; break; }
                case "fk1" : { input = fkicks_[0]; break; } case "fk2" : { input = fkicks_[1]; break; } case "fk3" : { input = fkicks_[2]; break; }
                case "tf" : { input = teleportFarInput_; break; } case "tm" : { input = teleportMiddleInput_; break; } case "ti" : { input = teleportFrontInput_; break; } case "tb" : { input = teleportBehindInput_; break; }
                case "t1" : { this.executeThrow(0,true); break; }
            };
            this.AI.sendInput(FLAGS.CLEAR_INPUT,sequence[i].A || 0,input,sequence[i].H);
        }
        this.AI.sendInput(FLAGS.CLEAR_INPUT,2);
    }

    MBisonAI.prototype.onEnemyDizzy = function(frame,attacker)
    {
        this.AI.reset();
        this.doVeryCloseCombo(0);
        this.AI.setBusy();
    }

    MBisonAI.prototype.react = function(frame,attacker)
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

    MBisonAI.prototype.proact = function(frame)
    {
        if(!this.AI.Player.isMobile() || this.AI.Player.isBlocking())
            return;

        if(!!this.reactAirborne(frame,null))
            return;

        var item = this.AI.getClosestEnemy();

        var rnd = getRand();
        var ignoreSetBusy = false;

        if(this.AI.Actions.length != 0)
            return;

        if((item.X < (CONSTANTS.GRAPPLE_DISTANCE+50)))
        {
            if(item.Player.isThrowable())
            {
                this.AI.reset();
                this.doVeryCloseCombo(0);
                return;
            }
        }
        if(!!this.AI.isBusy() || (this.AI.Actions.length > 0))
        {
            return;
        }
        else if(item.X < 300)
        {
            this.AI.reset();
            if(rnd > 50)
                this.wanderBackward(25);
            else
                this.wanderForward(25);
           this.AI.setBusy();
        }
        else
        {
            if(rnd > 60)
            {
                this.AI.reset();
                this.doCloseCombo();
                this.AI.setBusy();
            }
            else if(rnd > 30)
            {
                this.AI.reset();
                this.wanderBackward(25);
                this.AI.setBusy();
            }
            else
            {
                this.AI.reset();
                this.wanderForward(25);
                this.AI.setBusy();
            }
        }

    }

    MBisonAI.prototype.process = function(frame)
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


    MBisonAI.prototype.frameMove = function(frame)
    {
        this.handleCombo(frame);
        this.process(frame);
    }


    MBisonAI.prototype.handleCombo = function(frame)
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

    return new MBisonAI();
}
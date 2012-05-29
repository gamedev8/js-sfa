function _c2(a,b) { return String.prototype.concat(a,b); }
function _c3(a,b,c) { return String.prototype.concat(String.prototype.concat(a,b),c); }
function _c4(a,b,c,d) { return String.prototype.concat(String.prototype.concat(String.prototype.concat(a,b),c),d); }
/* Encapulates a new match */
var Match = function()
{

    this.teamA_ = new Team(1);
    this.teamB_ = new Team(2);

    this.defeatedTeam_ = -1;
    this.isRoundOver_ = false;
    this.gotoNewRoundFrame_ = CONSTANTS.NO_FRAME;
    this.maxWidth_ = parseInt(window.document.getElementById("pnlStage"));
    this.playerCount_ = -1;
    this.physics_ = new Physics();
    this.stage_ = new Stage();
    /*this.physics__ = new _Physics();*/
    this.actionSystem_ = new ActionSystem();
    this.isSuperMoveActive_ = false;
}
Match.prototype.ResetKeys = function()
{
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].ClearKeys();
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].ClearKeys();
}
Match.prototype.PlayerCount = function()
{
    if(this.playerCount_ < 0)
        this.playerCount_ = this.teamA_.Players.length + this.teamB_.Players.length;

    return this.playerCount_;
        
}
Match.prototype.GetGame = function() { return game_; }
Match.prototype.GetCurrentFrame = function() { return this.GetGame().GetCurrentFrame(); }

Match.prototype.InitText = function()
{
    this.teamA_.InitText();
    this.teamB_.InitText();

    this.teamB_.ComboText.ChangeDirection();
}


/*Tells the result of the match*/
Match.prototype.HandleMatchOver = function(frame)
{
    if(frame > CONSTANTS.MAX_FRAME)
    {
        Alert("Time over");
    }
}
/* Is the match over yet? */
Match.prototype.IsMatchOver = function(frame)
{
    return frame > CONSTANTS.MAX_FRAME
    ;
}

/* Shows details about the players on the team */
Match.prototype.ShowTeamInfo = function()
{
    /*team 1*/
    if(!!this.teamA_.Players[this.teamA_.Cursor])
    {
        this.teamA_.NameImg.src = this.teamA_.Players[this.teamA_.Cursor].nameImageSrc_;
        this.teamA_.PortriatImg.src = this.teamA_.Players[this.teamA_.Cursor].portriatImageSrc_;
        this.teamA_.Cursor = (this.teamA_.Cursor + 1 < this.teamA_.Players.length) ? this.teamA_.Cursor+1 : 0;
    }
    /*team 2*/
    if(!!this.teamB_.Players[this.teamA_.Cursor])
    {
        this.teamB_.NameImg.src = this.teamB_.Players[this.teamB_.Cursor].nameImageSrc_;
        this.teamB_.PortriatImg.src = this.teamB_.Players[this.teamB_.Cursor].portriatImageSrc_;
        this.teamB_.Cursor = (this.teamB_.Cursor+1 < this.teamA_.Players.length) ? this.teamB_.Cursor+1 : 0;
    }
}
/*Changes the health value for a team*/
Match.prototype.ChangeHealth = function(team, changeAmount)
{
    switch(team)
    {
        case CONSTANTS.TEAM1: {this.teamA_.Healthbar.Change(changeAmount); break; }
        case CONSTANTS.TEAM2: {this.teamB_.Healthbar.Change(changeAmount); break; }
    };
}
/*Changes the energy value for a team*/
Match.prototype.ChangeEnergy = function(team, changeAmount)
{
    switch(team)
    {
        case CONSTANTS.TEAM1: {this.teamA_.Energybar.Change(changeAmount); break; }
        case CONSTANTS.TEAM2: {this.teamB_.Energybar.Change(changeAmount); break; }
    };
}
/*Returns the health for a team*/
Match.prototype.GetHealth = function(team)
{
    switch(team)
    {
        case CONSTANTS.TEAM1: {return this.teamA_.Healthbar.Amount;}
        case CONSTANTS.TEAM2: {return this.teamB_.Healthbar.Amount;}
    }
}
/*Returns the energy for a team*/
Match.prototype.GetEnergy = function(team)
{
    switch(team)
    {
        case CONSTANTS.TEAM1: {return this.teamA_.Energybar.Amount;}
        case CONSTANTS.TEAM2: {return this.teamB_.Energybar.Amount;}
    }
}
/*Gets the current frame*/
Match.prototype.GetCurrentFrame = function()
{
    return this.GetGame().frame_;
}
/*A team has just been defeated*/
Match.prototype.DefeatTeam = function(team,attackDirection,loseIgnoreId)
{
    var frame = this.GetGame().frame_
    this.GetGame().SetSpeed(CONSTANTS.SLOW_SPEED);
    this.defeatedTeam_ = team;
    switch(this.defeatedTeam_)
    {
        case CONSTANTS.TEAM1:
        {
            for(var i = 0; i < this.teamA_.Players.length; ++i)
                if(this.teamA_.Players[i].id_ != loseIgnoreId)
                    this.teamA_.Players[i].ForceLose(attackDirection);
            for(var i = 0; i < this.teamB_.Players.length; ++i)
                this.teamB_.Players[i].JustWon(frame);
            break;
        }
        case CONSTANTS.TEAM2:
        {
            for(var i = 0; i < this.teamB_.Players.length; ++i)
                if(this.teamB_.Players[i].id_ != loseIgnoreId)
                    this.teamB_.Players[i].ForceLose(attackDirection);
            for(var i = 0; i < this.teamA_.Players.length; ++i)
                this.teamA_.Players[i].JustWon(frame);
            break;
        }
    }
}
/*Should be called after the player who was defeated hits the ground*/
Match.prototype.DeadAnimationComplete = function(player,frame)
{
    if(!this.isRoundOver_)
    {
        this.isRoundOver_ = true;
        this.GetGame().speed_ = CONSTANTS.NORMAL_SPEED;
        this.gotoNewRoundFrame_ = frame;
    }
}
/*Registers an action*/
Match.prototype.RegisterAction = function(details)
{
    this.actionSystem_.Register(details);
}
/*Restarts the match*/
Match.prototype.Reset = function()
{
    if(this.gotoNewRoundFrame_ != CONSTANTS.NO_FRAME)
    {
        this.GetGame().speed_ = CONSTANTS.NORMAL_SPEED;
        this.gotoNewRoundFrame_ = CONSTANTS.NO_FRAME;
        this.teamA_.Cursor = 0;
        this.teamB_.Cursor = 0;
        this.isSuperMoveActive_ = false;


        this.GetGame().ResetFrame();

        this.teamA_.Energybar.Change(0,0);
        this.teamB_.Energybar.Change(0,0);

        if(!!this.teamA_.Players[0])
            this.teamA_.Players[0].SetX(STAGE.START_X);
        if(!!this.teamB_.Players[0])
            this.teamB_.Players[0].SetX(STAGE.START_X);

        /*set the starting locations for each player*/
        for(var i = 0; i < this.teamA_.Players.length; ++i)
        {
            this.teamA_.Players[i].Reset(true);
            this.teamA_.Players[i].SetDirection(-1);
            this.teamA_.Players[i].SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        }
        for(var i = 0; i < this.teamB_.Players.length; ++i)
        {
            this.teamB_.Players[i].Reset(true);
            this.teamB_.Players[i].SetDirection(1);
            this.teamB_.Players[i].SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
        }

        this.isRoundOver_ = false;
        this.stage_.Reset();
        this.ShowTeamInfo(0);
        this.GetGame().ReleaseText();

        this.teamA_.Healthbar.Reset();
        //this.teamA_.Energybar_.Reset();

        this.teamB_.Healthbar.Reset();
        //this.teamB_.Energybar_.Reset();
    }
}

/*Initializes a new match*/
Match.prototype.Start = function(team1,team2)
{
    var moveStageX          = function(thisValue,players) { return function(amount,dontOverrideSign) { for(var i = 0; i < players.length;++i) {amount = thisValue.stage_.ScrollX(amount,this,players[i],thisValue,dontOverrideSign);}; return amount; } };
    var fixX                = function(thisValue,players) { return function(amount) {thisValue.physics_.FixX(amount,this,false,true);  return 0; } };
    var moveX               = function(thisValue,players) { return function(amount) {amount = thisValue.stage_.ScrollX(amount,this,null,thisValue); thisValue.physics_.MoveX(amount,this,false,true); return 0; } };
    var moveY               = function(thisValue,players) { return function(amount) {amount = thisValue.physics_.MoveY(amount,this); return 0; } };
    var moveToBack          = function(thisValue,players) { return function() { for(var i = 0; i < players.length;++i) {players[i].MoveToBack(true);} } }
    var moveToFront         = function(thisValue,players) { return function() { for(var i = 0; i < players.length;++i) {players[i].MoveToFront(true);} } }
    var projectileMoved     = function(thisValue,players) { return function(id,x,y) { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),true,id,x,y); } } }
    var projectileGone      = function(thisValue,players) { return function(id)     { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlockFromProjectile(thisValue.GetGame().GetCurrentFrame(),false,id); } } }
    var startAttack         = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { players[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
    var endAttack           = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { this.flags_.Combat.Remove(COMBAT_FLAGS.CAN_BE_BLOCKED); players[i].SetAllowBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
    var startAirAttack      = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { players[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),true,this.GetMidX(),this.GetMidY()); } } }
    var endAirAttack        = function(thisValue,players) { return function(id) { for(var i = 0; i < players.length;++i) { this.flags_.Combat.Remove(COMBAT_FLAGS.CAN_BE_AIR_BLOCKED); players[i].SetAllowAirBlock(id,thisValue.GetGame().GetCurrentFrame(),false); } } }
    var attack              = function(thisValue,players) { return function(hitDelayFactor, hitID, frame,points,flags,state,damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName) { for(var i = 0; i < players.length;++i) { thisValue.physics_.TryAttack(hitDelayFactor, hitID,frame,points,flags,state,this,players[i],damage,moveOverrideFlags,frameEnergyToAdd,behaviorFlags,invokedAnimationName); } } }
    var projectileAttack    = function(thisValue,players) { return function(frame,projectile) { for(var i = 0; i < players.length;++i) { thisValue.physics_.TryProjectileAttack(frame,projectile,this,players[i]); } } }
    var changeHealth        = function(thisValue)         { return function(amount) { thisValue.ChangeHealth(this.team_,amount); } }
    var getHealth           = function(thisValue)         { return function() { return thisValue.GetHealth(this.team_); } }
    var changeEnergy        = function(thisValue)         { return function(amount) { thisValue.ChangeEnergy(this.team_,amount); } }
    var getEnergy           = function(thisValue)         { return function() { return thisValue.GetEnergy(this.team_); } }
    var incCombo            = function(thisValue,team)    { return function() { return team.IncCombo(); } }
    var incComboRefCount    = function(thisValue,team)    { return function() { return team.IncComboRefCount(); } }
    var decComboRefCount    = function(thisValue,team)    { return function() { return team.DecComboRefCount(); } }
    var getCurrentComboCount= function(thisValue,team)    { return function() { return team.CurrentCombo; } }


    this.teamA_.Players = team1;
    this.teamB_.Players = team2;
    this.InitText();
    /*init team 1*/
    for(var i = 0; i < this.teamA_.Players.length; ++i)
    {
        this.teamA_.Players[i].id_ = "t1p" + i;
        this.teamA_.Players[i].moveStageXFn_ = moveStageX(this,this.teamB_.Players);
        this.teamA_.Players[i].fixXFn_ = fixX(this,this.teamB_.Players);
        this.teamA_.Players[i].moveXFn_ = moveX(this,this.teamB_.Players);
        this.teamA_.Players[i].moveYFn_ = moveY(this,this.teamB_.Players);
        this.teamA_.Players[i].moveOtherPlayersToBackFn_ = moveToBack(this,this.teamB_.Players);
        this.teamA_.Players[i].moveOtherPlayersToFrontFn_ = moveToFront(this,this.teamB_.Players);
        this.teamA_.Players[i].takeDamageFn_ = changeHealth(this);
        this.teamA_.Players[i].changeEnergyFn_ = changeEnergy(this);
        this.teamA_.Players[i].attackFn_ = attack(this,this.teamB_.Players);
        this.teamA_.Players[i].projectileAttackFn_ = projectileAttack(this,this.teamB_.Players);
        this.teamA_.Players[i].ChangeDirection(true);
        this.teamA_.Players[i].SetupInfo(1,"l");
        this.teamA_.Players[i].getHealthFn_ = getHealth(this);
        this.teamA_.Players[i].getEnergyFn_ = getEnergy(this);
        this.teamA_.Players[i].onStartAttackFn_ = startAttack(this,this.teamB_.Players);
        this.teamA_.Players[i].onEndAttackFn_ = endAttack(this,this.teamB_.Players);
        this.teamA_.Players[i].onStartAirAttackFn_ = startAirAttack(this,this.teamB_.Players);
        this.teamA_.Players[i].onEndAirAttackFn_ = endAirAttack(this,this.teamB_.Players);
        this.teamA_.Players[i].onProjectileMovedFn_ = projectileMoved(this,this.teamB_.Players);
        this.teamA_.Players[i].onProjectileGoneFn_ = projectileGone(this,this.teamB_.Players);
        this.teamA_.Players[i].onIncComboFn_ = incCombo(this,this.teamA_);
        this.teamA_.Players[i].onIncComboRefCountFn_ = incComboRefCount(this,this.teamA_);
        this.teamA_.Players[i].onDecComboRefCountFn_ = decComboRefCount(this,this.teamA_);
        this.teamA_.Players[i].getCurrentComboCountFn_ = getCurrentComboCount(this,this.teamA_);
    }
    if(!!this.teamA_.Players[0])
        this.teamA_.Players[0].SetX(STAGE.START_X);

    /*init team 2*/
    for(var i = 0; i < this.teamB_.Players.length; ++i)
    {
        this.teamB_.Players[i].id_ = "t2p" + i;
        this.teamB_.Players[i].moveStageXFn_ = moveStageX(this,this.teamA_.Players);
        this.teamB_.Players[i].fixXFn_ = fixX(this,this.teamA_.Players);
        this.teamB_.Players[i].moveXFn_ = moveX(this,this.teamA_.Players);
        this.teamB_.Players[i].moveYFn_ = moveY(this,this.teamA_.Players);
        this.teamB_.Players[i].moveOtherPlayersToBackFn_ = moveToBack(this,this.teamA_.Players);
        this.teamB_.Players[i].moveOtherPlayersToFrontFn_ = moveToFront(this,this.teamA_.Players);
        this.teamB_.Players[i].takeDamageFn_ = changeHealth(this);
        this.teamB_.Players[i].changeEnergyFn_ = changeEnergy(this);
        this.teamB_.Players[i].attackFn_ = attack(this,this.teamA_.Players);
        this.teamB_.Players[i].projectileAttackFn_ = projectileAttack(this,this.teamA_.Players);
        this.teamB_.Players[i].SetupInfo(2,"r");
        this.teamB_.Players[i].getHealthFn_ = getHealth(this);
        this.teamB_.Players[i].getEnergyFn_ = getEnergy(this);
        this.teamB_.Players[i].onStartAttackFn_ = startAttack(this,this.teamA_.Players);
        this.teamB_.Players[i].onEndAttackFn_ = endAttack(this,this.teamA_.Players);
        this.teamB_.Players[i].onStartAirAttackFn_ = startAirAttack(this,this.teamA_.Players);
        this.teamB_.Players[i].onEndAirAttackFn_ = endAirAttack(this,this.teamA_.Players);
        this.teamB_.Players[i].onProjectileMovedFn_ = projectileMoved(this,this.teamA_.Players);
        this.teamB_.Players[i].onProjectileGoneFn_ = projectileGone(this,this.teamA_.Players);
        this.teamB_.Players[i].onIncComboFn_ = incCombo(this,this.teamB_);
        this.teamB_.Players[i].onIncComboRefCountFn_ = incComboRefCount(this,this.teamB_);
        this.teamB_.Players[i].onDecComboRefCountFn_ = decComboRefCount(this,this.teamB_);
        this.teamB_.Players[i].getCurrentComboCountFn_ = getCurrentComboCount(this,this.teamB_);
    }
    if(!!this.teamB_.Players[0])
        this.teamB_.Players[0].SetX(STAGE.START_X);

    /*set the starting locations for each player*/
    for(var i = 1; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));
    for(var i = 1; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].SetX(STAGE.START_X + (STAGE.START_X_OFFSET * i));

    this.stage_.Reset();
    this.ShowTeamInfo(0);

    this.teamA_.Healthbar.Init();
    this.teamA_.Energybar.Init();

    this.teamB_.Healthbar.Init();
    this.teamB_.Energybar.Init();
}
/*Handles key state changes*/
Match.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
{
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].OnKeyStateChanged(isDown,keyCode,frame);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].OnKeyStateChanged(isDown,keyCode,frame);
}
Match.prototype.OnSuperMoveStarted = function(player)
{
    if(!this.isSuperMoveActive_)
    {
        this.isSuperMoveActive_ = true;
        for(var i = 0; i < this.teamA_.Players.length; ++i)
            if(this.teamA_.Players[i].id_ != player.id_)
                this.teamA_.Players[i].OnSuperMoveStarted();
        for(var i = 0; i < this.teamB_.Players.length; ++i)
            if(this.teamB_.Players[i].id_ != player.id_)
                this.teamB_.Players[i].OnSuperMoveStarted();
    }
}
Match.prototype.OnSuperMoveCompleted = function(player)
{
    if(!!this.isSuperMoveActive_)
    {
        for(var i = 0; i < this.teamA_.Players.length; ++i)
            if(this.teamA_.Players[i].id_ != player.id_)
                this.teamA_.Players[i].OnSuperMoveCompleted();
        for(var i = 0; i < this.teamB_.Players.length; ++i)
            if(this.teamB_.Players[i].id_ != player.id_)
                this.teamB_.Players[i].OnSuperMoveCompleted();
        this.isSuperMoveActive_ = false;
    }
}
Match.prototype.PreFrameMove = function(frame)
{
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].OnPreFrameMove(frame);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].OnPreFrameMove(frame);
}
Match.prototype.RenderComplete = function(frame)
{
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].OnRenderComplete(frame);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].OnRenderComplete(frame);
}

/*pre-render calculations to be performed here*/
Match.prototype.FrameMove = function(frame,keyboardState)
{
    this.stage_.FrameMove(frame);
    this.actionSystem_.FrameMove(frame);

    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].HandleInput(keyboardState,frame);
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].OnFrameMove(frame,this.stage_.x_,this.stage_.y_);

    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].HandleInput(keyboardState,frame);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].OnFrameMove(frame,this.stage_.x_,this.stage_.y_);

    this.teamA_.Healthbar.FrameMove(frame);
    this.teamA_.Energybar.FrameMove(frame);
    this.teamB_.Healthbar.FrameMove(frame);
    this.teamB_.Energybar.FrameMove(frame);

    if((this.gotoNewRoundFrame_ != CONSTANTS.NO_FRAME) && (frame > (this.gotoNewRoundFrame_ + CONSTANTS.GOTO_NEW_ROUND_DELAY)))
        this.Reset();
}

/*All rendering and CSS manipulation to be done here*/
Match.prototype.Render = function(frame)
{
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].Render(frame,this.stage_.x_ - this.stage_.lastX_);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].Render(frame,this.stage_.x_ - this.stage_.lastX_);
    this.stage_.Render();

    this.teamA_.Healthbar.Render(frame);
    this.teamA_.Energybar.Render(frame);
    this.teamB_.Healthbar.Render(frame);
    this.teamB_.Energybar.Render(frame);
}
function _c2(a,b) { return String.prototype.concat(a,b); }
function _c3(a,b,c) { return String.prototype.concat(String.prototype.concat(a,b),c); }
function _c4(a,b,c,d) { return String.prototype.concat(String.prototype.concat(String.prototype.concat(a,b),c),d); }
/* Encapulates a new match */
var Match = function(bg0XOffset)
{

    this.teamA_ = new Team(1);
    this.teamB_ = new Team(2);

    this.bgImg0_ =  {xOffset:bg0XOffset || 0,element:window.document.getElementById("bg0")};
    this.bgImg1_ = {element:window.document.getElementById("bg1")};
    this.bg_ = {element:window.document.getElementById("pnlStage")};
    this.lastX_ = 0;
    this.x_ = 0;
    this.x0 = 0;
    this.x1 = 0;
    this.deltaX_ = 0;
    this.y_ = 0;
    this.deltaY_ = 0;
    this.defeatedTeam_ = -1;
    this.isRoundOver_ = false;
    this.gotoNewRoundFrame_ = CONSTANTS.NO_FRAME;
    this.maxWidth_ = parseInt(window.document.getElementById("pnlStage"));
    this.playerCount_ = -1;
    this.physics_ = new Physics();
    this.stage_ = new Stage();
    /*this.physics__ = new _Physics();*/
    this.actionSystem_ = new ActionSystem();
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
/*centers the background images*/
Match.prototype.CenterStage = function()
{
    var screenWidth = GetWidth(window.document.body);
    var screenHeight = GetHeight(window.document.body);

    var w = parseInt(GetWidth(this.bg_.element));
    if(!w) w = 0;
    var diff = (screenWidth - w) / 2;
    this.bg_.element.style.left = diff + "px";

    
    var diff0 = (screenWidth - parseFloat(this.bgImg0_.element.width)) / 2;
    var diff1 = (screenWidth - parseFloat(this.bgImg1_.element.width)) / 2;

    this.bgImg0_.element.style.left = (this.bgImg0_.xOffset + diff0 - diff) + "px";
    this.bgImg1_.element.style.left = (diff1 - diff) + "px";
    this.x_ = Math.abs(diff1 - diff);
    var elementWidth = parseFloat(this.bg_.element.style.width);

    /*If the browser doesn't allow decimal places in pixel values, then we have to set the bgRate_ to 0.
    The far background will not scroll with the screen. You won't notice unless you know it's happening.*/
    var leftTest = parseFloat(this.bgImg0_.element.style.left);
    leftTest += 0.01;
    this.bgImg0_.element.style.left = leftTest + "px";

    if(leftTest != parseFloat(this.bgImg0_.element.style.left))
        this.bgRate_ = 0;
    else
        this.bgRate_ = (this.bgImg0_.element.width - elementWidth) / (this.bgImg1_.element.width - elementWidth);

    this.x0 = parseFloat(this.bgImg0_.element.style.left);
    this.x1 = parseFloat(this.bgImg1_.element.style.left);

    this.MoveStageHoriz(0);
}
/* If any two players are at the edges of the screen, then the screen can not be moved */
Match.prototype.CanStageScroll = function ()
{
    var flag = true;
    for(var i = 0; i < this.teamA_.Players.length; ++i)
    {
        if(this.teamA_.Players[i].GetX() == STAGE.MIN_X)
        {
            if(!flag) return false;
            flag = false;
        }
    }
    for(var i = 0; i < this.teamB_.Players.length; ++i)
    {
        if(this.teamB_.Players[i].GetX() == STAGE.MIN_X)
        {
            if(!flag) return false;
            flag = false;
        }
    }

    return true;
}
/* Scrolls the backgrounds horizontally */
Match.prototype.MoveStageHoriz = function(amount,px)
{
    if(!this.CanStageScroll())
    {
        this.deltaX_ = 0;
        return;
    }

    if(px <= 0 || px >= STAGE.MAX_X)
    {
        amount = 0;
    }
    this.x0 += amount * this.bgRate_;
    this.x1 += amount;

    this.x_ += amount;

    if(this.x1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.deltaX_ = 0;
        this.x0 = 0;
        this.x1 = 0;
        this.x_ = STAGE.MAX_STAGEX;
        return;
    }
    if(this.x0 < STAGE.MAX_BG0_SCROLL || this.x1 < STAGE.MAX_BG1_SCROLL)
    {
        //floating point error will cause them to be off a little, this will fix
        this.deltaX_ = 0;
        this.x0 = STAGE.MAX_BG0_SCROLL;
        this.x1 = STAGE.MAX_BG1_SCROLL;
        this.x_ = 0;
        return;
    }
    this.deltaX_ = amount;
    this.AlignPlayersX();
}

/* Scrolls the backgrounds horizontally */
Match.prototype.MoveStageX = function(amount)
{
    if(!this.CanStageScroll())
    {
        this.deltaX_ = 0;
        return 0;
    }

    this.x0 += amount * this.bgRate_;
    this.x1 += amount;

    this.x_ += amount;

    this.deltaX_ = amount;
    if(this.x1 > 0)
    {
        //floating point error will cause them to be off a little, this will fix
        this.x0 = 0;
        this.x1 = 0;
        this.deltaX_ = this.x_ - STAGE.MAX_STAGEX;
        this.x_ = STAGE.MAX_STAGEX;
    }
    if(this.x0 < STAGE.MAX_BG0_SCROLL || this.x1 < STAGE.MAX_BG1_SCROLL)
    {
        //floating point error will cause them to be off a little, this will fix
        this.x0 = STAGE.MAX_BG0_SCROLL;
        this.x1 = STAGE.MAX_BG1_SCROLL;
        this.deltaX_ = 0 - this.x_;
        this.x_ = 0;
    }
    this.AlignPlayersX();
    return this.deltaX_;
}


Match.prototype.AlignPlayersX = function()
{
    for(var i = 0, length = this.teamA_.Players.length; i < length; ++i)
        this.teamA_.Players[i].AlignX(this.deltaX_);
    for(var i = 0, length = this.teamB_.Players.length; i < length; ++i)
        this.teamB_.Players[i].AlignX(this.deltaX_);
}

Match.prototype.RenderStage = function()
{
    this.bgImg0_.element.style.left = this.x0 + "px";
    this.bgImg1_.element.style.left = this.x1 + "px";
}
/* Returns true if the stage has been cornered */
Match.prototype.IsStageCornered = function()
{
    return this.IsStageRightCornered() || this.IsStageLeftCornered();
}
/* Returns true if the stage has been cornered */
Match.prototype.IsStageRightCornered = function()
{
    return this.x_ <= STAGE.MIN_STAGEX;
}
/* Returns true if the stage has been cornered */
Match.prototype.IsStageLeftCornered = function()
{
    return this.x_ >= STAGE.MAX_STAGEX;
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
/*Returns the player closest to the left side of the screen*/
Match.prototype.GetLeftMostPlayer = function()
{
    var minX = STAGE.MAX_STAGEX;
    var retVal = null;
    for(var i = 0, length = this.teamA_.Players.length; i < length; ++i)
    {
        if(this.teamA_.Players[i].GetLeftX() < minX)
        {
            minX = this.teamA_.Players[i].GetLeftX();
            retVal = this.teamA_.Players[i];
        }
    }
    for(var i = 0, length = this.teamB_.Players.length; i < length; ++i)
    {
        if(this.teamB_.Players[i].GetLeftX() < minX)
        {
            minX = this.teamB_.Players[i].GetLeftX();
            retVal = this.teamB_.Players[i];
        }
    }

    return retVal;
}
/*Returns the player closest to the right side of the screen*/
Match.prototype.GetRightMostPlayer = function()
{
    var maxX = STAGE.MIN_STAGEX;
    var retVal = null;
    for(var i = 0, length = this.teamA_.Players.length; i < length; ++i)
    {
        if(this.teamA_.Players[i].GetLeftX() > maxX)
        {
            maxX = this.teamA_.Players[i].GetLeftX();
            retVal = this.teamA_.Players[i];
        }
    }
    for(var i = 0, length = this.teamB_.Players.length; i < length; ++i)
    {
        if(this.teamB_.Players[i].GetLeftX() > maxX)
        {
            maxX = this.teamB_.Players[i].GetLeftX();
            retVal = this.teamB_.Players[i];
        }
    }

    return retVal;
}
/**/
Match.prototype.IsLeftMostPlayer = function(id)
{
    var p = this.GetLeftMostPlayer();
    return p.id_ == id;
}
/**/
Match.prototype.IsRightMostPlayer = function(id)
{
    var p = this.GetRightMostPlayer();
    return p.id_ == id;
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
        this.CenterStage();
        this.ShowTeamInfo(0);
        this.GetGame().ReleaseText();

        this.teamA_.Healthbar.Reset();
        //this.teamA_.Energybar_.Reset();

        this.teamB_.Healthbar.Reset();
        //this.teamB_.Energybar_.Reset();
    }
}

/*checks if any player from ther other team is within the given distance*/
Match.prototype.IsAnyPlayerWithinDistance = function(team,x,y,distance)
{
    switch(team)
    {
        case CONSTANTS.TEAM1:
        {
            for(var i = 0; i < this.teamB_.Players.length; ++i)
                if((Math.abs(x - this.teamB_.Players[i].GetMidX()) < distance)
                    && (Math.abs(y - this.teamB_.Players[i].y_) < distance)
                    && (!(this.teamB_.Players[i].flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE)))
                    && (!this.teamB_.Players[i].grappledPlayer_)
                    )
                    return true;
            break;
        }
        case CONSTANTS.TEAM2:
        {
            for(var i = 0; i < this.teamA_.Players.length; ++i)
                if((Math.abs(x - this.teamA_.Players[i].GetMidX()) < distance)
                    && (Math.abs(y - this.teamA_.Players[i].y_) < distance)
                    && (!(this.teamA_.Players[i].flags_.Player.Has(PLAYER_FLAGS.INVULNERABLE)))
                    && (!this.teamA_.Players[i].grappledPlayer_)
                    )
                    return true;
            break;
        }
    }
    return false;
}

/*Returns true if any player from the other team is on the left*/
Match.prototype.IsAnyPlayerFromOtherTeamMoreLeft = function(x,team)
{
    switch(team)
    {
        case CONSTANTS.TEAM1:
        {
            for(var i = 0; i < this.teamB_.Players.length; ++i)
                if(this.teamB_.Players[i].GetMidX() < x)
                    return true;
            break;
        }
        case CONSTANTS.TEAM2:
        {
            for(var i = 0; i < this.teamA_.Players.length; ++i)
                if(this.teamA_.Players[i].GetMidX() < x)
                    return true;
            break;
        }
    }
    return false;
}

/*Returns true if any player from the other team is on the right*/
Match.prototype.IsAnyPlayerFromOtherTeamMoreRight = function(x,team)
{
    switch(team)
    {
        case CONSTANTS.TEAM1:
        {
            for(var i = 0; i < this.teamB_.Players.length; ++i)
                if(this.teamB_.Players[i].GetMidX() > x)
                    return true;
            break;
        }
        case CONSTANTS.TEAM2:
        {
            for(var i = 0; i < this.teamA_.Players.length; ++i)
                if(this.teamA_.Players[i].GetMidX() > x)
                    return true;
            break;
        }
    }
    return false;
}

/*Initializes a new match*/
Match.prototype.Start = function(team1,team2)
{
    var moveStageX          = function(thisValue,players) { return function(amount,dontOverrideSign) { for(var i = 0; i < players.length;++i) {amount = thisValue.stage_.MoveStageX(amount,this,players[i],thisValue,dontOverrideSign);}; return amount; } };
    var fixX                = function(thisValue,players) { return function(amount) {thisValue.physics_.FixX(amount,this,false,true);  return 0; } };
    var moveX               = function(thisValue,players) { return function(amount) {amount = thisValue.stage_.MoveStageX(amount,this,null,thisValue); thisValue.physics_.MoveX(amount,this,false,true);  return 0; } };
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

    this.CenterStage();
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
/*pre-render calculations to be performed here*/
Match.prototype.FrameMove = function(frame,keyboardState)
{
    this.lastX_ = this.x_;
    this.deltaX_ = 0;
    this.deltaY_ = 0;

    this.actionSystem_.FrameMove(frame);

    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].HandleInput(keyboardState,frame);
    for(var i = 0; i < this.teamA_.Players.length; ++i)
        this.teamA_.Players[i].OnFrameMove(frame,this.x_,this.y_);

    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].HandleInput(keyboardState,frame);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].OnFrameMove(frame,this.x_,this.y_);

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
        this.teamA_.Players[i].Render(frame,this.x_ - this.lastX_);
    for(var i = 0; i < this.teamB_.Players.length; ++i)
        this.teamB_.Players[i].Render(frame,this.x_ - this.lastX_);
    this.RenderStage();

    this.teamA_.Healthbar.Render(frame);
    this.teamA_.Energybar.Render(frame);
    this.teamB_.Healthbar.Render(frame);
    this.teamB_.Energybar.Render(frame);
}
Player.prototype.IsFacingLeft = function() { return this.direction_ > 0; }
Player.prototype.GetDistanceFromSq = function(x,y)
{
    var dx = x-this.GetMidX();
    var dy = y-this.GetMidY();

    var distSq = dx*dx + dy*dy;

    return distSq;
}
Player.prototype.GetMidX = function()
{
    var left = this.GetLeftX();
    var right = this.GetRightX();

    return right - ((right-left)/2);
}
Player.prototype.GetMidY = function()
{
    var bottom = this.GetOffsetBoxBottom();
    var top = this.GetBoxTop();

    return top - ((top-bottom)/2);
}

Player.prototype.GetLeftX = function() { if(this.direction_ > 0){return STAGE.MAX_STAGEX - (this.GetX() + this.GetConstWidth());}else{return this.GetX();}}
Player.prototype.GetRightX = function()  { if(this.direction_ > 0){return STAGE.MAX_STAGEX - this.GetX();}else{return this.GetX() + (this.GetConstWidth());}}
Player.prototype.GetAbsFrontX = function() { if(this.direction_ > 0){ return this.GetLeftX(); } else { return this.GetRightX(); } }
Player.prototype.GetAbsBackX = function()  { if(this.direction_ > 0){ return this.GetRightX(); } else { return this.GetLeftX(); } }

Player.prototype.GetBoxTop = function() { return this.y_ + (this.GetBoxHeight()); }
Player.prototype.GetOffsetBoxTop = function() { return this.y_ + (this.GetBoxHeight()) + this.yTopOffset_; }
Player.prototype.GetBoxBottom = function() { return this.y_; }
Player.prototype.GetOffsetBoxBottom = function() { return this.y_ + this.yBottomOffset_; }
/*Player.prototype.GetConstWidth = function() { return this.image_.width - 20; }*/
Player.prototype.GetConstWidth = function() { return this.width_; }
Player.prototype.GetConstFrontX = function() { return this.GetX() + this.width_; }
Player.prototype.GetFrontX = function() { return this.GetX() + this.GetBoxWidth(); }
Player.prototype.GetBoxWidth = function() { return this.image_.width; }
Player.prototype.GetBoxHeight = function() { return this.image_.height; }
Player.prototype.GetRect = function()
{
    return {Left:this.GetLeftX(),Right:this.GetRightX(),Top:this.GetOffsetBoxTop(),Bottom:this.GetOffsetBoxBottom()};
}
/*
Player.prototype.GetRight = function() { return parseInt(this.element_.style.right || 0); }
Player.prototype.GetLeft = function() { return parseInt(this.element_.style.left || 0); }
Player.prototype.GetY = function() { return parseInt(this.element_.style.bottom) || 0; }
Player.prototype.GetX = function() { if(this.direction_ > 0){return this.GetRight();} else {return this.GetLeft();} }
*/
Player.prototype.GetRight = function() { return this.x_; }
Player.prototype.GetLeft = function() { return this.x_; }
Player.prototype.GetY = function() { return this.y_ || 0; }
Player.prototype.GetX = function() { return this.x_ || 0; }

Player.prototype.SetRight = function(value) { this.element_.style.right = (value) + "px";}
Player.prototype.SetLeft = function(value) { this.element_.style.left = (value) + "px";}
/*
Player.prototype.SetY = function(value) {value = Math.max(value,0);this.y_ = value; this.element_.style.bottom = value + "px"; this.MoveCircle();}
Player.prototype.SetX = function(value) {value = Math.min(Math.max(value,0),STAGE.MAX_X);this.x_ = value; if(this.direction_ > 0){this.SetRight(value);} else {this.SetLeft(value);}; this.MoveCircle();}
*/
Player.prototype.SetY = function(value)
{
    this.y_ = Math.max(value,STAGE.FLOORY);
    this.MoveCircle();
}
Player.prototype.SetX = function(value)
{
    value = Math.min(Math.max(value,0),STAGE.MAX_X);
    this.x_ = value;
    this.MoveCircle();
}
Player.prototype.AlignX = function(deltaX) { this.x_ += (deltaX * -this.direction_); }
Player.prototype.SetImageX = function(value) {if(this.direction_ > 0){this.image_.style.right = value+"px"; } else {this.image_.style.left = value+"px";}}
Player.prototype.SetImageY = function(value) { this.image_.style.bottom = value+"px"; }
Player.prototype.IsOnGround = function() { return this.y_ == STAGE.FLOORY; }
Player.prototype.IsAirborne = function() { return this.HasState(FLAGS.AIRBORNE); }
Player.prototype.CanBeJuggled = function()
{
    return this.HasState(FLAGS.AIRBORNE)
        && !!this.currentAnimation_.Animation
        && !!this.currentAnimation_.Animation.allowJuggle_
    ;
}
Player.prototype.RenderShadow = function()
{
    this.shadowContainer_.style.left = this.element_.style.left;
    this.shadowContainer_.style.right = this.element_.style.right;
    if(!!this.adjustShadowPosition_)
    {
        this.shadow_.style.left = this.image_.style.left;
        this.shadow_.style.right = this.image_.style.right;
    }
}
Player.prototype.SetDirection = function(value)
{
    if(value != this.direction_)
        this.ChangeDirection();
}
Player.prototype.TurnAround = function()
{
    this.mustChangeDirection_ = 1;
}
Player.prototype.ChangeDirection = function(quick)
{
    this.mustChangeDirection_ = 0;
    var pnlStageWidth = STAGE.CSSWIDTH;//parseInt(window.document.getElementById("pnlStage").style.width);
    //this.ExecuteAnimation("turn");
    //var move = this.moves_["_0_turn"];
    //this.SetCurrentAnimation({Animation:move,StartFrame:this.GetMatch().GetCurrentFrame(),Direction:-this.direction_});

    /*facing left*/
    if(this.IsFacingLeft())
    {
        var x = this.GetRight() + this.image_.width;
        var left = pnlStageWidth - x;
        this.x_ = left;

        this.image_.style.right = "";
        this.image_.style.left = "0px";

        this.element_.style.right = "";
        this.element_.style.left = left + "px";
        this.direction_ = -1;
        /*swap the left and right buttons*/
        this.buttons_[this.leftKey_].Bit = 2;
        this.buttons_[this.rightKey_].Bit = 1;
    }
    else
    {
        var x = this.GetLeft() + this.image_.width;
        var right = pnlStageWidth - x;
        this.x_ = right;

        this.image_.style.left = "";
        this.image_.style.right = "0px";
        
        this.element_.style.left = "";
        this.element_.style.right = right + "px";
        this.direction_ = 1;
        /*swap the left and right buttons*/
        this.buttons_[this.leftKey_].Bit = 1;
        this.buttons_[this.rightKey_].Bit = 2;
    }
    if(!quick)
    {
        if(this.HasPoseFlags(FLAGS.CROUCHING))
        {
            var move = this.moves_[_c3("_",FLAGS.CROUCHING,"_turn")];
            this.SetCurrentAnimation({Animation:move,StartFrame:this.GetGame().GetCurrentFrame(),Direction:this.direction_});
        }
        else
        {
            var move = this.moves_[_c3("_",FLAGS.STANDING|FLAGS.WALKING_FORWARD|FLAGS.WALKING_BACKWARD,"_turn")];
            this.SetCurrentAnimation({Animation:move,StartFrame:this.GetGame().GetCurrentFrame(),Direction:this.direction_});
        }
    }

    for(var i = 0; i < this.keyStates_.length; ++i)
    {
        if(!!(this.keyStates_[i].Bit & (1 << 0)))
            this.keyStates_[i].Bit = this.keyStates_[i].Bit ^ (1 << 0) | (1 << 1);
        else if(!!(this.keyStates_[i].Bit & (1 << 1)))
            this.keyStates_[i].Bit = this.keyStates_[i].Bit ^ (1 << 1) | (1 << 0);
    }
    if(!!(this.keyState_ & (1 << 0)))
        this.keyState_ ^= (1 << 0) | (1 << 1);
    else if(!!(this.keyState_ & (1 << 1)))
        this.keyState_ ^= (1 << 1) | (1 << 0);
}
Player.prototype.MoveCircleToBottom = function()
{
    this.MoveCircle();
    this.circle_.RenderY = this.y_ + this.circle_.OffsetY;
}
Player.prototype.MoveCircleToTop = function()
{
    this.MoveCircle();
    this.circle_.RenderY = this.GetBoxTop() - this.circle_.R*2 - this.circle_.OffsetY;
}
Player.prototype.MoveCircle = function()
{
    var x = 0;
    if(this.direction_ < 0)
        x = this.GetX();
    else
        x = STAGE.MAX_X - this.GetX();
    this.circle_.RenderX = x + this.circle_.R;

    this.circle_.LocalY = this.circle_.R;
    this.circle_.LocalX = this.circle_.R;

}
Player.prototype.MoveY = function(amount,forced)
{
    var deltaY = this.moveYFn_(amount,forced);
    var y = this.GetY() + deltaY;
    this.SetY(y);
    return deltaY;
}
Player.prototype.OffsetImageX = function(amount)
{
    this.SetImageX(amount);
}
Player.prototype.OffsetImageY = function(amount)
{
    this.SetImageY(amount);
}
Player.prototype.CheckDirection = function()
{
    if(this.GetMatch().IsRightMostPlayer(this.id_) && this.direction_ == -1)
        this.TurnAround();
    else if(this.GetMatch().IsLeftMostPlayer(this.id_) && this.direction_ == 1)
        this.TurnAround();
    else
    {
        if((this.direction_ == 1) && !this.GetMatch().IsAnyPlayerFromOtherTeamMoreLeft(this.GetMidX(),this.team_))
            this.TurnAround();
        else if((this.direction_ == -1) && !this.GetMatch().IsAnyPlayerFromOtherTeamMoreRight(this.GetMidX(),this.team_))
            this.TurnAround();
    }
}
/*moves the player in the stage*/
Player.prototype.MoveX = function(amount)
{
    if(!amount)
        return 0;
    var x = this.GetX();
    var deltaX = this.moveXFn_(amount);
    x += deltaX;

    //this.SetX(x);
    return deltaX;
}
/*warps the player to a new location - no collision detection is done*/
Player.prototype.WarpX = function(amount,autoDir)
{
    if(!!autoDir)
    {
        if(amount > 0) /*moving right*/
        {
            if(this.direction_ == -1)
                amount = Math.abs(amount);
            else
                amount = -Math.abs(amount);
        }
        else /*moving left*/
        {
            if(this.direction_ == -1)
                amount = -Math.abs(amount);
            else
                amount = Math.abs(amount);
        }
    }
    var oldX = this.GetMidX();
    this.SetX(this.x_ + amount);
    return this.GetMidX() - oldX;
}

Player.prototype.WarpY = function(amount)
{
    var oldY = this.y_;
    this.SetY(this.y_ + amount);

    return this.y_ - oldY;
}

Player.prototype.ConvertX = function(x)
{
    if(this.direction_ < 0)
        return STAGE.MAX_STAGEX - this.GetBoxWidth() - x
    else
        return STAGE.MAX_STAGEX - this.GetBoxWidth() - x;
}

Player.prototype.ConvertY = function(y)
{
    return y;
}
Player.prototype.IsLeftCornered = function(x)
{
    x = x || this.GetX();
    var retVal = false;
    if(this.direction_ < 0 && x <= STAGE.MIN_X)
        retVal = true;
    else if(this.direction_ > 0 && x >= STAGE.MAX_X)
        retVal = true;
    return retVal;
}
Player.prototype.IsLeftCorneredInStage = function(x)
{
    return this.IsLeftCornered() && this.GetMatch().IsStageLeftCornered();
}
Player.prototype.IsRightCornered = function(x)
{
    x = x || this.GetX();
    var retVal = false;
    if(this.direction_ < 0 && x >= STAGE.MAX_X)
        retVal = true;
    else if(this.direction_ > 0 && x <= STAGE.MIN_X)
        retVal = true;
    return retVal;
}
Player.prototype.IsRightCorneredInStage = function(x)
{
    return this.IsRightCornered() && this.GetMatch().IsStageRightCornered();
}
/*Shows the dirt animation when a player is floored*/
Player.prototype.ShowBigDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.SpawnBigDirt(frame,i * 40);
    }
}
/*Shows the small dirt animation when a player is floored*/
Player.prototype.ShowSmallDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.SpawnSmallDirt(frame,20 + (i * 30));
    }
}
/*Puts a player in sliding motion*/
Player.prototype.StartSlide = function(frame,amount,direction,fx)
{
    if(this.isSliding_)
    {
        this.t_ = 0;
        this.fx_ = Math.sin(this.t_) * amount;
    }

    if((this.direction_ > 0 && direction < 0) || (this.direction_ < 0 && direction > 0))
        this.slideFactor_ = Math.abs(amount) * fx;
    else if((this.direction_ > 0 && direction > 0) || (this.direction_ < 0 && direction < 0))
        this.slideFactor_ = -Math.abs(amount) * fx;

    this.isSliding_ = true;
}
/*Handles the player sliding*/
Player.prototype.Slide = function(frame)
{
    if(!!this.frameFreeze_ && !this.IsBlocking())
        return;
    if(this.t_ >= CONSTANTS.HALF_PI || !this.isSliding_ || this.y_ > STAGE.FLOORY || !!this.isBeingThrown_)
    {
        this.t_ = 0;
        this.fx_ = 0;
        this.slideCount_ = 0;
        this.isSliding_ = false;
        return;
    }
    this.t_ = Math.min(this.t_ + CONSTANTS.SLIDE_INC, CONSTANTS.HALF_PI);
    this.lastFx_ = this.fx_;
    this.fx_ =  Math.sin(this.t_) * this.slideFactor_;
    ++this.slideCount_;

    if(this.slideCount_ % CONSTANTS.DIRT_FREQUENCY == 0)
    {
        this.SpawnSmallDirt(frame);
    }

    var deltaX = (this.lastFx_ - this.fx_);
    this.MoveX(deltaX);
}

Player.prototype.AdvanceJump = function(ignoreYCheck)
{
    //this.x1 = this.x0_ + ((this.jumpVelocityX_ * this.jumpT_) * 0.1);
    var y = this.y0_ + ((this.jumpVelocityY_ * this.jumpT_) - ((CONSTANTS.HALF_G) * (this.jumpT_*this.jumpT_))) * CONSTANTS.Y_DAMPING;
    ++this.jumpT_;

    var dx = this.jumpVelocityX_ * CONSTANTS.X_DAMPING;
    var dy = y - this.oldY_;

    if(!!this.vxFn_)
        dx = this.vxFn_(dx,this.jumpT_);
    if(!!this.vyFn_)
        dy = this.vyFn_(dy,this.jumpT_);

    this.oldY_ = y;

    this.MoveX(dx);
    this.MoveY(dy);

    if(!ignoreYCheck && this.GetY() <= STAGE.FLOORY)
    {
        this.RemoveState(FLAGS.AIRBORNE);
        this.RemoveState(FLAGS.AIRBORNE_FB);
        this.flags_.PoseFlags.Remove(FLAGS.AIRBORNE_FB);
        this.RemovePoseFlags(FLAGS.AIRBORNE);
        this.RemovePoseFlags(FLAGS.AIRBORNE_FB);
        this.flags_.PoseFlags.Remove(FLAGS.AIRBORNE);
        this.vxFn_ = null;
        this.vyFn_ = null;
        return false;
    }
    return true;
}

Player.prototype.PerformJump = function(vx,vy,vxFn,vyFn)
{
    /*store the X and Y modifier functions*/
    this.vxFn_ = vxFn;
    this.vyFn_ = vyFn;
    /*store the initial position*/
    this.x0_ = this.x_;
    this.y0_ = this.y_;
    this.oldY_ = this.y_;
    /*store the velocity*/
    this.jumpVelocityX_ = vx;
    this.jumpVelocityY_ = vy;
    /*store a timer*/
    this.jumpT_ = 0;
    if(!!vx)
    {
        this.AddState(FLAGS.AIRBORNE_FB);
        this.AddPoseFlags(FLAGS.AIRBORNE_FB);
        this.flags_.PoseFlags.Add(FLAGS.AIRBORNE_FB);
    }
    else
    {
        this.AddState(FLAGS.AIRBORNE);
        this.AddPoseFlags(FLAGS.AIRBORNE);
        this.flags_.PoseFlags.Add(FLAGS.AIRBORNE);
    }
    this.AdvanceJump(true);
}

Player.prototype.IsAirborne = function()
{
    return this.HasState(FLAGS.AIRBORNE) || this.HasState(FLAGS.AIRBORNE_FB);
}
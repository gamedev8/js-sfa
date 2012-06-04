var User = function(right,up,left,down,p1,p2,p3,k1,k2,k3)
{
    this.Right = right;
    this.Up = up;
    this.Left = left;
    this.Down = down;
    this.P1 = p1;
    this.P2 = p2;
    this.P3 = p3;
    this.K1 = k1;
    this.K2 = k2;
    this.K3 = k3;
    this.number_ = 0;
    this.Selected = null;
    this.changeCharacterFn_ = null;
    this.animations_ = {};
    this.nbFrames_ = 0;
    this.selectedState_ = { X:0,Y:0,Element:null,StartFrame:0 };
    this.portriatElement_ = null;
    this.stanceElement_ = null;
    this.isCharSelected_ = false;
    this.direction_ = 1;
    this.selectedCharStance_ = { X:undefined, Y:undefined, Element:null,StartFrame:0 }

}

User.prototype.AddStanceAnimations = function()
{
    this.animations_["ryu"] = new BasicAnimation("ryu_stance",[],true);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-1.png",4);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-0.png",4);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-1.png",4);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-2.png",4);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-3.png",4);
    this.animations_["ryu"].AddFrame(this,"images/misc/ryu/x-stance-2.png",4);    

    this.animations_["ken"] = new BasicAnimation("ken_stance",[],true);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-1.png",4);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-0.png",4);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-1.png",4);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-2.png",4);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-3.png",4);
    this.animations_["ken"].AddFrame(this,"images/misc/ken/x-stance-2.png",4);    
}

User.prototype.Release = function()
{
    var parentElement = window.document.getElementById("pnlStage");
    parentElement.removeChild(this.selectedState_.Element);
    parentElement.removeChild(this.portriatElement_);
    parentElement.removeChild(this.selectedCharStance_.Element);
}

User.prototype.Init = function(isUser1)
{
    this.AddStanceAnimations();
    this.selectedState_.Element = window.document.createElement("img");
    this.selectedState_.Element.className = "select-icon";
    this.portriatElement_ = window.document.createElement("img");

    var parentElement = window.document.getElementById("pnlStage");
    parentElement.appendChild(this.selectedState_.Element);
    parentElement.appendChild(this.portriatElement_);
    this.selectedCharStance_.Element = window.document.createElement("img");

    parentElement.appendChild(this.selectedCharStance_.Element);

    if(!!isUser1)
    {
        this.Selected = CHARACTERS.RYU;
        this.animations_["select_icon"] = new BasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"images/misc/misc/p1-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"images/misc/misc/p1-select-1.png",1);

        this.portriatElement_.className = "select-portriat-p1";
        this.selectedCharStance_.Element.className = "select-stance-p1"
    }
    else
    {
        this.Selected = CHARACTERS.KEN;
        this.animations_["select_icon"] = new BasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"images/misc/misc/p2-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"images/misc/misc/p2-select-1.png",1);

        this.portriatElement_.className = "select-portriat-p2";
        this.selectedCharStance_.Element.className = "select-stance-p2"
    }
}

/*input handler*/
User.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
{
    if(!isDown)
    {
        if(!this.isCharSelected_)
        {
            var direction = null;
            if(keyCode == this.Down) direction = CONSTANTS.DOWN;
            else if(keyCode == this.Up) direction = CONSTANTS.UP;
            else if(keyCode == this.Left) direction = CONSTANTS.LEFT;
            else if(keyCode == this.Right) direction = CONSTANTS.RIGHT;
            else if(keyCode == this.P1 || keyCode == this.P2 || keyCode == this.P3 || keyCode == this.K1 || keyCode == this.K2 || keyCode == this.K3)
            {
                if(this.Selected == CHARACTERS.RYU
                    || this.Selected == CHARACTERS.KEN
                    || this.Selected == CHARACTERS.MBISON)
                this.isCharSelected_ = true;
            }

            if(!!direction)
            {
                this.changeCharacterFn_(direction);
            }
        }
    }
}

/*Simply returns the count of all of the frames*/
User.prototype.GetNextFrameID = function()
{
    return this.nbFrames_;
}


/*returns the player instance from this user*/
User.prototype.GetPlayer = function()
{
    var retVal = null;
    switch(this.Selected)
    {
        case CHARACTERS.RYU: { retVal = Player.prototype.CreateRyu(this); break; }
        case CHARACTERS.KEN: { retVal = Player.prototype.CreateKen(this); break; }
        /*
        case CHARACTERS.CHUNLI: { retVal = Player.prototype.CreateChunLi(this); break; }
        case CHARACTERS.CHARLIE: { retVal = Player.prototype.CreateCharlie(this); break; }
        case CHARACTERS.GUY: { retVal = Player.prototype.CreateGuy(this); break; }
        case CHARACTERS.BIRDIE: { retVal = Player.prototype.CreateBirdie(this); break; }
        case CHARACTERS.SODOM: { retVal = Player.prototype.CreateSodom(this); break; }
        case CHARACTERS.ADON: { retVal = Player.prototype.CreateAdon(this); break; }
        case CHARACTERS.RANDOM1: { break; }
        case CHARACTERS.ROSE: { retVal = Player.prototype.CreateRose(this); break; }
        case CHARACTERS.SAGAT: { retVal = Player.prototype.CreateSagat(this); break; }
        case CHARACTERS.RANDOM2: { break; }
        case CHARACTERS.AKUMA: { retVal = Player.prototype.CreateAkuma(this); break; }
        case CHARACTERS.MBISON: { retVal = Player.prototype.CreateMBison(this); break; }
        case CHARACTERS.DAN: { retVal = Player.prototype.CreateDan(this); break; }
        */
    };

    return retVal;
}

/*selecting a character*/
User.prototype.FrameMove = function(frame)
{
    switch(this.Selected)
    {
        case CHARACTERS.RYU: { this.currentStance_ = "ryu"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-ryu.png" : "images/misc/misc/p2-select-ryu.png"); break; }
        case CHARACTERS.CHUNLI: { this.currentStance_ = "chunli"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-chunli.png" : "images/misc/misc/p2-select-chunli.png"); break; }
        case CHARACTERS.CHARLIE: { this.currentStance_ = "charlie"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-charlie.png" : "images/misc/misc/p2-select-charlie.png"); break; }
        case CHARACTERS.KEN: { this.currentStance_ = "ken"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-ken.png" : "images/misc/misc/p2-select-ken.png"); break; }
        case CHARACTERS.GUY: { this.currentStance_ = "guy"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-guy.png" : "images/misc/misc/p2-select-guy.png"); break; }
        case CHARACTERS.BIRDIE: { this.currentStance_ = "birdie"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-birdie.png" : "images/misc/misc/p2-select-birdie.png"); break; }
        case CHARACTERS.SODOM: { this.currentStance_ = "sodom"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-sodom.png" : "images/misc/misc/p2-select-sodom.png"); break; }
        case CHARACTERS.ADON: { this.currentStance_ = "adon"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-adon.png" : "images/misc/misc/p2-select-adon.png"); break; }
        case CHARACTERS.RANDOM1: { break; }
        case CHARACTERS.ROSE: { this.currentStance_ = "rose"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-rose.png" : "images/misc/misc/p2-select-rose.png"); break; }
        case CHARACTERS.SAGAT: { this.currentStance_ = "sagat"; this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-sagat.png" : "images/misc/misc/p2-select-sagat.png"); break; }
        case CHARACTERS.RANDOM2: { break; }
        /*
        case CHARACTERS.AKUMA: { this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        case CHARACTERS.MBISON: { this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        case CHARACTERS.DAN: { this.portriatElement_.src = (this.number_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        */
    };
}

/*renders the users selected items*/
User.prototype.Render = function(frame)
{
    if(!this.isCharSelected_)
        this.animations_["select_icon"].TryRender(frame, this.selectedState_);

    if(!!this.animations_[this.currentStance_])
        this.animations_[this.currentStance_].TryRender(frame, this.selectedCharStance_, this.direction_);
}


var CharSelect = function(user1,user2)
{
    this.u1_ = user1;
    this.u2_ = user2;

    this.charsMax_ = 11;
    this.charsRow1_ = {Min:0,Max:3};
    this.charsRow2_ = {Min:4,Max:7};
    this.charsRow3_ = {Min:8,Max:11};

    this.charsCol1_ = [0,4,8];
    this.charsCol2_ = [1,5,9];
    this.charsCol3_ = [2,6,10];
    this.charsCol4_ = [3,7,11];

    this.element_ = null;
    this.playerSelectImg_ = null;

}

CharSelect.prototype.GetRow = function(user)
{
    if((user.Selected <= this.charsRow1_.Max) && (user.Selected >= this.charsRow1_.Min))
        return CONSTANTS.ROW1;
    else if((user.Selected <= this.charsRow2_.Max) && (user.Selected >= this.charsRow2_.Min))
        return CONSTANTS.ROW2;
    else if((user.Selected <= this.charsRow3_.Max) && (user.Selected >= this.charsRow3_.Min))
        return CONSTANTS.ROW3;
}

CharSelect.prototype.GetColumn = function(user)
{
    if(-1 < this.charsCol1_.IndexOf(user.Selected))
        return CONSTANTS.COL1;
    else if(-1 < this.charsCol2_.IndexOf(user.Selected))
        return CONSTANTS.COL2;
    else if(-1 < this.charsCol3_.IndexOf(user.Selected))
        return CONSTANTS.COL3;
    else if(-1 < this.charsCol4_.IndexOf(user.Selected))
        return CONSTANTS.COL4;
}

/*try to change character on the selection screen*/
CharSelect.prototype.TryChangeCharacter = function(who, direction)
{
    var row = this.GetRow(who);
    var col = this.GetColumn(who);
    var isUser1 = who.number_ == 1;
    var isUser2 = who.number_ == 2;

    if(direction == CONSTANTS.DOWN)
    {
        /*ensure that the player can only go to its own random select*/
        if(row != CONSTANTS.ROW3 && !(isUser1 && who.Selected == 7) && !(isUser2 && who.Selected == 4))
            who.Selected = Math.min(who.Selected + 4, this.charsMax_);
    }
    else if(direction == CONSTANTS.UP)
    {
        if(row != CONSTANTS.ROW1)
            who.Selected = Math.max(who.Selected - 4, 0);
    }
    else
    {
        switch(row)
        {
            case CONSTANTS.ROW1:
            {
                if(direction == CONSTANTS.RIGHT)  who.Selected = Math.min(who.Selected + 1, this.charsRow1_.Max);
                else if(direction == CONSTANTS.LEFT) who.Selected = Math.max(who.Selected - 1, this.charsRow1_.Min);
                break;
            }
            case CONSTANTS.ROW2:
            {
                if(direction == CONSTANTS.RIGHT) who.Selected = Math.min(who.Selected + 1, this.charsRow2_.Max);
                else if(direction == CONSTANTS.LEFT) who.Selected = Math.max(who.Selected - 1, this.charsRow2_.Min);
                break;
            }
            case CONSTANTS.ROW3:
            {
                /*ensure that the player can only go to its own random select*/
                if(direction == CONSTANTS.RIGHT && !(isUser1 && who.Selected == 10)) who.Selected = Math.min(who.Selected + 1, this.charsRow3_.Max);
                else if(direction == CONSTANTS.LEFT && !(isUser2 && who.Selected == 9)) who.Selected = Math.max(who.Selected - 1, this.charsRow3_.Min);
                break;
            }
        }
    }

    row = this.GetRow(who);
    col = this.GetColumn(who);
    who.selectedState_.Y = CONSTANTS.CHARSELECT_Y - (row * CONSTANTS.CHARSELECT_HEIGHT);
    who.selectedState_.X = CONSTANTS.CHARSELECT_X + (col * CONSTANTS.CHARSELECT_WIDTH);
}

/**/
CharSelect.prototype.Release = function()
{
    var parentElement = window.document.getElementById("pnlStage");
    parentElement.style.backgroundImage = "";
    parentElement.style.backgroundRepeat = "";
    parentElement.removeChild(this.element_);
    parentElement.removeChild(this.playerSelectImg_);

    if(!!this.u1_)
        this.u1_.Release();
    if(!!this.u2_)
        this.u2_.Release();
}

/**/
CharSelect.prototype.Init = function()
{
    this.element_ = window.document.createElement("div");
    this.element_.className = "select";

    this.playerSelectImg_ = window.document.createElement("img");
    this.playerSelectImg_.className = "player-select";
    this.playerSelectImg_.src = "images/misc/misc/player-select.png";

    //this.element_.appendChild(img);

    var parentElement = window.document.getElementById("pnlStage");
    parentElement.appendChild(this.playerSelectImg_);
    parentElement.appendChild(this.element_);
    parentElement.style.backgroundImage = "url(images/misc/misc/player-select-back-bg.png)";
    parentElement.style.backgroundRepeat = "no-repeat";

    /*Init user 1*/
    if(!!this.u1_)
    {
        this.u1_.number_ = 1;
        this.u1_.direction_ = -1;
        this.u1_.Init(true);
        this.u1_.changeCharacterFn_ = (function(thisValue)
        {
            return function(direction)
            {
                thisValue.TryChangeCharacter(this,direction);
            }
        })(this);

        if(this.u1_.Selected == null)
            this.u1_.Selected = CHARACTERS.RYU;
        this.u1_.changeCharacterFn_();
    }

    /*Init user 2*/
    if(!!this.u2_)
    {
        this.u2_.number_ = 2;
        this.u2_.direction_ = 1;
        this.u2_.Init(false);
        this.u2_.changeCharacterFn_ = (function(thisValue)
        {
            return function(direction)
            {
                thisValue.TryChangeCharacter(this,direction);
            }
        })(this);
        if(this.u1_.Selected == null)
            this.u1_.Selected = CHARACTERS.KEN;
        this.u2_.changeCharacterFn_();
    }
}

/**/
CharSelect.prototype.ResetKeys = function()
{
}

/*input handler*/
CharSelect.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
{
    this.u1_.OnKeyStateChanged(isDown,keyCode,frame);
    this.u2_.OnKeyStateChanged(isDown,keyCode,frame);
}

CharSelect.prototype.Check = function()
{
    if(((!!this.u1_ && this.u1_.isCharSelected_) || !this.u1_)
        && ((!!this.u2_ && this.u2_.isCharSelected_) || !this.u2_))
    {
        this.isDone_ = true;
    }
}

/**/
CharSelect.prototype.FrameMove = function(frame)
{
    this.u1_.FrameMove(frame);
    this.u2_.FrameMove(frame);
    this.Check();
}

/**/
CharSelect.prototype.Render = function(frame)
{
    this.u1_.Render(frame);
    this.u2_.Render(frame);
}

/**/
CharSelect.prototype.GetGoodGuys = function()
{
    return [this.u1_.GetPlayer()];
}

/**/
CharSelect.prototype.GetBadGuys = function()
{
    return [this.u2_.GetPlayer()];
}

/**/
CharSelect.prototype.GetStage = function()
{
    return kensStage_;
}


Array.prototype.IndexOf = function(value)
{
    if(!!Array.prototype.indexOf)
        return this.indexOf(value)
    else
    {
        for(var i = 0, length = this.length; i < length; ++i)
            if(this[i] == value)
                return i;
        return -1;
    }
}
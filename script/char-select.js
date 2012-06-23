var CHAR_NAMES = ["ryu","chunli","charlie","ken","guy","birdie","sodom","adon","rose","sagat"];

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
    this.player_ = 0;
    this.Selected = null;
    this.changeCharacterFn_ = null;
    this.animations_ = {};
    this.nbFrames_ = 0;
    this.selectIcon_ = { X:0,Y:0,Element:null,StartFrame:0 };
    this.isCharSelected_ = false;
    this.direction_ = 1;
    this.selectedCharStance_ = { X:undefined, Y:undefined, Element:null,StartFrame:0 }

    this.element_ = {X:0,Y:0,Element:null};
    this.portriatElement_ = {X:0,Y:0,Element:null};
    this.stanceElement_ = {X:0,Y:0,Element:null};
    this.shadowElement_ = {X:0,Y:0,Element:null};
    this.nameElement_ = {X:0,Y:0,Element:null};
    this.isInitialized_ = false;
    this.chooseCharacterFn_ = null;
    this.randomSelect_ = 0;
}

User.prototype.AddStanceAnimations = function()
{
    if(!this.isInitialized_)
    {
        this.animations_["ryu"] = new BasicAnimation("ryu_stance",[],true);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-0.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-1.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-2.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-3.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-2.png",5);    
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-1.png",5);

        this.animations_["ken"] = new BasicAnimation("ken_stance",[],true);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-0.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-1.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-2.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-3.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-2.png",5);    
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-1.png",5);

        this.animations_["sagat"] = new BasicAnimation("sagat_stance",[],true);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-0.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-3.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-2.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-1.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-2.png",5);    
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-3.png",5);    

        this.animations_["guy"] = new BasicAnimation("guy_stance",[],true);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-0.png",26);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-3.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-1.png",26);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-3.png",15);

        this.animations_["birdie"] = new BasicAnimation("birdie_stance",[],true);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-0.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-1.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-2.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-3.png",15);

        this.animations_["chunli"] = new BasicAnimation("chunli_stance",[],true);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-0.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-1.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-2.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-3.png",10);

        this.animations_["charlie"] = new BasicAnimation("charlie_stance",[],true);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-0.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-1.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-3.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-1.png",5);

        this.animations_["sodom"] = new BasicAnimation("sodom_stance",[],true);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-0.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-1.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-2.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-3.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-4.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-5.png",5);


        this.animations_["adon"] = new BasicAnimation("adon_stance",[],true);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-0.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-1.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-2.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-3.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-4.png",5);


        this.animations_["rose"] = new BasicAnimation("rose_stance",[],true);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-0.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-1.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-2.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-3.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-4.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-5.png",5);


        this.animations_["random"] = new BasicAnimation("random",[],true);
        this.animations_["random"].AddFrame(this,"|rose-x-c-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|adon-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|sodom-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|charlie-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|chunli-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|birdie-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|guy-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|sagat-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|ken-x-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"|ryu-x-stance-0.png",5);
    }

    this.isInitialized_ = true;
}

User.prototype.Release = function()
{
    var parentElement = window.document.getElementById("pnlStage");
    RemoveFromDOM(this.selectIcon_.Element);
    RemoveFromDOM(this.portriatElement_);
    RemoveFromDOM(this.element_.Element);
    this.isCharSelected_ = false;
}

User.prototype.Init = function(isUser1)
{
    this.AddStanceAnimations();
    this.selectIcon_.Element = window.document.createElement("div");
    this.selectIcon_.Element.className = "select-icon";
    this.portriatElement_ = window.document.createElement("div");
    this.shadowElement_.Element = window.document.createElement("div");
    this.shadowElement_.Element.className = "stance-shadow";
    this.nameElement_.Element = window.document.createElement("div");
    this.nameElement_.Element.className = "stance-name";
    this.selectedCharStance_.Element = window.document.createElement("div");
    this.element_.Element = window.document.createElement("div");

    var parentElement = window.document.getElementById("pnlStage");
    parentElement.appendChild(this.selectIcon_.Element);
    parentElement.appendChild(this.portriatElement_);
    this.element_.Element.appendChild(this.shadowElement_.Element);
    this.element_.Element.appendChild(this.nameElement_.Element);
    this.element_.Element.appendChild(this.selectedCharStance_.Element);

    parentElement.appendChild(this.element_.Element);

    if(!!isUser1)
    {
        this.Selected = CHARACTERS.RYU;
        this.animations_["select_icon"] = new BasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-1.png",1);

        this.element_.Element.className = "stance-container-p1";
        this.portriatElement_.className = "select-portriat-p1";
        this.selectedCharStance_.Element.className = "select-stance-p1"
    }
    else
    {
        this.Selected = CHARACTERS.KEN;
        this.animations_["select_icon"] = new BasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p2-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p2-select-1.png",1);

        this.element_.Element.className = "stance-container-p2";
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
                this.chooseCharacterFn_(this)
            }

            if(!!direction)
            {
                this.changeCharacterFn_(direction);
                this.ShowCharacter();
            }
        }
    }
}

User.prototype.ShowCharacter = function()
{
    switch(this.Selected)
    {
        case CHARACTERS.RYU: { this.currentStance_ = "ryu"; this.SetPositions("7px","17px","27px","0px",10,32); break; }
        case CHARACTERS.CHUNLI: { this.currentStance_ = "chunli"; this.SetPositions("7px","17px","27px","0px",12,28); break; }
        case CHARACTERS.CHARLIE: { this.currentStance_ = "charlie"; this.SetPositions("7px","17px","10px","0px",10,41); break; }
        case CHARACTERS.KEN: { this.currentStance_ = "ken"; this.SetPositions("7px","17px","27px","0px",10,32); break; }
        case CHARACTERS.GUY: { this.currentStance_ = "guy"; this.SetPositions("7px","17px","27px","0px",0,32); break; }
        case CHARACTERS.BIRDIE: { this.currentStance_ = "birdie"; this.SetPositions("7px","17px","27px","0px",16,28); break; }
        case CHARACTERS.SODOM: { this.currentStance_ = "sodom"; this.SetPositions("7px","17px","10px","0px",10,24); break; }
        case CHARACTERS.ADON: { this.currentStance_ = "adon"; this.SetPositions("7px","17px","27px","0px",10,32); break; }
        case CHARACTERS.RANDOM1: { this.randomSelect_ = this.randomSelect_ || 1; break; }
        case CHARACTERS.ROSE: { this.currentStance_ = "rose"; this.SetPositions("-3px","17px","2px","0px",-32,32); break; }
        case CHARACTERS.SAGAT: { this.currentStance_ = "sagat"; this.SetPositions("7px","17px","10px","0px",16,28); break; }
        case CHARACTERS.RANDOM2: { this.randomSelect_ = this.randomSelect_ || 1; break; }
        /*
        case CHARACTERS.AKUMA: { this.portriatElement_.src = (this.player_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        case CHARACTERS.MBISON: { this.portriatElement_.src = (this.player_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        case CHARACTERS.DAN: { this.portriatElement_.src = (this.player_ == 1 ? "images/misc/misc/p1-select-portriat.png" : "images/misc/misc/p2-select-portriat.png"); break; }
        */
    };

    spriteLookup_.Set(this.portriatElement_, (this.player_ == 1 ? "images/misc/misc/p1-select-" + this.currentStance_ + ".png" : "images/misc/misc/p2-select-" + this.currentStance_ + ".png"));
    //this.portriatElement_.src = (this.player_ == 1 ? "images/misc/misc/p1-select-" + this.currentStance_ + ".png" : "images/misc/misc/p2-select-" + this.currentStance_ + ".png");

    spriteLookup_.Set(this.shadowElement_.Element, "images/misc/misc/" + this.currentStance_ + "-shadow.png");
    //this.shadowElement_.Element.src = "images/misc/" + this.currentStance_ + "/shadow.png";

    spriteLookup_.Set(this.nameElement_.Element, "images/misc/font3/name-" + this.currentStance_ + ".png");
    //this.nameElement_.Element.src = "images/misc/font3/" + this.currentStance_ + ".png";

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

User.prototype.SetPositions = function(shadowX,shadowY,nameX,nameY,stanceX,stanceY)
{
    this.Show();
    if(this.player_ == 1)
    {
        this.shadowElement_.X = shadowX;
        this.shadowElement_.Y = shadowY;
        this.nameElement_.X = nameX;
        this.nameElement_.Y = nameY;
        this.selectedCharStance_.X = stanceX;
        this.selectedCharStance_.Y = stanceY;
    }
    else
    {
        this.shadowElement_.X = shadowX;
        this.shadowElement_.Y = shadowY;
        this.nameElement_.X = nameX;
        this.nameElement_.Y = nameY;
        this.selectedCharStance_.X = stanceX;
        this.selectedCharStance_.Y = stanceY;
    }
}

/*this is just used to hide elements for players that arent implemented*/
User.prototype.SetDisplay = function(show)
{
    this.element_.Element.style.display = !!show ? "" : "none";
}

User.prototype.Hide = function() {this.SetDisplay(false);} 
User.prototype.Show = function() {this.SetDisplay(true);} 

/*selecting a character*/
User.prototype.FrameMove = function(frame)
{
    if(!!this.randomSelect_ && (frame % 5 == 0))
    {
        this.currentStance_ = CHAR_NAMES[this.randomSelect_-1]
        this.ShowCharacter();
        if(++this.randomSelect_ > CHAR_NAMES.length)
            this.randomSelect_ = 1;
    }
}

/*renders the users selected items*/
User.prototype.Render = function(frame)
{
    if(this.player_ == 1)
    {
        this.shadowElement_.Element.style.left = this.shadowElement_.X;
        this.shadowElement_.Element.style.bottom = this.shadowElement_.Y;
        this.nameElement_.Element.style.left = this.nameElement_.X;
        this.nameElement_.Element.style.bottom = this.nameElement_.Y;
    }
    else
    {
        this.shadowElement_.Element.style.right = this.shadowElement_.X;
        this.shadowElement_.Element.style.bottom = this.shadowElement_.Y;
        this.nameElement_.Element.style.right =  this.nameElement_.X;
        this.nameElement_.Element.style.bottom = this.nameElement_.Y;
    }

    if(!this.isCharSelected_)
        this.animations_["select_icon"].TryRender(frame, this.selectIcon_);

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
    this.music_ = "audio/misc/player-select.ogg";
    this.sounds_ = [];
}

CharSelect.prototype.RestartMusic = function()
{
    soundManager_.Replay(this.music_);
}

CharSelect.prototype.PlayMusic = function()
{
    soundManager_.PlayOrResume(this.music_,true);
}

CharSelect.prototype.PauseMusic = function()
{
    soundManager_.Pause(this.music_);
}

/**/
CharSelect.prototype.Pause = function()
{
    this.PauseMusic();
}

/**/
CharSelect.prototype.Resume = function()
{
    this.PlayMusic();
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
    var isUser1 = who.player_ == 1;
    var isUser2 = who.player_ == 2;

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

    var tmpRow = this.GetRow(who);
    var tmpCol = this.GetColumn(who);

    if(tmpRow != row || tmpCol != col)
    {
        if(isUser1)
            this.QueueUser1MoveSound();
        else
            this.QueueUser2MoveSound();
            
    }

    row = tmpRow;
    col = tmpCol;

    who.selectIcon_.Y = CONSTANTS.CHARSELECT_Y - (row * CONSTANTS.CHARSELECT_HEIGHT);
    who.selectIcon_.X = CONSTANTS.CHARSELECT_X + (col * CONSTANTS.CHARSELECT_WIDTH);
}


/**/
CharSelect.prototype.Kill = function()
{
    this.Release();
}

/**/
CharSelect.prototype.Release = function()
{
    soundManager_.Unload(this.music_);
    var parentElement = window.document.getElementById("pnlStage");
    parentElement.style.backgroundImage = "";
    parentElement.style.backgroundRepeat = "";

    //parentElement.removeChild(this.element_);
    //parentElement.removeChild(this.playerSelectImg_);

    RemoveChildrenFromDOM(this.element_);
    RemoveChildrenFromDOM(this.playerSelectImg_);


    if(!!this.u1_)
        this.u1_.Release();
    if(!!this.u2_)
        this.u2_.Release();
}

/**/
CharSelect.prototype.Init = function()
{
    LoadCharSelectSpriteData();
    this.element_ = window.document.createElement("div");
    this.element_.className = "select";

    this.playerSelectImg_ = window.document.createElement("img");
    this.playerSelectImg_.className = "player-select";
    this.playerSelectImg_.src = "images/misc/misc/player-select.png";


    var parentElement = window.document.getElementById("pnlStage");
    parentElement.appendChild(this.playerSelectImg_);
    parentElement.appendChild(this.element_);
    parentElement.style.backgroundImage = "url(images/misc/misc/player-select-back-bg.png)";
    parentElement.style.backgroundRepeat = "no-repeat";

    /*init music*/
    soundManager_.Load(this.music_);

    /*Init user 1*/
    if(!!this.u1_)
    {
        this.u1_.player_ = 1;
        this.u1_.direction_ = -1;
        this.u1_.Init(true);
        this.u1_.changeCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.TryChangeCharacter(this,direction); } })(this);
        this.u1_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser1ChooseSound(); } })(this);

        if(this.u1_.Selected == null)
            this.u1_.Selected = CHARACTERS.RYU;
        this.u1_.changeCharacterFn_();
        this.u1_.ShowCharacter();
    }

    /*Init user 2*/
    if(!!this.u2_)
    {
        this.u2_.player_ = 2;
        this.u2_.direction_ = 1;
        this.u2_.Init(false);
        this.u2_.changeCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.TryChangeCharacter(this,direction); } })(this);
        this.u2_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser2ChooseSound(); } })(this);

        if(this.u1_.Selected == null)
            this.u1_.Selected = CHARACTERS.KEN;
        this.u2_.changeCharacterFn_();
        this.u2_.ShowCharacter();
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
    this.PlaySounds();
}

CharSelect.prototype.PlaySounds = function()
{
    while(this.sounds_.length > 0)
        soundManager_.Play(this.sounds_.splice(0,1));
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

/*For now - only Ken's stage is implemented*/
CharSelect.prototype.GetStage = function()
{
    return kensStage_;
}

/**/
CharSelect.prototype.QueueUser1MoveSound = function(value) { this.sounds_[this.sounds_.length] = "audio/misc/p-select-move-0.ogg"; }
CharSelect.prototype.QueueUser1ChooseSound = function(value) { this.sounds_[this.sounds_.length] = "audio/misc/p-select-choose-0.ogg"; }
CharSelect.prototype.QueueUser2MoveSound = function(value) { this.sounds_[this.sounds_.length] = "audio/misc/p-select-move-1.ogg"; }
CharSelect.prototype.QueueUser2ChooseSound = function(value) { this.sounds_[this.sounds_.length] = "audio/misc/p-select-choose-0.ogg"; }


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

var LoadCharSelectSpriteData = function()
{
	spriteLookup_.Load("adon-l-stance-0.png","|images/misc/misc/stance-sprites.png", "0px", "-13px", "148px", "270px");
	spriteLookup_.Load("adon-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-148px", "-10px", "150px", "273px");
	spriteLookup_.Load("adon-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-298px", "-8px", "154px", "275px");
	spriteLookup_.Load("adon-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-452px", "-10px", "154px", "273px");
	spriteLookup_.Load("adon-l-stance-4.png","|images/misc/misc/stance-sprites.png", "-606px", "-8px", "152px", "275px");
	spriteLookup_.Load("adon-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-758px", "-13px", "148px", "270px");
	spriteLookup_.Load("adon-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-906px", "-10px", "150px", "273px");
	spriteLookup_.Load("adon-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-1056px", "-8px", "154px", "275px");
	spriteLookup_.Load("adon-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-1210px", "-10px", "154px", "273px");
	spriteLookup_.Load("adon-r-stance-4.png","|images/misc/misc/stance-sprites.png", "-1364px", "-8px", "152px", "275px");
	spriteLookup_.Load("birdie-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-1516px", "0px", "196px", "283px");
	spriteLookup_.Load("birdie-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-1712px", "-5px", "200px", "278px");
	spriteLookup_.Load("birdie-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-1912px", "-5px", "200px", "278px");
	spriteLookup_.Load("birdie-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-2112px", "-3px", "196px", "280px");
	spriteLookup_.Load("birdie-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-2308px", "0px", "196px", "283px");
	spriteLookup_.Load("birdie-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-2504px", "-5px", "200px", "278px");
	spriteLookup_.Load("birdie-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-2704px", "-5px", "200px", "278px");
	spriteLookup_.Load("birdie-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-2904px", "-3px", "196px", "280px");
	spriteLookup_.Load("charlie-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-3100px", "-36px", "176px", "247px");
	spriteLookup_.Load("charlie-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-3276px", "-33px", "176px", "250px");
	spriteLookup_.Load("charlie-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-3452px", "-31px", "178px", "252px");
	spriteLookup_.Load("charlie-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-3630px", "-31px", "178px", "252px");
	spriteLookup_.Load("charlie-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-3808px", "-36px", "176px", "247px");
	spriteLookup_.Load("charlie-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-3984px", "-33px", "176px", "250px");
	spriteLookup_.Load("charlie-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-4160px", "-31px", "178px", "252px");
	spriteLookup_.Load("charlie-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-4338px", "-31px", "178px", "252px");
	spriteLookup_.Load("chunli-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-4516px", "-62px", "180px", "221px");
	spriteLookup_.Load("chunli-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-4696px", "-59px", "180px", "224px");
	spriteLookup_.Load("chunli-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-4876px", "-57px", "180px", "226px");
	spriteLookup_.Load("chunli-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-5056px", "-59px", "180px", "224px");
	spriteLookup_.Load("chunli-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-5236px", "-62px", "180px", "221px");
	spriteLookup_.Load("chunli-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-5416px", "-59px", "180px", "224px");
	spriteLookup_.Load("chunli-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-5596px", "-57px", "180px", "226px");
	spriteLookup_.Load("chunli-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-5776px", "-59px", "180px", "224px");
	spriteLookup_.Load("guy-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-5956px", "-36px", "148px", "247px");
	spriteLookup_.Load("guy-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-6104px", "-36px", "146px", "247px");
	spriteLookup_.Load("guy-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-6250px", "-36px", "148px", "247px");
	spriteLookup_.Load("guy-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-6398px", "-36px", "148px", "247px");
	spriteLookup_.Load("guy-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-6546px", "-36px", "148px", "247px");
	spriteLookup_.Load("guy-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-6694px", "-36px", "146px", "247px");
	spriteLookup_.Load("guy-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-6840px", "-36px", "148px", "247px");
	spriteLookup_.Load("guy-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-6988px", "-36px", "148px", "247px");
	spriteLookup_.Load("ken-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-7136px", "-43px", "132px", "240px");
	spriteLookup_.Load("ken-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-7268px", "-41px", "132px", "242px");
	spriteLookup_.Load("ken-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-7400px", "-36px", "132px", "247px");
	spriteLookup_.Load("ken-l-stance-3.png","|images/misc/misc/stance-sprites.png", "0px", "-344px", "129px", "253px");
	spriteLookup_.Load("ken-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-129px", "-357px", "132px", "240px");
	spriteLookup_.Load("ken-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-261px", "-355px", "132px", "242px");
	spriteLookup_.Load("ken-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-393px", "-350px", "132px", "247px");
	spriteLookup_.Load("ken-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-525px", "-344px", "129px", "253px");
	spriteLookup_.Load("rose-l-c-stance-0.png","|images/misc/misc/stance-sprites.png", "-654px", "-317px", "190px", "280px");
	spriteLookup_.Load("rose-l-c-stance-1.png","|images/misc/misc/stance-sprites.png", "-844px", "-319px", "188px", "278px");
	spriteLookup_.Load("rose-l-c-stance-2.png","|images/misc/misc/stance-sprites.png", "-1032px", "-322px", "186px", "275px");
	spriteLookup_.Load("rose-l-c-stance-3.png","|images/misc/misc/stance-sprites.png", "-1218px", "-327px", "188px", "270px");
	spriteLookup_.Load("rose-l-c-stance-4.png","|images/misc/misc/stance-sprites.png", "-1406px", "-324px", "190px", "273px");
	spriteLookup_.Load("rose-l-c-stance-5.png","|images/misc/misc/stance-sprites.png", "-1596px", "-322px", "190px", "275px");
	spriteLookup_.Load("rose-r-c-stance-0.png","|images/misc/misc/stance-sprites.png", "-1786px", "-317px", "190px", "280px");
	spriteLookup_.Load("rose-r-c-stance-1.png","|images/misc/misc/stance-sprites.png", "-1976px", "-319px", "188px", "278px");
	spriteLookup_.Load("rose-r-c-stance-2.png","|images/misc/misc/stance-sprites.png", "-2164px", "-322px", "186px", "275px");
	spriteLookup_.Load("rose-r-c-stance-3.png","|images/misc/misc/stance-sprites.png", "-2350px", "-327px", "188px", "270px");
	spriteLookup_.Load("rose-r-c-stance-4.png","|images/misc/misc/stance-sprites.png", "-2538px", "-324px", "190px", "273px");
	spriteLookup_.Load("rose-r-c-stance-5.png","|images/misc/misc/stance-sprites.png", "-2728px", "-322px", "190px", "275px");
	spriteLookup_.Load("ryu-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-2918px", "-358px", "132px", "239px");
	spriteLookup_.Load("ryu-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-3050px", "-355px", "132px", "242px");
	spriteLookup_.Load("ryu-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-3182px", "-350px", "132px", "247px");
	spriteLookup_.Load("ryu-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-3314px", "-345px", "129px", "252px");
	spriteLookup_.Load("ryu-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-3443px", "-358px", "132px", "239px");
	spriteLookup_.Load("ryu-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-3575px", "-355px", "132px", "242px");
	spriteLookup_.Load("ryu-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-3707px", "-350px", "132px", "247px");
	spriteLookup_.Load("ryu-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-3839px", "-345px", "129px", "252px");
	spriteLookup_.Load("sagat-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-3968px", "-283px", "164px", "314px");
	spriteLookup_.Load("sagat-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-4132px", "-296px", "162px", "301px");
	spriteLookup_.Load("sagat-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-4294px", "-293px", "162px", "304px");
	spriteLookup_.Load("sagat-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-4456px", "-288px", "164px", "309px");
	spriteLookup_.Load("sagat-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-4620px", "-283px", "164px", "314px");
	spriteLookup_.Load("sagat-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-4784px", "-296px", "162px", "301px");
	spriteLookup_.Load("sagat-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-4946px", "-293px", "162px", "304px");
	spriteLookup_.Load("sagat-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-5108px", "-288px", "164px", "309px");
	spriteLookup_.Load("sodom-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-5272px", "-296px", "176px", "301px");
	spriteLookup_.Load("sodom-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-5448px", "-294px", "178px", "303px");
	spriteLookup_.Load("sodom-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-5626px", "-289px", "174px", "308px");
	spriteLookup_.Load("sodom-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-5800px", "-286px", "172px", "311px");
	spriteLookup_.Load("sodom-l-stance-4.png","|images/misc/misc/stance-sprites.png", "-5972px", "-289px", "174px", "308px");
	spriteLookup_.Load("sodom-l-stance-5.png","|images/misc/misc/stance-sprites.png", "-6146px", "-294px", "178px", "303px");
	spriteLookup_.Load("sodom-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-6324px", "-296px", "176px", "301px");
	spriteLookup_.Load("sodom-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-6500px", "-294px", "178px", "303px");
	spriteLookup_.Load("sodom-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-6678px", "-289px", "174px", "308px");
	spriteLookup_.Load("sodom-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-6852px", "-286px", "172px", "311px");
	spriteLookup_.Load("sodom-r-stance-4.png","|images/misc/misc/stance-sprites.png", "-7024px", "-289px", "174px", "308px");
	spriteLookup_.Load("sodom-r-stance-5.png","|images/misc/misc/stance-sprites.png", "-7198px", "-294px", "178px", "303px");

	spriteLookup_.Load("images/misc/misc/p1-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "0px", "64px", "82px");
	spriteLookup_.Load("images/misc/misc/p1-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "0px", "64px", "82px");
	spriteLookup_.Load("images/misc/misc/p2-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "-82px", "64px", "82px");
	spriteLookup_.Load("images/misc/misc/p2-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "-82px", "64px", "82px");

	spriteLookup_.Load("images/misc/font3/name-adon.png","|images/misc/font3/name-sprites.png", "0px", "0px", "129px", "41px");
	spriteLookup_.Load("images/misc/font3/name-birdie.png","|images/misc/font3/name-sprites.png", "-129px", "-9px", "160px", "32px");
	spriteLookup_.Load("images/misc/font3/name-charlie.png","|images/misc/font3/name-sprites.png", "-289px", "0px", "160px", "41px");
	spriteLookup_.Load("images/misc/font3/name-chunli.png","|images/misc/font3/name-sprites.png", "-449px", "0px", "160px", "41px");
	spriteLookup_.Load("images/misc/font3/name-guy.png","|images/misc/font3/name-sprites.png", "-609px", "-9px", "96px", "32px");
	spriteLookup_.Load("images/misc/font3/name-ken.png","|images/misc/font3/name-sprites.png", "0px", "-41px", "96px", "41px");
	spriteLookup_.Load("images/misc/font3/name-rose.png","|images/misc/font3/name-sprites.png", "-96px", "-41px", "128px", "41px");
	spriteLookup_.Load("images/misc/font3/name-ryu.png","|images/misc/font3/name-sprites.png", "-224px", "-41px", "96px", "41px");
	spriteLookup_.Load("images/misc/font3/name-sagat.png","|images/misc/font3/name-sprites.png", "-320px", "-41px", "160px", "41px");
	spriteLookup_.Load("images/misc/font3/name-sodom.png","|images/misc/font3/name-sprites.png", "-480px", "-41px", "161px", "41px");

	spriteLookup_.Load("images/misc/misc/p1-select-adon.png","|images/misc/misc/head-sprites.png", "0px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-birdie.png","|images/misc/misc/head-sprites.png", "-256px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-charlie.png","|images/misc/misc/head-sprites.png", "-512px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-chunli.png","|images/misc/misc/head-sprites.png", "-768px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-guy.png","|images/misc/misc/head-sprites.png", "-1024px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-ken.png","|images/misc/misc/head-sprites.png", "-1280px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-rose.png","|images/misc/misc/head-sprites.png", "-1536px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-ryu.png","|images/misc/misc/head-sprites.png", "-1792px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-sagat.png","|images/misc/misc/head-sprites.png", "-2048px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p1-select-sodom.png","|images/misc/misc/head-sprites.png", "-2304px", "0px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-adon.png","|images/misc/misc/head-sprites.png", "0px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-birdie.png","|images/misc/misc/head-sprites.png", "-256px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-charlie.png","|images/misc/misc/head-sprites.png", "-512px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-chunli.png","|images/misc/misc/head-sprites.png", "-768px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-guy.png","|images/misc/misc/head-sprites.png", "-1024px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-ken.png","|images/misc/misc/head-sprites.png", "-1280px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-rose.png","|images/misc/misc/head-sprites.png", "-1536px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-ryu.png","|images/misc/misc/head-sprites.png", "-1792px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-sagat.png","|images/misc/misc/head-sprites.png", "-2048px", "-288px", "256px", "288px");
	spriteLookup_.Load("images/misc/misc/p2-select-sodom.png","|images/misc/misc/head-sprites.png", "-2304px", "-288px", "256px", "288px");
}
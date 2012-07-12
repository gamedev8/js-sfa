var CHAR_NAMES = ["ryu","chunli","charlie","ken","guy","birdie","sodom","adon","rose","sagat"];

var User = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn)
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
    this.Turn = turn;
    this.player_ = 0;
    this.selected_ = null;
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
    this.getOtherCharacterFn_ = null;
    this.randomSelect_ = 0;
    this.isAlternateChar_ = false;
}

User.prototype.AddStanceAnimations = function()
{
    if(!this.isInitialized_)
    {
        this.animations_["ryu"] = CreateBasicAnimation("ryu_stance",[],true);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-0.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-1.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-2.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-3.png",5);
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-2.png",5);    
        this.animations_["ryu"].AddFrame(this,"|ryu-x-stance-1.png",5);
        this.animations_["ryu_selected"] = CreateBasicAnimation("ryu_selected",[],true);
        this.animations_["ryu_selected"].AddFrame(this,"|ryu-x-win-2-0.png",5);
        this.animations_["ryu_selected"].AddFrame(this,"|ryu-x-win-2-1.png",5);
        this.animations_["ryu_selected"].AddFrame(this,"|ryu-x-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.animations_["ken"] = CreateBasicAnimation("ken_stance",[],true);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-0.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-1.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-2.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-3.png",5);
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-2.png",5);    
        this.animations_["ken"].AddFrame(this,"|ken-x-stance-1.png",5);
        this.animations_["ken_selected"] = CreateBasicAnimation("ken_selected",[],true);
        this.animations_["ken_selected"].AddFrame(this,"|ken-x-win-2-0.png",5);
        this.animations_["ken_selected"].AddFrame(this,"|ken-x-win-2-1.png",5);
        this.animations_["ken_selected"].AddFrame(this,"|ken-x-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.animations_["sagat"] = CreateBasicAnimation("sagat_stance",[],true);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-0.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-3.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-2.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-1.png",5);
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-2.png",5);    
        this.animations_["sagat"].AddFrame(this,"|sagat-x-stance-3.png",5);    

        this.animations_["guy"] = CreateBasicAnimation("guy_stance",[],true);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-0.png",26);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-3.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-1.png",26);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"|guy-x-stance-3.png",15);

        this.animations_["birdie"] = CreateBasicAnimation("birdie_stance",[],true);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-0.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-1.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-2.png",15);
        this.animations_["birdie"].AddFrame(this,"|birdie-x-stance-3.png",15);

        this.animations_["chunli"] = CreateBasicAnimation("chunli_stance",[],true);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-0.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-1.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-2.png",10);
        this.animations_["chunli"].AddFrame(this,"|chunli-x-stance-3.png",10);

        this.animations_["charlie"] = CreateBasicAnimation("charlie_stance",[],true);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-0.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-1.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-3.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"|charlie-x-stance-1.png",5);

        this.animations_["sodom"] = CreateBasicAnimation("sodom_stance",[],true);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-0.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-1.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-2.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-3.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-4.png",5);
        this.animations_["sodom"].AddFrame(this,"|sodom-x-stance-5.png",5);


        this.animations_["adon"] = CreateBasicAnimation("adon_stance",[],true);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-0.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-1.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-2.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-3.png",5);
        this.animations_["adon"].AddFrame(this,"|adon-x-stance-4.png",5);


        this.animations_["rose"] = CreateBasicAnimation("rose_stance",[],true);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-0.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-1.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-2.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-3.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-4.png",5);
        this.animations_["rose"].AddFrame(this,"|rose-x-c-stance-5.png",5);


        this.animations_["random"] = CreateBasicAnimation("random",[],true);
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
    utils_.RemoveFromDOM(this.selectIcon_.Element);
    utils_.RemoveFromDOM(this.portriatElement_);
    utils_.RemoveFromDOM(this.element_.Element);
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
        this.selected_ = CHARACTERS.RYU;
        this.animations_["select_icon"] = CreateBasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-1.png",1);

        this.element_.Element.className = "stance-container-p1";
        this.portriatElement_.className = "select-portriat-p1";
        this.selectedCharStance_.Element.className = "select-stance-p1"
    }
    else
    {
        this.selected_ = CHARACTERS.KEN;
        this.animations_["select_icon"] = CreateBasicAnimation("select_icon",[],true);
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
    if(!!isDown)
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
                /*
                if(this.selected_ == CHARACTERS.RYU
                    || this.selected_ == CHARACTERS.KEN
                    || this.selected_ == CHARACTERS.MBISON)
                */
                if(this.currentStance_ == "ken"
                    || this.currentStance_ == "ryu")
                {
                    this.isCharSelected_ = true;
                    this.chooseCharacterFn_(this);
                    this.folder_ = this.currentStance_;
                    this.currentStance_ += "_selected";
                    if(this.getOtherCharacterFn_() == this.currentStance_)
                    {
                        this.isAlternateChar_ = true;
                    }
                }
            }

            if(!!direction)
            {
                this.changeCharacterFn_(direction);
                this.ShowCharacter();
            }
            if(!!this.isCharSelected_)
            {
                switch(this.currentStance_)
                {
                    case "ken_selected": this.selected_ = CHARACTERS.KEN; break;
                    case "ryu_selected": this.selected_ = CHARACTERS.RYU; break;
                };
            }
       }
    }
}

User.prototype.ShowCharacter = function()
{
    switch(this.selected_)
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
    switch(this.selected_)
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
    if(!this.isCharSelected_ && !!this.randomSelect_ && (frame % 5 == 0))
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


var CreateCharSelect = function(user1,user2)
{
    var u1_ = user1;
    var u2_ = user2;
    var CharSelect = function()
    {

        this.charsMax_ = 11;
        this.charsRow1_ = {Min:0,Max:3};
        this.charsRow2_ = {Min:4,Max:7};
        this.charsRow3_ = {Min:8,Max:11};

        this.charsCol1_ = [0,4,8];
        this.charsCol2_ = [1,5,9];
        this.charsCol3_ = [2,6,10];
        this.charsCol4_ = [3,7,11];

        this.delayAfterSelect_ = 0;
        this.element_ = null;
        this.playerSelectImg_ = null;
        this.music_ = "audio/misc/player-select.zzz";
        this.sounds_ = [];

        this.LoadSounds();
    }

    CharSelect.prototype.RestartMusic = function()
    {
        soundManager_.Restart(this.music_);
    }

    CharSelect.prototype.PlayMusic = function()
    {
        soundManager_.Play(this.music_,true);
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

    /**/
    CharSelect.prototype.Start = function()
    {
        this.Init();
        this.PlayMusic();
    }

    CharSelect.prototype.GetRow = function(user)
    {
        if((user.selected_ <= this.charsRow1_.Max) && (user.selected_ >= this.charsRow1_.Min))
            return CONSTANTS.ROW1;
        else if((user.selected_ <= this.charsRow2_.Max) && (user.selected_ >= this.charsRow2_.Min))
            return CONSTANTS.ROW2;
        else if((user.selected_ <= this.charsRow3_.Max) && (user.selected_ >= this.charsRow3_.Min))
            return CONSTANTS.ROW3;
    }

    CharSelect.prototype.GetColumn = function(user)
    {
        if(-1 < this.charsCol1_.IndexOf(user.selected_))
            return CONSTANTS.COL1;
        else if(-1 < this.charsCol2_.IndexOf(user.selected_))
            return CONSTANTS.COL2;
        else if(-1 < this.charsCol3_.IndexOf(user.selected_))
            return CONSTANTS.COL3;
        else if(-1 < this.charsCol4_.IndexOf(user.selected_))
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
            if(row != CONSTANTS.ROW3 && !(isUser1 && who.selected_ == 7) && !(isUser2 && who.selected_ == 4))
                who.selected_ = Math.min(who.selected_ + 4, this.charsMax_);
        }
        else if(direction == CONSTANTS.UP)
        {
            if(row != CONSTANTS.ROW1)
                who.selected_ = Math.max(who.selected_ - 4, 0);
        }
        else
        {
            switch(row)
            {
                case CONSTANTS.ROW1:
                {
                    if(direction == CONSTANTS.RIGHT)  who.selected_ = Math.min(who.selected_ + 1, this.charsRow1_.Max);
                    else if(direction == CONSTANTS.LEFT) who.selected_ = Math.max(who.selected_ - 1, this.charsRow1_.Min);
                    break;
                }
                case CONSTANTS.ROW2:
                {
                    if(direction == CONSTANTS.RIGHT) who.selected_ = Math.min(who.selected_ + 1, this.charsRow2_.Max);
                    else if(direction == CONSTANTS.LEFT) who.selected_ = Math.max(who.selected_ - 1, this.charsRow2_.Min);
                    break;
                }
                case CONSTANTS.ROW3:
                {
                    /*ensure that the player can only go to its own random select*/
                    if(direction == CONSTANTS.RIGHT && !(isUser1 && who.selected_ == 10)) who.selected_ = Math.min(who.selected_ + 1, this.charsRow3_.Max);
                    else if(direction == CONSTANTS.LEFT && !(isUser2 && who.selected_ == 9)) who.selected_ = Math.max(who.selected_ - 1, this.charsRow3_.Min);
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

        utils_.RemoveChildrenFromDOM(this.element_);
        utils_.RemoveChildrenFromDOM(this.playerSelectImg_);


        if(!!u1_)
            u1_.Release();
        if(!!u2_)
            u2_.Release();
    }

    /**/
    CharSelect.prototype.Init = function()
    {
        LoadCharSelectSpriteData();
        this.delayAfterSelect_ = 0;
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
        if(!!u1_)
        {
            u1_.player_ = 1;
            u1_.direction_ = -1;
            u1_.Init(true);
            u1_.changeCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.TryChangeCharacter(this,direction); } })(this);
            u1_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser1ChooseSound(); } })(this);
            u1_.getOtherCharacterFn_ = (function(thisValue) { return function(direction) { return thisValue.currentStance_; } })(u2_);

            if(u1_.selected_ == null)
                u1_.selected_ = CHARACTERS.RYU;
            u1_.changeCharacterFn_();
            u1_.ShowCharacter();
        }

        /*Init user 2*/
        if(!!u2_)
        {
            u2_.player_ = 2;
            u2_.direction_ = 1;
            u2_.Init(false);
            u2_.changeCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.TryChangeCharacter(this,direction); } })(this);
            u2_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser2ChooseSound(); } })(this);
            u2_.getOtherCharacterFn_ = (function(thisValue) { return function(direction) { return thisValue.currentStance_; } })(u1_);

            if(u1_.selected_ == null)
                u1_.selected_ = CHARACTERS.KEN;
            u2_.changeCharacterFn_();
            u2_.ShowCharacter();
        }
    }

    /**/
    CharSelect.prototype.ResetKeys = function()
    {
    }

    /*input handler*/
    CharSelect.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
    {
        u1_.OnKeyStateChanged(isDown,keyCode,frame);
        u2_.OnKeyStateChanged(isDown,keyCode,frame);
    }

    CharSelect.prototype.Check = function()
    {
        if(((!!u1_ && u1_.isCharSelected_) || !u1_)
            && ((!!u2_ && u2_.isCharSelected_) || !u2_))
        {
            this.isDone_ = true;
            ++this.delayAfterSelect_;
        }
    }

    /**/
    CharSelect.prototype.FrameMove = function(frame)
    {
        u1_.FrameMove(frame);
        u2_.FrameMove(frame);
        this.Check();
    }

    /**/
    CharSelect.prototype.Render = function(frame)
    {
        u1_.Render(frame);
        u2_.Render(frame);
    }


    /**/
    CharSelect.prototype.GetGoodGuys = function()
    {
        return [u1_.GetPlayer()];
    }

    /**/
    CharSelect.prototype.GetBadGuys = function()
    {
        return [u2_.GetPlayer()];
    }

    /*For now - only Ken's stage is implemented*/
    CharSelect.prototype.GetStage = function()
    {
        return kensStage_;
    }

    /**/
    CharSelect.prototype.QueueUser1MoveSound = function(value) { soundManager_.QueueSound("audio/misc/p-select-move-0.zzz"); }
    CharSelect.prototype.QueueUser1ChooseSound = function(value) { soundManager_.QueueSound("audio/misc/p-select-choose-0.zzz"); }
    CharSelect.prototype.QueueUser2MoveSound = function(value) { soundManager_.QueueSound("audio/misc/p-select-move-1.zzz"); }
    CharSelect.prototype.QueueUser2ChooseSound = function(value) { soundManager_.QueueSound("audio/misc/p-select-choose-0.zzz"); }


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
	    spriteLookup_.Load("adon-l-stance-0.png","|images/misc/misc/stance-sprites.png", "0px", "-33px", "148px", "270px");
	    spriteLookup_.Load("adon-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-148px", "-30px", "150px", "273px");
	    spriteLookup_.Load("adon-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-298px", "-28px", "154px", "275px");
	    spriteLookup_.Load("adon-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-452px", "-30px", "154px", "273px");
	    spriteLookup_.Load("adon-l-stance-4.png","|images/misc/misc/stance-sprites.png", "-606px", "-28px", "152px", "275px");
	    spriteLookup_.Load("adon-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-758px", "-33px", "148px", "270px");
	    spriteLookup_.Load("adon-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-906px", "-30px", "150px", "273px");
	    spriteLookup_.Load("adon-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-1056px", "-28px", "154px", "275px");
	    spriteLookup_.Load("adon-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-1210px", "-30px", "154px", "273px");
	    spriteLookup_.Load("adon-r-stance-4.png","|images/misc/misc/stance-sprites.png", "-1364px", "-28px", "152px", "275px");
	    spriteLookup_.Load("birdie-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-1516px", "-20px", "196px", "283px");
	    spriteLookup_.Load("birdie-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-1712px", "-25px", "200px", "278px");
	    spriteLookup_.Load("birdie-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-1912px", "-25px", "200px", "278px");
	    spriteLookup_.Load("birdie-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-2112px", "-23px", "196px", "280px");
	    spriteLookup_.Load("birdie-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-2308px", "-20px", "196px", "283px");
	    spriteLookup_.Load("birdie-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-2504px", "-25px", "200px", "278px");
	    spriteLookup_.Load("birdie-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-2704px", "-25px", "200px", "278px");
	    spriteLookup_.Load("birdie-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-2904px", "-23px", "196px", "280px");
	    spriteLookup_.Load("charlie-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-3100px", "-56px", "176px", "247px");
	    spriteLookup_.Load("charlie-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-3276px", "-53px", "176px", "250px");
	    spriteLookup_.Load("charlie-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-3452px", "-51px", "178px", "252px");
	    spriteLookup_.Load("charlie-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-3630px", "-51px", "178px", "252px");
	    spriteLookup_.Load("charlie-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-3808px", "-56px", "176px", "247px");
	    spriteLookup_.Load("charlie-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-3984px", "-53px", "176px", "250px");
	    spriteLookup_.Load("charlie-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-4160px", "-51px", "178px", "252px");
	    spriteLookup_.Load("charlie-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-4338px", "-51px", "178px", "252px");
	    spriteLookup_.Load("chunli-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-4516px", "-82px", "180px", "221px");
	    spriteLookup_.Load("chunli-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-4696px", "-79px", "180px", "224px");
	    spriteLookup_.Load("chunli-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-4876px", "-77px", "180px", "226px");
	    spriteLookup_.Load("chunli-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-5056px", "-79px", "180px", "224px");
	    spriteLookup_.Load("chunli-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-5236px", "-82px", "180px", "221px");
	    spriteLookup_.Load("chunli-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-5416px", "-79px", "180px", "224px");
	    spriteLookup_.Load("chunli-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-5596px", "-77px", "180px", "226px");
	    spriteLookup_.Load("chunli-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-5776px", "-79px", "180px", "224px");
	    spriteLookup_.Load("guy-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-5956px", "-56px", "148px", "247px");
	    spriteLookup_.Load("guy-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-6104px", "-56px", "146px", "247px");
	    spriteLookup_.Load("guy-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-6250px", "-56px", "148px", "247px");
	    spriteLookup_.Load("guy-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-6398px", "-56px", "148px", "247px");
	    spriteLookup_.Load("guy-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-6546px", "-56px", "148px", "247px");
	    spriteLookup_.Load("guy-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-6694px", "-56px", "146px", "247px");
	    spriteLookup_.Load("guy-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-6840px", "-56px", "148px", "247px");
	    spriteLookup_.Load("guy-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-6988px", "-56px", "148px", "247px");
	    spriteLookup_.Load("ken-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-7136px", "-63px", "132px", "240px");
	    spriteLookup_.Load("ken-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-7268px", "-61px", "132px", "242px");
	    spriteLookup_.Load("ken-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-7400px", "-56px", "132px", "247px");
	    spriteLookup_.Load("ken-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-7532px", "-50px", "129px", "253px");
	    spriteLookup_.Load("ken-l-win-2-0.png","|images/misc/misc/stance-sprites.png", "-7661px", "-66px", "120px", "237px");
	    spriteLookup_.Load("ken-l-win-2-1.png","|images/misc/misc/stance-sprites.png", "-7781px", "-48px", "124px", "255px");
	    spriteLookup_.Load("ken-l-win-2-2.png","|images/misc/misc/stance-sprites.png", "-7905px", "0px", "124px", "303px");
	    spriteLookup_.Load("ken-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-8029px", "-63px", "132px", "240px");
	    spriteLookup_.Load("ken-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-8161px", "-61px", "132px", "242px");
	    spriteLookup_.Load("ken-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-8293px", "-56px", "132px", "247px");
	    spriteLookup_.Load("ken-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-8425px", "-50px", "129px", "253px");
	    spriteLookup_.Load("ken-r-win-2-0.png","|images/misc/misc/stance-sprites.png", "-8554px", "-66px", "120px", "237px");
	    spriteLookup_.Load("ken-r-win-2-1.png","|images/misc/misc/stance-sprites.png", "-8674px", "-48px", "124px", "255px");
	    spriteLookup_.Load("ken-r-win-2-2.png","|images/misc/misc/stance-sprites.png", "0px", "-314px", "124px", "303px");
	    spriteLookup_.Load("mbison-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-124px", "-376px", "234px", "241px");
	    spriteLookup_.Load("mbison-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-358px", "-371px", "242px", "246px");
	    spriteLookup_.Load("mbison-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-600px", "-367px", "242px", "250px");
	    spriteLookup_.Load("mbison-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-842px", "-365px", "242px", "252px");
	    spriteLookup_.Load("mbison-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-1084px", "-376px", "234px", "241px");
	    spriteLookup_.Load("mbison-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-1318px", "-371px", "242px", "246px");
	    spriteLookup_.Load("mbison-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-1560px", "-367px", "242px", "250px");
	    spriteLookup_.Load("mbison-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-1802px", "-365px", "242px", "252px");
	    spriteLookup_.Load("rose-l-c-stance-0.png","|images/misc/misc/stance-sprites.png", "-2044px", "-337px", "190px", "280px");
	    spriteLookup_.Load("rose-l-c-stance-1.png","|images/misc/misc/stance-sprites.png", "-2234px", "-339px", "188px", "278px");
	    spriteLookup_.Load("rose-l-c-stance-2.png","|images/misc/misc/stance-sprites.png", "-2422px", "-342px", "186px", "275px");
	    spriteLookup_.Load("rose-l-c-stance-3.png","|images/misc/misc/stance-sprites.png", "-2608px", "-347px", "188px", "270px");
	    spriteLookup_.Load("rose-l-c-stance-4.png","|images/misc/misc/stance-sprites.png", "-2796px", "-344px", "190px", "273px");
	    spriteLookup_.Load("rose-l-c-stance-5.png","|images/misc/misc/stance-sprites.png", "-2986px", "-342px", "190px", "275px");
	    spriteLookup_.Load("rose-r-c-stance-0.png","|images/misc/misc/stance-sprites.png", "-3176px", "-337px", "190px", "280px");
	    spriteLookup_.Load("rose-r-c-stance-1.png","|images/misc/misc/stance-sprites.png", "-3366px", "-339px", "188px", "278px");
	    spriteLookup_.Load("rose-r-c-stance-2.png","|images/misc/misc/stance-sprites.png", "-3554px", "-342px", "186px", "275px");
	    spriteLookup_.Load("rose-r-c-stance-3.png","|images/misc/misc/stance-sprites.png", "-3740px", "-347px", "188px", "270px");
	    spriteLookup_.Load("rose-r-c-stance-4.png","|images/misc/misc/stance-sprites.png", "-3928px", "-344px", "190px", "273px");
	    spriteLookup_.Load("rose-r-c-stance-5.png","|images/misc/misc/stance-sprites.png", "-4118px", "-342px", "190px", "275px");
	    spriteLookup_.Load("ryu-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-4308px", "-378px", "132px", "239px");
	    spriteLookup_.Load("ryu-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-4440px", "-375px", "132px", "242px");
	    spriteLookup_.Load("ryu-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-4572px", "-370px", "132px", "247px");
	    spriteLookup_.Load("ryu-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-4704px", "-365px", "129px", "252px");
	    spriteLookup_.Load("ryu-l-win-2-0.png","|images/misc/misc/stance-sprites.png", "-4833px", "-380px", "120px", "237px");
	    spriteLookup_.Load("ryu-l-win-2-1.png","|images/misc/misc/stance-sprites.png", "-4953px", "-362px", "124px", "255px");
	    spriteLookup_.Load("ryu-l-win-2-2.png","|images/misc/misc/stance-sprites.png", "-5077px", "-314px", "124px", "303px");
	    spriteLookup_.Load("ryu-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-5201px", "-378px", "132px", "239px");
	    spriteLookup_.Load("ryu-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-5333px", "-375px", "132px", "242px");
	    spriteLookup_.Load("ryu-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-5465px", "-370px", "132px", "247px");
	    spriteLookup_.Load("ryu-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-5597px", "-365px", "129px", "252px");
	    spriteLookup_.Load("ryu-r-win-2-0.png","|images/misc/misc/stance-sprites.png", "-5726px", "-380px", "120px", "237px");
	    spriteLookup_.Load("ryu-r-win-2-1.png","|images/misc/misc/stance-sprites.png", "-5846px", "-362px", "124px", "255px");
	    spriteLookup_.Load("ryu-r-win-2-2.png","|images/misc/misc/stance-sprites.png", "-5970px", "-314px", "124px", "303px");
	    spriteLookup_.Load("sagat-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-6094px", "-303px", "164px", "314px");
	    spriteLookup_.Load("sagat-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-6258px", "-316px", "162px", "301px");
	    spriteLookup_.Load("sagat-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-6420px", "-313px", "162px", "304px");
	    spriteLookup_.Load("sagat-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-6582px", "-308px", "164px", "309px");
	    spriteLookup_.Load("sagat-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-6746px", "-303px", "164px", "314px");
	    spriteLookup_.Load("sagat-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-6910px", "-316px", "162px", "301px");
	    spriteLookup_.Load("sagat-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-7072px", "-313px", "162px", "304px");
	    spriteLookup_.Load("sagat-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-7234px", "-308px", "164px", "309px");
	    spriteLookup_.Load("sodom-l-stance-0.png","|images/misc/misc/stance-sprites.png", "-7398px", "-316px", "176px", "301px");
	    spriteLookup_.Load("sodom-l-stance-1.png","|images/misc/misc/stance-sprites.png", "-7574px", "-314px", "178px", "303px");
	    spriteLookup_.Load("sodom-l-stance-2.png","|images/misc/misc/stance-sprites.png", "-7752px", "-309px", "174px", "308px");
	    spriteLookup_.Load("sodom-l-stance-3.png","|images/misc/misc/stance-sprites.png", "-7926px", "-306px", "172px", "311px");
	    spriteLookup_.Load("sodom-l-stance-4.png","|images/misc/misc/stance-sprites.png", "-8098px", "-309px", "174px", "308px");
	    spriteLookup_.Load("sodom-l-stance-5.png","|images/misc/misc/stance-sprites.png", "-8272px", "-314px", "178px", "303px");
	    spriteLookup_.Load("sodom-r-stance-0.png","|images/misc/misc/stance-sprites.png", "-8450px", "-316px", "176px", "301px");
	    spriteLookup_.Load("sodom-r-stance-1.png","|images/misc/misc/stance-sprites.png", "-8626px", "-314px", "178px", "303px");
	    spriteLookup_.Load("sodom-r-stance-2.png","|images/misc/misc/stance-sprites.png", "-8804px", "-309px", "174px", "308px");
	    spriteLookup_.Load("sodom-r-stance-3.png","|images/misc/misc/stance-sprites.png", "-8978px", "-306px", "172px", "311px");
	    spriteLookup_.Load("sodom-r-stance-4.png","|images/misc/misc/stance-sprites.png", "-9150px", "-309px", "174px", "308px");
	    spriteLookup_.Load("sodom-r-stance-5.png","|images/misc/misc/stance-sprites.png", "-9324px", "-314px", "178px", "303px");

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

    CharSelect.prototype.LoadSounds = function()
    {
        /*
        soundManager_.Load("audio/misc/p-select-move-0.zzz",3);
        soundManager_.Load("audio/misc/p-select-move-1.zzz",3);
        soundManager_.Load("audio/misc/p-select-choose-0.zzz",3);
        soundManager_.Load("audio/misc/p-select-choose-1.zzz",3);
        */
        utils_.AddScript("char-select.js");
    }

    return new CharSelect();
}
var CHAR_NAMES = ["ryu","chunli","charlie","ken","guy","birdie","sodom","adon","rose","sagat","mbison"];

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
    this.randomCharFace_ = {X:0,Y:0,Element:null}
    this.isInitialized_ = false;
    this.chooseCharacterFn_ = null;
    this.getOtherCharacterFn_ = null;
    this.getOtherIsAlternateFn_ = null;
    this.randomSelect_ = 0;
    this.isAlternateChar_ = false;
}


User.prototype.GetFolder = function() { return this.folder_; }
User.prototype.GetName = function() { return this.currentStance_.replace("_selected", ""); }

User.prototype.SetChar = function(char, isAlternate)
{
    var name = "";
    switch(char)
    {
        case CHARACTERS.KEN: { name = "ken"; break;}
        case CHARACTERS.RYU: { name = "ryu"; break;}
        case CHARACTERS.MBISON: { name = "mbison"; break;}

        case CHARACTERS.RANDOM1:
        case CHARACTERS.RANDOM2:
        {
            switch(this.currentStance_)
            {
                case "ryu": { return this.SetChar(CHARACTERS.RYU, isAlternate); }
                case "ken": { return this.SetChar(CHARACTERS.KEN, isAlternate); }
                case "mbison": { return this.SetChar(CHARACTERS.MBISON, isAlternate); }
            };
        }
    }
    this.selected_ = char;
    this.currentStance_ = name + "_selected";
    this.folder_ = name + (!!isAlternate ? "2" : "");
}

User.prototype.AddStanceAnimations = function()
{
    if(!this.isInitialized_)
    {
        this.animations_["ryu"] = CreateBasicAnimation("ryu_stance",[],true);
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-0.png",5);
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-1.png",5);
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-2.png",5);
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-3.png",5);
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-2.png",5);    
        this.animations_["ryu"].AddFrame(this,"images/misc/misc/ryu-r-stance-1.png",5);
        this.animations_["ryu_selected"] = CreateBasicAnimation("ryu_selected",[],true);
        this.animations_["ryu_selected"].AddFrame(this,"images/misc/misc/ryu-r-win-2-0.png",5);
        this.animations_["ryu_selected"].AddFrame(this,"images/misc/misc/ryu-r-win-2-1.png",5);
        this.animations_["ryu_selected"].AddFrame(this,"images/misc/misc/ryu-r-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.animations_["ken"] = CreateBasicAnimation("ken_stance",[],true);
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-0.png",5);
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-1.png",5);
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-2.png",5);
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-3.png",5);
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-2.png",5);    
        this.animations_["ken"].AddFrame(this,"images/misc/misc/ken-r-stance-1.png",5);
        this.animations_["ken_selected"] = CreateBasicAnimation("ken_selected",[],true);
        this.animations_["ken_selected"].AddFrame(this,"images/misc/misc/ken-r-win-2-0.png",5);
        this.animations_["ken_selected"].AddFrame(this,"images/misc/misc/ken-r-win-2-1.png",5);
        this.animations_["ken_selected"].AddFrame(this,"images/misc/misc/ken-r-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.animations_["mbison"] = CreateBasicAnimation("ken_stance",[],true);
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-0.png",5);
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-1.png",5);
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-2.png",5);
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-3.png",5);
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-2.png",5);    
        this.animations_["mbison"].AddFrame(this,"images/misc/misc/mbison-r-stance-1.png",5);
        this.animations_["mbison_selected"] = CreateBasicAnimation("mbison_selected",[],true);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-0.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-1.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-2.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-3.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-4.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-5.png",5);
        this.animations_["mbison_selected"].AddFrame(this,"images/misc/misc/mbison-r-win-0-6.png",CONSTANTS.MAX_FRAME);

        this.animations_["sagat"] = CreateBasicAnimation("sagat_stance",[],true);
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-0.png",5);
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-3.png",5);
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-2.png",5);
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-1.png",5);
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-2.png",5);    
        this.animations_["sagat"].AddFrame(this,"images/misc/misc/sagat-r-stance-3.png",5);    

        this.animations_["guy"] = CreateBasicAnimation("guy_stance",[],true);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-0.png",26);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-3.png",15);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-1.png",26);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-2.png",15);
        this.animations_["guy"].AddFrame(this,"images/misc/misc/guy-r-stance-3.png",15);

        this.animations_["birdie"] = CreateBasicAnimation("birdie_stance",[],true);
        this.animations_["birdie"].AddFrame(this,"images/misc/misc/birdie-r-stance-0.png",15);
        this.animations_["birdie"].AddFrame(this,"images/misc/misc/birdie-r-stance-1.png",15);
        this.animations_["birdie"].AddFrame(this,"images/misc/misc/birdie-r-stance-2.png",15);
        this.animations_["birdie"].AddFrame(this,"images/misc/misc/birdie-r-stance-3.png",15);

        this.animations_["chunli"] = CreateBasicAnimation("chunli_stance",[],true);
        this.animations_["chunli"].AddFrame(this,"images/misc/misc/chunli-r-stance-0.png",10);
        this.animations_["chunli"].AddFrame(this,"images/misc/misc/chunli-r-stance-1.png",10);
        this.animations_["chunli"].AddFrame(this,"images/misc/misc/chunli-r-stance-2.png",10);
        this.animations_["chunli"].AddFrame(this,"images/misc/misc/chunli-r-stance-3.png",10);

        this.animations_["charlie"] = CreateBasicAnimation("charlie_stance",[],true);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-0.png",5);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-1.png",5);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-3.png",5);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-2.png",5);
        this.animations_["charlie"].AddFrame(this,"images/misc/misc/charlie-r-stance-1.png",5);

        this.animations_["sodom"] = CreateBasicAnimation("sodom_stance",[],true);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-0.png",5);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-1.png",5);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-2.png",5);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-3.png",5);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-4.png",5);
        this.animations_["sodom"].AddFrame(this,"images/misc/misc/sodom-r-stance-5.png",5);


        this.animations_["adon"] = CreateBasicAnimation("adon_stance",[],true);
        this.animations_["adon"].AddFrame(this,"images/misc/misc/adon-r-stance-0.png",5);
        this.animations_["adon"].AddFrame(this,"images/misc/misc/adon-r-stance-1.png",5);
        this.animations_["adon"].AddFrame(this,"images/misc/misc/adon-r-stance-2.png",5);
        this.animations_["adon"].AddFrame(this,"images/misc/misc/adon-r-stance-3.png",5);
        this.animations_["adon"].AddFrame(this,"images/misc/misc/adon-r-stance-4.png",5);


        this.animations_["rose"] = CreateBasicAnimation("rose_stance",[],true);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-0.png",5);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-1.png",5);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-2.png",5);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-3.png",5);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-4.png",5);
        this.animations_["rose"].AddFrame(this,"images/misc/misc/rose-r-c-stance-5.png",5);


        this.animations_["random"] = CreateBasicAnimation("random",[],true);
        this.animations_["random"].AddFrame(this,"images/misc/misc/rose-r-c-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/adon-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/sodom-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/charlie-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/chunli-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/birdie-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/guy-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/sagat-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/ken-r-stance-0.png",5);
        this.animations_["random"].AddFrame(this,"images/misc/misc/ryu-r-stance-0.png",5);
    }

    this.isInitialized_ = true;
}

User.prototype.Release = function()
{
    var parentElement = window.document.getElementById("pnlStage");
    utils_.RemoveFromDOM(this.selectIcon_.Element);
    utils_.RemoveFromDOM(this.portriatElement_);
    utils_.RemoveFromDOM(this.element_.Element);
    utils_.RemoveFromDOM(this.randomCharFace_.Element);
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

    this.randomCharFace_.Element = window.document.createElement("div");
    parentElement.appendChild(this.randomCharFace_.Element);

    if(!!isUser1)
    {
        this.selected_ = CHARACTERS.RYU;
        this.animations_["select_icon"] = CreateBasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p1-select-1.png",1);

        this.element_.Element.className = "stance-container-p1";
        this.portriatElement_.className = "select-portriat-p1";
        this.selectedCharStance_.Element.className = "select-stance-p1";
        this.randomCharFace_.Element.className = "select-random-p1";

        //ApplyFlip(this.selectedCharStance_.Element,true);
        ApplyFlip(this.randomCharFace_.Element,true);
        ApplyFlip(this.portriatElement_,true);
    }
    else
    {
        this.selected_ = CHARACTERS.KEN;
        this.animations_["select_icon"] = CreateBasicAnimation("select_icon",[],true);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p2-select-0.png",1);
        this.animations_["select_icon"].AddFrame(this,"|images/misc/misc/p2-select-1.png",1);

        this.element_.Element.className = "stance-container-p2";
        this.portriatElement_.className = "select-portriat-p2";
        this.selectedCharStance_.Element.className = "select-stance-p2";
        this.randomCharFace_.Element.className = "select-random-p2";
    }

    /*
    imageLookup_.GetBgB64(this.selectIcon_.Element,"images/misc/char-misc-sprites.png");
    imageLookup_.GetBgB64(this.nameElement_.Element,"images/misc/name-sprites.png");
    imageLookup_.GetBgB64(this.portriatElement_,"images/misc/head-sprites.png");
    imageLookup_.GetBgB64(this.selectedCharStance_.Element,"images/misc/stance-sprites.png");
    imageLookup_.GetBgB64(this.randomCharFace_.Element,"images/misc/char-sprites.png");
    imageLookup_.GetBgB64(this.shadowElement_.Element,"images/misc/char-sprites.png");
    */
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
                    || this.currentStance_ == "ryu"
                    || this.currentStance_ == "mbison")
                {
                    this.isCharSelected_ = true;
                    this.chooseCharacterFn_(this);
                    this.isAlternateChar_ = (keyCode == this.K1 || keyCode == this.K2 || keyCode == this.K3);
                    if(this.getOtherCharacterFn_() == this.selected_)
                    {
                         this.isAlternateChar_ = !this.getOtherIsAlternateFn_()
                    }
                    this.SetChar(this.selected_, this.isAlternateChar_);
                }
            }

            if(!!direction)
            {
                var mustChange = (this.selected_ == CHARACTERS.RANDOM1 || this.selected_ == CHARACTERS.RANDOM2);
                this.changeCharacterFn_(direction);

                if(!!mustChange && (this.selected_ != CHARACTERS.RANDOM1 || this.selected_ != CHARACTERS.RANDOM2))
                {
                    this.randomSelect_ = 0;
                    this.randomCharFace_.Element.style.display = "none";
                }
                this.ShowCharacter();
            }
            if(!!this.isCharSelected_)
            {
                switch(this.currentStance_)
                {
                    case "ken_selected": this.selected_ = CHARACTERS.KEN; break;
                    case "ryu_selected": this.selected_ = CHARACTERS.RYU; break;
                    case "mbison_selected": this.selected_ = CHARACTERS.MBISON; break;
                };
            }
       }
    }
}

User.prototype.SetPositions = function()
{
    switch(this.currentStance_)
    {
        case "ryu": { this.SetPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "chunli": { this.SetPositionValues ("7px","17px","27px","0px",12,28); break; }
        case "charlie": { this.SetPositionValues ("7px","17px","10px","0px",10,41); break; }
        case "ken": { this.SetPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "guy": { this.SetPositionValues ("7px","17px","27px","0px",0,32); break; }
        case "birdie": { this.SetPositionValues ("7px","17px","27px","0px",16,28); break; }
        case "sodom": { this.SetPositionValues ("7px","17px","10px","0px",10,24); break; }
        case "adon": { this.SetPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "rose": { this.SetPositionValues ("-3px","17px","2px","0px",-32,32); break; }
        case "sagat": { this.SetPositionValues ("7px","17px","10px","0px",16,28); break; }
        case "mbison": { this.SetPositionValues ("7px","17px","10px","0px",-36,17); break; }
        /*
        case "akuma": { break; }
        case "dan": { break; }
        */
    };
}

User.prototype.ShowCharacter = function()
{
    switch(this.selected_)
    {
        case CHARACTERS.RYU: { this.currentStance_ = "ryu"; break; }
        case CHARACTERS.CHUNLI: { this.currentStance_ = "chunli"; break; }
        case CHARACTERS.CHARLIE: { this.currentStance_ = "charlie"; break; }
        case CHARACTERS.KEN: { this.currentStance_ = "ken"; break; }
        case CHARACTERS.GUY: { this.currentStance_ = "guy"; break; }
        case CHARACTERS.BIRDIE: { this.currentStance_ = "birdie"; break; }
        case CHARACTERS.SODOM: { this.currentStance_ = "sodom"; break; }
        case CHARACTERS.ADON: { this.currentStance_ = "adon"; break; }
        case CHARACTERS.RANDOM1: { this.randomSelect_ = this.randomSelect_ || 1; break; }
        case CHARACTERS.ROSE: { this.currentStance_ = "rose"; break; }
        case CHARACTERS.SAGAT: { this.currentStance_ = "sagat"; break; }
        case CHARACTERS.RANDOM2: { this.randomSelect_ = this.randomSelect_ || 1; break; }
        case CHARACTERS.MBISON: { this.currentStance_ = "mbison"; break; }
        /*
        case CHARACTERS.AKUMA: { break; }
        case CHARACTERS.DAN: { break; }
        */
    };

    this.SetPositions();

    spriteLookup_.Set(this.portriatElement_, "images/misc/misc/p2-select-" + this.currentStance_ + ".png");
    //this.portriatElement_.src = (this.player_ == 1 ? "images/misc/misc/p1-select-" + this.currentStance_ + ".png" : "images/misc/misc/p2-select-" + this.currentStance_ + ".png");

    spriteLookup_.Set(this.shadowElement_.Element, "images/misc/misc/" + this.currentStance_ + "-shadow.png");
    //this.shadowElement_.Element.src = "images/misc/" + this.currentStance_ + "/shadow.png";

    spriteLookup_.Set(this.nameElement_.Element, "images/misc/font3/name-" + this.currentStance_ + ".png");
    //this.nameElement_.Element.src = "images/misc/font3/" + this.currentStance_ + ".png";

    if(!this.isCharSelected_ && !!this.randomSelect_)
    {
        spriteLookup_.Set(this.randomCharFace_.Element, "images/misc/misc/char-" + this.currentStance_ + "-r.png");
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
    switch(this.selected_)
    {
        case CHARACTERS.RYU: { retVal = Player.prototype.CreateRyu(this); break; }
        case CHARACTERS.KEN: { retVal = Player.prototype.CreateKen(this); break; }
        case CHARACTERS.MBISON: { retVal = Player.prototype.CreateMBison(this); break; }
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
        case CHARACTERS.DAN: { retVal = Player.prototype.CreateDan(this); break; }
        */
    };

    return retVal;
}

User.prototype.SetPositionValues = function(shadowX,shadowY,nameX,nameY,stanceX,stanceY)
{
    this.Show();
    this.shadowElement_.X = shadowX;
    this.shadowElement_.Y = shadowY;
    this.nameElement_.X = nameX;
    this.nameElement_.Y = nameY;
    this.selectedCharStance_.X = stanceX;
    this.selectedCharStance_.Y = stanceY;
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
    {
        this.SetPositions();
        this.animations_[this.currentStance_].TryRender(frame, this.selectedCharStance_, this.direction_);
    }
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
        this.lastPicked_ = "";
        this.LoadAssets();
    }

    CharSelect.prototype.GetTeamA = function() { return [u1_]; }
    CharSelect.prototype.GetTeamB = function() { return [u2_]; }


    /**/
    CharSelect.prototype.GetPlayers = function(users)
    {
        var retVal = [];

        for(var i = 0; i < users.length; ++i)
            retVal.push(users[i].GetPlayer());

        return retVal;
    }


    /*For now - only Ken's stage is implemented*/
    CharSelect.prototype.GetStage = function()
    {
        return stages_[this.lastPicked_];
    }


    CharSelect.prototype.RestartMusic = function()
    {
        soundManager_.Restart(this.music_);
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

    /**/
    CharSelect.prototype.Start = function()
    {
        game_.ShowLoading(false);
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

        /*
        this.playerSelectImg_.src = imageLookup_.GetB64("images/misc/player-select.png");
        imageLookup_.GetBgB64(parentElement,"images/misc/player-select-back-bg.png");
        imageLookup_.GetBgB64(this.element_,"images/misc/player-select-bg.png");
        */

        /*init music*/
        //soundManager_.Load(this.music_);

        /*Init user 1*/
        if(!!u1_)
        {
            u1_.player_ = 1;
            u1_.direction_ = -1;
            u1_.Init(true);
            u1_.changeCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.TryChangeCharacter(this,direction); } })(this);
            u1_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser1ChooseSound(); thisValue.lastPicked_ = this.GetName(); } })(this);
            u1_.getOtherCharacterFn_ = (function(thisValue) { return function(direction) { return thisValue.selected_; } })(u2_);
            u1_.getOtherIsAlternateFn_ = (function(thisValue) { return function(direction) { return thisValue.isAlternateChar_; } })(u2_);

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
            u2_.chooseCharacterFn_ = (function(thisValue) { return function(direction) { thisValue.QueueUser2ChooseSound();  thisValue.lastPicked_ = this.GetName();} })(this);
            u2_.getOtherCharacterFn_ = (function(thisValue) { return function(direction) { return thisValue.selected_; } })(u1_);
            u2_.getOtherIsAlternateFn_ = (function(thisValue) { return function(direction) { return thisValue.isAlternateChar_; } })(u1_);

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
	    spriteLookup_.Load("images/misc/misc/adon-r-stance-0.png","images/misc/misc/stance-sprites.png", "0px", "-33px", "148px", "270px");
	    spriteLookup_.Load("images/misc/misc/adon-r-stance-1.png","images/misc/misc/stance-sprites.png", "-148px", "-30px", "150px", "273px");
	    spriteLookup_.Load("images/misc/misc/adon-r-stance-2.png","images/misc/misc/stance-sprites.png", "-298px", "-28px", "154px", "275px");
	    spriteLookup_.Load("images/misc/misc/adon-r-stance-3.png","images/misc/misc/stance-sprites.png", "-452px", "-30px", "154px", "273px");
	    spriteLookup_.Load("images/misc/misc/adon-r-stance-4.png","images/misc/misc/stance-sprites.png", "-606px", "-28px", "152px", "275px");
	    spriteLookup_.Load("images/misc/misc/birdie-r-stance-0.png","images/misc/misc/stance-sprites.png", "-758px", "-20px", "196px", "283px");
	    spriteLookup_.Load("images/misc/misc/birdie-r-stance-1.png","images/misc/misc/stance-sprites.png", "-954px", "-25px", "200px", "278px");
	    spriteLookup_.Load("images/misc/misc/birdie-r-stance-2.png","images/misc/misc/stance-sprites.png", "-1154px", "-25px", "200px", "278px");
	    spriteLookup_.Load("images/misc/misc/birdie-r-stance-3.png","images/misc/misc/stance-sprites.png", "-1354px", "-23px", "196px", "280px");
	    spriteLookup_.Load("images/misc/misc/charlie-r-stance-0.png","images/misc/misc/stance-sprites.png", "-1550px", "-56px", "176px", "247px");
	    spriteLookup_.Load("images/misc/misc/charlie-r-stance-1.png","images/misc/misc/stance-sprites.png", "-1726px", "-53px", "176px", "250px");
	    spriteLookup_.Load("images/misc/misc/charlie-r-stance-2.png","images/misc/misc/stance-sprites.png", "-1902px", "-51px", "178px", "252px");
	    spriteLookup_.Load("images/misc/misc/charlie-r-stance-3.png","images/misc/misc/stance-sprites.png", "-2080px", "-51px", "178px", "252px");
	    spriteLookup_.Load("images/misc/misc/chunli-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2258px", "-82px", "180px", "221px");
	    spriteLookup_.Load("images/misc/misc/chunli-r-stance-1.png","images/misc/misc/stance-sprites.png", "-2438px", "-79px", "180px", "224px");
	    spriteLookup_.Load("images/misc/misc/chunli-r-stance-2.png","images/misc/misc/stance-sprites.png", "-2618px", "-77px", "180px", "226px");
	    spriteLookup_.Load("images/misc/misc/chunli-r-stance-3.png","images/misc/misc/stance-sprites.png", "-2798px", "-79px", "180px", "224px");
	    spriteLookup_.Load("images/misc/misc/guy-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2978px", "-56px", "148px", "247px");
	    spriteLookup_.Load("images/misc/misc/guy-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3126px", "-56px", "146px", "247px");
	    spriteLookup_.Load("images/misc/misc/guy-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3272px", "-56px", "148px", "247px");
	    spriteLookup_.Load("images/misc/misc/guy-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3420px", "-56px", "148px", "247px");
	    spriteLookup_.Load("images/misc/misc/ken-r-stance-0.png","images/misc/misc/stance-sprites.png", "-3568px", "-63px", "132px", "240px");
	    spriteLookup_.Load("images/misc/misc/ken-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3700px", "-61px", "132px", "242px");
	    spriteLookup_.Load("images/misc/misc/ken-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3832px", "-56px", "132px", "247px");
	    spriteLookup_.Load("images/misc/misc/ken-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3964px", "-50px", "129px", "253px");
	    spriteLookup_.Load("images/misc/misc/ken-r-win-2-0.png","images/misc/misc/stance-sprites.png", "-4093px", "-66px", "120px", "237px");
	    spriteLookup_.Load("images/misc/misc/ken-r-win-2-1.png","images/misc/misc/stance-sprites.png", "-4213px", "-48px", "124px", "255px");
	    spriteLookup_.Load("images/misc/misc/ken-r-win-2-2.png","images/misc/misc/stance-sprites.png", "-4337px", "0px", "124px", "303px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-stance-0.png","images/misc/misc/stance-sprites.png", "-4461px", "-62px", "234px", "241px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4695px", "-57px", "242px", "246px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4937px", "-53px", "242px", "250px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-stance-3.png","images/misc/misc/stance-sprites.png", "0px", "-365px", "242px", "252px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-0.png","images/misc/misc/stance-sprites.png", "-242px", "-357px", "272px", "260px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-1.png","images/misc/misc/stance-sprites.png", "-514px", "-362px", "224px", "255px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-2.png","images/misc/misc/stance-sprites.png", "-738px", "-365px", "224px", "252px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-3.png","images/misc/misc/stance-sprites.png", "-962px", "-365px", "224px", "252px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-4.png","images/misc/misc/stance-sprites.png", "-1186px", "-365px", "224px", "252px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-5.png","images/misc/misc/stance-sprites.png", "-1410px", "-362px", "224px", "255px");
	    spriteLookup_.Load("images/misc/misc/mbison-r-win-0-6.png","images/misc/misc/stance-sprites.png", "-1634px", "-362px", "224px", "255px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-0.png","images/misc/misc/stance-sprites.png", "-1858px", "-337px", "190px", "280px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-1.png","images/misc/misc/stance-sprites.png", "-2048px", "-339px", "188px", "278px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-2.png","images/misc/misc/stance-sprites.png", "-2236px", "-342px", "186px", "275px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-3.png","images/misc/misc/stance-sprites.png", "-2422px", "-347px", "188px", "270px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-4.png","images/misc/misc/stance-sprites.png", "-2610px", "-344px", "190px", "273px");
	    spriteLookup_.Load("images/misc/misc/rose-r-c-stance-5.png","images/misc/misc/stance-sprites.png", "-2800px", "-342px", "190px", "275px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2990px", "-378px", "132px", "239px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3122px", "-375px", "132px", "242px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3254px", "-370px", "132px", "247px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3386px", "-365px", "129px", "252px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-win-2-0.png","images/misc/misc/stance-sprites.png", "-3515px", "-380px", "120px", "237px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-win-2-1.png","images/misc/misc/stance-sprites.png", "-3635px", "-362px", "124px", "255px");
	    spriteLookup_.Load("images/misc/misc/ryu-r-win-2-2.png","images/misc/misc/stance-sprites.png", "-3759px", "-314px", "124px", "303px");
	    spriteLookup_.Load("images/misc/misc/sagat-r-stance-0.png","images/misc/misc/stance-sprites.png", "-3883px", "-303px", "164px", "314px");
	    spriteLookup_.Load("images/misc/misc/sagat-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4047px", "-316px", "162px", "301px");
	    spriteLookup_.Load("images/misc/misc/sagat-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4209px", "-313px", "162px", "304px");
	    spriteLookup_.Load("images/misc/misc/sagat-r-stance-3.png","images/misc/misc/stance-sprites.png", "-4371px", "-308px", "164px", "309px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-0.png","images/misc/misc/stance-sprites.png", "-4535px", "-316px", "176px", "301px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4711px", "-314px", "178px", "303px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4889px", "-309px", "174px", "308px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-3.png","images/misc/misc/stance-sprites.png", "-5063px", "-306px", "172px", "311px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-4.png","images/misc/misc/stance-sprites.png", "-5235px", "-309px", "174px", "308px");
	    spriteLookup_.Load("images/misc/misc/sodom-r-stance-5.png","images/misc/misc/stance-sprites.png", "-5409px", "-314px", "178px", "303px");

	    spriteLookup_.Load("images/misc/misc/p1-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "0px", "64px", "82px");
	    spriteLookup_.Load("images/misc/misc/p1-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "0px", "64px", "82px");
	    spriteLookup_.Load("images/misc/misc/p2-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "-82px", "64px", "82px");
	    spriteLookup_.Load("images/misc/misc/p2-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "-82px", "64px", "82px");


    }

    CharSelect.prototype.LoadUserAssets = function(users)
    {
        for(var i = 0; i < users.length; ++i)
        {
            var user = users[i];
            if(!!user.GetName())
            {
                var name = user.GetName();
                var folder = user.GetFolder();
                stuffLoader_.Queue("script/player-" + name + ".js",RESOURCE_TYPES.SCRIPT);
                stuffLoader_.Queue("script/player-" + folder + "-spritedata.js",RESOURCE_TYPES.SCRIPT);
            }
        }
    }

    CharSelect.prototype.LoadAssets = function()
    {
        stuffLoader_.Queue("char-select.js",RESOURCE_TYPES.BASE64AUDIO);
    }

    return new CharSelect();
}
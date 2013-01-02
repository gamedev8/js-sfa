var CHAR_NAMES = ["ryu","chunli","charlie","ken","guy","birdie","sodom","adon","rose","sagat","mbison"];

var User = function(right,up,left,down,p1,p2,p3,k1,k2,k3,turn,gamepadIndex)
{
    this.Folder = "";
    this.GamepadIndex = gamepadIndex;
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
    this.Player = 0;
    this.Selected = null;
    this.changeCharacterFn = null;
    this.Animations = {};
    this.NbFrames = 0;
    this.SelectIcon = { X:0,Y:0,Element:null,StartFrame:0 };
    this.IsCharSelected = false;
    this.Direction = 1;
    this.SelectedCharStance = { X:undefined, Y:undefined, Element:null,StartFrame:0 }

    this.Element = {X:0,Y:0,Element:null};
    this.PortriatElement = {X:0,Y:0,Element:null};
    this.StanceElement = {X:0,Y:0,Element:null};
    this.ShadowElement = {X:0,Y:0,Element:null};
    this.NameElement = {X:0,Y:0,Element:null};
    this.RandomCharFace = {X:0,Y:0,Element:null}
    this.IsInitialized = false;
    this.chooseCharacterFn = null;
    this.getOtherCharacterFn = null;
    this.getOtherIsAlternateFn = null;
    this.RandomSelect = 0;
    this.IsAlternateChar = false;
    this.IsAI = false;
    this.NbCredits = 0;
}


User.prototype.getFolder = function() { return this.Folder; }
User.prototype.getName = function() { return this.CurrentStance.replace("_selected", ""); }
User.prototype.getNbCredits = function() { return this.NbCredits; }
User.prototype.hasCredits = function() { return !!this.NbCredits; }
User.prototype.addCredit  = function() { this.NbCredits = Math.min(this.NbCredits + 1, CONSTANTS.MAX_CREDITS); }
User.prototype.useCredit  = function() { this.NbCredits = Math.max(this.NbCredits - 1,0); }


User.prototype.setChar = function(char, isAlternate, isAI)
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
            switch(this.CurrentStance)
            {
                case "ryu": { return this.setChar(CHARACTERS.RYU, isAlternate, isAI); }
                case "ken": { return this.setChar(CHARACTERS.KEN, isAlternate, isAI); }
                case "mbison": { return this.setChar(CHARACTERS.MBISON, isAlternate, isAI); }
            };
        }
    }
    this.IsAlternate = isAlternate;
    this.Selected = char;
    this.CurrentStance = name + "_selected";
    this.Folder = name + (!!isAlternate ? "2" : "");
    this.IsAI = (isAI === undefined) ? this.IsAI : isAI;
}

User.prototype.addStanceAnimations = function()
{
    if(!this.IsInitialized)
    {
        this.Animations["ryu"] = CreateBasicAnimation("ryu_stance",[],true);
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-0.png",5);
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-1.png",5);
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-2.png",5);
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-3.png",5);
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-2.png",5);    
        this.Animations["ryu"].addFrame(this,"images/misc/misc/ryu-r-stance-1.png",5);
        this.Animations["ryu_selected"] = CreateBasicAnimation("ryu_selected",[],true);
        this.Animations["ryu_selected"].addFrame(this,"images/misc/misc/ryu-r-win-2-0.png",5);
        this.Animations["ryu_selected"].addFrame(this,"images/misc/misc/ryu-r-win-2-1.png",5);
        this.Animations["ryu_selected"].addFrame(this,"images/misc/misc/ryu-r-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.Animations["ken"] = CreateBasicAnimation("ken_stance",[],true);
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-0.png",5);
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-1.png",5);
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-2.png",5);
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-3.png",5);
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-2.png",5);    
        this.Animations["ken"].addFrame(this,"images/misc/misc/ken-r-stance-1.png",5);
        this.Animations["ken_selected"] = CreateBasicAnimation("ken_selected",[],true);
        this.Animations["ken_selected"].addFrame(this,"images/misc/misc/ken-r-win-2-0.png",5);
        this.Animations["ken_selected"].addFrame(this,"images/misc/misc/ken-r-win-2-1.png",5);
        this.Animations["ken_selected"].addFrame(this,"images/misc/misc/ken-r-win-2-2.png",CONSTANTS.MAX_FRAME);

        this.Animations["mbison"] = CreateBasicAnimation("ken_stance",[],true);
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-0.png",5);
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-1.png",5);
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-2.png",5);
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-3.png",5);
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-2.png",5);    
        this.Animations["mbison"].addFrame(this,"images/misc/misc/mbison-r-stance-1.png",5);
        this.Animations["mbison_selected"] = CreateBasicAnimation("mbison_selected",[],true);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-0.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-1.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-2.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-3.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-4.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-5.png",5);
        this.Animations["mbison_selected"].addFrame(this,"images/misc/misc/mbison-r-win-0-6.png",CONSTANTS.MAX_FRAME);

        this.Animations["sagat"] = CreateBasicAnimation("sagat_stance",[],true);
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-0.png",5);
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-3.png",5);
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-2.png",5);
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-1.png",5);
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-2.png",5);    
        this.Animations["sagat"].addFrame(this,"images/misc/misc/sagat-r-stance-3.png",5);    

        this.Animations["guy"] = CreateBasicAnimation("guy_stance",[],true);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-0.png",26);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-3.png",15);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-2.png",15);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-1.png",26);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-2.png",15);
        this.Animations["guy"].addFrame(this,"images/misc/misc/guy-r-stance-3.png",15);

        this.Animations["birdie"] = CreateBasicAnimation("birdie_stance",[],true);
        this.Animations["birdie"].addFrame(this,"images/misc/misc/birdie-r-stance-0.png",15);
        this.Animations["birdie"].addFrame(this,"images/misc/misc/birdie-r-stance-1.png",15);
        this.Animations["birdie"].addFrame(this,"images/misc/misc/birdie-r-stance-2.png",15);
        this.Animations["birdie"].addFrame(this,"images/misc/misc/birdie-r-stance-3.png",15);

        this.Animations["chunli"] = CreateBasicAnimation("chunli_stance",[],true);
        this.Animations["chunli"].addFrame(this,"images/misc/misc/chunli-r-stance-0.png",10);
        this.Animations["chunli"].addFrame(this,"images/misc/misc/chunli-r-stance-1.png",10);
        this.Animations["chunli"].addFrame(this,"images/misc/misc/chunli-r-stance-2.png",10);
        this.Animations["chunli"].addFrame(this,"images/misc/misc/chunli-r-stance-3.png",10);

        this.Animations["charlie"] = CreateBasicAnimation("charlie_stance",[],true);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-0.png",5);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-1.png",5);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-2.png",5);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-3.png",5);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-2.png",5);
        this.Animations["charlie"].addFrame(this,"images/misc/misc/charlie-r-stance-1.png",5);

        this.Animations["sodom"] = CreateBasicAnimation("sodom_stance",[],true);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-0.png",5);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-1.png",5);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-2.png",5);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-3.png",5);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-4.png",5);
        this.Animations["sodom"].addFrame(this,"images/misc/misc/sodom-r-stance-5.png",5);


        this.Animations["adon"] = CreateBasicAnimation("adon_stance",[],true);
        this.Animations["adon"].addFrame(this,"images/misc/misc/adon-r-stance-0.png",5);
        this.Animations["adon"].addFrame(this,"images/misc/misc/adon-r-stance-1.png",5);
        this.Animations["adon"].addFrame(this,"images/misc/misc/adon-r-stance-2.png",5);
        this.Animations["adon"].addFrame(this,"images/misc/misc/adon-r-stance-3.png",5);
        this.Animations["adon"].addFrame(this,"images/misc/misc/adon-r-stance-4.png",5);


        this.Animations["rose"] = CreateBasicAnimation("rose_stance",[],true);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-0.png",5);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-1.png",5);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-2.png",5);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-3.png",5);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-4.png",5);
        this.Animations["rose"].addFrame(this,"images/misc/misc/rose-r-c-stance-5.png",5);


        this.Animations["random"] = CreateBasicAnimation("random",[],true);
        this.Animations["random"].addFrame(this,"images/misc/misc/rose-r-c-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/adon-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/sodom-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/charlie-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/chunli-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/birdie-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/guy-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/sagat-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/ken-r-stance-0.png",5);
        this.Animations["random"].addFrame(this,"images/misc/misc/ryu-r-stance-0.png",5);
    }

    this.IsInitialized = true;
}

User.prototype.release = function()
{
    var parentElement = window.document.getElementById("pnlStage");
    utils_.removeFromDOM(this.SelectIcon.Element);
    utils_.removeFromDOM(this.PortriatElement);
    utils_.removeFromDOM(this.Element.Element);
    utils_.removeFromDOM(this.RandomCharFace.Element);
    this.IsCharSelected = false;
}

User.prototype.init = function(isUser1)
{
    this.addStanceAnimations();
    this.SelectIcon.Element = window.document.createElement("div");
    this.SelectIcon.Element.className = "select-icon";
    this.PortriatElement = window.document.createElement("div");
    this.ShadowElement.Element = window.document.createElement("div");
    this.ShadowElement.Element.className = "stance-shadow";
    this.NameElement.Element = window.document.createElement("div");
    this.NameElement.Element.className = "stance-name";
    this.SelectedCharStance.Element = window.document.createElement("div");
    this.Element.Element = window.document.createElement("div");

    var parentElement = window.document.getElementById("pnlStage");
    parentElement.appendChild(this.SelectIcon.Element);
    parentElement.appendChild(this.PortriatElement);
    this.Element.Element.appendChild(this.ShadowElement.Element);
    this.Element.Element.appendChild(this.NameElement.Element);
    this.Element.Element.appendChild(this.SelectedCharStance.Element);

    parentElement.appendChild(this.Element.Element);

    this.RandomCharFace.Element = window.document.createElement("div");
    parentElement.appendChild(this.RandomCharFace.Element);

    if(!!isUser1)
    {
        this.Selected = CHARACTERS.RYU;
        this.Animations["select_icon"] = CreateBasicAnimation("select_icon",[],true);
        this.Animations["select_icon"].addFrame(this,"|images/misc/misc/p1-select-0.png",1);
        this.Animations["select_icon"].addFrame(this,"|images/misc/misc/p1-select-1.png",1);

        this.Element.Element.className = "stance-container-p1";
        this.PortriatElement.className = "select-portriat-p1";
        this.SelectedCharStance.Element.className = "select-stance-p1";
        this.RandomCharFace.Element.className = "select-random-p1";

        //ApplyFlip(this.SelectedCharStance.Element,true);
        ApplyFlip(this.RandomCharFace.Element,true);
        ApplyFlip(this.PortriatElement,true);
    }
    else
    {
        this.Selected = CHARACTERS.KEN;
        this.Animations["select_icon"] = CreateBasicAnimation("select_icon",[],true);
        this.Animations["select_icon"].addFrame(this,"|images/misc/misc/p2-select-0.png",1);
        this.Animations["select_icon"].addFrame(this,"|images/misc/misc/p2-select-1.png",1);

        this.Element.Element.className = "stance-container-p2";
        this.PortriatElement.className = "select-portriat-p2";
        this.SelectedCharStance.Element.className = "select-stance-p2";
        this.RandomCharFace.Element.className = "select-random-p2";
    }

    /*
    imageLookup_.getBgB64(this.SelectIcon.Element,"images/misc/char-misc-sprites.png");
    imageLookup_.getBgB64(this.NameElement.Element,"images/misc/name-sprites.png");
    imageLookup_.getBgB64(this.PortriatElement,"images/misc/head-sprites.png");
    imageLookup_.getBgB64(this.SelectedCharStance.Element,"images/misc/stance-sprites.png");
    imageLookup_.getBgB64(this.RandomCharFace.Element,"images/misc/char-sprites.png");
    imageLookup_.getBgB64(this.ShadowElement.Element,"images/misc/char-sprites.png");
    */
}

/*input handler*/
User.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
{
    if(!!isDown)
    {
        if(!this.IsCharSelected)
        {
            var direction = null;
            if(keyCode == this.Down) direction = CONSTANTS.DOWN;
            else if(keyCode == this.Up) direction = CONSTANTS.UP;
            else if(keyCode == this.Left) direction = CONSTANTS.LEFT;
            else if(keyCode == this.Right) direction = CONSTANTS.RIGHT;
            else if(keyCode == this.P1 || keyCode == this.P2 || keyCode == this.P3 || keyCode == this.K1 || keyCode == this.K2 || keyCode == this.K3)
            {
                /*
                if(this.Selected == CHARACTERS.RYU
                    || this.Selected == CHARACTERS.KEN
                    || this.Selected == CHARACTERS.MBISON)
                */
                if(this.CurrentStance == "ken"
                    || this.CurrentStance == "ryu"
                    || this.CurrentStance == "mbison")
                {
                    this.IsCharSelected = true;
                    this.chooseCharacterFn(this);
                    this.IsAlternateChar = (keyCode == this.K1 || keyCode == this.K2 || keyCode == this.K3);
                    if(this.getOtherCharacterFn() == this.getName())
                    {
                         this.IsAlternateChar = !this.getOtherIsAlternateFn()
                    }
                    this.setChar(this.Selected, this.IsAlternateChar);
                }
            }

            if(!!direction)
            {
                var mustChange = (this.Selected == CHARACTERS.RANDOM1 || this.Selected == CHARACTERS.RANDOM2);
                this.changeCharacterFn(direction);

                if(!!mustChange && (this.Selected != CHARACTERS.RANDOM1 || this.Selected != CHARACTERS.RANDOM2))
                {
                    this.RandomSelect = 0;
                    this.RandomCharFace.Element.style.display = "none";
                }
                this.showCharacter();
            }
            if(!!this.IsCharSelected)
            {
                switch(this.CurrentStance)
                {
                    case "ken_selected": this.Selected = CHARACTERS.KEN; break;
                    case "ryu_selected": this.Selected = CHARACTERS.RYU; break;
                    case "mbison_selected": this.Selected = CHARACTERS.MBISON; break;
                };
            }
       }
    }
}

User.prototype.setPositions = function()
{
    switch(this.CurrentStance)
    {
        case "ryu": { this.setPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "chunli": { this.setPositionValues ("7px","17px","27px","0px",12,28); break; }
        case "charlie": { this.setPositionValues ("7px","17px","10px","0px",10,41); break; }
        case "ken": { this.setPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "guy": { this.setPositionValues ("7px","17px","27px","0px",0,32); break; }
        case "birdie": { this.setPositionValues ("7px","17px","27px","0px",16,28); break; }
        case "sodom": { this.setPositionValues ("7px","17px","10px","0px",10,24); break; }
        case "adon": { this.setPositionValues ("7px","17px","27px","0px",10,32); break; }
        case "rose": { this.setPositionValues ("-3px","17px","2px","0px",-32,32); break; }
        case "sagat": { this.setPositionValues ("7px","17px","10px","0px",16,28); break; }
        case "mbison": { this.setPositionValues ("7px","17px","10px","0px",-36,17); break; }
        /*
        case "akuma": { break; }
        case "dan": { break; }
        */
    };
}

User.prototype.showCharacter = function()
{
    switch(this.Selected)
    {
        case CHARACTERS.RYU: { this.CurrentStance = "ryu"; break; }
        case CHARACTERS.CHUNLI: { this.CurrentStance = "chunli"; break; }
        case CHARACTERS.CHARLIE: { this.CurrentStance = "charlie"; break; }
        case CHARACTERS.KEN: { this.CurrentStance = "ken"; break; }
        case CHARACTERS.GUY: { this.CurrentStance = "guy"; break; }
        case CHARACTERS.BIRDIE: { this.CurrentStance = "birdie"; break; }
        case CHARACTERS.SODOM: { this.CurrentStance = "sodom"; break; }
        case CHARACTERS.ADON: { this.CurrentStance = "adon"; break; }
        case CHARACTERS.RANDOM1: { this.RandomSelect = this.RandomSelect || 1; break; }
        case CHARACTERS.ROSE: { this.CurrentStance = "rose"; break; }
        case CHARACTERS.SAGAT: { this.CurrentStance = "sagat"; break; }
        case CHARACTERS.RANDOM2: { this.RandomSelect = this.RandomSelect || 1; break; }
        case CHARACTERS.MBISON: { this.CurrentStance = "mbison"; break; }
        /*
        case CHARACTERS.AKUMA: { break; }
        case CHARACTERS.DAN: { break; }
        */
    };

    this.setPositions();

    spriteLookup_.set(this.PortriatElement, "images/misc/misc/p2-select-" + this.CurrentStance + ".png");
    //this.PortriatElement.src = (this.Player == 1 ? "images/misc/misc/p1-select-" + this.CurrentStance + ".png" : "images/misc/misc/p2-select-" + this.CurrentStance + ".png");

    spriteLookup_.set(this.ShadowElement.Element, "images/misc/misc/" + this.CurrentStance + "-shadow.png");
    //this.ShadowElement.Element.src = "images/misc/" + this.CurrentStance + "/shadow.png";

    spriteLookup_.set(this.NameElement.Element, "images/misc/font3/name-" + this.CurrentStance + ".png");
    //this.NameElement.Element.src = "images/misc/font3/" + this.CurrentStance + ".png";

    if(!this.IsCharSelected && !!this.RandomSelect)
    {
        spriteLookup_.set(this.RandomCharFace.Element, "images/misc/misc/char-" + this.CurrentStance + "-r.png");
    }

}

/*Simply returns the count of all of the frames*/
User.prototype.getNextFrameID = function()
{
    return this.NbFrames;
}


/*returns the player instance from this user*/
User.prototype.getPlayer = function()
{
    var retVal = null;
    switch(this.Selected)
    {
        case CHARACTERS.RYU: { retVal = Player.prototype.createRyu(this); break; }
        case CHARACTERS.KEN: { retVal = Player.prototype.createKen(this); break; }
        case CHARACTERS.MBISON: { retVal = Player.prototype.createMBison(this); break; }
        /*
        case CHARACTERS.CHUNLI: { retVal = Player.prototype.createChunLi(this); break; }
        case CHARACTERS.CHARLIE: { retVal = Player.prototype.createCharlie(this); break; }
        case CHARACTERS.GUY: { retVal = Player.prototype.createGuy(this); break; }
        case CHARACTERS.BIRDIE: { retVal = Player.prototype.createBirdie(this); break; }
        case CHARACTERS.SODOM: { retVal = Player.prototype.createSodom(this); break; }
        case CHARACTERS.ADON: { retVal = Player.prototype.createAdon(this); break; }
        case CHARACTERS.RANDOM1: { break; }
        case CHARACTERS.ROSE: { retVal = Player.prototype.createRose(this); break; }
        case CHARACTERS.SAGAT: { retVal = Player.prototype.createSagat(this); break; }
        case CHARACTERS.RANDOM2: { break; }
        case CHARACTERS.AKUMA: { retVal = Player.prototype.createAkuma(this); break; }
        case CHARACTERS.DAN: { retVal = Player.prototype.createDan(this); break; }
        */
    };

    return retVal;
}

User.prototype.setPositionValues = function(shadowX,shadowY,nameX,nameY,stanceX,stanceY)
{
    this.show();
    this.ShadowElement.X = shadowX;
    this.ShadowElement.Y = shadowY;
    this.NameElement.X = nameX;
    this.NameElement.Y = nameY;
    this.SelectedCharStance.X = stanceX;
    this.SelectedCharStance.Y = stanceY;
}

/*this is just used to hide elements for players that arent implemented*/
User.prototype.setDisplay = function(show)
{
    this.Element.Element.style.display = !!show ? "" : "none";
}

User.prototype.hide = function() {this.setDisplay(false);} 
User.prototype.show = function() {this.setDisplay(true);} 

/*selecting a character*/
User.prototype.frameMove = function(frame)
{
    if(!this.IsCharSelected && !!this.RandomSelect && (frame % 5 == 0))
    {
        this.CurrentStance = CHAR_NAMES[this.RandomSelect-1]
        this.showCharacter();
        if(++this.RandomSelect > CHAR_NAMES.length)
            this.RandomSelect = 1;
    }
}

/*renders the users selected items*/
User.prototype.render = function(frame)
{
    if(this.Player == 1)
    {
        this.ShadowElement.Element.style.left = this.ShadowElement.X;
        this.ShadowElement.Element.style.bottom = this.ShadowElement.Y;
        this.NameElement.Element.style.left = this.NameElement.X;
        this.NameElement.Element.style.bottom = this.NameElement.Y;
    }
    else
    {
        this.ShadowElement.Element.style.right = this.ShadowElement.X;
        this.ShadowElement.Element.style.bottom = this.ShadowElement.Y;
        this.NameElement.Element.style.right =  this.NameElement.X;
        this.NameElement.Element.style.bottom = this.NameElement.Y;
    }

    if(!this.IsCharSelected)
        this.Animations["select_icon"].tryRender(frame, this.SelectIcon);

    if(!!this.Animations[this.CurrentStance])
    {
        this.setPositions();
        this.Animations[this.CurrentStance].tryRender(frame, this.SelectedCharStance, this.Direction);
    }
}


var CreateCharSelect = function(user1,user2)
{
    var u1_ = user1;
    var u2_ = user2;
    var CharSelect = function()
    {

        this.CharsMax = 11;
        this.CharsRow1 = {Min:0,Max:3};
        this.CharsRow2 = {Min:4,Max:7};
        this.CharsRow3 = {Min:8,Max:11};

        this.CharsCol1 = [0,4,8];
        this.CharsCol2 = [1,5,9];
        this.CharsCol3 = [2,6,10];
        this.CharsCol4 = [3,7,11];

        this.DelayAfterSelect = 0;
        this.Element = null;
        this.PlayerSelectImg = null;
        this.Music = "audio/misc/player-select.zzz";
        this.LastPicked = "";
        this.loadAssets();
    }

    CharSelect.prototype.getTeamA = function() { return [u1_]; }
    CharSelect.prototype.getTeamB = function() { return [u2_]; }


    /**/
    CharSelect.prototype.getPlayers = function(users)
    {
        var retVal = [];

        for(var i = 0; i < users.length; ++i)
            retVal.push(users[i].getPlayer());

        return retVal;
    }


    /*For now - only Ken's stage is implemented*/
    CharSelect.prototype.getStage = function()
    {
        return stages_[this.LastPicked];
    }


    CharSelect.prototype.restartMusic = function()
    {
        soundManager_.restart(this.Music);
    }

    CharSelect.prototype.playMusic = function()
    {
        soundManager_.playOrResume(this.Music,true);
    }

    CharSelect.prototype.pauseMusic = function()
    {
        soundManager_.pause(this.Music);
    }

    /**/
    CharSelect.prototype.pause = function()
    {
        this.pauseMusic();
    }

    /**/
    CharSelect.prototype.resume = function()
    {
        this.playMusic();
    }

    /**/
    CharSelect.prototype.start = function()
    {
        game_.showLoading(false);
        this.init();
        this.restartMusic();
        this.playMusic();
    }

    CharSelect.prototype.getRow = function(user)
    {
        if((user.Selected <= this.CharsRow1.Max) && (user.Selected >= this.CharsRow1.Min))
            return CONSTANTS.ROW1;
        else if((user.Selected <= this.CharsRow2.Max) && (user.Selected >= this.CharsRow2.Min))
            return CONSTANTS.ROW2;
        else if((user.Selected <= this.CharsRow3.Max) && (user.Selected >= this.CharsRow3.Min))
            return CONSTANTS.ROW3;
    }

    CharSelect.prototype.getColumn = function(user)
    {
        if(-1 < this.CharsCol1.indexOf(user.Selected))
            return CONSTANTS.COL1;
        else if(-1 < this.CharsCol2.indexOf(user.Selected))
            return CONSTANTS.COL2;
        else if(-1 < this.CharsCol3.indexOf(user.Selected))
            return CONSTANTS.COL3;
        else if(-1 < this.CharsCol4.indexOf(user.Selected))
            return CONSTANTS.COL4;
    }

    /*try to change character on the selection screen*/
    CharSelect.prototype.tryChangeCharacter = function(who, direction)
    {
        var row = this.getRow(who);
        var col = this.getColumn(who);
        var isUser1 = who.Player == 1;
        var isUser2 = who.Player == 2;

        if(direction == CONSTANTS.DOWN)
        {
            /*ensure that the player can only go to its own random select*/
            if(row != CONSTANTS.ROW3 && !(isUser1 && who.Selected == 7) && !(isUser2 && who.Selected == 4))
                who.Selected = Math.min(who.Selected + 4, this.CharsMax);
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
                    if(direction == CONSTANTS.RIGHT)  who.Selected = Math.min(who.Selected + 1, this.CharsRow1.Max);
                    else if(direction == CONSTANTS.LEFT) who.Selected = Math.max(who.Selected - 1, this.CharsRow1.Min);
                    break;
                }
                case CONSTANTS.ROW2:
                {
                    if(direction == CONSTANTS.RIGHT) who.Selected = Math.min(who.Selected + 1, this.CharsRow2.Max);
                    else if(direction == CONSTANTS.LEFT) who.Selected = Math.max(who.Selected - 1, this.CharsRow2.Min);
                    break;
                }
                case CONSTANTS.ROW3:
                {
                    /*ensure that the player can only go to its own random select*/
                    if(direction == CONSTANTS.RIGHT && !(isUser1 && who.Selected == 10)) who.Selected = Math.min(who.Selected + 1, this.CharsRow3.Max);
                    else if(direction == CONSTANTS.LEFT && !(isUser2 && who.Selected == 9)) who.Selected = Math.max(who.Selected - 1, this.CharsRow3.Min);
                    break;
                }
            }
        }

        var tmpRow = this.getRow(who);
        var tmpCol = this.getColumn(who);

        if(tmpRow != row || tmpCol != col)
        {
            if(isUser1)
                this.queueUser1MoveSound();
            else
                this.queueUser2MoveSound();
            
        }

        row = tmpRow;
        col = tmpCol;

        who.SelectIcon.Y = CONSTANTS.CHARSELECT_Y - (row * CONSTANTS.CHARSELECT_HEIGHT);
        who.SelectIcon.X = CONSTANTS.CHARSELECT_X + (col * CONSTANTS.CHARSELECT_WIDTH);
    }


    /**/
    CharSelect.prototype.kill = function()
    {
        this.release();
    }

    /**/
    CharSelect.prototype.release = function()
    {
        soundManager_.pause(this.Music);
        var parentElement = window.document.getElementById("pnlStage");
        parentElement.style.backgroundImage = "";
        parentElement.style.backgroundRepeat = "";

        //parentElement.removeChild(this.Element);
        //parentElement.removeChild(this.PlayerSelectImg);

        utils_.removeChildrenFromDOM(this.Element);
        utils_.removeChildrenFromDOM(this.PlayerSelectImg);


        if(!!u1_)
            u1_.release();
        if(!!u2_)
            u2_.release();
    }

    /**/
    CharSelect.prototype.init = function()
    {
        LoadCharSelectSpriteData();
        this.DelayAfterSelect = 0;
        this.Element = window.document.createElement("div");
        this.Element.className = "select";

        this.PlayerSelectImg = window.document.createElement("img");
        this.PlayerSelectImg.className = "player-select";
        this.PlayerSelectImg.src = "images/misc/misc/player-select.png";


        var parentElement = window.document.getElementById("pnlStage");
        parentElement.appendChild(this.PlayerSelectImg);
        parentElement.appendChild(this.Element);
        parentElement.style.backgroundImage = "url(images/misc/misc/player-select-back-bg.png)";
        parentElement.style.backgroundRepeat = "no-repeat";

        /*
        this.PlayerSelectImg.src = imageLookup_.getB64("images/misc/player-select.png");
        imageLookup_.getBgB64(parentElement,"images/misc/player-select-back-bg.png");
        imageLookup_.getBgB64(this.Element,"images/misc/player-select-bg.png");
        */

        /*init music*/
        //soundManager_.load(this.Music);

        /*Init user 1*/
        if(!!u1_)
        {
            u1_.Player = 1;
            u1_.Direction = -1;
            u1_.init(true);
            u1_.changeCharacterFn = (function(thisValue) { return function(direction) { thisValue.tryChangeCharacter(this,direction); } })(this);
            u1_.chooseCharacterFn = (function(thisValue) { return function(direction) { thisValue.queueUser1ChooseSound(); thisValue.LastPicked = this.getName(); } })(this);
            u1_.getOtherCharacterFn = (function(thisValue) { return function(direction) { return thisValue.IsCharSelected ? thisValue.getName() : ""; } })(u2_);
            u1_.getOtherIsAlternateFn = (function(thisValue) { return function(direction) { return thisValue.IsCharSelected && thisValue.IsAlternateChar; } })(u2_);

            if(u1_.Selected == null)
                u1_.Selected = CHARACTERS.RYU;
            u1_.changeCharacterFn();
            u1_.showCharacter();
        }

        /*Init user 2*/
        if(!!u2_)
        {
            u2_.Player = 2;
            u2_.Direction = 1;
            u2_.init(false);
            u2_.changeCharacterFn = (function(thisValue) { return function(direction) { thisValue.tryChangeCharacter(this,direction); } })(this);
            u2_.chooseCharacterFn = (function(thisValue) { return function(direction) { thisValue.queueUser2ChooseSound();  thisValue.LastPicked = this.getName();} })(this);
            u2_.getOtherCharacterFn = (function(thisValue) { return function(direction) { return thisValue.IsCharSelected ? thisValue.getName() : ""; } })(u1_);
            u2_.getOtherIsAlternateFn = (function(thisValue) { return function(direction) { return thisValue.IsCharSelected && thisValue.IsAlternateChar; } })(u1_);

            if(u1_.Selected == null)
                u1_.Selected = CHARACTERS.KEN;
            u2_.changeCharacterFn();
            u2_.showCharacter();
        }
    }

    /**/
    CharSelect.prototype.resetKeys = function()
    {
    }

    /*input handler*/
    CharSelect.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
    {
        u1_.onKeyStateChanged(isDown,keyCode,frame);
        u2_.onKeyStateChanged(isDown,keyCode,frame);
    }

    CharSelect.prototype.check = function()
    {
        if(((!!u1_ && u1_.IsCharSelected) || !u1_)
            && ((!!u2_ && u2_.IsCharSelected) || !u2_))
        {
            this.IsDone = true;
            ++this.DelayAfterSelect;
        }
    }

    /**/
    CharSelect.prototype.frameMove = function(frame)
    {
        u1_.frameMove(frame);
        u2_.frameMove(frame);
        this.check();
    }

    /**/
    CharSelect.prototype.render = function(frame)
    {
        u1_.render(frame);
        u2_.render(frame);
    }

    /**/
    CharSelect.prototype.queueUser1MoveSound = function(value) { soundManager_.queueSound("audio/misc/p-select-move-0.zzz"); }
    CharSelect.prototype.queueUser1ChooseSound = function(value) { soundManager_.queueSound("audio/misc/p-select-choose-0.zzz"); }
    CharSelect.prototype.queueUser2MoveSound = function(value) { soundManager_.queueSound("audio/misc/p-select-move-1.zzz"); }
    CharSelect.prototype.queueUser2ChooseSound = function(value) { soundManager_.queueSound("audio/misc/p-select-choose-0.zzz"); }


    Array.prototype.indexOf = Array.prototype.indexOf || function(value)
    {
        for(var i = 0, length = this.length; i < length; ++i)
            if(this[i] == value)
                return i;
        return -1;
    }

    var LoadCharSelectSpriteData = function()
    {
	    spriteLookup_.load("images/misc/misc/adon-r-stance-0.png","images/misc/misc/stance-sprites.png", "0px", "-33px", "148px", "270px");
	    spriteLookup_.load("images/misc/misc/adon-r-stance-1.png","images/misc/misc/stance-sprites.png", "-148px", "-30px", "150px", "273px");
	    spriteLookup_.load("images/misc/misc/adon-r-stance-2.png","images/misc/misc/stance-sprites.png", "-298px", "-28px", "154px", "275px");
	    spriteLookup_.load("images/misc/misc/adon-r-stance-3.png","images/misc/misc/stance-sprites.png", "-452px", "-30px", "154px", "273px");
	    spriteLookup_.load("images/misc/misc/adon-r-stance-4.png","images/misc/misc/stance-sprites.png", "-606px", "-28px", "152px", "275px");
	    spriteLookup_.load("images/misc/misc/birdie-r-stance-0.png","images/misc/misc/stance-sprites.png", "-758px", "-20px", "196px", "283px");
	    spriteLookup_.load("images/misc/misc/birdie-r-stance-1.png","images/misc/misc/stance-sprites.png", "-954px", "-25px", "200px", "278px");
	    spriteLookup_.load("images/misc/misc/birdie-r-stance-2.png","images/misc/misc/stance-sprites.png", "-1154px", "-25px", "200px", "278px");
	    spriteLookup_.load("images/misc/misc/birdie-r-stance-3.png","images/misc/misc/stance-sprites.png", "-1354px", "-23px", "196px", "280px");
	    spriteLookup_.load("images/misc/misc/charlie-r-stance-0.png","images/misc/misc/stance-sprites.png", "-1550px", "-56px", "176px", "247px");
	    spriteLookup_.load("images/misc/misc/charlie-r-stance-1.png","images/misc/misc/stance-sprites.png", "-1726px", "-53px", "176px", "250px");
	    spriteLookup_.load("images/misc/misc/charlie-r-stance-2.png","images/misc/misc/stance-sprites.png", "-1902px", "-51px", "178px", "252px");
	    spriteLookup_.load("images/misc/misc/charlie-r-stance-3.png","images/misc/misc/stance-sprites.png", "-2080px", "-51px", "178px", "252px");
	    spriteLookup_.load("images/misc/misc/chunli-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2258px", "-82px", "180px", "221px");
	    spriteLookup_.load("images/misc/misc/chunli-r-stance-1.png","images/misc/misc/stance-sprites.png", "-2438px", "-79px", "180px", "224px");
	    spriteLookup_.load("images/misc/misc/chunli-r-stance-2.png","images/misc/misc/stance-sprites.png", "-2618px", "-77px", "180px", "226px");
	    spriteLookup_.load("images/misc/misc/chunli-r-stance-3.png","images/misc/misc/stance-sprites.png", "-2798px", "-79px", "180px", "224px");
	    spriteLookup_.load("images/misc/misc/guy-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2978px", "-56px", "148px", "247px");
	    spriteLookup_.load("images/misc/misc/guy-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3126px", "-56px", "146px", "247px");
	    spriteLookup_.load("images/misc/misc/guy-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3272px", "-56px", "148px", "247px");
	    spriteLookup_.load("images/misc/misc/guy-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3420px", "-56px", "148px", "247px");
	    spriteLookup_.load("images/misc/misc/ken-r-stance-0.png","images/misc/misc/stance-sprites.png", "-3568px", "-63px", "132px", "240px");
	    spriteLookup_.load("images/misc/misc/ken-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3700px", "-61px", "132px", "242px");
	    spriteLookup_.load("images/misc/misc/ken-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3832px", "-56px", "132px", "247px");
	    spriteLookup_.load("images/misc/misc/ken-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3964px", "-50px", "129px", "253px");
	    spriteLookup_.load("images/misc/misc/ken-r-win-2-0.png","images/misc/misc/stance-sprites.png", "-4093px", "-66px", "120px", "237px");
	    spriteLookup_.load("images/misc/misc/ken-r-win-2-1.png","images/misc/misc/stance-sprites.png", "-4213px", "-48px", "124px", "255px");
	    spriteLookup_.load("images/misc/misc/ken-r-win-2-2.png","images/misc/misc/stance-sprites.png", "-4337px", "0px", "124px", "303px");
	    spriteLookup_.load("images/misc/misc/mbison-r-stance-0.png","images/misc/misc/stance-sprites.png", "-4461px", "-62px", "234px", "241px");
	    spriteLookup_.load("images/misc/misc/mbison-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4695px", "-57px", "242px", "246px");
	    spriteLookup_.load("images/misc/misc/mbison-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4937px", "-53px", "242px", "250px");
	    spriteLookup_.load("images/misc/misc/mbison-r-stance-3.png","images/misc/misc/stance-sprites.png", "0px", "-365px", "242px", "252px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-0.png","images/misc/misc/stance-sprites.png", "-242px", "-357px", "272px", "260px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-1.png","images/misc/misc/stance-sprites.png", "-514px", "-362px", "224px", "255px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-2.png","images/misc/misc/stance-sprites.png", "-738px", "-365px", "224px", "252px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-3.png","images/misc/misc/stance-sprites.png", "-962px", "-365px", "224px", "252px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-4.png","images/misc/misc/stance-sprites.png", "-1186px", "-365px", "224px", "252px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-5.png","images/misc/misc/stance-sprites.png", "-1410px", "-362px", "224px", "255px");
	    spriteLookup_.load("images/misc/misc/mbison-r-win-0-6.png","images/misc/misc/stance-sprites.png", "-1634px", "-362px", "224px", "255px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-0.png","images/misc/misc/stance-sprites.png", "-1858px", "-337px", "190px", "280px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-1.png","images/misc/misc/stance-sprites.png", "-2048px", "-339px", "188px", "278px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-2.png","images/misc/misc/stance-sprites.png", "-2236px", "-342px", "186px", "275px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-3.png","images/misc/misc/stance-sprites.png", "-2422px", "-347px", "188px", "270px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-4.png","images/misc/misc/stance-sprites.png", "-2610px", "-344px", "190px", "273px");
	    spriteLookup_.load("images/misc/misc/rose-r-c-stance-5.png","images/misc/misc/stance-sprites.png", "-2800px", "-342px", "190px", "275px");
	    spriteLookup_.load("images/misc/misc/ryu-r-stance-0.png","images/misc/misc/stance-sprites.png", "-2990px", "-378px", "132px", "239px");
	    spriteLookup_.load("images/misc/misc/ryu-r-stance-1.png","images/misc/misc/stance-sprites.png", "-3122px", "-375px", "132px", "242px");
	    spriteLookup_.load("images/misc/misc/ryu-r-stance-2.png","images/misc/misc/stance-sprites.png", "-3254px", "-370px", "132px", "247px");
	    spriteLookup_.load("images/misc/misc/ryu-r-stance-3.png","images/misc/misc/stance-sprites.png", "-3386px", "-365px", "129px", "252px");
	    spriteLookup_.load("images/misc/misc/ryu-r-win-2-0.png","images/misc/misc/stance-sprites.png", "-3515px", "-380px", "120px", "237px");
	    spriteLookup_.load("images/misc/misc/ryu-r-win-2-1.png","images/misc/misc/stance-sprites.png", "-3635px", "-362px", "124px", "255px");
	    spriteLookup_.load("images/misc/misc/ryu-r-win-2-2.png","images/misc/misc/stance-sprites.png", "-3759px", "-314px", "124px", "303px");
	    spriteLookup_.load("images/misc/misc/sagat-r-stance-0.png","images/misc/misc/stance-sprites.png", "-3883px", "-303px", "164px", "314px");
	    spriteLookup_.load("images/misc/misc/sagat-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4047px", "-316px", "162px", "301px");
	    spriteLookup_.load("images/misc/misc/sagat-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4209px", "-313px", "162px", "304px");
	    spriteLookup_.load("images/misc/misc/sagat-r-stance-3.png","images/misc/misc/stance-sprites.png", "-4371px", "-308px", "164px", "309px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-0.png","images/misc/misc/stance-sprites.png", "-4535px", "-316px", "176px", "301px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-1.png","images/misc/misc/stance-sprites.png", "-4711px", "-314px", "178px", "303px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-2.png","images/misc/misc/stance-sprites.png", "-4889px", "-309px", "174px", "308px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-3.png","images/misc/misc/stance-sprites.png", "-5063px", "-306px", "172px", "311px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-4.png","images/misc/misc/stance-sprites.png", "-5235px", "-309px", "174px", "308px");
	    spriteLookup_.load("images/misc/misc/sodom-r-stance-5.png","images/misc/misc/stance-sprites.png", "-5409px", "-314px", "178px", "303px");

	    spriteLookup_.load("images/misc/misc/p1-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "0px", "64px", "82px");
	    spriteLookup_.load("images/misc/misc/p1-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "0px", "64px", "82px");
	    spriteLookup_.load("images/misc/misc/p2-select-0.png","|images/misc/misc/char-misc-sprites.png", "0px", "-82px", "64px", "82px");
	    spriteLookup_.load("images/misc/misc/p2-select-1.png","|images/misc/misc/char-misc-sprites.png", "-64px", "-82px", "64px", "82px");


    }

    CharSelect.prototype.loadUserAssets = function(users)
    {
        for(var i = 0; i < users.length; ++i)
        {
            var user = users[i];
            if(!!user.getName())
            {
                var name = user.getName();
                var folder = user.getFolder();
                stuffLoader_.queue("script/player-" + name + ".js",RESOURCE_TYPES.SCRIPT);
                stuffLoader_.queue("script/player-" + folder + "-spritedata.js",RESOURCE_TYPES.SCRIPT);
            }
        }
    }

    CharSelect.prototype.loadAssets = function()
    {
        stuffLoader_.queue("char-select.js",RESOURCE_TYPES.BASE64AUDIO);
    }

    return new CharSelect();
}
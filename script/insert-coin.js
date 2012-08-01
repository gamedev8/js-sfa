var CreateInsertCoinScreen = function(u1,u2)
{
    /*private members*/
    var nbCredits_ = 0;
    var showCredits_ = false;
    var hideInsertCoin_ = false;
    var mustUpdate_ = false;
    var user1_ = u1;
    var user2_ = u2;
    var isDone_ = false;
    var text1_ = null;
    var text1_ = null;
    var capElement_ = null;
    var insertCoinElement_ = null;
    var creditsElement_ = null;
    var creditsTextElement_ = null;
    var parent_ = window.document.getElementById("pnlStage");

    /*public*/
    var InsertCoinScreen = function()
    {
        this.LoadAssets();
    }


    InsertCoinScreen.prototype.Resume = function() { }
    InsertCoinScreen.prototype.Pause = function() { }
    InsertCoinScreen.prototype.ResetKeys = function() { }
    InsertCoinScreen.prototype.Init = function() { }
    InsertCoinScreen.prototype.LoadAssets = function()
    {
        /*insert coin*/
        stuffLoader_.Queue("insert-coin.js",RESOURCE_TYPES.BASE64AUDIO);
        stuffLoader_.Queue("images/misc/misc/insert-coin.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/announcer-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/font1/insert.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/font1/credits.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/font1/cap.png",RESOURCE_TYPES.IMAGE);

        /*match*/
        stuffLoader_.Queue("images/misc/misc/shadow-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/dirt-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/blast-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/bars-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl0.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl1.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/energy-bar-lvl2.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/health-bar-life.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/health-bar-damage.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);

        /*character select*/
        stuffLoader_.Queue("images/misc/misc/player-select.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/font3/name-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/char-misc-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/head-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/player-select-back-bg.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/player-select-bg.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/stance-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.Queue("images/misc/misc/char-sprites.png",RESOURCE_TYPES.IMAGE);

		spriteLookup_.Load("images/misc/misc/p2-select-adon.png","images/misc/misc/head-sprites.png", "0px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-akuma.png","images/misc/misc/head-sprites.png", "-256px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-birdie.png","images/misc/misc/head-sprites.png", "-512px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-charlie.png","images/misc/misc/head-sprites.png", "-768px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-chunli.png","images/misc/misc/head-sprites.png", "-1024px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-dan.png","images/misc/misc/head-sprites.png", "-1280px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-guy.png","images/misc/misc/head-sprites.png", "-1536px", "0px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-ken.png","images/misc/misc/head-sprites.png", "0px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-mbison.png","images/misc/misc/head-sprites.png", "-256px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-rose.png","images/misc/misc/head-sprites.png", "-512px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-ryu.png","images/misc/misc/head-sprites.png", "-768px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-sagat.png","images/misc/misc/head-sprites.png", "-1024px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/p2-select-sodom.png","images/misc/misc/head-sprites.png", "-1280px", "-288px", "256px", "288px");
		spriteLookup_.Load("images/misc/misc/vs-0.png","images/misc/misc/head-sprites.png", "-1536px", "-412px", "252px", "164px");


	    spriteLookup_.Load("images/misc/font3/name-adon.png","images/misc/font3/name-sprites.png", "0px", "0px", "129px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-akuma.png","images/misc/font3/name-sprites.png", "-129px", "0px", "160px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-birdie.png","images/misc/font3/name-sprites.png", "-289px", "-9px", "160px", "32px");
	    spriteLookup_.Load("images/misc/font3/name-charlie.png","images/misc/font3/name-sprites.png", "-449px", "0px", "160px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-chunli.png","images/misc/font3/name-sprites.png", "-609px", "0px", "160px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-dan.png","images/misc/font3/name-sprites.png", "-769px", "0px", "94px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-guy.png","images/misc/font3/name-sprites.png", "0px", "-50px", "96px", "32px");
	    spriteLookup_.Load("images/misc/font3/name-ken.png","images/misc/font3/name-sprites.png", "-96px", "-41px", "96px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-mbison.png","images/misc/font3/name-sprites.png", "-192px", "-41px", "160px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-rose.png","images/misc/font3/name-sprites.png", "-352px", "-41px", "128px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-ryu.png","images/misc/font3/name-sprites.png", "-480px", "-41px", "96px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-sagat.png","images/misc/font3/name-sprites.png", "-576px", "-41px", "160px", "41px");
	    spriteLookup_.Load("images/misc/font3/name-sodom.png","images/misc/font3/name-sprites.png", "-736px", "-41px", "161px", "41px");

}


    InsertCoinScreen.prototype.IsDone = function() { return isDone_; }



    InsertCoinScreen.prototype.Start = function()
    {
        game_.ShowLoading(false);
        this.isDone_ = false;
        capElement_ = window.document.createElement("div");
        capElement_.className = "capcom";
        capElement_.id = "pnlCapcom";
        parent_.appendChild(capElement_);

        insertCoinElement_ = window.document.createElement("div");
        insertCoinElement_.className = "insert-coin";
        insertCoinElement_.id = "pnlInsertCoin";
        parent_.appendChild(insertCoinElement_);

        creditsElement_ = window.document.createElement("div");
        creditsElement_.className = "credits";
        creditsElement_.id = "pnlCredits";
        creditsElement_.style.display = "none";
        parent_.appendChild(creditsElement_);

        creditsTextElement_ = window.document.createElement("div");
        creditsTextElement_.className = "credits-text";
        creditsTextElement_.id = "pnlCredits";
        creditsTextElement_.style.display = "none";
        parent_.appendChild(creditsTextElement_);

        text1_ = fontSystem_.AddText("pnlCredits","",432,555,0,"font1");
        //text1_.ShowNow(432);
        window.document.getElementById("pnlStage").style.backgroundImage = "url(images/misc/misc/insert-coin.png)";
    }


    InsertCoinScreen.prototype.Release = function()
    {
        this.isDone_ = true;
        utils_.RemoveFromDOM(capElement_);
        utils_.RemoveFromDOM(insertCoinElement_);
        utils_.RemoveFromDOM(creditsTextElement_);
        utils_.RemoveFromDOM(creditsElement_);
        window.document.getElementById("pnlStage").style.backgroundImage = "";
    }


    InsertCoinScreen.prototype.Kill = function()
    {
        this.Release();
    }

    InsertCoinScreen.prototype.OnKeyStateChanged = function(isDown,keyCode,frame)
    {
        Alert(keyCode);
        if(!!isDown && (keyCode == KEYS.CNTRL))
        {
            showCredits_ = true;
            mustUpdate_ = true;

            nbCredits_ = Math.min(nbCredits_ + 1, CONSTANTS.MAX_CREDITS);
            text1_.Change(nbCredits_);
            soundManager_.QueueSound("audio/misc/credit.zzz");

        }
        else if(!!isDown && (keyCode == KEYS.ENTER) && !!nbCredits_)
        {
            StartCharacterSelection();
        }
    }




    InsertCoinScreen.prototype.FrameMove = function(frame)
    {
        if(!showCredits_)
        {
            if((frame % 80) == 0)
            {
                hideInsertCoin_ = false;
                mustUpdate_ = true;
            }
            else if((frame % 40) == 0)
            {
                hideInsertCoin_ = true;
                mustUpdate_ = true;
            }
        }
    }


    InsertCoinScreen.prototype.Render = function(frame)
    {
        if(!!mustUpdate_)
        {
            mustUpdate_ = false;
            if(!!showCredits_)
            {
                capElement_.style.display = "none";
                insertCoinElement_.style.display = "none";
                creditsElement_.style.display = "";
                creditsTextElement_.style.display = "";
            }
            else
            {
                if(!!hideInsertCoin_)
                    insertCoinElement_.style.display = "none";
                else
                    insertCoinElement_.style.display = "";
            }
        }
    }

    return new InsertCoinScreen();
}
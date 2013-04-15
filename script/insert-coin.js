var CreateInsertCoinScreen = function(u1,u2)
{
    /*private members*/
    var hideInsertCoin_ = false;
    var mustUpdate_ = true;
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
    var nbCredits_ = 0;

    /*public*/
    var InsertCoinScreen = function()
    {
        this.loadAssets();
    }


    InsertCoinScreen.prototype.resume = function() { }
    InsertCoinScreen.prototype.pause = function() { }
    InsertCoinScreen.prototype.resetKeys = function() { }
    InsertCoinScreen.prototype.init = function() { }
    InsertCoinScreen.prototype.loadAssets = function()
    {
        /*insert coin*/
        stuffLoader_.queue("insert-coin.js",RESOURCE_TYPES.BASE64AUDIO);
        stuffLoader_.queue("char-select.js",RESOURCE_TYPES.BASE64AUDIO);
        stuffLoader_.queue("match.js",RESOURCE_TYPES.BASE64AUDIO);

<<<<<<< HEAD
        //stuffLoader_.queue("images/misc/misc/insert-coin.png",RESOURCE_TYPES.IMAGE);
=======
        stuffLoader_.queue("images/misc/misc/insert-coin.png",RESOURCE_TYPES.IMAGE);
>>>>>>> js-sfa/master
        stuffLoader_.queue("images/misc/misc/announcer-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/font1/insert.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/font1/credits.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/font1/cap.png",RESOURCE_TYPES.IMAGE);

        //match
        stuffLoader_.queue("images/misc/misc/shadow-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/dirt-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/blast-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/bars-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/energy-bar-lvl0.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/energy-bar-lvl1.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/energy-bar-lvl2.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/health-bar-life.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/health-bar-damage.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/misc-sprites.png",RESOURCE_TYPES.IMAGE);

        //character select
        //stuffLoader_.queue("images/misc/misc/player-select.png",RESOURCE_TYPES.IMAGE);
        //stuffLoader_.queue("images/misc/font3/name-sprites.png",RESOURCE_TYPES.IMAGE);
        //stuffLoader_.queue("images/misc/misc/char-misc-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/head-sprites.png",RESOURCE_TYPES.IMAGE);
        //stuffLoader_.queue("images/misc/misc/player-select-back-bg.png",RESOURCE_TYPES.IMAGE);
        //stuffLoader_.queue("images/misc/misc/player-select-bg.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/char-select-sprites.png",RESOURCE_TYPES.IMAGE);
        stuffLoader_.queue("images/misc/misc/char-sprites.png",RESOURCE_TYPES.IMAGE);

        //preload characters
        Player.prototype.loadAssets("ryu","ryu",true);
        Player.prototype.loadAssets("ryu","ryu2",true);
        Player.prototype.loadAssets("ken","ken",true);
        Player.prototype.loadAssets("ken","ken2",true);
        Player.prototype.loadAssets("sagat","sagat",true);
        Player.prototype.loadAssets("sagat","sagat2",true);
        Player.prototype.loadAssets("mbison","mbison",true);
        Player.prototype.loadAssets("mbison","mbison2",true);
<<<<<<< HEAD
        Player.prototype.loadAssets("akuma","akuma",true);
        Player.prototype.loadAssets("akuma","akuma2",true);
=======

		spriteLookup_.load("images/misc/misc/p2-select-adon.png","images/misc/misc/head-sprites.png", "0px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-akuma.png","images/misc/misc/head-sprites.png", "-256px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-birdie.png","images/misc/misc/head-sprites.png", "-512px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-charlie.png","images/misc/misc/head-sprites.png", "-768px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-chunli.png","images/misc/misc/head-sprites.png", "-1024px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-dan.png","images/misc/misc/head-sprites.png", "-1280px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-guy.png","images/misc/misc/head-sprites.png", "-1536px", "0px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-ken.png","images/misc/misc/head-sprites.png", "0px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-mbison.png","images/misc/misc/head-sprites.png", "-256px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-rose.png","images/misc/misc/head-sprites.png", "-512px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-ryu.png","images/misc/misc/head-sprites.png", "-768px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-sagat.png","images/misc/misc/head-sprites.png", "-1024px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/p2-select-sodom.png","images/misc/misc/head-sprites.png", "-1280px", "-288px", "256px", "288px");
		spriteLookup_.load("images/misc/misc/vs-0.png","images/misc/misc/head-sprites.png", "-1536px", "-412px", "252px", "164px");


	    spriteLookup_.load("images/misc/font3/name-adon.png","images/misc/font3/name-sprites.png", "0px", "0px", "129px", "41px");
	    spriteLookup_.load("images/misc/font3/name-akuma.png","images/misc/font3/name-sprites.png", "-129px", "0px", "160px", "41px");
	    spriteLookup_.load("images/misc/font3/name-birdie.png","images/misc/font3/name-sprites.png", "-289px", "-9px", "160px", "32px");
	    spriteLookup_.load("images/misc/font3/name-charlie.png","images/misc/font3/name-sprites.png", "-449px", "0px", "160px", "41px");
	    spriteLookup_.load("images/misc/font3/name-chunli.png","images/misc/font3/name-sprites.png", "-609px", "0px", "160px", "41px");
	    spriteLookup_.load("images/misc/font3/name-dan.png","images/misc/font3/name-sprites.png", "-769px", "0px", "94px", "41px");
	    spriteLookup_.load("images/misc/font3/name-guy.png","images/misc/font3/name-sprites.png", "0px", "-50px", "96px", "32px");
	    spriteLookup_.load("images/misc/font3/name-ken.png","images/misc/font3/name-sprites.png", "-96px", "-41px", "96px", "41px");
	    spriteLookup_.load("images/misc/font3/name-mbison.png","images/misc/font3/name-sprites.png", "-192px", "-41px", "160px", "41px");
	    spriteLookup_.load("images/misc/font3/name-rose.png","images/misc/font3/name-sprites.png", "-352px", "-41px", "128px", "41px");
	    spriteLookup_.load("images/misc/font3/name-ryu.png","images/misc/font3/name-sprites.png", "-480px", "-41px", "96px", "41px");
	    spriteLookup_.load("images/misc/font3/name-sagat.png","images/misc/font3/name-sprites.png", "-576px", "-41px", "160px", "41px");
	    spriteLookup_.load("images/misc/font3/name-sodom.png","images/misc/font3/name-sprites.png", "-736px", "-41px", "161px", "41px");

>>>>>>> js-sfa/master
    }


    InsertCoinScreen.prototype.isDone = function() { return isDone_; }



    InsertCoinScreen.prototype.start = function()
    {
        game_.showLoading(false);
        isDone_ = false;
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

        text1_ = fontSystem_.addText("pnlCredits","",432,555,0,"font1");
        //text1_.showNow(432);
        var pnlStage = window.document.getElementById("pnlStage");
        spriteLookup_.set(pnlStage, "images/misc/misc/insert-coin.png", true)

        /*
        imageLookup_.getBgB64(capElement_,"images/misc/cap.png");
        imageLookup_.getBgB64(insertCoinElement_,"images/misc/insert.png");
        imageLookup_.getBgB64(creditsTextElement_,"images/misc/credits.png");
        imageLookup_.getBgB64(window.document.getElementById("pnlStage"), "images/misc/insert-coin.png");
        */
    }


    InsertCoinScreen.prototype.release = function()
    {
        this.IsDone = true;
        utils_.removeFromDOM(capElement_);
        utils_.removeFromDOM(insertCoinElement_);
        utils_.removeFromDOM(creditsTextElement_);
        utils_.removeFromDOM(creditsElement_);
        window.document.getElementById("pnlStage").style.backgroundImage = "";
    }


    InsertCoinScreen.prototype.kill = function()
    {
        this.release();
    }

    InsertCoinScreen.prototype.onAddCredit = function()
    {
        mustUpdate_ = true;
    }

    InsertCoinScreen.prototype.onKeyStateChanged = function(isDown,keyCode,frame)
    {
        if(!!user1_)
        {
            if(!!isDown && (keyCode == user1_.Coin))
                this.onAddCredit();
        }
        if(!!user2_)
        {
            if(!!isDown && (keyCode == user2_.Coin))
                this.onAddCredit();
        }
    }


    InsertCoinScreen.prototype.frameMove = function(frame)
    {
        if((!!user1_ && user1_.IsRequestingCharSelect) || (!!user2_ && user2_.IsRequestingCharSelect))
        {
            StartCharacterSelection();
            return;
        }

        if((!!u1 && !user1_.hasCredits()) || (!!user2_ && !user2_.hasCredits()))
        {
            if(!__debugMode && (frame % 1000) == 0)
            {
                return game_.startRandomMatch();
            }
            else if((frame % 80) == 0)
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


    InsertCoinScreen.prototype.render = function(frame)
    {
        if(!!mustUpdate_)
        {
            mustUpdate_ = false;
            if((!!user1_ && user1_.hasCredits()) || (!!user2_ && user2_.hasCredits()))
            {
                capElement_.style.display = "none";
                insertCoinElement_.style.display = "none";
                creditsElement_.style.display = "";
                creditsTextElement_.style.display = "";
                nbCredits_ = Math.min(9, (!!user1_ ? user1_.getNbCredits() : 0) + (!!user2_ ? user2_.getNbCredits() : 0))
                text1_.change(nbCredits_);
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
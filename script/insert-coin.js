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
        this.PreLoadSounds();
    }


    InsertCoinScreen.prototype.Resume = function() { }
    InsertCoinScreen.prototype.Pause = function() { }
    InsertCoinScreen.prototype.ResetKeys = function() { }
    InsertCoinScreen.prototype.Init = function() { }
    InsertCoinScreen.prototype.PreLoadSounds = function()
    {
        soundManager_.Load("audio/misc/credit.zzz",3);
    }


    InsertCoinScreen.prototype.IsDone = function() { return isDone_; }



    InsertCoinScreen.prototype.Start = function()
    {
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
    }


    InsertCoinScreen.prototype.Release = function()
    {
        this.isDone_ = true;
        RemoveFromDOM(capElement_);
        RemoveFromDOM(insertCoinElement_);
        RemoveFromDOM(creditsTextElement_);
        RemoveFromDOM(creditsElement_);
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
        else if(!!isDown && (keyCode == KEYS.SPACE) && !!nbCredits_)
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
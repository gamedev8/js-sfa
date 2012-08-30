var CreateTeam = function(num)
{
    var cursor_ = 0;
    var lastCursor_ = -1;
    var teamNum_ = num;
    var portriatImg_ = window.document.getElementById("portriatTeam" + num);
    var nameImg_ = window.document.getElementById("nameTeam" + num);
    var healthbar_ = CreateHealthBar("pnlHealthbarTeam" + num,num);
    var energybar_ = CreateEnergyBar("pnlEnergyBarTeam" + num + "Container",num);
    var comboText_ = null;
    var nbHitsText_ = null;
    var currentCombo_ = 0;
    var currentComboRefCount_ = 0;
    var nbPlayers_ = 0;

    var Team = function(num)
    {
        this.players_ = [];
    }

    Team.prototype.GetGame = function() { return game_; }
    Team.prototype.GetPlayer = function(value) { return this.GetPlayers()[value]; }
    Team.prototype.GetPlayers = function() { return this.players_; }
    Team.prototype.SetPlayers = function(value)
    {
        this.players_ = value;
        this.SetPlayerIndexes();
        nbPlayers_ = this.players_.length;
    }
    Team.prototype.AddPlayer = function(value)
    {
        this.players_.push(value);
        this.SetPlayerIndexes();
        nbPlayers_ = this.players_.length;
    }
    Team.prototype.SetPlayerIndexes = function()
    {
        for(var i = 0, length = this.players_.length; i < length; ++i)
            this.players_[i].SetIndex(i);
    }
    Team.prototype.GetCursor = function() { return cursor_; }
    Team.prototype.SetCursor = function(value) { cursor_ = value; }
    Team.prototype.GetLastCursor = function() { return lastCursor_; }
    Team.prototype.SetLastCursor = function(value) { lastCursor_ = value; }
    Team.prototype.GetTeamNum = function() { return teamNum_; }
    Team.prototype.SetTeamNum = function(value) { teamNum_ = value; }
    Team.prototype.GetPortriatImg = function() { return portriatImg_; }
    Team.prototype.SetPortriatImg = function(value) { portriatImg_ = value; }
    Team.prototype.GetNameImg = function() { return nameImg_; }
    Team.prototype.SetNameImg = function(value) { nameImg_ = value; }
    Team.prototype.GetHealthbar = function() { return healthbar_; }
    Team.prototype.SetHealthbar = function(value) { healthbar_ = value; }
    Team.prototype.GetEnergybar = function() { return energybar_; }
    Team.prototype.SetEnergybar = function(value) { energybar_ = value; }
    Team.prototype.GetComboText = function() { return comboText_; }
    Team.prototype.SetComboText = function(value) { comboText_ = value; }
    Team.prototype.SetNbHitText = function(value) { nbHitsText_ = value; }
    Team.prototype.GetCurrentCombo = function() { return currentCombo_; }
    Team.prototype.SetCurrentCombo = function(value) { currentCombo_ = value; }
    Team.prototype.IncCurrentCombo = function() { ++currentCombo_; }
    Team.prototype.GetCurrentComboRefCount = function() { return currentComboRefCount_; }
    Team.prototype.SetCurrentComboRefCount = function(value) { currentComboRefCount_ = value; }
    Team.prototype.IncCurrentComboRefCount = function() { ++currentComboRefCount_; }


    Team.prototype.Init = function()
    {
        portriatImg_.style.display = "";
        nameImg_.style.display = "";
        healthbar_.Init();
        energybar_.Init();

        /*
        imageLookup_.GetBgB64(portriatImg_,"images/misc/char-sprites.png");
        imageLookup_.GetBgB64(nameImg_,"images/misc/char-sprites.png");
        */
        this.Hide();
    }



    Team.prototype.IncComboRefCount = function()
    {
        this.IncCurrentComboRefCount();
    }


    Team.prototype.DecComboRefCount = function()
    {
        this.SetCurrentComboRefCount(Math.max(this.GetCurrentComboRefCount() - 1, 0));
        if(!this.GetCurrentComboRefCount())
        {
            this.SetCurrentCombo(0);
        }
    }

    Team.prototype.IncCombo = function()
    {
        this.IncCurrentCombo();
        if(this.GetCurrentCombo() > 1)
            this.WriteCombo(this.GetCurrentCombo());
    }


    Team.prototype.InitText = function()
    {
        comboText_ = game_.AddManagedText("pnlTeam" + this.GetTeamNum() + "ComboText",0,170,"font2", teamNum_ == 2);
        nbHitsText_ = game_.AddManagedText("pnlTeam" + this.GetTeamNum() + "NbHitsText",0,170,"font3", teamNum_ == 2);
    }


    Team.prototype.GetNbHitsText = function(nbHits)
    {
        if(nbHits == 2) return "GOOD !";
        else if(nbHits == 3) return "GOOD !!";
        else if(nbHits == 4) return "GREAT !";
        else if(nbHits == 5) return "GREAT !!";
        else if(nbHits == 6) return "VERY GOOD !";
        else if(nbHits == 7) return "VERY GOOD !!";
        else if(nbHits == 8) return "WONDERFUL !";
        else if(nbHits == 9) return "WONDERFUL !!";
        else if(nbHits == 10) return "FANTASTIC !";
        else if(nbHits == 11) return "FANTASTIC !!";
        else if(nbHits == 12) return "MARVELOUS !";
        else if(nbHits == 13) return "MARVELOUS !!";
        else return "MARVELOUS !!!";
    }


    Team.prototype.WriteCombo = function(nbHits)
    {
        comboText_.Change(nbHits + TEXT.HIT_COMBO,10,game_.GetCurrentFrame() + CONSTANTS.COMBO_TEXT_LIFE);
        this.WriteText(this.GetNbHitsText(nbHits));
    }


    Team.prototype.WriteText = function(text)
    {
        nbHitsText_.Change(text,10,game_.GetCurrentFrame() + CONSTANTS.TEXT_DELAY + CONSTANTS.TEXT_LIFE,game_.GetCurrentFrame() + CONSTANTS.TEXT_DELAY,true,30);
    }


    /*remove any DOM element that was added by this instance*/
    Team.prototype.Release = function()
    {
        portriatImg_.style.display = "none";
        nameImg_.style.display = "none";
        if(!!comboText_)
        {
            comboText_.HideNow();
        }
        if(!!nbHitsText_)
        {
            nbHitsText_.HideNow();
        }
        healthbar_.Release();
        energybar_.Release();
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).Release();
        this.SetCursor(0);
    }

    Team.prototype.Show = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.players_[i].Show();
        portriatImg_.parentNode.style.display = "";
    }

    Team.prototype.Hide = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.players_[i].Hide();
        portriatImg_.parentNode.style.display = "none";
    }

    Team.prototype.Pause = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).Pause();
    }

    Team.prototype.Resume = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).Resume();
    }

    /**/
    Team.prototype.FrameMove = function(frame, keyboardState, x, y)
    {
        if(frame % 100 == 0)
            this.SetCursor(((this.GetCursor() + 1) < nbPlayers_) ? (this.GetCursor()+1) : 0);

        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).HandleInput(keyboardState,frame);
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).OnFrameMove(frame,x,y);

        healthbar_.FrameMove(frame);
        energybar_.FrameMove(frame);
    }


    /* Shows details about the players on the team */
    Team.prototype.Render = function(frame,deltaX)
    {
        if(this.GetCursor() != this.GetLastCursor())
        {
            this.SetLastCursor(this.GetCursor());
            if(!!this.GetPlayer(this.GetCursor()))
            {
                spriteLookup_.Set(nameImg_, this.GetPlayer(this.GetCursor()).GetNameImageSrc());
                spriteLookup_.Set(portriatImg_, this.GetPlayer(this.GetCursor()).GetPortriatImageSrc());
            }
        }
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.GetPlayer(i).Render(frame,deltaX);

        energybar_.Render(frame);
        healthbar_.Render(frame);
    }

    return new Team(num);
}
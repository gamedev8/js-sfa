var CreateTeam = function(num)
{
    var players_ = [];
    var cursor_ = 0;
    var lastCursor_ = -1;
    var teamNum_ = num;
    var portriatImg_ = window.document.getElementById("portriatTeam" + num);
    var nameImg_ = window.document.getElementById("nameTeam" + num);
    var healthbar_ = CreateHealthBar("pnlHealthbarTeam" + num,num);
    var energybar_ = CreateEnergyBar("pnlEnergyBarTeam" + num,num);
    var comboText_ = null;
    var currentCombo_ = 0;
    var currentComboRefCount_ = 0;


    var Team = function(num)
    {
    }

    Team.prototype.GetGame = function() { return game_; }
    Team.prototype.GetPlayer = function(value) { return this.GetPlayers()[value]; }
    Team.prototype.GetPlayers = function() { return players_; }
    Team.prototype.SetPlayers = function(value) { players_ = value; }
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
    Team.prototype.GetCurrentCombo = function() { return currentCombo_; }
    Team.prototype.SetCurrentCombo = function(value) { currentCombo_ = value; }
    Team.prototype.IncCurrentCombo = function() { ++currentCombo_; }
    Team.prototype.GetCurrentComboRefCount = function() { return currentComboRefCount_; }
    Team.prototype.SetCurrentComboRefCount = function(value) { currentComboRefCount_ = value; }
    Team.prototype.IncCurrentComboRefCount = function() { ++currentComboRefCount_; }


    Team.prototype.Init = function()
    {
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
        this.SetComboText(this.GetGame().AddManagedText("pnlTeam" + this.GetTeamNum() + "ComboText",0,170,"font2"));
    }


    Team.prototype.WriteCombo = function(nbHits)
    {
        this.GetComboText().Change(nbHits + TEXT.HIT_COMBO,10,this.GetGame().GetCurrentFrame() + CONSTANTS.DEFAULT_COMBO_TEXT_LIFE);
    }


    Team.prototype.WriteText = function(text)
    {
        this.GetComboText().Change(text,10,this.GetGame().GetCurrentFrame() + CONSTANTS.DEFAULT_COMBO_TEXT_LIFE);
    }


    /*remove any DOM element that was added by this instance*/
    Team.prototype.Release = function()
    {
        this.GetPortriatImg().style.display = "none";
        this.GetNameImg().style.display = "none";
        this.GetComboText().HideNow();
        this.GetHealthbar().Release();
        this.GetEnergybar().Release();
        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).Release();
    }


    Team.prototype.Pause = function()
    {
        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).Pause();
    }

    Team.prototype.Resume = function()
    {
        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).Resume();
    }

    /**/
    Team.prototype.FrameMove = function(frame, keyboardState, x, y)
    {
        if(frame % 100 == 0)
            this.SetCursor(((this.GetCursor() + 1) < this.GetPlayers().length) ? (this.GetCursor()+1) : 0);

        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).HandleInput(keyboardState,frame);
        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).OnFrameMove(frame,x,y);

        this.GetHealthbar().FrameMove(frame);
        this.GetEnergybar().FrameMove(frame);
    }


    /* Shows details about the players on the team */
    Team.prototype.Render = function(frame,deltaX)
    {
        if(this.GetCursor() != this.GetLastCursor())
        {
            this.SetLastCursor(this.GetCursor());
            spriteLookup_.Set(this.GetNameImg(), this.GetPlayer(this.GetCursor()).GetNameImageSrc());
            spriteLookup_.Set(this.GetPortriatImg(), this.GetPlayer(this.GetCursor()).GetPortriatImageSrc());
        }
        for(var i = 0; i < this.GetPlayers().length; ++i)
            this.GetPlayer(i).Render(frame,deltaX);

        this.GetEnergybar().Render(frame);
        this.GetHealthbar().Render(frame);
    }

    return new Team(num);
}
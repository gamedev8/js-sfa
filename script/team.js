var Team = function(num)
{
    this.Players = [];

    this.Cursor = 0;
    this.TeamNum = num;
    this.PortriatImg = window.document.getElementById("portriatTeam" + num);
    this.NameImg = window.document.getElementById("nameTeam" + num);
    this.Healthbar = new HealthBar("pnlHealthbarTeam" + num,num);
    this.Energybar = new EnergyBar("pnlEnergyBarTeam" + num,num);
    this.ComboText = null;
    this.CurrentCombo = 0;
    this.CurrentComboRefCount = 0;
}

Team.prototype.Init = function()
{
    spriteLookup_.Set(this.NameImg, this.Players[this.Cursor].nameImageSrc_);
    //this.NameImg.src = this.Players[this.Cursor].nameImageSrc_;
    spriteLookup_.Set(this.PortriatImg, this.Players[this.Cursor].portriatImageSrc_);
    //this.PortriatImg.src = this.Players[this.Cursor].portriatImageSrc_;
    this.Cursor = (this.Cursor + 1 < this.Players.length) ? this.Cursor+1 : 0;
}

Team.prototype.GetGame = function()
{
    return game_;
}


Team.prototype.IncComboRefCount = function()
{
    ++this.CurrentComboRefCount;
}


Team.prototype.DecComboRefCount = function()
{
    this.CurrentComboRefCount = Math.max(this.CurrentComboRefCount - 1, 0);
    if(!this.CurrentComboRefCount)
    {
        this.CurrentCombo = 0;
    }
}

Team.prototype.IncCombo = function()
{
    ++this.CurrentCombo;
    if(this.CurrentCombo > 1)
        this.WriteCombo(this.CurrentCombo);
}


Team.prototype.InitText = function()
{
    this.ComboText = this.GetGame().AddManagedText("pnlTeam" + this.TeamNum + "ComboText",0,170,"font2");
}


Team.prototype.WriteCombo = function(nbHits)
{
    this.ComboText.Change(nbHits + TEXT.HIT_COMBO);
    this.ComboText.HideFrame = this.GetGame().GetCurrentFrame() + CONSTANTS.DEFAULT_COMBO_TEXT_LIFE;
    this.ComboText.ShowNow(10);
}


Team.prototype.WriteText = function(text)
{
    this.ComboText.Change(text);
    this.ComboText.HideFrame = this.GetGame().GetCurrentFrame() + CONSTANTS.DEFAULT_COMBO_TEXT_LIFE;
    this.ComboText.ShowNow(10);
}


/*remove any DOM element that was added by this instance*/
Team.prototype.Release = function()
{
    this.PortriatImg.style.display = "none";
    this.NameImg.style.display = "none";
    this.ComboText.HideNow();
    this.Healthbar.Release();
    this.Energybar.Release();
    for(var i = 0; i < this.Players.length; ++i)
        this.Players[i].Release();
}

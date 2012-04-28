var Team = function(num)
{
    this.Players = [];

    this.Cursor = 0;
    this.TeamNum = num;
    this.PortriatImg = window.document.getElementById("imgPortriatTeam" + num);
    this.NameImg = window.document.getElementById("imgNameTeam" + num);
    this.Healthbar = new HealthBar("pnlHealthbarTeam" + num,num);
    this.Energybar = new EnergyBar("pnlEnergyBarTeam" + num,num);
    this.ComboText = null;
    this.CurrentCombo = 0;
    this.CurrentComboRefCount = 0;
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


/*logic for the health bar*/

var HEALTHBAR = 
{
    LIFE_OFFSETX:-292
    ,DAMAGE_OFFSETX:-288
    ,ANIMATION_RATE:2
    ,MAX:288
};
var HealthBar = function(pnlHealthbarID,team)
{
    this.Max = HEALTHBAR.MAX;
    this.Amount = this.Max;
    this.CurrentDamage = 0;
    this.HealthbarElement = window.document.getElementById(pnlHealthbarID);
    this.DamageElement = null;
    this.LifeElement = null;
    this.Team = team;
    this.isInitialized_ = false;
}


/**/
HealthBar.prototype.Release = function()
{
    RemoveChildrenFromDOM(this.HealthbarElement);
}


HealthBar.prototype.Init = function()
{
    var img = window.document.createElement("div");
    img.className = "health-bar-item";
    spriteLookup_.Set(img,"images/misc/misc/health-bar.png");

    this.DamageElement = window.document.createElement("div");
    this.DamageElement.className = "damage";
    this.DamageElement.style.width = "0px";
    this.DamageElement.style.display = "none";
    this.LifeElement = window.document.createElement("div");
    this.LifeElement.className = "life";
    this.LifeElement.style.width = this.Amount + "px";

    this.HealthbarElement.appendChild(img);
    this.HealthbarElement.appendChild(this.LifeElement);
    this.HealthbarElement.appendChild(this.DamageElement);

    this.isInitialized_ = true;
}

HealthBar.prototype.Reset = function()
{
    this.CurrentDamage = 0;
    if(this.Team == 1)
        this.DamageElement.style.right = "";
    else if(this.Team == 2)
        this.DamageElement.style.left = "";

    this.Amount = this.Max;
    this.DamageElement.style.width = "0px";
    this.LifeElement.style.width = this.Amount + "px";
}

/*changes healthbar*/
HealthBar.prototype.Change = function(delta)
{
    /*return this.Amount;*/

    var newAmount = Math.min(Math.max(this.Amount - delta,0), this.Max);
    var damage = this.Amount - newAmount;
    this.LifeElement.style.width = newAmount + "px";
    if(!!damage)
    {
        this.CurrentDamage += damage;
        var offset = HEALTHBAR.LIFE_OFFSETX + newAmount;
        if(this.Team == 1)
            this.DamageElement.style.right = offset + "px";
        else if(this.Team == 2)
            this.DamageElement.style.left = offset + "px";
        this.DamageElement.style.width = this.CurrentDamage + "px";
        this.DamageElement.style.display = "";
    }

    this.Amount = newAmount;
    return this.Amount;
}

HealthBar.prototype.FrameMove = function(frame)
{
}

HealthBar.prototype.Render = function(frame)
{
    if(!!this.CurrentDamage && (frame % HEALTHBAR.ANIMATION_RATE == 0))
    {
        this.DamageElement.style.width = (this.CurrentDamage--) + "px";
    }
}
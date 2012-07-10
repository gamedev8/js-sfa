/*logic for the health bar*/

var HEALTHBAR = 
{
    LIFE_OFFSETX:-292
    ,DAMAGE_OFFSETX:-288
    ,ANIMATION_RATE:2
    ,MAX:288
};
var CreateHealthBar = function(pnlHealthbarID,team)
{
    var HealthBar = function()
    {
        this.max_ = HEALTHBAR.MAX;
        this.amount_ = this.max_;
        this.currentDamage_ = 0;
        this.healthbarElement_ = window.document.getElementById(pnlHealthbarID);
        this.damageElement_ = null;
        this.lifeElement_ = null;
        this.team_ = team;
        this.isInitialized_ = false;
    }

    HealthBar.prototype.GetMax = function() { return this.max_; }
    HealthBar.prototype.SetMax = function(value) { this.max_ = value; }
    HealthBar.prototype.GetAmount = function() { return this.amount_; }
    HealthBar.prototype.SetAmount = function(value) { this.amount_ = value; }
    HealthBar.prototype.GetCurrentDamage = function() { return this.currentDamage_; }
    HealthBar.prototype.SetCurrentDamage = function(value) { this.currentDamage_ = value; }
    HealthBar.prototype.GetHealthbarElement = function() { return this.healthbarElement_; }
    HealthBar.prototype.SetHealthbarElement = function(value) { this.healthbarElement_ = value; }
    HealthBar.prototype.GetDamageElement = function() { return this.damageElement_; }
    HealthBar.prototype.SetDamageElement = function(value) { this.damageElement_ = value; }
    HealthBar.prototype.GetLifeElement = function() { return this.lifeElement_; }
    HealthBar.prototype.SetLifeElement = function(value) { this.lifeElement_ = value; }
    HealthBar.prototype.GetTeam = function() { return this.team_; }
    HealthBar.prototype.SetTeam = function(value) { this.team_ = value; }
    HealthBar.prototype.IsInitialized = function() { return this.isInitialized_; }
    HealthBar.prototype.SetInitialized = function(value) { this.isInitialized_ = value; }



    /**/
    HealthBar.prototype.Release = function()
    {
        RemoveChildrenFromDOM(this.GetHealthbarElement(), true);
    }


    HealthBar.prototype.Init = function()
    {
        var img = window.document.createElement("div");
        img.className = "health-bar-item";
        spriteLookup_.Set(img,"images/misc/misc/health-bar.png");

        this.SetDamageElement(window.document.createElement("div"));
        this.GetDamageElement().className = "damage";
        this.GetDamageElement().style.width = "0px";
        this.GetDamageElement().style.display = "none";
        this.SetLifeElement(window.document.createElement("div"));
        this.GetLifeElement().className = "life";
        this.GetLifeElement().style.width = this.GetAmount() + "px";

        this.GetHealthbarElement().appendChild(img);
        this.GetHealthbarElement().appendChild(this.GetLifeElement());
        this.GetHealthbarElement().appendChild(this.GetDamageElement());

        this.isInitialized_ = true;
    }

    HealthBar.prototype.Reset = function()
    {
        this.SetCurrentDamage(0);
        if(this.GetTeam() == 1)
            this.GetDamageElement().style.right = "";
        else if(this.GetTeam() == 2)
            this.GetDamageElement().style.left = "";

        this.SetAmount(this.GetMax());
        this.GetDamageElement().style.width = "0px";
        this.GetLifeElement().style.width = this.GetAmount() + "px";
    }

    /*changes healthbar*/
    HealthBar.prototype.Change = function(delta)
    {
        /*return this.GetAmount();*/

        var newAmount = Math.min(Math.max(this.GetAmount() - delta,0), this.GetMax());
        var damage = this.GetAmount() - newAmount;
        this.GetLifeElement().style.width = newAmount + "px";
        if(!!damage)
        {
            this.SetCurrentDamage(this.GetCurrentDamage() + damage);
            var offset = HEALTHBAR.LIFE_OFFSETX + newAmount;
            if(this.GetTeam() == 1)
                this.GetDamageElement().style.right = offset + "px";
            else if(this.GetTeam() == 2)
                this.GetDamageElement().style.left = offset + "px";
            this.GetDamageElement().style.width = this.GetCurrentDamage() + "px";
            this.GetDamageElement().style.display = "";
        }

        this.SetAmount(newAmount);
        return this.GetAmount();
    }

    HealthBar.prototype.FrameMove = function(frame)
    {
    }

    HealthBar.prototype.Render = function(frame)
    {
        if(!!this.GetCurrentDamage() && (frame % HEALTHBAR.ANIMATION_RATE == 0))
        {
            this.SetCurrentDamage(this.GetCurrentDamage() - 1)
            this.GetDamageElement().style.width = this.GetCurrentDamage() + "px";
        }
    }
    return new HealthBar(pnlHealthbarID,team);
}
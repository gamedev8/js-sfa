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
        utils_.RemoveChildrenFromDOM(this.healthbarElement_, true);
    }


    HealthBar.prototype.Init = function()
    {
        var img = window.document.createElement("div");
        img.className = "health-bar-item";
        spriteLookup_.Set(img,"images/misc/misc/health-bar.png");

        this.SetDamageElement(window.document.createElement("div"));
        this.damageElement_.className = "damage";
        this.damageElement_.style.width = "0px";
        this.damageElement_.style.display = "none";
        this.SetLifeElement(window.document.createElement("div"));
        this.lifeElement_.className = "life";
        this.lifeElement_.style.width = this.amount_ + "px";

        this.healthbarElement_.appendChild(img);
        this.healthbarElement_.appendChild(this.lifeElement_);
        this.healthbarElement_.appendChild(this.damageElement_);

        /*
        imageLookup_.GetBgB64(img,"images/misc/bars-sprites.png");
        imageLookup_.GetBgB64(this.damageElement_,"images/misc/health-bar-damage.png");
        imageLookup_.GetBgB64(this.lifeElement_,"images/misc/health-bar-life.png");
        imageLookup_.GetBgB64(this.healthbarElement_,"images/misc/bars-sprites.png");
        */
        this.isInitialized_ = true;
    }

    HealthBar.prototype.Reset = function()
    {
        this.SetCurrentDamage(0);
        if(this.GetTeam() == 1)
            this.damageElement_.style.right = "";
        else if(this.GetTeam() == 2)
            this.damageElement_.style.left = "";

        this.SetAmount(this.max_);
        this.damageElement_.style.width = "0px";
        this.lifeElement_.style.width = this.amount_ + "px";
    }

    /*changes healthbar*/
    HealthBar.prototype.Change = function(delta)
    {
        /*return this.amount_;*/

        var newAmount = Math.min(Math.max(this.amount_ - delta,0), this.max_);
        var damage = this.amount_ - newAmount;
        this.lifeElement_.style.width = newAmount + "px";
        if(!!damage)
        {
            this.SetCurrentDamage(this.currentDamage_ + damage);
            var offset = HEALTHBAR.LIFE_OFFSETX + newAmount;
            if(this.GetTeam() == 1)
                this.damageElement_.style.right = offset + "px";
            else if(this.GetTeam() == 2)
                this.damageElement_.style.left = offset + "px";
            this.damageElement_.style.width = this.currentDamage_ + "px";
            this.damageElement_.style.display = "";
        }

        this.SetAmount(newAmount);
        return this.amount_;
    }

    HealthBar.prototype.FrameMove = function(frame)
    {
    }

    HealthBar.prototype.Render = function(frame)
    {
        if(!!this.currentDamage_ && (frame % HEALTHBAR.ANIMATION_RATE == 0))
        {
            this.SetCurrentDamage(this.currentDamage_ - 1)
            this.damageElement_.style.width = this.currentDamage_ + "px";
        }
    }
    return new HealthBar(pnlHealthbarID,team);
}
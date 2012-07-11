/*logic for the energy bar*/

var CreateEnergyBar = function(pnlID,team)
{
    var amount_ = 0;
    var team_ = team;
    var parentElement_ = window.document.getElementById(pnlID);
    var barElement_ = null;
    var level0Element_ = null;
    var level1Element_ = null;
    var level2Element_ = null;

    var key_ = ENERGYBAR.LEVEL0_KEY;
    var startFrame_ = 0;
    var animations_ = {};
    var frameCount_ = 0;
    var currentSrc_ = "";
    var lastSrc_ = "";
    var isInitialized_ = false;

    var EnergyBar = function(pnlID,team)
    {
    }

    EnergyBar.prototype.GetAmount = function() { return amount_; }
    EnergyBar.prototype.SetAmount = function(value) { amount_ = value; }
    EnergyBar.prototype.GetTeam = function() { return team_; }
    EnergyBar.prototype.SetTeam = function(value) { team_ = value; }
    EnergyBar.prototype.GetParentElement = function() { return parentElement_; }
    EnergyBar.prototype.SetParentElement = function(value) { parentElement_ = value; }
    EnergyBar.prototype.GetBarElement = function() { return barElement_; }
    EnergyBar.prototype.SetBarElement = function(value) { barElement_ = value; }
    EnergyBar.prototype.GetLevel0Element = function() { return level0Element_; }
    EnergyBar.prototype.SetLevel0Element = function(value) { level0Element_ = value; }
    EnergyBar.prototype.GetLevel1Element = function() { return level1Element_; }
    EnergyBar.prototype.SetLevel1Element = function(value) { level1Element_ = value; }
    EnergyBar.prototype.GetLevel2Element = function() { return level2Element_; }
    EnergyBar.prototype.SetLevel2Element = function(value) { level2Element_ = value; }
    EnergyBar.prototype.GetKey = function() { return key_; }
    EnergyBar.prototype.SetKey = function(value) { key_ = value; }
    EnergyBar.prototype.GetStartFrame = function() { return startFrame_; }
    EnergyBar.prototype.SetStartFrame = function(value) { startFrame_ = value; }
    EnergyBar.prototype.GetAnimation = function(value) { return animations_[value]; }
    EnergyBar.prototype.SetAnimation = function(index, value) { animations_[index] = value; }
    EnergyBar.prototype.GetAnimations = function() { return animations_; }
    EnergyBar.prototype.SetAnimations = function(value) { animations_ = value; }
    EnergyBar.prototype.GetFrameCount = function() { return frameCount_; }
    EnergyBar.prototype.SetFrameCount = function(value) { frameCount_ = value; }
    EnergyBar.prototype.GetCurrentSrc = function() { return currentSrc_; }
    EnergyBar.prototype.SetCurrentSrc = function(value) { currentSrc_ = value; }
    EnergyBar.prototype.GetLastSrc = function() { return lastSrc_; }
    EnergyBar.prototype.SetLastSrc = function(value) { lastSrc_ = value; }
    EnergyBar.prototype.IsInitialized = function() { return isInitialized_; }
    EnergyBar.prototype.SetInitialized = function(value) { isInitialized_ = value; }

    EnergyBar.prototype.GetNextFrameID = function()
    {
        this.SetFrameCount(this.GetFrameCount() + 1);
        return this.GetFrameCount();
    }
    EnergyBar.prototype.AddAnimation = function(key)
    {
        /*use default values for the Animation*/
        this.SetAnimation(key, CreateAnimation());
        return this.GetAnimation(key);
    }

    /**/
    EnergyBar.prototype.Release = function()
    {
        RemoveChildrenFromDOM(this.GetParentElement(), true);
    }

    /*initialized the energy bar*/
    EnergyBar.prototype.Init = function()
    {
        /***************************/
        /*initialize the animations*/
        /***************************/
        if(!this.IsInitialized())
        {
            var nbFrames = 8;

            var level0 = this.AddAnimation(ENERGYBAR.LEVEL0_KEY);
            level0.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-team-" + this.GetTeam() + ".png",nbFrames)

            var level0Maxed = this.AddAnimation(ENERGYBAR.LEVEL0MAXED_KEY);
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-1.png",nbFrames)
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-2.png",nbFrames)
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-4.png",nbFrames)
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level0Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl0-full-team-" + this.GetTeam() + "-2.png",nbFrames)

            var level1Maxed = this.AddAnimation(ENERGYBAR.LEVEL1MAXED_KEY);
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-1.png",nbFrames)
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-2.png",nbFrames)
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-4.png",nbFrames)
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level1Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl1-full-team-" + this.GetTeam() + "-2.png",nbFrames)

            var level2Maxed = this.AddAnimation(ENERGYBAR.LEVEL2MAXED_KEY);
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-1.png",nbFrames)
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-2.png",nbFrames)
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-4.png",nbFrames)
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-3.png",nbFrames)
            level2Maxed.AddFrame(this,null,"|images/misc/misc/energy-bar-lvl2-full-team-" + this.GetTeam() + "-2.png",nbFrames)
            this.SetInitialized(true);
        }
        /******************************/
        /*initialize the html elements*/
        /******************************/
        this.SetBarElement(window.document.createElement("div"));
        this.GetBarElement().className = "inner-energy-bar";

        this.SetLevel0Element(window.document.createElement("div"));
        this.GetLevel0Element().className = "level-0-energy";
        this.GetLevel0Element().style.width = "0px";

        this.SetLevel1Element(window.document.createElement("div"));
        this.GetLevel1Element().style.width = "0px";
        this.GetLevel1Element().className = "level-1-energy";

        this.SetLevel2Element(window.document.createElement("div"));
        this.GetLevel2Element().style.width = "0px";
        this.GetLevel2Element().className = "level-2-energy";

        this.GetParentElement().appendChild(this.GetBarElement());
        this.GetParentElement().appendChild(this.GetLevel0Element());
        this.GetParentElement().appendChild(this.GetLevel1Element());
        this.GetParentElement().appendChild(this.GetLevel2Element());
        /*set the initial values*/
        this.Change(0);
    }
    /*Resets the energy*/
    EnergyBar.prototype.Reset = function()
    {
        this.SetAmount(-this.GetAmount());
        this.Change(0);
    }
    /**/
    EnergyBar.prototype.SetCurrentAnimation = function(key,frame)
    {   
        this.SetKey(key)
        this.SetStartFrame(frame);
    }
    /*adds to the energy bar*/
    EnergyBar.prototype.Change = function(amount,frame)
    {
        amount = amount || 0;
        this.SetAmount(Math.min(Math.max(this.GetAmount() + amount, 0),ENERGYBAR.MAX_LEVEL2));
        this.HandleAmountChanged(frame || 0);
    }
    /*css helper*/
    EnergyBar.prototype.ShowLevelHelper = function(element,cssDisplay)
    {
        if(element.style.display != cssDisplay)
            element.style.display = cssDisplay;
    }
    /**/
    EnergyBar.prototype.ShowEnergyLevelBar = function(level)
    {
        switch(level)
        {
            case ENERGYBAR.LEVEL0: { this.ShowLevelHelper(this.GetLevel0Element(),"");     this.ShowLevelHelper(this.GetLevel1Element(),"none"); this.ShowLevelHelper(this.GetLevel2Element(),"none"); break;}
            case ENERGYBAR.LEVEL1: { this.ShowLevelHelper(this.GetLevel0Element(),"none"); this.ShowLevelHelper(this.GetLevel1Element(),"");     this.ShowLevelHelper(this.GetLevel2Element(),"none"); break;}
            case ENERGYBAR.LEVEL2: { this.ShowLevelHelper(this.GetLevel0Element(),"none"); this.ShowLevelHelper(this.GetLevel1Element(),"none"); this.ShowLevelHelper(this.GetLevel2Element(),"");     break;}
            default:               { this.ShowLevelHelper(this.GetLevel0Element(),"none"); this.ShowLevelHelper(this.GetLevel1Element(),"none"); this.ShowLevelHelper(this.GetLevel2Element(),"none"); break;}
        }
    }

    /**/
    EnergyBar.prototype.HandleAmountChanged = function(frame)
    {
        this.ShowEnergyLevelBar();
        if(this.GetAmount() < ENERGYBAR.MAX_LEVEL0)
        {
            this.ShowEnergyLevelBar(ENERGYBAR.LEVEL0);
            this.GetLevel0Element().style.width = this.GetAmount() + "px";
            this.SetCurrentAnimation(ENERGYBAR.LEVEL0_KEY,frame);
        }
        else if(this.GetAmount() < ENERGYBAR.MAX_LEVEL1)
        {
            this.ShowEnergyLevelBar(ENERGYBAR.LEVEL1);
            this.GetLevel1Element().style.width = (this.GetAmount() - ENERGYBAR.MAX_LEVEL0) + "px";
            this.SetCurrentAnimation(ENERGYBAR.LEVEL0MAXED_KEY,frame);
        }
        else if(this.GetAmount() < ENERGYBAR.MAX_LEVEL2)
        {
            this.ShowEnergyLevelBar(ENERGYBAR.LEVEL2);
            this.GetLevel2Element().style.width = (this.GetAmount() - ENERGYBAR.MAX_LEVEL1) + "px";
            this.SetCurrentAnimation(ENERGYBAR.LEVEL1MAXED_KEY,frame);
        }
        else if(this.GetAmount() == ENERGYBAR.MAX_LEVEL2)
        {
            this.ShowEnergyLevelBar(ENERGYBAR.LEVELMAXED);
            this.GetLevel2Element().style.width = "0px";
            this.SetCurrentAnimation(ENERGYBAR.LEVEL2MAXED_KEY,frame);
        }
    }
    /**/
    EnergyBar.prototype.FrameMove = function(frame)
    {
        var delta = frame - this.GetStartFrame();
        var currentFrame = this.GetAnimation(this.GetKey()).GetFrame(delta);
        /*these animations are continuous, so if we go past the end, reset*/
        if(!currentFrame)
        {
            this.SetStartFrame(frame);
            delta = frame - this.GetStartFrame();
            currentFrame = this.GetAnimation(this.GetKey()).GetFrame(delta);
        }
        if(!!currentFrame)
        {
            if(!!currentFrame.LeftSrc)
            {
                this.SetCurrentSrc(currentFrame.LeftSrc);
            }
        }
    }
    /**/
    EnergyBar.prototype.Render = function(frame)
    {
        if(this.GetLastSrc() != this.GetCurrentSrc())
        {
            var data = spriteLookup_.Get(this.GetCurrentSrc());
            if(!!data)
            {
                this.GetBarElement().style.backgroundPosition = data.Left + " " + data.Bottom;
                this.GetBarElement().style.height = data.Height;
                this.GetBarElement().style.width = data.Width;
            }
        }
    }
    return new EnergyBar(pnlID,team);
}
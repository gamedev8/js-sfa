
/**/
Player.prototype.InitSounds = function()
{
    /*soundManager_.Load("audio/" + this.name_.toLowerCase() + "/dead.zzz");*/
    utils_.AddScript(this.name_.toLowerCase() + ".js");
}

/**/
Player.prototype.QueueSwingSound = function(value)
{
    if(!!(value & SWINGSOUND.HP)) this.QueueSound("audio/misc/hp.zzz");
    else if(!!(value & SWINGSOUND.MP)) this.QueueSound("audio/misc/mp.zzz");
    else if(!!(value & SWINGSOUND.LP)) this.QueueSound("audio/misc/lp.zzz");
    else if(!!(value & SWINGSOUND.HK)) this.QueueSound("audio/misc/hk.zzz");
    else if(!!(value & SWINGSOUND.MK)) this.QueueSound("audio/misc/mk.zzz");
    else if(!!(value & SWINGSOUND.LK)) this.QueueSound("audio/misc/lk.zzz");
}


/**/
Player.prototype.QueueHitSound = function(value)
{
    if(!!(value & HITSOUND.HP)) this.QueueSound("audio/misc/hit-hp.zzz");
    else if(!!(value & HITSOUND.MP)) this.QueueSound("audio/misc/hit-mp.zzz");
    else if(!!(value & HITSOUND.LP)) this.QueueSound("audio/misc/hit-lp.zzz");
    else if(!!(value & HITSOUND.HP3)) this.QueueSound("audio/misc/hit-hp-3.zzz");
    else if(!!(value & HITSOUND.HK)) this.QueueSound("audio/misc/hit-hk.zzz");
    else if(!!(value & HITSOUND.MK)) this.QueueSound("audio/misc/hit-mk.zzz");
    else if(!!(value & HITSOUND.LK)) this.QueueSound("audio/misc/hit-lk.zzz");
}


/**/
Player.prototype.QueueBlockSound = function()
{
    this.QueueSound("audio/misc/block.zzz");
}


/**/
Player.prototype.QueueBlockProjectileSound = function()
{
    this.QueueSound("audio/misc/block-projectile.zzz");
}

/**/
Player.prototype.QueueGrappleSound = function()
{
    this.QueueSound("audio/misc/grapple.zzz");
}


Player.prototype.QueueSuperMoveChargeSound = function()
{
    this.QueueSound("audio/misc/super-charge.zzz");
}

/**/
Player.prototype.QueueSound = function(value,volume)
{
    //this.sounds_[this.sounds_.length] = {Value:value, Volume:volume||1};
    soundManager_.QueueSound(value,volume);
}


/**/
Player.prototype.InitSounds = function()
{
    soundManager_.Load("audio/" + this.name_ + "/dead.ogg");
}

/**/
Player.prototype.QueueSwingSound = function(value)
{
    if(!!(value & SWINGSOUND.HP)) this.QueueSound("audio/misc/hp.ogg");
    else if(!!(value & SWINGSOUND.MP)) this.QueueSound("audio/misc/mp.ogg");
    else if(!!(value & SWINGSOUND.LP)) this.QueueSound("audio/misc/lp.ogg");
    else if(!!(value & SWINGSOUND.HK)) this.QueueSound("audio/misc/hk.ogg");
    else if(!!(value & SWINGSOUND.MK)) this.QueueSound("audio/misc/mk.ogg");
    else if(!!(value & SWINGSOUND.LK)) this.QueueSound("audio/misc/lk.ogg");
}


/**/
Player.prototype.QueueHitSound = function(value)
{
    if(!!(value & HITSOUND.HP)) this.QueueSound("audio/misc/hit-hp.ogg");
    else if(!!(value & HITSOUND.MP)) this.QueueSound("audio/misc/hit-mp.ogg");
    else if(!!(value & HITSOUND.LP)) this.QueueSound("audio/misc/hit-lp.ogg");
    else if(!!(value & HITSOUND.HP3)) this.QueueSound("audio/misc/hit-hp-3.ogg");
    else if(!!(value & HITSOUND.HK)) this.QueueSound("audio/misc/hit-hk.ogg");
    else if(!!(value & HITSOUND.MK)) this.QueueSound("audio/misc/hit-mk.ogg");
    else if(!!(value & HITSOUND.LK)) this.QueueSound("audio/misc/hit-lk.ogg");
}


/**/
Player.prototype.QueueBlockSound = function()
{
    this.QueueSound("audio/misc/block.ogg");
}


/**/
Player.prototype.QueueBlockProjectileSound = function()
{
    this.QueueSound("audio/misc/block-projectile.ogg");
}

/**/
Player.prototype.QueueGrappleSound = function()
{
    this.QueueSound("audio/misc/grapple.ogg");
}


Player.prototype.QueueSuperMoveChargeSound = function()
{
    this.QueueSound("audio/misc/super-charge.ogg");
}

/**/
Player.prototype.QueueSound = function(value,volume)
{
    //this.sounds_[this.sounds_.length] = {Value:value, Volume:volume||1};
    soundManager_.QueueSound(value,volume);
}

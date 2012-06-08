
/**/
Player.prototype.InitSounds = function()
{
    soundManager_.Load("audio/" + this.name_ + "/dead.ogg");
}

/**/
Player.prototype.QueueSwingSound = function(value)
{
    if(!!(value & SWINGSOUND.HP)) this.sounds_[this.sounds_.length] = "audio/misc/hp.ogg";
    else if(!!(value & SWINGSOUND.MP)) this.sounds_[this.sounds_.length] = "audio/misc/mp.ogg";
    else if(!!(value & SWINGSOUND.LP)) this.sounds_[this.sounds_.length] = "audio/misc/lp.ogg";
    else if(!!(value & SWINGSOUND.HK)) this.sounds_[this.sounds_.length] = "audio/misc/hk.ogg";
    else if(!!(value & SWINGSOUND.MK)) this.sounds_[this.sounds_.length] = "audio/misc/mk.ogg";
    else if(!!(value & SWINGSOUND.LK)) this.sounds_[this.sounds_.length] = "audio/misc/lk.ogg";
}


/**/
Player.prototype.QueueHitSound = function(value)
{
    if(!!(value & HITSOUND.HP)) this.sounds_[this.sounds_.length] = "audio/misc/hit-hp.ogg";
    else if(!!(value & HITSOUND.MP)) this.sounds_[this.sounds_.length] = "audio/misc/hit-mp.ogg";
    else if(!!(value & HITSOUND.LP)) this.sounds_[this.sounds_.length] = "audio/misc/hit-lp.ogg";
    else if(!!(value & HITSOUND.HK)) this.sounds_[this.sounds_.length] = "audio/misc/hit-hk.ogg";
    else if(!!(value & HITSOUND.MK)) this.sounds_[this.sounds_.length] = "audio/misc/hit-mk.ogg";
    else if(!!(value & HITSOUND.LK)) this.sounds_[this.sounds_.length] = "audio/misc/hit-lk.ogg";
}


/**/
Player.prototype.QueueBlockSound = function()
{
    this.sounds_[this.sounds_.length] = "audio/misc/block.ogg";
}


/**/
Player.prototype.QueueBlockProjectileSound = function()
{
    this.sounds_[this.sounds_.length] = "audio/misc/block-projectile.ogg";
}

/**/
Player.prototype.QueueGrappleSound = function()
{
    this.sounds_[this.sounds_.length] = "audio/misc/grapple.ogg";
}


/**/
Player.prototype.QueueSound = function(value)
{
    this.sounds_[this.sounds_.length] = value;
}

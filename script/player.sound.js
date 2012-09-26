
/**/
Player.prototype.loadAssets = function()
{
    stuffLoader_.queue(this.Name.toLowerCase() + ".js",RESOURCE_TYPES.BASE64AUDIO);

    //stuffLoader_.queue("script/img/" + this.Folder.toLowerCase() + ".png.js",RESOURCE_TYPES.SCRIPT);

    
    stuffLoader_.queue("images/misc/" + this.Folder.toLowerCase() + "/sprites.png",RESOURCE_TYPES.IMAGE);
    stuffLoader_.queue("images/misc/" + this.Folder.toLowerCase() + "/misc-sprites.png",RESOURCE_TYPES.IMAGE);
    stuffLoader_.queue("images/misc/" + this.Folder.toLowerCase() + "/trail-sprites.png",RESOURCE_TYPES.IMAGE);
    if(this.Projectiles.length > 0)
        stuffLoader_.queue("images/misc/" + this.Folder.toLowerCase() + "/projectiles.png",RESOURCE_TYPES.IMAGE);

}

Player.prototype.queueDizzy = function()
{
    this.queueSound("audio/misc/dizzy.zzz");
}

Player.prototype.stopDizzyAudio = function()
{
    soundManager_.pause("audio/misc/dizzy.zzz");
}

/**/
Player.prototype.queueSwingSound = function(value)
{
    if(hasFlag(value,SWINGSOUND.HP)) this.queueSound("audio/misc/hp.zzz");
    else if(hasFlag(value,SWINGSOUND.MP)) this.queueSound("audio/misc/mp.zzz");
    else if(hasFlag(value,SWINGSOUND.LP)) this.queueSound("audio/misc/lp.zzz");
    else if(hasFlag(value,SWINGSOUND.HK)) this.queueSound("audio/misc/hk.zzz");
    else if(hasFlag(value,SWINGSOUND.MK)) this.queueSound("audio/misc/mk.zzz");
    else if(hasFlag(value,SWINGSOUND.LK)) this.queueSound("audio/misc/lk.zzz");
    else if(hasFlag(value,SWINGSOUND.SLIDE0)) this.queueSound("audio/misc/slide-0.zzz");
}


/**/
Player.prototype.queueHitSound = function(value)
{
    if(hasFlag(value,HITSOUND.HP)) this.queueSound("audio/misc/hit-hp.zzz");
    else if(hasFlag(value,HITSOUND.MP)) this.queueSound("audio/misc/hit-mp.zzz");
    else if(hasFlag(value,HITSOUND.LP)) this.queueSound("audio/misc/hit-lp.zzz");
    else if(hasFlag(value,HITSOUND.HP3)) this.queueSound("audio/misc/hit-hp-3.zzz");
    else if(hasFlag(value,HITSOUND.HK)) this.queueSound("audio/misc/hit-hk.zzz");
    else if(hasFlag(value,HITSOUND.MK)) this.queueSound("audio/misc/hit-mk.zzz");
    else if(hasFlag(value,HITSOUND.LK)) this.queueSound("audio/misc/hit-lk.zzz");
}


/**/
Player.prototype.queueBlockSound = function()
{
    this.queueSound("audio/misc/block.zzz");
}


/**/
Player.prototype.queueBlockProjectileSound = function()
{
    this.queueSound("audio/misc/block-projectile.zzz");
}

/**/
Player.prototype.queueGrappleSound = function()
{
    this.queueSound("audio/misc/grapple.zzz");
}


Player.prototype.queueSuperMoveChargeSound = function()
{
    this.queueSound("audio/misc/super-charge.zzz");
}

/**/
Player.prototype.queueSound = function(value,volume)
{
    //this.Sounds[this.Sounds.length] = {Value:value, Volume:volume||1};
    soundManager_.queueSound(value,volume);
}

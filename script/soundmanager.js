var SoundManager = function()
{
    this.Items = {};
    this.soundsToFadeOut_ = [];
}

/**/
SoundManager.prototype.Load = function(path,nbChannels,defaultVolume)
{
    if(!this.Items[path])
    {
        nbChannels = nbChannels || 1;
        try
        {
            this.Items[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
            for(var i = 0; i < nbChannels; ++i)
            {
                this.Items[path].Elements[i] = window.document.createElement("audio");
                this.Items[path].Elements[i].src = path;
                this.Items[path].Elements[i].load();
            }
        }
        catch(err)
        {
            this.Items[path] = null;
        }
    }
}

/**/
SoundManager.prototype.Unload = function(path)
{
    if(!!this.Items[path])
    {
        for(var i = 0; i < this.Items[path].Channels; ++i)
            this.Items[path].Elements[i].pause();
        this.Items[path] = null;
        //window.document.removeChild(this.Items[path]);
    }
}

/**/
SoundManager.prototype.SetVolume = function(path, value)
{
    if(!!this.Items[path])
    {
        for(var i = 0; i < this.Items[path].Channels; ++i)
            this.Items[path].Elements[i].volume = value;
    }
}

/**/
SoundManager.prototype.GetVolume = function(path)
{
    if(!!this.Items[path])
    {
        return this.Items[path].Elements[this.Items[path].CurrentChannel].volume;
    }
    return 0;
}

/**/
SoundManager.prototype.IsPlaying = function(path)
{
    if(!!this.Items[path])
    {
        return !this.Items[path].Elements[this.Items[path].CurrentChannel].paused;
    }
    return 0;
}


/**/
SoundManager.prototype.Restart = function(path,loops)
{
    if(!!this.Items[path])
    {
        if(!!this.Items[path].Elements[this.Items[path].CurrentChannel].duration)
            this.Items[path].Elements[this.Items[path].CurrentChannel].currentTime = 0;
        this.Items[path].Elements[this.Items[path].CurrentChannel].volume = this.Items[path].DefaultVolume;
    }
}

/**/
SoundManager.prototype.Play = function(path,loops)
{
    if(!!this.Items[path])
    {
        var el = this.Items[path].Elements[this.Items[path].CurrentChannel];
        if(!!loops)
            el.loop = true;
        el.volume = this.Items[path].DefaultVolume;
        el.play();
        if(++this.Items[path].CurrentChannel >= this.Items[path].Channels)
            this.Items[path].CurrentChannel = 0;

        if(!!el.error)
        {
            Alert(path);
            Alert(el.error);
            this.Items[path] = null;
            return;
        }
    }
}

/**/
SoundManager.prototype.PlayWithVolume = function(obj,loops)
{
    var path = obj.Value;
    if(!!this.Items[path])
    {
        var el = this.Items[path].Elements[this.Items[path].CurrentChannel];
        el.currentTime = 0;
        if(!!loops) el.loop = true;
        el.volume = obj.Volume;
        el.play();

        if(++this.Items[path].CurrentChannel >= this.Items[path].Channels)
            this.Items[path].CurrentChannel = 0;

        if(!!el.error)
        {
            Alert(path);
            Alert(el.error.code);
            this.Items[path] = null;
            return;
        }
    }
}


/**/
SoundManager.prototype.Replay = function(path)
{
    if(!!this.Items[path])
    {
        this.Items[path].Elements[this.Items[path].CurrentChannel].pause();
        this.Items[path].Elements[this.Items[path].CurrentChannel].currentTime = 0;
        this.Items[path].Elements[this.Items[path].CurrentChannel].volume = this.Items[path].DefaultVolume;
        this.Items[path].Elements[this.Items[path].CurrentChannel].play();
    }
}


/**/
SoundManager.prototype.Pause = function(path)
{
    if(!!this.Items[path])
    {
        this.Items[path].Elements[this.Items[path].CurrentChannel].pause();
    }
}

SoundManager.prototype.Preload = function()
{
    this.Load("audio/misc/lp.ogg",3);
    this.Load("audio/misc/mp.ogg",3);
    this.Load("audio/misc/hp.ogg",3);
    this.Load("audio/misc/lk.ogg",3);
    this.Load("audio/misc/mk.ogg",3);
    this.Load("audio/misc/hk.ogg",3);

    this.Load("audio/misc/block.ogg",3);
    this.Load("audio/misc/block-projectile.ogg",3);

    this.Load("audio/misc/grapple.ogg",3);

    this.Load("audio/misc/hit-lp.ogg",3);
    this.Load("audio/misc/hit-mp.ogg",3);
    this.Load("audio/misc/hit-hp.ogg",3);
    this.Load("audio/misc/hit-lk.ogg",3);
    this.Load("audio/misc/hit-mk.ogg",3);
    this.Load("audio/misc/hit-hk.ogg",3);
    this.Load("audio/misc/hit-hp-3.ogg",3);


    this.Load("audio/misc/p-select-move-0.ogg",3);
    this.Load("audio/misc/p-select-move-1.ogg",3);
    this.Load("audio/misc/p-select-choose-0.ogg",3);
    this.Load("audio/misc/p-select-choose-1.ogg",3);

    this.Load("audio/misc/super-charge.ogg",3);
}

SoundManager.prototype.FadeOut = function(value)
{
    if(!!this.Items[value])
    {
        this.soundsToFadeOut_[this.soundsToFadeOut_.length] = value;
    }
}

SoundManager.prototype.FrameMove = function(frame)
{
}

SoundManager.prototype.Render = function(frame)
{
    for(var i = 0; i < this.soundsToFadeOut_.length; ++i)
    {
        var el = this.Items[this.soundsToFadeOut_].Elements[this.Items[this.soundsToFadeOut_].CurrentChannel];
        var volume = el.volume;
        if(volume > 0)
            el.volume = Math.max(volume - 0.02, 0);
        else
            this.soundsToFadeOut_.splice(i,1);
    }
}

var soundManager_ = new SoundManager();
soundManager_.Preload();

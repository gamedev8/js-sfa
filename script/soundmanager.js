var SoundManager = function()
{
    this.items_ = {};
    this.fragment_ = {};
    this.sounds_ = [];
    this.extension_ = ".ogg";
}

SoundManager.prototype.GetPath = function(path)
{
    return path.replace(".zzz",this.extension_);
}

/**/
SoundManager.prototype.Load = function(path,nbChannels,defaultVolume)
{
    if(!this.items_[path])
    {
        nbChannels = nbChannels || 1;
        //nbChannels  = 1;
        try
        {
            this.items_[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
            for(var i = 0; i < nbChannels; ++i)
            {
                this.items_[path].Elements[i] = new Audio();
                this.items_[path].Elements[i].type = "audio/mpeg";
                this.items_[path].Elements[i].src = this.GetPath(path);
                this.items_[path].Elements[i].load();
            }
        }
        catch(err)
        {
            this.items_[path] = null;
        }
    }
}

/**/
SoundManager.prototype.Unload = function(path)
{
    if(!!this.items_[path])
    {
        for(var i = 0; i < this.items_[path].Channels; ++i)
            this.items_[path].Elements[i].pause();
        this.items_[path] = null;
        //window.document.removeChild(this.items_[path]);
    }
}

/**/
SoundManager.prototype.SetVolume = function(path, value)
{
    if(!!this.items_[path])
    {
        for(var i = 0; i < this.items_[path].Channels; ++i)
            this.items_[path].Elements[i].volume = value;
    }
}

/**/
SoundManager.prototype.GetVolume = function(path)
{
    if(!!this.items_[path])
    {
        return this.items_[path].Elements[this.items_[path].CurrentChannel].volume;
    }
    return 0;
}

/**/
SoundManager.prototype.IsPlaying = function(path)
{
    if(!!this.items_[path])
    {
        return !this.items_[path].Elements[this.items_[path].CurrentChannel].paused;
    }
    return 0;
}


/**/
SoundManager.prototype.Restart = function(path,loops)
{
    if(!!this.items_[path])
    {
        if(!!this.items_[path].Elements[this.items_[path].CurrentChannel].duration)
            this.items_[path].Elements[this.items_[path].CurrentChannel].currentTime = 0;
        this.items_[path].Elements[this.items_[path].CurrentChannel].volume = this.items_[path].DefaultVolume;
    }
}

/**/
SoundManager.prototype.Play = function(path,loops)
{
    if(!!this.items_[path])
    {
        /*go to the next channel*/
        if(++this.items_[path].CurrentChannel >= this.items_[path].Channels)
            this.items_[path].CurrentChannel = 0;

        /*start playing from the time = 0*/
        var el = this.items_[path].Elements[this.items_[path].CurrentChannel];
        if(!!el.duration) el.currentTime = 0;
        if(!!loops) el.loop = true;

        el.volume = this.items_[path].DefaultVolume;
        el.play();

        if(!!el.error)
        {
            Alert(path);
            Alert(el.error);
            this.items_[path] = null;
            return;
        }
    }
}

/**/
SoundManager.prototype.PlayWithVolume = function(obj,loops)
{
    var path = obj.Value;
    if(!!this.items_[path])
    {
        /*go to the next channel*/
        if(++this.items_[path].CurrentChannel >= this.items_[path].Channels)
            this.items_[path].CurrentChannel = 0;
        /*start playing from time 0*/
        var el = this.items_[path].Elements[this.items_[path].CurrentChannel];
        if(!!el.duration) el.currentTime = 0;
        el.loop = !!loops;

        el.volume = obj.Volume;
        el.play();

        if(!!el.error)
        {
            Alert(path);
            Alert(el.error.code);
            this.items_[path] = null;
            return;
        }
    }
}


/**/
SoundManager.prototype.Replay = function(path)
{
    if(!!this.items_[path])
    {
        this.items_[path].Elements[this.items_[path].CurrentChannel].pause();
        this.items_[path].Elements[this.items_[path].CurrentChannel].currentTime = 0;
        this.items_[path].Elements[this.items_[path].CurrentChannel].volume = this.items_[path].DefaultVolume;
        this.items_[path].Elements[this.items_[path].CurrentChannel].play();
    }
}


/**/
SoundManager.prototype.Pause = function(path)
{
    if(!!this.items_[path])
    {
        this.items_[path].Elements[this.items_[path].CurrentChannel].pause();
    }
}

/**/
SoundManager.prototype.Resume = function(path)
{
    if(!!this.items_[path])
    {
        var el = this.items_[path].Elements[this.items_[path].CurrentChannel];
        if(!!el.paused)
            el.play();
    }
}
/**/
SoundManager.prototype.PlayOrResume = function(path,loops)
{
    if(!!this.items_[path])
    {
        var el = this.items_[path].Elements[this.items_[path].CurrentChannel];
        if(!!el.paused)
        {
            el.loop = !!loops;
            el.play();
        }
        else
            this.Play(path,loops);
    }
}


SoundManager.prototype.Preload = function()
{
}


SoundManager.prototype.QueueSound = function(value,volume,delay)
{
    this.sounds_[this.sounds_.length] = {Value:value, Volume:volume||1, Frame:game_.GetCurrentFrame() + (delay||0)};
}


SoundManager.prototype.FrameMove = function(frame)
{
}

SoundManager.prototype.Render = function(frame)
{
    for(var i in this.sounds_)
    {
        if(frame >= this.sounds_[i].Frame)
            this.PlayWithVolume(this.sounds_.splice(i,1)[0]);
    }
}

var soundManager_ = new SoundManager();
soundManager_.Preload();

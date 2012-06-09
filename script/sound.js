var SoundManager = function()
{
    this.Items = {};
}

/**/
SoundManager.prototype.Load = function(path,nbChannels)
{
    if(!this.Items[path])
    {
        nbChannels = nbChannels || 1;
        try
        {
            this.Items[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[]};
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
SoundManager.prototype.Restart = function(path,loops)
{
    if(!!this.Items[path])
    {
        if(!!this.Items[path].Elements[this.Items[path].CurrentChannel].duration)
            this.Items[path].Elements[this.Items[path].CurrentChannel].currentTime = 0;
        this.Items[path].Elements[this.Items[path].CurrentChannel].volume = 1;
    }
}

/**/
SoundManager.prototype.Play = function(path,loops)
{
    if(!!this.Items[path])
    {
        if(!!loops)
            this.Items[path].Elements[this.Items[path].CurrentChannel].loop = true;
        this.Items[path].Elements[this.Items[path].CurrentChannel].play();
        if(++this.Items[path].CurrentChannel >= this.Items[path].Channels)
            this.Items[path].CurrentChannel = 0;
    }
}


/**/
SoundManager.prototype.Replay = function(path)
{
    if(!!this.Items[path])
    {
        this.Items[path].Elements[this.Items[path].CurrentChannel].pause();
        this.Items[path].Elements[this.Items[path].CurrentChannel].currentTime = 0;
        this.Items[path].Elements[this.Items[path].CurrentChannel].volume = 1;
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


    this.Load("audio/misc/p-select-move-0.ogg",3);
    this.Load("audio/misc/p-select-move-1.ogg",3);
    this.Load("audio/misc/p-select-choose-0.ogg",3);
    this.Load("audio/misc/p-select-choose-1.ogg",3);
}

var soundManager_ = new SoundManager();
soundManager_.Preload();

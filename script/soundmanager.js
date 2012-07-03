var CreateSoundManager = function()
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/
   var items_ = {};
   var fragment_ = {};
   var sounds_ = [];
   var extension_ = ".ogg";

    var GetPath_ = function(path)
    {
        return path.replace(".zzz",extension_);
    }


    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/

    var SoundManager = function()
    {
    }

    /*creates a DOM audio element and loads it*/
    SoundManager.prototype.Load = function(path,nbChannels,defaultVolume)
    {
        if(!items_[path])
        {
            nbChannels = nbChannels || 1;
            //nbChannels  = 1;
            try
            {
                items_[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
                for(var i = 0; i < nbChannels; ++i)
                {
                    items_[path].Elements[i] = new Audio();
                    items_[path].Elements[i].type = "audio/mpeg";
                    items_[path].Elements[i].src = GetPath_(path);
                    items_[path].Elements[i].load();
                }
            }
            catch(err)
            {
                items_[path] = null;
            }
        }
    }

    /**/
    SoundManager.prototype.Unload = function(path)
    {
        if(!!items_[path])
        {
            for(var i = 0; i < items_[path].Channels; ++i)
                items_[path].Elements[i].pause();
            items_[path] = null;
            //window.document.removeChild(items_[path]);
        }
    }

    /**/
    SoundManager.prototype.SetVolume = function(path, value)
    {
        if(!!items_[path])
        {
            for(var i = 0; i < items_[path].Channels; ++i)
                items_[path].Elements[i].volume = value;
        }
    }

    /**/
    SoundManager.prototype.GetVolume = function(path)
    {
        if(!!items_[path])
        {
            return items_[path].Elements[items_[path].CurrentChannel].volume;
        }
        return 0;
    }

    /**/
    SoundManager.prototype.IsPlaying = function(path)
    {
        if(!!items_[path])
        {
            return !items_[path].Elements[items_[path].CurrentChannel].paused;
        }
        return 0;
    }


    /**/
    SoundManager.prototype.Restart = function(path,loops)
    {
        if(!!items_[path])
        {
            if(!!items_[path].Elements[items_[path].CurrentChannel].duration)
                items_[path].Elements[items_[path].CurrentChannel].currentTime = 0;
            items_[path].Elements[items_[path].CurrentChannel].volume = items_[path].DefaultVolume;
        }
    }

    /**/
    SoundManager.prototype.Play = function(path,loops)
    {
        if(!!items_[path])
        {
            /*go to the next channel*/
            if(++items_[path].CurrentChannel >= items_[path].Channels)
                items_[path].CurrentChannel = 0;

            /*start playing from the time = 0*/
            var el = items_[path].Elements[items_[path].CurrentChannel];
            if(!!el.duration) el.currentTime = 0;
            if(!!loops) el.loop = true;

            el.volume = items_[path].DefaultVolume;
            el.play();

            if(!!el.error)
            {
                Alert(path);
                Alert(el.error);
                items_[path] = null;
                return;
            }
        }
    }

    /*sets the volume and plays the sound*/
    SoundManager.prototype.PlayWithVolume = function(obj,loops)
    {
        var path = obj.Value;
        if(!!items_[path])
        {
            /*go to the next channel*/
            if(++items_[path].CurrentChannel >= items_[path].Channels)
                items_[path].CurrentChannel = 0;
            /*start playing from time 0*/
            var el = items_[path].Elements[items_[path].CurrentChannel];
            if(!!el.duration) el.currentTime = 0;
            el.loop = !!loops;

            el.volume = obj.Volume;
            el.play();

            if(!!el.error)
            {
                Alert(path);
                Alert(el.error.code);
                items_[path] = null;
                return;
            }
        }
    }


    /**/
    SoundManager.prototype.Replay = function(path)
    {
        if(!!items_[path])
        {
            items_[path].Elements[items_[path].CurrentChannel].pause();
            items_[path].Elements[items_[path].CurrentChannel].currentTime = 0;
            items_[path].Elements[items_[path].CurrentChannel].volume = items_[path].DefaultVolume;
            items_[path].Elements[items_[path].CurrentChannel].play();
        }
    }


    /**/
    SoundManager.prototype.Pause = function(path)
    {
        if(!!items_[path])
        {
            items_[path].Elements[items_[path].CurrentChannel].pause();
        }
    }

    /**/
    SoundManager.prototype.Resume = function(path)
    {
        if(!!items_[path])
        {
            var el = items_[path].Elements[items_[path].CurrentChannel];
            if(!!el.paused)
                el.play();
        }
    }
    /**/
    SoundManager.prototype.PlayOrResume = function(path,loops)
    {
        if(!!items_[path])
        {
            var el = items_[path].Elements[items_[path].CurrentChannel];
            if(!!el.paused)
            {
                el.loop = !!loops;
                el.play();
            }
            else
                this.Play(path,loops);
        }
    }

    /**/
    SoundManager.prototype.Preload = function()
    {
    }


    /**/
    SoundManager.prototype.QueueSound = function(value,volume,delay)
    {
        sounds_[sounds_.length] = {Value:value, Volume:volume||1, Frame:game_.GetCurrentFrame() + (delay||0)};
    }


    /**/
    SoundManager.prototype.FrameMove = function(frame)
    {
    }

    /**/
    SoundManager.prototype.Render = function(frame)
    {
        for(var i in sounds_)
        {
            if(frame >= sounds_[i].Frame)
                this.PlayWithVolume(sounds_.splice(i,1)[0]);
        }
    }

    return new SoundManager();
}
var soundManager_ = CreateSoundManager();
soundManager_.Preload();

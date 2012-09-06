
var CreateSoundManager = function()
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/
   var items_ = {};
   var sounds_ = [];
   var extension_ = ".ogg";
   var id_ = 0;

    var GetPath_ = function(path)
    {
        return path.replace(".zzz",extension_);
    }

    var GetElement_ = function(id)
    {
        return window.document.getElementById(id);
    }

    var GetCurrentElement_ = function(path)
    {
        return GetElement_(items_[path].Elements[items_[path].CurrentChannel]);
    }


    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/

    var SoundManager = function()
    {
    }

    SoundManager.prototype.getExtension = function() { return extension_; }

    /*creates a DOM audio element and loads it with base64 data*/
    SoundManager.prototype.loadBase64 = function(path,nbChannels,defaultVolume,base64Data,loop)
    {
        if(!!__debugMode) return;
        if(!items_[path])
        {
            nbChannels = nbChannels || 1;
            //nbChannels  = 1;
            try
            {
                items_[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
                for(var i = 0; i < nbChannels; ++i)
                {
                    var el = new Audio();
                    var id = "sound" + id_;
                    items_[path].Elements[i] = id;
                    //el.type = "application/ogg";
                    el.src = base64Data;
                    el.load();
                    el.id = id;
                    el.loop = !!loop;
                    window.document.body.appendChild(el);

                    ++id_;
                }

            }
            catch(err)
            {
                items_[path] = null;
            }
        }

        return path;
    }
    /*creates a DOM audio element and loads it*/
    SoundManager.prototype.load = function(path,nbChannels,defaultVolume)
    {
        if(!!__debugMode) return;
        if(!items_[path])
        {
            nbChannels = nbChannels || 1;
            //nbChannels  = 1;
            try
            {
                items_[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
                for(var i = 0; i < nbChannels; ++i)
                {
                    var el = new Audio();
                    var id = "sound" + id_;
                    items_[path].Elements[i] = id;
                    //el.type = "application/ogg";
                    el.src = GetPath_(path) + "?qaz=" + id;
                    el.load();
                    el.id = id;
                    window.document.body.appendChild(el);

                    ++id_;
                }

            }
            catch(err)
            {
                items_[path] = null;
            }
        }
    }

    /**/
    SoundManager.prototype.unload = function(path)
    {
        if(!!items_[path])
        {
            for(var i = 0; i < items_[path].Channels; ++i)
            {
                var element = GetElement_(items_[path].Elements[i]);
                element.pause();
                window.document.body.removeChild(element);
            }
            items_[path] = null;
        }
    }

    /**/
    SoundManager.prototype.setVolume = function(path, value)
    {
        if(!!items_[path])
        {
            for(var i = 0; i < items_[path].Channels; ++i)
                GetElement_(items_[path].Elements[i]).volume = value;
        }
    }

    /**/
    SoundManager.prototype.getVolume = function(path)
    {
        if(!!items_[path])
        {
            return GetCurrentElement_(path).volume;
        }
        return 0;
    }

    /**/
    SoundManager.prototype.isPlaying = function(path)
    {
        if(!!items_[path])
        {
            return !GetCurrentElement_(path).paused;
        }
        return 0;
    }


    /**/
    SoundManager.prototype.restart = function(path,loops)
    {
        if(!!items_[path])
        {
            var el = GetCurrentElement_(path);
            if(!!el.duration)
                el.currentTime = 0;
            el.volume = items_[path].DefaultVolume;
        }
    }

    /**/
    SoundManager.prototype.play = function(path,loops)
    {
        if(!!items_[path])
        {
            /*go to the next channel*/
            if(++items_[path].CurrentChannel >= items_[path].Channels)
                items_[path].CurrentChannel = 0;

            /*start playing from the time = 0*/
            var el = GetCurrentElement_(path);
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
    SoundManager.prototype.playWithVolume = function(obj,loops)
    {
        var path = obj.Value;
        if(!!items_[path])
        {
            /*go to the next channel*/
            if(++items_[path].CurrentChannel >= items_[path].Channels)
                items_[path].CurrentChannel = 0;
            /*start playing from time 0*/
            var el = GetCurrentElement_(path);
            if(!!el.currentTime)
                el.currentTime = 0;

            //el.loop = !!loops;

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
    SoundManager.prototype.replay = function(path)
    {
        if(!!items_[path])
        {
            var el = GetCurrentElement_(path);
            el.pause();
            el.currentTime = 0;
            el.volume = items_[path].DefaultVolume;
            el.play();
        }
    }


    /**/
    SoundManager.prototype.pause = function(path)
    {
        if(!!items_[path])
        {
            var el = GetCurrentElement_(path);
            el.pause();
        }
    }

    /**/
    SoundManager.prototype.pauseAll = function()
    {
    }

    /**/
    SoundManager.prototype.resumeAll = function()
    {
    }

    /**/
    SoundManager.prototype.resume = function(path)
    {
        if(!!items_[path])
        {
            var el = GetCurrentElement_(path);
            if(!!el.paused)
                el.play();
        }
    }
    /**/
    SoundManager.prototype.playOrResume = function(path,loops)
    {
        if(!!items_[path])
        {
            var el = GetCurrentElement_(path);
            if(!!el.paused)
            {
                el.loop = !!loops;
                el.play();
            }
            else
                this.play(path,loops);
        }
    }

    /**/
    SoundManager.prototype.preload = function()
    {
    }


    /**/
    SoundManager.prototype.queueSound = function(value,volume,delay)
    {
        sounds_[sounds_.length] = {Value:value, Volume:volume||1, Frame:game_.getCurrentFrame() + (delay||0)};
    }


    /**/
    SoundManager.prototype.frameMove = function(frame)
    {
    }

    /**/
    SoundManager.prototype.render = function(frame)
    {
        for(var i in sounds_)
        {
            if(frame >= sounds_[i].Frame)
                this.playWithVolume(sounds_.splice(i,1)[0]);
        }
    }

    return new SoundManager();
}
var soundManager_ = CreateSoundManager();
soundManager_.preload();

var CreateSoundManager = function()
{
    /*******************************************************/
    /*******************  PRIVATE STATE    *****************/
    /*******************************************************/
    var elements_ = {};
    var maxChannels_ = 10;
    var sounds_ = [];
    var soundsToPlay_ = [];
    var extension_ = ".ogg";
    var parent_ = window.document.body;
    var id_ = 0;

    var GetPath_ = function(path)
    {
        return path.replace(".zzz",extension_);
    }


    var GetSound_ = function(path)
    {
        for(var i = 0; i < sounds_.length; ++i)
            if(sounds_[i].ID == path)
                return sounds_[i];

        return null;
    }

    var GetElement_ = function(path)
    {
        return window.document.getElementById(path);
    }

    var GetNextAvailableChannel_ = function()
    {
        for(var i = 0; i < maxChannels_; ++i)
            if(!!sounds_[i].Element.paused || sounds_[i].Element.currentTime > 999999)
                return sounds_[i];

        return null;
    }

    /*******************************************************/
    /*******************  PUBLIC  STATE    *****************/
    /*******************************************************/

    var SoundManager = function()
    {
        for(var i = 0; i < maxChannels_; ++i)
        {
            sounds_[i] = {ID:"", Element:new Audio()};
        }
    }

    /*creates a DOM audio element and loads it*/
    SoundManager.prototype.Load = function(path,nbChannels,defaultVolume)
    {
        if(!elements_[path])
        {
            try
            {
                var element = window.document.createElement("audio");
                element.id = path;
                element.preload = "auto";
                element.load();
                element.src = GetPath_(path);

                elements_[path] = element;
                parent_.appendChild(element);

            }
            catch(err)
            {
                elements_[path] = null;
            }
        }
    }

    /**/
    SoundManager.prototype.Unload = function(path)
    {
        var sound = GetSound_(path);
        if(!!sound)
        {
            sound.Element.pause();
        }
    }

    /**/
    SoundManager.prototype.IsPlaying = function(path)
    {
        var sound = GetSound_(path);
        if(!!sound && sound.Element.paused)
        {
            return true;
        }
        return false;
    }


    /**/
    SoundManager.prototype.Restart = function(path,loops)
    {
        var sound = GetSound_(path);
        if(!!sound)
        {
            sound.Element.pause();
            sound.Element.currentTime = 0;
            sound.Element.play();
        }
    }

    /**/
    SoundManager.prototype.Play = function(path,loops)
    {
        var channel = GetNextAvailableChannel_();
        if(!!channel)
        {
            var element = GetElement_(path);
            channel.ID = path;
            channel.Element.src = element.src;
            //channel.Element.load();
            channel.Element.loops = !!loops;
            if(!!channel.Element.currentTime)
                channel.Element.currentTime = 0;
            channel.Element.play();

            if(!!channel.Element.error)
            {
                Alert(path);
                Alert(channel.Element.error.code);
                return;
            }
        }
    }


    /**/
    SoundManager.prototype.Pause = function(path)
    {
        var sound = GetSound_(path);
        if(!!sound)
        {
            sound.Element.pause();
        }
    }

    /**/
    SoundManager.prototype.Resume = function(path)
    {
        var sound = GetSound_(path);
        if(!!sound && !!sound.Element.paused)
        {
            sound.Element.play();
        }
    }


    /**/
    SoundManager.prototype.Preload = function()
    {
    }


    /**/
    SoundManager.prototype.QueueSound = function(value,volume,delay)
    {
        soundsToPlay_[soundsToPlay_.length] = {Value:value, Volume:volume||1, Frame:game_.GetCurrentFrame() + (delay||0)};
    }


    /**/
    SoundManager.prototype.FrameMove = function(frame)
    {
    }

    /**/
    SoundManager.prototype.Render = function(frame)
    {
        for(var i in soundsToPlay_)
        {
            if(frame >= soundsToPlay_[i].Frame)
                this.Play(soundsToPlay_.splice(i,1)[0].Value);
        }
    }

    return new SoundManager();
}
var soundManager_ = CreateSoundManager();
soundManager_.Preload();

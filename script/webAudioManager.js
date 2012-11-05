//a wrapper over the webkit's Web Audio API

var CreateWebAudioManager = function()
{
    if(!window.webkitAudioContext)
        return null;

    //private
    var context_ = new webkitAudioContext();
    var items_ = {};
    var sounds_ = [];
    var extension_ = ".ogg";
    var id_ = 0;


    //public
    var WebAudioManager = function()
    {
        this.init();
    }

    WebAudioManager.prototype.init = function()
    {
        if(!!context_)
            return;

        var createWebAudioContext = (function(context)
        {
            return function()
            {
                context = new webkitAudioContext();
            }
        })(context_);

        if(!!window.attachEvent)
        {
            window.attachEvent('onload', createWebAudioContext, true);
        }
        else
        {
            window.addEventListener('load', createWebAudioContext, true);
        }
    }

    WebAudioManager.prototype.setBuffer = function(key)
    {
        return function(buffer)
        {
            items_[key].Elements[0] = buffer;
        }
    }

    WebAudioManager.prototype.loadBase64 = function(path,nbChannels,defaultVolume,base64Data)
    {
        if(!!__debugMode) return;
        if(!items_[path])
        {
            //nbChannels = nbChannels || 1;
            nbChannels  = 1;
            try
            {
                items_[path] = {Channels:nbChannels,CurrentChannel:0,Elements:[],DefaultVolume:defaultVolume || 1};
                for(var i = 0; i < nbChannels; ++i)
                {
                    var byteArray = Base64Binary.decodeArrayBuffer(base64Data.replace("data:audio/ogg;base64,",""));
                    context_.decodeAudioData(byteArray,this.setBuffer(path), function(err) { console.log(err); });
                }

            }
            catch(err)
            {
                items_[path] = null;
            }
        }

        return path;
    }

    //plays the sound
    WebAudioManager.prototype.play = function(path)
    {
        if(!!items_[path])
        {
            var buffer = items_[path].Elements[0];
            if(!!buffer)
            {
                var source = context_.createBufferSource();
                source.buffer = buffer;
                source.connect(context_.destination);
                source.noteOn(0);
            }
        }
    }


    //
    WebAudioManager.prototype.pause = function(path)
    {
        return;
        /*
        if(!!items_[path])
        {
            var source = items_[path].Source;
            var time = Date.now();

            if(!ignorePausedAt)
            {
                items_[path].PausedAt += time - items_[path].StartedAt;
                if(items_[path].PausedAt >= (items_[path].Source.buffer.duration * 1000))
                {
                    items_[path].PausedAt = 0;
                    items_[path].StartedAt = time;
                }
            }

            source.disconnect();
            source.noteOff(0);
        }
        */
    }


    return new WebAudioManager();
}

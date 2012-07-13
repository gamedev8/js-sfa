var CreateStuffLoader = function()
{
    var stuff_ = [];
    var nbElements_ = 0;
    var callback_ = null;
    var context_ = null;
    var reportProgressCallback_ = null;

    var Report_ = function()
    {
        if(!!reportProgressCallback_)
        {
            reportProgressCallback_.call(context_ || window, nbElements_);
        }
    }

    var OnDone_ = function(loader,index)
    {
        /*every time something finishes loading, this function will be executed*/
        if(!--nbElements_)
        {
            if(!!callback_)
            {
                callback_.call(context_ || window);
            }

            stuff_ = [];
            callback_ = null;
        }
        Report_();
    }


    var DownloadImage_ = function(index)
    {
        /*add image to the DOM, but off screen*/
        var img = new Image();
        img.onload = CreateOnDoneCallback_(index);
        img.src = stuff_[index].Src;
    }


    var DownloadBase64Audio_ = function(index)
    {
        utils_.AddBase64Audio(stuff_[index].Src, CreateOnDoneCallback_(index));
    }

    /***********************/
    var StuffLoader = function()
    {
    }


    StuffLoader.prototype.Queue = function(src,type)
    {
        if(!stuff_[src])
        {
            stuff_[src] = {Type:type,State:LOADING_STATES.WAITING,Src:src};
            ++nbElements_;
        }
    }

    StuffLoader.prototype.Start = function(reportProgressCallback, callback, context)
    {
        callback_ = callback;
        context_ = context;
        reportProgressCallback_ = reportProgressCallback;

        Report_();
        for(var i in stuff_)
        {
            switch (stuff_[i].Type)
            {
                case RESOURCE_TYPES.IMAGE: { DownloadImage_(i); break; }
                case RESOURCE_TYPES.BASE64AUDIO: { DownloadBase64Audio_(i); break; }
            };
        }
    }

    /***********************/
    var instance = new StuffLoader();

    var CreateOnDoneCallback_ = (function(thisRef)
    {
        return function(index)
        {
            return function()
            {
                OnDone_(thisRef,index);
            }
        }
    })(instance);

    return instance;
}
var stuffLoader_ = CreateStuffLoader();
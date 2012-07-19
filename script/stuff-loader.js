var CreateUtils = function()
{
    var loadingCount_ = 0;

    var Utils = function()
    {
    }

    Utils.prototype.AddBase64Audio = function(src, callbackFn, context)
    {
        src = "script/audio/" + src.replace(".js",soundManager_.GetExtension()) + ".js";
        return this.AddScript(src,callbackFn,context);
    }

    Utils.prototype.AddScript = function(src, callbackFn, context)
    {
        if(!window.document.getElementById(src))
        {
            var script = window.document.createElement("script");
            script.id = src;
            script.src = src;
            script.type = "text/javascript"
            script.onload = (function(startTime,onload,thisValue)
            {
                return function()
                {
                    var duration = Date.now() - startTime;
                    if(!!onload)
                    {
                        if(!!thisValue)
                            onload.call(thisValue);
                        else
                            onload();
                    }
                }
            })(Date.now(),callbackFn,context);
            window.document.body.appendChild(script);
            return true;
        }
        else
            return false;
    }

    Utils.prototype.RemoveFromDOM = function(element)
    {
        if(!!element)
        {
            while(element.children.length > 0)
                utils_.RemoveChildrenFromDOM(element.children[0]);
            var parentNode = element.parentNode;
            if(!!parentNode)
                parentNode.removeChild(element);
            else
                element = null;
        }
    }

    Utils.prototype.RemoveChildrenFromDOM = function(element,keepOrginalElement)
    {
        if(!!element)
        {
            if(!element.parentNode)
            {
                if(!keepOrginalElement)
                    element = null;
            }
            else if(element.children.length == 0)
            {
                if(!keepOrginalElement)
                    element.parentNode.removeChild(element);
            }
            else
            {
                while(element.children.length > 0)
                {
                    utils_.RemoveChildrenFromDOM(element.children[0]);
                }
            }
        }
    }

    return new Utils();
}
var utils_ = CreateUtils();



var CreateStuffLoader = function()
{
    var stuff_ = {};
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

            //callback_ = null;
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
        if(!utils_.AddBase64Audio(stuff_[index].Src, CreateOnDoneCallback_(index)))
            OnDone_();
    }


    var DownloadScript_ = function(index)
    {
        if(!utils_.AddScript(stuff_[index].Src, CreateOnDoneCallback_(index)))
            OnDone_();
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
        }
    }

    StuffLoader.prototype.Start = function(reportProgressCallback, callback, context)
    {
        for(var i in stuff_)
            ++nbElements_;
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
                case RESOURCE_TYPES.SCRIPT: { DownloadScript_(i); break; }
            };
        }
        stuff_ = {};
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
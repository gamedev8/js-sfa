var CreateAnimationTrail = function(animations,zIndex,delay)
{
    var AnimationTrail = function()
    {
        this.FollowElement = null;
        this.Trail = [];
        this.Delay = delay || 12;
        this.Enabled = false;
        this.StageDeltaX = 0;
        this.StageDeltaY = 0;
    }

    AnimationTrail.prototype.Id = 0;
    AnimationTrail.prototype.GetNextId = function() { return AnimationTrail.prototype.Id++; }

    AnimationTrail.prototype.Release = function()
    {
        for(var i = 0, length = this.Trail.length; i < length; ++i)
        {
            utils_.RemoveFromDOM(this.Trail[i].Element);
        }
    }

    AnimationTrail.prototype.Add = function(animation,followElement,folder)
    {
        var img = window.document.createElement("div");
        img.className = "player-sprite";

        var div = window.document.createElement("div");
        div.className = "player";
        /*this.B64Key = "images/misc/" + folder + "/trail-sprites.png";*/
        div.style.backgroundImage = "url(images/misc/" + folder + "/trail-sprites.png)";
        div.appendChild(img);

        this.Trail[this.Trail.length] = {StartFrame:0,Element:div,Animation:animation,FrameIndex:0,LastImageSrc:"",Coords:[],HasB64:false};

        this.FollowElement = this.FollowElement || followElement;
        if(!!this.FollowElement)
        {
            var container = this.FollowElement.parentNode;
            if(container.children.length == 0)
                container.appendChild(div);
            else
                container.insertBefore(div,container.children[0]);
        }
    }


    AnimationTrail.prototype.Disable = function()
    {
        if(!!this.Enabled)
        {
            this.StageDeltaX = 0;
            this.StageDeltaY = 0;

            this.Enabled = false;

            for(var i = 0, length = this.Trail.length; i < length; ++i)
            {
                //this.FollowElement.parentNode.removeChild(this.Trail[i].Element);
                this.Trail[i].Element.style.display = "none";
                this.Trail[i].FrameIndex = 0;
            }
        }
    }


    AnimationTrail.prototype.Enable = function(frame,followElement,direction)
    {
        if(!this.Enabled)
        {
            this.StageDeltaX = 0;
            this.StageDeltaY = 0;

            this.FollowElement = this.FollowElement || followElement;
            var container = this.FollowElement.parentNode;
            for(var i = 0, length = this.Trail.length; i < length; ++i)
            {
                /*
                if(!this.Trail[i].HasB64)
                {
                    imageLookup_.GetBgB64(this.Trail[i].Element, this.B64Key);
                    this.Trail[i].HasB64 = true;
                }
                */
                AutoApplyFlip(this.Trail[i].Element,direction == -1);
                this.Trail[i].Animation.ClearAllFrameUserData();
                /*
                if(container.children.length == 0)
                    container.appendChild(this.Trail[i].Element);
                else
                    container.insertBefore(this.Trail[i].Element,container.children[0]);
                */
                this.Trail[i].StartFrame = frame + (this.Delay * (i + 1));
                this.Trail[i].FrameIndex = 0;
            }
            this.Enabled = true;
        }
    }

    /*returns the current frame for the trail*/
    AnimationTrail.prototype.GetCurrentFrame = function(index)
    {
        return this.Trail[index].Animation.BaseAnimation.frames_[this.Trail[index].FrameIndex];
    }
    /**/
    AnimationTrail.prototype.FrameMove = function(frame,index,direction,stageX,stageY)
    {
        if(this.Enabled)
        {
            this.direction_ = direction;
            for(var i = 0, length = this.Trail.length; i < length; ++i)
            {
                this.Trail[i].Animation.AddUserDataToFrame(index, 
                    {
                        Frame:frame
                        ,Left:this.FollowElement.style.left
                        ,Right:this.FollowElement.style.right
                        /*Must remove the stage offsetY from the cordinate and apply it on the current frame.*/
                        /*Remember that recording it here will apply the coordinate after a certain number of frames,*/
                        /*and if the screen Y changes then it will mess up the trail - so we must remove the screen offset*/
                        ,Bottom:parseInt(this.FollowElement.style.bottom) - game_.match_.stage_.OffsetY + "px"
                        ,Top:this.FollowElement.style.top
                        ,DeltaX:0
                        ,DeltaY:0
                    });
            }
        }
    }


    /*The trail is applying the exact coords of the player, but the screen may move, which must be applied to all trail coords!*/
    AnimationTrail.prototype.ApplyStageOffset = function(stageDiffX,stageDiffY)
    {
        if(!!stageDiffX)
        {
            for(var trailIndex = 0, nbTrails = this.Trail.length; trailIndex < nbTrails; trailIndex++)
            {
                for(var frameIndex = 0, nbFrames = this.Trail[trailIndex].Animation.BaseAnimation.frames_.length; frameIndex < nbFrames; ++frameIndex)
                {
                    var frame = this.Trail[trailIndex].Animation.BaseAnimation.frames_[frameIndex];
                    var coords = frame.UserData;
                    for(var coordIndex = 0, nbCoords = coords.length; coordIndex < nbCoords; coordIndex++)
                    {
                        coords[coordIndex].DeltaX += stageDiffX;
                    }
                }
            }
        }

        if(!!stageDiffY)
        {
            for(var trailIndex = 0, nbTrails = this.Trail.length; trailIndex < nbTrails; trailIndex++)
            {
                for(var frameIndex = 0, nbFrames = this.Trail[trailIndex].Animation.BaseAnimation.frames_.length; frameIndex < nbFrames; ++frameIndex)
                {
                    var frame = this.Trail[trailIndex].Animation.BaseAnimation.frames_[frameIndex];
                    var coords = frame.UserData;
                    for(var coordIndex = 0, nbCoords = coords.length; coordIndex < nbCoords; coordIndex++)
                    {
                        //coords[coordIndex].DeltaY += -stageDiffY;
                    }
                }
            }
        }
    }

    /*returns the first coordinate at the requested frame index*/
    AnimationTrail.prototype.GetNextCoord = function(index)
    {
        /*get the current frame*/
        var retVal =  null;
        var frameToRender = this.GetCurrentFrame(index);
        if(!!frameToRender)
        {
            var tmp = frameToRender.UserData.splice(0,1);
            retVal = tmp[0];
        }
        return retVal;
    }

    AnimationTrail.prototype.Render = function(frame,stageDiffX,stageDiffY)
    {
        if(this.Enabled)
        {
            /*The trail is applying the exact coords of the player, but the screen may move, which must be applied to all trail coords!*/
            this.ApplyStageOffset(stageDiffX,stageDiffY);
            var stageOffsetY = game_.match_.stage_.OffsetY;
            
            for(var i = 0, length = this.Trail.length; i < length; i++)
            {
                if(frame > this.Trail[i].StartFrame)
                {
                    var coords = this.GetNextCoord(i);
                    if(!!coords)
                    {
                        this.Trail[i].Element.style.left = (!!coords.Left) ? coords.DeltaX + parseInt(coords.Left) + "px" : "";
                        this.Trail[i].Element.style.right = (!!coords.Right) ? coords.DeltaX + parseInt(coords.Right) + "px" : "";
                        this.Trail[i].Element.style.bottom = (!!coords.Bottom) ? coords.DeltaY + stageOffsetY + parseInt(coords.Bottom) + "px" : "";
                        this.Trail[i].Element.style.top = (!!coords.Top) ? coords.DeltaY + parseInt(coords.Top) + "px" : "";
                    }
                }
                if(frame > this.Trail[i].StartFrame)
                {
                    var currentItem = this.Trail[i];

                    if(!currentItem.Animation.HasUserData(currentItem.FrameIndex))
                        ++currentItem.FrameIndex;

                    var frameToRender = this.GetCurrentFrame(i);
                    if(!!frameToRender)
                    {
                        spriteLookup_.Set(currentItem.Element,frameToRender.RightSrc);
                    }
                }
            }
        }
    }

    return new AnimationTrail();
}
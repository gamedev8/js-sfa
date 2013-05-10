function GetDebugInstance(game)
{
    /*private member*/
    var game_ = game;

    var Debug = function()
    {

    }

    Debug.prototype.p1 = function()
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamA().getPlayer(0);
        return null;
    }

    Debug.prototype.p2 = function()
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamB().getPlayer(0);
        return null;
    }

    Debug.prototype.t1 = function(index)
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamA().getPlayer(index || 0);
        return null;
    }

    Debug.prototype.t2 = function(index)
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamB().getPlayer(index || 0);
        return null;
    }

    Debug.prototype.p1SendInput = function(input)
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamA().getPlayer(0).sendInput(input);
        return null;
    }

    Debug.prototype.p1ClearInput = function()
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamA().getPlayer(0).clearInput();
        return null;
    }

    Debug.prototype.p2SendInput = function(input)
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamB().getPlayer(0).sendInput(input);
        return null;
    }

    Debug.prototype.p2ClearInput = function()
    {
        if(!!game_.getMatch())
            return game_.getMatch().getTeamB().getPlayer(0).clearInput();
        return null;
    }

    Debug.prototype.p1TestAI = function()
    {
        if(!!game_.getMatch())
        {
            this.p1().enableAI();
        }
        return null;
    }

    Debug.prototype.p2TestAI = function()
    {
        if(!!game_.getMatch())
        {
            this.p2().enableAI();
        }
        return null;
    }
 
    Debug.prototype.p1AI = function(data)
    {
        if(!!game_.getMatch())
        {
            if(!this.p1().Ai.isRunning())
                this.p1().enableAI();
        }
        return !!data ? this.p1().Ai.getManaged().execute(data) : this.p1().Ai.getManaged();
    }
 
    Debug.prototype.p2AI = function(data)
    {
        if(!!game_.getMatch())
        {
            if(!this.p2().Ai.isRunning())
                this.p2().enableAI();
        }
        return !!data ? this.p2().Ai.getManaged().execute(data) : this.p2().Ai.getManaged();
    }

    Debug.prototype.t1TestAI = function(index)
    {
        if(!!game_.getMatch())
        {
            this.t1(index || 0).enableAI();
        }
        return null;
    }
 
    Debug.prototype.t2TestAI = function(index)
    {
        if(!!game_.getMatch())
        {
            this.t2(index || 0).enableAI();
        }
        return null;
    }

    Debug.prototype.p1ReverseFrame = function()
    {
        debug_.p1().reverseFrame();
        game_.pause();
    }

    Debug.prototype.p1StepFrame = function()
    {
        game_.pause();
    }

    var spnIndex = window.document.getElementById("spnIndex");
    var txtX = window.document.getElementById("txtX");
    var txtY = window.document.getElementById("txtY");
    var txtShadow = window.document.getElementById("txtShadow");
    var txtShadowOffsetX = window.document.getElementById("txtShadowOffsetX");
    var txtShadowOffsetY = window.document.getElementById("txtShadowOffsetY");


    Debug.prototype.readFrameData = function(frame)
    {
        //.ImageOffsetX,this.CurrentFrame.ImageOffsetY,this.CurrentFrame.ShadowImageSrc

        spnIndex.innerHTML = frame.Index;
        txtX.value = +frame.ImageOffsetX;
        txtY.value = +frame.ImageOffsetY;
        txtShadow.value = frame.ShadowImageSrc.match(/[\d]+/)[0];
        txtShadowOffsetX.value = +frame.ShadowOffset.X;
        txtShadowOffsetY.value = +frame.ShadowOffset.Y;
    }

    Debug.prototype.setFrameData = function()
    {
        var x = window.document.getElementById("txtX").value;
        var y = window.document.getElementById("txtY").value;
        var s = window.document.getElementById("txtShadow").value;
        var sx = window.document.getElementById("txtShadowOffsetX").value;
        var sy = window.document.getElementById("txtShadowOffsetY").value;

        if(!!+x || x === 0)
            debug_.p1().CurrentFrame.ImageOffsetX = +x;
        if(!!+y || y === 0)
            debug_.p1().CurrentFrame.ImageOffsetY = +y;
        if(!!s)
            debug_.p1().CurrentFrame.ShadowImageSrc = "images/misc/misc/shadow-" + s + ".png";
        if(!!+sx || sx === 0)
            debug_.p1().CurrentFrame.ShadowOffset.X = +sx;
        if(!!+sy || sy === 0)
            debug_.p1().CurrentFrame.ShadowOffset.Y = +sy;
   }

    Debug.prototype.keyCount = 1000;

    Debug.prototype.injectPlayer = function(playerId,team,isAlternate)
    {
        if(!game_.getMatch() || !game_.getMatch().getTeamA() || !game_.getMatch().getTeamB())
        {
            AlertError("You can only inject a player during a match.");
            return;
        }

        game_.pause();
        right = Debug.prototype.keyCount++;
        up = Debug.prototype.keyCount++;
        left = Debug.prototype.keyCount++;
        down = Debug.prototype.keyCount++;
        p1 = Debug.prototype.keyCount++;
        p2 = Debug.prototype.keyCount++;
        p3 = Debug.prototype.keyCount++;
        k1 = Debug.prototype.keyCount++;
        k2 = Debug.prototype.keyCount++;
        k3 = Debug.prototype.keyCount++;
        turn = Debug.prototype.keyCount++;
        var user = new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn);
        user.setChar(playerId,isAlternate,true);
        if(!!user.getName())
        {
            var name = user.getName();
            var folder = user.getFolder();
            stuffLoader_.queue("script/player-" + name + ".js",RESOURCE_TYPES.SCRIPT);
            stuffLoader_.queue("script/player-" + folder + "-spritedata.js",RESOURCE_TYPES.SCRIPT);

            var onDone = (function(user)
            {
                return function()
                {
                    var player = user.getPlayer();
                    if(team == 1)
                        game_.getMatch().getTeamA().addPlayer(player,true,true);
                    else
                        game_.getMatch().getTeamB().addPlayer(player,true,true);
                }
            })(user);
            stuffLoader_.start(null,onDone,null);
        }
        else
        {
            AlertError("user not found");

        }


    }

   /*implemented as a singleton*/
    var instance_ = instance_ || new Debug();
    return instance_;
}
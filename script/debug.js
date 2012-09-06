function GetDebugInstance(game)
{
    /*private member*/
    var game_ = game;

    var Debug = function()
    {

    }

    Debug.prototype.p1 = function()
    {
        if(!!game_.Match)
            return game_.Match.getTeamA().getPlayer(0);
        return null;
    }

    Debug.prototype.p2 = function()
    {
        if(!!game_.Match)
            return game_.Match.getTeamB().getPlayer(0);
        return null;
    }

    Debug.prototype.t1 = function(index)
    {
        if(!!game_.Match)
            return game_.Match.getTeamA().getPlayer(index || 0);
        return null;
    }

    Debug.prototype.t2 = function(index)
    {
        if(!!game_.Match)
            return game_.Match.getTeamB().getPlayer(index || 0);
        return null;
    }

    Debug.prototype.p1SendInput = function(input)
    {
        if(!!game_.Match)
            return game_.Match.getTeamA().getPlayer(0).sendInput(input);
        return null;
    }

    Debug.prototype.p1ClearInput = function()
    {
        if(!!game_.Match)
            return game_.Match.getTeamA().getPlayer(0).clearInput();
        return null;
    }

    Debug.prototype.p2SendInput = function(input)
    {
        if(!!game_.Match)
            return game_.Match.getTeamB().getPlayer(0).sendInput(input);
        return null;
    }

    Debug.prototype.p2ClearInput = function()
    {
        if(!!game_.Match)
            return game_.Match.getTeamB().getPlayer(0).clearInput();
        return null;
    }

    Debug.prototype.p1TestAI = function()
    {
        if(!!game_.Match)
        {
            this.p1().setAI(CreateSimpleRyuAI);
        }
        return null;
    }

    Debug.prototype.p2TestAI = function()
    {
        if(!!game_.Match)
        {
            this.p2().setAI(CreateSimpleRyuAI);
        }
        return null;
    }

 
    Debug.prototype.t1TestAI = function(index)
    {
        if(!!game_.Match)
        {
            this.t1(index || 0).setAI(CreateSimpleRyuAI);
        }
        return null;
    }
 
    Debug.prototype.t2TestAI = function(index)
    {
        if(!!game_.Match)
        {
            this.t2(index || 0).setAI(CreateSimpleRyuAI);
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

    var txtX = window.document.getElementById("txtX");
    var txtY = window.document.getElementById("txtY");


    Debug.prototype.setOffsets = function(x,y)
    {
        txtX.value = x;
        txtY.value = y;
    }

    Debug.prototype.p1SetFrameOffsets = function()
    {
        var x = window.document.getElementById("txtX").value;
        var y = window.document.getElementById("txtY").value;

        if(!!+x || x === 0)
        {
            debug_.p1().CurrentFrame.ImageOffsetX = x;
        }
        if(!!+y || y === 0)
        {
            debug_.p1().CurrentFrame.ImageOffsetY = y;
        }
    }

    Debug.prototype.keyCount = 1000;

    Debug.prototype.injectPlayer = function(playerId,team)
    {
        if(!game_.Match || !game_.Match.TeamA || !game_.Match.TeamB)
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
        user.setChar(playerId);
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
                        game_.Match.TeamA.addPlayer(player);
                    else
                        game_.Match.TeamB.addPlayer(player);
                    game_.Match.setupPlayer(player,team);
                    player.setAI(CreateSimpleRyuAI);
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
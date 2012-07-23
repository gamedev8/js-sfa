function GetDebugInstance(game)
{
    /*private member*/
    var game_ = game;

    var Debug = function()
    {

    }

    Debug.prototype.P1 = function()
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamA().GetPlayer(0);
        return null;
    }

    Debug.prototype.P2 = function()
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamB().GetPlayer(0);
        return null;
    }

    Debug.prototype.T1 = function(index)
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamA().GetPlayer(index || 0);
        return null;
    }

    Debug.prototype.T2 = function(index)
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamB().GetPlayer(index || 0);
        return null;
    }

    Debug.prototype.P1SendInput = function(input)
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamA().GetPlayer(0).SendInput(input);
        return null;
    }

    Debug.prototype.P1ClearInput = function()
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamA().GetPlayer(0).ClearInput();
        return null;
    }

    Debug.prototype.P2SendInput = function(input)
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamB().GetPlayer(0).SendInput(input);
        return null;
    }

    Debug.prototype.P2ClearInput = function()
    {
        if(!!game_.GetMatch())
            return game_.GetMatch().GetTeamB().GetPlayer(0).ClearInput();
        return null;
    }

    Debug.prototype.P1TestAI = function()
    {
        if(!!game_.GetMatch())
        {
            this.P1().SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

    Debug.prototype.P2TestAI = function()
    {
        if(!!game_.GetMatch())
        {
            this.P2().SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

 
    Debug.prototype.T1TestAI = function(index)
    {
        if(!!game_.GetMatch())
        {
            this.T1(index || 0).SetAI(CreateSimpleRyuAI);
        }
        return null;
    }
 
    Debug.prototype.T2TestAI = function(index)
    {
        if(!!game_.GetMatch())
        {
            this.T2(index || 0).SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

    Debug.prototype.KeyCount = 1000;

    Debug.prototype.InjectPlayer = function(playerId,team)
    {
        if(!game_.GetMatch() || !game_.GetMatch().TeamA || !game_.GetMatch().TeamB)
        {
            AlertError("You can only inject a player during a match.");
            return;
        }

        game_.Pause();
        right = Debug.prototype.KeyCount++;
        up = Debug.prototype.KeyCount++;
        left = Debug.prototype.KeyCount++;
        down = Debug.prototype.KeyCount++;
        p1 = Debug.prototype.KeyCount++;
        p2 = Debug.prototype.KeyCount++;
        p3 = Debug.prototype.KeyCount++;
        k1 = Debug.prototype.KeyCount++;
        k2 = Debug.prototype.KeyCount++;
        k3 = Debug.prototype.KeyCount++;
        turn = Debug.prototype.KeyCount++;
        var user = new User(right,up,left,down,p1,p2,p3,k1,k2,k3,turn);
        user.SetChar(playerId);
        if(!!user.GetName())
        {
            var name = user.GetName();
            var folder = user.GetFolder();
            stuffLoader_.Queue("script/player-" + name + ".js",RESOURCE_TYPES.SCRIPT);
            stuffLoader_.Queue("script/player-" + folder + "-spritedata.js",RESOURCE_TYPES.SCRIPT);

            var onDone = (function(user)
            {
                return function()
                {
                    var player = user.GetPlayer();
                    if(team == 1)
                        game_.GetMatch().TeamA.AddPlayer(player);
                    else
                        game_.GetMatch().TeamB.AddPlayer(player);
                    game_.GetMatch().SetupPlayer(player,team);
                    player.SetAI(CreateSimpleRyuAI);
                }
            })(user);
            stuffLoader_.Start(null,onDone,null);
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
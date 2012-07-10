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

   /*implemented as a singleton*/
    var instance_ = instance_ || new Debug();
    return instance_;
}
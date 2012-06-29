function GetDebugInstance(game)
{
    /*private member*/
    var game_ = game;

    var Debug = function()
    {

    }

    Debug.prototype.P1 = function()
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[0];
        return null;
    }

    Debug.prototype.P2 = function()
    {
        if(!!game_.match_)
            return game_.match_.teamB_.Players[0];
        return null;
    }

    Debug.prototype.T1 = function(index)
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[index || 0];
        return null;
    }

    Debug.prototype.T2 = function(index)
    {
        if(!!game_.match_)
            return game_.match_.teamB_.Players[index || 0];
        return null;
    }

    Debug.prototype.P1SendInput = function(input)
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[0].SendInput(input);
        return null;
    }

    Debug.prototype.P1ClearInput = function()
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[0].ClearInput();
        return null;
    }

    Debug.prototype.P2SendInput = function(input)
    {
        if(!!game_.match_)
            return game_.match_.teamB_.Players[0].SendInput(input);
        return null;
    }

    Debug.prototype.P2ClearInput = function()
    {
        if(!!game_.match_)
            return game_.match_.teamB_.Players[0].ClearInput();
        return null;
    }

    Debug.prototype.P1TestAI = function()
    {
        if(!!game_.match_)
        {
            this.P1().SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

    Debug.prototype.P2TestAI = function()
    {
        if(!!game_.match_)
        {
            this.P2().SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

 
    Debug.prototype.T1TestAI = function(index)
    {
        if(!!game_.match_)
        {
            this.T1(index || 0).SetAI(CreateSimpleRyuAI);
        }
        return null;
    }
 
    Debug.prototype.T2TestAI = function(index)
    {
        if(!!game_.match_)
        {
            this.T2(index || 0).SetAI(CreateSimpleRyuAI);
        }
        return null;
    }

   /*implemented as a singleton*/
    var instance_ = instance_ || new Debug();
    return instance_;
}
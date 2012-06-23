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

    Debug.prototype.P1SendInput = function(input)
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[0].SendInput(input);
        return null;
    }

    Debug.prototype.P1ClearInput = function()
    {
        if(!!game_.match_)
            return game_.match_.teamA_.Players[0].ClearKeys();
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
            return game_.match_.teamB_.Players[0].ClearKeys();
        return null;
    }

    Debug.prototype.P1TestAI = function()
    {
        if(!!game_.match_)
        {
            this.P1SendInput([
            {IsDown:true,Button:8}
            ,{IsDown:true,Button:1}
            ,{IsDown:false,Button:8}
            ,{IsDown:true,Button:64}
            ]);
        }
        return null;
    }

    Debug.prototype.P2TestAI = function()
    {
        if(!!game_.match_)
        {
            this.P2SendInput([
            {IsDown:true,Button:8}
            ,{IsDown:true,Button:1}
            ,{IsDown:false,Button:8}
            ,{IsDown:true,Button:64}
            ]);
        }
        return null;
    }

    /*implemented as a singleton*/
    var instance_ = instance_ || new Debug();
    return instance_;
}
var CreateAIProxy = function(player,createAiFn)
{
    var player_ = player;
    var managed_ = !!createAiFn ? createAiFn(player) : null;


    var AIProxy = function()
    {
    }

    AIProxy.prototype.setAI = function(createAiFn)
    {
        managed_ = !!createAiFn ? createAiFn(player_) : null;
    }

    AIProxy.prototype.isRunning = function()
    {
        return !!managed_;
    }


    AIProxy.prototype.frameMove = function(frame)
    {
        managed_.frameMove(frame);
    }

    return new AIProxy();
}
var CreateAIProxy = function(player,createAiFn)
{
    var player_ = player;
    var managed_ = !!createAiFn ? createAiFn(player) : null;


    var AIProxy = function()
    {
    }

    AIProxy.prototype.SetAI = function(createAiFn)
    {
        managed_ = !!createAiFn ? createAiFn(player_) : null;
    }

    AIProxy.prototype.IsRunning = function()
    {
        return !!managed_;
    }


    AIProxy.prototype.FrameMove = function(frame)
    {
        managed_.FrameMove(frame);
    }

    return new AIProxy();
}
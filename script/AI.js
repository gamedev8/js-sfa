var AIProxy = function(player,ai)
{
    this.Player = player;
    this.Managed = ai;
}


AIProxy.prototype.FrameMove = function(frame)
{
    this.Managed.FrameMove(frame, this.Player);
}
var CreateAIProxy = function(player,createAiFn)
{
    var player_ = player;
    var managed_ = !!createAiFn ? createAiFn(player) : null;


    var AIProxy = function()
    {
    }

    AIProxy.prototype.reset = function() { managed_.reset(); }
    AIProxy.prototype.setAI = function(createAiFn) { managed_ = !!createAiFn ? createAiFn(player_) : null; }
    AIProxy.prototype.isRunning = function() { return !!managed_; }
    AIProxy.prototype.onEnemyStartAttack = function(frame, who) { managed_.onEnemyStartAttack(frame,who); }
    AIProxy.prototype.onEnemyContinueAttack = function(frame, who) { managed_.onEnemyContinueAttack(frame,who); }
    AIProxy.prototype.onEnemyEndAttack = function(frame, who) { managed_.onEnemyEndAttack(frame,who); }
    AIProxy.prototype.onEnemyVulnerable = function(frame, who) { managed_.onEnemyVulnerable(frame,who); }
    AIProxy.prototype.onEnemyDizzy = function(frame, who) { managed_.onEnemyDizzy(frame,who); }
    AIProxy.prototype.onProjectileMoved = function(frame, id,x,y) { managed_.onProjectileMoved(frame,id,x,y); }
    AIProxy.prototype.onProjectileGone = function(frame,id) { managed_.onProjectileGone(id); }
    AIProxy.prototype.onTakeHit = function(frame,id) { managed_.onTakeHit(id); }
    AIProxy.prototype.onBlocked = function() { managed_.onBlocked(); }
    AIProxy.prototype.onStartAttack = function(frame,id) { managed_.onStartAttack(id); }
    AIProxy.prototype.frameMove = function(frame) { managed_.frameMove(frame); }
    AIProxy.prototype.go = function(name) { managed_[name].apply(managed_,arguments); }
    AIProxy.prototype.test = function() { managed_.test.apply(managed_,arguments); }

    return new AIProxy();
}
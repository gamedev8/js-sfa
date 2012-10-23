Player.prototype.onEnemyProjectileMoved = function(frame,id,x,y,projectile) { if(this.Ai.isRunning()) { this.Ai.onProjectileMoved(frame,id,x,y); } }
Player.prototype.onEnemyProjectileGone = function(frame,id) { if(this.Ai.isRunning()) { this.Ai.onProjectileGone(frame,id); } }
Player.prototype.onEnemyStartAttack = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyStartAttack(frame, who); } }
Player.prototype.onEnemyContinueAttack = function(frame, who,hitPoints) { if(this.Ai.isRunning()) { this.Ai.onEnemyContinueAttack(frame, who, hitPoints); } }
Player.prototype.onEnemyEndAttack = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyEndAttack(frame, who); } }
Player.prototype.onEnemyVulerable = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyVulnerable(frame, who); } }

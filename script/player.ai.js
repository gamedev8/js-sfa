Player.prototype.onEnemyAttackPending = function(frame,x,y,player,isSuperMove) { if(this.Ai.isRunning()) { this.Ai.onEnemyAttackPending(frame,x,y,player,isSuperMove); } }
Player.prototype.onEnemyProjectilePending = function(frame,x,y,player,isSuperMove) { if(this.Ai.isRunning()) { this.Ai.onEnemyProjectilePending(frame,x,y,player,isSuperMove); } }
Player.prototype.onEnemyProjectileMoved = function(frame,id,x,y,projectile,isSuperMove) { if(this.Ai.isRunning()) { this.Ai.onEnemyProjectileMoved(frame,id,x,y,projectile,isSuperMove); } }
Player.prototype.onEnemyProjectileGone = function(frame,id) { if(this.Ai.isRunning()) { this.Ai.onEnemyProjectileGone(frame,id); } }
Player.prototype.onEnemyStartAttack = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyStartAttack(frame, who); } }
Player.prototype.onEnemyContinueAttack = function(frame, who,hitPoints) { if(this.Ai.isRunning()) { this.Ai.onEnemyContinueAttack(frame, who, hitPoints); } }
Player.prototype.onEnemyEndAttack = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyEndAttack(frame, who); } }
Player.prototype.onEnemyVulerable = function(frame, who, x, y) { if(this.Ai.isRunning()) { this.Ai.onEnemyVulnerable(frame, who, x, y); } }
Player.prototype.onEnemyFloating = function(frame, who, x, y) { if(this.Ai.isRunning()) { this.Ai.onEnemyFloating(frame, who, x, y); } }
Player.prototype.onEnemyDizzy = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onEnemyDizzy(frame, who); } }
Player.prototype.onStartAttack = function() { if(this.Ai.isRunning()) { this.Ai.onStartAttack(); } }
Player.prototype.onTakeHit = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onTakeHit(frame, who); } }
Player.prototype.onBlocked = function(frame, who) { if(this.Ai.isRunning()) { this.Ai.onBlocked(frame, who); } }
Player.prototype.onAnimationChanged = function(name) { if(this.Ai.isRunning()) { this.Ai.onAnimationChanged(name); } }
Player.prototype.onAttackStateChanged = function(who,result)
{
	if(this.Ai.isRunning())
	{
		this.Ai.onAttackStateChanged(who,result);
		if(result == ATTACK_STATE.HIT)
			this.SentHitAttackStateChange = true;
	}
}

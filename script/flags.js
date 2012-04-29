var BUTTONS = 
{
    FORWARD:1
    ,BACK:2
    ,JUMP:4
    ,CROUCH:8
    ,LIGHT_PUNCH:16
    ,MEDIUM_PUNCH:32
    ,HARD_PUNCH:64
    ,LIGHT_KICK:128
    ,MEDIUM_KICK:256
    ,HARD_KICK:512
}

var MAX = 
{
    KEY_SEQUENCE:20
    ,FRAME:999
    ,MAX_IMAGES:10
};
var DEAD_TIME = 1000;

var MISC_FLAGS = 
{
    NONE:0
}

var SPAWN_FLAGS = 
{
    SPAWN_SMALLDIRT:1 << 0
    ,SPAWN_BIGDIRT:1 << 1
}

var PLAYER_FLAGS = 
{
    MOBILE:1 << 0
    ,IGNORE_COLLISIONS:1 << 1
    ,ALLOW_CHANGE_DIRECTION:1 << 2
    ,HOLD_ZINDEX:1 << 3
    ,MUST_HOLD_KEY:1 << 4
    ,HOLD_FRAME:1 << 5
    ,INVULNERABLE:1 << 6
    ,USE_ATTACK_DIRECTION:1 << 7
    ,BLOCKING:1 << 8
    ,MOVE_TO_BACK:1 << 9
    ,MOVE_TO_FRONT:1 << 10
    ,LOOP_IF_KEYDOWN:1 << 11
    ,SMALLER_AABB:1 << 12
    ,DEAD:1 << 13
    ,IGNORE_PROJECTILES:1 << 14
}


var POSE_FLAGS = 
{
    ANY:1 << 0
    ,WALKING_FORWARD:1 << 1
    ,WALKING_BACKWARD:1 << 2
    ,AIRBORNE:1 << 3
    ,AIRBORNE_FB:1 << 4
    ,CROUCHING:1 << 5
    ,STANDING:1 << 6
    ,ALLOW_BLOCK:1 << 7
    ,ALLOW_AIR_BLOCK:1 << 8
}


var COMBAT_FLAGS = 
{
    PROJECTILE_ACTIVE:1 << 0
    ,CAN_BE_BLOCKED:1 << 1
    ,CAN_BE_AIR_BLOCKED:1 << 2
    ,ATTACK:1 << 3
    ,SPAWN_PROJECTILE:1 << 4
}


var BEHAVIOR_FLAGS = 
{
    THROW:1 << 0
};
var ATTACK_FLAGS = 
{
     FRONT:1 << 0
    ,REAR:1 << 1
    ,LIGHT:1 << 2
    ,MEDIUM:1 << 3
    ,HARD:1 << 4
    ,SPIT1:1 << 5
    ,SPIT2:1 << 6
    ,DIRT:1 << 7
    ,SPECIAL:1 << 8
    ,SPECIAL1:1 << 9
    ,SPECIAL2:1 << 10
    ,SPECIAL3:1 << 11
    ,SUPER:1 << 12
    ,BLOCK:1 << 13
    ,TRIP:1 << 14
    ,FLOOR_AIRBORNE:1 << 15
    ,KNOCKDOWN:1 << 16
    ,HITS_LOW:1 << 17
    ,HITS_HIGH:1 << 18
    ,THROW_START:1 << 19
    ,THROW_EJECT:1 << 20
    ,PROJECTILE:1 << 21
    ,NO_HIT_DELAY:1 << 22
    ,FLOOR_AIRBORNE_HARD:1 << 23
    ,CAN_AIR_JUGGLE:1 << 24
};
var MOVE_FLAGS = 
{
    NONE:1 << 0
    ,MOVE_WITH_PLAYER:1 << 1
};
var HIT_FLAGS = 
{
    FAR:1 << 0
    ,MEDIUM:1 << 1
    ,NEAR:1 << 2
    ,TRIP:1 << 3
}
var JUGGLE_FLAGS
{
    
}

var PRIORITYFLAGS = 
{
     LOWEST:0
    ,HIGHEST:1 << 30
    ,JUMP_ATTACKS:1 << 1
}

var OVERRIDE_FLAGS = 
{
     NULL:1 << 0
    ,NONE:1 << 1
    ,ALL:1 << 30
    ,THROW:1 << 29
    ,PROJECTILE:1 << 28
    ,HPROJECTILE:1 << 27
    ,P1:1 << 1,P2:1 << 2,P3:1 << 3
    ,K1:1 << 5,K2:1 << 6,K3:1 << 7
    ,CROUCHING:1 << 8
    ,STANDING:1 << 9
    ,AIRBORNE:1 << 10
};

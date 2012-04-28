var PLAYER_FLAGS = 
{
    MOBILE:1 << 0
    ,IGNORE_COLLISIONS:1 << 1
}


var POSE_FLAGS = 
{
    WALKING_FORWARD:1 << 0
    ,WALKING_BACKWARD:1 << 1
    ,AIRBORNE:1 << 2
    ,AIRBORNE_FB:1 << 3
    ,CROUCHING:1 << 4
    ,STANDING:1 << 5
}


var COMBAT_FLAGS = 
{
    PROJECTILE_ACTIVE:1 << 0
    ,CAN_BE_BLOCKED:1 << 1
    ,CAN_BE_AIR_BLOCKED:1 << 2
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

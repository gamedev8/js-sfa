var Flags = function(owner)
{
    this.Value = 0;
    this.IsPlayer = false;
    this.Owner = owner || null;
}

Flags.prototype.Clear = function() { this.Set(0); }
Flags.prototype.Set = function(value) { this.Value = value || MISC_FLAGS.NONE; return this.Value; }
Flags.prototype.Get = function()      { return this.Value; }
Flags.prototype.Has = function(value) { return !!(this.Value & value); }
Flags.prototype.Add = function(value)
{
    if(this.IsPlayer && !!this.Owner)
    {
        if(!!(value & PLAYER_FLAGS.MOBILE) && !this.Has(PLAYER_FLAGS.MOBILE))
            this.Owner.ResetCombo();
    }
    return this.Value |= (value || MISC_FLAGS.NONE);
}
Flags.prototype.Remove = function(value) { return this.Value = (this.Value | value) ^ value; }

var PlayerFlags = function(owner)
{
    this.Owner = owner;
    this.Player = new Flags(owner);
    this.Player.IsPlayer = true;
    this.Pose = new Flags();
    this.Combat = new Flags();
    this.Spawn = new Flags();
}

var FrameFlags = function()
{
    this.Player = 0;
    this.Pose = 0;
    this.Combat = 0;
    this.Spawn = 0;
}


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
    ,SUPER_INVULNERABLE:1 << 15
    ,RESET_Y_FUNC: 1 << 16
    ,USE_CURRENT_VX: 1 << 17
    ,USE_CURRENT_VY: 1 << 18
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
    ,HOLD_AIRBORNE:1 << 9
    ,ALLOW_INTERUPT_1:1 << 10
    ,ALLOW_INTERUPT_2:1 << 11
    ,ALLOW_INTERUPT_3:1 << 12
    ,ALLOW_INTERUPT_4:1 << 13
    ,ALLOW_INTERUPT_5:1 << 14
    ,ALLOW_INTERUPT_6:1 << 15
    ,ALLOW_INTERUPT_7:1 << 16
    ,ALLOW_INTERUPT_8:1 << 17
    ,ALLOW_INTERUPT_9:1 << 18
    ,ALLOW_INTERUPT_10:1 << 19
}


var COMBAT_FLAGS = 
{
    PROJECTILE_ACTIVE:1 << 0
    ,CAN_BE_BLOCKED:1 << 1
    ,CAN_BE_AIR_BLOCKED:1 << 2
    ,ATTACK:1 << 3
    ,SPAWN_PROJECTILE:1 << 4
    ,STOP_SLIDE_BACK:1 << 5
    ,NO_SLIDE_BACK:1 << 6
    ,SUPER_MOVE_PAUSE:1 << 7
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



var STAGE = 
{
    MIN_X:0
    ,MAX_X:640
    ,MAX_BG0_SCROLL:-63
    ,MAX_BG1_SCROLL:-760
    ,MIN_STAGEX:0
    ,MAX_STAGEX:768
    ,START_X:150
    ,START_X_OFFSET:50
    ,FLOORY:57
    ,CSSWIDTH:768
}

var USER_DATA_TYPES = 
{
    OFFSET:0
}

var CONSTANTS =
{
    MAX_SPEED:0
    ,MAX_PRIORITY:1 << 30
    ,NORMAL_SPEED:14
    ,SLOW_SPEED:70
    ,MAX_FRAME:100000000000000 /*round will end when Game.prototype.frame_ reaches this value*/
    ,TARGET_FPS:64
    ,MS_PER_SEC:1000
    ,FPS_VALUE:60000

    ,SPEED_INCREMENT:1
    ,MIN_DELAY:0
    ,MAX_DELAY:1000
    ,MIN_FRAME_DELAY:-100
    ,FRAME_MAX:999
    ,UBER_FRAME_MAX:1000000

    ,MAX_KEYSTATES:15
    ,MAX_KEY_LIFE:25
    ,EXACT_MATCH:2
    ,PRIORITY_MATCH:1
    ,MAX_EXTRA_IMAGES:20
    ,MOVEMENT_THRESHOLD_LEFT:250
    ,MOVEMENT_THRESHOLD_RIGHT:518
    ,SO_CLOSE:200
    ,PI:3.14159265
    ,TWO_PI:2*3.14159265
    ,HALF_PI:3.14159265/2.0
    ,PI_INC:3.14159265/40.0
    ,SLIDE_INC:3.14159265/50.0
    ,USE_PLAYER_TOP:1
    ,USE_PLAYER_BOTTOM:2
    ,USE_PLAYER_XY:3
    ,SMALLDIRT:4
    ,DIRT_FREQUENCY:5
    ,X_DAMPING:0.1
    ,Y_DAMPING:0.1
    ,HALF_G:0.5*9.81
    ,SMALLDIRT_OFFSETY:15
    ,BIGDIRT_OFFSETY:70
    /*the following are just to help cut down on literals throughout the code*/
    ,FIRST_HIT:1
    ,SECOND_HIT:2
    ,THRID_HIT:3
    ,FOURTH_HIT:4
    ,FIFTH_HIT:5
    ,SIXTH_HIT:6
    ,SEVENTH_HIT:7
    ,EIGTH_HIT:8
    ,NINTH_HIT:9
    ,TENTH_HIT:10
    ,TEAM1:1
    ,TEAM2:2
    ,SLIDE_BACK_RANGE_NEAR:250
    ,SLIDE_BACK_RANGE_FAR:350
    ,DEFAULT_SLIDE_BACK_AMOUNT:80
    ,LIGHT_SLIDE_BACK_RATE:0.47
    ,MEDIUM_SLIDE_BACK_RATE:0.72
    ,HARD_SLIDE_BACK_RATE:1

    ,DEFAULT_TAKE_HIT_DELAY:15
    ,DEFAULT_GIVE_HIT_DELAY:10

    ,NO_FRAME:-1
    ,DEFEATED_FRAME:100
    ,DEFAULT_WIN_ANIMATION_NAME:"win 1"
    /*how many frames after the winning hit will a player start its win animation*/
    ,WIN_ANIMATION_DELAY:100
    /*how many frames after the losing player hits the ground will the round end*/
    ,GOTO_NEW_ROUND_DELAY:200
    ,DEFAULT_CROUCH_LIGHT_HRSLIDE:40
    ,DEFAULT_CROUCH_MEDIUM_HRSLIDE:60
    ,DEFAULT_CROUCH_HARD_HRSLIDE:80

    ,DEFAULT_LIGHT_HRSLIDE:40
    ,DEFAULT_MEDIUM_HRSLIDE:60
    ,DEFAULT_HARD_HRSLIDE:80

    ,DEFAULT_COMBO_TEXT_LIFE:100

    /*hits are buffered for the following number of frames - to allow the other player to also register a hit, removing any advantage for any player*/
    ,DEFAULT_ACTION_FRAME_DELAY:2

    ,DEFAULT_BASE_IMAGES_PATH:"images/misc/"
    ,DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT:20
    ,DEFAULT_BLOCK_FREEZE_FRAME_COUNT:20

    ,SINGLE:1
    ,DOUBLE:2
    ,TRIPLE:3
    ,QUADRUPLE:4

    ,ONE_LEVEL:96
    ,MAX_BLOCK_DISTANCE_SQ:90000
    ,RIGHT:1
    ,LEFT:2
    ,UP:4
    ,DOWN:8
    ,LEFT_AND_CHECK_RIGHT:16
    ,RIGHT_AND_CHECK_LEFT:32
    ,INTERUPT_DELAY:3

    ,CHARSELECT_Y:206
    ,CHARSELECT_X:256

    ,CHARSELECT_HEIGHT:82
    ,CHARSELECT_WIDTH:64

    ,ROW1:0
    ,ROW2:1
    ,ROW3:2

    ,COL1:0
    ,COL2:1
    ,COL3:2
    ,COL4:3
};
var CHARACTERS = 
{
    RYU:0
    ,CHUNLI:1
    ,CHARLIE:2
    ,KEN:3
    ,GUY:4
    ,BIRDIE:5
    ,SODOM:6
    ,ADON:7
    ,RANDOM1:8
    ,ROSE:9
    ,SAGAT:10
    ,RANDOM2:11
    ,DAN:12
    ,AKUMA:13
    ,MBISON:14
};
var g_slideGap = CONSTANTS.SLIDE_BACK_RANGE_FAR - CONSTANTS.SLIDE_BACK_RANGE_NEAR;
var TEXT = 
{
    HIT_COMBO:"HIT COMBO"
};

var KEYS = 
{
    ESCAPE:27
    ,NUMPAD_PLUS:107
    ,NUMPAD_MINUS:109
    ,NUMPAD_1:97
    ,NUMPAD_2:98
    ,NUMPAD_3:99
    ,NUMPAD_4:100
    ,NUMPAD_5:101
    ,NUMPAD_6:102
    ,NUMPAD_7:103
    ,NUMPAD_8:104
    ,NUMPAD_9:105
    ,P:80
    ,EIGHT:56
    ,NINE:57
    ,ZERO:48

    ,ARROW_LEFT:37
    ,ARROW_UP:38
    ,ARROW_RIGHT:39
    ,ARROW_DOWN:40
    ,A:65
    ,S:83
    ,D:68
    ,Z:90
    ,X:88
    ,C:67


    ,NUMPAD_1:97
    ,NUMPAD_2:98
    ,NUMPAD_3:99
    ,NUMPAD_4:100
    ,NUMPAD_5:101
    ,NUMPAD_6:102
    ,NUMPAD_7:103
    ,NUMPAD_8:104
    ,NUMPAD_9:105

    ,H:72
    ,J:74
    ,K:75
    ,B:66
    ,N:78
    ,M:77

    ,O:79
};

var GAME_STATES = 
{
    PAUSED:1
    ,STEP_FRAME:2
};

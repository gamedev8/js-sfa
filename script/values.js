﻿var CHAR_NAMES = ["ryu","akuma","chunli","charlie","ken","guy","birdie","sodom","adon","rose","sagat","mbison"];

var BUTTONS = 
{
    FORWARD:1 << 0
    ,BACK:1 << 1
    ,JUMP:1 << 2
    ,CROUCH:1 << 3
    ,LIGHT_PUNCH:1 << 4
    ,MEDIUM_PUNCH:1 << 5
    ,HARD_PUNCH:1 << 6
    ,LIGHT_KICK:1 << 7
    ,MEDIUM_KICK:1 << 8
    ,HARD_KICK:1 << 9
    ,TURN_AROUND:1 << 10
    ,SELECT:1 << 11
    ,START:1 << 12
    ,CHARGE:1 << 13
    ,EXACT:1 << 14
}

var BUTTON_STATE = 
{
    NONE:0
    ,PRESSED:1
};
//BUTTON_STATE.PRESSED = BUTTON_STATE.JUST_PRESSED | BUTTON_STATE.STILL_PRESSED;
//BUTTON_STATE.NONE = BUTTON_STATE.JUST_RELEASED | BUTTON_STATE.NONE;

var makeButtonState = function(state,frame) { return {Value:state||BUTTON_STATE.NONE, Frame:frame || 0}; };

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

var SWINGSOUND = 
{
    LP:1 << 1
    ,MP:1 << 2
    ,HP:1 << 3
    ,LK:1 << 4
    ,MK:1 << 5
    ,HK:1 << 6
    ,SLIDE0:1 << 7
    ,SLIDE1:1 << 8
}

var HITSOUND = 
{
    LP:1 << 1
    ,MP:1 << 2
    ,HP:1 << 3
    ,LK:1 << 4
    ,MK:1 << 5
    ,HK:1 << 6
    ,HP3:1 << 7
    ,FIRE0:1 << 8
    ,FIRE1:1 << 9
}

var BLOCKSOUND = 
{
    LP:1 << 1
    ,MP:1 << 2
    ,HP:1 << 3
    ,LK:1 << 4
    ,MK:1 << 5
    ,HK:1 << 6
}

var AIRBORNE_FLAGS = 
{
    YES:1 << 0
    ,NO:1 << 1
    ,EQUAL:1 << 2
}


var ALERT_FLAGS = {
    DIZZY:1 << 1
}

var MATCH_STATES = 
{
    NONE:0
    ,PRACTICE:1
};

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
    ,IGNORE_ATTACKS:1 << 19
    ,IGNORE_MOVE_OVERRIDE:1 << 20
    ,DIZZY:1 << 21
    ,INVISIBLE:1 << 22
    ,MOVE_TO_ENEMY:1 << 23
    ,MOVE_BEYOND_ENEMY:1 << 24
    ,FACE_ENEMY:1 << 25
    ,BULLDOZE:1 << 26
    ,BLUE_FIRE:1 << 27
    ,RED_FIRE:1 << 28
    ,HUMAN_PROJECTILE:1 << 29
    ,IGNORE_HOLD_FRAME:1 << 30
}

var HIT_REACT_FLAGS = 
{
    NONE: 0
    ,FLOORED:1 << 0
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
    ,FORCE_HOLD_AIRBORNE_XY:1 << 16
    /*the player will start a jump, even if the player is already in the air*/
    ,FORCE_START_AIRBORNE:1 << 17
    ,AIR_COMBO_1:1 << 18
    ,AIR_COMBO_2:1 << 19
    ,AIR_COMBO_3:1 << 20
    ,AIR_BRAKES:1 << 21
    ,ALLOW_OVERLAP:1 << 22
    ,QUICK_CHANGE_DIRECTION:1 << 23
    ,FORCE_CHANGE_TARGET:1 << 24
    ,FREEZE:1 << 25
    ,AIR_MISC_0:1 << 26
    ,PENDING_JUMP:1 << 27
    ,FORCE_FACE_TARGET:1 << 28
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
    ,TELEPORT_BEHIND:1 << 8
    ,TELEPORT_INFRONT:1 << 9
    ,TELEPORT_MIDDLE:1 << 10
    ,TELEPORT_BACK:1 << 11
    ,TELEPORT_START:1 << 12
    ,TELEPORT_END:1 << 13
    ,CHAIN_ON_HIT:1 << 14
    ,PENDING_ATTACK:1 << 15
    ,IGNORE_CLEAR_FIRE:1 << 16
    ,MULTI_PROJECTILE:1 << 17
    ,TELEPORT:1 << 18
}

var RCOMBAT_FLAGS =
{
    IGNORE_CLEAR_DIZZY:1 << 0
}

var HIT_REACT = 
{
    EJECT:1
    ,AIRBORNE_EJECT:2
}

var AI_FLAGS =
{
    NONE: 1 << 0
    ,DONE: 1 << 1
    ,MOVE_TO_ENEMY: 1 << 2
    ,MOBILE_ME: 1 << 3
    ,GROUNDED_ENEMY: 1 << 4
    ,ATTACK_PENDING: 1 << 5
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
    ,BLUE_FIRE:1 << 25
    ,RED_FIRE:1 << 26
    ,NO_DELAY:1 << 27
    ,RED_FIRE_ON_MAX_HIT:1 << 28
    ,RED_FIRE_NO_SOUND:1 << 29
    ,OVERRIDE_INVULNERABLE:1 << 30
    ,SLOW_DOWN_GAME:1 << 31
};
var COMBO_FLAGS = 
{
    BLUE_FIRE_ON_FIRST_HIT:1 << 1
    ,RED_FIRE_ON_MAX_HIT:1 << 2
    ,RED_FIRE_SOUND_ON_MAX_HIT:1 << 3
    ,SHORT_DELAY_ON_FIRST_HIT:1 << 4
    ,KNOCKDOWN_ON_MAX_HIT:1 << 5
};
var MOVE_FLAGS = 
{
    NONE:1 << 0
    ,MOVE_WITH_PLAYER:1 << 1
    ,MOVE_TO_PLAYER:1 << 2
};
var HIT_FLAGS = 
{
    HIGH:1 << 0
    ,LOW:1 << 1
    ,TRIP:1 << 2
};

var JUGGLE_FLAGS =
{
    NONE:1 << 0
    ,ALLOW:1 << 1
    ,ALIVE:1 << 2
    ,DEAD:1 << 3
    ,IGNORE:1 << 31
};

var JUGGLE_GROUP = 
{
    UPPERCUT:1
    ,SPINKICK:2
};

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
    ,SHORYUKEN:1 << 11
};

var QUIT_MATCH = 
{
    GOTO_STORYMODE:1
    ,GOTO_INSERTCOIN:2
};

var STAGE = 
{
    MIN_X:0
    ,MAX_X:840
    /*,MAX_BG1_SCROLL:-760*/
    ,MIN_STAGEX:0
    ,STANDARD_WIDTH:768
    ,MAX_STAGEX:768
    ,START_X:150
    ,START_X_OFFSET:50
    ,FLOORY:59
    ,VERT_SCROLL_Y:180
    ,SCROLLY_FACTOR:0.5
}

var USER_DATA_TYPES = 
{
    OFFSET:0
}


var ENERGYBAR = 
{
    ANIMATION_RATE:5
    ,MAX_LEVEL0:96
    ,MAX_LEVEL1:192
    ,MAX_LEVEL2:288
    ,LEVEL0:0
    ,LEVEL1:1
    ,LEVEL2:2
    ,LEVELMAXED:3
    ,LEVEL0_KEY:"lvl0"
    ,LEVEL1_KEY:"lvl1"
    ,LEVEL2_KEY:"lvl2"
    ,LEVEL0MAXED_KEY:"lvl0Maxed"
    ,LEVEL1MAXED_KEY:"lvl1Maxed"
    ,LEVEL2MAXED_KEY:"lvl2Maxed"

};

var ATTACK_STATE = {
    NONE:0
    ,PENDING:1
    ,HIT:2
    ,BLOCKED:3
    ,DONE:4
    ,NOT_AN_ATTACK:5
};


var CONSTANTS =
{
    TEAMMODE_DAMAGE_MULTIPLIER:1/3
    ,DEFAULT_SHADOW_Y:42
    ,DEFAULT_FIRE_HITSTOP:10
    ,MAX_STORY_MODE_LEVEL:7
    ,TRIP_SLIDEFACTOR:0.1
    ,TRIP_SLIDEFORCE:0
    ,GRAPPLE_DISTANCE:50
    ,GROUND_FRAMES_FOR_GRAPPLE:20
    ,MOBILE_FRAMES_FOR_GRAPPLE:20
    ,MAX_SPEED:0
    ,MAX_PRIORITY:(1 << 30)
    ,NORMAL_SPEED:(1000 / 60)
    ,FAST_SPEED:(1000 / 70)
    ,SLOW_SPEED:(1000 / 45)
    ,ROUND_OVER_SPEED:75
    ,MAX_FRAME:100000000000000 /*round will end when Game.prototype.frame reaches this value*/
    ,TARGET_FPS:60
    ,MS_PER_SEC:1000
    ,FPS_VALUE:60000
    ,DELAY_AFTER_CHARACTER_SELECT:100

    ,SPEED_INCREMENT:1
    ,MIN_DELAY:0
    ,MAX_DELAY:1000
    ,MIN_FRAME_DELAY:-100
    ,FRAME_MAX:999
    ,UBER_FRAME_MAX:1000000

    ,MAX_DIZZY_VALUE:100
    ,DIZZY_INC:30
    ,DECREASE_DIZZY:-1
    ,LIGHT_INCREASE_DIZZY:1
    ,MEDIUM_INCREASE_DIZZY:5
    ,HARD_INCREASE_DIZZY:10
    ,MAX_KEYSTATES:15
    ,MAX_KEY_LIFE:20
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
    ,G:9.80665
    ,HALF_G:0.5*9.80665
    ,SMALLDIRT_OFFSETY:15
    ,BIGDIRT_OFFSETY:13
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
    ,SLIDE_BACK_RANGE_NEAR:50
    ,SLIDE_BACK_RANGE_FAR:150
    ,DEFAULT_SLIDE_BACK_AMOUNT:80
    ,LIGHT_SLIDE_BACK_RATE:0.47
    ,MEDIUM_SLIDE_BACK_RATE:0.72
    ,HARD_SLIDE_BACK_RATE:1

    ,DEFAULT_TAKE_HIT_DELAY:15
    ,DEFAULT_GIVE_HIT_DELAY:10

    ,MAX_ROUND:10
    ,DEFAULT_CROUCH_LIGHT_HRSLIDE:40
    ,DEFAULT_CROUCH_MEDIUM_HRSLIDE:60
    ,DEFAULT_CROUCH_HARD_HRSLIDE:80

    ,DEFAULT_LIGHT_HRSLIDE:40
    ,DEFAULT_MEDIUM_HRSLIDE:60
    ,DEFAULT_HARD_HRSLIDE:80

    ,COMBO_TEXT_LIFE:100
    ,TEXT_LIFE:100
    ,TEXT_FADE_SPEED:20
    ,TEXT_DELAY:100

    /*hits are buffered for the following number of frames - to allow the other player to also register a hit, removing any advantage for any player*/
    ,DEFAULT_ACTION_FRAME_DELAY:2

    ,DEFAULT_BASE_IMAGES_PATH:"images/misc/"
    ,DEFAULT_PROJECTILE_HIT_STOP_FRAME_COUNT:20
    ,DEFAULT_BLOCK_FREEZE_FRAME_COUNT:20

    ,SINGLE:1
    ,DOUBLE:2
    ,TRIPLE:3
    ,QUADRUPLE:4
    /*key sequences are "dead" after the following number of frames*/
    ,KEY_SEQUENCE_EXPIRY:5
    ,MAINTAIN_KEYS_WHILE_AIRBORNE:0

    ,ONE_LEVEL:96
    ,MAX_BLOCK_DISTANCE_SQ:90000
    ,MAX_BLOCK_DISTANCE_SQ2:100000
    ,RIGHT:1
    ,LEFT:2
    ,UP:4
    ,DOWN:8
    ,LEFT_AND_CHECK_RIGHT:16
    ,RIGHT_AND_CHECK_LEFT:32
    ,INTERUPT_DELAY:3
    ,MAX_NBHITS:99

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
    ,MAX_CREDITS:9

    ,NBCHARGE_FRAMES:60
    ,NBINTERIM_FRAMES:30
    ,ATTACKBUTTON_FRAMES:3

    ,PRESENT_DELAY:5
    ,MIN_TELEPORT_DISTANCE_SQ:10

    ,NO_FRAME:-1
    ,DEFEATED_FRAME:100
    ,DEFAULT_WIN_ANIMATION_NAME:"win 1"
    /*how many frames after the winning hit will a player start its win animation*/
    ,ROUND_OVER_DELAY:30
    /*how many frames after the losing player hits the ground will the round end*/
    ,GOTO_NEW_ROUND_DELAY:250
    /*how many frames to wait before the round starts to accept input*/
    ,START_NEW_ROUND_DELAY:130
    ,ANNOUNCE_NEW_ROUND_DELAY:10

    /*
    ,SHOW_FACEOFF_DELAY:6
    ,SHOW_FACEOFF_PICS_DELAY:20
    ,SHOW_FACEOFF_NAMES_DELAY:100
    ,REMOVE_FACEOFF_PICS_DELAY:150
    ,SHOW_TEAMS_DELAY:200
    ,START_THEME_DELAY:400
    ,ANNOUNCE_FIRST_ROUND_DELAY:460
    ,START_FIRST_ROUND_DELAY:580
    */


    ,SHOW_FACEOFF_DELAY:!!__debugMode ? 0 : 6
    ,SHOW_FACEOFF_PICS_DELAY:!!__debugMode ? 0 : 20
    ,SHOW_FACEOFF_NAMES_DELAY:!!__debugMode ? 0 : 100
    ,REMOVE_FACEOFF_PICS_DELAY:!!__debugMode ? 0 : 150
    ,SHOW_TEAMS_DELAY:!!__debugMode ? 0 : 200
    ,START_THEME_DELAY:!!__debugMode ? 0 : 210
    ,ANNOUNCE_FIRST_ROUND_DELAY:!!__debugMode ? 0 : 230
    ,START_FIRST_ROUND_DELAY:!!__debugMode ? 0 : 340
    //height at which you will take damage from a fall
    ,FALL_DAMAGE_HEIGHT:400

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

var LOADING_STATES = 
{
    WAITING:1 << 0
    ,DOWNLOADING:1 << 1
    ,DONE:1 << 2
    ,ERROR:1 << 3
};

var RESOURCE_TYPES = 
{
    IMAGE:1
    ,BASE64IMAGE:2
    ,BASE64AUDIO:3
    ,SCRIPT:4
};

var GAMEPAD = 
{
    LEFT: "LEFT"
    ,JUMP: "JUMP"
    ,RIGHT: "RIGHT"
    ,CROUCH: "CROUCH"
    ,HK: "HK"
    ,MK: "MK"
    ,MP: "MP"
    ,HP: "HP"
    ,LP: "LP"
    ,LK: "LK"
    ,SELECT: "SELECT"
    ,START: "START"
}

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
    ,ONE:49
    ,TWO:50
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
    ,Q:81
    ,F:70


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
    ,L:76
    ,O:79
    ,COMMA:188

    ,SPACE:32
    ,CNTRL:17
    ,ENTER:13
};

var KEY_STATES = 
{
    NONE:0
    ,JUST_PRESSED:1
    ,STILL_PRESSED:2
    ,JUST_RELEASED:3
};

var GAME_STATES = 
{
    NONE:0
    ,PAUSED:1 << 1
    ,STEP_FRAME:1 << 2
    ,INSERT_COIN:1 << 3
    ,CHAR_SELECT:1 << 4
    ,MATCH:1 << 5
    ,AUDIO_LOADING:1 << 6
};


var DEAD_REASON = 
{
    BIG_DROP:1
};
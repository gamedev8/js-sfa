Player.prototype.CreateRyu = function(user)
{
    var player = new Player("ryu",101,247,user);
    var folder = "|images/misc/" + player.folder_;
    
    player.defaultShadowImageSrc_ = "136"
    player.circle_.OffsetY = 50;

    var stance = player.AddAnimation(MISC_FLAGS.NONE,"stance",0,["stance"],0,false);
    stance.Flags = ({Player:PLAYER_FLAGS.ALLOW_CHANGE_DIRECTION | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.STANDING});
    stance.AddFrame(player,"",folder + "/x-stance-1.png",4,{Player:PLAYER_FLAGS.MOBILE});
    stance.AddFrame(player,"",folder + "/x-stance-0.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-1.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-2.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-3.png",4);
    stance.AddFrame(player,"",folder + "/x-stance-2.png",4);

    var crouch = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.WALKING_FORWARD,"crouch",0,[BUTTONS.CROUCH],99,false);
    crouch.Flags = ({Player:PLAYER_FLAGS.ALLOW_CHANGE_DIRECTION | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.CROUCHING});
    crouch.AddFrame(player,"",folder + "/x-crouch-0.png",2,{Player:PLAYER_FLAGS.MOBILE});
    crouch.AddFrame(player,"",folder + "/x-crouch-1.png",2,{Player:PLAYER_FLAGS.MUST_HOLD_KEY});
    /*MOBILE is set on the following frame because other moves chain to it*/
    crouch.AddFrame(player,"",folder + "/x-crouch-2.png",2,{Player:PLAYER_FLAGS.HOLD_FRAME|PLAYER_FLAGS.MOBILE});
    crouch.AddFrame(player,"",folder + "/x-crouch-1.png",2);
    crouch.AddFrame(player,"",folder + "/x-crouch-0.png",2);
    
    var jump_land = player.AddAnimation(MISC_FLAGS.NONE,"jump land",0,["jump-land"],0,false);
    jump_land.AddFrameWithSound(player,1,"audio/misc/jump-land.zzz","",folder + "/x-crouch-0.png",2,{Player:PLAYER_FLAGS.MOBILE});


    var turn = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"turn", 0, ["turn"], 0, false);
    turn.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX,Pose:POSE_FLAGS.STANDING});
    turn.AddFrame(player,"",folder + "/x-turn-0.png",2,{Player:PLAYER_FLAGS.MOBILE});
    turn.AddFrame(player,"",folder + "/x-turn-1.png",2);
    turn.AddFrame(player,"",folder + "/x-turn-2.png",2);

    var cturn = player.AddAnimation(POSE_FLAGS.CROUCHING,"turn", 0, ["turn"], 0, false);
    cturn.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX,Pose:POSE_FLAGS.CROUCHING});
    cturn.AddFrame(player,"",folder + "/x-crouch-turn-0.png",2,{Player:PLAYER_FLAGS.MOBILE});
    cturn.AddFrame(player,"",folder + "/x-crouch-turn-1.png",2);
    cturn.AddFrame(player,"",folder + "/x-crouch-turn-2.png",2);
    cturn.Chain(crouch,2);

    var win1 = player.AddAnimation(MISC_FLAGS.NONE,"win 1",0,["win1"],0,false);
    win1.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    win1.AddFrame(player,"",folder + "/x-win-1-0.png",4);
    win1.AddFrame(player,"",folder + "/x-win-1-1.png",12);
    win1.AddFrame(player,"",folder + "/x-win-1-2.png",12);
    win1.AddFrame(player,"",folder + "/x-win-1-3.png",12);
    win1.AddFrame(player,"",folder + "/x-win-1-4.png",12);
    win1.AddFrame(player,"",folder + "/x-win-1-5.png",12);
    win1.AddFrame(player,"",folder + "/x-win-1-6.png",12);
    win1.Chain(win1,3);

    var win2 = player.AddAnimation(MISC_FLAGS.NONE,"win 2",0,["win2"],0,false);
    win2.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    win2.AddFrame(player,"",folder + "/x-win-2-0.png",4);
    win2.AddFrame(player,"",folder + "/x-win-2-1.png",8);
    win2.AddFrame(player,"",folder + "/x-win-2-2.png",8);
    win2.Chain(win2,2);

    /*if this is not added, then only the first win animation will ever be used*/
    player.winAnimationNames_ = ["win 1","win 2"];

    var dead = player.AddAnimation(MISC_FLAGS.NONE,"dead",0,["dead"],0,false);
    dead.AddFrame(player,"200",folder + "/x-down.png", CONSTANTS.DEFEATED_FRAME,{Player:PLAYER_FLAGS.INVULNERABLE});

    var hitReact_cLN = player.AddAnimation(POSE_FLAGS.CROUCHING,"hr crouch light",0,["hr_cLN"],0,false);
    hitReact_cLN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_cLN.AddFrame(player,"",folder + "/x-hit-cln-0.png", 28,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_cLN.Chain(crouch,2);

    var hitReact_cMN = player.AddAnimation(POSE_FLAGS.CROUCHING,"hr crouch medium",0,["hr_cMN"],0,false);
    hitReact_cMN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_cMN.AddFrame(player,"",folder + "/x-hit-cln-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_cMN.AddFrame(player,"",folder + "/x-hit-chn-0.png", 8);
    hitReact_cMN.AddFrame(player,"",folder + "/x-hit-cln-0.png", 8);
    hitReact_cMN.Chain(crouch,2);

    var hitReact_cHN = player.AddAnimation(POSE_FLAGS.CROUCHING,"hr crouch hard",0,["hr_cHN"],0,false);
    hitReact_cHN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_cHN.AddFrame(player,"",folder + "/x-hit-chn-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_cHN.AddFrame(player,"",folder + "/x-hit-chn-1.png", 8);
    hitReact_cHN.AddFrame(player,"",folder + "/x-hit-cln-0.png", 8);
    hitReact_cHN.Chain(crouch,2);


    var hitReact_sLN = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sLN",0,["hr_sLN"],0,false);
    hitReact_sLN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sLN.AddFrame(player,"",folder + "/x-hit-sln-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sLN.AddFrameWithSound(player,1,"audio/ryu/clocked.zzz","",folder + "/x-hit-smn-0.png", 8);
    hitReact_sLN.AddFrame(player,"",folder + "/x-hit-sln-0.png", 8);

    var hitReact_sLF = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sLF",0,["hr_sLF"],0,false);
    hitReact_sLF.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sLF.AddFrame(player,"",folder + "/x-hit-slf-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sLF.AddFrame(player,"",folder + "/x-hit-smf-0.png", 8);
    hitReact_sLF.AddFrame(player,"",folder + "/x-hit-slf-0.png", 8);

    var hitReact_sMN = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sMN",0,["hr_sMN"],0,false);
    hitReact_sMN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sMN.AddFrame(player,"",folder + "/x-hit-smn-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sMN.AddFrame(player,"",folder + "/x-hit-smn-1.png", 8);
    hitReact_sMN.AddFrame(player,"",folder + "/x-hit-sln-0.png", 8);

    var hitReact_sMF = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sMF",0,["hr_sMF"],0,false);
    hitReact_sMF.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sMF.AddFrame(player,"",folder + "/x-hit-smf-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sMF.AddFrame(player,"",folder + "/x-hit-smn-1.png", 8);
    hitReact_sMF.AddFrame(player,"",folder + "/x-hit-sln-0.png", 8);

    var hitReact_sHN = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sHN",0,["hr_sHN"],0,false);
    hitReact_sHN.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sHN.AddFrame(player,"",folder + "/x-hit-smn-1.png", 2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sHN.AddFrameWithSound(player,1,"audio/ryu/clocked.zzz","",folder + "/x-hit-shn-1.png", 8);
    hitReact_sHN.AddFrame(player,"",folder + "/x-hit-sln-0.png", 8);

    var hitReact_sHF = player.AddAnimation(POSE_FLAGS.STANDING,"hr_sHF",0,["hr_sHF"],0,false);
    hitReact_sHF.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_sHF.AddFrameWithSound(player,1,"audio/ryu/clocked.zzz","",folder + "/x-hit-shf-0.png", 8,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    hitReact_sHF.AddFrame(player,"",folder + "/x-hit-shf-1.png", 8);
    hitReact_sHF.AddFrame(player,"",folder + "/x-hit-slf-0.png", 8);

    var getup = player.AddAnimation(MISC_FLAGS.NONE,"getup",0,["hr_getup"],0,false);
    getup.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    getup.AddFrameWithSound(player,1,"audio/misc/floored-1.zzz","200",folder + "/x-hit-air-2a.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE,Spawn:SPAWN_FLAGS.SPAWN_SMALLDIRT},{Player:PLAYER_FLAGS.MOBILE});
    getup.AddFrame(player,"200",folder + "/x-down.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    getup.AddFrame(player,"",folder + "/x-getup-0.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    getup.AddFrame(player,"",folder + "/x-getup-1.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    getup.AddFrame(player,"",folder + "/x-getup-2.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    getup.AddFrame(player,"",folder + "/x-getup-3.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    getup.AddFrame(player,"",folder + "/x-crouch-0.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});

    var dizzy = player.AddAnimation(MISC_FLAGS.NONE, "dizzy", 0, ["hr_sodizzy"], 0, false);
    dizzy.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX });
    dizzy.AdjustShadowPosition = false;
    dizzy.AddFrame(player, "", folder + "/x-dizzy-0.png", 32, { Player: PLAYER_FLAGS.DIZZY }, {Player: PLAYER_FLAGS.MOBILE});
    dizzy.AddFrame(player, "", folder + "/x-dizzy-1.png", 32, { Player: PLAYER_FLAGS.DIZZY });
    dizzy.AddFrame(player, "", folder + "/x-dizzy-2.png", 32, { Player: PLAYER_FLAGS.DIZZY },0,0,0,0,0,0,-20);
    dizzy.AddFrame(player, "", folder + "/x-dizzy-1.png", 32, { Player: PLAYER_FLAGS.DIZZY },0,0,0,0,0,0,0);
    dizzy.Chain(dizzy);

    var getup_dizzy = player.AddAnimation(MISC_FLAGS.NONE, "getup", 0, ["hr_getupdizzy"], 0, false);
    getup_dizzy.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX });
    getup_dizzy.AddFrameWithSound(player,1,"audio/misc/floored-1.zzz", "200", folder + "/x-hit-air-2a.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE, Spawn: SPAWN_FLAGS.SPAWN_SMALLDIRT }, { Player: PLAYER_FLAGS.MOBILE });
    getup_dizzy.AddFrame(player, "200", folder + "/x-down.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.AddFrame(player, "", folder + "/x-getup-0.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.AddFrame(player, "", folder + "/x-getup-1.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.AddFrame(player, "", folder + "/x-getup-2.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.AddFrame(player, "", folder + "/x-getup-3.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.AddFrame(player, "", folder + "/x-crouch-0.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE });
    getup_dizzy.Chain(dizzy);


    var hitReact_dizzyBounce = player.AddAnimation(MISC_FLAGS.NONE, "dizzy bounce", 0, ["hr_dizzybounce"], 0, false);
    hitReact_dizzyBounce.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX | PLAYER_FLAGS.USE_CURRENT_VX });
    hitReact_dizzyBounce.ChainVxFunc = (function(v){ return v * 0.75; });
    hitReact_dizzyBounce.Vy = (80);
    hitReact_dizzyBounce.AddFrameWithSound(player,1,"audio/misc/floored-2.zzz", "200", folder + "/x-hit-air-2.png", 4, { Player: PLAYER_FLAGS.INVULNERABLE | PLAYER_FLAGS.IGNORE_COLLISIONS, Spawn: SPAWN_FLAGS.SPAWN_BIGDIRT }, { Player: PLAYER_FLAGS.MOBILE }, 0, 1);
    hitReact_dizzyBounce.AddFrame(player, "200", folder + "/x-hit-air-3.png", CONSTANTS.FRAME_MAX, { Pose: POSE_FLAGS.AIRBORNE, Player: PLAYER_FLAGS.USE_ATTACK_DIRECTION | PLAYER_FLAGS.INVULNERABLE | PLAYER_FLAGS.IGNORE_ATTACKS | PLAYER_FLAGS.IGNORE_COLLISIONS });
    hitReact_dizzyBounce.Chain(getup_dizzy);

    var hitReact_dizzy = player.AddAnimation(POSE_FLAGS.STANDING, "dizzy", 0, ["hr_dizzy"], 0, false);
    hitReact_dizzy.Flags = ({ Player: PLAYER_FLAGS.MOVE_TO_FRONT });
    hitReact_dizzy.Vx = (35);
    hitReact_dizzy.Vy = (200);
    hitReact_dizzy.AddFrame(player, "200", folder + "/x-hit-air-0.png", 32, { Player: PLAYER_FLAGS.INVULNERABLE | PLAYER_FLAGS.IGNORE_ATTACKS }, 0, 1);
    hitReact_dizzy.AddFrame(player, "200", folder + "/x-hit-air-1.png", CONSTANTS.FRAME_MAX, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE | PLAYER_FLAGS.IGNORE_ATTACKS });
    hitReact_dizzy.Chain(hitReact_dizzyBounce);

    var rise = player.AddAnimation(MISC_FLAGS.NONE,"rise",0,["getup"],0,false);
    rise.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    rise.AddFrame(player,"",folder + "/x-getup-0.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    rise.AddFrame(player,"",folder + "/x-getup-1.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    rise.AddFrame(player,"",folder + "/x-getup-2.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    rise.AddFrame(player,"",folder + "/x-getup-3.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    rise.AddFrame(player,"",folder + "/x-crouch-0.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});

    var hitReact_bounce = player.AddAnimation(MISC_FLAGS.NONE,"bounce",0,["hr_bounce"],0,false);
    hitReact_bounce.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX | PLAYER_FLAGS.USE_CURRENT_VX});
    hitReact_bounce.ChainVxFunc = (function(v){ return v * 0.75; });
    hitReact_bounce.ChainVyFunc = (function(v){ return v * 0.5; });
    hitReact_bounce.Vy = (80);
    hitReact_bounce.AddFrameWithSound(player,1,"audio/misc/floored-2.zzz","200",folder + "/x-hit-air-2.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE,Spawn:SPAWN_FLAGS.SPAWN_BIGDIRT},{Player:PLAYER_FLAGS.MOBILE},0,1);
    hitReact_bounce.AddFrame(player,"200",folder + "/x-hit-air-3.png", CONSTANTS.FRAME_MAX,{Pose:POSE_FLAGS.AIRBORNE,Player:PLAYER_FLAGS.USE_ATTACK_DIRECTION|PLAYER_FLAGS.IGNORE_ATTACKS|PLAYER_FLAGS.INVULNERABLE}, {Player: PLAYER_FLAGS.MOBILE});
    hitReact_bounce.Chain(getup);

    var hitReact_trip = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING,"tripped",0,["hr_trip"],0,false);
    hitReact_trip.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_trip.Vx = (25);
    hitReact_trip.Vy = (150);
    hitReact_trip.AddFrame(player,"",folder + "/x-hit-air-4.png", 8,{Player:PLAYER_FLAGS.INVULNERABLE},{Player:PLAYER_FLAGS.MOBILE},0,0,0,0,null,0,50);
    hitReact_trip.AddFrame(player,"",folder + "/x-hit-air-5.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_trip.AddFrame(player,"",folder + "/x-hit-air-6.png", CONSTANTS.FRAME_MAX,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_trip.Chain(hitReact_bounce);

    var hitReact_air = player.AddAnimation(POSE_FLAGS.AIRBORNE,"air hit",0,["hr_air"],0,false);
    hitReact_air.AllowJuggle = true;
    hitReact_air.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_air.Vx = (-50);
    hitReact_air.Vy = (150);
    hitReact_air.AddFrame(player,"",folder + "/x-hit-air-0.png", 8,{Player:PLAYER_FLAGS.INVULNERABLE},{Player:PLAYER_FLAGS.MOBILE});
    hitReact_air.AddFrame(player,"",folder + "/x-f-jump-5.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_air.AddFrame(player,"",folder + "/x-f-jump-4.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_air.AddFrame(player,"",folder + "/x-f-jump-3.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_air.AddFrame(player,"",folder + "/x-f-jump-2.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_air.AddFrame(player,"",folder + "/x-jump-1.png", CONSTANTS.FRAME_MAX,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE});

    var hitReact_knockDown = player.AddAnimation(POSE_FLAGS.STANDING,"knock down",0,["hr_knockdown"],0,false);
    hitReact_knockDown.AllowJuggle = true;
    hitReact_knockDown.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_knockDown.Vx = (25);
    hitReact_knockDown.Vy = (150);
    hitReact_knockDown.AddFrame(player,"",folder + "/x-hit-shn-1.png", 8,{Player:PLAYER_FLAGS.INVULNERABLE},{Player:PLAYER_FLAGS.MOBILE},0,1);
    hitReact_knockDown.AddFrame(player,"",folder + "/x-hit-shf-0.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_knockDown.AddFrame(player,"",folder + "/x-hit-air-0.png", 12,{Player:PLAYER_FLAGS.INVULNERABLE});
    hitReact_knockDown.AddFrame(player,"",folder + "/x-hit-air-1.png", CONSTANTS.FRAME_MAX,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE});
    hitReact_knockDown.Chain(hitReact_bounce);


    var down = player.AddAnimation(MISC_FLAGS.NONE,"down",0,["hr_down"],0,false);
    down.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    down.AddFrameWithSound(player,1,"audio/misc/floored-1.zzz","200",folder + "/x-down.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE,Spawn:SPAWN_FLAGS.SPAWN_SMALLDIRT},{Player:PLAYER_FLAGS.MOBILE});

    var hitReact_deadBounce = player.AddAnimation(MISC_FLAGS.NONE,"dead bounce",0,["hr_deadbounce"],0,false);
    hitReact_deadBounce.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX | PLAYER_FLAGS.USE_CURRENT_VX });
    hitReact_deadBounce.ChainVxFunc = (function(v){ return v * 0.75; });
    hitReact_deadBounce.Vy = (80);
    hitReact_deadBounce.AddFrameWithSound(player,1,"audio/misc/floored-2.zzz","200",folder + "/x-hit-air-2.png", 4,{Player:PLAYER_FLAGS.INVULNERABLE|PLAYER_FLAGS.IGNORE_COLLISIONS,Spawn:SPAWN_FLAGS.SPAWN_BIGDIRT},{Player:PLAYER_FLAGS.MOBILE},0,1);
    hitReact_deadBounce.AddFrame(player,"200",folder + "/x-hit-air-3.png", CONSTANTS.FRAME_MAX,{Pose:POSE_FLAGS.AIRBORNE,Player:PLAYER_FLAGS.USE_ATTACK_DIRECTION|PLAYER_FLAGS.INVULNERABLE|PLAYER_FLAGS.IGNORE_ATTACKS|PLAYER_FLAGS.IGNORE_COLLISIONS},{Player:PLAYER_FLAGS.MOBILE});
    hitReact_deadBounce.Chain(down);

    var hitReact_dead = player.AddAnimation(POSE_FLAGS.STANDING,"hr dead",0,["hr_dead"],0,false);
    hitReact_dead.Flags = ({Player:PLAYER_FLAGS.MOVE_TO_FRONT});
    hitReact_dead.Vx = (35);
    hitReact_dead.Vy = (200);
    hitReact_dead.AddFrame(player,"200",folder + "/x-hit-air-0.png", 32, { Player:PLAYER_FLAGS.INVULNERABLE | PLAYER_FLAGS.IGNORE_COLLISIONS }, 0, 1);
    hitReact_dead.AddFrame(player,"200",folder + "/x-hit-air-1.png", CONSTANTS.FRAME_MAX,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE|PLAYER_FLAGS.IGNORE_COLLISIONS});
    hitReact_dead.Chain(hitReact_deadBounce);

    var hitReact_eject = player.AddAnimation(POSE_FLAGS.STANDING,"eject",0,["eject"],0,false);
    hitReact_eject.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_eject.Vx = (35);
    hitReact_eject.Vy = (200);
    hitReact_eject.AddFrame(player,"",folder + "/x-hit-air-0.png", 32,{Player:PLAYER_FLAGS.INVULNERABLE},{Player:PLAYER_FLAGS.MOBILE},0,1);
    hitReact_eject.AddFrame(player,"",folder + "/x-hit-air-1.png", CONSTANTS.FRAME_MAX,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE});
    hitReact_eject.Chain(hitReact_bounce);


    var hitReact_shoulder_throw = player.AddAnimation(POSE_FLAGS.ANY, "shoulder throw", 0, ["shoulder_throw"], 0, false);
    hitReact_shoulder_throw.IsImplicit = true;
    hitReact_shoulder_throw.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX });
    hitReact_shoulder_throw.AddFrame(player, "", folder + "/x-hit-slf-0.png", 8, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, { Player: PLAYER_FLAGS.MOBILE });
    hitReact_shoulder_throw.AddFrame(player, "", folder + "/x-hit-sln-0.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, -20, 20);
    hitReact_shoulder_throw.AddFrame(player, "", folder + "/#-hit-shf-1a.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABL }, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, -60, 180);
    hitReact_shoulder_throw.AddFrame(player, "", folder + "/#-hit-smn-0a.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, 80, 150);
    hitReact_shoulder_throw.AddFrame(player, "", folder + "/#-hit-shn-1a.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, MISC_FLAGS.NONE, -100, 100, 0, 0, 0, 0, 0);


    var hitReact_fk_throw = player.AddAnimation(POSE_FLAGS.ANY, "flip kick throw", 0, ["fk_throw"], 0, false);
    hitReact_fk_throw.IsImplicit = true;
    hitReact_fk_throw.Flags = ({ Player: PLAYER_FLAGS.HOLD_ZINDEX });
    hitReact_fk_throw.AddFrame(player, "", folder + "/x-hit-slf-0.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, { Player: PLAYER_FLAGS.MOBILE });
    hitReact_fk_throw.AddFrame(player, "", folder + "/x-hit-sln-0.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, { Player: PLAYER_FLAGS.MOBILE }, 0, 0, 0, 0, 0, -40, 0);
    hitReact_fk_throw.AddFrame(player, "", folder + "/#-hit-shf-1a.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, 0, 105);
    hitReact_fk_throw.AddFrame(player, "", folder + "/#-hit-shn-1a.png", 4, { Player: PLAYER_FLAGS.SUPER_INVULNERABLE }, MISC_FLAGS.NONE, -160, 100, 0, 0, 0, 0, 0);

    var hitReact_roll_throw = player.AddAnimation(POSE_FLAGS.ANY,"roll throw",0,["roll_throw"],0,false);
    hitReact_roll_throw.IsImplicit = true;
    hitReact_roll_throw.Flags = ({Player:PLAYER_FLAGS.HOLD_ZINDEX});
    hitReact_roll_throw.AddFrame(player,"",folder + "/x-hit-slf-0.png", 8,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},{Player:PLAYER_FLAGS.MOBILE});
    hitReact_roll_throw.AddFrame(player,"",folder + "/x-hit-sln-0.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE});
    for(var i = 0; i < 2; ++i)
    {
        hitReact_roll_throw.AddFrame(player,"",folder + "/#-hit-air-1a.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,0,0,0,0,0,-20,55);
        hitReact_roll_throw.AddFrame(player,"",folder + "/#-hit-sln-0a.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,0,0,0,0,0,60,0);
        hitReact_roll_throw.AddFrame(player,"",folder + "/x-hit-air-1.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,0,0,0,0,0,-25,0);
        hitReact_roll_throw.AddFrame(player,"",folder + "/x-hit-sln-0.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,0,0,0,0,0,0,0);
    }
    hitReact_roll_throw.AddFrame(player,"",folder + "/#-hit-shf-1a.png", 4,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,0,0,0,0,0,0,110);
    hitReact_roll_throw.AddFrame(player,"",folder + "/#-hit-shn-1a.png", 6,{Player:PLAYER_FLAGS.SUPER_INVULNERABLE},MISC_FLAGS.NONE,-160,50,0,0,0,0,0);


    var blockRelease = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.ALLOW_BLOCK,"block",0,["block_relase"],-2,false);
    blockRelease.Flags = ({Player:PLAYER_FLAGS.BLOCKING|PLAYER_FLAGS.MOVE_TO_BACK});
    blockRelease.AddFrame(player,"",folder + "/x-block-1.png",2,{Player:PLAYER_FLAGS.BLOCKING});
    blockRelease.AddFrame(player,"",folder + "/x-block-0.png",2,{Player:PLAYER_FLAGS.BLOCKING});
    /*The POSE_FLAGS.ALLOW_BLOCK is checked seperately, it absolutely must be there, or else the move will not be found!
    Only one of the other flags need to match*/
    var block = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.ALLOW_BLOCK,"block",0,[BUTTONS.BACK],-2,false);
    block.Flags = ({Player:PLAYER_FLAGS.BLOCKING,Pose:POSE_FLAGS.STANDING});
    block.AddFrame(player,"",folder + "/x-block-0.png",4,{Player:PLAYER_FLAGS.BLOCKING});
    block.AddFrame(player,"",folder + "/x-block-1.png",4,{Player:PLAYER_FLAGS.BLOCKING|PLAYER_FLAGS.MUST_HOLD_KEY});
    block.AddFrame(player,"",folder + "/x-block-1.png",4,{Player:PLAYER_FLAGS.BLOCKING|PLAYER_FLAGS.HOLD_FRAME});
    block.Chain(blockRelease);
    blockRelease.AllowInterupt(block,1,{Pose: POSE_FLAGS.ALLOW_BLOCK | POSE_FLAGS.ALLOW_BLOCK});

    
    var cblock = player.AddAnimation(POSE_FLAGS.CROUCHING|POSE_FLAGS.ALLOW_BLOCK,"crouch block",0,[BUTTONS.BACK],-1,false);
    cblock.Flags = ({Player:PLAYER_FLAGS.BLOCKING,Pose:POSE_FLAGS.CROUCHING});
    cblock.AddFrame(player,"",folder + "/x-crouch-block-0.png",4,{Player:PLAYER_FLAGS.BLOCKING});
    cblock.AddFrame(player,"",folder + "/x-crouch-block-1.png",4,{Player:PLAYER_FLAGS.BLOCKING|PLAYER_FLAGS.MUST_HOLD_KEY});
    cblock.AddFrame(player,"",folder + "/x-crouch-block-1.png",4,{Player:PLAYER_FLAGS.BLOCKING|PLAYER_FLAGS.HOLD_FRAME});
    cblock.Chain(crouch,2);

    var ablock = player.AddAnimation(POSE_FLAGS.AIRBORNE|POSE_FLAGS.AIRBORNE_FB|POSE_FLAGS.ALLOW_AIR_BLOCK,"air block",0,[BUTTONS.BACK],-1,false);
    ablock.Flags = ({Player:PLAYER_FLAGS.BLOCKING});
    ablock.AddFrame(player,"",folder + "/x-air-block-0.png",1,{Player:PLAYER_FLAGS.BLOCKING});
    ablock.AddFrame(player,"",folder + "/x-air-block-0.png",1,{Player:PLAYER_FLAGS.BLOCKING});
    ablock.Chain(jump_land);



    var p1 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"light punch",0,[BUTTONS.LIGHT_PUNCH]);
    p1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    p1.AddFrame(player, "", folder + "/x-p1-0.png", 2, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    p1.AddFrame(player, "", folder + "/x-p1-1.png", 3, { SwingSound:SWINGSOUND.LP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.LP }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.LIGHT, [{ state: HIT_FLAGS.NEAR, x: 110, y: 193 }, { state: HIT_FLAGS.FAR, x: 194, y: 193}], ATTACK_FLAGS.LIGHT,1,1,10);
    p1.EndBlock();
    p1.AddFrame(player, "", folder + "/x-p1-0.png", 3, MISC_FLAGS.NONE, MISC_FLAGS.NONE);

    var p2 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_BACKWARD,"medium punch",0,[BUTTONS.MEDIUM_PUNCH]);
    p2.SetMediumAttack();
    p2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    p2.AddFrame(player, "", folder + "/x-p2-0.png", 2, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    p2.AddFrame(player, "", folder + "/x-p2-1.png", 2, { SwingSound:SWINGSOUND.MP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.MP }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.MEDIUM, [{ state: HIT_FLAGS.NEAR, x: 130, y: 145 }, { state: HIT_FLAGS.FAR, x: 170, y: 185}], ATTACK_FLAGS.MEDIUM,1,1,15);
    p2.AddFrame(player, "", folder + "/x-p2-2.png", 5, { Combat: COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.MEDIUM, [{ state: HIT_FLAGS.NEAR, x: 150, y: 220 }, { state: HIT_FLAGS.FAR, x: 135, y: 270}], ATTACK_FLAGS.MEDIUM,1,1,15);
    p2.EndBlock();
    p2.AddFrame(player, "", folder + "/x-p2-1.png", 4);
    p2.AddFrame(player, "", folder + "/x-p2-3.png", 5);

    var f_p2 = player.AddAnimation(POSE_FLAGS.WALKING_FORWARD,"forward medium punch",0,[BUTTONS.MEDIUM_PUNCH]);
    f_p2.SetMediumAttack();
    f_p2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-0.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    f_p2.AddFrame(player,"",folder + "/x-f-p2-1.png",3,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-2.png",3,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    f_p2.AddRepeatingFrame(player,"",folder + "/x-f-p2-3.png",3,MISC_FLAGS.NONE,MISC_FLAGS.NONE,3);
    f_p2.AddRepeatingFrameWithSound(player,1,"audio/ryu/thrust-0.zzz","",folder + "/x-f-p2-4.png",3,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,2,0,0,10,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:165}],ATTACK_FLAGS.MEDIUM,CONSTANTS.FIRST_HIT,1,10);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-5.png",3,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:75},{state:HIT_FLAGS.FAR,x:160,y:145}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,10);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-6.png",3,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:75},{state:HIT_FLAGS.FAR,x:160,y:145}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,10);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-7.png",3,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:75},{state:HIT_FLAGS.FAR,x:160,y:145}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,10);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-8.png",3,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:75},{state:HIT_FLAGS.FAR,x:160,y:145}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,10);
    f_p2.AddFrame(player,"",folder + "/x-f-p2-9.png",6,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:190,y:75},{state:HIT_FLAGS.FAR,x:160,y:145}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,10);
    f_p2.EndBlock();

    var p3 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"hard punch",0,[BUTTONS.HARD_PUNCH]);
    p3.SetHardAttack();
    p3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    p3.AddFrame(player,"",folder + "/x-p2-1.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    p3.AddFrame(player,"",folder + "/x-p3-1.png",2);
    p3.AddFrame(player,"",folder + "/x-p3-2.png",4,{SwingSound:SWINGSOUND.HP,Combat:COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.HP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.NEAR,x:130,y:181},{state:HIT_FLAGS.FAR,x:215,y:181}],ATTACK_FLAGS.HARD,1,1,20);
    p3.EndBlock();
    p3.AddFrame(player,"",folder + "/x-p3-1.png",6);
    p3.AddFrame(player,"",folder + "/x-p2-3.png",8);


    var throw1X = -4;
    var throw1 = player.AddThrow(POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"throw 1",0,[BUTTONS.FORWARD|BUTTONS.MEDIUM_PUNCH],CONSTANTS.MAX_PRIORITY,false,false,0,"_1_shoulder_throw");
    throw1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.NONE,OVERRIDE_FLAGS.ALL);
    throw1.AddAlternateKeySequence([BUTTONS.FORWARD|BUTTONS.HARD_PUNCH]);
    throw1.SetGrappleDistance(100);
    throw1.SetOtherPlayerAirborneFlags(AIRBORNE_FLAGS.NO);
    throw1.AddFrame(player,"",folder + "/x-throw-0-0.png",10,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE},0,0,0,0,null,0,0,ATTACK_FLAGS.THROW_START,[{state:HIT_FLAGS.NEAR,x:130,y:145},{state:HIT_FLAGS.FAR,x:170,y:185}],ATTACK_FLAGS.NONE,1);
    throw1.AddFrame(player,"",folder + "/x-throw-0-1.png",8,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    throw1.AddFrame(player,"",folder + "/x-throw-0-2.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    throw1.AddFrameWithSound(player,1,"audio/ryu/throw-0.zzz","",folder + "/x-throw-0-3.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    throw1.AddFrame(player,"",folder + "/x-throw-0-4.png",26,{Combat:COMBAT_FLAGS.ATTACK},MISC_FLAGS.NONE,-10,0,0,100,null,0,0,ATTACK_FLAGS.THROW_EJECT,[{x:-1,y:-1,Fx:0.5,Fy:0.5}],ATTACK_FLAGS.NONE,2,1,15);


    var throw2X = -4;
    var throw2 = player.AddThrow(POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"throw 2",0,[BUTTONS.FORWARD|BUTTONS.MEDIUM_KICK],CONSTANTS.MAX_PRIORITY,false,false,0,"_1_fk_throw");
    throw2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.NONE,OVERRIDE_FLAGS.ALL);
    throw2.AddAlternateKeySequence([BUTTONS.FORWARD|BUTTONS.HARD_KICK]);
    throw2.SetGrappleDistance(100);
    throw2.SetOtherPlayerAirborneFlags(AIRBORNE_FLAGS.NO);
    throw2.AddFrame(player,"",folder + "/x-throw-0-0.png",7,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE},0,0,0,0,null,0,0,ATTACK_FLAGS.THROW_START,[{state:HIT_FLAGS.NEAR,x:130,y:145},{state:HIT_FLAGS.FAR,x:170,y:185}],ATTACK_FLAGS.NONE,1);
    throw2.AddFrame(player,"",folder + "/x-throw-1-0.png",8,MISC_FLAGS.NONE,MISC_FLAGS.NONE);
    throw2.AddFrame(player,"",folder + "/x-throw-1-1.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE,-20);
    throw2.AddFrameWithSound(player,1,"audio/ryu/throw-1.zzz","",folder + "/x-throw-1-2.png",5,{Combat:COMBAT_FLAGS.ATTACK},MISC_FLAGS.NONE,-20,0,0,100,null,0,0,ATTACK_FLAGS.THROW_EJECT,[{x:-1,y:-1,Fx:1,Fy:0.5}],ATTACK_FLAGS.NONE,2,1,15);
    throw2.AddFrame(player,"",folder + "/x-throw-1-3.png",22,MISC_FLAGS.NONE,MISC_FLAGS.NONE,20);
    throw2.AddFrame(player,"",folder + "/x-throw-1-4.png",5,MISC_FLAGS.NONE,MISC_FLAGS.NONE);



    var k1 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"light kick",0,[BUTTONS.LIGHT_KICK]);
    k1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    k1.AddFrame(player, "", folder + "/x-k1-0.png", 3, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE }, 0, 0, 0, 0, 0, 10);
    k1.AddFrame(player, "", folder + "/x-k1-1.png", 2, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, 60);
    k1.AddFrame(player, "", folder + "/x-k1-2.png", 7, { SwingSound:SWINGSOUND.LP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.LK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 80, 0, ATTACK_FLAGS.LIGHT, [{ state: HIT_FLAGS.NEAR, x: 200, y: 135 }, { state: HIT_FLAGS.NEAR, x: 250, y: 85}], ATTACK_FLAGS.LIGHT,1,1,10);
    k1.EndBlock();
    k1.AddFrame(player, "", folder + "/x-k1-1.png", 2, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, 60);
    k1.AddFrame(player, "", folder + "/x-k1-4.png", 2, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0, 0, 0, 0, 0);

    var k2 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_BACKWARD,"medium kick",0,[BUTTONS.MEDIUM_KICK]);
    k2.SetMediumAttack();
    k2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    k2.AddFrame(player,"",folder + "/x-k1-1.png",4,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE},0,0,0,0,0,10);
    k2.AddFrame(player,"",folder + "/x-k2-2.png",7,{SwingSound:SWINGSOUND.MP, Combat:COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.MK},MISC_FLAGS.NONE,0,0,0,10,null,80,0,ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.FAR,x:200,y:135},{state:HIT_FLAGS.FAR,x:200,y:285}],ATTACK_FLAGS.MEDIUM,CONSTANTS.FIRST_HIT,1,8);
    k2.AddFrame(player,"",folder + "/x-k2-3.png",5,{SwingSound:SWINGSOUND.MP, Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MK},MISC_FLAGS.NONE,0,0,0,10,null,80,0,ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:200,y:135},{state:HIT_FLAGS.NEAR,x:270,y:205}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,8);
    k2.EndBlock();
    k2.AddFrame(player,"",folder + "/x-k1-1.png",3,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0,0,0,0,40);
    k2.AddFrame(player,"",folder + "/x-k1-0.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0,0,0,0,0);

    var fwd_k2 = player.AddAnimation(POSE_FLAGS.WALKING_FORWARD,"forward medium kick",0,[BUTTONS.MEDIUM_KICK]);
    fwd_k2.SetMediumAttack();
    fwd_k2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    fwd_k2.Vy = (100);
    fwd_k2.Vx = (25);
    fwd_k2.AddFrame(player,"",folder + "/x-hk-0.png",2,{Pose:POSE_FLAGS.AIRBORNE},{Player:PLAYER_FLAGS.MOBILE});
    fwd_k2.AddFrame(player,"",folder + "/x-hk-1.png",3,MISC_FLAGS.NONE,0,0,100);
    fwd_k2.AddFrame(player,"",folder + "/x-hk-2.png",4,MISC_FLAGS.NONE,0,0,-50);
    fwd_k2.AddFrame(player,"",folder + "/x-jump-k3-2.png",2,MISC_FLAGS.NONE,0,0,0);
    fwd_k2.AddFrame(player,"",folder + "/x-jump-k3-3.png",2,MISC_FLAGS.NONE,0,0,0);
    fwd_k2.AddFrameWithSound(player,1,"audio/ryu/thrust-0.zzz","",folder + "/x-jump-k3-4.png",4,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MK},MISC_FLAGS.NONE,0,-40,0,10,null,0,0,ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:180,y:135},{state:HIT_FLAGS.NEAR,x:80,y:135}],ATTACK_FLAGS.MEDIUM,1,1,10);
    fwd_k2.EndBlock();
    fwd_k2.AddFrame(player,"",folder + "/x-jump-k3-5.png",2,MISC_FLAGS.NONE,0,0,0);
    fwd_k2.AddFrame(player,"",folder + "/x-jump-k3-6.png",4);
    fwd_k2.AddFrame(player,"",folder + "/x-jump-2.png",4);
    fwd_k2.AddFrame(player,"",folder + "/x-jump-1.png",CONSTANTS.FRAME_MAX);


    var k3 = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"hard kick",0,[BUTTONS.HARD_KICK]);
    k3.SetHardAttack();
    k3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING,OVERRIDE_FLAGS.AIRBORNE);
    k3.AddFrame(player,"",folder + "/x-k3-1.png",3,{Player:PLAYER_FLAGS.MOVE_TO_BACK},{Player:PLAYER_FLAGS.MOBILE},0,0,0,0,0,40);
    k3.AddFrame(player,"",folder + "/x-k3-2.png",4,{SwingSound:SWINGSOUND.LP, Combat:COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,10,null,10,0,ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.FAR,x:180,y:235}],ATTACK_FLAGS.HARD,1,1,20);
    k3.AddFrame(player,"",folder + "/x-k3-3.png",6,{Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,10,null,-10,0,ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.FAR,x:180,y:235}],ATTACK_FLAGS.HARD,1,1,20);
    k3.EndBlock();
    k3.AddFrame(player,"",folder + "/x-k3-4.png",3,{Player:PLAYER_FLAGS.MOVE_TO_FRONT},MISC_FLAGS.NONE,0,0,0,0,0,0);
    k3.AddFrame(player,"",folder + "/x-k3-5.png",2,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0,0,0,0,0);

    var walkSpeed = 4;
    var f_walk = player.AddAnimation(POSE_FLAGS.STANDING,"f-walk",0,[BUTTONS.FORWARD],90,false);
    f_walk.AdjustShadowPosition = (false);
    f_walk.Flags = ({Player:PLAYER_FLAGS.LOOP_IF_KEYDOWN | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.WALKING_FORWARD});
    f_walk.AddRepeatingFrame(player,"",folder + "/x-crouch-0.png",3,{Player:PLAYER_FLAGS.MOBILE},MISC_FLAGS.NONE,walkSpeed,0,0,0,18);
    f_walk.AddRepeatingFrame(player,"",folder + "/x-f-walk-1.png",4,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,walkSpeed,0,0,0,0);
    f_walk.AddRepeatingFrame(player,"",folder + "/x-k2-1.png",4,{Plyer:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,walkSpeed,0,0,0,3);
    f_walk.AddRepeatingFrame(player,"",folder + "/x-f-walk-3.png",4,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,walkSpeed,0,0,0,23);
    f_walk.AddRepeatingFrame(player,"",folder + "/x-f-walk-4.png",4,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,walkSpeed,0,0,0,32);
    f_walk.AddRepeatingFrame(player,"",folder + "/x-f-walk-5.png",4,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,walkSpeed,0,0,0,28);

    var backpeddleSpeed = 3;
    var b_walk = player.AddAnimation(POSE_FLAGS.STANDING,"b-walk",0,[BUTTONS.BACK],80,false);
    b_walk.AdjustShadowPosition = (false);
    b_walk.Flags = ({Player:PLAYER_FLAGS.LOOP_IF_KEYDOWN | PLAYER_FLAGS.HOLD_ZINDEX, Pose:POSE_FLAGS.WALKING_BACKWARD});
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-1.png",4,{Player:PLAYER_FLAGS.MOBILE},MISC_FLAGS.NONE,-backpeddleSpeed,0,0,0,0);
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-2.png",7,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,-backpeddleSpeed);
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-3.png",7,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,-backpeddleSpeed);
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-4.png",7,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,-backpeddleSpeed);
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-5.png",7,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,-backpeddleSpeed,0,0,0,-13);
    b_walk.AddRepeatingFrame(player,"",folder + "/x-b-walk-6.png",7,{Player:PLAYER_FLAGS.MUST_HOLD_KEY},MISC_FLAGS.NONE,-backpeddleSpeed,0,0,0,-16);

    var crouch_p1 = player.AddAnimation(POSE_FLAGS.CROUCHING, "crouch p1", 0, [BUTTONS.LIGHT_PUNCH], 110);
    crouch_p1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING);
    crouch_p1.AddFrame(player, "", folder + "/x-crouch-p1-1.png", 2, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_p1.AddFrame(player, "", folder + "/x-crouch-p1-2.png", 3, { SwingSound:SWINGSOUND.LP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.LP }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.LIGHT | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 110, y: 120 }, { state: HIT_FLAGS.NEAR, x: 194, y: 120}], ATTACK_FLAGS.LIGHT,1,1,10);
    crouch_p1.EndBlock();
    crouch_p1.AddFrame(player, "", folder + "/x-crouch-p1-1.png", 3, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_p1.Chain(crouch, 2);

    var crouch_p2 = player.AddAnimation(POSE_FLAGS.CROUCHING, "crouch p2", 0, [BUTTONS.MEDIUM_PUNCH], 110);
    crouch_p2.SetMediumAttack();
    crouch_p2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING);
    crouch_p2.AddFrame(player, "", folder + "/x-crouch-p2-1.png", 2, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_p2.AddFrame(player, "", folder + "/x-crouch-p2-2.png", 1);
    crouch_p2.AddFrame(player, "", folder + "/x-crouch-p2-3.png", 3, { SwingSound:SWINGSOUND.MP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.MK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.MEDIUM | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 110, y: 120 }, { state: HIT_FLAGS.NEAR, x: 194, y: 120}], ATTACK_FLAGS.MEDIUM,1,1,15);
    crouch_p2.EndBlock();
    crouch_p2.AddFrame(player, "", folder + "/x-crouch-p2-2.png", 5, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_p2.Chain(crouch, 2);

    var crouch_p3 = player.AddAnimation(POSE_FLAGS.CROUCHING|POSE_FLAGS.STANDING, "crouch p3", 0, [BUTTONS.CROUCH|BUTTONS.HARD_PUNCH], 110);
    crouch_p3.SetHardAttack();
    crouch_p3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING | OVERRIDE_FLAGS.AIRBORNE);
    crouch_p3.AddFrame(player, "", folder + "/x-crouch-p3-1.png", 3, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_p3.AddFrame(player, "", folder + "/x-crouch-p3-2.png", 3, { SwingSound:SWINGSOUND.HP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.HK }, MISC_FLAGS.NONE, 0, 0, 0, 25, null, 0, 0, ATTACK_FLAGS.HARD | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 110, y: 120 }, { state: HIT_FLAGS.NEAR, x: 150, y: 165 }, { state: HIT_FLAGS.NEAR, x: 150, y: 220}], ATTACK_FLAGS.HARD,1,1,20);
    crouch_p3.AddFrame(player, "", folder + "/x-crouch-p3-3.png", 6, { Combat: COMBAT_FLAGS.ATTACK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.HARD | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 110, y: 120 }, { state: HIT_FLAGS.NEAR, x: 110, y: 315 }, { state: HIT_FLAGS.NEAR, x: 90, y: 315}], ATTACK_FLAGS.HARD,1,1,20);
    crouch_p3.EndBlock();
    crouch_p3.AddFrame(player, "", folder + "/x-crouch-p3-2.png", 8, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_p3.Chain(crouch, 2);

    var crouch_k1 = player.AddAnimation(POSE_FLAGS.CROUCHING, "crouch k1", 0, [BUTTONS.LIGHT_KICK], 110);
    crouch_k1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING);
    crouch_k1.AddFrame(player, "", folder + "/x-crouch-k1-1.png", 3, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_k1.AddFrame(player, "", folder + "/x-crouch-k1-2.png", 5, { SwingSound:SWINGSOUND.LP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.LK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.LIGHT | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 110, y: 40 }, { state: HIT_FLAGS.NEAR, x: 210, y: 1}], ATTACK_FLAGS.LIGHT,1,1,10);
    crouch_k1.EndBlock();
    crouch_k1.AddFrame(player, "", folder + "/x-crouch-k1-1.png", 3, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_k1.Chain(crouch, 2);

    var crouch_k2 = player.AddAnimation(POSE_FLAGS.CROUCHING, "crouch k2", 0, [BUTTONS.MEDIUM_KICK], 110);
    crouch_k2.SetMediumAttack();
    crouch_k2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING);
    crouch_k2.AddFrame(player, "168", folder + "/x-crouch-k1-1.png", 2, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_k2.AddFrame(player, "168", folder + "/x-crouch-k2-2.png", 1);
    crouch_k2.AddFrame(player, "264", folder + "/x-crouch-k2-3.png", 5, { SwingSound:SWINGSOUND.MP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1|POSE_FLAGS.ALLOW_INTERUPT_2, HitSound:HITSOUND.MK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.MEDIUM | ATTACK_FLAGS.HITS_LOW, [{ state: HIT_FLAGS.NEAR, x: 140, y: 35 }, { state: HIT_FLAGS.NEAR, x: 185, y: 30 }, { state: HIT_FLAGS.NEAR, x: 260, y: 1}], ATTACK_FLAGS.MEDIUM,1,1,15);
    crouch_k2.EndBlock();
    crouch_k2.AddFrame(player, "168", folder + "/x-crouch-k2-2.png", 3);
    crouch_k2.AddFrame(player, "168", folder + "/x-crouch-k1-1.png", 3, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_k2.Chain(crouch, 2);

    var crouch_k3 = player.AddAnimation(POSE_FLAGS.CROUCHING|POSE_FLAGS.STANDING|POSE_FLAGS.ALLOW_INTERUPT_2, "crouch k3", 0, [BUTTONS.CROUCH|BUTTONS.HARD_KICK], 110);
    crouch_k3.SetHardAttack();
    crouch_k3.Flags = ({Combat:COMBAT_FLAGS.NO_SLIDE_BACK});
    crouch_k3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.CROUCHING, OVERRIDE_FLAGS.STANDING);
    crouch_k3.AddFrame(player, "", folder + "/x-crouch-k3-1.png", 3, MISC_FLAGS.NONE, { Player: PLAYER_FLAGS.MOBILE });
    crouch_k3.AddFrame(player, "", folder + "/x-crouch-k3-2.png", 5, { SwingSound:SWINGSOUND.HP, Combat: COMBAT_FLAGS.ATTACK, Pose: POSE_FLAGS.ALLOW_INTERUPT_1, HitSound:HITSOUND.HK }, MISC_FLAGS.NONE, 0, 0, 0, 10, null, 0, 0, ATTACK_FLAGS.HARD | ATTACK_FLAGS.HITS_LOW | ATTACK_FLAGS.TRIP, [{ state: HIT_FLAGS.NEAR, x: 160, y: 35 }, { state: HIT_FLAGS.FAR, x: 250, y: 35}], ATTACK_FLAGS.HARD,1,1,20);
    crouch_k3.EndBlock();
    crouch_k3.AddFrame(player, "", folder + "/x-crouch-k3-3.png", 4);
    crouch_k3.AddFrame(player, "", folder + "/x-crouch-k3-4.png", 6);
    crouch_k3.AddFrame(player, "", folder + "/x-crouch-k3-5.png", 8, MISC_FLAGS.NONE, MISC_FLAGS.NONE);
    crouch_k3.Chain(crouch, 2);

    var uppercutVelocityY = 120;
    var uppercutVelocityYRate = 50;

    var uppercut_land = player.AddAnimation(MISC_FLAGS.NONE,"uppercut landing",200,["uppercut-landing"],0,false,false);
    uppercut_land.AddFrameWithSound(player,1,"audio/misc/jump-land.zzz","",folder + "/x-uppercut-p1-6.png",4,{Player:PLAYER_FLAGS.MOBILE},MISC_FLAGS.NONE);
    for(var x = 0; x < 3; ++x)
    {
        var button = BUTTONS.LIGHT_PUNCH;
        if(x == 1) {button = BUTTONS.MEDIUM_PUNCH;}
        else if(x == 2) {button = BUTTONS.HARD_PUNCH;}

        var uppercut = player.AddAnimation(POSE_FLAGS.CROUCHING|POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.ALLOW_INTERUPT_1,"uppercut p" + (x+1),200,[BUTTONS.FORWARD,0,BUTTONS.CROUCH,BUTTONS.CROUCH|BUTTONS.FORWARD,BUTTONS.FORWARD|button],999,true,true);
        uppercut.IsSpecialMove = true;

        uppercut.EnergyToAdd = (5);
        uppercut.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.NONE,OVERRIDE_FLAGS.ALL | OVERRIDE_FLAGS.THROW);

        /*the following function will be executed each frame to compute the X coordinate of this move*/
        uppercut.VxFn = (function(args)
        {
            var count = 0;
            return function(dx,t)
            {
                dx = Math.min(args.xMax/(count+=(args.xInc)),args.valueMax);
                if(dx <= args.xMin) dx = 0;

                return dx;
            }
        });

        if(x == 0)
        {
            uppercut.Vy = (160);
            /*the following object will be passed in to the function that will be used to compute the X coordinate*/
            uppercut.VxFnArgs = {xMax:30,xMin:3,xInc:1.8,valueMax:10};
        }
        else if(x == 1)
        {
            uppercut.Vy = (190);
            /*the following object will be passed in to the function that will be used to compute the X coordinate*/
            uppercut.VxFnArgs = {xMax:40,xMin:3,xInc:1.8,valueMax:10};
        }
        else if(x == 2)
        {
            uppercut.Vy = (220);
            /*the following object will be passed in to the function that will be used to compute the X coordinate*/
            uppercut.VxFnArgs = {xMax:70,xMin:3,xInc:1.8,valueMax:10};
        }

        uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-1.png",3,{Combat:COMBAT_FLAGS.CAN_BE_BLOCKED | COMBAT_FLAGS.STOP_SLIDE_BACK ,Player:PLAYER_FLAGS.IGNORE_PROJECTILES, HitSound:HITSOUND.HP3},{Player:PLAYER_FLAGS.MOBILE});
        uppercut.AddFrameWithSound(player,1,"audio/ryu/shoryuken.zzz","",folder + "/x-uppercut-p1-2.png",3,{Combat:COMBAT_FLAGS.ATTACK,Player:PLAYER_FLAGS.IGNORE_PROJECTILES,HitSound:HITSOUND.HP3},MISC_FLAGS.NONE,0,0,0,75,null,0,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.KNOCKDOWN,[{state:HIT_FLAGS.NEAR,x:170,y:177}],ATTACK_FLAGS.MEDIUM|ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE,25);
        uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-3.png",1,{Combat:COMBAT_FLAGS.ATTACK,Player:PLAYER_FLAGS.IGNORE_PROJECTILES,Pose:POSE_FLAGS.AIRBORNE,HitSound:HITSOUND.HP3},MISC_FLAGS.NONE,0,0,0,75,null,0,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.KNOCKDOWN,[{state:HIT_FLAGS.FAR,x:130,y:127},{state:HIT_FLAGS.FAR,x:110,y:227},{state:HIT_FLAGS.FAR,x:100,y:322}],ATTACK_FLAGS.MEDIUM|ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE,25);
        if(x == 0)
            uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-3.png",10,{Combat:COMBAT_FLAGS.ATTACK,Player:PLAYER_FLAGS.IGNORE_PROJECTILES,HitSound:HITSOUND.HP3},MISC_FLAGS.NONE,0,0,0,75,null,0,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.KNOCKDOWN,[{state:HIT_FLAGS.FAR,x:130,y:127},{state:HIT_FLAGS.FAR,x:110,y:227},{state:HIT_FLAGS.FAR,x:100,y:322}],ATTACK_FLAGS.MEDIUM|ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE,25);
        else if(x == 1)
            uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-3.png",14,{Combat:COMBAT_FLAGS.ATTACK,Player:PLAYER_FLAGS.IGNORE_PROJECTILES,HitSound:HITSOUND.HP3},MISC_FLAGS.NONE,0,0,0,75,null,0,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.KNOCKDOWN,[{state:HIT_FLAGS.FAR,x:130,y:127},{state:HIT_FLAGS.FAR,x:110,y:227},{state:HIT_FLAGS.FAR,x:100,y:322}],ATTACK_FLAGS.MEDIUM|ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE,25);
        else if(x == 2)
            uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-3.png",18,{Combat:COMBAT_FLAGS.ATTACK,Player:PLAYER_FLAGS.IGNORE_PROJECTILES,HitSound:HITSOUND.HP3},MISC_FLAGS.NONE,0,0,0,75,null,0,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.KNOCKDOWN,[{state:HIT_FLAGS.FAR,x:130,y:127},{state:HIT_FLAGS.FAR,x:110,y:227},{state:HIT_FLAGS.FAR,x:100,y:322}],ATTACK_FLAGS.MEDIUM|ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE,25);
        uppercut.EndBlock();
        uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-4.png",5,{Player: PLAYER_FLAGS.IGNORE_MOVE_OVERRIDE},{Combat:COMBAT_FLAGS.CAN_BE_AIR_BLOCKED});
        uppercut.AddFrame(player,"",folder + "/x-uppercut-p1-5.png",CONSTANTS.FRAME_MAX,{Player: PLAYER_FLAGS.IGNORE_MOVE_OVERRIDE},MISC_FLAGS.NONE);
        uppercut.Chain(uppercut_land);
    }


    var jumpX = 32;
    var jumpY = 200;

    var jump = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"jump",0,[BUTTONS.JUMP],95,false);
    jump.Flags = ({Player:PLAYER_FLAGS.LOOP_IF_KEYDOWN});
    jump.Vy = (jumpY);
    jump.UserData = { Type: USER_DATA_TYPES.OFFSET, topOffset: 0, bottomOffset: 80 };

    jump.AddRepeatingFrame(player,"",folder + "/x-crouch-0.png",4);
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", 6, { Pose: POSE_FLAGS.AIRBORNE, Player: PLAYER_FLAGS.SMALLER_AABB });
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-2.png", 6, { Player: PLAYER_FLAGS.SMALLER_AABB });
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-3.png", 6);
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-4.png", 6);
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-3.png", 6);
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-2.png", 6);
    jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", CONSTANTS.FRAME_MAX);
    jump.Chain(jump_land);

    var airKnockBackX = 0.2;

    
    var jump_p1 = player.AddAnimation(POSE_FLAGS.AIRBORNE|POSE_FLAGS.AIRBORNE_FB,"jump p1",0,[BUTTONS.LIGHT_PUNCH],0,true,true);
    jump_p1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_p1.AddFrame(player,"",folder + "/x-jump-p1-1.png",2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_p1.AddFrame(player,"",folder + "/x-jump-p1-2.png",24,{SwingSound:SWINGSOUND.LP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.LP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.LIGHT,[{state:HIT_FLAGS.NEAR,x:160,y:75, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.LIGHT,1,1,10);
    jump_p1.EndBlock();
    jump_p1.AddFrame(player,"",folder + "/x-jump-p1-1.png",CONSTANTS.FRAME_MAX);
    jump_p1.Chain(jump_land);
    
    var jump_p2 = player.AddAnimation(POSE_FLAGS.AIRBORNE|POSE_FLAGS.AIRBORNE_FB,"jump p2",0,[BUTTONS.MEDIUM_PUNCH],0,true,true);
    jump_p2.SetMediumAttack();
    jump_p2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_p2.AddFrame(player,"",folder + "/x-jump-p1-1.png",2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_p2.AddFrame(player,"",folder + "/x-jump-p2-1.png",2);
    jump_p2.AddFrame(player,"",folder + "/x-jump-p2-2.png",15,{SwingSound:SWINGSOUND.MP,Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:180,y:55, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.MEDIUM,1,1,15);
    jump_p2.EndBlock();
    jump_p2.AddFrame(player,"",folder + "/x-jump-p1-1.png",CONSTANTS.FRAME_MAX);
    jump_p2.Chain(jump_land);
      
    var f_jump_p2 = player.AddAnimation(POSE_FLAGS.AIRBORNE_FB,"forward jump p2",0,[BUTTONS.FORWARD,BUTTONS.MEDIUM_PUNCH],0,true,true);
    f_jump_p2.SetMediumAttack();
    f_jump_p2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-1.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-2.png",1);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-3.png",3);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-4.png",2,{Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:180,y:105, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.MEDIUM,CONSTANTS.FIRST_HIT,1,8);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-5.png",12,{SwingSound:SWINGSOUND.MP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.MP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:160,y:225, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:160,y:155, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.MEDIUM,CONSTANTS.SECOND_HIT,1,8);
    f_jump_p2.EndBlock();
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-4.png",2);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-3.png",2);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-2.png",3);
    f_jump_p2.AddFrame(player,"",folder + "/x-f-jump-p2-1.png",CONSTANTS.FRAME_MAX);
    f_jump_p2.Chain(jump_land);
  
    var jump_p3 = player.AddAnimation(POSE_FLAGS.AIRBORNE|POSE_FLAGS.AIRBORNE_FB,"jump p3",0,[BUTTONS.HARD_PUNCH],0,true,true);
    jump_p3.SetHardAttack();
    jump_p3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_p3.AddFrame(player,"",folder + "/x-jump-p1-1.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_p3.AddFrame(player,"",folder + "/x-jump-p2-1.png",3);
    jump_p3.AddFrame(player,"",folder + "/x-jump-p2-2.png",6,{SwingSound:SWINGSOUND.HP,Combat:COMBAT_FLAGS.ATTACK,HitSwingSound:HITSOUND.HP},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.NEAR,x:180,y:55, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.HARD,1,1,20);
    jump_p3.EndBlock();
    jump_p3.AddFrame(player,"",folder + "/x-jump-p1-1.png",CONSTANTS.FRAME_MAX);
    jump_p3.Chain(jump_land);
    
    var jump_k1 = player.AddAnimation(POSE_FLAGS.AIRBORNE,"jump k1",0,[BUTTONS.LIGHT_KICK],0,true,true);
    jump_k1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_k1.AddFrame(player,"",folder + "/x-jump-k1-1.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_k1.AddFrame(player,"",folder + "/x-jump-k1-2.png",24,{SwingSound:SWINGSOUND.LP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.LK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.LIGHT,[{state:HIT_FLAGS.NEAR,x:140,y:235, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:90,y:155, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.LIGHT,1,1,10);
    jump_k1.EndBlock();
    jump_k1.AddFrame(player,"",folder + "/x-jump-k1-3.png",3);
    jump_k1.AddFrame(player,"",folder + "/x-jump-k1-1.png",CONSTANTS.FRAME_MAX);
    jump_k1.Chain(jump_land);
    
    var jump_k2 = player.AddAnimation(POSE_FLAGS.AIRBORNE,"jump k2",0,[BUTTONS.MEDIUM_KICK],0,true,true);
    jump_k2.SetMediumAttack();
    jump_k2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_k2.AddFrame(player,"",folder + "/x-jump-k1-1.png",3,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_k2.AddFrame(player,"",folder + "/x-jump-k1-2.png",4,{SwingSound:SWINGSOUND.MP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.MK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:140,y:235, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:90,y:155, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.MEDIUM,1,1,15);
    jump_k2.EndBlock();
    jump_k2.AddFrame(player,"",folder + "/x-jump-k1-3.png",5);
    jump_k2.AddFrame(player,"",folder + "/x-jump-k1-1.png",1);
    jump_k2.AddFrame(player,"",folder + "/x-jump-2.png",2);
    jump_k2.AddFrame(player,"",folder + "/x-jump-1.png",CONSTANTS.FRAME_MAX);
    jump_k2.Chain(jump_land);
    
    var jump_k3 = player.AddAnimation(POSE_FLAGS.AIRBORNE,"jump k3",0,[BUTTONS.HARD_KICK],0,true,true);
    jump_k3.SetHardAttack();
    jump_k3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-1.png",2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-2.png",3);
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-3.png",4);
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-4.png",6,{SwingSound:SWINGSOUND.HP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.NEAR,x:180,y:135, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:80,y:135, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.HARD,1,1,20);
    jump_k3.EndBlock();
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-5.png",4);
    jump_k3.AddFrame(player,"",folder + "/x-jump-k3-6.png",3);
    jump_k3.AddFrame(player,"",folder + "/x-jump-1.png",CONSTANTS.FRAME_MAX);
    jump_k3.Chain(jump_land);
    
    var f_jump_k1 = player.AddAnimation(POSE_FLAGS.AIRBORNE_FB,"f jump k1",0,[BUTTONS.LIGHT_KICK],0,true,true);
    f_jump_k1.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    f_jump_k1.AddFrame(player,"",folder + "/x-f-jump-k1-1.png",4,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    f_jump_k1.AddFrame(player,"",folder + "/x-f-jump-k1-2.png",4);
    f_jump_k1.AddFrame(player,"",folder + "/x-f-jump-k1-3.png",CONSTANTS.FRAME_MAX,{SwingSound:SWINGSOUND.LP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.LK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.LIGHT,[{state:HIT_FLAGS.NEAR,x:140,y:15, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:100,y:0, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.LIGHT,1,1,10);
    f_jump_k1.EndBlock();
    f_jump_k1.Chain(jump_land);
    
    var f_jump_k2 = player.AddAnimation(POSE_FLAGS.AIRBORNE_FB,"f jump k2",0,[BUTTONS.MEDIUM_KICK],0,true,true);
    f_jump_k2.SetMediumAttack();
    f_jump_k2.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    f_jump_k2.AddFrame(player,"",folder + "/x-f-jump-k1-1.png",2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    f_jump_k2.AddFrame(player,"",folder + "/x-f-jump-k3-1.png",3);
    f_jump_k2.AddFrame(player,"",folder + "/x-f-jump-k3-2.png",12,{SwingSound:SWINGSOUND.MP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.MK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.MEDIUM,[{state:HIT_FLAGS.NEAR,x:230,y:0, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:130,y:20, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.MEDIUM,1,1,15);
    f_jump_k2.EndBlock();
    f_jump_k2.AddFrame(player,"",folder + "/x-f-jump-k3-1.png",5);
    f_jump_k2.AddFrame(player,"",folder + "/x-f-jump-k1-1.png",CONSTANTS.FRAME_MAX);
    f_jump_k2.Chain(jump_land);
    
    var f_jump_k3 = player.AddAnimation(POSE_FLAGS.AIRBORNE_FB,"f jump k3",0,[BUTTONS.HARD_KICK],0,true,true);
    f_jump_k3.SetHardAttack();
    f_jump_k3.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
    f_jump_k3.AddFrame(player,"",folder + "/x-f-jump-k1-1.png",2,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
    f_jump_k3.AddFrame(player,"",folder + "/x-f-jump-k3-1.png",2);
    f_jump_k3.AddFrame(player,"",folder + "/x-f-jump-k3-2.png",6,{SwingSound:SWINGSOUND.HP,Combat:COMBAT_FLAGS.ATTACK,HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,10,null,0,0,ATTACK_FLAGS.HITS_HIGH|ATTACK_FLAGS.HARD,[{state:HIT_FLAGS.NEAR,x:230,y:0, Fx : airKnockBackX, Fy : 0},{state:HIT_FLAGS.NEAR,x:130,y:20, Fx : airKnockBackX, Fy : 0}],ATTACK_FLAGS.HARD,1,1,15);
    f_jump_k3.EndBlock();
    f_jump_k3.AddFrame(player,"",folder + "/x-f-jump-k3-1.png",6);
    f_jump_k3.AddFrame(player,"",folder + "/x-f-jump-k1-1.png",CONSTANTS.FRAME_MAX);
    f_jump_k3.Chain(jump_land);


    var f_jump = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"forward jump",0,[BUTTONS.FORWARD|BUTTONS.JUMP],95,false);
    f_jump.Flags = ({Player:PLAYER_FLAGS.LOOP_IF_KEYDOWN});
    f_jump.AdjustShadowPosition = (false);
    f_jump.UserData = {Type:USER_DATA_TYPES.OFFSET,topOffset:0,bottomOffset:125};
    f_jump.Vx = (jumpX);
    f_jump.Vy = (jumpY);

    f_jump.AddRepeatingFrame(player, "", folder + "/x-crouch-0.png", 4);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", 3, {Pose: POSE_FLAGS.AIRBORNE_FB}, MISC_FLAGS.NONE, 0, -1);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-2.png", 12,{Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -1);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-3.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 80);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-3.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-4.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -14);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-4.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-5.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -12, 0, 0, -50);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-5.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-6.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -12, 0, 0, 0);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-6.png", 5, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -12);
    f_jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", CONSTANTS.FRAME_MAX, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0);
    f_jump.Chain(jump_land);


    var b_jump = player.AddAnimation(POSE_FLAGS.STANDING | POSE_FLAGS.WALKING_FORWARD | POSE_FLAGS.WALKING_BACKWARD, "back jump", 0, [BUTTONS.BACK | BUTTONS.JUMP], 95, false);
    b_jump.Flags = ({ Player: PLAYER_FLAGS.LOOP_IF_KEYDOWN });
    b_jump.AdjustShadowPosition = (false);
    b_jump.UserData = { Type: USER_DATA_TYPES.OFFSET, topOffset: 0, bottomOffset: 125 };
    b_jump.Vx = (-jumpX);
    b_jump.Vy = (jumpY);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-crouch-0.png", 4);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-jump-2.png", 1, {Pose: POSE_FLAGS.AIRBORNE_FB}, MISC_FLAGS.NONE, 0, -1);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-jump-2.png", 2,{Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -1);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-6.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 80);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-6.png", 8, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-5.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -14);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-5.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-4.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -12);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-4.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-3.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -12, 0, 0, -50);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-3.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-2.png", 1, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, -80, 0, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-f-jump-2.png", 2, {Player: PLAYER_FLAGS.SMALLER_AABB}, MISC_FLAGS.NONE, 0, 0);
    b_jump.AddRepeatingFrame(player, "", folder + "/x-jump-1.png", CONSTANTS.FRAME_MAX, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0);
    b_jump.Chain(jump_land);

    var xSpeed = 0;
    for(var x = 0; x < 3; ++x)
    {
        xSpeed = x + 10;
        var projectile = player.AddProjectile("projectile",160,140,xSpeed);

        projectile.hitSound_ = HITSOUND.HP3;

        projectile.fx_ = 0.5;
        projectile.fy_ = 0.5;


        projectile.EnergyToAdd = (10);
        projectile.attackState_ = ATTACK_FLAGS.HARD|ATTACK_FLAGS.FLOOR_AIRBORNE_HARD;
        projectile.hitState_ = HIT_FLAGS.FAR;
        projectile.flagsToSend_ = ATTACK_FLAGS.HARD|ATTACK_FLAGS.REAR;
        if(x == 0)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SPECIAL1;
        else if(x == 1)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SPECIAL2;
        else if(x == 2)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SPECIAL3;

        projectile.baseDamage_ = 25;

        /*this formula is applied each frame to compute the X coordinate of the projectile*/
        projectile.animation_.VxFn = (function(args) { return function(xSpeed,t) { return xSpeed; } });
        /*this formula is applied each frame to compute the Y coordinate of the projectile*/
        projectile.animation_.VyFn = (function(args) { return function(ySpeed,t) { return ySpeed; } });

        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-1.png",1,0,0,30);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-2.png",2,0,0,0);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-3.png",1,0,0,50);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-4.png",2,0,0,0);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-5.png",1,0,0,30);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-6.png",2,0,0,0);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-7.png",1,0,0,40);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectile-8.png",2,0,0,0);

        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-0.png",3,0,0,-32);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-1.png",3,0,0,-44);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-2.png",3,0,0,-20);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-3.png",3,0,0,-6);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-4.png",3,0,0,-2);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-5.png",3,0,0,0);

        
        var button = BUTTONS.LIGHT_PUNCH;
        if(x == 1) {button = BUTTONS.MEDIUM_PUNCH;}
        else if(x == 2) {button = BUTTONS.HARD_PUNCH;}

        var fireball = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.ALLOW_INTERUPT_1,"fireball p" + (x+1),50,[BUTTONS.CROUCH, BUTTONS.CROUCH|BUTTONS.FORWARD, BUTTONS.FORWARD, BUTTONS.FORWARD|button],0,false);
        fireball.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.ALL,OVERRIDE_FLAGS.NONE);
        fireball.IsSpecialMove = true;
        fireball.EnergyToAdd = (5);
        fireball.Flags = ({Combat:COMBAT_FLAGS.PROJECTILE_ACTIVE});
        fireball.AddFrame(player,"",folder + "/x-fb-0.png",1,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE});
        fireball.AddFrame(player,"168",folder + "/x-fb-1.png",6);
        fireball.AddFrame(player,"200",folder + "/x-fb-2.png",2);
        fireball.AddFrameWithSound(player,1,"audio/ryu/haduken.zzz","200",folder + "/x-fb-3.png",1,{Combat:COMBAT_FLAGS.SPAWN_PROJECTILE|COMBAT_FLAGS.PROJECTILE_ACTIVE|COMBAT_FLAGS.STOP_SLIDE_BACK},0,0,0,0,0,x);
        fireball.AddFrameWithSound(player,1,"audio/misc/projectile-0.zzz","200",folder + "/x-fb-3.png",29);
        fireball.AddFrame(player,"",folder + "/x-k1-4.png",5);
    }

    var k1_spinkickX = 2.0;
    for(var x = 0; x < 3; ++x)
    {
        var button = BUTTONS.LIGHT_KICK;
        if(x == 1) button = BUTTONS.MEDIUM_KICK;
        else if(x == 2) button = BUTTONS.HARD_KICK;

        var spinkick = player.AddAnimation(POSE_FLAGS.AIRBORNE|POSE_FLAGS.AIRBORNE_FB|POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.ALLOW_INTERUPT_1,"spinkick k" + (x+1),100,[BUTTONS.CROUCH, BUTTONS.CROUCH|BUTTONS.BACK,BUTTONS.BACK, BUTTONS.BACK|button],0,true,true);
        spinkick.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.STANDING,OVERRIDE_FLAGS.NULL);
        spinkick.EnergyToAdd = (5);
        spinkick.IsSpecialMove = true;
        spinkick.AdjustShadowPosition = (false);
        spinkick.UserData = { Type: USER_DATA_TYPES.OFFSET, topOffset: 0, bottomOffset: 80 };
        spinkick.Vy = (100);
        spinkick.Vx = (20);

        /*the following object will be passed in to the function that will be used to compute the X coordinate*/
        spinkick.VxFnArgs = {};
        /*the following function will be executed each frame to compute the X coordinate of this move*/
        spinkick.VxFn = (function(args) { return function(dx,t) { return dx * 2; } });

        spinkick.VxAirFn = (function(args) { return function(dx, t) { return (!dx ? 1 : dx) * 1.5; } });
        spinkick.VyAirFn = (function(args) { return function(dy, t) { return dy; } });
        
        var hit = 0;
        var nbFrames = 2;
        var baseDamage = 20;
        var rearFlags = ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2|ATTACK_FLAGS.HARD;
        spinkick.AddFrameWithSound(player,1,"audio/ryu/spinkick.zzz","",folder + "/x-hk-0.png",1,{Player:PLAYER_FLAGS.SMALLER_AABB,Pose:POSE_FLAGS.AIRBORNE, HitSound:HITSOUND.HK},{Player:PLAYER_FLAGS.MOBILE});
        spinkick.AddFrame(player,"",folder + "/x-hk-0.png",1,{Player:PLAYER_FLAGS.SMALLER_AABB},MISC_FLAGS.NONE);
        spinkick.AddFrame(player,"",folder + "/x-hk-1.png",3,{Player:PLAYER_FLAGS.SMALLER_AABB},0,0,100);
        spinkick.AddFrame(player,"",folder + "/x-hk-2.png",2,{Player:PLAYER_FLAGS.SMALLER_AABB},0,0,-50);
        spinkick.AddFrameWithSound(player,1,"audio/misc/spinkick-0.zzz","",folder + "/x-hk-3.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB,Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,baseDamage,null,40,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.TRIP,[{state:HIT_FLAGS.NEAR, x:230, y:97}, {state:HIT_FLAGS.NEAR, x:140, y:97}, {state:HIT_FLAGS.NEAR,x:230,y:127},{state:HIT_FLAGS.NEAR,x:140,y:127}],rearFlags,CONSTANTS.FIRST_HIT,CONSTANTS.SINGLE, 1, 2);
        spinkick.AddFrame(player,"",folder + "/x-hk-4.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB});
        spinkick.AddFrame(player,"",folder + "/x-hk-5.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB,Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,baseDamage,null,-60,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.TRIP,[{state:HIT_FLAGS.NEAR, x:-60, y:97 }, { state:HIT_FLAGS.NEAR, x:-30, y:97},{state:HIT_FLAGS.NEAR,x:-60,y:127},{state:HIT_FLAGS.NEAR,x:30,y:127}],rearFlags,++hit,CONSTANTS.SINGLE, 1, 2);
        spinkick.AddFrame(player,"",folder + "/x-hk-6.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB},0,0,0,0,0,null,+40);

        for(var i = 0; i < (1 + x); ++i)
        {
            spinkick.AddFrameWithSound(player,1,"audio/misc/spinkick-0.zzz","",folder + "/x-hk-3.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB,Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,baseDamage,null,40,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.TRIP,[{state:HIT_FLAGS.NEAR, x:230, y:97 }, { state:HIT_FLAGS.NEAR, x:140, y:97},{state:HIT_FLAGS.NEAR,x:230,y:127},{state:HIT_FLAGS.NEAR,x:140,y:127}],rearFlags,++hit,CONSTANTS.SINGLE, 1, 2);
            spinkick.AddFrame(player,"",folder + "/x-hk-4.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB});
            spinkick.AddFrame(player,"",folder + "/x-hk-5.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB,Combat:COMBAT_FLAGS.ATTACK, HitSound:HITSOUND.HK},MISC_FLAGS.NONE,0,0,0,baseDamage,null,-30,0,ATTACK_FLAGS.SPECIAL|ATTACK_FLAGS.HARD|ATTACK_FLAGS.TRIP,[{state:HIT_FLAGS.NEAR, x:-30, y:97 }, { state:HIT_FLAGS.NEAR, x:30, y:97},{state:HIT_FLAGS.NEAR,x:-30,y:127},{state:HIT_FLAGS.NEAR,x:30,y:127}],rearFlags,++hit,CONSTANTS.SINGLE, 1, 2);
            spinkick.AddFrame(player,"",folder + "/x-hk-6.png",2,{Pose:POSE_FLAGS.HOLD_AIRBORNE, Player:PLAYER_FLAGS.SMALLER_AABB},0,0,0,0,0,null,+40);
        }

        spinkick.EndBlock();
        spinkick.AddFrameWithSound(player,1,"audio/misc/spinkick-0.zzz","",folder + "/x-hk-7.png",4,MISC_FLAGS.NONE,{Pose: POSE_FLAGS.AIRBORNE, Combat:COMBAT_FLAGS.CAN_BE_AIR_BLOCKED},0,0);
        spinkick.AddFrame(player,"",folder + "/x-hk-8.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0);
        spinkick.AddFrame(player,"",folder + "/x-hk-9.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0);
        spinkick.AddFrame(player,"",folder + "/x-hk-10.png",4,MISC_FLAGS.NONE,MISC_FLAGS.NONE,0,0);
        spinkick.AddFrame(player,"",folder + "/x-jump-1.png",CONSTANTS.MAX_FRAME, MISC_FLAGS.NONE, MISC_FLAGS.NONE, 0, 0);
        spinkick.Chain(jump_land);
    }

    this.CreateRyuSuperMoves(player);

    return player;
}


Player.prototype.CreateRyuSuperMoves = function(player)
{
    var folder = "images/misc/" + player.folder_;

    var speed = 13;
    for(var x = 0; x < 3; ++x)
    {
        var projectile = player.AddProjectile("super projectile",160,140,speed);
        projectile.hitSound_ = HITSOUND.HP;

        projectile.canJuggle_ = true;
        projectile.maxHits_ = x + 3;
        projectile.hitStopFrameCount_ = 5;
        projectile.attackState_ = ATTACK_FLAGS.HARD|ATTACK_FLAGS.FLOOR_AIRBORNE_HARD;
        projectile.hitState_ = HIT_FLAGS.NEAR;
        projectile.flagsToSend_ = ATTACK_FLAGS.HARD;
        projectile.EnergyToAdd = (10);
        if(x == 0)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SUPER|ATTACK_FLAGS.PROJECTILE;
        else if(x == 1)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SUPER|ATTACK_FLAGS.PROJECTILE;
        else if(x == 2)
            projectile.flagsToSend_ |= ATTACK_FLAGS.SUPER|ATTACK_FLAGS.PROJECTILE;

        projectile.baseDamage_ = 25;

        /*this formula is applied each frame to compute the X coordinate of the projectile*/
        projectile.animation_.VxFn = (function(args) { return function(xSpeed,t) { return xSpeed; } });
        /*this formula is applied each frame to compute the Y coordinate of the projectile*/
        projectile.animation_.VyFn = (function(args) { return function(ySpeed,t) { return ySpeed; } });

        var fOffset = -70;
        var f1 = fOffset + 70;
        var f2 = fOffset + 46;
        var f3 = fOffset + 76;
        var f4 = fOffset + 40;
        var f5 = fOffset + 96;
        var f6 = fOffset + 0;
        var f7 = fOffset + 78;
        var f8 = fOffset + 36;

        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-1.png",1,0,0,f1);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-2.png",2,0,0,f2);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-3.png",1,0,0,f3);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-4.png",2,0,0,f4);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-5.png",1,0,0,f5);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-6.png",2,0,0,f6);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-7.png",1,0,0,f7);
        projectile.animation_.AddFrame(player,"",folder + "/x-fb-projectiles-super-8.png",2,0,0,f8);

        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-0.png",3,0,0,0,0);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-1.png",3,0,0,0,0);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-2.png",3,0,0,0,0);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-3.png",3,0,0,0,0);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-4.png",3,0,0,0,0);
        projectile.disintegrationAnimation_.AddFrame(player,"",folder + "/x-fb-projectile-hit-5.png",3,0,0,0,0);

        
        var button = BUTTONS.LIGHT_PUNCH;
        if(x == 1) {button = BUTTONS.MEDIUM_PUNCH;}
        else if(x == 2) {button = BUTTONS.HARD_PUNCH;}

        var s_fireball = player.AddAnimation(POSE_FLAGS.STANDING|POSE_FLAGS.CROUCHING|POSE_FLAGS.WALKING_BACKWARD|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.ALLOW_INTERUPT_1,"super fireball p" + (x+1),50,[BUTTONS.CROUCH, BUTTONS.CROUCH|BUTTONS.FORWARD, BUTTONS.FORWARD,0,BUTTONS.CROUCH, BUTTONS.CROUCH|BUTTONS.FORWARD, BUTTONS.FORWARD, BUTTONS.FORWARD|button],CONSTANTS.MAX_PRIORITY,false);
        s_fireball.IsSuperMove = true;
        s_fireball.OverrideFlags = new MoveOverrideFlags(OVERRIDE_FLAGS.NONE,OVERRIDE_FLAGS.NONE);


        s_fireball.energyToSubtract_ = CONSTANTS.ONE_LEVEL * (x + 1);
        s_fireball.EnergyToAdd = (5);
        s_fireball.Flags = ({Combat:COMBAT_FLAGS.PROJECTILE_ACTIVE});
        s_fireball.AddFrameWithSound(player,1,"audio/ryu/sinku.zzz","",folder + "/x-fb-0.png",1,MISC_FLAGS.NONE,{Player:PLAYER_FLAGS.MOBILE},0,0,0,25,0,0,0,null,0,0,0,-CONSTANTS.ONE_LEVEL*(x+1));
        s_fireball.AddFrame(player,"",folder + "/x-fb-1.png",36,MISC_FLAGS.NONE);
        s_fireball.AddFrame(player,"",folder + "/x-fb-2.png",1,MISC_FLAGS.NONE,{Combat:COMBAT_FLAGS.SUPER_MOVE_PAUSE});
        s_fireball.AddFrameWithSound(player,1,"audio/ryu/haduken.zzz","",folder + "/x-fb-3.png",1,{Combat:COMBAT_FLAGS.SPAWN_PROJECTILE|COMBAT_FLAGS.PROJECTILE_ACTIVE},0,0,0,0,0,player.projectiles_.length-1);
        s_fireball.AddFrameWithSound(player,1,"audio/misc/super-projectile-0.zzz","",folder + "/x-fb-3.png",31);
        s_fireball.AddFrame(player,"",folder + "/x-k1-4.png",6);

        /*add an animation for the fireball charge up*/
        var fb_residue = CreateBasicAnimation("fireball charge",[],false,0,folder + "/misc-sprites.png");
        fb_residue.AddEmptyFrame(player,1);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-0.png",3,0,142);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-1.png",1,-42,98);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-0.png",2,0,142);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-1.png",1,-42,98);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-0.png",1,0,142);

        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",2,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-1.png",2,-42,98);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-1.png",2,-42,98);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-1.png",2,-42,98);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",2,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-2.png",1,-53,100);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-3.png",1,-49,103);

        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-4.png",1,24,86);

        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-5.png",4,122,83);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-6.png",5,141,86);
        fb_residue.AddFrame(player,folder + "/x-super-fireball-spark-7.png",4,141,86);

        s_fireball.AddAnimation(fb_residue);

        /*add the trail for the super move*/
        
        var trail = CreateAnimationTrail([]);
        for(var trailIndex = 1; trailIndex < 3; ++trailIndex)
        {
            /*trail*/
            var s_fireball_trail = CreateGenericAnimation("super fireball trail");
            s_fireball_trail.AddTrailFrame(player,folder + "/x-fb-0-shadow-" + trailIndex + ".png",4);
            s_fireball_trail.AddTrailFrame(player,folder + "/x-fb-1-shadow-" + trailIndex + ".png",36);
            s_fireball_trail.AddTrailFrame(player,folder + "/x-fb-2-shadow-" + trailIndex + ".png",4);
            s_fireball_trail.AddTrailFrame(player,folder + "/x-fb-3-shadow-" + trailIndex + ".png",1);
            s_fireball_trail.AddTrailFrame(player,folder + "/x-fb-3-shadow-" + trailIndex + ".png",CONSTANTS.FRAME_MAX);

            trail.Add(s_fireball_trail,player.element_,player.folder_);
        }
        
        s_fireball.Trail = trail;

    }

}

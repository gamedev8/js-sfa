Player.prototype.AddGenericAnimations = function()
{
    var specialAnimFrames = 2;
    var animFrames4 = 4;
    
    for(var team = 1; team < 3; ++team)
    {
        var fhr_light = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.LIGHT,team,"front light");
        fhr_light.AddFrame(this,null,"images/misc/misc/x-hit-p1-" + team + "-0.png", animFrames4);
        fhr_light.AddFrame(this,null,"images/misc/misc/x-hit-p1-" + team + "-1.png", animFrames4);
        fhr_light.AddFrame(this,null,"images/misc/misc/x-hit-p1-" + team + "-2.png", animFrames4);
        fhr_light.AddFrame(this,null,"images/misc/misc/x-hit-p1-" + team + "-3.png", animFrames4);
        fhr_light.AddFrame(this,null,"images/misc/misc/x-hit-p1-" + team + "-4.png", animFrames4);

        var fhr_medium = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.MEDIUM,team,"front medium");
        fhr_medium.AddFrame(this,null,"images/misc/misc/x-hit-p2-" + team + "-0.png", animFrames4);
        fhr_medium.AddFrame(this,null,"images/misc/misc/x-hit-p2-" + team + "-1.png", animFrames4);
        fhr_medium.AddFrame(this,null,"images/misc/misc/x-hit-p2-" + team + "-2.png", animFrames4);
        fhr_medium.AddFrame(this,null,"images/misc/misc/x-hit-p2-" + team + "-3.png", animFrames4);
        fhr_medium.AddFrame(this,null,"images/misc/misc/x-hit-p2-" + team + "-4.png", animFrames4);

        var fhr_hard = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.HARD,team,"front hard");
        fhr_hard.AddFrame(this,null,"images/misc/misc/x-hit-p3-" + team + "-0.png", animFrames4);
        fhr_hard.AddFrame(this,null,"images/misc/misc/x-hit-p3-" + team + "-1.png", animFrames4);
        fhr_hard.AddFrame(this,null,"images/misc/misc/x-hit-p3-" + team + "-2.png", animFrames4);
        fhr_hard.AddFrame(this,null,"images/misc/misc/x-hit-p3-" + team + "-3.png", animFrames4);
        fhr_hard.AddFrame(this,null,"images/misc/misc/x-hit-p3-" + team + "-4.png", animFrames4);
    }

    var fhr_block = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.BLOCK,0,"block");
    fhr_block.AddFrame(this,null,"images/misc/misc/x-hit-block-0.png", animFrames4);
    fhr_block.AddFrame(this,null,"images/misc/misc/x-hit-block-1.png", animFrames4);
    fhr_block.AddFrame(this,null,"images/misc/misc/x-hit-block-2.png", animFrames4);
    fhr_block.AddFrame(this,null,"images/misc/misc/x-hit-block-3.png", animFrames4);
    fhr_block.AddFrame(this,null,"images/misc/misc/x-hit-block-4.png", animFrames4);

    var rhr_spit1 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT1,0,"rear spit",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_spit1.AddFrame(this,null,"images/misc/misc/x-spit-0-0.png", animFrames4);
    rhr_spit1.AddFrame(this,null,"images/misc/misc/x-spit-0-1.png", animFrames4);
    rhr_spit1.AddFrame(this,null,"images/misc/misc/x-spit-0-2.png", animFrames4);

    var rhr_spit2 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT2,0,"big rear spit",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_spit2.AddFrame(this,null,"images/misc/misc/x-spit-1-0.png", animFrames4);
    rhr_spit2.AddFrame(this,null,"images/misc/misc/x-spit-1-1.png", animFrames4);
    rhr_spit2.AddFrame(this,null,"images/misc/misc/x-spit-1-2.png", animFrames4);

    var rhr_special1 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,0,"rear special 1",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special1.AddFrame(this,null,"images/misc/misc/x-hit-s1-0.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"images/misc/misc/x-hit-s1-1.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"images/misc/misc/x-hit-s1-2.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"images/misc/misc/x-hit-s1-3.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"images/misc/misc/x-hit-s1-4.png", specialAnimFrames);

    var rhr_special2 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,0,"rear special 2",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special2.AddFrame(this,null,"images/misc/misc/x-hit-s2-0.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"images/misc/misc/x-hit-s2-1.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"images/misc/misc/x-hit-s2-2.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"images/misc/misc/x-hit-s2-3.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"images/misc/misc/x-hit-s2-4.png", specialAnimFrames);

    var rhr_special3 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,0,"rear special 3",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special3.AddFrame(this,null,"images/misc/misc/x-hit-s3-0.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"images/misc/misc/x-hit-s3-1.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"images/misc/misc/x-hit-s3-2.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"images/misc/misc/x-hit-s3-3.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"images/misc/misc/x-hit-s3-4.png", specialAnimFrames);



    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
    {
        var dirt = this.AddDirtAnimation();
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-0.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-1.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-2.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-3.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-4.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-dirt-5.png", animFrames4);
    }


    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
    {
        var dirt = this.AddBigDirtAnimation();
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-0.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-1.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-2.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-3.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-4.png", animFrames4);
        dirt.AddFrame(this,null,"images/misc/misc/x-big-dirt-5.png", animFrames4);
    }
}
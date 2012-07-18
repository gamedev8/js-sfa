Player.prototype.AddGenericAnimations = function()
{
    var dizzyFrames = 2;
    var offsetXPct = 0.4;
    var offsetY = 10;
    for(var i = 0; i < 2; ++i)
    {
        var dizzyAnim = this.AddDizzyAnimation(offsetXPct,offsetY);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-0.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-1.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-2.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-3.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-4.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-5.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-6.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-7.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-8.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-9.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-10.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-11.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-12.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-13.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-14.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-15.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-16.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-17.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-18.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-19.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-20.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-21.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-22.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-23.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-24.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-25.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-26.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-27.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-28.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-29.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-30.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-31.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-32.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-33.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-34.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-35.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-36.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-37.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-38.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-39.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-40.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-41.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-42.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-43.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-44.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-45.png",dizzyFrames);
        dizzyAnim.AddFrame(this,null,"|images/misc/misc/dizzy-" + i + "-46.png",dizzyFrames);
    }

    var specialAnimFrames = 2;
    var animFrames4 = 4;
    
    for(var team = 1; team < 3; ++team)
    {
        var fhr_light = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.LIGHT,team,"front light");
        fhr_light.AddFrame(this,null,"|images/misc/misc/x-hit-p1-" + team + "-0.png", animFrames4);
        fhr_light.AddFrame(this,null,"|images/misc/misc/x-hit-p1-" + team + "-1.png", animFrames4);
        fhr_light.AddFrame(this,null,"|images/misc/misc/x-hit-p1-" + team + "-2.png", animFrames4);
        fhr_light.AddFrame(this,null,"|images/misc/misc/x-hit-p1-" + team + "-3.png", animFrames4);
        fhr_light.AddFrame(this,null,"|images/misc/misc/x-hit-p1-" + team + "-4.png", animFrames4);

        var fhr_medium = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.MEDIUM,team,"front medium");
        fhr_medium.AddFrame(this,null,"|images/misc/misc/x-hit-p2-" + team + "-0.png", animFrames4);
        fhr_medium.AddFrame(this,null,"|images/misc/misc/x-hit-p2-" + team + "-1.png", animFrames4);
        fhr_medium.AddFrame(this,null,"|images/misc/misc/x-hit-p2-" + team + "-2.png", animFrames4);
        fhr_medium.AddFrame(this,null,"|images/misc/misc/x-hit-p2-" + team + "-3.png", animFrames4);
        fhr_medium.AddFrame(this,null,"|images/misc/misc/x-hit-p2-" + team + "-4.png", animFrames4);

        var fhr_hard = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.HARD,team,"front hard");
        fhr_hard.AddFrame(this,null,"|images/misc/misc/x-hit-p3-" + team + "-0.png", animFrames4);
        fhr_hard.AddFrame(this,null,"|images/misc/misc/x-hit-p3-" + team + "-1.png", animFrames4);
        fhr_hard.AddFrame(this,null,"|images/misc/misc/x-hit-p3-" + team + "-2.png", animFrames4);
        fhr_hard.AddFrame(this,null,"|images/misc/misc/x-hit-p3-" + team + "-3.png", animFrames4);
        fhr_hard.AddFrame(this,null,"|images/misc/misc/x-hit-p3-" + team + "-4.png", animFrames4);
    }

    var fhr_block = this.AddGenericAnimation(ATTACK_FLAGS.FRONT|ATTACK_FLAGS.BLOCK,0,"block");
    fhr_block.AddFrame(this,null,"|images/misc/misc/x-hit-block-0.png", animFrames4);
    fhr_block.AddFrame(this,null,"|images/misc/misc/x-hit-block-1.png", animFrames4);
    fhr_block.AddFrame(this,null,"|images/misc/misc/x-hit-block-2.png", animFrames4);
    fhr_block.AddFrame(this,null,"|images/misc/misc/x-hit-block-3.png", animFrames4);
    fhr_block.AddFrame(this,null,"|images/misc/misc/x-hit-block-4.png", animFrames4);

    var rhr_spit1 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT1,0,"rear spit",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_spit1.AddFrame(this,null,"|images/misc/misc/x-spit-0-0.png", animFrames4);
    rhr_spit1.AddFrame(this,null,"|images/misc/misc/x-spit-0-1.png", animFrames4);
    rhr_spit1.AddFrame(this,null,"|images/misc/misc/x-spit-0-2.png", animFrames4);

    var rhr_spit2 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPIT2,0,"big rear spit",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_spit2.AddFrame(this,null,"|images/misc/misc/x-spit-1-0.png", animFrames4);
    rhr_spit2.AddFrame(this,null,"|images/misc/misc/x-spit-1-1.png", animFrames4);
    rhr_spit2.AddFrame(this,null,"|images/misc/misc/x-spit-1-2.png", animFrames4);

    var rhr_special1 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL1,0,"rear special 1",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special1.AddFrame(this,null,"|images/misc/misc/x-hit-s1-0.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"|images/misc/misc/x-hit-s1-1.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"|images/misc/misc/x-hit-s1-2.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"|images/misc/misc/x-hit-s1-3.png", specialAnimFrames);
    rhr_special1.AddFrame(this,null,"|images/misc/misc/x-hit-s1-4.png", specialAnimFrames);

    var rhr_special2 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL2,0,"rear special 2",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special2.AddFrame(this,null,"|images/misc/misc/x-hit-s2-0.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"|images/misc/misc/x-hit-s2-1.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"|images/misc/misc/x-hit-s2-2.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"|images/misc/misc/x-hit-s2-3.png", specialAnimFrames);
    rhr_special2.AddFrame(this,null,"|images/misc/misc/x-hit-s2-4.png", specialAnimFrames);

    var rhr_special3 = this.AddGenericAnimation(ATTACK_FLAGS.REAR|ATTACK_FLAGS.SPECIAL3,0,"rear special 3",MOVE_FLAGS.MOVE_WITH_PLAYER);
    rhr_special3.AddFrame(this,null,"|images/misc/misc/x-hit-s3-0.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"|images/misc/misc/x-hit-s3-1.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"|images/misc/misc/x-hit-s3-2.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"|images/misc/misc/x-hit-s3-3.png", specialAnimFrames);
    rhr_special3.AddFrame(this,null,"|images/misc/misc/x-hit-s3-4.png", specialAnimFrames);



    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
    {
        var dirt = this.AddDirtAnimation();
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-0.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-1.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-2.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-3.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-4.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-dirt-5.png", animFrames4);
    }


    for(var i = 0; i < CONSTANTS.MAX_EXTRA_IMAGES; ++i)
    {
        var dirt = this.AddBigDirtAnimation();
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-0.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-1.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-2.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-3.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-4.png", animFrames4);
        dirt.AddFrame(this,null,"|images/misc/misc/x-big-dirt-5.png", animFrames4);
    }

}


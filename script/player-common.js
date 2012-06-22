Player.prototype.AddGenericAnimations = function()
{
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

    this.AddGenericAnimationSpriteData();
}


Player.prototype.AddGenericAnimationSpriteData = function()
{
    /*auto-generated sprite data*/
    /*dirt*/
	spriteLookup_.Load("images/misc/misc/l-big-dirt-0.png","images/misc/misc/dirt-sprites.png", "0px", "-7px", "58px", "75px");
	spriteLookup_.Load("images/misc/misc/l-big-dirt-1.png","images/misc/misc/dirt-sprites.png", "-58px", "-4px", "62px", "78px");
	spriteLookup_.Load("images/misc/misc/l-big-dirt-2.png","images/misc/misc/dirt-sprites.png", "-120px", "-2px", "64px", "80px");
	spriteLookup_.Load("images/misc/misc/l-big-dirt-3.png","images/misc/misc/dirt-sprites.png", "-184px", "0px", "64px", "82px");
	spriteLookup_.Load("images/misc/misc/l-big-dirt-4.png","images/misc/misc/dirt-sprites.png", "-248px", "-2px", "58px", "80px");
	spriteLookup_.Load("images/misc/misc/l-big-dirt-5.png","images/misc/misc/dirt-sprites.png", "-306px", "-2px", "56px", "80px");
	spriteLookup_.Load("images/misc/misc/l-dirt-0.png","images/misc/misc/dirt-sprites.png", "-362px", "-57px", "20px", "25px");
	spriteLookup_.Load("images/misc/misc/l-dirt-1.png","images/misc/misc/dirt-sprites.png", "-382px", "-54px", "24px", "28px");
	spriteLookup_.Load("images/misc/misc/l-dirt-2.png","images/misc/misc/dirt-sprites.png", "-406px", "-49px", "28px", "33px");
	spriteLookup_.Load("images/misc/misc/l-dirt-3.png","images/misc/misc/dirt-sprites.png", "-434px", "-41px", "32px", "41px");
	spriteLookup_.Load("images/misc/misc/l-dirt-4.png","images/misc/misc/dirt-sprites.png", "-466px", "-43px", "32px", "39px");
	spriteLookup_.Load("images/misc/misc/l-dirt-5.png","images/misc/misc/dirt-sprites.png", "-498px", "-41px", "32px", "41px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-0.png","images/misc/misc/dirt-sprites.png", "-530px", "-7px", "58px", "75px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-1.png","images/misc/misc/dirt-sprites.png", "-588px", "-4px", "62px", "78px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-2.png","images/misc/misc/dirt-sprites.png", "-650px", "-2px", "64px", "80px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-3.png","images/misc/misc/dirt-sprites.png", "-714px", "0px", "64px", "82px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-4.png","images/misc/misc/dirt-sprites.png", "-778px", "-2px", "58px", "80px");
	spriteLookup_.Load("images/misc/misc/r-big-dirt-5.png","images/misc/misc/dirt-sprites.png", "-836px", "-2px", "56px", "80px");
	spriteLookup_.Load("images/misc/misc/r-dirt-0.png","images/misc/misc/dirt-sprites.png", "-892px", "-57px", "20px", "25px");
	spriteLookup_.Load("images/misc/misc/r-dirt-1.png","images/misc/misc/dirt-sprites.png", "-912px", "-54px", "24px", "28px");
	spriteLookup_.Load("images/misc/misc/r-dirt-2.png","images/misc/misc/dirt-sprites.png", "-936px", "-49px", "28px", "33px");
	spriteLookup_.Load("images/misc/misc/r-dirt-3.png","images/misc/misc/dirt-sprites.png", "-964px", "-41px", "32px", "41px");
	spriteLookup_.Load("images/misc/misc/r-dirt-4.png","images/misc/misc/dirt-sprites.png", "-996px", "-43px", "32px", "39px");
	spriteLookup_.Load("images/misc/misc/r-dirt-5.png","images/misc/misc/dirt-sprites.png", "-1028px", "-41px", "32px", "41px");
    /*blasts*/
	spriteLookup_.Load("images/misc/misc/l-hit-block-0.png","images/misc/misc/blast-sprites.png", "0px", "-139px", "68px", "67px");
	spriteLookup_.Load("images/misc/misc/l-hit-block-1.png","images/misc/misc/blast-sprites.png", "-68px", "-134px", "76px", "72px");
	spriteLookup_.Load("images/misc/misc/l-hit-block-2.png","images/misc/misc/blast-sprites.png", "-144px", "-134px", "80px", "72px");
	spriteLookup_.Load("images/misc/misc/l-hit-block-3.png","images/misc/misc/blast-sprites.png", "-224px", "-129px", "78px", "77px");
	spriteLookup_.Load("images/misc/misc/l-hit-block-4.png","images/misc/misc/blast-sprites.png", "-302px", "-124px", "56px", "82px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-1-0.png","images/misc/misc/blast-sprites.png", "-358px", "-124px", "66px", "82px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-1-1.png","images/misc/misc/blast-sprites.png", "-424px", "-142px", "58px", "64px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-1-2.png","images/misc/misc/blast-sprites.png", "-482px", "-111px", "82px", "95px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-1-3.png","images/misc/misc/blast-sprites.png", "-564px", "-145px", "56px", "61px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-1-4.png","images/misc/misc/blast-sprites.png", "-620px", "-121px", "72px", "85px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-2-0.png","images/misc/misc/blast-sprites.png", "-692px", "-124px", "66px", "82px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-2-1.png","images/misc/misc/blast-sprites.png", "-758px", "-142px", "58px", "64px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-2-2.png","images/misc/misc/blast-sprites.png", "-816px", "-111px", "82px", "95px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-2-3.png","images/misc/misc/blast-sprites.png", "-898px", "-145px", "56px", "61px");
	spriteLookup_.Load("images/misc/misc/l-hit-p1-2-4.png","images/misc/misc/blast-sprites.png", "-954px", "-121px", "72px", "85px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-1-0.png","images/misc/misc/blast-sprites.png", "-1026px", "-72px", "106px", "134px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-1-1.png","images/misc/misc/blast-sprites.png", "-1132px", "-98px", "96px", "108px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-1-2.png","images/misc/misc/blast-sprites.png", "-1228px", "-54px", "114px", "152px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-1-3.png","images/misc/misc/blast-sprites.png", "-1342px", "-64px", "82px", "142px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-1-4.png","images/misc/misc/blast-sprites.png", "-1424px", "-41px", "96px", "165px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-2-0.png","images/misc/misc/blast-sprites.png", "-1520px", "-73px", "106px", "133px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-2-1.png","images/misc/misc/blast-sprites.png", "-1626px", "-98px", "96px", "108px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-2-2.png","images/misc/misc/blast-sprites.png", "-1722px", "-54px", "114px", "152px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-2-3.png","images/misc/misc/blast-sprites.png", "-1836px", "-64px", "80px", "142px");
	spriteLookup_.Load("images/misc/misc/l-hit-p2-2-4.png","images/misc/misc/blast-sprites.png", "-1916px", "-41px", "96px", "165px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-1-0.png","images/misc/misc/blast-sprites.png", "-2012px", "-56px", "118px", "150px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-1-1.png","images/misc/misc/blast-sprites.png", "-2130px", "-41px", "142px", "165px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-1-2.png","images/misc/misc/blast-sprites.png", "-2272px", "-21px", "172px", "185px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-1-3.png","images/misc/misc/blast-sprites.png", "-2444px", "-10px", "136px", "196px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-1-4.png","images/misc/misc/blast-sprites.png", "-2580px", "0px", "142px", "206px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-2-0.png","images/misc/misc/blast-sprites.png", "-2722px", "-57px", "118px", "149px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-2-1.png","images/misc/misc/blast-sprites.png", "-2840px", "-44px", "138px", "162px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-2-2.png","images/misc/misc/blast-sprites.png", "-2978px", "-41px", "172px", "165px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-2-3.png","images/misc/misc/blast-sprites.png", "-3150px", "-21px", "124px", "185px");
	spriteLookup_.Load("images/misc/misc/l-hit-p3-2-4.png","images/misc/misc/blast-sprites.png", "-3274px", "0px", "142px", "206px");
	spriteLookup_.Load("images/misc/misc/l-hit-s1-0.png","images/misc/misc/blast-sprites.png", "-3416px", "-109px", "82px", "97px");
	spriteLookup_.Load("images/misc/misc/l-hit-s1-1.png","images/misc/misc/blast-sprites.png", "-3498px", "-106px", "80px", "100px");
	spriteLookup_.Load("images/misc/misc/l-hit-s1-2.png","images/misc/misc/blast-sprites.png", "-3578px", "-82px", "90px", "124px");
	spriteLookup_.Load("images/misc/misc/l-hit-s1-3.png","images/misc/misc/blast-sprites.png", "-3668px", "-59px", "100px", "147px");
	spriteLookup_.Load("images/misc/misc/l-hit-s1-4.png","images/misc/misc/blast-sprites.png", "-3768px", "-100px", "102px", "106px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-0.png","images/misc/misc/blast-sprites.png", "-3870px", "-77px", "96px", "129px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-1.png","images/misc/misc/blast-sprites.png", "-3966px", "-72px", "102px", "134px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-2.png","images/misc/misc/blast-sprites.png", "-4068px", "-26px", "92px", "180px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-3.png","images/misc/misc/blast-sprites.png", "-4160px", "-13px", "110px", "193px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-4.png","images/misc/misc/blast-sprites.png", "-4270px", "0px", "120px", "206px");
	spriteLookup_.Load("images/misc/misc/l-hit-s2-5.png","images/misc/misc/blast-sprites.png", "-4390px", "-98px", "100px", "108px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-0.png","images/misc/misc/blast-sprites.png", "-4490px", "-62px", "114px", "144px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-1.png","images/misc/misc/blast-sprites.png", "-4604px", "-46px", "116px", "160px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-2.png","images/misc/misc/blast-sprites.png", "-4720px", "-15px", "146px", "191px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-3.png","images/misc/misc/blast-sprites.png", "-4866px", "-3px", "152px", "203px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-4.png","images/misc/misc/blast-sprites.png", "-5018px", "-41px", "142px", "165px");
	spriteLookup_.Load("images/misc/misc/l-hit-s3-5.png","images/misc/misc/blast-sprites.png", "-5160px", "-98px", "102px", "108px");
	spriteLookup_.Load("images/misc/misc/l-spit-0-0.png","images/misc/misc/blast-sprites.png", "-5262px", "-134px", "63px", "72px");
	spriteLookup_.Load("images/misc/misc/l-spit-0-1.png","images/misc/misc/blast-sprites.png", "-5325px", "-149px", "60px", "57px");
	spriteLookup_.Load("images/misc/misc/l-spit-0-2.png","images/misc/misc/blast-sprites.png", "-5385px", "-154px", "48px", "52px");
	spriteLookup_.Load("images/misc/misc/l-spit-1-0.png","images/misc/misc/blast-sprites.png", "-5433px", "-150px", "50px", "56px");
	spriteLookup_.Load("images/misc/misc/l-spit-1-1.png","images/misc/misc/blast-sprites.png", "-5483px", "-157px", "76px", "49px");
	spriteLookup_.Load("images/misc/misc/l-spit-1-2.png","images/misc/misc/blast-sprites.png", "-5559px", "-152px", "86px", "54px");
	spriteLookup_.Load("images/misc/misc/l-spit-1-3.png","images/misc/misc/blast-sprites.png", "-5645px", "-162px", "82px", "44px");
	spriteLookup_.Load("images/misc/misc/l-spit-1-4.png","images/misc/misc/blast-sprites.png", "-5727px", "-170px", "68px", "36px");
	spriteLookup_.Load("images/misc/misc/r-hit-block-0.png","images/misc/misc/blast-sprites.png", "-5795px", "-139px", "68px", "67px");
	spriteLookup_.Load("images/misc/misc/r-hit-block-1.png","images/misc/misc/blast-sprites.png", "-5863px", "-134px", "76px", "72px");
	spriteLookup_.Load("images/misc/misc/r-hit-block-2.png","images/misc/misc/blast-sprites.png", "-5939px", "-134px", "80px", "72px");
	spriteLookup_.Load("images/misc/misc/r-hit-block-3.png","images/misc/misc/blast-sprites.png", "-6019px", "-129px", "78px", "77px");
	spriteLookup_.Load("images/misc/misc/r-hit-block-4.png","images/misc/misc/blast-sprites.png", "-6097px", "-124px", "56px", "82px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-1-0.png","images/misc/misc/blast-sprites.png", "-6153px", "-124px", "66px", "82px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-1-1.png","images/misc/misc/blast-sprites.png", "-6219px", "-142px", "58px", "64px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-1-2.png","images/misc/misc/blast-sprites.png", "-6277px", "-111px", "82px", "95px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-1-3.png","images/misc/misc/blast-sprites.png", "-6359px", "-145px", "56px", "61px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-1-4.png","images/misc/misc/blast-sprites.png", "-6415px", "-121px", "72px", "85px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-2-0.png","images/misc/misc/blast-sprites.png", "-6487px", "-124px", "66px", "82px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-2-1.png","images/misc/misc/blast-sprites.png", "-6553px", "-142px", "58px", "64px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-2-2.png","images/misc/misc/blast-sprites.png", "-6611px", "-111px", "82px", "95px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-2-3.png","images/misc/misc/blast-sprites.png", "-6693px", "-145px", "56px", "61px");
	spriteLookup_.Load("images/misc/misc/r-hit-p1-2-4.png","images/misc/misc/blast-sprites.png", "-6749px", "-121px", "72px", "85px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-1-0.png","images/misc/misc/blast-sprites.png", "-6821px", "-72px", "106px", "134px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-1-1.png","images/misc/misc/blast-sprites.png", "-6927px", "-98px", "96px", "108px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-1-2.png","images/misc/misc/blast-sprites.png", "-7023px", "-54px", "114px", "152px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-1-3.png","images/misc/misc/blast-sprites.png", "-7137px", "-64px", "82px", "142px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-1-4.png","images/misc/misc/blast-sprites.png", "-7219px", "-41px", "96px", "165px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-2-0.png","images/misc/misc/blast-sprites.png", "-7315px", "-73px", "106px", "133px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-2-1.png","images/misc/misc/blast-sprites.png", "-7421px", "-98px", "96px", "108px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-2-2.png","images/misc/misc/blast-sprites.png", "-7517px", "-54px", "114px", "152px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-2-3.png","images/misc/misc/blast-sprites.png", "-7631px", "-64px", "80px", "142px");
	spriteLookup_.Load("images/misc/misc/r-hit-p2-2-4.png","images/misc/misc/blast-sprites.png", "-7711px", "-41px", "96px", "165px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-1-0.png","images/misc/misc/blast-sprites.png", "-7807px", "-56px", "118px", "150px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-1-1.png","images/misc/misc/blast-sprites.png", "-7925px", "-41px", "142px", "165px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-1-2.png","images/misc/misc/blast-sprites.png", "-8067px", "-21px", "172px", "185px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-1-3.png","images/misc/misc/blast-sprites.png", "-8239px", "-10px", "136px", "196px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-1-4.png","images/misc/misc/blast-sprites.png", "-8375px", "0px", "142px", "206px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-2-0.png","images/misc/misc/blast-sprites.png", "-8517px", "-57px", "118px", "149px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-2-1.png","images/misc/misc/blast-sprites.png", "-8635px", "-44px", "138px", "162px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-2-2.png","images/misc/misc/blast-sprites.png", "-8773px", "-41px", "172px", "165px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-2-3.png","images/misc/misc/blast-sprites.png", "-8945px", "-21px", "124px", "185px");
	spriteLookup_.Load("images/misc/misc/r-hit-p3-2-4.png","images/misc/misc/blast-sprites.png", "-9069px", "0px", "142px", "206px");
	spriteLookup_.Load("images/misc/misc/r-hit-s1-0.png","images/misc/misc/blast-sprites.png", "-9211px", "-109px", "82px", "97px");
	spriteLookup_.Load("images/misc/misc/r-hit-s1-1.png","images/misc/misc/blast-sprites.png", "-9293px", "-106px", "80px", "100px");
	spriteLookup_.Load("images/misc/misc/r-hit-s1-2.png","images/misc/misc/blast-sprites.png", "-9373px", "-82px", "90px", "124px");
	spriteLookup_.Load("images/misc/misc/r-hit-s1-3.png","images/misc/misc/blast-sprites.png", "-9463px", "-59px", "100px", "147px");
	spriteLookup_.Load("images/misc/misc/r-hit-s1-4.png","images/misc/misc/blast-sprites.png", "-9563px", "-100px", "102px", "106px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-0.png","images/misc/misc/blast-sprites.png", "-9665px", "-77px", "96px", "129px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-1.png","images/misc/misc/blast-sprites.png", "-9761px", "-72px", "102px", "134px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-2.png","images/misc/misc/blast-sprites.png", "-9863px", "-26px", "92px", "180px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-3.png","images/misc/misc/blast-sprites.png", "-9955px", "-13px", "110px", "193px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-4.png","images/misc/misc/blast-sprites.png", "-10065px", "0px", "120px", "206px");
	spriteLookup_.Load("images/misc/misc/r-hit-s2-5.png","images/misc/misc/blast-sprites.png", "-10185px", "-98px", "100px", "108px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-0.png","images/misc/misc/blast-sprites.png", "-10285px", "-62px", "114px", "144px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-1.png","images/misc/misc/blast-sprites.png", "-10399px", "-46px", "116px", "160px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-2.png","images/misc/misc/blast-sprites.png", "-10515px", "-15px", "146px", "191px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-3.png","images/misc/misc/blast-sprites.png", "-10661px", "-3px", "152px", "203px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-4.png","images/misc/misc/blast-sprites.png", "-10813px", "-41px", "142px", "165px");
	spriteLookup_.Load("images/misc/misc/r-hit-s3-5.png","images/misc/misc/blast-sprites.png", "-10955px", "-98px", "102px", "108px");
	spriteLookup_.Load("images/misc/misc/r-spit-0-0.png","images/misc/misc/blast-sprites.png", "-11057px", "-134px", "63px", "72px");
	spriteLookup_.Load("images/misc/misc/r-spit-0-1.png","images/misc/misc/blast-sprites.png", "-11120px", "-149px", "60px", "57px");
	spriteLookup_.Load("images/misc/misc/r-spit-0-2.png","images/misc/misc/blast-sprites.png", "-11180px", "-154px", "48px", "52px");
	spriteLookup_.Load("images/misc/misc/r-spit-1-0.png","images/misc/misc/blast-sprites.png", "-11228px", "-150px", "50px", "56px");
	spriteLookup_.Load("images/misc/misc/r-spit-1-1.png","images/misc/misc/blast-sprites.png", "-11278px", "-157px", "76px", "49px");
	spriteLookup_.Load("images/misc/misc/r-spit-1-2.png","images/misc/misc/blast-sprites.png", "-11354px", "-152px", "86px", "54px");
	spriteLookup_.Load("images/misc/misc/r-spit-1-3.png","images/misc/misc/blast-sprites.png", "-11440px", "-162px", "82px", "44px");
	spriteLookup_.Load("images/misc/misc/r-spit-1-4.png","images/misc/misc/blast-sprites.png", "-11522px", "-170px", "68px", "36px");
    /*energy bars*/
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0.png","images/misc/misc/bars-sprites.png", "0px", "-43px", "1px", "16px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-1-1.png","images/misc/misc/bars-sprites.png", "-1px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-1-2.png","images/misc/misc/bars-sprites.png", "-337px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-1-3.png","images/misc/misc/bars-sprites.png", "-673px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-1-4.png","images/misc/misc/bars-sprites.png", "-1009px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-2-1.png","images/misc/misc/bars-sprites.png", "-1345px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-2-2.png","images/misc/misc/bars-sprites.png", "-1681px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-2-3.png","images/misc/misc/bars-sprites.png", "-2017px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-full-team-2-4.png","images/misc/misc/bars-sprites.png", "-2353px", "-2px", "336px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-team-1.png","images/misc/misc/bars-sprites.png", "-2689px", "-10px", "336px", "49px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl0-team-2.png","images/misc/misc/bars-sprites.png", "-3025px", "-10px", "336px", "49px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1.png","images/misc/misc/bars-sprites.png", "-3361px", "-43px", "1px", "16px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-1-1.png","images/misc/misc/bars-sprites.png", "-3362px", "-2px", "340px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-1-2.png","images/misc/misc/bars-sprites.png", "-3702px", "-2px", "340px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-1-3.png","images/misc/misc/bars-sprites.png", "-4042px", "-2px", "340px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-1-4.png","images/misc/misc/bars-sprites.png", "-4382px", "-2px", "340px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-2-1.png","images/misc/misc/bars-sprites.png", "-4722px", "-2px", "338px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-2-2.png","images/misc/misc/bars-sprites.png", "-5060px", "-2px", "338px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-2-3.png","images/misc/misc/bars-sprites.png", "-5398px", "-2px", "338px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl1-full-team-2-4.png","images/misc/misc/bars-sprites.png", "-5736px", "-2px", "338px", "57px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2.png","images/misc/misc/bars-sprites.png", "-6074px", "-43px", "1px", "16px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-1-1.png","images/misc/misc/bars-sprites.png", "-6075px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-1-2.png","images/misc/misc/bars-sprites.png", "-6413px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-1-3.png","images/misc/misc/bars-sprites.png", "-6751px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-1-4.png","images/misc/misc/bars-sprites.png", "-7089px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-2-1.png","images/misc/misc/bars-sprites.png", "-7427px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-2-2.png","images/misc/misc/bars-sprites.png", "-7765px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-2-3.png","images/misc/misc/bars-sprites.png", "-8103px", "0px", "338px", "59px");
	spriteLookup_.Load("images/misc/misc/energy-bar-lvl2-full-team-2-4.png","images/misc/misc/bars-sprites.png", "-8441px", "0px", "338px", "59px");
    /*other*/
	spriteLookup_.Load("images/misc/misc/l-energize-0-0.png","images/misc/misc/misc-sprites.png", "0px", "0px", "296px", "286px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-1.png","images/misc/misc/misc-sprites.png", "-296px", "-99px", "230px", "187px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-2.png","images/misc/misc/misc-sprites.png", "-526px", "-22px", "278px", "264px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-3.png","images/misc/misc/misc-sprites.png", "-804px", "-21px", "344px", "265px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-4.png","images/misc/misc/misc-sprites.png", "-1148px", "-99px", "230px", "187px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-5.png","images/misc/misc/misc-sprites.png", "-1378px", "-63px", "202px", "223px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-6.png","images/misc/misc/misc-sprites.png", "-1580px", "-62px", "148px", "224px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-7.png","images/misc/misc/misc-sprites.png", "-1728px", "-44px", "128px", "242px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-8.png","images/misc/misc/misc-sprites.png", "-1856px", "-65px", "150px", "221px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-9.png","images/misc/misc/misc-sprites.png", "-2006px", "-134px", "168px", "152px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-10.png","images/misc/misc/misc-sprites.png", "-2174px", "-158px", "170px", "128px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-11.png","images/misc/misc/misc-sprites.png", "-2344px", "-129px", "150px", "157px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-12.png","images/misc/misc/misc-sprites.png", "-2494px", "-109px", "96px", "177px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-13.png","images/misc/misc/misc-sprites.png", "-2590px", "-109px", "82px", "177px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-14.png","images/misc/misc/misc-sprites.png", "-2672px", "-137px", "98px", "149px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-15.png","images/misc/misc/misc-sprites.png", "-2770px", "-157px", "120px", "129px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-16.png","images/misc/misc/misc-sprites.png", "-2890px", "-111px", "106px", "175px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-17.png","images/misc/misc/misc-sprites.png", "-2996px", "-131px", "142px", "155px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-18.png","images/misc/misc/misc-sprites.png", "-3138px", "-142px", "124px", "144px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-19.png","images/misc/misc/misc-sprites.png", "-3262px", "-116px", "186px", "170px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-20.png","images/misc/misc/misc-sprites.png", "-3448px", "-124px", "70px", "162px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-21.png","images/misc/misc/misc-sprites.png", "-3518px", "-103px", "176px", "183px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-22.png","images/misc/misc/misc-sprites.png", "-3694px", "-129px", "168px", "157px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-23.png","images/misc/misc/misc-sprites.png", "-3862px", "-162px", "120px", "124px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-24.png","images/misc/misc/misc-sprites.png", "-3982px", "-155px", "114px", "131px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-25.png","images/misc/misc/misc-sprites.png", "-4096px", "-173px", "72px", "113px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-26.png","images/misc/misc/misc-sprites.png", "-4168px", "-144px", "172px", "142px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-27.png","images/misc/misc/misc-sprites.png", "-4340px", "-199px", "58px", "87px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-28.png","images/misc/misc/misc-sprites.png", "-4398px", "-224px", "44px", "62px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-29.png","images/misc/misc/misc-sprites.png", "-4442px", "-180px", "144px", "106px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-30.png","images/misc/misc/misc-sprites.png", "-4586px", "-240px", "38px", "46px");
	spriteLookup_.Load("images/misc/misc/l-energize-0-31.png","images/misc/misc/misc-sprites.png", "-4624px", "-258px", "26px", "28px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-0.png","images/misc/misc/misc-sprites.png", "-4650px", "0px", "296px", "286px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-1.png","images/misc/misc/misc-sprites.png", "-4946px", "-99px", "230px", "187px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-2.png","images/misc/misc/misc-sprites.png", "-5176px", "-22px", "278px", "264px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-3.png","images/misc/misc/misc-sprites.png", "-5454px", "-21px", "344px", "265px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-4.png","images/misc/misc/misc-sprites.png", "-5798px", "-99px", "230px", "187px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-5.png","images/misc/misc/misc-sprites.png", "-6028px", "-63px", "202px", "223px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-6.png","images/misc/misc/misc-sprites.png", "-6230px", "-62px", "148px", "224px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-7.png","images/misc/misc/misc-sprites.png", "-6378px", "-44px", "128px", "242px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-8.png","images/misc/misc/misc-sprites.png", "-6506px", "-65px", "150px", "221px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-9.png","images/misc/misc/misc-sprites.png", "-6656px", "-134px", "168px", "152px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-10.png","images/misc/misc/misc-sprites.png", "-6824px", "-158px", "170px", "128px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-11.png","images/misc/misc/misc-sprites.png", "-6994px", "-129px", "150px", "157px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-12.png","images/misc/misc/misc-sprites.png", "-7144px", "-109px", "96px", "177px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-13.png","images/misc/misc/misc-sprites.png", "-7240px", "-109px", "82px", "177px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-14.png","images/misc/misc/misc-sprites.png", "-7322px", "-137px", "98px", "149px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-15.png","images/misc/misc/misc-sprites.png", "-7420px", "-157px", "120px", "129px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-16.png","images/misc/misc/misc-sprites.png", "-7540px", "-111px", "106px", "175px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-17.png","images/misc/misc/misc-sprites.png", "-7646px", "-131px", "142px", "155px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-18.png","images/misc/misc/misc-sprites.png", "-7788px", "-142px", "124px", "144px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-19.png","images/misc/misc/misc-sprites.png", "-7912px", "-116px", "186px", "170px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-20.png","images/misc/misc/misc-sprites.png", "-8098px", "-124px", "70px", "162px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-21.png","images/misc/misc/misc-sprites.png", "-8168px", "-103px", "176px", "183px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-22.png","images/misc/misc/misc-sprites.png", "-8344px", "-129px", "168px", "157px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-23.png","images/misc/misc/misc-sprites.png", "-8512px", "-162px", "120px", "124px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-24.png","images/misc/misc/misc-sprites.png", "-8632px", "-155px", "114px", "131px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-25.png","images/misc/misc/misc-sprites.png", "-8746px", "-173px", "72px", "113px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-26.png","images/misc/misc/misc-sprites.png", "-8818px", "-144px", "172px", "142px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-27.png","images/misc/misc/misc-sprites.png", "-8990px", "-199px", "58px", "87px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-28.png","images/misc/misc/misc-sprites.png", "-9048px", "-224px", "44px", "62px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-29.png","images/misc/misc/misc-sprites.png", "-9092px", "-180px", "144px", "106px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-30.png","images/misc/misc/misc-sprites.png", "-9236px", "-240px", "38px", "46px");
	spriteLookup_.Load("images/misc/misc/r-energize-0-31.png","images/misc/misc/misc-sprites.png", "-9274px", "-258px", "26px", "28px");
}

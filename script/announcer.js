var CreateAnnouncer = function()
{

    /*private members*/
    var match_ = null;
    var round_ = {StartFrame:0,IsAnimating:false,Element:window.document.getElementById("pnlRound")};
    var roundNumber_ = {StartFrame:0,IsAnimating:false,Element:window.document.getElementById("pnlRoundNumber")};
    var fight_ = {StartFrame:0,IsAnimating:false,Element:window.document.getElementById("pnlFight")};
    var ko_ = {StartFrame:0,IsAnimating:false,Element:window.document.getElementById("pnlKO")};
    var perfect_ = {StartFrame:0,IsAnimating:false,Element:window.document.getElementById("pnlPerfect")};
    var frameId_ = 0;

    var Init_ = function()
    {
        /*
        imageLookup_.GetBgB64(round_.Element,"images/misc/announcer-sprites.png");
        imageLookup_.GetBgB64(roundNumber_.Element,"images/misc/announcer-sprites.png");
        imageLookup_.GetBgB64(fight_.Element,"images/misc/announcer-sprites.png");
        imageLookup_.GetBgB64(ko_.Element,"images/misc/announcer-sprites.png");
        imageLookup_.GetBgB64(perfect_.Element,"images/misc/announcer-sprites.png");
        */

        var y = 0;
        round_.Animation = CreateBasicAnimation("round",[]);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-0.png",2,0,y);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-1.png",3,0,y);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-2.png",1,0,y);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-3.png",1,0,y - 28);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-4.png",1,0,y - 67);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-7.png",1,0,y - 99);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-5.png",32,0,y - 83);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-6.png",2,0,y - 99);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-8.png",1,0,y - 114);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-9.png",1,0,y - 146);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-10.png",1,0,y - 183);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-11.png",2,0,y - 203);
        round_.Animation.AddFrame(this,"|images/misc/misc/round-12.png",3,0,y - 217);

        var y = 0;
        roundNumber_.Animation = CreateBasicAnimation("round number");
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-0.png",1,0,y - 8);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-1.png",2,0,y - 13);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-2.png",1,0,y - 13);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-3.png",2,0,y - 39);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-4.png",1,0,y - 75);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-5.png",2,0,y - 94);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-6.png",1,0,y - 111);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-5.png",32,0,y - 94);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-7.png",2,0,y - 111);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-6.png",2,0,y - 130);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-9.png",1,0,y - 178);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-10.png",1,0,y - 232);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-11.png",2,0,y - 256);
        roundNumber_.Animation.AddFrame(this,"|images/misc/misc/1-12.png",1,0,y - 256);

        var y = 0;
        fight_.Animation = CreateBasicAnimation("fight");
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-0.png",5,0,y - 24);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-1.png",5,0,y - 24);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-2.png",1,0,y - 27);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-3.png",1,0,y - 52);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-4.png",1,0,y - 88);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-5.png",1,0,y - 110);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-6.png",1,0,y - 126);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-7.png",16,0,y - 110);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-8.png",4,0,y - 124);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-9.png",1,0,y - 139);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-10.png",2,0,y - 174);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-11.png",1,0,y - 210);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-12.png",3,0,y - 223);
        fight_.Animation.AddFrame(this,"|images/misc/misc/fight-13.png",5,0,y - 242);

        var y = 28;
        ko_.Animation = CreateBasicAnimation("ko");
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-0.png",1,0,y);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-1.png",1,0,y);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-2.png",1,0,y);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-3.png",3,0,y - 28);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-4.png",3,0,y - 65);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-5.png",3,0,y - 81);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-6.png",3,0,y - 100);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-7.png",24,0,y - 81);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-8.png",6,0,y - 100);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-9.png",3,0,y - 119);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-10.png",3,0,y - 162);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-11.png",3,0,y - 216);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-12.png",3,0,y - 235);
        ko_.Animation.AddFrame(this,"|images/misc/misc/ko-13.png",3,0,y - 243);

        var y = 0;
        var x = 0;
        perfect_.Animation = CreateBasicAnimation("perfect");
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-0.png",4,0,y);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-1.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-2.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-3.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-4.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-5.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-6.png",4,x - 8,y + 15);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-7.png",4,x - 7,y + 18);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-8.png",4,x,y + 18);
        perfect_.Animation.AddFrame(this,"|images/misc/misc/perfect-9.png",100,x,y + 18);
    }

    var GetNextFrameID = function()
    {
        return frameId_++;
    }

    /**/


    /**/
    var Announcer = function()
    {
    }


    Announcer.prototype.Init = function()
    {
        Init_.call(this);
    }

    Announcer.prototype.Release = function()
    {
        round_.Element.style.display = "none";
        roundNumber_.Element.style.display = "none";
        fight_.Element.style.display = "none";
        ko_.Element.style.display = "none";
        perfect_.Element.style.display = "none";
    }


    Announcer.prototype.GetNextFrameID = function()
    {
        return frameId_++;
    }


    Announcer.prototype.SetMatch = function(match)
    {
        match_ = match;
    }


    Announcer.prototype.StartRound = function()
    {
        round_.IsAnimating = true;
        round_.StartFrame = match_.GetCurrentFrame();

        roundNumber_.IsAnimating = true;
        roundNumber_.StartFrame = round_.StartFrame + 45;

        fight_.IsAnimating = true;
        fight_.StartFrame = round_.StartFrame + 90;

        ko_.IsAnimating = false;
        ko_.StartFrame = 0;

        perfect_.IsAnimating = false;
        perfect_.StartFrame = 0;

        if(match_.GetRound() < 10)
        {
            soundManager_.QueueSound("audio/misc/round.zzz");
            soundManager_.QueueSound("audio/misc/" + match_.GetRound() +".zzz",1,45);
        }
        else
        {
            soundManager_.QueueSound("audio/misc/final.zzz");
            soundManager_.QueueSound("audio/misc/round.zzz",1, 35);
        }
        soundManager_.QueueSound("audio/misc/fight.zzz",1,90);
   }


    Announcer.prototype.Fight = function()
    {
    }


    Announcer.prototype.EndRound = function()
    {
        var delay = 0;
        var showPerfect = false;

        if(match_.GetTeamA().GetHealthbar().GetAmount() == 0 && match_.GetTeamB().GetHealthbar().GetAmount() == 0)
        {
            soundManager_.QueueSound("audio/misc/draw.zzz",1,delay);
        }
        else if(match_.GetTeamA().GetHealthbar().GetAmount() == 0)
        {
            soundManager_.QueueSound("audio/misc/you.zzz",1,delay);
            if(match_.GetTeamB().GetPlayer(0).ai_.IsRunning())
                soundManager_.QueueSound("audio/misc/lose.zzz",1,delay+35);
            else
                soundManager_.QueueSound("audio/misc/win.zzz",1,delay+35);

            if(showPerfect = (match_.GetTeamB().GetHealthbar().GetAmount() == match_.GetTeamB().GetHealthbar().GetMax()))
                soundManager_.QueueSound("audio/misc/perfect.zzz",1,delay+95);
        }
        else
        {
            soundManager_.QueueSound("audio/misc/you.zzz",1,delay);
            if(match_.GetTeamA().GetPlayer(0).ai_.IsRunning())
                soundManager_.QueueSound("audio/misc/lose.zzz",1,delay+35);
            else
                soundManager_.QueueSound("audio/misc/win.zzz",1,delay+35);

            if(showPerfect = (match_.GetTeamA().GetHealthbar().GetAmount() == match_.GetTeamB().GetHealthbar().GetMax()))
                soundManager_.QueueSound("audio/misc/perfect.zzz",1,delay+95);
        }
        

        if(!!showPerfect)
        {
            perfect_.IsAnimating = true;
            perfect_.StartFrame = match_.GetCurrentFrame() + delay+95;
        }

    }


    Announcer.prototype.KO = function()
    {
        ko_.IsAnimating = true;
        ko_.StartFrame = match_.GetCurrentFrame() + 5;
        soundManager_.QueueSound("audio/misc/ko.zzz",1,5);
    }


    Announcer.prototype.TimeOver = function()
    {
        Alert("Time over");
    }


    Announcer.prototype.FrameMove = function(frame)
    {
    }


    Announcer.prototype.Render = function(frame)
    {
        if(round_.IsAnimating && round_.StartFrame <= frame)
            round_.IsAnimating = round_.Animation.TryRender(frame, round_);
        if(roundNumber_.IsAnimating && roundNumber_.StartFrame <= frame)
            roundNumber_.IsAnimating = roundNumber_.Animation.TryRender(frame, roundNumber_);
        if(ko_.IsAnimating && ko_.StartFrame <= frame)
            ko_.IsAnimating = ko_.Animation.TryRender(frame, ko_);
        if(fight_.IsAnimating && fight_.StartFrame <= frame)
            fight_.IsAnimating = fight_.Animation.TryRender(frame, fight_);
        if(perfect_.IsAnimating && perfect_.StartFrame <= frame)
            perfect_.IsAnimating = perfect_.Animation.TryRender(frame, perfect_);
    }

    return new Announcer();

}


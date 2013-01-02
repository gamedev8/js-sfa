var CreateVCR = function()
{
    var STATES = {
        OFF: 0
        ,RECORDING:1
        ,PLAYING:2
    };

    var state_ = STATES.OFF;
    var data_ = {VHS:{},NbFrame:0};
    var frame_ = 0;

    var saveVHS = function()
    {
        if((data_.VHS.length == 0) || (state_ != STATES.RECORDING))
            return;

        data_.MaxFrame = game_.getCurrentFrame() - 10;
        data_.Stage = game_.Match.Stage.Params.Key;
        var round = game_.Match.getRound();
        data_.Round = game_.Match.isRoundOver() ? round - 1 : round;
        data_.TeamA = [];
        data_.TeamB = [];

        for(var i = 0; i < game_.Match.TeamA.Players.length; ++i)
            data_.TeamA.push({Character:game_.Match.TeamA.Players[i].Character, IsAlternate:game_.Match.TeamA.Players[i].IsAlternate});

        for(var i = 0; i < game_.Match.TeamB.Players.length; ++i)
            data_.TeamB.push({Character:game_.Match.TeamB.Players[i].Character, IsAlternate:game_.Match.TeamB.Players[i].IsAlternate});

        //send data to server
        var payload = JSON.stringify(data_);
        vcrService_.debug(payload)
        //vcrService_.submit(payload)

        //reset recording
        //data_.VHS = {};
    }

    var VCR = function()
    {
        this.OnPlaybackDone = null;
        this.OnLoadingDone = null;
    }

    VCR.prototype.getData = function() { return data_; }
    VCR.prototype.isPlaying = function() { return state_ == STATES.PLAYING; }
    VCR.prototype.isRecording = function() { return state_ == STATES.RECORDING; }
    VCR.prototype.record = function() { if(state_ == STATES.OFF) { state_ = STATES.RECORDING; } }
    VCR.prototype.stop = function()
    {
        if(state_ == STATES.RECORDING)
        {
            saveVHS();
            state_ = STATES.OFF;
        }
        else if(state_ == STATES.PLAYING)
        {
            state_ = STATES.OFF;
            if(!!this.OnPlaybackDone)
                this.OnPlaybackDone();
        }
        else
        {
            state_ = STATES.OFF;
        }
    }
    VCR.prototype.recordInput = function(team,index,folder,isDown,keyCode,frame,funcName)
    {
        if(state_ == STATES.RECORDING)
        {
            data_.VHS[frame] = data_.VHS[frame] || [];
            data_.VHS[frame].push({Team:team,Index:index,IsDown:isDown,Folder:folder,Bit:keyCode,Frame:frame,Func:funcName});
        }
    }

    VCR.prototype.save = function()
    {
        saveVHS();
    }

    VCR.prototype.load = function(onDoneLoading,onPlaybackDone,id)
    {
        this.stop();
        //retrieve data from server

        this.OnLoadingDone = onDoneLoading;
        this.OnPlaybackDone = onPlaybackDone;

        var onLoad = (function(thisValue)
        {
            return function(data)
            {
                if(!data)
                {
                    //no data... just go to the insert coin screen
                    thisValue.OnPlaybackDone();
                    return;
                }

                data_ = data;
                frame_ = 0;

                //clear out the current users
                game_.clearUsers();
                //add new users
                var teamA = [];
                for(var i = 0; i < data_.TeamA.length; ++i)
                {
                    var val = i * 11;
                    var user = game_.addUser("t1"+val+1+1000,"t1"+val+2+1000,"t1"+val+3+1000,"t1"+val+4+1000,"t1"+val+5+1000,"t1"+val+6+1000,"t1"+val+7+1000,"t1"+val+8+1000,"t1"+val+9+1000,"t1"+val+10+1000,"t1"+val+11+1000);
                    user.setChar(data_.TeamA[i].Character,data_.TeamA[i].IsAlternate);
                    teamA.push(user);
                }

                var teamB = [];
                for(var i = 0; i < data_.TeamB.length; ++i)
                {
                    var val = i * 11;
                    var user = game_.addUser("t2"+val+1+5000,"t2"+val+2+5000,"t2"+val+3+5000,"t2"+val+4+5000,"t2"+val+5+5000,"t2"+val+6+5000,"t2"+val+7+5000,"t2"+val+8+5000,"t2"+val+9+5000,"t2"+val+10+5000,"t2"+val+11+5000);
                    user.setChar(data_.TeamB[i].Character,data_.TeamB[i].IsAlternate);
                    teamB.push(user);
                }

                //start!
                state_ = STATES.PLAYING;
                thisValue.OnLoadingDone(teamA,teamB,data_.Stage);
            }
        })(this);

        vcrService_.load(id,onLoad);
    }

    VCR.prototype.onFrameMove = function(frame)
    {
        if(state_ == STATES.PLAYING)
        {
            var item = data_.VHS[frame];
            if(!!item)
            {
                for(var i = 0; i < item.length; ++i)
                {
                    ++frame_;
                    if(item[i].Team == 1)
                        game_.Match.TeamA.Players[item[i].Index].injectInput(item[i].IsDown,item[i].Bit,item[i].Frame,item[i].Func);
                    else if(item[i].Team == 2)
                        game_.Match.TeamB.Players[item[i].Index].injectInput(item[i].IsDown,item[i].Bit,item[i].Frame,item[i].Func);
                }
            }
            if(frame >= data_.MaxFrame)
            {
                state_ = STATES.OFF;
                if(!!this.OnPlaybackDone)
                    this.OnPlaybackDone();
            }
        }
    }


    return new VCR();
}

//saves and loads VHS data to/from the server
function CreateVCRService()
{
    var VCRService = function()
    {
    }

    VCRService.prototype.debug = function(json)
    {
        //send payload to webservice
        //console.log(json);
        //__vhs = JSON.parse(json);
    }

    VCRService.prototype.submit = function(json)
    {
        //send payload to webservice
    }

    VCRService.prototype.load = function(id,callback)
    {
        //retrieve data from webservice
        var temp = __vhs;
        if(!!temp)
            callback(temp);
    }

    return new VCRService();
}

vcrService_ = CreateVCRService();
var __vhs = null;
//var __vcrMoves = [];
//var __matchMoves = [];
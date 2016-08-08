var currentSounds = [],
    maxTimeout = 10000,
    timeoutStep = 0,
    soundInterval = 1000, //ms
	volumeValues = [],
    trackPlayed = false,
    fIntervals = [];

$(document).ready(function () {
    initSoundManager();

    var trackName = getCookie("VinylizerFileName");
    
    $("#filterVolume").change(function () {
        console.log(trackName, this.value);

        var audio = $("#filter");
        $("#mp3_filter_src").attr("src", "/Home/GetFilterForPlay?volumeLvl=" + this.value + "&fileName=" + trackName);
        audio[0].pause();
        audio[0].load();//suspends and restores all audio element

        //audio[0].play(); changed based on Sprachprofi's comment below
        audio[0].oncanplaythrough = audio[0].play();
    });

    $("form").submit(function () {

        var formData = new FormData($(this)[0]);

        $.post($(this).attr("action"), formData, function (data) {
            alert(data);
        });

        return false;
    });
});


var download = function (fileName) {
    $.get("/Home/GetAudioFileForDownload", {
        fileName: fileName,
        volumeLvl: $("#filterVolume").val()
    })
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var initSoundManager = function () {
    soundManager.setup({
        url: 'swf/',
        allowScriptAccess: 'always',
        preferFlash: false,
        html5PollingInterval: 50,
        flashVersion: 9, // required for AAC playback
        debugMode: false,
        useHighPerformance: true,
        onready: function () {
            console.debug('soundManager ready!');
        },
        ontimeout: function () {
            console.log("soundManager time out.");
        }
    });
};

var createSoundFilter = function (filterId) {
    if (currentSounds[filterId]) {
        currentSounds[filterId].stop();
        soundManager.destroySound(currentSounds[filterId].id);
    }
    var soundId = filterId.match(/\d+/)[0];

    currentSounds[filterId] = soundManager.createSound({
        id: 'sound_' + soundId,
        url: rPath + '/Home/GetFilterForPlay?filterId=' + soundId,
        autoLoad: true,
        autoPlay: false,
        onload: function () {

        },
        whileplaying: function () {
            var position = this.position

            if (position > soundInterval) {
                currentSounds[filterId].stop();
            }
        },
        whileloading: function () {
            
        },
        volume: volumeValues[filterId]
    });
};

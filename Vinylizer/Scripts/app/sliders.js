var rPath = '/vinylizer';

$(document).ready(function () {
    $.each($(".effect_slider"), function (k, v) {
        $(v).slider({
            step: 1,
            min: 0,
            max: 100,
            value: 0,
            tooltip: 'hide'
        });
    })

    $.each($('[data-player]'), function (k, v) {
        v.volume = 0;
    });

    var ef1 = $("#ef1").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef1.getValue()) }).data('slider');
    var ef2 = $("#ef2").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef2.getValue()) }).data('slider');
    var ef3 = $("#ef3").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef3.getValue()) }).data('slider');
    var ef4 = $("#ef4").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef4.getValue()) }).data('slider');
    var ef5 = $("#ef5").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef5.getValue()) }).data('slider');
    var ef6 = $("#ef6").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef6.getValue()) }).data('slider');
    var ef7 = $("#ef7").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef7.getValue()) }).data('slider');
    var ef8 = $("#ef8").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef8.getValue()) }).data('slider');
    var ef9 = $("#ef9").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef9.getValue()) }).data('slider');


    var ef1_1 = $("#ef1_1").on('slide', function () { handleFrequencySound(this.getAttribute('id'), ef1_1.getValue()) }).data('slider');

    $("#audio")[0].addEventListener("ended", function () {
        /*
        $.each($('[data-player]'), function (k, v) {
            v.pause();
            v.currentTime = 0;
        });
        */
        console.debug("Main sound stopped");
        clearInterval(fInterval);
        if (currentSound) {
            currentSound.stop();
            soundManager.destroySound(currentSound.id);
        }
    });

    $("#audio")[0].addEventListener("volumechange", function () {
        $("#audio")[0].volume = 1;
    });



    $("#audio")[0].addEventListener("pause", function () {
        /*
        $.each($('[data-player]'), function (k, v) {
            v.pause();
            v.currentTime = 0;
        });
        */
        console.debug("Main sound paused");
        clearInterval(fInterval);
        currentSound.pause();
    });

    $("#audio")[0].addEventListener("play", function () {
        /*
        $.each($('[data-player]'), function (k, v) {
            v.play();
        });
        */
        console.debug("Main sound played");
        clearInterval(fInterval);
        changeFrequancy();
    });
});

$('input[type=radio]').on('change', function () {
    var audio = $("#audio");
    audio[0].pause();
    $("#audio").attr("src", rPath + "/Home/GetAudioFileForPlay?fileName=" + $('input[name=trackName]:checked').val());
    audio[0].load();//suspends and restores all audio element
    audio[0].currentTime = 0;

    //audio[0].play(); changed based on Sprachprofi's comment below
    //audio[0].oncanplaythrough = audio[0].play();
});

var downloadSound = function () {
    var filename = $('input[name=trackName]:checked').val();
    var data = {
        fileName: filename
    }

    $.each($(".slider .slider-track .min-slider-handle"), function (k, v) {
        var volume = Number($(v).attr("aria-valuenow"));
        var key = k.toString();
        data["Volume" + (k + 1)] = volume;
    });

    console.log(data)

    //$.get("/Home/GetAudioFileForDownload", data, function (res) {
    //    console.log(res)
    //});
    download(window.path + rPath + "/Home/GetAudioFileForDownload", data, "GET");

}

var download = function (url, data, method) {

    if (url && data) {
        data = typeof data == 'string' ? data : $.param(data);
        var inputs = '';
        data = decodeURIComponent(data).replace(/\[\d+\]/g, "");
        if (data != null && data != '') {
            $.each(data.split('&'), function () {
                var pair = this.split('=');
                inputs += '<input type="hidden" name="' + pair[0].replace(/\[\]/g, "") + '" value="' + pair[1].replace(/\+/g, " ").toString() + '" />';
            });
        }
        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
    };
};

var handleFilterSound = function (id, volume) {
    //$("audio[data-player='" + id + "']")[0].volume = volume / 100;
    $("[data-value-placeholder='" + id + "']").text(volume);

    console.debug('sound volume', volume);
    if (currentSound) {
        currentSound.setVolume(volume);
    } else {
        volumeValue = volume;
    }
    //$("#filter")[0].currentTime = 0;
    //$("#filter")[0].play();
};

var handleFrequencySound = function (id, volume) {
    console.log(id, volume);
    $("[data-value-placeholder='" + id + "']").text(volume);

    //volumeValue
    timeoutStep = maxTimeout * (volume / 100);

    clearInterval(fInterval);
    if (currentSound) currentSound.stop();
    changeFrequancy();
};

var changeFrequancy = function () {
    var timeMs = timeoutStep + soundInterval;

    fInterval = setInterval(function () {
        console.log(timeoutStep + soundInterval, timeoutStep, soundInterval);
        if (currentSound) {
            currentSound.stop();
            currentSound.play();
        } else {
            createSoundFilter(1);
            currentSound.play();
        }
    }, timeMs);
};

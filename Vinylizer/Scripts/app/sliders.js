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


    var ef1_f = $("#ef1_f").on('slide', function () { handleFrequencySound(this.getAttribute('id'), ef1_f.getValue()) }).data('slider');
    var ef3_f = $("#ef3_f").on('slide', function () { handleFrequencySound(this.getAttribute('id'), ef3_f.getValue()) }).data('slider');
    var ef6_f = $("#ef6_f").on('slide', function () { handleFrequencySound(this.getAttribute('id'), ef6_f.getValue()) }).data('slider');
    var ef8_f = $("#ef8_f").on('slide', function () { handleFrequencySound(this.getAttribute('id'), ef8_f.getValue()) }).data('slider');

    $("#audio")[0].addEventListener("ended", function () {
        window.trackPlayed = false;
        $.each($('[data-frequency-id]'), function (k, v) {
            var data = $(v).data(); //frequencyId
            clearInterval(fIntervals[data.frequencyId]);
            if (currentSounds[data.frequencyId]) {
                currentSounds[data.frequencyId].stop();
                soundManager.destroySound(currentSounds[data.frequencyId].id);
            }
        });
    });

    $("#audio")[0].addEventListener("volumechange", function () {
        $("#audio")[0].volume = 1;
    });

    $("#audio")[0].addEventListener("pause", function () {
        window.trackPlayed = false;
        $.each($('[data-frequency-id]'), function (k, v) {
            var data = $(v).data(); //frequencyId
            clearInterval(fIntervals[data.frequencyId]);
            if (currentSounds[data.frequencyId]) { currentSounds[data.frequencyId].pause(); }
        });
    });

    $("#audio")[0].addEventListener("play", function () {
        window.trackPlayed = true;
        $.each($('[data-frequency-id]'), function (k, v) {
            var data = $(v).data(), //frequencyId
                value = $(v).text();

            if (value > 0) {
                clearInterval(fIntervals[data.frequencyId]);
                changeFrequancy(data.frequencyId);
            }
            
        });
    });
});

$('input[type=radio]').on('change', function () {
    var audio = $("#audio");
    audio[0].pause();
    $("#audio").attr("src", rPath + "/Home/GetAudioFileForPlay?fileName=" + $('input[name=trackName]:checked').val());
    audio[0].load();//suspends and restores all audio element
    audio[0].currentTime = 0;
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
    $("[data-value-placeholder='" + id + "']").text(volume);
    var filterId = id + '_f';

    if (currentSounds[filterId]) {
        currentSounds[filterId].setVolume(volume);
    } else {
        volumeValues[filterId] = volume;
    }
};

var handleFrequencySound = function (id, volume) {
    $("[data-frequency-id='" + id + "']").text(volume);    

    if (volume > 0) {
        timeoutStep = maxTimeout * (volume / 100);

        if (window.trackPlayed) {
            clearInterval(fIntervals[id]);
            if (currentSounds[id]) currentSounds[id].stop();
            changeFrequancy(id);
        }
    } else {
        clearInterval(fIntervals[id]);
        if (currentSounds[id]) currentSounds[id].stop();
    }
};

var changeFrequancy = function (filterId) {
    var timeMs = timeoutStep + soundInterval;

    fIntervals[filterId] = setInterval(function () {        
        if (currentSounds[filterId]) {
            currentSounds[filterId].stop();
            currentSounds[filterId].play();
        } else {
            createSoundFilter(filterId);
            currentSounds[filterId].play();
        }
    }, timeMs);
};

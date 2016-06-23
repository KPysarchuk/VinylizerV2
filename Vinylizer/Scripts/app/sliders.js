$(document).ready(function () {
    $.each($(".effect_slider"),function(k,v){
        $(v).slider({
            reversed: true,
            step: 1,
            min: 0,
            max: 100,
            value: 0,
            orientation: 'vertical',
            tooltip_position: 'top'
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
});

var handleFilterSound = function (id,volume) {
    console.log(id, volume);
    $("audio[data-player='" + id + "']")[0].volume = volume / 100;
    //$("#filter")[0].currentTime = 0;
    //$("#filter")[0].play();
};

$('input[type=radio]').on('change', function() {
    var audio = $("#audio");
    audio[0].pause();
    $("#audio").attr("src", "/Home/GetAudioFileForPlay?fileName=" + $('input[name=trackName]:checked').val());
    audio[0].load();//suspends and restores all audio element
    audio[0].currentTime = 0;

    //audio[0].play(); changed based on Sprachprofi's comment below
    //audio[0].oncanplaythrough = audio[0].play();
});

var downloadSound = function () {
    var filename = $('input[name=trackName]:checked').val();

    var filters = [];

    $.each($(".slider .slider-track .min-slider-handle"), function (k, v) {
        var volume = Number($(v).attr("aria-valuenow"));
        var key = k.toString();
        filters.push({ Id:k+1, Volume:volume });
    });

    var data = {
        fileName: filename,
        filters: filters
    }

    console.log(data)

    $.post("/Home/GetAudioFileForDownload", data, function (res) {
        console.log(res)
    });
}
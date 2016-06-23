$(document).ready(function () {
    $.each($(".effect_slider"),function(k,v){
        $(v).slider({
            reversed: true,
            step: 1,
            min: 0,
            max: 100,
            value: 100,
            orientation: 'vertical',
            tooltip_position: 'top'
        });
    })

    var ef1 = $("#ef1").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef1.getValue()) }).data('slider');
    var ef2 = $("#ef2").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef2.getValue()) }).data('slider');
    var ef3 = $("#ef3").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef3.getValue()) }).data('slider');
    var ef4 = $("#ef4").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef4.getValue()) }).data('slider');
    var ef5 = $("#ef5").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef5.getValue()) }).data('slider');
    var ef6 = $("#ef6").on('slide', function () { handleFilterSound(this.getAttribute('id'), ef6.getValue()) }).data('slider');
});

var handleFilterSound = function (id,volume) {
    //console.log(id, volume);
    $("#audio[data-player='" + id + "']")[0].volume(volume / 100);
    //$("#filter")[0].currentTime = 0;
    //$("#filter")[0].play();

};
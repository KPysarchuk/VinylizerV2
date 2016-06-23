$(document).ready(function () {
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

    $("#audio")[0].addEventListener("ended", function () {
        console.log("ended");
        $("#filter")[0].pause();
        $("#filter")[0].currentTime = 0;
    });

    $("#audio")[0].addEventListener("onplay", function () {
        console.log("ended");
        $("#filter")[0].play();
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
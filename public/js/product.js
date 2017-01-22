/* global $ */

var initLongPoll = function(url, cb) {
    $.ajax({
        method: 'GET',
        url: url,
        success: function(data) {
            cb(data);
        },
        complete: function() {
            initLongPoll(url, cb);
        },
        timeout: 30000
    });
};

$(".bottom-align").append("<h2></h2>"); // empty at end

var prevHTML = "";

initLongPoll('/pixel', function(data) {
    console.log("PIXEL: ", data);
    var html = getPixelHTML(data);
    // if (prevHTML === html) return;
    // prevHTML = html;
    $(".bottom-align").append(html);
    $(".bottom-align").append("<h2></h2>");
});

initLongPoll('/livetext', function(data) {
    console.log("Live: ", data);
    var html = getHTML(data);
    if (prevHTML === html) return;
    prevHTML = html;
    $("h2").last().replaceWith(html);
});

initLongPoll('/transcript', function(data) {
    console.log("END:", data);
    var html = getHTML(data)
    if (prevHTML === html) return;
    // if ($("h2").last().html() === html) return;
    $("h2").last().replaceWith(html);
    prevHTML = html;
    $("h2").each(function() {
        var opacity = parseFloat($(this).css("opacity")) - 0.25;
        if (opacity <= 0) {
            $(this).remove();
        }
        else {
            $(this).css("opacity", opacity);
        }
    });
    $(".bottom-align").append("<h2></h2>");
});

var getHTML = function(text) {
    var keywords = ['pixel', 'calendar', 'stock',
        'stocks', "weather", "philadelphia", "translate", "Spanish", "English",
        "Microsoft", "Google"
    ];

    for (var i = 0; i < keywords.length; i += 1) {
        text = text.replace(keywords[i], getHighlight(keywords[i]));
    };

    text = text.replace("%HESITATION", "");

    return "<h2>" + text + "</h2>";
};

var getPixelHTML = function(text) {
    return "<h2 class=''><mark class='highlight pixel'>" + text + "</mark></h2>";
};

var getHighlight = function(word) {
    return "<mark class='highlight'>" + word + "</mark>";
};

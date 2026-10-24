function sendRequest(url, method, params, successCallback, errorCallback , loadingClass) {

    if (loadingClass) {
        $(loadingClass).css("display" , "block");
    }

    $.ajax({
        url: url,
        type: method,
        data: params,
        success: function(res) { 
            successCallback && successCallback(res);
            if (loadingClass) {
                $(loadingClass).css("display" , "none");
            }
        },
        error: function(){ 
            errorCallback && errorCallback();
            if (loadingClass) {
                $(loadingClass).css("display" , "none");
            }
        }
    });
}

function getTextFromHtml(tag) {
    return $("<div>" + tag + "</div>").text();
}

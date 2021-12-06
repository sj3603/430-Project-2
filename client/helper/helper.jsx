// handles errors and displays the appropriate message argument
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#nftMessage").animate({width:"toggle"}, 350);
};

// redirects the user to the appropriate endpoint argument
const redirect = (response) => {
    $("#nftMessage").animate({width:"hide"}, 350);
    window.location = response.redirect;
};

// used for sending GET, POST, DELETE, and HEAD requests to the server
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
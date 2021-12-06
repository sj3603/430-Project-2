"use strict";

// handles logging the user in by sending a post request to the server with the users login info
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: "hide"
  }, 350);

  if ($("user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty bromosapien");
    return false;
  }

  sendAjax('Post', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // handles signing up the user by sending a post request to the server with the given account info


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: "hide"
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required bromosapien!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords don't match bromosapien!");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; // handles resetting the users password by sending a post request to the server with the users current and new info


var handleReset = function handleReset(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#currentPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Missing Fields bromosapien");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match bromosapien");
    return false;
  }

  sendAjax('POST', $("#resetForm").attr("action"), $("#resetForm").serialize(), redirect);
  return false;
}; // the login window React component


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }));
}; // the signup window React component


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  }));
}; // the reset password window react component


var ResetWindow = function ResetWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "resetForm",
    name: "resetForm",
    onSubmit: handleReset,
    action: "/reset",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "currentPass"
  }, "Current Password: "), /*#__PURE__*/React.createElement("input", {
    id: "currentPass",
    type: "password",
    name: "currentPass",
    placeholder: "current password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
}; // renders the login window


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // renders the signup window


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // renders the password reset window


var createResetWindow = function createResetWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ResetWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // sets up the page


var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var resetButton = document.querySelector("#resetButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  resetButton.addEventListener("click", function (e) {
    e.preventDefault();
    createResetWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //default view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// handles errors and displays the appropriate message argument
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#nftMessage").animate({
    width: "toggle"
  }, 350);
}; // redirects the user to the appropriate endpoint argument


var redirect = function redirect(response) {
  $("#nftMessage").animate({
    width: "hide"
  }, 350);
  window.location = response.redirect;
}; // used for sending GET, POST, DELETE, and HEAD requests to the server


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

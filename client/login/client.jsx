// handles logging the user in by sending a post request to the server with the users login info
const handleLogin = (e) => {
  e.preventDefault();

  $("#nftMessage").animate({ width: "hide" }, 350);

  if ($("user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty bromosapien");
    return false;
  }

  sendAjax('Post', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

// handles signing up the user by sending a post request to the server with the given account info
const handleSignup = (e) => {
  e.preventDefault();

  $("#nftMessage").animate({ width: "hide" }, 350);
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
};

// handles resetting the users password by sending a post request to the server with the users current and new info
const handleReset = (e) => {
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
};

// the login window React component
const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

// the signup window React component
const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

// the reset password window react component
const ResetWindow = (props) => {
  return (
    <form id="resetForm"
      name="resetForm"
      onSubmit={handleReset}
      action="/reset"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="currentPass">Current Password: </label>
      <input id="currentPass" type="password" name="currentPass" placeholder="current password" />
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

// renders the login window
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// renders the signup window
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// renders the password reset window
const createResetWindow = (csrf) => {
  ReactDOM.render(
    <ResetWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// sets up the page
const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  const resetButton = document.querySelector("#resetButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    createResetWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});

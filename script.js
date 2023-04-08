const loginButton = document.getElementById("login-button");

if (loginButton) {
  loginButton.onclick = () => {
    window.location.assign("/index.html");
  };
}

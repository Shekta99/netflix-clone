const loginButton = document.getElementById("login-button");

if (loginButton) {
  loginButton.onclick = () => {
    window.location.assign("/viz/index.html");
  };
}

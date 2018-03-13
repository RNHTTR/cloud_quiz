// $(document).ready( function() {
//   var username;
//   try {
//     username = getCurrentUser()['username'];
//   }
//
//   finally {
//     console.log(getCurrentUser());
//     // _config.cognito.username = username;
//     console.log(username);
//     loggedIn(username);
//   }
//
// });
//
// if (_config.cognito.username) {
//   document.getElementById("logInButton").style.display = "none";
//   document.getElementById("signUpButton").style.display = "none";
//   document.getElementById("menu").style.display = "block";
//   document.getElementById("dashboard").style.display = "block";
//   console.log('username: ' + _config.cognito.username);
// } else {
//   document.getElementById("logInButton").style.display = "block";
//   document.getElementById("signUpButton").style.display = "block";
//   document.getElementById("menu").style.display = "none";
//   document.getElementById("dashboard").style.display = "none";
//   console.log('no logged in user');
// }

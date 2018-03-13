window._config = {
    cognito: {
        userPoolId: 'us-east-1_qr7SK5lX4', // e.g. us-east-2_uXboG5pAb
        userPoolClientId: '3qra9jo2eja4ss4uf0muu25pbt', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-east-1' // e.g. us-east-2
    },
    api: {
        invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    }
};

function test() {
  console.log("we are successful!");
}

// $(document).ready( function() {
//   if (_config.cognito.username) {
//     document.getElementById("logInButton").style.display = "none";
//     document.getElementById("signUpButton").style.display = "none";
//     document.getElementById("menu").style.display = "block";
//     document.getElementById("dashboard").style.display = "block";
//     console.log('username: ' + _config.cognito.username);
//   } else {
//     document.getElementById("logInButton").style.display = "block";
//     document.getElementById("signUpButton").style.display = "block";
//     document.getElementById("menu").style.display = "none";
//     document.getElementById("dashboard").style.display = "none";
//     console.log('no logged in user');
//   }
// });

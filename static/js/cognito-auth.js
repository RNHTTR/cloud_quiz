// global CloudQuizMain _config AmazonCognitoIdentity AWSCognito

var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

const userPoolData = {
  'userPoolId': _config.cognito.userPoolId,
  'clientId'  : _config.cognito.userPoolClientId,
  'region'    : _config.cognito.region
};

var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);


function signUp() {

  var attributeList = [];

  var email    = $('#signUpEmail').val();
  var password = $('#signUpPassword').val();
  var name     = $('#full-name').val();

  var dataEmail = {
      Name : 'email',
      Value : email
  };

  var dataName = {
    Name: 'name',
    Value: name
  }

  var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
  var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
  attributeList.push(attributeEmail);
  attributeList.push(attributeName);

  userPool.signUp(email, password, attributeList, null, function(err, result){
          if (err) {
              alert(err);
              return;
          }
          cognitoUser = result.user;
          console.log('user name is ' + cognitoUser.getUsername());
          loggedIn(cognitoUser.getUsername());
  });
  return false;
}


function logIn() {

  var email    = $('#logInEmail').val();
  var password = $('#logInPassword').val();

  console.log('email: ' + email);
  console.log('pw: ' + password)
  console.log('aws\n' + AWS.config);
  var authenticationData = {
      Username : email,
      Password : password
  };

  var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

  var userData = {
        Username : email,
        Pool : userPool
  };

  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  console.log('cognito user...')
  console.log(cognitoUser);
  cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('success!!!');
            console.log('hi from cognitoUser: '+ cognitoUser['username']);
            username = cognitoUser['username'];
            _config.cognito.username = username;
            loggedIn(username);
        },

        onFailure: function(err) {
            alert(err);
        }

    });
  return false;
}


function loggedIn(username) {
  if (username) {
      document.getElementById("logInButton").style.display = "none";
      document.getElementById("signUpButton").style.display = "none";
      document.getElementById("menu").style.display = "block";
      document.getElementById("dashboard").style.display = "block";
    } else {
      document.getElementById("logInButton").style.display = "block";
      document.getElementById("signUpButton").style.display = "block";
      document.getElementById("menu").style.display = "none";
      document.getElementById("dashboard").style.display = "none";
      console.log('no logged in user');
    }
}

function checkForUser() {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    console.log('success... user is: ' + cognitoUser.username);
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());
            console.log(cognitoUser);
            var username = cognitoUser['username'];
            try {
              loggedIn(username);
            }
            catch(err) {
                console.log(err);
            }

        });
        cognitoUser.getUserAttributes(function(err, result) {
                if (err) {
                    alert(err);
                    return;
                }
                for (i = 0; i < result.length; i++) {
                    if (result[i].getName() === 'name') {
                      user_first_name = result[i].getValue();
                      $('#greeting').html('Hey ' + user_first_name);
                      $('#dashboard-greeting').html(user_first_name + '\'s Dashboard');
                      console.log(user_first_name);
                    } else {
                      // console.log('no name found yet...');
                    }
                }
            });
    } else {
      console.log('no luck from checkForUser')
      loggedIn(null);
    }
}

$(document).ready( function() {
  checkForUser();
});

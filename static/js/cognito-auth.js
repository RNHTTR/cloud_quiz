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
  // var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

  var attributeList = [];

  var email    = $('#signUpEmail').val();
  var password = $('#signUpPassword').val();

  console.log('email: ' + email);

  var dataEmail = {
      Name : 'email',
      Value : email
  };

  var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  userPool.signUp(email, password, attributeList, null, function(err, result){
          if (err) {
              alert(err);
              return;
          }
          cognitoUser = result.user;
          console.log('user name is ' + cognitoUser.getUsername());
  });
  console.log(poolData.UserPoolId);
  console.log(userPool);
  return false;
  // alert('test');
}

function logIn() {
  console.log('hi!');
  // var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

  var email    = $('#logInEmail').val();
  var password = $('#logInPassword').val();

  console.log('email: ' + email);
  console.log('pw: ' + password)

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
  console.log(cognitoUser);
  cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            alert('test');
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('success!!!');
        },

        onFailure: function(err) {
            alert(err);
        }

    });
    // alert('hold up!');
  console.log(poolData.UserPoolId);
  console.log(userPool);
  return false;
  // alert('hold upx2!');

}

function getCurrentUser() {
  var cognitoUser = userPool.getCurrentUser();
  console.log(cognitoUser);
}

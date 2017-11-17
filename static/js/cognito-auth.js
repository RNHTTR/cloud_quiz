// global CloudQuizMain _config AmazonCognitoIdentity AWSCognito

var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
    Name : 'email',
    Value : 'rn.hatter@gmail.com'
};

var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
attributeList.push(attributeEmail);

userPool.signUp('ryan', 'soMeTESTpasSword??', attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
});

$(document).ready( function() {
  console.log(poolData.UserPoolId);
  console.log(userPool);
});

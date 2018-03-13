// TODO: - Get logged in userid and use it to retrieve past quizzes it with userHistoryData
var userHistoryData;

function rotate90(id) {
  const element = $(id);
  if (element.hasClass('point-left')) {
    element.addClass('point-down');
    element.removeClass('point-left');
  } else {
    element.addClass('point-left');
    element.removeClass('point-down');
  }
}

function setModalData(row) {
  var keys = Object.keys(userHistoryData);
  var key  = keys[0];

  var quizData = userHistoryData[key];
  var index    = row.rowIndex - 2;
  var data     = quizData[index]['results'];

   $("#historicQuizTable").empty();

   console.log(data.length);

   for (var i = 0; i < data.length; i++) {
     var qNo           = i + 1;
     var item          = data[i];
     var topic         = item['topic'];
     var question      = item['question'];
     var correctAnswer = item['correct_answers'][0];
     var selectedAnswer;

     if (item.selected_answer === undefined) {
       selectedAnswer = "";
     } else {
       selectedAnswer = item.selected_answer;
     }

     if (correctAnswer === selectedAnswer) {
       var glyph = '"glyphicon glyphicon-ok-sign text-success mr-10"';
      //  break;
     } else {
       var glyph = '"glyphicon glyphicon-remove-circle text-danger mr-10"';
     }

     var id = "'#triangle" + i + "'";

     var entry =
             '\
             <tr data-toggle="collapse" data-target="#accordion' + i + '" class="accordion-toggle" onclick="rotate90(' + id + ')">\
              <td class="text-center">' + qNo + '</td>\
              <td>' + topic + '</td>\
              <td>' + question + '</td>\
              <td>' + selectedAnswer  + '</td>\
              <td>' + correctAnswer + '</td>\
              <td class="text-center"><span class=' + glyph + '"></span></td>\
              <td><span id="triangle' + i + '" class="point-left glyphicon glyphicon-triangle-left"></span></td>\
            </tr>\
            <tr>\
              <td colspan="6" class="hiddenRow">\
                <div id="accordion' + i + '" class="accordian-body collapse">\
                  </p>Solutions coming soon.</p>\
                </div>\
              </td>\
            </tr>\
            '

     $("#historicQuizTable").append(entry);
     console.log("q " + qNo);
   }

}

function loadHistory() {
  var keys = Object.keys(userHistoryData);

  for (var i=0; i < keys.length; i++){
      var key = keys[i];
      var quizData = userHistoryData[key];
      for (var j=0; j < quizData.length; j++) {
        // console.log(userHistoryData[key][j]);
        var quizDate    = new Date(quizData[j]['date']);
        var month       = quizDate.getMonth();
        var date        = quizDate.getDate();
        var year        = quizDate.getFullYear();
        var displayDate = month + '/' + date + '/' + year;

        var correct        = quizData[j]['correct'];
        var totalQuestions = quizData[j]['totalQuestions'];
        // console.log(Date(date));
        // console.log('day ' + date.getDay());
        var historyEntry =
        '\
        <tr data-toggle="modal" data-target="#quizResultsModal" onclick="setModalData(this)">\
          <td class="text-center">' + displayDate + '</td>\
          <td class="text-center">' + correct + '</td>\
          <td class="text-center">' + totalQuestions + '</td>\
          <td class="text-center">' + Math.round( 100 * correct / totalQuestions, 0) + '</td>\
         </tr>\
         '

        $("#historyTableBody").append(historyEntry);
      }
    }
}

$(document).ready( function() {
  // username = getCurrentUser()['username'];
  // console.log(username);
  $.ajax({
    type: 'POST',
    // url: "https://2yroiqqvf8.execute-api.us-east-1.amazonaws.com/prod/post-quiz-results",
    crossDomain: true,
    contentType: 'application/json',
    data: JSON.stringify(userHistoryData),
    dataType: 'json',
    error: function(xhr, status, error) {
      // TODO: - HANDLE ERRORS
      // console.log(xhr)
      userHistoryData = {"userid123": [{"quizid": "000001", "date": "2018-02-20", "correct": 9, "totalQuestions": 10, "results": [{"question":"How many S3 buckets can I have per account by default?","QuestionId":1,"difficulty":2,"correct_answers":["100"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["50","10","20","75"],"topic":"Object Storage","answers":["100","50","20","10","75"],"answerId":"#answerA","selected_answer":"100","marked":false},{"question":"What is an additional way to secure the AWS accounts of both the root account and new users alike?","QuestionId":1,"difficulty":2,"correct_answers":["Implement Multi-Factor Authentication for all accounts."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Configure the AWS Console so that you can only log in to it from your internal network IP address range.","Store the access key id and secret access key of all users in a publicly accessible plain text document on S3 of which only you and members of your organisation know the address to.","Configure the AWS Console so that you can only log in to it from a specific IP Address range"],"topic":"IAM","answers":["Configure the AWS Console so that you can only log in to it from your internal network IP address range.","Store the access key id and secret access key of all users in a publicly accessible plain text document on S3 of which only you and members of your organisation know the address to.","Configure the AWS Console so that you can only log in to it from a specific IP Address range","Implement Multi-Factor Authentication for all accounts."],"answerId":"#answerD","selected_answer":"Implement Multi-Factor Authentication for all accounts.","marked":false},{"question":"Route53 does not support zone apex records (naked domain names).","QuestionId":0,"difficulty":2,"correct_answers":["False."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["It depends on the configuration.","True.","Only in Us-East-1."],"topic":"Route53","answers":["It depends on the configuration.","True.","Only in Us-East-1."],"answerId":"#answerA","selected_answer":"False.","marked":false},{"question":"Which AWS service is ideal for Business Intelligence Tools/Data Warehousing?","QuestionId":0,"difficulty":1,"correct_answers":["Redshift"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Elastic Beanstalk","ElastiCache","DynamoDB"],"topic":"Databases","answers":["Elastic Beanstalk","ElastiCache","DynamoDB","Redshift"],"answerId":"#answerD","selected_answer":"Redshift","marked":false},{"question":"What is the difference between SNS and SQS?","QuestionId":1,"difficulty":3,"correct_answers":["SNS is a push notification service, whereas SQS is message system that requires worker nodes to poll a queue."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["SQS sends messages to people on topics, whereas SNS manages tasks.","SNS pulls (polls), whereas SQS is push based message service.","SQS and SNS are basically the same service."],"topic":"Application Services","answers":["SQS sends messages to people on topics, whereas SNS manages tasks.","SNS pulls (polls), whereas SQS is push based message service.","SQS and SNS are basically the same service."], "selected_answer":"SQS sends messages to people on topics, whereas SNS manages tasks."},{"question":"Which of the following AWS services is a non-relational database?","QuestionId":0,"difficulty":1,"correct_answers":["DynamoDB"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["ElastiCache","RDS","Redshift"],"topic":"Databases", "selected_answer":"DynamoDB"},{"question":"Can a placement group be deployed across multiple Availability Zones?","QuestionId":1,"difficulty":3,"correct_answers":["No."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Yes.","Yes, but only using the AWS API.","Only in Us-East-1."],"topic":"EC2", "selected_answer":"No."},{"question":"You work for a major news network in Europe. They have just released a new mobile app that allows users to post their photos of newsworthy events in real time. Your organization expects this app to grow very quickly, essentially doubling its user base each month. The app uses S3 to store the images, and you are expecting sudden and sizeable increases in traffic to S3 when a major news event takes place (as users will be uploading large amounts of content.) You need to keep your storage costs to a minimum, and it does not matter if some objects are lost. With these factors in mind, which storage media should you use to keep costs as low as possible?","QuestionId":1,"difficulty":4,"correct_answers":["S3 - Reduced Redundancy Storage (RRS)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["S3 - Provisioned IOPS","S3 - Infrequently Accessed Storage","Glacier"],"topic":"Object Storage", "selected_answer": "S3 - Reduced Redundancy Storage (RRS)"},{"question":"EBS Snapshots are backed up to S3 in what manner?","QuestionId":1,"difficulty":2,"correct_answers":["Incrementally"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Decreasingly","Exponentially","EBS snapshots are not stored on S3."],"topic":"EC2","answers":["Decreasingly","Exponentially","EBS snapshots are not stored on S3.", "Incrementally"],"answerId":"#answerE","selected_answer":"Incrementally"},{"question":"You work for a health insurance company that amasses a large number of patients' health records. Each record will be used once when assessing a customer, and will then need to be securely stored for a period of 7 years. In some rare cases, you may need to retrieve this data within 24 hours of a claim being lodged. Given these requirements, which type of AWS storage would deliver the least expensive solution?","QuestionId":0,"difficulty":4,"correct_answers":["Glacier"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["S3 - RRS","S3 - IA","S3"],"topic":"Object Storage","marked":false,"answers":["S3 - RRS","S3 - IA","S3","Glacier"],"answerId":"#answerA", selected_answer:"Glacier"}]},{"quizid": "000002", "date": "2018-02-19", "correct": 42, "totalQuestions": 80, "results": [{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 1","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also correct! Pick me too! :)","Incorrect. Don't pick me..","Still incorrect...","Also incorrect.","Correct! Pick me! 1"],"answerId":"#answerA","selected_answer":"Also correct! Pick me too! :)","marked":false},{"question":"What's the answer to question 2?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 2","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also incorrect.","Also correct! Pick me too! :)","Correct! Pick me! 2","Still incorrect...","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Still incorrect...","marked":false},{"question":"What's the answer to 3?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 3"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Correct! Pick me! 3","Still incorrect...","incorrect too!","Incorrect. Don't pick me..","Also incorrect."],"answerId":"#answerA","selected_answer":"Correct! Pick me! 3","marked":false},{"question":"What's the answer to 4?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 4"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Also incorrect.","Still incorrect...","incorrect too!","Correct! Pick me! 4","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Correct! Pick me! 4","marked":false},{"question":"What's the answer to question 5?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 5","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"IAM","answers":["Incorrect. Don't pick me..","Still incorrect...","Correct! Pick me! 5","Also correct! Pick me too! :)","Also incorrect."]},{"question":"What's the answer to 6?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 6"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Databases"},{"question":"What's the answer to question 7?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 7","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 8?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 8","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 9?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!9","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Security","answers":["Also incorrect.","Also correct! Pick me too! :)","Still incorrect...","Incorrect. Don't pick me..","Correct! Pick me!9"],"answerId":"#answerE","selected_answer":"Correct! Pick me!9"},{"question":"What's the answer to 10?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 10"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Storage","marked":false,"answers":["Correct! Pick me! 10","incorrect too!","Also incorrect.","Incorrect. Don't pick me..","Still incorrect..."],"answerId":"#answerA"}]}]}

      // console.log(userHistoryData[0]);
      loadHistory()
          // console.log(userHistoryData[key][0]);
      // }
    },
    success: function(result){
      // TODO: - HANDLE SUCCESS
      console.log('woohoo!')
      loadHistory()
    }
  });
});

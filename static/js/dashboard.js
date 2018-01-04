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
      userHistoryData = {"userid123": [{"quizid": "000001", "date": "2017-12-25", "correct": 10, "totalQuestions": 10, "results": [{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 1","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also correct! Pick me too! :)","Incorrect. Don't pick me..","Still incorrect...","Also incorrect.","Correct! Pick me! 1"],"answerId":"#answerA","selected_answer":"Also correct! Pick me too! :)","marked":false},{"question":"What's the answer to question 2?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 2","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also incorrect.","Also correct! Pick me too! :)","Correct! Pick me! 2","Still incorrect...","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Still incorrect...","marked":false},{"question":"What's the answer to 3?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 3"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Correct! Pick me! 3","Still incorrect...","incorrect too!","Incorrect. Don't pick me..","Also incorrect."],"answerId":"#answerA","selected_answer":"Correct! Pick me! 3","marked":false},{"question":"What's the answer to 4?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 4"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Also incorrect.","Still incorrect...","incorrect too!","Correct! Pick me! 4","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Correct! Pick me! 4","marked":false},{"question":"What's the answer to question 5?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 5","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"IAM","answers":["Incorrect. Don't pick me..","Still incorrect...","Correct! Pick me! 5","Also correct! Pick me too! :)","Also incorrect."]},{"question":"What's the answer to 6?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 6"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Databases"},{"question":"What's the answer to question 7?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 7","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 8?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 8","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 9?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!9","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Security","answers":["Also incorrect.","Also correct! Pick me too! :)","Still incorrect...","Incorrect. Don't pick me..","Correct! Pick me!9"],"answerId":"#answerE","selected_answer":"Correct! Pick me!9"},{"question":"What's the answer to 10?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 10"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Storage","marked":false,"answers":["Correct! Pick me! 10","incorrect too!","Also incorrect.","Incorrect. Don't pick me..","Still incorrect..."],"answerId":"#answerA"}]},{"quizid": "000002", "date": "2017-12-26", "correct": 42, "totalQuestions": 80, "results": [{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 1","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also correct! Pick me too! :)","Incorrect. Don't pick me..","Still incorrect...","Also incorrect.","Correct! Pick me! 1"],"answerId":"#answerA","selected_answer":"Also correct! Pick me too! :)","marked":false},{"question":"What's the answer to question 2?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 2","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Databases","answers":["Also incorrect.","Also correct! Pick me too! :)","Correct! Pick me! 2","Still incorrect...","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Still incorrect...","marked":false},{"question":"What's the answer to 3?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 3"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Correct! Pick me! 3","Still incorrect...","incorrect too!","Incorrect. Don't pick me..","Also incorrect."],"answerId":"#answerA","selected_answer":"Correct! Pick me! 3","marked":false},{"question":"What's the answer to 4?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 4"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"EC2","answers":["Also incorrect.","Still incorrect...","incorrect too!","Correct! Pick me! 4","Incorrect. Don't pick me.."],"answerId":"#answerD","selected_answer":"Correct! Pick me! 4","marked":false},{"question":"What's the answer to question 5?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 5","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"IAM","answers":["Incorrect. Don't pick me..","Still incorrect...","Correct! Pick me! 5","Also correct! Pick me too! :)","Also incorrect."]},{"question":"What's the answer to 6?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 6"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Databases"},{"question":"What's the answer to question 7?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 7","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 8?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 8","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"VPC"},{"question":"What's the answer to question 9?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!9","Also correct! Pick me too! :)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."],"topic":"Security","answers":["Also incorrect.","Also correct! Pick me too! :)","Still incorrect...","Incorrect. Don't pick me..","Correct! Pick me!9"],"answerId":"#answerE","selected_answer":"Correct! Pick me!9"},{"question":"What's the answer to 10?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 10"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"],"topic":"Storage","marked":false,"answers":["Correct! Pick me! 10","incorrect too!","Also incorrect.","Incorrect. Don't pick me..","Still incorrect..."],"answerId":"#answerA"}]}]}

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

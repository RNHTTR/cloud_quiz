$.ajax({
  type: 'GET',
  // url: "https://2yroiqqvf8.execute-api.us-east-1.amazonaws.com/prod/ServeQuestion",
  data: queryStringParameters,
  error: function(xhr, status, error) {
    // TODO: - HANDLE ERRORS
    console.log(xhr)
    // jQuery(function ($) {
    //   display = $('#timeRemaining');
    //   startTimer(3, display);
    // });


    // NOTE: - TESTING WITHOUT MAKING REQUESTS TO API GATEWAY
     questionData = [{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me!"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me!"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me!"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me!"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]}]

    updateQuestion(questionData, num=1)

    // questionData = result

    const questionNumberText = num.toString()+' of';
    const numQuestionsText   = numQuestions+'.';

    $("#questionNumber").text(questionNumberText);
    $("#numberQuestions").text(numQuestionsText);

    jQuery(function ($) {
          display = $('#timeRemaining');
      startTimer(duration, display);
    });

  },
  success: function(result){

    updateQuestion(result, num=1)

    questionData = result

    const questionNumberText = num.toString()+' of';
    const numQuestionsText   = numQuestions+'.';

    $("#questionNumber").text(questionNumberText);
    $("#numberQuestions").text(numQuestionsText);

    jQuery(function ($) {
          display = $('#timeRemaining');
      startTimer(duration, display);
    });
  }
});
// });

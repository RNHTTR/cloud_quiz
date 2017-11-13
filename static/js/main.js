// Globals
var questionNumber     = 1;
const letters          = ['A', 'B', 'C', 'D', 'E'];
var selectedCorrect    = [];
var selectedIncorrect  = [];
var skipped            = [];
var currentAnswer;
// var currentAnswerId;
var marked;


function shuffle(arrayToShuffle) {
  var currentIndex = arrayToShuffle.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arrayToShuffle[currentIndex];
    arrayToShuffle[currentIndex] = arrayToShuffle[randomIndex];
    arrayToShuffle[randomIndex] = temporaryValue;
  }

  return arrayToShuffle;
}

function parseQuery() {
  var pairs = location.search.slice(1).split('&');

    var queryResult = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        queryResult[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(queryResult));
    // return result;
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    countdown = setInterval(function () {

        var minutes = parseInt(timer / 60, 10);
        var seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
            alert("Time's up!")
        }
    }, 1000);
}

function pauseTimer(display) {
  const currentTime = display.text();
  clearInterval(countdown);
}

function setAnswer(element, num, fromReviewFlag=false) {

  if (fromReviewFlag) {
    currentAnswer = element[0].nextSibling.nodeValue;
  } else {
    questionData[num - 1]['answerId'] = '#' + element.innerHTML.slice(11,18);
    currentAnswer = element.textContent;
  }

}

function updateQuestion(data, num) {
  // const topic            = data[index]['Topic'];
  const index      = num - 1;
  correctAnswers   = data[index]['correct_answers'];
  const question   = data[index]['question'];
  incorrectAnswers = data[index]['incorrect_answers'];
  // const answers          = shuffle(correctAnswers.concat(incorrectAnswers));

  var answers;
  if ('answers' in data[index]) {
    answers = data[index]['answers'];
  } else {
    answers = shuffle(correctAnswers.concat(incorrectAnswers));
    data[index]['answers'] = answers;
  }


  // $("#topic").text(topic);
  $("#question").text(question);

  $('#answers').empty();
  for (var i = 0; i < answers.length; i++) {
    var item   = answers[i];
    var letter = letters[i];
    var id     = 'answer' + letter;
    // var answer = '<div class="radio">' + letter + '. &nbsp;<label id="' + id + '" onclick="setAnswer(this, ' + num + ')"><input type="radio" name="optradio">' + item + '</label></div>';
    var answer = '<div class="radio">' + letter + '. &nbsp;<label onclick="setAnswer(this, ' + num + ')"><input id="' + id + '" type="radio" name="optradio">' + item + '</label></div>';
    // var answer = '<div class="radio">' + letter + '. &nbsp;<label onclick="setAnswer(this, ' + num + ')"><input id="' + id + '" type="radio" name="optradio">' + item + '</input></label></div>';
    $('#answers').append(answer);
  };

  const questionNumberText = num.toString()+' of';
  $("#questionNumber").text(questionNumberText);

  var answerId = questionData[num - 1]['answerId'];

  $(answerId).prop('checked', true);

  questionNumber += 1;

}

$(document).ready(function() {
  $('#nextQuestion').click(function() {

    if (selectedCorrect.includes(questionData[questionNumber - 2])) {
      const index = selectedCorrect.indexOf(questionData[questionNumber - 2]);
      selectedCorrect.splice(index, 1);
    } else if (selectedIncorrect.includes(questionData[questionNumber - 2])) {
      const index = selectedIncorrect.indexOf(questionData[questionNumber - 2]);
      selectedIncorrect.splice(index, 1);
    }

    if (currentAnswer === undefined) {
      skipped.push(questionData[questionNumber - 2]);
    }
    else if (correctAnswers.includes(currentAnswer)) {
      selectedCorrect.push(questionData[questionNumber - 2]);
      currentAnswer = undefined;
    } else if (incorrectAnswers.includes(currentAnswer)) {
      selectedIncorrect.push(questionData[questionNumber - 2]);
      currentAnswer = undefined;
    }

    if (questionData.length > questionNumber) {
      updateQuestion(questionData, questionNumber);
      if (marked) {
        questionData[questionNumber - 3]['marked'] = true;
      } else {
        questionData[questionNumber - 3]['marked'] = false;
      }
    } else if (questionData.length === questionNumber) {
      $('#nextQuestion').addClass('disabled');
      updateQuestion(questionData, questionNumber);
    } else {
      alert('Here are the questions...');
    }

    $("#mark").prop("checked", false);
    marked = false

  });
});

// TODO: - Handle question marking for the last question
function markedForReview(cb) {
  marked = cb.checked;
}

function loadReviewTable(data) {
  $("#reviewTableBody").empty();
  for (var i = 0; i < data.length; i++) {
    var item     = data[i];
    var question = item.question;
    var markedQ  = item.marked;
    var qNo      = i + 1;

    if (item['answerId']) {
      var glyph = '"glyphicon glyphicon-ok-sign text-success"'
    } else {
      var glyph = '"glyphicon glyphicon-remove-circle text-danger"'
    }

    if (markedQ) {
      markedGlyph = '"glyphicon glyphicon-alert text-warning"'
    } else {
      markedGlyph = ''
    }

    var entry = '<tr class="clickable-row clickable-hover" onclick="loadQuestionFromReview(' + qNo + ')"><td class="text-center">' + qNo + '</td><td>' + question + '</td><td class="text-center"><span class=' + glyph + '></span></td><td class="text-center"><span class=' + markedGlyph + '></span></td>';
    $("#reviewTableBody").append(entry);
  }
}

function loadQuestionFromReview(num) {

  if (currentAnswer === undefined) {
    skipped.push(questionData[num]);
  }
  else if (correctAnswers.includes(currentAnswer)) {
    selectedCorrect.push(questionData[num]);
    currentAnswer = undefined;
  } else if (incorrectAnswers.includes(currentAnswer)) {
    selectedIncorrect.push(questionData[num]);
    currentAnswer = undefined;
  }

  if (questionData.length > num) {
    updateQuestion(questionData, num);
    if (marked) {
      questionData[num]['marked'] = true;
    } else {
      questionData[num]['marked'] = false;
    }
  } else if (questionData.length === num) {
    // $('#nextQuestion').text('Review Questions');
    $('#nextQuestion').addClass('disabled');
    updateQuestion(questionData, num);
  } else {
    alert('Here are the questions...');
  }

  $("#mark").prop("checked", false);
  marked = false

  if (num !== questionData.length) {
    $('#nextQuestion').removeClass('disabled');
  } else {
    $('#nextQuestion').addClass('disabled');
  }

  var answer;

  if ('answerId' in questionData[num - 1]) {
    const answerId = questionData[num - 1]['answerId'];
    answer = $(answerId);
    setAnswer(answer, num - 1, true);
  }

  if (selectedCorrect.includes(questionData[num - 1])) {
    const index = selectedCorrect.indexOf(questionData[num - 1]);
    selectedCorrect.splice(index, 1);
  } else if (selectedIncorrect.includes(questionData[num - 1])) {
    const index = selectedIncorrect.indexOf(questionData[num - 1]);
    selectedIncorrect.splice(index, 1);
  }

  $('#review-questions').modal('toggle');
  questionNumber = num + 1;
}

function submitQuiz() {
  localStorage.setItem('correct', JSON.stringify(selectedCorrect));
  localStorage.setItem('incorrect', JSON.stringify(selectedIncorrect));
  localStorage.setItem('skipped', JSON.stringify(skipped));
  localStorage.setItem('questionData', JSON.stringify(questionData));
  for (q in selectedCorrect) {
    console.log('correct: ' + selectedCorrect[q].question);
    // localStorage.setItem('correct', JSON.stringify(selectedCorrect));
  }
  for (q in selectedIncorrect) {
    console.log('incorrect: ' + selectedIncorrect[q].question);
  }
  // alert(selectedCorrect);

}

$(document).ready(function() {
  $('#pauseButton').click(function() {
    if ( $( this ).hasClass( "btn-danger" ) ) {
      display = $('#timeRemaining');
      pauseTimer(display);
      $( this ).removeClass("btn-danger");
      $( this ).addClass("btn-success");
      $( this ).html('<span class="glyphicon glyphicon-play"></span> Resume');
      $('#nextQuestion').addClass("disabled");
      $('#reviewAndSubmitBtn').addClass("disabled");
    } else {
      var timeString = $('#timeRemaining').text().split(':');
      var min = timeString[0];
      var sec = timeString[1];
      sec = parseInt(sec, 10) + (parseInt(min, 10) * 60) - 1;
      jQuery(function ($) {
        display = $('#timeRemaining');
        startTimer(sec, display);
      });
      $( this ).removeClass("btn-success");
      $( this ).addClass("btn-danger");
      $( this ).html('<span class="glyphicon glyphicon-pause"></span> Pause');
      $('#nextQuestion').removeClass("disabled");
      $('#reviewAndSubmitBtn').removeClass("disabled");
    }
  });
});

$(document).ready( function() {

  if (questionNumber > 1) {
    return;
  }

  const parameters          = parseQuery();
  const durationPerQuestion = parseInt(parameters['duration']);
  const numQuestions        = parameters['numQ'];
  const duration            = durationPerQuestion * numQuestions;

  const queryStringParameters = location.search.slice(1);
  console.log(queryStringParameters);

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
       questionData = [{"question":"What's the answer to question 1?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 1","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 2?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 2","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to 3?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 3"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer to 4?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 4"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer to question 5?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 5","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to 6?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 6"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]},{"question":"What's the answer to question 7?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 7","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 8?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me! 8","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to question 9?","QuestionId":1,"difficulty":0,"correct_answers":["Correct! Pick me!9","Also correct! Pick me too! :)"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect..."]},{"question":"What's the answer to 10?","QuestionId":0,"difficulty":0,"correct_answers":["Correct! Pick me! 10"],"Topic":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Incorrect. Don't pick me..","Also incorrect.","Still incorrect...","incorrect too!"]}]

      updateQuestion(questionData, num=1);

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
});

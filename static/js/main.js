// Globals
var questionNumber     = 1;
const letters          = ['A', 'B', 'C', 'D', 'E'];
var selectedCorrect    = [];
var selectedIncorrect  = [];
var skipped            = [];
var currentAnswer;
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
  const index      = num - 1;
  correctAnswers   = data[index]['correct_answers'];
  const question   = data[index]['question'];
  incorrectAnswers = data[index]['incorrect_answers'];

  var answers;
  if ('answers' in data[index]) {
    answers = data[index]['answers'];
  } else {
    answers = shuffle(correctAnswers.concat(incorrectAnswers));
    data[index]['answers'] = answers;
  }

  $("#question").text(question);

  $('#answers').empty();
  for (var i = 0; i < answers.length; i++) {
    var item   = answers[i];
    var letter = letters[i];
    var id     = 'answer' + letter;
    var answer = '<div class="radio">' + letter + '. &nbsp;<label onclick="setAnswer(this, ' + num + ')"><input id="' + id + '" type="radio" name="optradio">' + item + '</label></div>';
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
      selectedCorrect[selectedCorrect.length - 1]['selected_answer'] = currentAnswer;
      currentAnswer = undefined;
    } else if (incorrectAnswers.includes(currentAnswer)) {
      selectedIncorrect.push(questionData[questionNumber - 2]);
      selectedIncorrect[selectedIncorrect.length - 1]['selected_answer'] = currentAnswer;
      currentAnswer = undefined;
    }

    console.log(selectedCorrect);
    console.log(selectedIncorrect);

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
  }
  for (q in selectedIncorrect) {
    console.log('incorrect: ' + selectedIncorrect[q].question);
  }

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
    dataType: 'json',
    error: function(xhr, status, error) {
      // TODO: - HANDLE ERRORS
      console.log(xhr)
      // jQuery(function ($) {
      //   display = $('#timeRemaining');
      //   startTimer(3, display);
      // });


      // NOTE: - TESTING WITHOUT MAKING REQUESTS TO API GATEWAY
      questionData = [{"question":"How many S3 buckets can I have per account by default?","QuestionId":1,"difficulty":2,"correct_answers":["100"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["50","10","20","75"],"topic":"Object Storage","answers":["100","50","20","10","75"],"marked":false},{"question":"What is an additional way to secure the AWS accounts of both the root account and new users alike?","QuestionId":1,"difficulty":2,"correct_answers":["Implement Multi-Factor Authentication for all accounts."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Configure the AWS Console so that you can only log in to it from your internal network IP address range.","Store the access key id and secret access key of all users in a publicly accessible plain text document on S3 of which only you and members of your organisation know the address to.","Configure the AWS Console so that you can only log in to it from a specific IP Address range"],"topic":"IAM","answers":["Configure the AWS Console so that you can only log in to it from your internal network IP address range.","Store the access key id and secret access key of all users in a publicly accessible plain text document on S3 of which only you and members of your organisation know the address to.","Configure the AWS Console so that you can only log in to it from a specific IP Address range","Implement Multi-Factor Authentication for all accounts."],"marked":false},{"question":"Route53 does not support zone apex records (naked domain names).","QuestionId":0,"difficulty":2,"correct_answers":["False."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["It depends on the configuration.","True.","Only in Us-East-1."],"topic":"Route53","answers":["It depends on the configuration.","True.","Only in Us-East-1.", "False."],"marked":false},{"question":"Which AWS service is ideal for Business Intelligence Tools/Data Warehousing?","QuestionId":0,"difficulty":1,"correct_answers":["Redshift"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Elastic Beanstalk","ElastiCache","DynamoDB"],"topic":"Databases","answers":["Elastic Beanstalk","ElastiCache","DynamoDB","Redshift"],"marked":false},{"question":"What is the difference between SNS and SQS?","QuestionId":1,"difficulty":3,"correct_answers":["SNS is a push notification service, whereas SQS is message system that requires worker nodes to poll a queue."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["SQS sends messages to people on topics, whereas SNS manages tasks.","SQS and SNS are basically the same service."],"topic":"Application Services","answers":["SNS is a push notification service, whereas SQS is message system that requires worker nodes to poll a queue.","SQS sends messages to people on topics, whereas SNS manages tasks.","SNS pulls (polls), whereas SQS is push based message service.","SQS and SNS are basically the same service."], },{"question":"Which of the following AWS services is a non-relational database?","QuestionId":0,"difficulty":1,"correct_answers":["DynamoDB"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["ElastiCache","RDS","Redshift"],"topic":"Databases"},{"question":"Can a placement group be deployed across multiple Availability Zones?","QuestionId":1,"difficulty":3,"correct_answers":["No."],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Yes.","Yes, but only using the AWS API.","Only in Us-East-1."],"topic":"EC2"},{"question":"You work for a major news network in Europe. They have just released a new mobile app that allows users to post their photos of newsworthy events in real time. Your organization expects this app to grow very quickly, essentially doubling its user base each month. The app uses S3 to store the images, and you are expecting sudden and sizeable increases in traffic to S3 when a major news event takes place (as users will be uploading large amounts of content.) You need to keep your storage costs to a minimum, and it does not matter if some objects are lost. With these factors in mind, which storage media should you use to keep costs as low as possible?","QuestionId":1,"difficulty":4,"correct_answers":["S3 - Reduced Redundancy Storage (RRS)"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["S3 - Provisioned IOPS","S3 - Infrequently Accessed Storage","Glacier"],"topic":"Object Storage"},{"question":"EBS Snapshots are backed up to S3 in what manner?","QuestionId":1,"difficulty":2,"correct_answers":["Incrementally"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["Decreasingly","Exponentially","EBS snapshots are not stored on S3."],"topic":"EC2","answers":["Decreasingly","Exponentially","EBS snapshots are not stored on S3.", "Incrementally"]},{"question":"You work for a health insurance company that amasses a large number of patients' health records. Each record will be used once when assessing a customer, and will then need to be securely stored for a period of 7 years. In some rare cases, you may need to retrieve this data within 24 hours of a claim being lodged. Given these requirements, which type of AWS storage would deliver the least expensive solution?","QuestionId":0,"difficulty":4,"correct_answers":["Glacier"],"subject":"AWS Solutions Architect Practice Quiz","incorrect_answers":["S3 - RRS","S3 - IA","S3"],"topic":"Object Storage","marked":false,"answers":["S3 - RRS","S3 - IA","S3","Glacier"]}]
      
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
      console.log(result);
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

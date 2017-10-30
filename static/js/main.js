
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function parseQuery() {
  var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
            alert("Time's up!")
        }
    }, 1000);
}

const letters = ['A', 'B', 'C', 'D', 'E'];

$( function() {
  $.ajax({
    type: 'GET',
    url: "https://2yroiqqvf8.execute-api.us-east-1.amazonaws.com/prod/ServeQuestion",
    // context: document.body,
    error: function(xhr, status, error) {
      console.log(xhr)
    },
    success: function(result){
      console.log(result);
      const topic = result['Topic'];
      const question = result['question'];
      $("#topic").text(topic);
      $("#question").text(question);

      const correctAnswers = result['correct_answers'];
      const incorrectAnswers = result['incorrect_answers'];
      const answers = shuffle(correctAnswers.concat(incorrectAnswers));

      const $answers = $('#answers');

      for (var i = 0; i < answers.length; i++) {
        item = answers[i];
        letter = letters[i];

        var answer = '<div class="radio">'+letter+'. &nbsp;<label><input type="radio" name="optradio">'+item+'</label></div>';
        $answers.append(answer);
      };

      // alert("done");
      const parameters = parseQuery();
      const durationInSeconds = parseInt(parameters['duration']);
      const numQuestions = parameters['numQ'];
      var questionNumber = 1;
      const questionNumberText = questionNumber.toString()+' of';
      const numQuestionsText = numQuestions+'.';
      $("#questionNumber").text(questionNumberText);
      $("#numberQuestions").text(numQuestionsText);
      const duration = durationInSeconds * numQuestions;

      jQuery(function ($) {
            display = $('#timeRemaining');
        startTimer(duration, display);
      });

    }
  });
});

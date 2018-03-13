var questionData;
var correct;
var incorrect;
var skipped;
var rotated = false;

// TODO: - Get logged in userid and pass it with questionData

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

function loadResultsTable(data) {
  $("#resultsTableBody").empty();
  $("#reviewTableBody").empty();
  var topics = {};
  for (var i = 0; i < data.length; i++) {
    var item          = data[i];
    var question      = item.question;
    var markedQ       = item.marked;
    var qNo           = i + 1;
    var correctAnswer = item.correct_answers[0];
    var topic         = item['topic'];
    var selectedAnswer;

    if (item.selected_answer === undefined) {
      selectedAnswer = "";
    } else {
      selectedAnswer = item.selected_answer;
    }

    for (var j = 0; j < correct.length; j++) {
      if (correctAnswer === correct[j].correct_answers[0]) {
        var glyph = '"glyphicon glyphicon-ok-sign text-success mr-10"';
        break;
      } else {
        var glyph = '"glyphicon glyphicon-remove-circle text-danger mr-10"';
      }
    }

    if (topics.hasOwnProperty(topic)) {
      if (glyph === '"glyphicon glyphicon-ok-sign text-success mr-10"') {
        topics[topic].correct ++;
      } else {
        topics[topic].incorrect ++;
      }
    } else {
      if (glyph === '"glyphicon glyphicon-ok-sign text-success mr-10"') {
        topics[topic] = {'correct': 1, 'incorrect': 0}
      } else {
        topics[topic] = {'correct': 0, 'incorrect': 1}
      }
    }

    var id = "'#triangle" + i + "'";

    var resultsEntry =
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

    $("#resultsTableBody").append(resultsEntry);
  }

  console.log(topics);

  var topic_keys = Object.keys(topics)

  for (var i = 0; i < topic_keys.length; i++) {
    console.log(i);
    var p_correct = Math.round(100 * topics[topic_keys[i]].correct / (topics[topic_keys[i]].correct + topics[topic_keys[i]].incorrect));
    var summaryEntry =
    '\
    <tr>\
      <td>' + Object.keys(topics)[i] + '</td>\
      <td class="text-center">' + topics[topic_keys[i]].correct + '</td>\
      <td class="text-center">' + (topics[topic_keys[i]].correct + topics[topic_keys[i]].incorrect) + '</td>\
      <td class="text-center">' + p_correct + '</td>\
     </tr>\
     '

     $("#summaryTableBody").append(summaryEntry);
  }

}

$(document).ready(function() {
  questionData = JSON.parse(localStorage.getItem('questionData'));
  correct      = JSON.parse(localStorage.getItem('correct'));
  incorrect    = JSON.parse(localStorage.getItem('incorrect'));
  skipped      = JSON.parse(localStorage.getItem('skipped'));

  console.log(correct);

  var score = Math.round(correct.length / (questionData.length) * 100);
  const scoreString = score + '%';

  // Glyph element -- should rename
  const glyphElement = document.getElementById('glyph');

  var header;
  switch(true) {
    case (score < 40):
      header = "Not quite. Keep studying!"
      glyph  = "glyphicon glyphicon-cloud-download"
      glyphElement.setAttribute("style", "color:red;");
      break;
    case (score < 60):
      header = "Still a good bit of work to do. Keep at it!"
      glyph  = "glyphicon glyphicon-thumbs-down"
      break;
    case (score < 70):
      header = "Almost there! Keep going!"
      glyph  = "glyphicon glyphicon-wrench"
      glyphElement.setAttribute("style", "color:yellow;");
      break;
    case (score < 90):
      header = "Great job!"
      glyph  = "glyphicon glyphicon-cloud-upload"
      glyphElement.setAttribute("style", "color:green;");
      break;
    default:
      header = "Wow! Awesome!"
      glyph  = "glyphicon glyphicon-fire"
      glyphElement.setAttribute("style", "color:orange;");
}
  $('#header').text(header);
  $('#score').text(scoreString);
  $('#glyph').addClass(glyph);

  loadResultsTable(questionData);

});

$(document).ready( function() {
  console.log('qdata: ' + JSON.stringify(questionData, null));
  $.ajax({
    type: 'POST',
    // url: "https://2yroiqqvf8.execute-api.us-east-1.amazonaws.com/prod/post-quiz-results",
    crossDomain: true,
    contentType: 'application/json',
    data: JSON.stringify(questionData),
    dataType: 'json',
    error: function(xhr, status, error) {
      // TODO: - HANDLE ERRORS
      // console.log(xhr)
    },
    success: function(result){
      // TODO: - HANDLE SUCCESS
      console.log('woohoo!')
    }
  });
});

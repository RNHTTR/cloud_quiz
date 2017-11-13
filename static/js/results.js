var questionData;
var correct;
var incorrect;
var skipped;
var rotated = false;

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
  for (var i = 0; i < data.length; i++) {
    var item          = data[i];
    var question      = item.question;
    var markedQ       = item.marked;
    var qNo           = i + 1;
    var correctAnswer = item.correct_answers[0];

    for (var j = 0; j < correct.length; j++) {
      if (correctAnswer === correct[j].correct_answers[0]) {
        var glyph = '"glyphicon glyphicon-ok-sign text-success mr-10"';
        break;
      } else {
        var glyph = '"glyphicon glyphicon-remove-circle text-danger mr-10"';
      }
    }

    // if (correct.includes(item)) {
    //   var glyph = '"glyphicon glyphicon-ok-sign text-success"'
    // } else {
    //   var glyph = '"glyphicon glyphicon-remove-circle text-danger mr-10"'
    // }

    var id = "'#triangle" + i + "'";

    var entry = '<tr data-toggle="collapse" data-target="#accordion' + i + '" class="accordion-toggle" onclick="rotate90(' + id + ')">\
                   <td>Placeholder Topic</td>\
                   <td>' + question + '</td>\
                   <td>' + 'Placeholder Your Answer'  + '</td>\
                   <td>' + correctAnswer + '</td>\
                   <td class="text-center"><span class=' + glyph + '"></span></td>\
                   <td><span id="triangle' + i + '" class="point-left glyphicon glyphicon-triangle-left"></span></td>\
                 </tr>\
                 <tr>\
                   <td colspan="6" class="hiddenRow">\
                     <div id="accordion' + i + '" class="accordian-body collapse">\
                       </p>Lorem ipsum this is a helpful solution for qustion 1! You know dis!! lorem ipsum lorem ipsum</p>\
                     </div>\
                   </td>\
                 </tr>'

    $("#resultsTableBody").append(entry);
  }

}

$(document).ready(function() {
  questionData = JSON.parse(localStorage.getItem('questionData'));
  correct      = JSON.parse(localStorage.getItem('correct'));
  incorrect    = JSON.parse(localStorage.getItem('incorrect'));
  skipped      = JSON.parse(localStorage.getItem('skipped'));

  var score = Math.round(correct.length / (questionData.length) * 100);
  const scoreString = score + '%';

  const glyphElt = document.getElementById('glyph');

  var header;
  switch(true) {
    case (score < 40):
      header = "Not quite. Keep studying!"
      glyph  = "glyphicon glyphicon-cloud-download"
      glyphElt.setAttribute("style", "color:red;");
      break;
    case (score < 60):
      header = "Still a good bit of work to do. Keep at it!"
      glyph  = "glyphicon glyphicon-thumbs-down"
      break;
    case (score < 70):
      header = "Almost there! Keep going!"
      glyph  = "glyphicon glyphicon-wrench"
      glyphElt.setAttribute("style", "color:yellow;");
      break;
    case (score < 90):
      header = "Great job!"
      glyph  = "glyphicon glyphicon-cloud-upload"
      glyphElt.setAttribute("style", "color:green;");
      break;
    default:
      header = "Wow! Awesome!"
      glyph  = "glyphicon glyphicon-fire"
      glyphElt.setAttribute("style", "color:orange;");
}
  $('#header').text(header);
  $('#score').text(scoreString);
  $('#glyph').addClass(glyph);

  loadResultsTable(questionData);

  // console.log(Math.round(correct.length / (questionData.length) * 100) + '%');
});

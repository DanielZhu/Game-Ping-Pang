$(function () {

  var tableHockey = {};
  tableHockey.keys = {W: 87, S: 83, UP: 38, DOWN: 40, SPACE: 32};
  tableHockey.leftSliderMoveFlag = false;
  tableHockey.rightSliderMoveFlag = false;
  tableHockey.moveBallDirectionX = -1;
  tableHockey.moveBallDirectionY = -1;
  tableHockey.moveLeftDirectionX = -1;
  tableHockey.moveLeftDirectionY = -1;
  tableHockey.moveRightDirectionX = -1;
  tableHockey.moveRightDirectionY = -1;
  tableHockey.moveSliderSpeed = 7;
  tableHockey.moveBallSpeed = 5;
  tableHockey.width = parseInt($('.play-area').width());
  tableHockey.height = parseInt($('.play-area').height());
  tableHockey.sliderWidth = parseInt($('.slider').width());
  tableHockey.sliderHeight = parseInt($('.slider').height());
  tableHockey.sliderLeftMargin = parseInt($('.slider-left').css('left'));
  tableHockey.sliderRightMargin = parseInt($('.slider-right').css('right'));
  tableHockey.ballWidth = parseInt($('.ball').width());
  tableHockey.ballHeight = tableHockey.ballWidth;
  tableHockey.playerLeftScore = 0;
  tableHockey.playerRightScore = 0;
  tableHockey.gameOver = true;
  tableHockey.winner = null;
  tableHockey.padding = 5;

  gameLoop = function () {
    moveSlider();
    moveBall();
    checkStatus();
  }

  window.addEventListener('keydown', function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
  }, false);

  $('body').keydown(function (event) {
    switch (event.which) {
      case tableHockey.keys.W:
        tableHockey.leftSliderMoveFlag = true;
        tableHockey.moveLeftDirectionY = -1;
        break;
      case tableHockey.keys.S:
        tableHockey.leftSliderMoveFlag = true;
        tableHockey.moveLeftDirectionY = 1;
        break;
      case tableHockey.keys.UP:
        tableHockey.rightSliderMoveFlag = true;
        tableHockey.moveRightDirectionY = -1;
        break;
      case tableHockey.keys.DOWN:
        tableHockey.rightSliderMoveFlag = true;
        tableHockey.moveRightDirectionY = 1;
        break;
      case tableHockey.keys.SPACE:
        $('.newer-guide').hide();
        continueRound();
        break;
    }
  });

  $('body').keyup(function (event) {
    switch (event.which) {
      case tableHockey.keys.W:
        tableHockey.leftSliderMoveFlag = false;
        break;
      case tableHockey.keys.S:
        tableHockey.leftSliderMoveFlag = false;
        break;
      case tableHockey.keys.UP:
        tableHockey.rightSliderMoveFlag = false;
        break;
      case tableHockey.keys.DOWN:
        tableHockey.rightSliderMoveFlag = false;
        break;
    }
  });

  moveSlider = function () {
    var leftTop = parseInt($('.slider-left').css('top'));
    if (tableHockey.leftSliderMoveFlag
        && leftTop + tableHockey.moveSliderSpeed * tableHockey.moveLeftDirectionY > 0
        && leftTop + tableHockey.sliderHeight + tableHockey.moveSliderSpeed * tableHockey.moveLeftDirectionY < tableHockey.height) {
      $('.slider-left').css('top', leftTop + tableHockey.moveSliderSpeed * tableHockey.moveLeftDirectionY);
    }

    var rightTop = parseInt($('.slider-right').css('top'));
    if (tableHockey.rightSliderMoveFlag
        && rightTop + tableHockey.moveSliderSpeed * tableHockey.moveRightDirectionY > 0
        && rightTop + tableHockey.sliderHeight + tableHockey.moveSliderSpeed * tableHockey.moveRightDirectionY < tableHockey.height) {
      $('.slider-right').css('top', rightTop + tableHockey.moveSliderSpeed * tableHockey.moveRightDirectionY);
    }
  }

  moveBall = function () {
    var ballTop = parseInt($('.ball').css('top'));
    var ballLeft = parseInt($('.ball').css('left'));
    var ballCenter = ballTop + tableHockey.ballHeight / 2;
    var leftSliderTop = parseInt($('.slider-left').css('top'));
    var rightSliderTop = parseInt($('.slider-right').css('top'));

    if (ballTop <= 0) {
      tableHockey.moveBallDirectionY = 1;
    } else if (ballTop + tableHockey.ballHeight >= tableHockey.height - 5) {
      tableHockey.moveBallDirectionY = -1;
    }

    if (ballLeft <= tableHockey.sliderLeftMargin + tableHockey.sliderWidth) {
      if (ballCenter + tableHockey.padding < leftSliderTop || ballCenter - tableHockey.padding > leftSliderTop + tableHockey.sliderHeight) {
        tableHockey.playerRightScore++;
        tableHockey.winner = 1;  // Right win
        tableHockey.gameOver = true;
        tableHockey.moveBallDirectionX = -1;
      } else {
        tableHockey.moveBallDirectionX = 1;
      }
    } else if (ballLeft + tableHockey.ballWidth >= tableHockey.width - tableHockey.sliderRightMargin - tableHockey.sliderWidth) {
      if (ballCenter + tableHockey.padding < rightSliderTop || ballCenter - tableHockey.padding > rightSliderTop + tableHockey.sliderHeight) {
        tableHockey.playerLeftScore++;
        tableHockey.winner = -1;   // Left win
        tableHockey.moveBallDirectionX = 1;
        tableHockey.gameOver = true;
      } else {
        tableHockey.moveBallDirectionX = -1;
      }
    }

    $('.ball').css({'top': ballTop + tableHockey.moveBallSpeed * tableHockey.moveBallDirectionY, 'left': ballLeft + tableHockey.moveBallSpeed * tableHockey.moveBallDirectionX});

    // if (tableHockey.rightSliderMoveFlag
    //     && rightTop + tableHockey.moveSliderSpeed * tableHockey.moveRightDirectionY > 0
    //     && rightTop + tableHockey.sliderHeight + tableHockey.moveSliderSpeed * tableHockey.moveRightDirectionY < tableHockey.height) {
    // }
  }

  continueRound = function (side) {
    if (tableHockey.gameOver) {
      tableHockey.gameOver = false;
      loop = setInterval(gameLoop, 30);
    }
  }

  checkStatus = function () {
    $('#playerAScore').html(tableHockey.playerLeftScore);
    $('#playerBScore').html(tableHockey.playerRightScore);
    if (tableHockey.gameOver) {
      $('.newer-guide').show();
      $('.ball').css({'top': (tableHockey.height - tableHockey.ballHeight) / 2 + 'px', 'left': tableHockey.width / 2 + tableHockey.winner * 50});
      clearInterval(loop);
    }
  }

  var loop = setInterval(gameLoop, 30);
});
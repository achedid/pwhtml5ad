class QuestionScene extends Phaser.Scene{

    constructor(){
      super({key: 'QUESTION'})
    }

    init(){

      this.correctQuestions = 0;
      this.usedQuetions = 0;

      this.questions = [
        {
          'description': 'What is the kind of this animal in the picture below?',
          'image': 'dog',
          'answers': [
              {'description': 'Cat', 'correct': false},
              {'description': 'Dog', 'correct': true},
              {'description': 'Horse', 'correct': false},
              {'description': 'Tiger', 'correct': false}
            ]
        },
        {
          'description': 'What is the result of 5 x 5? ',
          'image': 'math',
          'answers': [
              {'description': '15', 'correct': false},
              {'description': '25', 'correct': true},
              {'description': '35', 'correct': false},
              {'description': '5', 'correct': false}
            ]
        },
        {
          'description': 'Can you tell which company has the following logo? ',
          'image': 'twitter',
          'answers': [
              {'description': 'Twitter', 'correct': true},
              {'description': 'Facebook', 'correct': false},
              {'description': 'Google', 'correct': false},
              {'description': 'Microsoft', 'correct': false}
            ]
        }
      ];
      this.max_questions = this.questions.length;
      this.correct_questions = 0;
    }

    getQuestion(){
      return this.questions.pop()
    }

    nextQuestion(){
      var question = this.getQuestion();
      this.endTime = undefined;
      if(question){
        if(typeof this.question_text != 'undefined'){
          this.container.remove([this.question_text, this.question_image])
          this.container.remove(this.asnwersOnScreen);
        }

        this.displayQuestion(question);
      }else{
        this.displaySetResult();
      }
    }

    displaySetResult(){

      if(!this.resultIsDisplayed){
          this.answerPopupTimer = undefined;
          this.resultIsDisplayed = true;
          if(this.correctQuestions == this.max_questions){
            this.congrats = this.add.image(0, 0, 'congrats');
            this.container.add([this.congrats]);
            var winners_sound = this.sound.add('winners_sound');

          }else{
            this.hard_luck = this.add.image(0, 0, 'hard_luck');
            this.container.add([this.hard_luck]);

          }

          this.downloadAppButton = this.add.image(0, 150, 'yellow_button');
          this.download_text = this.add.text(-85, 138, 'Download Free Now!', {fontSize: 20, fontFamily: 'Signika', color: 'white'});
          this.downloadAppButton.alpha = 0;
          this.download_text.alpha = 0;

          this.reloadAppButton = this.add.image(0, 240, 'yellow_button');
          this.play_text = this.add.text(-50, 228, 'Play Again!!', {fontSize: 20, fontFamily: 'Signika', color: 'white'});
          this.reloadAppButton.alpha = 0;
          this.play_text.alpha = 0;
          var that = this;

          this.downloadAppButton.setInteractive().on('pointerdown', function (event){
              window.open('https://playandwinapp.page.link/uno3',  "_blank");
          });
          this.reloadAppButton.setInteractive().on('pointerdown', function (event){
            that.scene.transition({
              target: 'LANDING',
              duration: 0,
              moveAbove: true,
              onUpdate: that.transitionOut,
            });
          });

          this.tweens.timeline({
                ease: 'Power2',
                duration: 600,
                tweens: [
                  {
                    targets: [this.downloadAppButton],
                    scaleX: { value: 1.1, duration: 500, yoyo: true, ease: 'Quad.easeInOut' },
                    scaleY: { value: 1.1, duration: 500, yoyo: true, ease: 'Quad.easeInOut' },
                    repeat: -1
                  },
                  {
                    targets: [this.download_text, this.downloadAppButton, this.play_text],
                    alpha: 1,
                    offset: 0
                  },
                  {
                    targets: [this.reloadAppButton],
                    alpha: 1,
                    offset: 500,
                    scaleX: { value: 1.2, duration: 500, yoyo: true, ease: 'Quad.easeInOut' },
                    scaleY: { value: 1.2, duration: 500, yoyo: true, ease: 'Quad.easeInOut' },
                  }
                ]
          });

          this.container.add([this.downloadAppButton, this.reloadAppButton, this.download_text, this.play_text]);
      }
    }

    transitionOut (progress)
    {
        this.container.x = 1000 * progress;
    }

    displayQuestion(question){

      var that = this;

      var nowD = new Date();
      this.endTime = nowD;
      nowD.setSeconds(nowD.getSeconds()+11);

      this.user_answered = false;
      this.usedQuetions += 1;

      this.question_nb.setText(this.usedQuetions);
      question.answers = question.answers.shuffle();

      this.disable = false;
      this.question_text = this.add.text(-120, -210, question.description, {fontSize: 20, stroke: 'black', strokeThickness: 2,
                                                                          fontFamily: 'Signika', align: 'center', boundsAlignH: "center", boundsAlignV: "middle"});
      this.question_text.setWordWrapWidth(250, false);
      this.question_text.x = ( (300 - this.question_text.width) / 2) - 150

      this.question_text.alpha = 0;
      this.question_image = this.add.image(0, -40, question.image);
      this.question_image.alpha = 0;

      var tweensList = [
        {targets: that.question_text, offset: 500, alpha: 1},
        {targets: that.question_image, offset: 500, alpha: 1}
      ];

      this.asnwersOnScreen = [];

      var initialOffset = 1000;
      var x = -75;
      var y = 150;
      question.answers.forEach(function (e, i){

          if(i == 1){ x = 75;}
          else if(i == 2){ x = -75; y = 250;}
          else if(i == 3){ x = 75; }

          initialOffset += 200;

          var answerImage = that.add.image(x, y, 'answer2x2');
          answerImage.alpha = 0;

          var answerText = that.add.text(0, y-15, e.description, {align: 'center', fontSize: 25, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika'})
          answerText.alpha = 0;
          answerText.setWordWrapWidth(145, true);
          var offsetX = (x < 0) ? -150 : 0;
          answerText.x = ( ( (150 - answerText.width) / 2) ) + offsetX;

          that.container.add([answerImage, answerText]);

          tweensList.push({
            targets: [answerImage, answerText],
            alpha: 1,
            offset: initialOffset,
            scaleX: { value: 1.05, duration: 500, yoyo: true, ease: 'Quad.easeInOut' },
            scaleY: { value: 1.05, duration: 500, yoyo: true, ease: 'Quad.easeInOut' }
          });

          answerImage.setInteractive().on('pointerdown', function (event){
                var oldX = answerImage.x;
                var oldY = answerImage.y;
                var correctPoints;


                if(!that.user_answered){
                  that.user_answered = true;

                  that.container.remove(answerImage);

                  if(e.correct){
                    that.correctQuestions += 1;
                    answerImage = that.add.image(oldX, oldY, 'answer2x2g');
                    var correctPoints = that.add.text(oldX - 20, oldY, '+100', {fontSize: 20, fontFamily: 'Signika', stroke: 'black', strokeThickness: 2});

                  }
                  else{
                    answerImage = that.add.image(oldX, oldY, 'answer2x2r');

                  }

                  that.container.add([answerImage]);
                  that.asnwersOnScreen.push(answerImage)
                  that.container.bringToTop(answerText);
                  if(correctPoints){
                    that.container.add([correctPoints]);
                    that.container.bringToTop(correctPoints);

                    that.tweens.timeline({
                          ease: 'Power2',
                          duration: 750,
                          tweens: [
                            {
                              targets: [correctPoints],
                              y: oldY - 50,
                              offset: 0,
                            },
                            {
                              targets: [correctPoints],
                              alpha: 0,
                              offset: 550,
                            }
                          ],
                          onComplete: function (){
                              Sticker.show(function (){
                                  if(that.usedQuetions < that.max_questions){
                                    that.displayAnswerPopup(e.correct);
                                  }else{
                                    that.displaySetResult();
                                  }
                              });
                          }
                    });
                  }else{

                  that.tweens.timeline({
                        ease: 'Power2',
                        duration: 100,
                        tweens: [
                          {
                            targets: [answerImage, answerText],
                            offset: 0,
                            scaleX: { value: 1.1, duration: 350, yoyo: true, ease: 'Quad.easeInOut' },
                            scaleY: { value: 1.1, duration: 350, yoyo: true, ease: 'Quad.easeInOut' }
                          }
                        ],
                        onComplete: function (){
                            if(!correctPoints){
                                that.displayAnswerPopup(false);
                            }
                            if(that.usedQuetions == that.max_questions){
                              that.displaySetResult();
                            }
                        }
                  });
                  }
                }
          });
          that.asnwersOnScreen.push(answerImage)
          that.asnwersOnScreen.push(answerText)
      });

      this.tweens.timeline({
            ease: 'Power2',
            duration: 600,
            tweens: tweensList
      });

      this.container.add([this.question_text, this.question_image]);


    }

    displayAnswerPopup(correct){
      var that = this;
      if(!this.answerPopupEnabled){
        this.answerPopupEnabled = true;


        var points = 0;
        var rank = '5';
        var nextPoints = 100;
        var title = 'WRONG ANSWER';
        var color = 'red';

        if(correct == -1){
          title = 'TIMEOUT ANSWER';

        }
        else if(correct){
          title = 'CORRECT ANSWER'
          color = 'green';
          points = 100*this.correctQuestions;
          rank = '2';
          nextPoints = points + 100;
        }

        this.answerPopupTimer = this.add.graphics();
        this.answerPopupTimer.lineStyle(4, 0x3ba5cf, 1);
        this.answerPopupTimer.beginPath();

        this.answerPopupCurrentTimer = 271;

        this.answerPopupTimer.arc(0, 90, 37, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(271), true);
        this.answerPopupTimer.strokePath();

        var background = new Phaser.Geom.Rectangle(-169, -300, 338, 600);
        this.graphicsBg = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.graphicsBg.alpha = 0.8;
        this.graphicsBg.fillRectShape(background)

        var rect = new Phaser.Geom.Rectangle(-150, -150, 300, 300);
        this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 }, lineStyle: { width: 2, color: 0xf7c903 }  });
        this.graphics.fillRectShape(rect);
        this.graphics.strokeRectShape(rect);

        this.titleText = this.add.text(-75, -120, title, {fontSize: 20, color: color, fontFamily: 'Signika'})
        this.pointsText = this.add.text(-105, -20, points + ' pts', {fontSize: 18, color: "#f7c903", fontFamily: 'Signika'})
        this.rankText = this.add.text(-5, -20, rank, {fontSize: 25, color: "#f7c903", fontFamily: 'Signika'})
        this.nextPointsText = this.add.text(50, -20, nextPoints + ' pts', {fontSize: 18, color:  "#f7c903", fontFamily: 'Signika'})

        this.answer_popup_stats = this.add.image(0, -15, 'answer_popup_stats');
        this.small_play = this.add.image(0, 90, 'small_play');

        this.small_play.setInteractive().on('pointerdown', function (event){
            that.exitAnswerPopupAndGetNextQuestion();
        });

        this.container.add([this.graphicsBg, this.graphics, this.titleText,
                            this.small_play, this.answerPopupTimer, this.answer_popup_stats,
                            this.pointsText, this.rankText, this.nextPointsText,]);
      }
      this.answerPopupEnabled = false;
    }

    exitAnswerPopupAndGetNextQuestion(){
      this.endTime = undefined;

      this.container.remove([this.graphicsBg, this.graphics, this.titleText,
                          this.small_play, this.answerPopupTimer, this.answer_popup_stats,
                          this.pointsText, this.rankText, this.nextPointsText,]);

      this.answerPopupTimer = undefined;
      this.endTime = undefined;

      this.nextQuestion();
    }

    preload(){
        this.load.image('question_bg', 'assets/images/question_page.jpg')
        this.load.image('q_effect', 'assets/images/q-effect.png');

        this.load.image('answer2x2', 'assets/images/answer.png');
        this.load.image('answer2x2r', 'assets/images/answer_red.png');
        this.load.image('answer2x2g', 'assets/images/answer_green.png');

        this.load.image('dog', 'assets/images/dog.jpg');
        this.load.image('math', 'assets/images/math.jpg');
        this.load.image('twitter', 'assets/images/twitter.jpg');

        this.load.image('small_play', 'assets/images/small_play.png');
        this.load.image('answer_popup_stats', 'assets/images/answer_popup_stats.png')

        this.load.image('congrats', 'assets/images/congrats.png');
        this.load.image('hard_luck', 'assets/images/hard_luck.png');

        this.load.image('yellow_button', 'assets/images/play_bg.png');
    }
    create(){


      this.resultIsDisplayed = false;

      this.container = this.add.container(parent.clientWidth/2, window.screen.availHeight/2);

      this.q_effect = this.add.image(117, -230, 'q_effect');
      this.question_nb = this.add.text(-55, -263, '1', {fontSize: 20, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika'});

      this.timer_placeholder = this.add.text(110, -250, '10', {fontSize: 20, stroke: 'black',  strokeThickness: 2, fontFamily: 'Signika'});
      this.question_bg = this.add.image(0, 0, 'question_bg');

      this.container.add([this.question_bg, this.q_effect, this.question_nb, this.timer_placeholder]);

      this.nextQuestion();
    }

    update(){
      this.updateTimer();
      this.q_effect.angle += 0.1;
    }

    updateTimer(){

      if(typeof this.answerPopupTimer != 'undefined'){
        this.answerPopupCurrentTimer += 1.5;
        if(this.answerPopupCurrentTimer >= 360){
          this.answerPopupCurrentTimer -= 360
        }
        this.answerPopupTimer.clear();
        this.answerPopupTimer.lineStyle(4, 0x3ba5cf, 1);
        this.answerPopupTimer.beginPath();
        this.answerPopupTimer.arc(0, 90, 37, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(this.answerPopupCurrentTimer), true);
        this.answerPopupTimer.strokePath();
        if(this.answerPopupCurrentTimer <= 270 && this.answerPopupCurrentTimer > 265){
          this.exitAnswerPopupAndGetNextQuestion();
          this.answerPopupCurrentTimer = undefined
        }
      }

      if(!this.user_answered){
        // Get todays date and time
        console.log(this.user_answered);
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = this.endTime.getTime() - now;
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        var newContent = (seconds < 10 ? " " + seconds : seconds);
        if(seconds < 0){
          this.user_answered = true
          newContent = " 0";

          this.displayAnswerPopup(-1);
        }
        this.timer_placeholder.setText(newContent);
      }
    }
}

class LandingScene extends Phaser.Scene{

    constructor(){
      super({key: 'LANDING'})
    }

    init(){

    }
    preload(){
      this.load.image('app_logo', 'assets/images/pw-logo.png');
      this.load.image('app_logo_effect', 'assets/images/pw-logo-effect.png');
      this.load.image('app_landing', 'assets/images/app_landing_338X600.jpg');
      this.load.image('play_bg', 'assets/images/play_bg.png');

    }
    create(){
      var that = this;

      this.input.manager.enabled = true;

      this.container = this.add.container(parent.clientWidth/2, window.screen.availHeight/2);

      var nowD = new Date();
      this.endTime = nowD;
      nowD.setHours(nowD.getHours()+1);

      this.app_landing = this.add.image(0, 0, 'app_landing');
      this.app_landing.width = window.screen.availWidth;
      this.app_landing.height = window.screen.availHeight;

      this.app_logo = this.add.image(0, -245, 'app_logo');
      this.app_logo_effect = this.add.sprite(0, -250, 'app_logo_effect');

      this.game_text = this.add.text(-100, 50, 'Game Prize', {fontSize: 11, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika'});
      this.game_prize = this.add.text(-95, 70, '$10', {fontSize: 20, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika', letterSpacing: '2px'});

      this.timer_text = this.add.text(60, 50, 'Time left', {fontSize: 11, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika'});
      this.timer_placeholder = this.add.text(50, 70, '00:00:00', {fontSize: 20, stroke: 'black', strokeThickness: 2, fontFamily: 'Signika', letterSpacing: '2px'});

      this.play_bg = this.add.image(0, 250, 'play_bg');
      this.playText = this.add.text(-35, 230, "PLAY", {fill: 'white', fontSize: 25, color: 'white', stroke: 'black', strokeThickness: 2, fontFamily: 'Signika'});
      this.play_bg.setInteractive().on('pointerdown', function (event){


        this.scene.transition({
          target: 'QUESTION',
          duration: 1000,
          moveBelow: true,
          onUpdate: this.transitionOut,
        });

      }, this);

      this.tweens.timeline({
        ease: 'Power2',
        duration: 1500,
        tweens: [
          {
            targets: [that.play_bg],
            scaleX: { value: 1.1, duration: 1000, yoyo: true, ease: 'Quad.easeInOut' },
            scaleY: { value: 1.1, duration: 1000, yoyo: true, ease: 'Quad.easeInOut' },
            repeat: -1
          }
        ]
      });

      this.container.add([this.app_landing, this.app_logo, this.app_logo_effect, this.game_text, this.game_prize, this.timer_text, this.timer_placeholder, this.play_bg, this.playText])

      this.addTips();
    }

    update(){
      this.app_logo_effect.angle += 0.1;
      this.updateTimer();
    }

    addTips(){
      var that = this;
      this.tips = ['A new winner will be announced every hour. The top scorer wins the prize without any draw!',
                  'Each correct answer gives you extra points. You get no points for wrong answers.',
                  'You can play 1 set each hour, each set contains 50 questions']

      this.tipsOnScreen = [];
      var tweensList = [];
      this.tips.forEach(function (t){
        var tmpTip = that.add.text(120, 150, t, {stroke: 'black', strokeThickness: 2, fontSize: 15, fontFamily: 'Signika', align: 'center', boundsAlignH: "center", boundsAlignV: "middle"});
        tmpTip.setWordWrapWidth(300, false);
        tmpTip.x = ( (300 - tmpTip.width) / 2) - 150

        tmpTip.alpha = 0;
        that.tipsOnScreen.push(tmpTip);
      });

      this.container.add(this.tipsOnScreen);
      this.slideTips(0);
    }

    slideTips(j){
      var that = this;

      this.tweensList = [];
      this.tipsOnScreen.forEach(function (t, i){
        if(i == j){
            that.tweensList.push({targets: [t], offset: 0, alpha: 1});
        }else{
          that.tweensList.push({targets: t, offset: 0, alpha: 0});
        }
      });
      if(j == this.tipsOnScreen.length-1){
        j = 0;
      }else{
        j += 1;
      }

      this.tweens.timeline({
        ease: 'Power2',
        duration: 1000,
        tweens: that.tweensList,
        onComplete: function (){
          setTimeout(function (){
            that.slideTips(j)
          }, 2000);
        }
      });

    }

    updateTimer(){
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = this.endTime.getTime() - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      var newContent = (hours < 10 ? "0" + hours : hours) + ":"+ (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

      // If the count down is over, write some text
      if (distance < 0) {
        newContent = "00:00";
      }

      this.timer_placeholder.setText(newContent);
    }

    transitionOut (progress)
    {
        this.container.x = -1000 * progress;
    }
}

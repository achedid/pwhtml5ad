var parent = document.getElementById('game-container');
var canvasWidth = parent.clientWidth
var canvasHeight = Math.min(window.screen.availHeight, 800);
var config = {
    type: Phaser.AUTO,
    width: canvasWidth,
    height: canvasHeight,
    parent: 'game-container',
    scene:[
      LandingScene, QuestionScene
    ]
};

var game = new Phaser.Game(config);

var Sticker = {
    stickers: ['great_job', 'wow_three'],
    show: function (callBackFn){

      var item = this.stickers[Math.floor(Math.random()*this.stickers.length)];
      var lottitContainer = document.getElementById('lottieContainer');
      lottitContainer.innerHTML = '';
      lottieContainer.style.zIndex = "10";
      var stickerAnimation = lottie.loadAnimation({
        container: lottitContainer, // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'assets/js/lottie/' + item + '.json', // the path to the animation json
      });
      stickerAnimation.onComplete = function (){
        lottieContainer.style.zIndex = "-1";
        callBackFn();
      }
    },
};

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

/*
 global enchant, GS, BaseChara, ECore, Generator
*/

'use strict';

enchant(); // enchantライブラリ呼び出し

var game, stage; // GameCore,Sceneオブジェクト
var gs = new GS({
  fps: 15,
  height: 320,
  width: 320,
  assets: {}

});

// 初期背景画像
gs.assets.background = {
  height: 320,
  width: 320,
  path: './assets/background.gif'
};

//  ==================================================
//  Template create 2015-10-30
//  ==================================================

gs.assets.bear = {
  height: 32,
  width: 32,
  frame: [4],
  path: './assets/chara1.png',
  speed: 5
};

var Player = enchant.Class.create(BaseChara, {

  initialize: function() {
    var asset = gs.assets.bear;

    BaseChara.call(this, game, asset);
    this.frame = asset.frame;
    this.speed = asset.speed;
    this.input = game.input;
    this.x = 0;
    this.y = (game.height + this.height) / 2;
    this.on('enterframe', this.move);
		game.keybind('X'.charCodeAt(0), 'a');	// z を a ボタンとして割り当てる
    stage.addChild(this);
  },

  move: function() {

    if (this.input.left && this.isRangeMinX()) {
      this.x -= this.speed;
      this.left();
    }

    if (this.input.right && this.isRangeMaxX()) {
      this.x += this.speed;
      this.right();
    }

    if (this.input.up && this.isRangeMinY()) {
      this.y -= this.speed;
    }

    if (this.input.down && this.isRangeMaxY()) {
      this.y += this.speed;
    }

		if(this.x === this.isRangeMaxX()){
      game.end(game.score, 'You win ' + game.score);
			}
  }

});

gs.assets.enemy = {
  height: 30,
  width: 29,
  frame: [3],
  path: './assets/chara6.png',
  speed: 5
};

var Enemy = enchant.Class.create(BaseChara, {
  initialize: function() {
    var asset = gs.assets.enemy;

    BaseChara.call(this, game, asset);
    this.y = 0;
    this.x = Generator.number(game.width - this.width);
    this.speed = Generator.number(10, 1);
    this.frame = [2,1,2,1,2,0];
    this.on('enterframe', this.run);
  },

  move: function() {
		this.y += this.speed;
  },

  run: function() {
    this.move();

    if (this.within(this.parentNode.player,24)) {
      game.end(game.score, 'You win ' + game.score);
    }

    if (!this.isRange()) {
      this.remove();
    }

  }
});

gs.assets.enemy2 = {
  height: 30,
  width: 32,
  frame: [3],
  path: './assets/chara6.png',
  speed: 5
};

var Enemy2 = enchant.Class.create(BaseChara, {
  initialize: function() {
    var asset = gs.assets.enemy2;
    BaseChara.call(this, game, asset);
    this.y = Generator.number(game.height - this.height);
    this.x = game.width - this.width;
		this.omega = this.y < 160 ? 1 : -1; 
		this.direction = 0;
    this.speed = Generator.number(10, 1);
    this.on('enterframe', this.run);
  },

  move: function() {
		this.direction += Math.PI / 180 * this.omega;
		this.x -= this.speed * Math.cos(this.direction);
		this.y += this.speed * Math.sin(this.direction);
  },

  run: function() {
    this.move();

    if (this.within(this.parentNode.player,28)) {
      game.end(game.score, 'Your Score: ' + game.score);
    }

    if (!this.isRange()) {
      this.remove();
    }

  }
});

var EnemyFactory = enchant.Class.create(enchant.Group, {
  initialize: function(player) {
    enchant.Group.call(this);
    this.player = player;
    for (var i = 0; i < 3; i++) {
      this.addChild(new Enemy());
      this.addChild(new Enemy2());
    }
    game.currentScene.addChild(this);
  },

  create: function() {
    this.addChild(new Enemy());
    this.addChild(new Enemy2());
  }
});



window.onload = function() {
  game = new ECore(gs);
  stage = game.rootScene;
  game.onload = function() {
    game.setStage(gs.assets.background);
		var score = new ScoreLabel(0,0);
		score.on('enterframe', function(){
			if(this.age % 5 === 0){
				this.score += 1;
				}
			});
		stage.addChild(score);

    var player = new Player();
    var enemyFactrory = new EnemyFactory(player);

    stage.on('enterframe', function() {
      if (this.age % (game.fps * 0.3) === 0) {
        enemyFactrory.create();
        game.score++;
      }
    });

  };

  game.start();
};

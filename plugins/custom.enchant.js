/*eslint no-unused-vars:0 spaced-comment:0, newline-after-var:0*/
/*globals Sprite Pad*/
'use strict';


var Generator = (function() {

  function Generator() {}
  Generator.number = function(range, offset) {
    var result = Math.floor(Math.random() * range);
    return offset ? result + offset : result;
  };

  Generator.color = function() {
    var color = 255;
    return [
      'rgb(', [this.number(color), this.number(color), this.number(color)], ')'
    ].join('');
  };

  Generator.position = function(x, y) {
    return {
      x: this.number(x),
      y: this.number(y)
    };
  };

  return Generator;
}());

var GS = enchant.Class.create({
  initialize: function(gs) {
    this.setParameter(gs); // パラメータを渡す
  },

  setParameter: function(gs) {
    var self = this;
    Object.keys(gs).forEach(function(key) {
      self[key] = gs[key];
    });
    document.location.search.substr(1).split('&')
      .map(function(queries) {
        return queries.split('=');
      })
      .forEach(function(key) {
        this[key[0]] = parseInt(key[1], 10);
      }, this);
  }
});


var MyPad = enchant.Class.create(enchant.ui.Pad, {
  initialize: function(scene) {
    enchant.ui.Pad.call(this);
    this.moveTo(0, scene.height - this.height);
    scene.addChild(this);
  }
});

var MyBackGround = enchant.Class.create(enchant.Sprite, {
  initialize: function(game, asset) {
    enchant.Sprite.call(this, asset.width, asset.height);
    this.image = game.assets[asset.path];
    this.moveTo(
      ~~(game.width - asset.width) / 2
      , ~~(game.height - asset.width) / 2
    );
  }
});

// 拡張Core
var ECore = enchant.Class.create(enchant.nineleap.Core, {
  // コンストラクタ
  initialize: function(gs) {
    enchant.nineleap.Core.call(this); // Coreを継承
    this.fps = gs.fps; // fpsをセット
    this.width = gs.width; // 画面の幅
    this.height = gs.height; // 画面の高さ
    this.loadAssets(gs.assets); // アセットの読み込み
  },

  loadAssets: function(assets) {
    var keyname = 'path';
    var assetsPathList = [];
    for (var obj in assets) {
      if (assets[obj].hasOwnProperty(keyname)) {
        assetsPathList.push(assets[obj][keyname]);
      }
    }
    if (assetsPathList !== 0) {
      this.preload(assetsPathList);
    }
  },

  setStage: function(background) {
    switch (typeof background) {
      case 'string':
        this.currentScene.backgroundColor = background;
        break;
      case 'object':
        this.setbackgroundimage(background);
        break;
      default:
        break;
    }
  },

  setbackgroundimage: function(asset) {
    new MyBackGround(this, asset);
  },

  setControlPad: function() {
    this.currentScene.addChild(new MyPad(this.currentScene));
  }

});

var BaseChara = enchant.Class.create(enchant.Sprite, {

  initialize: function(core, asset) {
    enchant.Sprite.call(this, asset.width, asset.height);
    this.age = 0;
    this.image = core.assets[asset.path];
    this.range = {
      x: core.width,
      y: core.height
    };
    this.frame = asset.frame;
  },

  left: function() {
    this.scaleX = -1;
  },

  right: function() {
    this.scaleX = 1;
  },

  turn: function() {
    this.scaleX *= -1;
  },

  remove: function() {
    this.parentNode.removeChild(this);
  },

  isRangeMinX: function() {
    return this.x > 0;
  },

  isRangeMaxX: function() {
    return this.x < (this.range.x - this.width);
  },

  isRangeX: function() {
    return this.isRangeMinX() && this.isRangeMaxX();
  },

  isRangeMinY: function() {
    return this.y > 0;
  },

  isRangeMaxY: function() {
    return this.y < (this.range.y - this.height);
  },

  isRangeY: function() {
    return this.isRangeMinY() && this.isRangeMaxY();
  },

  isRange: function() {
    return this.isRangeX() && this.isRangeY();
  }

});


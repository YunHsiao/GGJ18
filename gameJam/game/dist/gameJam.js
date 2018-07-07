
/*
 * gameJam v1.0.0
 * (c) 2018 @cocos
 * Released under the MIT License.
 */

'use strict';

var EnterGame = (function (superclass) {
  function EnterGame() {
    superclass.call(this);
  }

  if ( superclass ) EnterGame.__proto__ = superclass;
  EnterGame.prototype = Object.create( superclass && superclass.prototype );
  EnterGame.prototype.constructor = EnterGame;

  EnterGame.prototype.start = function start () {
    var this$1 = this;

    // todo: register button event
    console.log(("test for EnterGame " + (this.test)));
    this.btn.on('clicked', function () {
      this$1._enterGame();
    });
  };

  EnterGame.prototype._enterGame = function _enterGame () {
    cc.game.loadScene('game');
  };

  return EnterGame;
}(cc.ScriptComponent));

EnterGame.schema = {
  test: {
    type: 'number'
  },

  btn: {
    type: 'entity'
  }
};

var RotateBox = (function (superclass) {
  function RotateBox() {
    superclass.call(this);
  }

  if ( superclass ) RotateBox.__proto__ = superclass;
  RotateBox.prototype = Object.create( superclass && superclass.prototype );
  RotateBox.prototype.constructor = RotateBox;

  RotateBox.prototype.start = function start () {
    console.log(("Rotation speed is " + (this.speed)));
  };

  RotateBox.prototype.tick = function tick () {
    cc.math.quat.rotateY(this._entity.lrot,this._entity.lrot, this.speed * this._app.deltaTime);
  };

  return RotateBox;
}(cc.ScriptComponent));

RotateBox.schema = {
  speed: {
    type: 'number',
    default: 1
  }
};

var AddBoxPrefab = (function (superclass) {
  function AddBoxPrefab() {
    superclass.call(this);
  }

  if ( superclass ) AddBoxPrefab.__proto__ = superclass;
  AddBoxPrefab.prototype = Object.create( superclass && superclass.prototype );
  AddBoxPrefab.prototype.constructor = AddBoxPrefab;

  AddBoxPrefab.prototype.start = function start () {
    var this$1 = this;

    this.btn.once('clicked', function () {
      var en = this$1.box.instantiate(null, null);
      en.setParent(this$1.parent);
      en.active = false;
      en.active = true;
    });
    // console.log('aaa');
  };

  return AddBoxPrefab;
}(cc.ScriptComponent));

AddBoxPrefab.schema = {
  box: {
    type: 'asset',
    default: null
  },
  parent: {
    type: 'entity',
    default: null
  },
  btn: {
    type: 'entity',
    default: null
  },
};

// 'EnterGame' should match to script Comp name
var _componentRegitstry = {
  'game.EnterGame': EnterGame,
  'game.RotateBox': RotateBox,
  'game.AddBoxPrefab': AddBoxPrefab
};

var _gameInstance = null;
var Game = (function (superclass) {
  function Game(canvas, opts) {
    superclass.call(this, canvas, opts);
    _gameInstance = this;
  }

  if ( superclass ) Game.__proto__ = superclass;
  Game.prototype = Object.create( superclass && superclass.prototype );
  Game.prototype.constructor = Game;

  Game.prototype.init = function init () {
    var this$1 = this;

    for (var key in _componentRegitstry) {
      this$1.registerClass(key, _componentRegitstry[key]);
    }
  };

  Game.prototype.loadScene = function loadScene (name) {
    var this$1 = this;

    this.assets.loadLevel(name, function (err, level) {
      if (err) {
        console.error(err);
      } else {
        this$1.loadLevel(level);
      }
    });
  };

  return Game;
}(cc.App));

var game = { Game: Game };

module.exports = game;
//# sourceMappingURL=gameJam.js.map

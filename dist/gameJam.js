
/*
 * gameJam v1.0.0
 * (c) 2018 @cocos
 * Released under the MIT License.
 */

'use strict';

var cc$1 = window.cc;
var ref = cc$1.math;
var vec2 = ref.vec2;
var vec3 = ref.vec3;
var quat = ref.quat;
var clamp = ref.clamp;
var randomRange = ref.randomRange;

var isZeroVector = function(v) {
  return !Math.abs(v.x) && !Math.abs(v.y) && !Math.abs(v.z);
};

var scaleToXZ = function(v, scale) {
  if ( scale === void 0 ) scale = 1;

  var x = v.x, z = v.z, s = scale / Math.sqrt(x * x + z * z);
  v.x *= s; v.y = 0; v.z *= s;
};

var FPCamera = (function (superclass) {
  function FPCamera() {
    superclass.call(this);
    this.id_forward = vec3.new(0, 0, 1);
    this.id_right = vec3.new(1, 0, 0);
    this.forward = vec3.new(0, 0, 1);
    this.right = vec3.new(1, 0, 0);
    this.euler = vec3.new(0, 0, 0);
    this.posOff = vec3.zero();
    this.rotOff = vec2.zero();
    this.speed = 1;
    this.lastTime = 0;
    this.id_up = vec3.new(0, this.speed, 0);
  }

  if ( superclass ) FPCamera.__proto__ = superclass;
  FPCamera.prototype = Object.create( superclass && superclass.prototype );
  FPCamera.prototype.constructor = FPCamera;

  FPCamera.prototype.start = function start () {
    this.pos = this._entity.lpos;
    this.spawn = vec3.clone(this._entity.lpos);
    this.rot = this._entity.lrot;
    this.input = this._app._input;
    this.input._lock = cc$1.input.LOCK_ALWAYS;
    this.footsteps = this._entity.getCompsInChildren('AudioSource');
    this.enableCollision = true;
    this.col = this._entity.getComp('Collider');
    if (!this.col) { return; }
    this.col.collider.setUpdateMode({in: true, out: true});
    this.col.collider.setFixedRotation(true);
    this.canvas = this._app._device._gl.canvas;
  };

  FPCamera.prototype.tick = function tick () {
    // do nothing if no inputs or already ended
    if (this.ended || !this.input._pointerLocked
      && !this.input.touchCount && !this.input.hasKeyDown) { return; }
    // drag player back if (accidentally) fall off
    if (this.pos.y < -25) { vec3.copy(this.pos, this.spawn); }
    // update utils
    scaleToXZ(vec3.transformQuat(this.forward, this.id_forward, this.rot), this.speed);
    scaleToXZ(vec3.transformQuat(this.right, this.id_right, this.rot), this.speed);
    vec3.set(this.posOff, 0, 0, 0); vec2.set(this.rotOff, 0, 0);
    // gather inputs
    if (this.input.touchCount) { this.tickTouch(); }
    if (this.input._pointerLocked) { this.tickMouse(); }
    if (this.input.hasKeyDown) { this.tickKeyboard(); }
    // apply to transform
    vec3.set(this.euler, clamp(this.euler.x + this.rotOff.x, -90, 90), this.euler.y + this.rotOff.y, 0);
    quat.fromEuler(this.rot, this.euler.x, this.euler.y, this.euler.z);
    if (isZeroVector(this.posOff)) { return; }
    vec3.add(this.pos, this.pos, this.posOff);
    // play footsteps
    if (this._app.totalTime - this.lastTime > 0.5 && this.footsteps.length) {
      this.lastTime = this._app.totalTime;
      this.footsteps[Math.floor(randomRange(0, this.footsteps.length-0.5))].play();
    }
  };

  FPCamera.prototype.tickMouse = function tickMouse () {
    this.rotOff.x = -this.input.mouseDeltaY;
    this.rotOff.y = -this.input.mouseDeltaX;
  };

  FPCamera.prototype.tickKeyboard = function tickKeyboard () {
    if (this.input.keypress('w')) { vec3.sub(this.posOff, this.posOff, this.forward); }
    if (this.input.keypress('s')) { vec3.add(this.posOff, this.posOff, this.forward); }
    if (this.input.keypress('a')) { vec3.sub(this.posOff, this.posOff, this.right); }
    if (this.input.keypress('d')) { vec3.add(this.posOff, this.posOff, this.right); }
    if (this.input.keypress('q')) { vec3.sub(this.posOff, this.posOff, this.id_up); }
    if (this.input.keypress('e')) { vec3.add(this.posOff, this.posOff, this.id_up); }
    if (this.input.keydown('f') && this.col) { this.toggleCollision(); }
  };

  FPCamera.prototype.tickTouch = function tickTouch () {
    var this$1 = this;

    for (var i = 0; i < this.input.touchCount; i++) {
      var touch = this$1.input.getTouchInfo(i);
      if (touch.x > this$1.canvas.width * 0.4) { // rotation
        this$1.rotOff.x = touch.dy;
        this$1.rotOff.y = -touch.dx;
      } else { //position
        if (touch._phase === cc$1.input.TOUCH_START) {
          touch.initX = touch.x;
          touch.initY = touch.y;
        }
        vec3.scale(this$1.forward, this$1.forward, clamp((touch.y - touch.initY) * 0.01, -1, 1));
        vec3.scale(this$1.right, this$1.right, clamp((touch.x - touch.initX) * 0.01, -1, 1));
        vec3.sub(this$1.posOff, this$1.posOff, this$1.forward);
        vec3.add(this$1.posOff, this$1.posOff, this$1.right);
      }
    }
  };

  FPCamera.prototype.toggleCollision = function toggleCollision () {
    this.enableCollision = !this.enableCollision;
    this.col.collider.setUpdateMode({in: true, out: this.enableCollision});
  };

  FPCamera.prototype.game_over = function game_over () {
    this.ended = true;
    this._entity.getComp('AudioSource').stop();
  };

  return FPCamera;
}(cc$1.ScriptComponent));

var cc$2 = window.cc;
var ref$1 = cc$2.math;
var quat$1 = ref$1.quat;
var vec3$1 = ref$1.vec3;
var color4 = ref$1.color4;
var ref$1$1 = cc$2.geometry;
var box = ref$1$1.box;
var intersect = ref$1$1.intersect;

var Portal = (function (superclass) {
  function Portal() {
    superclass.call(this);
    this.v3 = vec3$1.zero();
    this.qt = quat$1.create();
    this.v3_2 = vec3$1.zero();
  }

  if ( superclass ) Portal.__proto__ = superclass;
  Portal.prototype = Object.create( superclass && superclass.prototype );
  Portal.prototype.constructor = Portal;

  Portal.prototype.start = function start () {
    this.model = this._entity.getComp('Model')._models[0];
    this.model._node._getWorldPRS(this.v3, this.qt, this.v3_2);
    box.setTransform(this.model._boundingBox, this.v3, this.qt, this.v3_2, this.model._bbModelSpace);
    this.mst = this.monster.getComp('game.Monster');
    this.color_after_life = color4.new(0.882, 0, 0, 1);
    this.count = 0;
  };

  Portal.prototype.tick = function tick () {
    var this$1 = this;

    if (this.ended) { return; }
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      // exporter-TODO: define unlit USE_COLOR
      for (var i = 0; i < this._app.scene._models.length; i++)
        { this$1._app.scene._models.data[i]._effect.setProperty('color', this$1.color_after_life); }
      this.player.getComp('game.FPCamera').speed = this.mst.speed;
      this.ended = true;
      this._entity.getComp('AudioSource').play();
      cc$2.game.over = true;
      setTimeout((function(){
        this.mst.disappear();
        vec3$1.set(this.monster.lpos, this.player.lpos.x, 
          this.player.lpos.y + this.mst.pursuitDist - 1, this.player.lpos.z);
      }).bind(this), 5000);
    }
  };

  return Portal;
}(cc$2.ScriptComponent));

Portal.schema = {
  player: {
    type: 'entity',
    default: null
  },

  monster: {
    type: 'entity',
    default: null
  }
};

var cc$3 = window.cc;
var ref$2 = cc$3.math;
var color4$1 = ref$2.color4;

var Logo = (function (superclass) {
  function Logo() {
    superclass.call(this);
  }

  if ( superclass ) Logo.__proto__ = superclass;
  Logo.prototype = Object.create( superclass && superclass.prototype );
  Logo.prototype.constructor = Logo;

  Logo.prototype.start = function start () {
    this.c = color4$1.create();
    this.t1 = this.logo.getComp('Image');
    this.t2 = this.intro1.getComp('Image');
    this.t3 = this.intro2.getComp('Image');
    this.t1.color = color4$1.set(this.c, this.t1.color.r, this.t1.color.g, this.t1.color.b, 0);
    this.t2.color = color4$1.set(this.c, this.t2.color.r, this.t2.color.g, this.t2.color.b, 0);
    this.t3.color = color4$1.set(this.c, this.t3.color.r, this.t3.color.g, this.t3.color.b, 0);
    this.a = 0;
  };

  Logo.prototype.tick = function tick () {
    if (this.ended) { return; }
    if (this._app._input.keyup('Enter') || this._app._input.touchCount) { this._end(); }
    if (this.t1.color.a < 1) {
      this.t1.color = color4$1.set(this.c, this.t1.color.r, this.t1.color.g, this.t1.color.b, this.t1.color.a + 0.01);
    } else if (this.t2.color.a < 1) {
      if (this.a < 1) { this.a += 0.01; return; }
      this.t2.color = color4$1.set(this.c, this.t2.color.r, this.t2.color.g, this.t2.color.b, this.t2.color.a + 0.01);
    } else if (this.t3.color.a < 1) {
      if (this.a < 2) { this.a += 0.01; return; }
      this.t3.color = color4$1.set(this.c, this.t3.color.r, this.t3.color.g, this.t3.color.b, this.t3.color.a + 0.01);
    } else {
      if (this.a < 3) { this.a += 0.01; return; }
      this._end();
    }
  };

  Logo.prototype._end = function _end () {
    cc$3.game.loadScene('main');
    this.ended = true;
  };

  return Logo;
}(cc$3.ScriptComponent));

Logo.schema = {
  logo: {
    type: 'entity',
    default: null
  },

  intro1: {
    type: 'entity',
    default: null
  },

  intro2: {
    type: 'entity',
    default: null
  }
};

var cc$4 = window.cc;
var ref$3 = cc$4.math;
var quat$2 = ref$3.quat;
var vec3$2 = ref$3.vec3;
var randomRange$1 = ref$3.randomRange;
var ref$1$2 = cc$4.geometry;
var box$1 = ref$1$2.box;
var intersect$1 = ref$1$2.intersect;

var Monster = (function (superclass) {
  function Monster() {
    superclass.call(this);
    this.v3 = vec3$2.zero();
    this.qt = quat$2.create();
    this.v3_2 = vec3$2.zero();
  }

  if ( superclass ) Monster.__proto__ = superclass;
  Monster.prototype = Object.create( superclass && superclass.prototype );
  Monster.prototype.constructor = Monster;

  Monster.prototype.start = function start () {
    var this$1 = this;

    this.model = this._entity.getComp('Model')._models[0];
    this.gameMaze = this.maze.getComp('game.Maze');
    // engine-TODO: quad unsupported
    this.children = this._entity.getCompsInChildren('Model');
    this.rot = [];
    for (var i = 0; i < this.children.length; i++) {
      this$1.rot.push(randomRange$1(-Math.PI / 180, Math.PI / 180));
      var m = new cc$4.Material();
      // exporter-TODO: transparent shader
      // engine-FIX: gl.REPEAT not working? @see unlit.frag
      m.effect = this$1._app.assets.get('builtin-effect-unlit-transparent');
      m.setProperty('mainTexture', this$1.children[i].material.effectInst.getProperty('diffuse_texture'));
      m.define('USE_TEXTURE', true);

      this$1.children[i].material = m;
    }
    this.audios = this._entity.getCompsInChildren('AudioSource');
    this.audio = this._entity.getComp('AudioSource');
    this.dir = vec3$2.zero();
    this.up = vec3$2.new(0, 1, 0);
    this.keyPoints = [];
    this.keyPoints.push(vec3$2.new(0, 10, 144));
    this.keyPoints.push(vec3$2.new(0, 10, 79));
    this.keyPoints.push(vec3$2.new(-176, 10, 58));
    this.keyPoints.push(vec3$2.new(-182, 10, 202));
    this.keyPoints.push(vec3$2.new(-99, 10, 200));
    this.keyPoints.push(vec3$2.new(-99, -10, 145));
    this.keyPoints.push(vec3$2.new(-99, -10, 40));
    this.keyPoints.push(vec3$2.new(-220, -10, 34));
    this.keyPoints.push(vec3$2.new(-220, -10, 100));
    this.keyPoints.push(vec3$2.new(-157, -10, 100));
    this.keyPoints.push(vec3$2.new(-103, 10, 100));
    this.keyPoints.push(vec3$2.new(0, 10, 50));
    this.moveIdx = 0;
    this.speed = 0.3;
    this.pursuitDist = 100;
    this.time = 0;
    this.heartBeatInterval = 1.5;
  };

  Monster.prototype.tick = function tick () {
    var this$1 = this;

    // engine-TODO: stop ticking after load scene, before destroy
    if (this.ended) { return; }
    this.time += this._app.deltaTime;
    this._entity._getWorldPRS(this.v3, this.qt, this.v3_2);
    box$1.setTransform(this.model._boundingBox, this.v3, this.qt, this.v3_2, this.model._bbModelSpace);
    if (intersect$1.box_point(this.model._boundingBox, this.player.lpos)) {
      if (cc$4.game.over) {
        this.over.getComp('AudioSource').play();
        setTimeout((function(){
          cc$4.game.loadScene('limbo');
          this.audio.stop();
        }).bind(this), 1500);
      } else {
        cc$4.game.loadScene('limbo');
        for (var i = 0; i < this.audios.length; i++) {
          this$1.audios[i].play();
        }
        setTimeout((function(){ this.audio.stop(); }).bind(this), 5000);
      }
      this.ended = true;
      this.player.getComp('game.FPCamera').game_over();
    }
    // move
    vec3$2.sub(this.dir, this.player.lpos, this._entity.lpos);
    if (vec3$2.mag(this.dir) > this.pursuitDist) {
      vec3$2.sub(this.dir, this.keyPoints[this.moveIdx], this._entity.lpos);
      this.time = this.heartBeatInterval;
    } else {
      this.heartBeat(1 - vec3$2.mag(this.dir) / this.pursuitDist);
    }
    vec3$2.scale(this.dir, vec3$2.normalize(this.dir, this.dir), this.speed);
    vec3$2.add(this._entity.lpos, this._entity.lpos, this.dir);
    if (this.lessThan(this._entity.lpos, this.keyPoints[this.moveIdx], this.speed))
      { this.moveIdx = (this.moveIdx + 1) % this.keyPoints.length; }
    // rotate
    vec3$2.normalize(this.dir, this.dir);
    quat$2.fromViewUp(this._entity.lrot, this.dir, this.up);
    for (var i$1 = 0; i$1 < this.children.length; i$1++) {
      quat$2.rotateZ(this$1.children[i$1]._entity.lrot, this$1.children[i$1]._entity.lrot, this$1.rot[i$1]);
    }
  };

  Monster.prototype.heartBeat = function heartBeat (intensity) {
    var inforced = intensity * 0.8 + 0.2;
    this.audio.volume = inforced;
    if (this.time < this.heartBeatInterval * (1 - intensity * 0.666)) { return; }
    this.time = 0;
    this.audio.stop(); this.audio.play();
    this.gameMaze.heartBeat(inforced);
  };

  Monster.prototype.lessThan = function lessThan (a, b, c) {
    return Math.abs(a.x - b.x) < c && Math.abs(a.y - b.y) < c && Math.abs(a.z - b.z) < c;
  };

  Monster.prototype.disappear = function disappear () {
    var this$1 = this;

    for (var i = 0; i < this.children.length; i++)
      { this$1.children[i].onDisable(); }
  };

  return Monster;
}(cc$4.ScriptComponent));

Monster.schema = {
  player: {
    type: 'entity',
    default: null
  },
  over: {
    type: 'entity',
    default: null
  },
  maze: {
    type: 'entity',
    default: null
  }
};

var cc$5 = window.cc;

var Limbo = (function (superclass) {
  function Limbo() {
    superclass.call(this);
  }

  if ( superclass ) Limbo.__proto__ = superclass;
  Limbo.prototype = Object.create( superclass && superclass.prototype );
  Limbo.prototype.constructor = Limbo;

  Limbo.prototype.start = function start () {
    this.counter = 0;
  };

  Limbo.prototype.tick = function tick () {
    if (this.ended) { return; }
    if (this._app._input.keyup('Enter')) { this._end(); }
    if (this.counter < 6) {
      this.counter += 0.01;
    } else { this._end(); }
  };

  Limbo.prototype._end = function _end () {
    cc$5.game.loadScene('logo');
    this.ended = true;
  };

  return Limbo;
}(cc$5.ScriptComponent));

var cc$6 = window.cc;

// always remember to 'apply changes to prefab', or it won't work
var Hidden = (function (superclass) {
  function Hidden() {
    superclass.call(this);
  }

  if ( superclass ) Hidden.__proto__ = superclass;
  Hidden.prototype = Object.create( superclass && superclass.prototype );
  Hidden.prototype.constructor = Hidden;

  Hidden.prototype.start = function start () {
    this._entity.getComp('Model').onDisable();
  };

  Hidden.prototype.tick = function tick () {
    if (this.ended) { return; }
    if (cc$6.game.over) {
      this._entity.getComp('Model').onEnable();
      this.ended = true;
    }
  };

  return Hidden;
}(cc$6.ScriptComponent));

var cc$7 = window.cc;
var ref$4 = cc$7.math;
var vec2$1 = ref$4.vec2;
var vec3$3 = ref$4.vec3;
var color4$2 = ref$4.color4;

var adjustSize = function(out, v) {
  out.x = v.x > 0 ? v.x : 1;
  out.y = v.y > 0 ? v.y : 1;
  out.z = v.z > 0 ? v.z : 1;
  return out;
};

var Maze = (function (superclass) {
  function Maze() {
    superclass.call(this);
  }

  if ( superclass ) Maze.__proto__ = superclass;
  Maze.prototype = Object.create( superclass && superclass.prototype );
  Maze.prototype.constructor = Maze;

  Maze.prototype.start = function start () {
    var this$1 = this;

    this.models = this._entity.getCompsInChildren('Model');
    this.time = 0;
    this.borderMax = 0.05;
    this.border = vec2$1.new(this.borderMax, this.borderMax);
    this.color = color4$2.create();
    this.intensity = 1;
    if (!this._app._forward._programLib.hasProgram('binary')) {
      var programUrls = {
        name: 'binary',
        json: './materials/binary.json',
        vert: './materials/binary.vert',
        frag: './materials/binary.frag',
      };
      this._app.assets.loadUrls('program', programUrls);
    }
    var effectUrls = { json: './materials/BinaryEffect.json' };
    this._app.assets.loadUrls('effect', effectUrls, function (err, effect) {
      for (var i = 0; i < this$1.models.length; i++) {
        var m = new cc$7.Material(); m.effect = effect;
        m.define('USE_COLOR', true);
        m.setProperty('border', this$1.border);
        this$1.models[i].material = m;
      }
    });
    var size = vec3$3.zero();
    var cols = this._entity.getCompsInChildren('Collider');
    for (var i = 0; i < cols.length; i++) {
      cols[i].size = adjustSize(size, cols[i].size);
    }
  };

  Maze.prototype.setProperty = function setProperty (name, prop) {
    var this$1 = this;

    for (var i = 0; i < this.models.length; i++) {
      this$1.models[i].material.setProperty(name, prop);
    }
  };

  Maze.prototype.tick = function tick () {
    if (!this.models) { return; }
    this.time += this._app.deltaTime * 5;
    var margin = this.time > Math.PI ? 1 :
      Math.abs(Math.cos(this.time) * this.intensity + 1 - this.intensity);
    vec2$1.set(this.border, this.borderMax * margin, this.borderMax * margin);
    color4$2.set(this.color, 1, margin, margin);
    this.setProperty('border', this.border);
    this.setProperty('color', this.color);
  };

  Maze.prototype.heartBeat = function heartBeat (intensity) {
    this.time = 0;
    this.intensity = intensity;
  };

  return Maze;
}(cc$7.ScriptComponent));

var cc = window.cc;
var assetsDir = './assets';
var _componentRegitstry = {
  'game.FPCamera': FPCamera,
  'game.Portal': Portal,
  'game.Logo': Logo,
  'game.Monster': Monster,
  'game.Limbo': Limbo,
  'game.Hidden': Hidden,
  'game.Maze': Maze,
};

var Game = (function (superclass) {
  function Game(canvas, opts) {
    superclass.call(this, canvas, opts);
    this.scenes = {};
  }

  if ( superclass ) Game.__proto__ = superclass;
  Game.prototype = Object.create( superclass && superclass.prototype );
  Game.prototype.constructor = Game;

  Game.prototype.init = function init () {
    var this$1 = this;

    this.resize();
    for (var key in _componentRegitstry) {
      this$1.registerClass(key, _componentRegitstry[key]);
    }
    this.system('physics').world.setGravity(0, -500, 0);
    this.system('physics').world.defaultContactMaterial.contactEquationRelaxation = 2.2;
    cc.resl({
      manifest: {
        gameInfo: {
          type: 'text',
          parser: JSON.parse,
          src: (assetsDir + "/game.json")
        },
      },
      onDone: function onDone(data) {
        cc.game.loadGameConfig(assetsDir, data.gameInfo);
        cc.game.loadScene('logo');
        cc.game.loadScene('main', true);
        cc.game.loadScene('limbo', true);
      }
    });
  };

  Game.prototype.loadScene = function loadScene (name, justLoad) {
    var this$1 = this;

    if (this.scenes[name] && !justLoad)
      { this.loadLevel(this.scenes[name]); }
    this.assets.loadLevel(name, function (err, level) {
      if (err) {
        console.error(err);
      } else {
        this$1.scenes[name] = level;
        if (!justLoad)
          { this$1.loadLevel(level); }
      }
    });
  };

  return Game;
}(cc.App));

var Game$1 = { Game: Game };

module.exports = Game$1;
//# sourceMappingURL=gameJam.js.map

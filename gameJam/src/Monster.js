const { cc } = window;
const { quat, vec3, randomRange } = cc.math;
const { box, intersect } = cc.geometry;

export default class Monster extends cc.ScriptComponent {
  constructor() {
    super();
    this.v3 = vec3.zero();
    this.qt = quat.create();
    this.v3_2 = vec3.zero();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
    this.gameMaze = this.maze.getComp('game.Maze');
    // engine-TODO: quad unsupported
    this.children = this._entity.getCompsInChildren('Model');
    this.rot = [];
    for (let i = 0; i < this.children.length; i++) {
      this.rot.push(randomRange(-Math.PI / 180, Math.PI / 180));
      let m = new cc.Material();
      // exporter-TODO: transparent shader
      // engine-FIX: gl.REPEAT not working? @see unlit.frag
      m.effect = this._app.assets.get('builtin-effect-unlit-transparent');
      m.setProperty('mainTexture', this.children[i].material.effectInst.getProperty('diffuse_texture'));
      m.define('USE_TEXTURE', true);

      this.children[i].material = m;
    }
    this.audios = this._entity.getCompsInChildren('AudioSource');
    this.audio = this._entity.getComp('AudioSource');
    this.dir = vec3.zero();
    this.up = vec3.new(0, 1, 0);
    this.keyPoints = [];
    this.keyPoints.push(vec3.new(0, 10, 144));
    this.keyPoints.push(vec3.new(0, 10, 79));
    this.keyPoints.push(vec3.new(-176, 10, 58));
    this.keyPoints.push(vec3.new(-182, 10, 202));
    this.keyPoints.push(vec3.new(-99, 10, 200));
    this.keyPoints.push(vec3.new(-99, -10, 145));
    this.keyPoints.push(vec3.new(-99, -10, 40));
    this.keyPoints.push(vec3.new(-220, -10, 34));
    this.keyPoints.push(vec3.new(-220, -10, 100));
    this.keyPoints.push(vec3.new(-157, -10, 100));
    this.keyPoints.push(vec3.new(-103, 10, 100));
    this.keyPoints.push(vec3.new(0, 10, 50));
    this.moveIdx = 0;
    this.speed = 0.3;
    this.pursuitDist = 100;
    this.time = 0;
    this.heartBeatInterval = 1.5;
  }

  tick() {
    // engine-TODO: stop ticking after load scene, before destroy
    if (this.ended) return;
    this.time += this._app.deltaTime;
    this._entity._getWorldPRS(this.v3, this.qt, this.v3_2);
    box.setTransform(this.model._boundingBox, this.v3, this.qt, this.v3_2, this.model._bbModelSpace);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      if (cc.game.over) {
        this.over.getComp('AudioSource').play();
        setTimeout((function(){
          cc.game.loadScene('limbo');
          this.audio.stop();
        }).bind(this), 1500);
      } else {
        cc.game.loadScene('limbo');
        for (let i = 0; i < this.audios.length; i++) {
          this.audios[i].play();
        }
        setTimeout((function(){ this.audio.stop(); }).bind(this), 5000);
      }
      this.ended = true;
      this.player.getComp('game.FPCamera').game_over();
    }
    // move
    vec3.sub(this.dir, this.player.lpos, this._entity.lpos);
    if (vec3.mag(this.dir) > this.pursuitDist) {
      vec3.sub(this.dir, this.keyPoints[this.moveIdx], this._entity.lpos);
      this.time = this.heartBeatInterval;
    } else {
      this.heartBeat(1 - vec3.mag(this.dir) / this.pursuitDist);
    }
    vec3.scale(this.dir, vec3.normalize(this.dir, this.dir), this.speed);
    vec3.add(this._entity.lpos, this._entity.lpos, this.dir);
    if (this.lessThan(this._entity.lpos, this.keyPoints[this.moveIdx], this.speed))
      this.moveIdx = (this.moveIdx + 1) % this.keyPoints.length;
    // rotate
    vec3.normalize(this.dir, this.dir);
    quat.fromViewUp(this._entity.lrot, this.dir, this.up);
    for (let i = 0; i < this.children.length; i++) {
      quat.rotateZ(this.children[i]._entity.lrot, this.children[i]._entity.lrot, this.rot[i]);
    }
  }

  heartBeat(intensity) {
    let inforced = intensity * 0.8 + 0.2;
    this.audio.volume = inforced;
    if (this.time < this.heartBeatInterval * (1 - intensity * 0.666)) return;
    this.time = 0;
    this.audio.stop(); this.audio.play();
    this.gameMaze.heartBeat(inforced);
  }

  lessThan(a, b, c) {
    return Math.abs(a.x - b.x) < c && Math.abs(a.y - b.y) < c && Math.abs(a.z - b.z) < c;
  }

  disappear() {
    for (let i = 0; i < this.children.length; i++)
      this.children[i].onDisable();
  }
}

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
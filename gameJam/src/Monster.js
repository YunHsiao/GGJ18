const { mat4, quat, vec3, color4, randomRange } = cc.math;
const { box, intersect } = cc.geometry;

export default class Monster extends cc.ScriptComponent {
  constructor() {
    super();
    this.m4 = mat4.create();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
    // engine-TODO: quad unsupported
    this.children = this._entity.getCompsInChildren('Model');
    this.rot = [];
    for (let i = 0; i < this.children.length; i++) {
      this.rot.push(randomRange(-Math.PI / 180, Math.PI / 180));
      let m = new cc.Material();
      // exporter-TODO: transparent shader
      // engine-FIX: gl.REPEAT not working? @see unlit.frag
      m.effect = this._app.assets.get('builtin-effect-phong-transparent');
      m.setProperty('diffuse_texture', this.children[i].material.effectInst.getProperty('diffuse_texture'));
      m.define('USE_DIFFUSE_TEXTURE', true);

      this.children[i].material = m;
    }
    this.audios = this._entity.getCompsInChildren('AudioSource');
    this.audio = this._entity.getComp('AudioSource');
    this.dir = vec3.zero();
    this.up = vec3.new(0, 1, 0);
    this.keyPoints = [];
    this.keyPoints.push(vec3.new(0, 8.6, 122));
    this.keyPoints.push(vec3.new(-60, 30, 145));
    this.keyPoints.push(vec3.new(-72, 30, 122));
    this.keyPoints.push(vec3.new(-60, 30, 145));
    this.moveIdx = 0;
    this.speed = 0.2;
    this.pursuitDist = 100;
  }

  tick() {
    // engine-TODO: stop ticking after load scene, before destroy
    if (this.ended) return;
    this.model._node.getWorldRT(this.m4);
    vec3.add(this.model._boundingBox.center, this.model._bbModelSpace.center, this.model._node.lpos);
    vec3.mul(this.model._boundingBox.size, this.model._bbModelSpace.size, this.model._node.lscale);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      cc.game.loadScene('limbo');
      if (cc.game.over) {
          this.over.getComp('AudioSource').play();
      } else {
        for (let i = 0; i < this.audios.length; i++) {
          this.audios[i].play();
        } 
      }
      this.ended = true;
      setTimeout((function(){ this.audio.stop(); }).bind(this), 5000);
      this.player.getComp('game.FPCamera').game_over();
    }
    // move
    vec3.sub(this.dir, this.player.lpos, this._entity.lpos);
    if (vec3.mag(this.dir) > this.pursuitDist) {
      vec3.sub(this.dir, this.keyPoints[this.moveIdx], this._entity.lpos);
      if (this.audio.state == 1) this.audio.stop();
    } else {
      if (this.audio.state != 1) this.audio.play();
      this.audio.volume = 1 - vec3.mag(this.dir) / this.pursuitDist;
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
  }
};
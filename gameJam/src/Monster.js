const { mat4, quat, vec3, randomRange } = cc.math;
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
      m.effect = this._app.assets.get('builtin-effect-phong-transparent');
      m.setProperty('diffuse_texture', this.children[i].material.effectInst.getProperty('diffuse_texture'));
      m.define('USE_DIFFUSE_TEXTURE', true);

      this.children[i].material = m;
    }
    this.audios = this._entity.getCompsInChildren('AudioSource');
    this.dir = vec3.zero();
    this.up = vec3.new(0, 1, 0);
    this.keyPoints = [];
    this.keyPoints.push(vec3.new(0, 9, 124));
    this.keyPoints.push(vec3.new(-60, 30, 145));
    this.keyPoints.push(vec3.new(-72, 30, 122));
    this.keyPoints.push(vec3.new(-60, 30, 145));
    this.moveIdx = 0;
  }

  tick() {
    // engine-TODO: stop ticking after load scene, before destroy
    if (this.ended) return;
    this.model._node.getWorldRT(this.m4);
    vec3.add(this.model._boundingBox.center, this.model._bbModelSpace.center, this.model._node.lpos);
    vec3.mul(this.model._boundingBox.size, this.model._bbModelSpace.size, this.model._node.lscale);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      cc.game.loadScene('limbo');
      for (let i = 0; i < this.audios.length; i++) {
        this.audios[i].play();
      }
      this.ended = true;
      this.player.getComp('game.FPCamera').game_over();
    }
    // move
    vec3.sub(this.dir, this.keyPoints[this.moveIdx], this._entity.lpos);
    vec3.scale(this.dir, vec3.normalize(this.dir, this.dir), 0.5);
    vec3.add(this._entity.lpos, this._entity.lpos, this.dir);
    if (this.lessThan(this._entity.lpos, this.keyPoints[this.moveIdx]))
      this.moveIdx = (this.moveIdx + 1) % this.keyPoints.length;
    // rotate
    vec3.sub(this.dir, this.player.lpos, this._entity.lpos);
    vec3.normalize(this.dir, this.dir);
    quat.fromViewUp(this._entity.lrot, this.dir, this.up);
    for (let i = 0; i < this.children.length; i++) {
      quat.rotateZ(this.children[i]._entity.lrot, this.children[i]._entity.lrot, this.rot[i]);
    }
  }

  lessThan(a, b) {
    return Math.abs(a.x - b.x) < 0.1 && Math.abs(a.y - b.y) < 0.1 && Math.abs(a.z - b.z) < 0.1;
  }
}

Monster.schema = {
  player: {
    type: 'entity',
    default: null
  }
};
const { mat4 } = cc.math;
const { box, intersect } = cc.geometry;

export default class Monster extends cc.ScriptComponent {
  constructor() {
    super();
    this.m4 = mat4.create();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
  }

  tick() {
    if (this.ended) return;
    this.model._node.getWorldMatrix(this.m4);
    box.setTransform(this.model._boundingBox, this.m4, this.model._bbModelSpace);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      cc.game.loadScene('limbo');
      this.ended = true;
    }
  }
}

Monster.schema = {
  player: {
    type: 'entity',
    default: null
  }
};
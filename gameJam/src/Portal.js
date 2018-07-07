const { mat4, vec3 } = cc.math;
const { box, intersect } = cc.geometry;

export default class Portal extends cc.ScriptComponent {
  constructor() {
    super();
    this.m4 = mat4.create();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
  }

  tick() {
    if (this.ended) return;
    // engine-TODO: bounding box scaling
    this.model._node.getWorldRT(this.m4);
    box.setTransform(this.model._boundingBox, this.m4, this.model._bbModelSpace);
    vec3.mul(this.model._boundingBox.size, this.model._bbModelSpace.size, this.model._node.lscale);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      cc.game.loadScene(this.level);
      this.player.getComp('game.FPCamera').game_over();
      this.ended = true;
    }
  }
}

Portal.schema = {
  level: {
    type: 'string',
    default: 0
  },

  player: {
    type: 'entity',
    default: null
  }
};
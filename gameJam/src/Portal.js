const { mat4, vec3, color4 } = cc.math;
const { box, intersect } = cc.geometry;

export default class Portal extends cc.ScriptComponent {
  constructor() {
    super();
    this.m4 = mat4.create();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
    this.color_after_life = color4.new(0.882, 0, 0, 1);
  }

  tick() {
    if (this.ended) return;
    // engine-TODO: bounding box scaling
    this.model._node.getWorldRT(this.m4);
    box.setTransform(this.model._boundingBox, this.m4, this.model._bbModelSpace);
    vec3.mul(this.model._boundingBox.size, this.model._bbModelSpace.size, this.model._node.lscale);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      for (let i = 0; i < this._app.scene._models.length; i++)
        // exporter-TODO: define unlit USE_COLOR
        this._app.scene._models.data[i]._effect.setProperty('color', this.color_after_life);

      // cc.game.loadScene(this.level);
      // this.player.getComp('game.FPCamera').game_over();
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
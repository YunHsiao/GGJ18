const { mat4, vec3, color4 } = cc.math;
const { box, intersect } = cc.geometry;

export default class Portal extends cc.ScriptComponent {
  constructor() {
    super();
    this.m4 = mat4.create();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
    this.mst = this.monster.getComp('game.Monster');
    this.color_after_life = color4.new(0.882, 0, 0, 1);
  }

  tick() {
    if (this.ended) return;
    // engine-TODO: bounding box scaling
    this.model._node.getWorldRT(this.m4);
    box.setTransform(this.model._boundingBox, this.m4, this.model._bbModelSpace);
    vec3.mul(this.model._boundingBox.size, this.model._bbModelSpace.size, this.model._node.lscale);
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      // exporter-TODO: define unlit USE_COLOR
      for (let i = 0; i < this._app.scene._models.length; i++)
        this._app.scene._models.data[i]._effect.setProperty('color', this.color_after_life);
      this.player.getComp('game.FPCamera').speed = this.mst.speed;
      this.ended = true;
      this._entity.getComp('AudioSource').play();
      cc.game.over = true;
      setTimeout((function(){
        this.mst.disappear();
        vec3.set(this.monster.lpos, this._entity.lpos.x + this.mst.pursuitDist - 1, 
          this._entity.lpos.y, this._entity.lpos.z);
      }).bind(this), 10000);
    }
  }
}

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
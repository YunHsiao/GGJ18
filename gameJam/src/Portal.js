const { cc } = window;
const { quat, vec3, color4 } = cc.math;
const { box, intersect } = cc.geometry;

export default class Portal extends cc.ScriptComponent {
  constructor() {
    super();
    this.v3 = vec3.zero();
    this.qt = quat.create();
    this.v3_2 = vec3.zero();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
    this.model._node._getWorldPRS(this.v3, this.qt, this.v3_2);
    box.setTransform(this.model._boundingBox, this.v3, this.qt, this.v3_2, this.model._bbModelSpace);
    this.mst = this.monster.getComp('game.Monster');
    this.color_after_life = color4.new(0.882, 0, 0, 1);
    this.count = 0;
  }

  tick() {
    if (this.ended) return;
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
        vec3.set(this.monster.lpos, this.player.lpos.x, 
          this.player.lpos.y + this.mst.pursuitDist - 1, this.player.lpos.z);
      }).bind(this), 5000);
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
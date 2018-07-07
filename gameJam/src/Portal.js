const { intersect } = cc.geometry;

export default class Portal extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this.model = this._entity.getComp('Model')._models[0];
  }

  tick() {
    if (this.ended) return;
    if (intersect.box_point(this.model._boundingBox, this.player.lpos)) {
      cc.game.loadScene(this.level);
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
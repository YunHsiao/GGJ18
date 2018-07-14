const { cc } = window;

// always remember to 'apply changes to prefab', or it won't work
export default class Hidden extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this._entity.getComp('Model').onDisable();
  }

  tick() {
    if (this.ended) return;
    if (cc.game.over) {
      this._entity.getComp('Model').onEnable();
      this.ended = true;
    }
  }
}

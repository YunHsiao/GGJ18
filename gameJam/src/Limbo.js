const { color4 } = cc.math;

export default class Limbo extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this.counter = 0;
  }

  tick() {
    if (this.ended) return;
    if (this._app._input.keyup('Enter')) this._end();
    if (this.counter < 6) {
      this.counter += 0.01;
    } else this._end();
  }

  _end() {
    cc.game.loadScene('logo');
    this.ended = true;
  }
}

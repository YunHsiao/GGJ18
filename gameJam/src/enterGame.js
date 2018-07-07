export default class EnterGame extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    // todo: register button event
    console.log(`test for EnterGame ${this.test}`);
    this.btn.on('clicked', () => {
      this._enterGame();
    });
  }

  _enterGame() {
    cc.game.loadScene('game');
  }
}

EnterGame.schema = {
  test: {
    type: 'number'
  },

  btn: {
    type: 'entity'
  }
};
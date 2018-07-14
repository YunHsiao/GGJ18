const { cc } = window;
const { color4 } = cc.math;

export default class Logo extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this.c = color4.create();
    this.t1 = this.logo.getComp('Image');
    this.t2 = this.intro1.getComp('Image');
    this.t3 = this.intro2.getComp('Image');
    this.t1.color = color4.set(this.c, this.t1.color.r, this.t1.color.g, this.t1.color.b, 0);
    this.t2.color = color4.set(this.c, this.t2.color.r, this.t2.color.g, this.t2.color.b, 0);
    this.t3.color = color4.set(this.c, this.t3.color.r, this.t3.color.g, this.t3.color.b, 0);
    this.a = 0;
  }

  tick() {
    if (this.ended) return;
    if (this._app._input.keyup('Enter')) this._end();
    if (this.t1.color.a < 1) {
      this.t1.color = color4.set(this.c, this.t1.color.r, this.t1.color.g, this.t1.color.b, this.t1.color.a + 0.01);
    } else if (this.t2.color.a < 1) {
      if (this.a < 1) { this.a += 0.01; return; }
      this.t2.color = color4.set(this.c, this.t2.color.r, this.t2.color.g, this.t2.color.b, this.t2.color.a + 0.01);
    } else if (this.t3.color.a < 1) {
      if (this.a < 2) { this.a += 0.01; return; }
      this.t3.color = color4.set(this.c, this.t3.color.r, this.t3.color.g, this.t3.color.b, this.t3.color.a + 0.01);
    } else {
      if (this.a < 3) { this.a += 0.01; return; }
      this._end();
    }
  }

  _end() {
    cc.game.loadScene('main');
    this.ended = true;
  }
}

Logo.schema = {
  logo: {
    type: 'entity',
    default: null
  },

  intro1: {
    type: 'entity',
    default: null
  },

  intro2: {
    type: 'entity',
    default: null
  }
};
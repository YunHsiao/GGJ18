const { cc } = window;
const { vec2, color4 } = cc.math;

export default class Maze extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    this.models = this._entity.getCompsInChildren('Model');
    this.time = 0;
    this.borderMax = 0.05;
    this.border = vec2.new(this.borderMax, this.borderMax);
    this.color = color4.create();
    this.intensity = 1;
    if (!this._app._forward._programLib.hasProgram('binary')) {
      const programUrls = {
        name: 'binary',
        json: './materials/binary.json',
        vert: './materials/binary.vert',
        frag: './materials/binary.frag',
      };
      this._app.assets.loadUrls('program', programUrls);
    }
    const effectUrls = { json: './materials/BinaryEffect.json' };
    this._app.assets.loadUrls('effect', effectUrls, (err, effect) => {
      for (let i = 0; i < this.models.length; i++) {
        let m = new cc.Material(); m.effect = effect;
        m.define('USE_COLOR', true);
        m.setProperty('border', this.border);
        this.models[i].material = m;
      }
    });
  }

  setProperty(name, prop) {
    for (let i = 0; i < this.models.length; i++) {
      this.models[i].material.setProperty(name, prop);
    }
  }

  tick() {
    if (!this.models) return;
    this.time += this._app.deltaTime * 5;
    let margin = this.time > Math.PI ? 1 :
      Math.abs(Math.cos(this.time) * this.intensity + 1 - this.intensity);
    vec2.set(this.border, this.borderMax * margin, this.borderMax * margin);
    color4.set(this.color, 1, margin, margin);
    this.setProperty('border', this.border);
    this.setProperty('color', this.color);
  }

  heartBeat(intensity) {
    this.time = 0;
    this.intensity = intensity;
  }
}

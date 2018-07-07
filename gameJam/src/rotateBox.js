export default class RotateBox extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    console.log(`Rotation speed is ${this.speed}`);
  }

  tick() {
    cc.math.quat.rotateY(this._entity.lrot,this._entity.lrot, this.speed * this._app.deltaTime);
  }
}

RotateBox.schema = {
  speed: {
    type: 'number',
    default: 1
  }
};
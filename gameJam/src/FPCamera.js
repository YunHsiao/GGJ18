const { cc } = window;
const { vec2, vec3, quat, clamp, randomRange } = cc.math;

let isZeroVector = function(v) {
  return !Math.abs(v.x) && !Math.abs(v.y) && !Math.abs(v.z);
};

let scaleToXZ = function(v, scale = 1) {
  let x = v.x, z = v.z, s = scale / Math.sqrt(x * x + z * z);
  v.x *= s; v.y = 0; v.z *= s;
};

export default class FPCamera extends cc.ScriptComponent {
  constructor() {
    super();
    this.id_forward = vec3.new(0, 0, 1);
    this.id_right = vec3.new(1, 0, 0);
    this.forward = vec3.new(0, 0, 1);
    this.right = vec3.new(1, 0, 0);
    this.euler = vec3.new(0, 0, 0);
    this.posOff = vec3.zero();
    this.rotOff = vec2.zero();
    this.speed = 1;
    this.lastTime = 0;
    this.id_up = vec3.new(0, this.speed, 0);
  }

  start() {
    this.pos = this._entity.lpos;
    this.spawn = vec3.clone(this._entity.lpos);
    this.rot = this._entity.lrot;
    this.input = this._app._input;
    this.input._lock = cc.input.LOCK_ALWAYS;
    this.footsteps = this._entity.getCompsInChildren('AudioSource');
    this.enableCollision = true;
    this.col = this._entity.getComp('Collider');
    if (!this.col) return;
    this.col.collider.setUpdateMode({in: true, out: true});
    this.col.collider.setFixedRotation(true);
    this.canvas = this._app._device._gl.canvas;
  }

  tick() {
    // do nothing if no inputs or already ended
    if (this.ended || !this.input._pointerLocked
      && !this.input.touchCount && !this.input.hasKeyDown) return;
    // drag player back if (accidentally) fall off
    if (this.pos.y < -25) vec3.copy(this.pos, this.spawn);
    // update utils
    scaleToXZ(vec3.transformQuat(this.forward, this.id_forward, this.rot), this.speed);
    scaleToXZ(vec3.transformQuat(this.right, this.id_right, this.rot), this.speed);
    vec3.set(this.posOff, 0, 0, 0); vec2.set(this.rotOff, 0, 0);
    // gather inputs
    if (this.input.touchCount) this.tickTouch();
    if (this.input._pointerLocked) this.tickMouse();
    if (this.input.hasKeyDown) this.tickKeyboard();
    // apply to transform
    vec3.set(this.euler, clamp(this.euler.x + this.rotOff.x, -90, 90), this.euler.y + this.rotOff.y, 0);
    quat.fromEuler(this.rot, this.euler.x, this.euler.y, this.euler.z);
    if (isZeroVector(this.posOff)) return;
    vec3.add(this.pos, this.pos, this.posOff);
    // play footsteps
    if (this._app.totalTime - this.lastTime > 0.5 && this.footsteps.length) {
      this.lastTime = this._app.totalTime;
      this.footsteps[Math.floor(randomRange(0, this.footsteps.length-0.5))].play();
    }
  }

  tickMouse() {
    this.rotOff.x = -this.input.mouseDeltaY;
    this.rotOff.y = -this.input.mouseDeltaX;
  }

  tickKeyboard() {
    if (this.input.keypress('w')) vec3.sub(this.posOff, this.posOff, this.forward);
    if (this.input.keypress('s')) vec3.add(this.posOff, this.posOff, this.forward);
    if (this.input.keypress('a')) vec3.sub(this.posOff, this.posOff, this.right);
    if (this.input.keypress('d')) vec3.add(this.posOff, this.posOff, this.right);
    if (this.input.keypress('q')) vec3.sub(this.posOff, this.posOff, this.id_up);
    if (this.input.keypress('e')) vec3.add(this.posOff, this.posOff, this.id_up);
    if (this.input.keydown('f') && this.col) this.toggleCollision();
  }

  tickTouch() {
    for (let i = 0; i < this.input.touchCount; i++) {
      let touch = this.input.getTouchInfo(i);
      if (touch.x > this.canvas.width * 0.4) { // rotation
        this.rotOff.x = touch.dy;
        this.rotOff.y = -touch.dx;
      } else { //position
        if (touch._phase === cc.input.TOUCH_START) {
          touch.initX = touch.x;
          touch.initY = touch.y;
        }
        vec3.scale(this.forward, this.forward, clamp((touch.y - touch.initY) * 0.01, -1, 1));
        vec3.scale(this.right, this.right, clamp((touch.x - touch.initX) * 0.01, -1, 1));
        vec3.sub(this.posOff, this.posOff, this.forward);
        vec3.add(this.posOff, this.posOff, this.right);
      }
    }
  }

  toggleCollision() {
    this.enableCollision = !this.enableCollision;
    this.col.collider.setUpdateMode({in: true, out: this.enableCollision});
  }

  game_over() {
    this.ended = true;
    this._entity.getComp('AudioSource').stop();
  }
}

const { cc } = window;
const { vec3, quat, clamp, randomRange } = cc.math;

export default class FPCamera extends cc.ScriptComponent {
  constructor() {
    super();
    this.id_forward = vec3.new(0, 0, 1);
    this.id_right = vec3.new(1, 0, 0);
    this.forward = vec3.new(0, 0, 1);
    this.right = vec3.new(1, 0, 0);
    this.euler = vec3.new(0, 0, 0);
    this.temp = vec3.zero();
    this.counter = 0;
    this.speed = 1;
  }

  start() {
    this.pos = this._entity.lpos;
    this.rot = this._entity.lrot;
    this.cd = this._entity.getComp('player.CollisionDetector');
    this.input = this._app._input;
    this.input._lock = cc.input.LOCK_ALWAYS;
    this.footsteps = this._entity.getCompsInChildren('AudioSource');
  }

  tick() {
    if (this.ended || !this.input._pointerLocked) return;
    vec3.set(this.euler, clamp(this.euler.x - this.input.mouseDeltaY, -90, 90), this.euler.y - this.input.mouseDeltaX, 0);
    quat.fromEuler(this.rot, this.euler.x, this.euler.y, this.euler.z);
    vec3.scale(this.forward, vec3.transformQuat(this.forward, this.id_forward, this.rot), this.speed);
    vec3.scale(this.right, vec3.transformQuat(this.right, this.id_right, this.rot), this.speed);
    vec3.copy(this.temp, this.pos);
    if (this.input.keypress('w')) vec3.set(this.temp, this.temp.x - this.forward.x, this.temp.y, this.temp.z - this.forward.z);
    if (this.input.keypress('s')) vec3.set(this.temp, this.temp.x + this.forward.x, this.temp.y, this.temp.z + this.forward.z);
    if (this.input.keypress('d')) vec3.set(this.temp, this.temp.x + this.right.x, this.temp.y, this.temp.z + this.right.z);
    if (this.input.keypress('a')) vec3.set(this.temp, this.temp.x - this.right.x, this.temp.y, this.temp.z - this.right.z);
    if (this.input.keypress('e')) vec3.set(this.temp, this.temp.x, this.temp.y + 1, this.temp.z);
    if (this.input.keypress('q')) vec3.set(this.temp, this.temp.x, this.temp.y - 1, this.temp.z);
    if (vec3.equals(this.temp, this.pos)) return;
    if (this.counter++ % (30/this.speed) == 0 && this.footsteps.length)
      this.footsteps[Math.floor(randomRange(0, this.footsteps.length-0.5))].play();
    if (this.cd && this.cd.check(this.temp)) vec3.copy(this.pos, this.temp);
  }

  game_over() {
    this.ended = true;
    this._entity.getComp('AudioSource').stop();
  }
}

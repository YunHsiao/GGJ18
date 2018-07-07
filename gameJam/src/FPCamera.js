const { vec3, quat } = cc.math;

const KEY_NONE = 0;
const KEY_UP = 3;

export default class FPCamera extends cc.ScriptComponent {
  constructor() {
    super();
    this.id_forward = vec3.new(0, 0, 0.1);
    this.id_right = vec3.new(0.1, 0, 0);
    this.forward = vec3.new(0, 0, 1);
    this.right = vec3.new(1, 0, 0);
    this.euler = vec3.new(0, 0, 0);
  }

  tick() {
    vec3.set(this.euler, this.euler.x - this.input.mouseDeltaY, this.euler.y - this.input.mouseDeltaX, 0);
    quat.fromEuler(this.rot, this.euler.x, this.euler.y, this.euler.z);
    vec3.transformQuat(this.forward, this.id_forward, this.rot);
    vec3.transformQuat(this.right, this.id_right, this.rot);
    if (this.input.keypress('w')) vec3.set(this.pos, this.pos.x - this.forward.x, this.pos.y, this.pos.z - this.forward.z);
    if (this.input.keypress('s')) vec3.set(this.pos, this.pos.x + this.forward.x, this.pos.y, this.pos.z + this.forward.z);
    if (this.input.keypress('d')) vec3.set(this.pos, this.pos.x + this.right.x, this.pos.y, this.pos.z + this.right.z);
    if (this.input.keypress('a')) vec3.set(this.pos, this.pos.x - this.right.x, this.pos.y, this.pos.z - this.right.z);
  }

  start() {
    this.pos = this._entity.lpos;
    this.rot = this._entity.lrot;
    this.input = this._app._input;
    this.input._lock = true;

// monkey patching...

    this.input._uninstallGlobalEvents = (function() {
      if (!this._globalEventInstalled) {
        return;
      }
      // if we have mouse key pressed, skip it
      if (
        (this._mouse.left !== KEY_NONE && this._mouse.left !== KEY_UP) ||
        (this._mouse.right !== KEY_NONE && this._mouse.right !== KEY_UP) ||
        (this._mouse.middle !== KEY_NONE && this._mouse.middle !== KEY_UP)
      ) {
        return;
      }
      // unlock mouse here
      // this._lockPointer(false);
      // if we are grabbing mouse, skip it
      if (this._mouseGrabbed) {
        return;
      }
      document.removeEventListener('mouseup', this._mouseupHandle);
      document.removeEventListener('mousemove', this._mousemoveHandle);
      document.removeEventListener('mousewheel', this._mousewheelHandle, { passive: true });
      if (this._useMask) {
        _dragMask.remove();
      }
      this._globalEventInstalled = false;
    }).bind(this.input);
  }

  postTick() {
    this.input._element.requestPointerLock();
  }
}
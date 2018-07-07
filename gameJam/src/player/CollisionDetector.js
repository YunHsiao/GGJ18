export default class CollisionDetector extends cc.ScriptComponent {
  constructor() {
    super();
    this.testSphere = cc.geometry.sphere.create();
    this.footSphere = cc.geometry.sphere.create();
    this.wPos = cc.math.vec3.zero();
    this.upstair = false;
    this.preStepPos = cc.math.vec3.zero();
    this.lastStair = null;
  }

  start() {
    // let meshes = this._entity.getComps('Model')[0]._mesh;
    // let min = cc.math.vec3.new(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    // let max = cc.math.vec3.new(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    // if (meshes._minPos.x < min.x) {
    //   min.x = meshes._minPos.x;
    // }
    // if (meshes._minPos.y < min.y) {
    //   min.y = meshes._minPos.y;
    // }
    // if (meshes._minPos.z < min.z) {
    //   min.z = meshes._minPos.z;
    // }
    // if (meshes._maxPos.x > max.x) {
    //   max.x = meshes._maxPos.x;
    // }
    // if (meshes._maxPos.y > max.y) {
    //   max.y = meshes._maxPos.y;
    // }
    // if (meshes._maxPos.z > max.z) {
    //   max.z = meshes._maxPos.z;
    // }
    // let center = cc.math.vec3.zero();
    // cc.math.vec3.add(center, min, max);
    // cc.math.vec3.scale(center, center, 0.5);
    this._entity.getWorldPos(this.wPos);
    // this.sphereCollider=cc.geometry.sphere.new(center.x,center.y,center.z,cc.math.vec3.distance(center,max));
    this.sphereCollider = cc.geometry.sphere.new(this.wPos.x, this.wPos.y, this.wPos.z, 5);
    cc.math.vec3.copy(this.footSphere.c, this.sphereCollider.c);
    this.footSphere.r = 0.05;
  }

  forward(dir) {
    cc.math.vec3.set(this.footSphere.c, this.sphereCollider.c.x, this.sphereCollider.c.y - this.sphereCollider.r, this.sphereCollider.c.z);
    cc.geometry.sphere.set(this.testSphere, this.sphereCollider.c.x, this.sphereCollider.c.y, this.sphereCollider.c.z, this.sphereCollider.r);
    cc.math.vec3.add(this.testSphere.c, this.testSphere.c, dir);
    let models = this._app.activeLevel.getCompsInChildren('Model');
    let stepping = false;
    let onLand = false;
    models.forEach(element => {
      if (element == this._entity.getComps('Model')[0])
        return;
      element._models.forEach(m => {
        if (m._boundingBox == null)
          return;
        if (element._entity.name === 'wall') {
          console.log('');
        }
        if (cc.geometry.intersect.sphere_box(this.testSphere, m._boundingBox)) {
          onLand = true;
          if (element._entity.name === 'wall') {
            cc.math.vec3.set(this.testSphere.c, this.sphereCollider.c.x, this.testSphere.c.y, this.sphereCollider.c.z);
          }
          else if (element._entity.name === 'floor') {
            this.testSphere.c.y = m._boundingBox.center.y + m._boundingBox.size.y + this.sphereCollider.r;
          }
          else if (element._entity.name == 'stair') {
            stepping = true;
            if (!cc.geometry.intersect.sphere_box(this.footSphere, m._boundingBox)) {
              if (!this.upstair) {
                this.upstair = true;
                cc.math.vec3.copy(this.preStepPos, this.sphereCollider.c);
              }
              let destY = m._boundingBox.center.y + m._boundingBox.size.y + this.sphereCollider.r;
              let navDir = cc.math.vec3.new(m._boundingBox.center.x, destY, m._boundingBox.center.z);
              let dX = navDir.x - this.sphereCollider.c.x;
              let dZ = navDir.z - this.sphereCollider.c.z;
              if (Math.sqrt(dX * dX + dZ * dZ) < 0.1) {
                this.upstair = false;
                cc.math.vec3.copy(this.testSphere.c, navDir);
                return;
              }
              cc.math.vec3.subtract(navDir, navDir, this.preStepPos);
              cc.math.vec3.normalize(navDir, navDir);
              let speed = cc.math.vec3.dot(navDir, dir);
              cc.math.vec3.scale(navDir, navDir, speed);
              cc.math.vec3.add(this.testSphere.c, this.testSphere.c, navDir);
            }
            else {
              this.lastStair = m._boundingBox;
            }
          }
        }
      });
    });
    if (stepping && !this.upstair) {
      cc.math.vec3.set(this.testSphere.c, this.testSphere.c.x + dir.x, this.testSphere.c.y, this.testSphere.c.z + dir.z);
    }
    if (!onLand) {
      if (Math.abs(dir.x) > Math.abs(dir.z)) {
        let sgn = Math.sign(dir.x);
        this.testSphere.c.x = this.lastStair.center.x + sgn * this.lastStair.size.x + sgn * this.sphereCollider.r;
      }
      else {
        let sgn = Math.sign(dir.z);
        this.testSphere.c.z = this.lastStair.center.z + sgn * this.lastStair.size.z + sgn * this.sphereCollider.r;
      }
      this.testSphere.c.y = this.lastStair.center.y + this.sphereCollider.r - this.lastStair.size.y;
    }
    this._entity.setWorldPos(this.testSphere.c);
  }

  tick() {
    this._entity.getWorldPos(this.wPos);
    cc.math.vec3.copy(this.sphereCollider.c, this.wPos);
    let ydir = cc.math.vec3.new(0.01, -0.01, 0);
    this.forward(ydir);
  }
}
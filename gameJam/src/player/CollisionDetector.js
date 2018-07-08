export default class CollisionDetector extends cc.ScriptComponent {
  constructor() {
    super();
    // this.testSphere = cc.geometry.sphere.create();
    // this.footSphere = cc.geometry.sphere.create();
    this.wPos = cc.math.vec3.zero();
    // this.upstair = false;
    // this.preStepPos = cc.math.vec3.zero();
    // this.lastStair = null;
    this.collisionPoint = cc.math.vec3.zero();
    this.checkFloorRay = cc.geometry.ray.create();
    this.checkWallRay1 = cc.geometry.ray.create();
    this.checkWallRay2 = cc.geometry.ray.create();
    this.checkWallRay3 = cc.geometry.ray.create();
    this.checkWallRay4 = cc.geometry.ray.create();
    this.disable = false;
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
    // this._entity.getWorldPos(this.wPos);
    // this.sphereCollider=cc.geometry.sphere.new(center.x,center.y,center.z,cc.math.vec3.distance(center,max));
    // this.sphereCollider = cc.geometry.sphere.new(this.wPos.x, this.wPos.y, this.wPos.z, 5);
    // cc.math.vec3.copy(this.footSphere.c, this.sphereCollider.c);
    // this.footSphere.r = 0.05;
  }

  check(pos) {
    // cc.math.vec3.set(this.footSphere.c, this.sphereCollider.c.x, this.sphereCollider.c.y - this.sphereCollider.r, this.sphereCollider.c.z);
    // cc.geometry.sphere.set(this.testSphere, this.sphereCollider.c.x, this.sphereCollider.c.y, this.sphereCollider.c.z, this.sphereCollider.r);
    // cc.math.vec3.add(this.testSphere.c, this.testSphere.c, dir);
    // let models = this._app.activeLevel.getCompsInChildren('Model');
    // let stepping = false;
    // let onLand = false;
    // models.forEach(element => {
    //   if (element == this._entity.getComps('Model')[0])
    //     return;
    //   element._models.forEach(m => {
    //     if (m._boundingBox == null)
    //       return;
    //     if (element._entity.name === 'wall') {
    //       console.log('');
    //     }
    //     if (cc.geometry.intersect.sphere_box(this.testSphere, m._boundingBox)) {
    //       onLand = true;
    //       if (element._entity.name === 'wall') {
    //         cc.math.vec3.set(this.testSphere.c, this.sphereCollider.c.x, this.testSphere.c.y, this.sphereCollider.c.z);
    //       }
    //       else if (element._entity.name === 'floor') {
    //         this.testSphere.c.y = m._boundingBox.center.y + m._boundingBox.size.y + this.sphereCollider.r;
    //       }
    //       else if (element._entity.name == 'stair') {
    //         stepping = true;
    //         if (!cc.geometry.intersect.sphere_box(this.footSphere, m._boundingBox)) {
    //           if (!this.upstair) {
    //             this.upstair = true;
    //             cc.math.vec3.copy(this.preStepPos, this.sphereCollider.c);
    //           }
    //           let destY = m._boundingBox.center.y + m._boundingBox.size.y + this.sphereCollider.r;
    //           let navDir = cc.math.vec3.new(m._boundingBox.center.x, destY, m._boundingBox.center.z);
    //           let dX = navDir.x - this.sphereCollider.c.x;
    //           let dZ = navDir.z - this.sphereCollider.c.z;
    //           if (Math.sqrt(dX * dX + dZ * dZ) < 0.1) {
    //             this.upstair = false;
    //             cc.math.vec3.copy(this.testSphere.c, navDir);
    //             return;
    //           }
    //           cc.math.vec3.subtract(navDir, navDir, this.preStepPos);
    //           cc.math.vec3.normalize(navDir, navDir);
    //           let speed = cc.math.vec3.dot(navDir, dir);
    //           cc.math.vec3.scale(navDir, navDir, speed);
    //           cc.math.vec3.add(this.testSphere.c, this.testSphere.c, navDir);
    //         }
    //         else {
    //           this.lastStair = m._boundingBox;
    //         }
    //       }
    //     }
    //   });
    // });
    // if (stepping && !this.upstair) {
    //   cc.math.vec3.set(this.testSphere.c, this.testSphere.c.x + dir.x, this.testSphere.c.y, this.testSphere.c.z + dir.z);
    // }
    // if (!onLand) {
    //   if (Math.abs(dir.x) > Math.abs(dir.z)) {
    //     let sgn = Math.sign(dir.x);
    //     this.testSphere.c.x = this.lastStair.center.x + sgn * this.lastStair.size.x + sgn * this.sphereCollider.r;
    //   }
    //   else {
    //     let sgn = Math.sign(dir.z);
    //     this.testSphere.c.z = this.lastStair.center.z + sgn * this.lastStair.size.z + sgn * this.sphereCollider.r;
    //   }
    //   this.testSphere.c.y = this.lastStair.center.y + this.sphereCollider.r - this.lastStair.size.y;
    // }
    // this._entity.setWorldPos(this.testSphere.c);
    if (this.disable)
      return true;
    cc.geometry.ray.set(this.checkFloorRay, pos.x, pos.y, pos.z, 0, -1, 0);
    cc.geometry.ray.set(this.checkWallRay1, pos.x, pos.y, pos.z, 1, 0, 0);
    cc.geometry.ray.set(this.checkWallRay2, pos.x, pos.y, pos.z, -1, 0, 0);
    cc.geometry.ray.set(this.checkWallRay3, pos.x, pos.y, pos.z, 0, 0, 1);
    cc.geometry.ray.set(this.checkWallRay4, pos.x, pos.y, pos.z, 0, 0, -1);
    let models = this._app.activeLevel.getCompsInChildren('Model');
    let ret = true;
    let posX = Number.MAX_VALUE;
    let negX = -Number.MAX_VALUE;
    let y = -Number.MAX_VALUE;
    let posZ = Number.MAX_VALUE;
    let negZ = -Number.MAX_VALUE;
    // console.log('-----------------------');
    models.forEach(element => {
      element._models.forEach(m => {
        if (m._boundingBox == null)
          return;
        if (!this.needCheck(m._boundingBox, pos))
          return;
        if (m._boundingBox.size.y < this._wallHeight / 2) {
          // if(m._node.name==='zhongji02_migong666_Plane866')
          //   console.log('');
          if (cc.geometry.intersect.ray_box(this.checkFloorRay, m._boundingBox, this.collisionPoint)) {
            if (y < this.collisionPoint.y) {
              y = this.collisionPoint.y;
              // console.log('x:'+this.checkFloorRay.o.x+' z:'+this.checkFloorRay.o.z+' y:'+y+' object:'+m._node.name);
            }
          }
        }
        else {
          if (cc.geometry.intersect.ray_box(this.checkWallRay1, m._boundingBox, this.collisionPoint)) {
            if (posX > this.collisionPoint.x) {
              posX = this.collisionPoint.x;
            }
          }
          if (cc.geometry.intersect.ray_box(this.checkWallRay2, m._boundingBox, this.collisionPoint)) {
            if (negX < this.collisionPoint.x) {
              negX = this.collisionPoint.x;
            }
          }
          if (cc.geometry.intersect.ray_box(this.checkWallRay3, m._boundingBox, this.collisionPoint)) {
            if (posZ > this.collisionPoint.z) {
              posZ = this.collisionPoint.z;
            }
          }
          if (cc.geometry.intersect.ray_box(this.checkWallRay4, m._boundingBox, this.collisionPoint)) {
            if (negZ < this.collisionPoint.z) {
              negZ = this.collisionPoint.z;
            }
          }
        }
      });
    });
    if (posX < Number.MAX_VALUE && Math.abs(this._width - (posX - pos.x)) < this._epsilon) {
      pos.x = pos.x - (this._width+this._epsilon);
      // ret = false;
    }
    if (negX > -Number.MAX_VALUE && Math.abs(this._width - (pos.x - negX)) < this._epsilon) {
      pos.x = pos.x + (this._width+this._epsilon);
      // ret = false;
    }
    if (y > -Number.MAX_VALUE && Math.abs(pos.y - y - this._height) > this._epsilon) {
      pos.y = y + this._height;
      ret = true;
    }
    if (posZ < Number.MAX_VALUE && Math.abs(this._width - (posZ - pos.z)) < this._epsilon) {
      pos.z = pos.z - (this._width+this._epsilon);
      // ret = false;
    }
    if (negZ > -Number.MAX_VALUE && Math.abs(this._width - (pos.z - negZ)) < this._epsilon) {
      pos.z = pos.z + (this._width+this._epsilon);
      // ret = false;
    }
    return ret;
  }


  needCheck(box, pos) {
    if (Math.abs(box.center.x - pos.x) <= this._width + box.size.x + this._epsilon) {
      return true;
    }
    if (pos.y > box.center.y) {
      return true;
    }
    if (Math.abs(box.center.z - pos.z) <= this._width + box.size.z + this._epsilon) {
      return true;
    }
    return false;
  }

  tick() {
    if (this._app._input.keyup('f')) {
      this.disable = !this.disable;
    }
  }
}


CollisionDetector.schema = {
  height: {
    type: 'number',
    default: 4
  },
  width: {
    type: 'number',
    default: 1
  },
  wallHeight: {
    type: 'number',
    default: 5
  },
  epsilon: {
    type: 'number',
    default: 0.1
  }
}
import * as THREE from "three";

export default class Branch {
  pos: THREE.Vector3;
  parent: Branch;
  dir: THREE.Vector3;
  length: number;
  count: number;
  origDir: THREE.Vector3;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  line: THREE.LineSegments;
  constructor({
    pos,
    parent,
    dir,
  }: {
    pos: THREE.Vector3;
    parent: Branch;
    dir: THREE.Vector3;
  }) {
    this.pos = pos;
    this.parent = parent;
    this.dir = dir;
    this.length = 1;
    this.count = 0;
    this.origDir = dir.clone();
  }

  reset() {
    this.dir = this.origDir.clone();
    this.count = 0;
  }

  next() {
    const nextDir = this.dir.clone().multiplyScalar(this.length);
    // const nextDir = this.dir.clone();
    const nextPos = this.pos.clone().add(nextDir);
    return new Branch({
      pos: nextPos,
      parent: this,
      dir: this.dir.clone(),
      //   dir: nextDir,
    });
  }

  //   show(scene: THREE.Scene) {
  //     if (this.parent) {
  //       this.geometry = new THREE.BufferGeometry();
  //       this.geometry.setAttribute(
  //         "position",
  //         new THREE.BufferAttribute(
  //           new Float32Array([
  //             this.pos.x,
  //             this.pos.y,
  //             this.pos.z,
  //             this.parent.pos.x,
  //             this.parent.pos.y,
  //             this.parent.pos.z,
  //           ]),
  //           3
  //         )
  //       );
  //       this.geometry.setAttribute(
  //         "color",
  //         new THREE.BufferAttribute(new Float32Array([1, 1, 1, 1, 1, 1]), 3)
  //       );
  //       this.material = new THREE.LineBasicMaterial({
  //         vertexColors: true,
  //         transparent: true,
  //         blending: THREE.AdditiveBlending,
  //       });
  //       this.line = new THREE.LineSegments(this.geometry, this.material);
  //       scene.add(this.line);
  //     }
  //   }
}

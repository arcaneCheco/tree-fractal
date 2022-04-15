import * as THREE from "three";

export default class Branch {
  rootPos: THREE.Vector3;
  parentPos: Branch;
  dir: THREE.Vector3;
  length: number;
  count: number;
  origDir: THREE.Vector3;
  constructor({
    pos,
    parent,
    dir,
  }: {
    pos: THREE.Vector3;
    parent: Branch;
    dir: THREE.Vector3;
  }) {
    this.rootPos = pos;
    this.parentPos = parent;
    this.dir = dir;
    this.length = 2;
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
    const nextPos = this.rootPos.clone().add(nextDir);
    return new Branch({
      pos: nextPos,
      parent: this,
      dir: this.dir.clone(),
      //   dir: nextDir,
    });
  }
}

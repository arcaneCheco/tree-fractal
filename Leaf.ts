import * as THREE from "three";

export default class Leaf {
  pos: THREE.Vector3;
  reached: boolean;
  constructor(pos: THREE.Vector3) {
    this.pos = pos;
    this.reached = false;
  }
}

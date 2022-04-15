export default class Line {
  v1: THREE.Vector3;
  v2: THREE.Vector3;
  weight: number;
  constructor({
    v1,
    v2,
    weight,
  }: {
    v1: THREE.Vector3;
    v2: THREE.Vector3;
    weight?: number;
  }) {
    this.v1 = v1;
    this.v2 = v2;
    this.weight = weight ? weight : 1;
  }
}

declare module 'prng' {
  export default class PRNG {
    constructor(seed: number);
    rand(max: number): number;
  }
}

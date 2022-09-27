export default class Scheduler {
  //in seconds
  minInterval: number;
  //in seconds
  maxInterval: number;
  fn: () => Promise<boolean>;

  collisionCounter: number;

  constructor(fn: () => Promise<boolean>, minInterval: number, maxInterval: number) {
    this.fn = fn;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.collisionCounter = 0;
  }

  runFunction() {
    //set intervals here
    let nextBackoffTime = Math.pow(2, this.collisionCounter) - 1 + this.minInterval;

    if (nextBackoffTime < this.maxInterval) {
      this.setNewTimeout(nextBackoffTime);
    } else {
      this.setNewTimeout(this.maxInterval);
    }
  }

  setNewTimeout(time: number) {
    setTimeout(async () => {
      let success = await this.fn();
      this.collisionCounter = success ? 0 : this.collisionCounter + 1;
      this.runFunction();
    }, time * 1000);
  }
}

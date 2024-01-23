export class AnimationFunctioning<T> {
  begin: (() => AnimationFunctioning<T> | null) = () => { return this; };
  onUpdate: ((x: T) => void) | null = null;

  constructor(begin: (() => AnimationFunctioning<T> | null)) {
    this.begin = begin;
  }

  setUpdate(onUpdate: (x: T) => void): AnimationFunctioning<T> {
    this.onUpdate = onUpdate;
    return this;
  }
}

export class Animation {
  static fromTo(
    from: number,
    to: number,
    timeMs: number,
    intervalMs: number = 16
  ): AnimationFunctioning<number> {
    let functioning: AnimationFunctioning<number> | null = null;
    const _numberStart: (() => AnimationFunctioning<number> | null) = () => {
      const fromToDiff = to - from;
      const addByTimeInterval = fromToDiff / (timeMs / intervalMs);
      let time = 0;
      let number = 0;
      const interval = setInterval(() => {
        time += intervalMs;
        number += addByTimeInterval;
        if (number >= to)
        {
          clearInterval(interval);
          number = Math.round(number);
        }
        if (functioning != null && functioning?.onUpdate != null)
          functioning.onUpdate(number);
      }, intervalMs);
      return functioning;
    };
    functioning = new AnimationFunctioning<number>(_numberStart);
    return functioning;
  }
}
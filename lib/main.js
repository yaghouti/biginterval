const MAX_INTERVAL_TIME = Math.pow(2, 32) - 1;

class BigInterval {
  constructor(func, interval) {
    if (func !== undefined || interval !== undefined) {
      if (typeof func !== 'function') {
        throw Error('Invalid function!');
      }
      if (typeof interval !== 'number' || interval < 10) {
        throw Error('Invalid interval!');
      }

      let args = Array.from(arguments);
      if (args.length > 2) {
        args = args.slice(2);
      }
      this.set.bind(this, func, interval)(...args);
    }
  }

  set(func, interval) {
    if (this.intervalId) {
      throw Error('Interval has already been set!');
    }

    if (func !== undefined || interval !== undefined) {
      if (typeof func !== 'function') {
        throw Error('Invalid function!');
      }
      if (typeof interval !== 'number' || interval < 10) {
        throw Error('Invalid interval!');
      }
    }

    let args = Array.from(arguments);
    if (args.length > 2) {
      args = args.slice(2);
    }

    if (interval <= MAX_INTERVAL_TIME) {
      setSmallInterval.bind(this)(func, interval, args);
    }
    else {
      setBigInterval.bind(this)(func, interval, args);
    }
  }

  clear() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      delete this.intervalId;
    }
    else if (this.partialTimeoutId) {
      clearTimeout(this.partialTimeoutId);
      delete this.partialTimeoutId;
    }
  }
}

function setSmallInterval(func, interval, args) {
  this.intervalId = setInterval(func, interval, ...args);
}

function setBigInterval(func, interval, args) {
  runFuncInInterval.bind(this)(func, interval, args);
}

async function runFuncInInterval(func, interval, args) {
  do {
    await setBigTimeout.bind(this)(interval);
    if (this.partialTimeoutId) {
      func(...args);
    }
  }
  while (this.partialTimeoutId);
}

async function setBigTimeout(timeout) {
  while (timeout > MAX_INTERVAL_TIME) {
    await promisifySetTimeout.bind(this)(MAX_INTERVAL_TIME);
    timeout -= MAX_INTERVAL_TIME;
  }

  return promisifySetTimeout.bind(this)(timeout);
}

function promisifySetTimeout(timeout) {
  let self = this;
  return new Promise(function (resolve, reject) {
    self.partialTimeoutId = setTimeout(function () {
      resolve();
    }, timeout);
  });
}

module.exports = BigInterval;
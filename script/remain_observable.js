class Observable {
  constructor() {
    this.event = {};
    return new Proxy(this, {
      set: function (obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        if (obj.event[prop + '_onchanged']) {
          obj.event[prop + '_onchanged'].bind(obj)();
        }
        return true;
      }
    });
  }
}

class RemainObservable extends Observable {
  constructor(remain_onchanged) {
    super();
    this.event.remain_onchanged = remain_onchanged
  }
}
module.exports = RemainObservable;

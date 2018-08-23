'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (typeof vector != 'object' && vector.x === undefined && vector.y === undefined) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector')
    }
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  times(count) {
    return new Vector(count * this.x, count * this.y);
  }
}

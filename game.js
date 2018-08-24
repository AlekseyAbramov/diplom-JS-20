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

function isVector(vector) {
  if (typeof vector === 'object' && vector.x != undefined && vector.y != undefined) {
    return true;
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (isVector(pos) && isVector(size) && isVector(speed)) {
      this.pos = pos;
      this.size = size;
      this.speed = speed;
    } else {
      throw new Error('Класс Actor можно создавать только векторами типа Vector')
    }
    this.act = function() {};
    Object.defineProperty(this, 'left', {
      get: function() {
        return this.pos.x;
      }
    });
    Object.defineProperty(this, 'top', {
      get: function() {
        return this.pos.y + this.size.y;
      }
    });
    Object.defineProperty(this, 'right', {
      get: function() {
        return this.pos.x + this.size.x;
      }
    });
    Object.defineProperty(this, 'bottom', {
      get: function() {
        return this.pos.y;
      }
    });
    Object.defineProperty(this, 'type', {
      value: function() {
        return 'actor';
      }
    });
  }

  isIntersect(actor) {
    if(this === actor) {
      return false;
    } else if (actor.type != 'actor') {
        throw new Error('Можно сравнивать только объекты класса Actor');
    }
    return ( this.top <= actor.bottom || this.bottom >= actor.top || this.right <= actor.left || this.left >= actor.right );
  }
}

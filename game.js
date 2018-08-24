'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (isNotVector(vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  times(count) {
    return new Vector(count * this.x, count * this.y);
  }
}

function isNotVector(vector) {
  return (typeof vector != 'object' || !('x' in vector) || !('y' in vector) || !('plus' in vector) || !('times' in vector))
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (isNotVector(pos) || isNotVector(size) || isNotVector(speed)) {
      throw new Error('Класс Actor можно создавать только векторами типа Vector');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this.act = function() {};
    Object.defineProperty(this, 'left', {
      get: function() {
        return this.pos.x;
      }
    });
    Object.defineProperty(this, 'top', {
      get: function() {
        return this.pos.y;
      }
    });
    Object.defineProperty(this, 'right', {
      get: function() {
        return this.pos.x + this.size.x;
      }
    });
    Object.defineProperty(this, 'bottom', {
      get: function() {
        return this.pos.y + this.size.y;
      }
    });
    Object.defineProperty(this, 'type', {
      value: 'actor'
      }
    );
  }

  isIntersect(actor) {
    if(this === actor) {
      return false;
    } else if (actor.type != 'actor') {
        throw new Error('Можно сравнивать только объекты класса Actor');
    }
    return ( !(this.top < actor.bottom || this.bottom > actor.top || this.right < actor.left || this.left > actor.right) );
  }
}

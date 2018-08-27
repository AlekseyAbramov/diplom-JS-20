'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  times(count) {
    return new Vector(count * this.x, count * this.y);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error('Класс Actor можно создавать только векторами типа Vector');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
  }

  act() {}

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return 'actor';
  }

  isIntersect(actor) {
    if(this === actor) {
      return false;
    } else if (!(actor instanceof Actor)) {
        throw new Error('Можно сравнивать только объекты класса Actor');
    }
    //return ( !(this.left >= actor.left + actor.size.x || actor.left >= this.left + this.size.x || this.top >= actor.top + actor.size.y || actor.top >= this.top + this.size.y) );
    return ( !(this.left >= actor.right || actor.left >= this.right || this.top >= actor.bottom || actor.top >= this.bottom) );
  }
}

class Level {
  constructor(arrGrid = [], arrActors = []) {
    this.grid = arrGrid;
    this.actors = arrActors.filter(function(el) {
      return ('type' in el);
    });
    this.player = this.actors.find(actor => actor.type === 'player');
    this.height = this.grid.length;
    this.width = this.grid.reduce(function(memo, el) {
      if (el.length > memo) {
        memo = el.length;
      }
      return memo;
    }, 0);
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return (this.status != null && this.finishDelay < 0)
  }

  actorAt(actor = {}) {
    if (!(actor instanceof Actor)) {
      throw new Error('Можно сравнивать только объекты класса Actor');
    }
    return this.actors.find(function(el) {
      return el.isIntersect(actor);
    });
  }

  obstacleAt(pos, size) {
    if (!(pos instanceof Vector) || !(size instanceof Vector)) {
      throw new Error('В метод obstacleAt можно передавать только вектора типа Vector');
    }
    let obstacleActor = new Actor(pos, size, undefined);
    let border = this.grid.find(el => el.length === this.width);
    if(obstacleActor.top < this.grid.findIndex(el => el) || obstacleActor.left < border.findIndex(el => el) || obstacleActor.right > border.reverse().findIndex(el => el)) {
      return 'wall';
    } else if (obstacleActor.bottom > this.grid.reverse().findIndex(el => el)) {
      return 'lava;'
    } else if (this.actorAt(obstacleActor) != undefined) {
      return this.grid[pos.y][pos.x];
    } else {
      return undefined;
    }
  }
}

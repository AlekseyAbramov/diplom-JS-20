'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x =  x;
    this.y =  y;
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
    if (!(actor instanceof Actor)) {
        throw new Error('Можно сравнивать только объекты класса Actor');
    }
    if(this === actor) {
      return false;
    // else можно убрать, т.к. в if return
    // и проверки, которые бросают исключения лучше делать в начале. OK
    }
    //return ( !(this.left >= actor.left + actor.size.x || actor.left >= this.left + this.size.x || this.top >= actor.top + actor.size.y || actor.top >= this.top + this.size.y) );
    // можно внести отрицание в скобки,
    // для этого нужно заменить операторы на противоположные (>= на <, <= на >)
    // и || на &&. OK
    // скобки можно убрать :)
    return (this.left < actor.right && actor.left < this.right && this.top < actor.bottom && actor.top < this.bottom);
  }
}

class Level {
  constructor(arrGrid = [], arrActors = []) {
    this.grid = arrGrid;
    // непонятно зачем этот код. OK
    this.actors = arrActors;
    this.player = this.actors.find(actor => actor.type === 'player');
    this.height = this.grid.length;
    // можно написать короче, если использовать стелочную функцию
    // и тренарный оператор сравнения. OK
    // "memo =" не нужно
    this.width = this.grid.reduce((memo, el) => el.length > memo ? memo = el.length : memo, 0);
    //this.width = this.grid.reduce(function(memo, el) {
      //if (el.length > memo) {
        //memo = el.length;
      //}
      //return memo;
    //}, 0);
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    // скобки можно убрать. OK
    return this.status != null && this.finishDelay < 0;
  }

  actorAt(actor = {}) {
    if (!(actor instanceof Actor)) {
      throw new Error('Можно сравнивать только объекты класса Actor');
    }
    // со стрелочной функцией будет короче. OK
    return this.actors.find(el => el.isIntersect(actor));
  }

  obstacleAt(pos, size) {
    if (!(pos instanceof Vector) || !(size instanceof Vector)) {
      throw new Error('В метод obstacleAt можно передавать только вектора типа Vector');
    }

    // здесь можно обойтись без создания объекта
    // ведь он используется только для того,
    // чтобы сложить несколько чисел. OK
    // не объявляйте переменные через запятую, потом будет сложно править код
    const top = pos.y, bottom = pos.y + size.y, left = pos.x, right = pos.x + size.x;

    // тут какая-то проблема с логикой (возможно поэтому игра не работает)
    // алгоритм должен быть следующий:
    // найти клетки на которых находится объект
    // и проверить есть ли среди них клетки с препятствиями. OK
    if (bottom > this.height) {
      return 'lava';
    // else не нужен
    // округлить всё лучше один раз
    // округления у вас, кстати, неправильные :(
    } else if (Math.ceil(top) < 0 || Math.ceil(left) < 0 || Math.ceil(right) > this.width) {
      return 'wall';
    // else не нужен
    } else {
      for (let i = Math.ceil(top); i < Math.ceil(bottom); i++) {
        for (let j = Math.ceil(left); j < Math.ceil(right); j++) {
          // this.grid[i][j] лучше сохранить в переменную, чтобы не писать 2 раза
          // !== undefined по-моему можно тут убрат
          if (this.grid[i][j] !== undefined) {
            return this.grid[i][j];
          }
        }
      }
    }
  }

  removeActor(actor) {
    // для поиска индекса объекта есть более простой метод массива
    const index = this.actors.findIndex(actor => actor);
    // лучше всегда использовать === и !==. OK
    if (index !== -1) {
      this.actors.splice(index, 1);
    }
  }

  noMoreActors(title) {
    // тут лучше использовать метод массива,
    // который проверяет есть ли в нём элеметны
    // удовлетворяющие условию. OK
    return !this.actors.some(el => el.type === title);
  }

  playerTouched(title, actor = {}) {
    // тут можно написать if (this.status !== null) { return; }
    // это уменьшит вложенность. OK
    // не пишите фигурные скобки на одной строчке
    if (this.status !== null) { return; }

    // ===
    if (title == 'lava' || title == 'fireball') {
      this.status = 'lost';
      // третью часть проверки можно убрать
    } else if(title === 'coin' && actor.type === 'coin' && !this.noMoreActors(title)) {
      this.removeActor(actor);
      if (this.noMoreActors(title)) {
        this.status = 'won';
      }
    }
  }
}

class LevelParser {
  // здесь можно задать значение по-умолчанию. OK
  constructor(gameObjects = {}) {
    this.gameObjects = gameObjects;
  }

  // лишнее значение по-умолчанию. OK
  actorFromSymbol(symbol) {
    // лишняя проверка. OK
    return this.gameObjects[symbol];
  }

  obstacleFromSymbol(symbol) {
    if (symbol === 'x') {
      return 'wall';
    // else можно убрать
    } else if (symbol === '!') {
      return "lava";
    }
      // лишняя строчка
      // функция и так вернёт undefined, если не указано иное. OK
  }

  createGrid(plan) {
    return plan.map(element => element.split('').map(el => this.obstacleFromSymbol(el)));
  }

  createActors(plan) {
    // если значение присваивается переменной 1 раз,
    // то лучше использовать const. OK
    const actors = [];
    // если добавить в конструкторе значение по-умолчанию,
    // то эту проверку можно будет убрать. OK
    plan.forEach ((element, y) => {
      element.split('').forEach((el, x) => {
        // если значение присваивается переменной 1 раз,
        // то лучше использовать const. OK
        const classActor = this.actorFromSymbol(el);
        if (typeof classActor === 'function') {
          // если значение присваивается переменной 1 раз,
          // то лучше использовать const. OK
          const actor = new classActor(new Vector(x, y));
          if (actor instanceof Actor) {
            actors.push(actor);
          }
        }
      })
    });
    return actors;
  }

  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  // неправильные значения по-умолчаннию
  constructor(pos = undefined, speed = undefined) {
    // второй аргумент неправильный - размер огненного шара нам известен
    super(pos, undefined, speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
     return this.pos.plus(this.speed.times(time));
  }

  handleObstacle() {
    // мутация объекта Vector может привести к сложно находимым ошибкам
    // тут лушче использовать метод класса Vector. OK
    this.speed = this.speed.times(-1);
  }

  act(time, level) {
    if (level.obstacleAt(this.getNextPosition(time), this.size)) {
      this.handleObstacle();
    } else {
      this.pos = this.getNextPosition(time);
    }
  }
}

class HorizontalFireball extends Fireball {
  // неправильные значения по-умолчаннию
  constructor(pos = undefined) {
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  // неправильные значения по-умолчаннию
  constructor(pos = undefined) {
    super(pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  // неправильные значения по-умолчаннию
  constructor(pos = undefined) {
    super(pos, new Vector(0, 3));
    this.startPos = pos;
  }

  handleObstacle() {
    this.pos = this.startPos;
  }
}

class Coin extends Actor {
  // вот тут правильное
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * 2 * Math.PI;
    this.startPos = this.pos;
  }

  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.startPos.plus(this.getSpringVector());
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0));
  }

  get type() {
    return 'player';
  }
}

const schemas = [
  [
    '         ',
    '    =    ',
    '         ',
    '       o ',
    ' @    xxx',
    '         ',
    'xxx      ',
    '!!!!!!!!!'
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '!!!!!!!!!'
  ]
];
const actorDict = {
  '@': Player,
  'v': VerticalFireball,
  'o': Coin,
  '=': HorizontalFireball,
  '|': FireRain


};
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы  выиграли приз!'));

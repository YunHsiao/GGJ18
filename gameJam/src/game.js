import FPCamera from './FPCamera';
import CollisionDetector from './player/CollisionDetector';
import Portal from './Portal';
import Logo from './Logo';
import Monster from './Monster';
import Limbo from './Limbo';
import Hidden from './Hidden';
import Maze from './Maze';

const { cc } = window;
let _componentRegitstry = {
  'game.FPCamera': FPCamera,
  'player.CollisionDetector':CollisionDetector,
  'game.Portal': Portal,
  'game.Logo': Logo,
  'game.Monster': Monster,
  'game.Limbo': Limbo,
  'game.Hidden': Hidden,
  'game.Maze': Maze,
};

class Game extends cc.App {
  constructor(canvas, opts) {
    super(canvas, opts);
  }

  init() {
    for (let key in _componentRegitstry) {
      this.registerClass(key, _componentRegitstry[key]);
    }
  }

  loadScene(name) {
    this.assets.loadLevel(name, (err, level) => {
      if (err) {
        console.error(err);
      } else {
        this.loadLevel(level);
      }
    });
  }
}

export default { Game };
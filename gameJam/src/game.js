import FPCamera from './FPCamera';
import Portal from './Portal';
import Logo from './Logo';
import Monster from './Monster';
import Limbo from './Limbo';
import Hidden from './Hidden';
import Maze from './Maze';

const { cc } = window;
let _componentRegitstry = {
  'game.FPCamera': FPCamera,
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
    this.system('physics').world.setGravity(0, -500, 0);
    this.system('physics').world.defaultContactMaterial.contactEquationRelaxation = 2.2;
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
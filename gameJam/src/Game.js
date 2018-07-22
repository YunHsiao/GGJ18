import FPCamera from './FPCamera';
import Portal from './Portal';
import Logo from './Logo';
import Monster from './Monster';
import Limbo from './Limbo';
import Hidden from './Hidden';
import Maze from './Maze';

const { cc } = window;
let assetsDir = './assets';
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
    this.scenes = {};
  }

  init() {
    this.resize();
    for (let key in _componentRegitstry) {
      this.registerClass(key, _componentRegitstry[key]);
    }
    this.system('physics').world.setGravity(0, -500, 0);
    this.system('physics').world.defaultContactMaterial.contactEquationRelaxation = 2.2;
    cc.resl({
      manifest: {
        gameInfo: {
          type: 'text',
          parser: JSON.parse,
          src: `${assetsDir}/game.json`
        },
      },
      onDone(data) {
        cc.game.loadGameConfig(assetsDir, data.gameInfo);
        cc.game.loadScene('logo');
        cc.game.loadScene('main', true);
        cc.game.loadScene('limbo', true);
      }
    });
  }

  loadScene(name, justLoad) {
    if (this.scenes[name] && !justLoad)
      this.loadLevel(this.scenes[name]);
    this.assets.loadLevel(name, (err, level) => {
      if (err) {
        console.error(err);
      } else {
        this.scenes[name] = level;
        if (!justLoad)
          this.loadLevel(level);
      }
    });
  }
}

export default { Game };
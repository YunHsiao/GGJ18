import EnterGame from './enterGame';
import RotateBox from './rotateBox';
import AddBoxPrefab from './addBoxPrefab';
import FPCamera from './FPCamera';
import CollisionDetector from './player/CollisionDetector';
import Portal from './Portal';
import Logo from './Logo';

const { resl } = cc;
// 'EnterGame' should match to script Comp name
let _componentRegitstry = {
  'game.EnterGame': EnterGame,
  'game.RotateBox': RotateBox,
  'game.AddBoxPrefab': AddBoxPrefab,
  'game.FPCamera': FPCamera,
  'player.CollisionDetector':CollisionDetector,
  'game.Portal': Portal,
  'game.Logo': Logo,
};

let _gameInstance = null;
class Game extends cc.App {
  constructor(canvas, opts) {
    super(canvas, opts);
    _gameInstance = this;
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
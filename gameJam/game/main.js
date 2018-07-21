
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

const { resl } = window.cc;

let assetsDir = './assets';

// init game
let game = window.cc.game = new window.gameJam.Game(canvas);
game.resize();
game.init();
game.run();

// todo move this to game
resl({
  manifest: {
    gameInfo: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsDir}/game.json`
    },
  },

  onDone(data) {
    game.loadGameConfig(assetsDir, data.gameInfo);
    game.assets.loadLevel('logo', (err, level) => {
      if (err) {
        console.error(err);
      } else {
        game.loadLevel(level);
      }
    });
  }
});

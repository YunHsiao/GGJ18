
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

const { resl, path } = window.cc;

let assetsDir = './assets';
let assetsFile = 'assets.json';

// init game
let game = window.cc.game = new window.gameJam.Game(canvas);
game.resize();
game.init();
game.run();

//todo: add more register level
let assetMng = game.assets;
assetMng.registerLevel('main', `${assetsDir}/main.json`);
assetMng.registerLevel('game', `${assetsDir}/game.json`);
assetMng.registerLevel('logo', `${assetsDir}/logo.json`);
assetMng.registerLevel('limbo', `${assetsDir}/limbo.json`);

// todo move this to game
resl({
  manifest: {
    assetInfos: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsDir}/${assetsFile}`
    },
  },

  onDone(data) {
    // const sceneJson = data.scenes;
    const assetInfos = data.assetInfos;

    for (let uuid in assetInfos) {
      let info = assetInfos[uuid];
      for (let item in info.urls) {
        info.urls[item] = path.join(assetsDir, info.urls[item]);
      }

      game.assets.registerAsset(uuid, info);
    }

    game.loadScene('logo');
  }
});

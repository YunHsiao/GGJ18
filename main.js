
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

// init game
let game = window.cc.game = new window.gameJam.Game(canvas);
game.init();
game.run();

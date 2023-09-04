import { Game } from "./game.js";

let game = new Game();

document.getElementById('randomize').addEventListener('click', () => {
    game.randomize();
});

document.getElementById('update_tick').addEventListener('click', () => {
    game.update_tick(document.getElementById('tick').value);
});

document.getElementById('start').addEventListener('click', () => {
    game.start()
});

document.getElementById('pause').addEventListener('click', () => {
    game.pause();
});

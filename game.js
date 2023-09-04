export class Game {
    constructor() {
        /**
        * @type {HTMLCanvasElement}
        * @private
        */
        this.canvas = document.getElementById('canvas');
        /**
        * @type {CanvasRenderingContext2D}
        * @private
        */
        this.ctx = this.canvas.getContext('2d');
        /**
        * @type {number}
        * @private
        */
        this.tick = 500;
        /**
        * @type {boolean[]}
        */
        this.state = new Array(this.canvas.width*this.canvas.height).fill(false);
        /**
        * @type {number}
        * @private
        */
        this.tick_interval = 0;
    }
    validate_position(x, y) {
        if (x < 0) {
            x = this.canvas.width + x;
        }
        if (y < 0) {
            y = this.canvas.height + y;
        }
        if (x >= this.canvas.width) {
            x = x - this.canvas.width;
        }
        if (y >= this.canvas.height) {
            y = y - this.canvas.height;
        }
        return [x, y];
    }
    get_position(list, x, y) {
        let valid_position = this.validate_position(x, y);
        x = valid_position[0];
        y = valid_position[1];
        return list[this.canvas.width*x+y];
    }
    set_position(list, x, y, value) {
        let valid_position = this.validate_position(x, y);
        x = valid_position[0];
        y = valid_position[1];
        list[this.canvas.width*x+y] = value;
    }
    update_display() {
        let canvas_data = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.state.forEach((value, index) => {
            if (!value) {
                canvas_data.data[index*4] = 255;
                canvas_data.data[index*4+1] = 255;
                canvas_data.data[index*4+2] = 255;
            } else {
                canvas_data.data[index*4] = 0;
                canvas_data.data[index*4+1] = 0;
                canvas_data.data[index*4+2] = 0;
            }
            canvas_data.data[index*4+3] = 255;
        });
        console.log(canvas_data);
        this.ctx.putImageData(canvas_data, 0, 0);
    }
    randomize() {
        for (let i = 0; i<this.canvas.width; i++) {
            for (let j =0; j<this.canvas.height; j++) {
                this.set_position(this.state, i, j, Math.random() > 0.5);
            }
        }
        this.update_display();
    }
    run_generation(){
        let new_state = new Array(this.canvas.width*this.canvas.height).fill(false);
        for (let i = 0; i<this.canvas.width; i++) {
            for (let j = 0; j<this.canvas.height; j++) {
                let current_cell = this.get_position(this.state, i, j);
                let neighbours = 0;
                neighbours += this.get_position(this.state, i-1, j-1);
                neighbours += this.get_position(this.state, i-1, j);
                neighbours += this.get_position(this.state, i-1, j+1);
                neighbours += this.get_position(this.state, i, j-1);
                neighbours += this.get_position(this.state, i, j+1);
                neighbours += this.get_position(this.state, i+1, j-1);
                neighbours += this.get_position(this.state, i+1, j);
                neighbours += this.get_position(this.state, i+1, j+1);
                if (current_cell) {
                    if (neighbours < 2) {
                        this.set_position(new_state, i, j, false);
                    } else if (neighbours == 2 || neighbours == 3) {
                        this.set_position(new_state, i, j, true);
                    } else if (neighbours > 3) {
                        this.set_position(new_state, i, j, false);
                    }
                }else {
                    if (neighbours == 3) {
                        this.set_position(new_state, i, j, true);
                    }
                }
            }
        }
        this.state = new_state;
    }
    tick_forward(){
        this.run_generation();
        this.update_display();
    }
    update_tick(new_tick) {
        clearInterval(this.tick_interval);
        this.tick = new_tick;
        this.tick_interval = setInterval(()=>{this.tick_forward()}, this.tick);
    }
    start() {
        this.update_tick(this.tick);
    }
    pause() {
        clearInterval(this.tick_interval);
    }
}

import {EventEmitter} from 'events';
import Color = require('color');

export class ColorPalette extends EventEmitter {
    private _root: HTMLElement = null;
    private _canvas: HTMLCanvasElement = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _selectedColor = Color('#FFF');

    constructor() {
        super();
        let canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 200;
        canvas.style.border = "1px solid black";

        this._root = canvas;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');

        // Event listeners
        this.onClick = this.onClick.bind(this);
        this._canvas.addEventListener('click', this.onClick);

        this.render();
    }

    get domElement() { return this._root; }

    render() {
        const w = this._canvas.width;
        const h = this._canvas.height;
        const g = this._ctx;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                g.fillStyle = `hsl(${y / h * 360}, ${(w - x) / w * 100}%, ${0.5 * 100}%)`;
                g.fillRect(x, y, 1, 1);
            }
        }
    }
    
    private onClick(evt: MouseEvent) {
       // console.log(evt);
       // console.log(this._canvas.clientHeight);
        let h = Math.floor(evt.offsetY / Number(this._canvas.clientHeight) * 360);
        let s = 100 - Math.floor(evt.offsetX / Number(this._canvas.clientWidth) * 100);
        h = Math.max(0, h);
        h = Math.min(360, h);
        s = Math.max(0, s);
        s = Math.min(100, s);
        this._selectedColor = Color({h:h, s:s, l:50}, 'hsl').rgb();
        this.emit("change", this._selectedColor);
        // let col = this._selectedColor;
        // this.emit("change", {
        //     r:Math.floor(col.red()), 
        //     g:Math.floor(col.green()), 
        //     b:Math.floor(col.blue()), 
        //     a:Math.floor(col.alpha())
        // });
        //this._selectedColor
        //console.log(this._selectedColor);
    }
}

import {EventEmitter} from 'events';
import Color = require('color');

export class MyCanvas extends EventEmitter {
    private _canvas: HTMLCanvasElement = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _state: object = {};

    constructor() {
        super();
        let canvas = document.createElement( "canvas" );
        canvas.width = 640;
        canvas.height = 480;
        canvas.style.width = "640px";
        canvas.style.height = "480px";
        canvas.style.border = "1px solid black";
        canvas.style.cursor = "crosshair";
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');

        // Bind event handlers
        this.onPointerMove = this.onPointerMove.bind( this );
        this.onKeyPress = this.onKeyPress.bind( this );

        // Add event listeners
        canvas.addEventListener( 'pointermove', this.onPointerMove );
        window.addEventListener( 'keydown', this.onKeyPress );

        // Initialize context
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this._ctx.globalCompositeOperation = 'multiply';
    }

    get domElement(): HTMLElement { return this._canvas; }
    setState(newState: object) {
        this._state = Object.assign(this._state, newState);
    }

    addListener(event: 'pointermove', listener: (evt: PointerEvent) => void);
    addListener(event: string, listener: (...args: any[]) => void) {
        super.addListener(event, listener);
    }

    private onPointerMove(evt: PointerEvent) {
        this.emit("pointermove", evt);
        if (evt.pressure <= 0) return;
        const g = this._ctx;
        //console.log( [evt.tiltX, evt.tiltY] );
        let [x, y] = [evt.offsetX, evt.offsetY];
        let [dx, dy] = [evt.movementX, evt.movementY];
        let [oldx, oldy] = [x - dx, y - dy];
        let radius = evt.pressure * 5;
        let baseAlpha = evt.pressure / 0.2;

        let dist = Math.max(Math.abs(dx), Math.abs(dy));
        let steps = Math.floor( dist ) || 1;

        let stepAlpha = baseAlpha / steps;
        //g.fillStyle = `rgba(0, 0, 0, ${Math.min(1, stepAlpha)}`;
        let color = this._state["color"] as Color.Color || Color("#000");
        color = color.alpha(Math.min(1, stepAlpha));
        g.fillStyle = color.string();
        for (let i = 1; i <= steps; i++) {
            let r = i / steps;
            g.beginPath();
            g.ellipse( x * r + oldx * (1 - r), y * r + oldy * (1 - r), radius, radius, 0, 0, Math.PI * 2 );
            //g.closePath();
            g.fill();
        }

        //g.fillStyle = col;
        // g.beginPath();
        // //g.ellipse( x, y, radius, radius, 0, 0, Math.PI * 2 );
        // //g.fill();
        // g.moveTo(oldx, oldy);
        // g.lineTo(x, y);
        // g.closePath();
        // g.stroke();
    }

    private onKeyPress(evt: KeyboardEvent) {
        if (evt.code === 'Delete') {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
}

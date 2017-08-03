import * as React from 'react';
import {EventEmitter} from 'events';
import Color = require('color');

interface Props {
    width?: number;
    height?: number;
    frame?: number;
}

interface State {
}

interface CanvasLayer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

export class MyCanvas extends React.Component<Props, State> {
    private readonly NUM_ONIONS = 4;
    private _canvas: HTMLCanvasElement = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _color: Color.Color = Color('#000');
    private _width: number = 640;
    private _height: number = 480;
    private _frameData = [];
    private _frame = 0;

    private _onionLayers = [] as CanvasLayer[];

    constructor(props: Props) {
        super(props);
        if (props.width) this._width = props.width;
        if (props.height) this._height = props.height;
        this.state = {};
    }

    render() {
        const onionStyle = {
            width: `${this._width}px`,
            height: `${this._height}px`,
            position: 'absolute',
            opacity: 0.5,
        } as React.CSSProperties;

        const canvasStyle = {
            width: `${this._width}px`,
            height: `${this._height}px`,
            border: '1px solid black',
            cursor: 'crosshair',
            opacity: 0.75,
        } as React.CSSProperties;

        let onions = [];
        let setOnion = (canvas: HTMLCanvasElement, index: number) => {
            if (!canvas) return; // component unmounted
            let layer = { canvas: canvas, context: null };
            layer.context = layer.canvas.getContext('2d');
            this._onionLayers[index] = layer;
        };
        for (let i = 0; i < this.NUM_ONIONS; i++) {
            let c = <canvas 
                ref={r=>setOnion(r, this.NUM_ONIONS - 1 - i)} 
                width={this._width}
                height={this._height}
                style={onionStyle} />
            onions.push( c );
        }

        return (
            <div style={{display: 'inline-block', position:'relative'}}>
                { onions }
                <canvas 
                    ref={r=>this._canvas=r}
                    width={this._width} 
                    height={this._height} 
                    style={canvasStyle}
                />
            </div>
        );
    }

    componentDidMount() {
        // Initialize context
        this._ctx = this._canvas.getContext('2d');
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        //this._ctx.globalCompositeOperation = 'multiply';
        this.clear();

        this.onPointerMove = this.onPointerMove.bind( this );
        this._canvas.addEventListener( 'pointermove', this.onPointerMove );
        this.onKeyPress = this.onKeyPress.bind( this );
        window.addEventListener( 'keydown', this.onKeyPress );
    }

    componentWillUnmount() {
        this._canvas.removeEventListener( 'pointermove', this.onPointerMove );
        window.removeEventListener( 'keydown', this.onKeyPress );
    }

    componentDidUpdate() {
        //console.log( `Canvas updated ${this.props.frame}` );
        this._frameData[this._frame] = this._ctx.getImageData(0, 0, this._width, this._height);
        this._frame = this.props.frame;
        if (this._frameData[this._frame])
            this._ctx.putImageData( this._frameData[this._frame], 0, 0 );
        else
            this.clear();

        // update onion layers
        for (let i = 0; i < this.NUM_ONIONS; i++) {
            let layer = this._onionLayers[i];
            layer.context.clearRect(0, 0, this._width, this._height);
            // let layerFrame = this._frame - this.NUM_ONIONS + i;
            let layerFrame = this._frame - i - 1;
            if (layerFrame >= 0) {
                layer.context.putImageData(this._frameData[layerFrame], 0, 0);
            }
        }
    }

    clear() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this._ctx.fillStyle = `white`;
        this._ctx.fillRect(0, 0, this._width, this._height);
        //console.log( 'cleared' );
    }

    // get domElement(): HTMLElement { return this._canvas; }

    // addListener(event: 'pointermove', listener: (evt: PointerEvent) => void);
    // addListener(event: string, listener: (...args: any[]) => void) {
    //     super.addListener(event, listener);
    // }

    private onPointerMove(evt: PointerEvent) {
        // this.emit("pointermove", evt);
        if (evt.pressure <= 0) return;
        const g = this._ctx;
        //console.log( [evt.tiltX, evt.tiltY] );
        let [x, y] = [evt.offsetX, evt.offsetY];
        let [dx, dy] = [evt.movementX, evt.movementY];
        let [oldx, oldy] = [x - dx, y - dy];
        let radius = evt.pressure * 2;
        let baseAlpha = evt.pressure / 0.2;

        let dist = Math.max(Math.abs(dx), Math.abs(dy));
        let steps = Math.floor( dist ) || 1;

        let stepAlpha = baseAlpha / steps;
        //g.fillStyle = `rgba(0, 0, 0, ${Math.min(1, stepAlpha)}`;
        let color = this._color || Color("#000");
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
        //console.log( evt );
        // if (evt.code === 'Delete') {
        //     this._ctx.clearRect(0, 0, this._width, this._height);
        // }
        // else if (evt.code === 'ArrowLeft') {
        //     console.log ('left');
        // }
    }

    set color(value: Color.Color) { 
        this._color = value; 
        //console.log( value );
    }

    get frames(): Iterable<ImageData> {
        this._frameData[this._frame] = this._ctx.getImageData(0, 0, this._width, this._height);
        return this._frameData;
    }
}

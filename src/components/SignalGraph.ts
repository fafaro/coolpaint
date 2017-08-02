import {DataSignal} from '../models/DataSignal';

export class SignalGraph {
    private _canvas = document.createElement('canvas');
    private _width = 300;
    private _height = 100;
    private _timer: number = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _signal: DataSignal = null;

    constructor(signal: DataSignal) {
        const dom = this._canvas;
        dom.style.border = '1px solid black';
        dom.style.minWidth = dom.style.maxWidth = `${this._width}px`;
        dom.style.minHeight = dom.style.maxHeight = `${this._height}px`;
        dom.width = this._width;
        dom.height = this._height;

        this._ctx = dom.getContext('2d');

        // Event handlers
        this.onDataChange = this.onDataChange.bind( this );
        this._signal = signal;
        this._signal.addListener( 'change', this.onDataChange );

        this.onTick = this.onTick.bind( this );
        this._timer = window.setInterval( this.onTick, 100 );
    }

    get domElement(): HTMLElement { return this._canvas; }

    private onDataChange() {
    }

    private onTick() {
        this.render();
    }

    render() {
        const windowInterval = 30 * 1000; // millisecs
        const endT = Date.now();
        const startT = endT - windowInterval;
        let yrange = this._signal.yrange;

        const mapperMaker = (min1: number, max1: number, 
            min2: number, max2: number) => {
            return (value: number): number =>
                (value - min1) * (max2 - min2) / (max1 - min1) + min2;
        };
        
        const mapX = mapperMaker( startT, endT, 0, this._width );
        // const mapY = mapperMaker( yrange[0], yrange[1], this._height, 0 );
        const mapY = mapperMaker( 0, 1, this._height, 0 );

        const g = this._ctx;
        g.clearRect( 0, 0, this._width, this._height );
        g.beginPath();
        g.moveTo( 0, this._height / 2 );
        g.lineTo( this._width, this._height / 2 );
        g.stroke();

        g.beginPath();
        let first = true;
        for (let entry of this._signal.data) {
            if (entry.t <= startT) continue;
            if (entry.t > endT) continue;
            
            let [x, y] = [mapX(entry.t), mapY(entry.value)];
            if (first) {
                first = false;
                g.moveTo( x, y );
            }
            else {
                g.lineTo( x, y );
            }
        }
        g.stroke();
    }
}
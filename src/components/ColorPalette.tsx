import * as React from 'react';
import {EventEmitter} from 'events';
import Color = require('color');

interface Props {
    onColorSelected?: (col: Color.Color)=>void;
}

interface State {
}

export class ColorPalette extends React.Component<Props, State> {
    private _canvas: HTMLCanvasElement = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _selectedColor = Color('#FFF');

    constructor(props: Props) {
        super(props);
        // this._canvas = canvas;
        this.onClick = this.onClick.bind(this);
    }

    // get domElement() { return this._root; }

    render() {
        const s = {
            border: "1px solid black"
        } as React.CSSProperties;
        return (
            <canvas 
                ref={r=>this._canvas=r} 
                width={100} 
                height={200} 
                style={s} 
                onClick={this.onClick}
            />
        );
    }

    componentDidMount() {
        this._ctx = this._canvas.getContext('2d');
        this.renderCanvas();
    }

    renderCanvas() {
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
    
    private onClick(evt: React.MouseEvent<HTMLCanvasElement>) {
       // console.log(evt);
       // console.log(this._canvas.clientHeight);
        let h = Math.floor(evt.nativeEvent.offsetY / Number(this._canvas.clientHeight) * 360);
        let s = 100 - Math.floor(evt.nativeEvent.offsetX / Number(this._canvas.clientWidth) * 100);
        h = Math.max(0, h);
        h = Math.min(360, h);
        s = Math.max(0, s);
        s = Math.min(100, s);
        this._selectedColor = Color({h:h, s:s, l:50}, 'hsl').rgb();
        if (this.props.onColorSelected) this.props.onColorSelected( this._selectedColor );
        //this.emit("change", this._selectedColor);
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

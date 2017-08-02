import $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import {observable, autorun} from 'mobx';
import {MyCanvas} from './components/MyCanvas';
import {ColorPalette} from './components/ColorPalette';
import {DataSignal} from './models/DataSignal';
import {SignalGraph} from './components/SignalGraph';

function App() {
    let canvas: MyCanvas = null;

    const colorSelected = (col: Color.Color) => {
        canvas.color = col;
    };

    return (<div>
        <h2>Cool Paint</h2>
        <MyCanvas ref={r=>canvas=r} />
        <ColorPalette onColorSelected={colorSelected}/>
    </div>);
}

function main() {
    ReactDOM.render(<App />, document.getElementById('root'));
}
window.onload = main;


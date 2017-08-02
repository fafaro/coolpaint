import $ from 'jquery';
//import {observable, autorun} from 'mobx';
import {MyCanvas} from './components/MyCanvas';
import {ColorPalette} from './components/ColorPalette';
import {DataSignal} from './models/DataSignal';
import {SignalGraph} from './components/SignalGraph';

function main() {
    let ds = new DataSignal(1000);
    let mc = new MyCanvas();
    let cp = new ColorPalette();
    let sg = new SignalGraph(ds);
    mc.addListener("pointermove", evt => ds.inputData( evt.pressure ));
    cp.addListener("change", col => mc.setState({color: col}));
    let div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexFlow = 'row wrap';
    cp.domElement.style.marginTop = "0";
    div.appendChild( cp.domElement );
    div.appendChild( mc.domElement );
    let div2 = document.createElement( 'div' );
    div2.style.width = '100%';
    div.appendChild( div2 );
    div.appendChild( sg.domElement );
    document.body.appendChild( div );
    //$(document.body).append("<h1>Hello World</h1>");
}
window.onload = main;


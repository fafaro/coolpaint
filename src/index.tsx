import Color               = require('color');
import $                     from 'jquery';
import * as React            from 'react';
import * as ReactDOM         from 'react-dom';
import {observable, autorun} from 'mobx';
import {observer}            from 'mobx-react';
import {DataSignal}          from './models/DataSignal';
import {MyCanvas}            from './components/MyCanvas';
import {ColorPalette}        from './components/ColorPalette';
import {SignalGraph}         from './components/SignalGraph';
import {GifMaker}            from './components/GifMaker';

class UserSession {
    @observable color = Color('#000');
    @observable frame = 0;

    gotoFrame(dest: number) {
        if (dest < 0) dest = 0;
        this.frame = dest;
    }
}

class KeyboardShortcuts extends React.Component<any, any> {
    app: App = null;

    constructor(props: any) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind( this );
        this.app = props.app;
    }

    render() {
        return <div style={{display:'none'}} />;
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyPress);
    }

    private onKeyPress(evt: KeyboardEvent) {
        const app = this.app;
        //console.log( evt );
        switch (evt.code) {
        case 'Delete':
            app.canvas.clear();
            break;
        case 'ArrowLeft':
            app.userSession.gotoFrame( app.userSession.frame - 1 );
            break;
        case 'ArrowRight':
            app.userSession.gotoFrame( app.userSession.frame + 1 );
            break;
        }
    }
}

@observer
class App extends React.Component<any, any> {
    canvas: MyCanvas = null;
    userSession = new UserSession();

    constructor(props: any) {
        super(props);
    }

    render() {
        function ColorSwatch(props: any) {
            let s = {
                display:'inline-block', 
                width:30, height:30, 
                backgroundColor: props.color.string(),
                border: "1px solid black",
            } as React.CSSProperties;
            return <div style={s} />;
        }

        const us = this.userSession;

        return (<div>
            <h2>Cool Paint</h2>
            <MyCanvas ref={r=>this.canvas=r} width={320} height={240} frame={us.frame} />
            <ColorPalette onColorSelected={col => us.color = col }/>
            <ColorSwatch color={us.color} />
            <br />
            <button onClick={()=>us.gotoFrame(us.frame - 1)}>&lt;</button>
            <input type='text' readOnly={true} size={1} value={us.frame} />
            <button onClick={()=>us.gotoFrame(us.frame + 1)}>&gt;</button>
            <KeyboardShortcuts app={this} />
            <GifMaker canvas={() => this.canvas} />
        </div>);
    }

    disposables = [];

    componentDidMount() {
        let dis = autorun(() => { this.canvas.color = this.userSession.color; });
        this.disposables.push( dis );

        console.log( this.canvas );
    }

    componentWillUnmount() {
        for (let dis of this.disposables)
            dis();
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('root'));
}
window.onload = main;


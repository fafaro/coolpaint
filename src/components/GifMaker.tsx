import GIF        = require('gif.js/dist/gif.js');
import * as React   from 'react';
import {MyCanvas} from './MyCanvas';

interface Props {
    canvas: () => MyCanvas;
}

export class GifMaker extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.makeGif = this.makeGif.bind( this );
        this.state = { url: null };
    }

    render(): JSX.Element { 
        return (<div>
            <button onClick={this.makeGif}>GIF</button><br />
            {
                this.state.url &&
                <img src={this.state.url} style={{border:'1px solid black'}} />
            }
            {/*<a href={this.state.url} target="_blank" >Save</a>*/}
        </div>); 
    }

    makeGif() {
        //window.alert( "LOL" );
        const gif = new GIF({ workers: 2, quality: 10 });
        for (let frame of this.props.canvas().frames) {
            gif.addFrame( frame, { delay: 100 } );
        }
        gif.on( 'finished', blob => {
            let url = URL.createObjectURL( blob );
            this.setState( { url: url } );
        });
        gif.render();
    }
}

// var gif = new GIF({
//   workers: 2,
//   quality: 10
// });
 
// // add an image element 
// gif.addFrame(imageElement);
 
// // or a canvas element 
// gif.addFrame(canvasElement, {delay: 200});
 
// // or copy the pixels from a canvas context 
// gif.addFrame(ctx, {copy: true});
 
// gif.on('finished', function(blob) {
//   window.open(URL.createObjectURL(blob));
// });
 
// gif.render();
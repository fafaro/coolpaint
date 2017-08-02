import {EventEmitter} from 'events';

class CircularBuffer<T> {
    private _data = [] as T[];
    private _size = 0;
    private _physicalSize = 1;
    private _start = 0;
    private _end = 0;

    constructor(size: number) {
        this._size = size;
        this._physicalSize = size + 1;
        this._data.length = this._physicalSize;
    }

    get size() { return this._size; }

    private *_dataView() {
        for (let i = this._start; i != this._end; i = this.wrap( i + 1 ))
            yield this._data[i];
    }
    
    get data(): Iterable<T> {
        return this._dataView();
    }

    get(index: number): T {
        return this._data[this.wrap( this._start + index )];
    }

    append(value: T) {
        // Make space if full
        if (this.length == this._size) 
            this._start = this.wrap( this._start + 1 );
        this._data[this._end] = value;
        this._end = this.wrap( this._end + 1 );
    }

    get length() { return this.wrap(this._end - this._start); }

    private wrap(index: number): number {
        let r = index % this._physicalSize;
        return r >= 0 ? r : r + this._physicalSize;
    }
}

interface DataEntry {
    t: number;
    value: number;
}

export class DataSignal extends EventEmitter {
    private _buffer: CircularBuffer<DataEntry>;

    constructor(size: number) {
        super();
        this._buffer = new CircularBuffer<DataEntry>( size );
    }

    inputData(value: number) {
        let entry = {
            t: Date.now(),
            value: value
        } as DataEntry;
        this._buffer.append( entry );
        this.emit( 'change' );
    }

    get data() { return this._buffer.data; }
    get yrange() {
        if (this._buffer.length == 0) return [0, 1]; 
        let min = this._buffer.get(0).value;
        let max = min;
        for (let entry of this.data) {
            if (entry.value < min) min = entry.value;
            if (entry.value > max) max = entry.value;
        }
        return [min, max];
    }
}
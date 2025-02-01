
module lcc$nes {

const BUFFERSIZE = 8192;

/**
 * 音频播放器
 */
export class AudioPlayer {

	/**
	 * 缓冲区
	 */
	private _buffer:RingBuffer = null;

	private _audioCtx:AudioContext = null;
	private _scriptNode:ScriptProcessorNode = null;

	constructor(){
		this._buffer = new RingBuffer(BUFFERSIZE * 2);
	}
	
	getSampleRate() {
		if (!window.AudioContext) {
		    return 44100;
        }
		let myCtx = new AudioContext();
		let sampleRate = myCtx.sampleRate;
		myCtx.close();
		return sampleRate;
	}
    
	start() {
		if(!this._scriptNode){
			// Audio is not supported
			if (!window.AudioContext) {
				return;
			}
			this._audioCtx = new AudioContext();
			this._scriptNode = this._audioCtx.createScriptProcessor(1024, 0, 2);
			this._scriptNode.onaudioprocess = this.onaudioprocess.bind(this);
			this._scriptNode.connect(this._audioCtx.destination);
		}
	}
	
	async stop() {
		if (this._scriptNode) {
		  	this._scriptNode.disconnect(this._audioCtx.destination);
		  	this._scriptNode.onaudioprocess = null;
		  	this._scriptNode = null;
		}
		if (this._audioCtx) {
		  	await this._audioCtx.close();
		  	this._audioCtx = null;
		}
	}

	writeSample(left, right) {
		if (this._buffer.size() / 2 >= BUFFERSIZE) {
		  	//console.log(`Buffer overrun`);
		  	this._buffer.deqN(BUFFERSIZE / 2);
		}
		this._buffer.enq(left);
		this._buffer.enq(right);
	};
	
	onaudioprocess(e) {
		var left = e.outputBuffer.getChannelData(0);
		var right = e.outputBuffer.getChannelData(1);
		var size = left.length;
		
		// We're going to buffer underrun. Attempt to fill the buffer.
		//if (this._buffer.size() < size * 2 && this.onBufferUnderrun) {
		//  	this.onBufferUnderrun(this._buffer.size(), size * 2);
		//}
		
		try {
		  	var samples = this._buffer.deqN(size * 2);
		} catch (e) {
			// onBufferUnderrun failed to fill the buffer, so handle a real buffer
			// underrun
		
			// ignore empty buffers... assume audio has just stopped
			var bufferSize = this._buffer.size() / 2;
			if (bufferSize > 0) {
				//console.log(`Buffer underrun (needed ${size}, got ${bufferSize})`);
			}
			for (var j = 0; j < size; j++) {
				left[j] = 0;
				right[j] = 0;
			}
			return;
		}
		for (var i = 0; i < size; i++) {
		  	left[i] = samples[i * 2];
		  	right[i] = samples[i * 2 + 1];
		}
	};
}

}

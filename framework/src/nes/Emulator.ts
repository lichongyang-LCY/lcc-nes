
module lcc$nes {

const {ccclass, property, menu } = cc._decorator;

/**
 * jsnes库
 */
declare let jsnes:any;

/**
 * 帧大小
 */
const FRAMESIZE = cc.size(256,240);

//@ts-ignore
let gfx = cc.gfx;

@ccclass("lcc$nes.Emulator")
@menu("i18n:lcc-nes.menu_component/Emulator")
export class Emulator extends cc.Component {

    @property(cc.BufferAsset)
    _rom: cc.BufferAsset = null;
	@property({
		type : cc.BufferAsset,
		tooltip : "ROM 数据"
	})
	get rom(){
		return this._rom;
	}
	set rom(value:cc.BufferAsset){
		this._rom = value;
		this.setRomData(value);
    }

	@property({
		tooltip:"立即播放"
	})
	playOnLoad:boolean = false;

    /**
     * 准备好
     */
    private _prepare:boolean = false;

    /**
     * NES 对象
     */
    private _nes:any = null;
    
    /**
     * 纹理对象
     */
    private _texture:cc.Texture2D = null;

    /**
     * 纹理缓冲
     */
    private _framebuff:ArrayBuffer = null;

    /**
     * 缓冲 Uint8视图
     */
    private _frameu8:Uint8Array = null;

    /**
     * 缓冲 Uint32视图
     */
	private _frameu32:Uint32Array = null;
	
	/**
	 * 音频播放器
	 */
	private _audio:AudioPlayer = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this._audio = new AudioPlayer();
		this._nes = new jsnes.NES({
			onFrame : this.setFrameBuffer.bind(this),
			onStatusUpdate : cc.log,
			sampleRate : this._audio.getSampleRate(),
			onAudioSample : this._audio.writeSample.bind(this._audio),
		});
		this._texture = new cc.Texture2D();
		this._framebuff = new ArrayBuffer(FRAMESIZE.width * FRAMESIZE.height * 4);
		this._frameu8 = new Uint8Array(this._framebuff);
		this._frameu32 = new Uint32Array(this._framebuff);
    }

    /**
     * 设置帧缓冲
     */
    private setFrameBuffer(buffer:ArrayBuffer){
        let i = 0;
        for (let y = 0; y < FRAMESIZE.height; ++y) {
            for (let x = 0; x < FRAMESIZE.width; ++x) {
                i = y * 256 + x;
                // Convert pixel from NES BGR to canvas ABGR
                this._frameu32[i] = 0xff000000 | buffer[i]; // Full alpha
            }
        }
        // @ts-ignore
        this._texture.initWithData(this._frameu8, gfx.TEXTURE_FMT_RGBA8, FRAMESIZE.width, FRAMESIZE.height);
    }

    /**
     * 获得NES对象
     */
    public getNES(){
        return this._nes;
    }
    
    /**
     * 获得纹理对象
     */
    public getTexture(){
        return this._texture;
    }

    /**
     * 设置ROM数据
     */
    private setRomData(data:cc.BufferAsset){
		if(!CC_EDITOR && this._nes){
			if(data){
				// @ts-ignore
				this._nes.loadROM(Utils.ab2bs(data._buffer));
				this._audio.start();
				this._prepare = true;
			}
		}
	}
	
	/**
	 * 重置
	 */
	public reset(){
		if(!CC_EDITOR && this._nes){
			this._nes.reset();
			this._audio.stop();
			this._prepare = false;
		}
	}
    
    update(dt){
        if(this._nes && this._prepare){
            this._nes.frame();
        }
    }
	
    start () {
        if(this.playOnLoad){
            this.setRomData(this._rom);
        }
	}
	
	/**
	 * 获得状态
	 * @returns 存档JSON数据
	 */
	public getState(){
		return this._nes.getState();
	}

	/**
	 * 加载状态
	 * @param json 存档JSON数据
	 */
	public loadState(s){
		this._nes.loadState(s);
	}
    
    // update (dt) {}
}

}

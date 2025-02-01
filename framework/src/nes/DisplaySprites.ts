/// <reference path = "./Emulator.ts" />

module lcc$nes {

const {ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass("lcc$nes.DisplaySprites")
@requireComponent(Emulator)
@menu("i18n:lcc-nes.menu_component/DisplaySprites")
export class DisplaySprites extends cc.Component {

    @property([cc.Sprite])
    _sprites: cc.Sprite[] = [];
	@property({
		type : [cc.Sprite],
		tooltip : "展示的Sprite数组"
	})
	get sprites(){
		return this._sprites;
	}
	set sprites(value:cc.Sprite[]){
		if(this._sprites != value){
			this._sprites = value;
			this.setDisplaySprites(value);
		}
    }

    /**
     * 模拟器
     */
    private _emulator:Emulator = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._emulator = this.getComponent(Emulator);
        this.setDisplaySprites(this.sprites);
    }

    /**
     * 设置展示Sprite数组
     * @param sprites 
     */
    private setDisplaySprites(sprites:cc.Sprite[]){
        if(sprites && sprites.length > 0){
            let spriteFrame = new cc.SpriteFrame(this._emulator.getTexture());
            for(let sp of sprites){
                sp.spriteFrame = spriteFrame;
            }
        }
    }
    
    // update (dt) {}
}

}

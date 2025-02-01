/// <reference path = "./Emulator.ts" />

module lcc$nes {

const {ccclass, property, requireComponent, menu } = cc._decorator;

/**
 * 玩家序号
 */
export enum Player {
    PLAYER_1 = 1,
    PLAYER_2 = 2,
}

/**
 * 游戏按钮
 */
export enum Button {
    A       = 0,
    B       = 1,
    SELECT  = 2,
    START   = 3,
    UP      = 4,
    DOWN    = 5,
    LEFT    = 6,
    RIGHT   = 7,
}

/**
 * 键盘按键
 */
export enum Keyboard {
    back = 0,
    menu,
    backspace,
    tab,
    enter,
    shift,
    ctrl,
    alt,
    pause,
    capslock,
    escape,
    space,
    pageup,
    pagedown,
    end,
    home,
    left,
    up,
    right,
    down,
    select,
    insert,
    Delete,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z,
    num0,
    num1,
    num2,
    num3,
    num4,
    num5,
    num6,
    num7,
    num8,
    num9,
    '*',
    '+',
    '-',
    numdel,
    '/',
    f1,
    f2,
    f3,
    f4,
    f5,
    f6,
    f7,
    f8,
    f9,
    f10,
    f11,
    f12,
    numlock,
    scrolllock,
    ';',
    semicolon,
    equal,
    '=',
    ',',
    comma,
    dash,
    '.',
    period,
    forwardslash,
    grave,
    '[',
    openbracket,
    backslash,
    ']',
    closebracket,
    quote,
    dpadLeft,
    dpadRight,
    dpadUp,
    dpadDown,
    dpadCenter,
}

/**
 * 键盘按键表键
 */
const KeyboardList = [
    'back',
    'menu',
    'backspace',
    'tab',
    'enter',
    'shift',
    'ctrl',
    'alt',
    'pause',
    'capslock',
    'escape',
    'space',
    'pageup',
    'pagedown',
    'end',
    'home',
    'left',
    'up',
    'right',
    'down',
    'select',
    'insert',
    'Delete',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'num0',
    'num1',
    'num2',
    'num3',
    'num4',
    'num5',
    'num6',
    'num7',
    'num8',
    'num9',
    '*',
    '+',
    '-',
    'numdel',
    '/',
    'f1',
    'f2',
    'f3',
    'f4',
    'f5',
    'f6',
    'f7',
    'f8',
    'f9',
    'f10',
    'f11',
    'f12',
    'numlock',
    'scrolllock',
    ';',
    'semicolon',
    'equal',
    '=',
    ',',
    'comma',
    'dash',
    '.',
    'period',
    'forwardslash',
    'grave',
    '[',
    'openbracket',
    'backslash',
    ']',
    'closebracket',
    'quote',
    'dpadLeft',
    'dpadRight',
    'dpadUp',
    'dpadDown',
    'dpadCenter',
]

/**
 * 获得按键码
 * @param key 
 */
export function getKeyCode(key:Keyboard){
    return cc.macro.KEY[KeyboardList[key]];
}

@ccclass("lcc$nes.ButtonMap")
export class ButtonMap {
    @property({
        type : cc.Enum(Button),
        tooltip : "游戏按钮",
        readonly : true,
    })
    button:Button = Button.A;

    @property({
        type : cc.Enum(Keyboard),
        tooltip : "键盘按键"
    })
    key: Keyboard = Keyboard.w;

    constructor(...args:any[]){
        this.button = args[0] || Button.A;
        this.key = args[1] || Keyboard.w;
    }
}

@ccclass("lcc$nes.Controller")
@requireComponent(Emulator)
@menu("i18n:lcc-nes.menu_component/Controller")
export class Controller extends cc.Component {

    @property({
        type : cc.Enum(Player),
        tooltip : "玩家序号"
    })
    player:Player = Player.PLAYER_1;

    @property([ButtonMap])
    _buttons:ButtonMap[] = [
        new ButtonMap(Button.A, Keyboard.j),
        new ButtonMap(Button.B, Keyboard.k),
        new ButtonMap(Button.SELECT, Keyboard.f),
        new ButtonMap(Button.START, Keyboard.h),
        new ButtonMap(Button.UP, Keyboard.w),
        new ButtonMap(Button.DOWN, Keyboard.s),
        new ButtonMap(Button.LEFT, Keyboard.a),
        new ButtonMap(Button.RIGHT, Keyboard.d)
    ];
    @property({
        type : [ButtonMap],
        tooltip : "按键映射表"
    })
    get buttons(){
        return this._buttons;
    } 
    set buttons(value:ButtonMap[]){
		if(this._buttons != value){
			this._buttons = value;
			this.updateButtonMap();
		}
    }

    /**
     * NES 对象
     */
    private _nes:any = null;

    /**
     * 键盘映射
     */
    private _keymap:{[key:number]:number} = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this._nes = this.getComponent(Emulator).getNES();
		this.updateButtonMap();
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		this.node.on("nes_button_event", this.onNodeButtonEvent, this);
    }

    onDestroy(){
        cc.systemEvent.targetOff(this);
        this.node.targetOff(this);
    }

    /**
     * 节点按钮事件
     * @param player 
     * @param button 
     * @param down 
     */
    private onNodeButtonEvent(player:Player, button:Button, down:boolean){
        if(player == this.player){
            this.onButtonEvent(button, down);
        }
    }

    /**
     * 按钮事件
     */
    onButtonEvent(button:Button, down:boolean){
		if(down){
			this._nes.buttonDown(this.player, button);
		}else{
			this._nes.buttonUp(this.player, button);
		}
    }
	
    /**
     * 当按钮按下
     */
    private onKeyDown(event:cc.Event.EventKeyboard){
        let button = this._keymap[event.keyCode];
        if(button != null){
			this.onButtonEvent(button, true);
        }
    }

    /**
     * 当按钮放开
     */
    private onKeyUp(event:cc.Event.EventKeyboard){
        let button = this._keymap[event.keyCode];
        if(button != null){
			this.onButtonEvent(button, false);
        }
    }

    /**
     * 更新按钮映射
     */
    private updateButtonMap(){
        this._keymap = {};
        for (let b of this._buttons){
            this._keymap[getKeyCode(b.key)] = b.button;
        }
    }

    // update (dt) {}
}

}

declare module lcc$nes {
    class Emulator extends cc.Component {
        _rom: cc.BufferAsset;
        get rom(): cc.BufferAsset;
        set rom(value: cc.BufferAsset);
        playOnLoad: boolean;
        private _prepare;
        private _nes;
        private _texture;
        private _framebuff;
        private _frameu8;
        private _frameu32;
        private _audio;
        onLoad(): void;
        private setFrameBuffer;
        getNES(): any;
        getTexture(): cc.Texture2D;
        private setRomData;
        reset(): void;
        update(dt: any): void;
        start(): void;
        getState(): any;
        loadState(s: any): void;
    }
}
declare module lcc$nes {
    class RingBuffer {
        private _elements;
        private _first;
        private _last;
        private _size;
        private _evictedCb;
        constructor(capacity: number, evictedCb?: Function);
        capacity(): number;
        size(): number;
        isEmpty(): boolean;
        isFull(): boolean;
        peek(): any;
        peekN(count: number): any[];
        deq(): any;
        deqN(count: number): any[];
        enq(element: any): number;
    }
}
declare module lcc$nes {
    class Utils {
        static ab2bs(ab: ArrayBuffer): string;
    }
}
declare module lcc$nes {
    class AudioPlayer {
        private _buffer;
        private _audioCtx;
        private _scriptNode;
        constructor();
        getSampleRate(): number;
        start(): void;
        stop(): Promise<void>;
        writeSample(left: any, right: any): void;
        onaudioprocess(e: any): void;
    }
}
declare module lcc$nes {
    enum Player {
        PLAYER_1 = 1,
        PLAYER_2 = 2
    }
    enum Button {
        A = 0,
        B = 1,
        SELECT = 2,
        START = 3,
        UP = 4,
        DOWN = 5,
        LEFT = 6,
        RIGHT = 7
    }
    enum Keyboard {
        back = 0,
        menu = 1,
        backspace = 2,
        tab = 3,
        enter = 4,
        shift = 5,
        ctrl = 6,
        alt = 7,
        pause = 8,
        capslock = 9,
        escape = 10,
        space = 11,
        pageup = 12,
        pagedown = 13,
        end = 14,
        home = 15,
        left = 16,
        up = 17,
        right = 18,
        down = 19,
        select = 20,
        insert = 21,
        Delete = 22,
        a = 23,
        b = 24,
        c = 25,
        d = 26,
        e = 27,
        f = 28,
        g = 29,
        h = 30,
        i = 31,
        j = 32,
        k = 33,
        l = 34,
        m = 35,
        n = 36,
        o = 37,
        p = 38,
        q = 39,
        r = 40,
        s = 41,
        t = 42,
        u = 43,
        v = 44,
        w = 45,
        x = 46,
        y = 47,
        z = 48,
        num0 = 49,
        num1 = 50,
        num2 = 51,
        num3 = 52,
        num4 = 53,
        num5 = 54,
        num6 = 55,
        num7 = 56,
        num8 = 57,
        num9 = 58,
        '*' = 59,
        '+' = 60,
        '-' = 61,
        numdel = 62,
        '/' = 63,
        f1 = 64,
        f2 = 65,
        f3 = 66,
        f4 = 67,
        f5 = 68,
        f6 = 69,
        f7 = 70,
        f8 = 71,
        f9 = 72,
        f10 = 73,
        f11 = 74,
        f12 = 75,
        numlock = 76,
        scrolllock = 77,
        ';' = 78,
        semicolon = 79,
        equal = 80,
        '=' = 81,
        ',' = 82,
        comma = 83,
        dash = 84,
        '.' = 85,
        period = 86,
        forwardslash = 87,
        grave = 88,
        '[' = 89,
        openbracket = 90,
        backslash = 91,
        ']' = 92,
        closebracket = 93,
        quote = 94,
        dpadLeft = 95,
        dpadRight = 96,
        dpadUp = 97,
        dpadDown = 98,
        dpadCenter = 99
    }
    function getKeyCode(key: Keyboard): any;
    class ButtonMap {
        button: Button;
        key: Keyboard;
        constructor(...args: any[]);
    }
    class Controller extends cc.Component {
        player: Player;
        _buttons: ButtonMap[];
        get buttons(): ButtonMap[];
        set buttons(value: ButtonMap[]);
        private _nes;
        private _keymap;
        onLoad(): void;
        onDestroy(): void;
        private onNodeButtonEvent;
        onButtonEvent(button: Button, down: boolean): void;
        private onKeyDown;
        private onKeyUp;
        private updateButtonMap;
    }
}
declare module lcc$nes {
    class DisplaySprites extends cc.Component {
        _sprites: cc.Sprite[];
        get sprites(): cc.Sprite[];
        set sprites(value: cc.Sprite[]);
        private _emulator;
        onLoad(): void;
        private setDisplaySprites;
    }
}

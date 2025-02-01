仓库地址:[**lcc-nes**](https://github.com/lichongyang-LCY/lcc-nes "lcc-nes")

# lcc-nes
Cocos Creator 嵌入FC(小霸王游戏)模拟器插件。

## 前言
最近在vscode上发现一个小霸王插件，间接的了解到有纯js实现的FC模拟器[**jsnes**](https://github.com/bfirsh/jsnes.git "jsnes")。于是手痒，就做了这样一个插件。你可以很方便的在你的creator游戏中嵌入这个模拟器，唯一遗憾的是creator不提供脚本控件音频的API，所以目前插件可能只有web平台有声音。（有想是支持原生平台的，但是好像改了底层代码就无法使用这种插件方式了，看以后有空吧）

## 安装
安装十分简单，只要把这个项目作为Creator插件放到插件目录就可以了,具体请查看[**Creator插件包**](https://docs.cocos.com/creator/manual/zh/extension/your-first-extension.html "Creator插件包")。</br>

## 使用
使用也很简单，所有组件在`LCC NES组件`组里面，如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/%E6%97%A0%E6%A0%87%E9%A2%98.png)</br>
### 第一步，先添加`Emulator`组件到节点上。
如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/微信截图_20201030112010.png)</br>
图片里面有个`热血格斗传说.nes`的二进制文件，这是插件里面测试用的，你可以在插件`roms`目录里面找到，这个目录可能后面会删除。所以`ROM`可以自己下载，因为creator二进制文件必须是.bin结尾的，所以你应该需要修改文件后缀名，测试rom位置如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/菜单.png)</br>
### 第二步，添加显示对象。
`Emulator`组件有`getTexture()` 函数可以获得渲染的纹理，你可以用在需要的地方。插件也提供`Sprite`组件的显示方式，可以在节点上添加`DisplaySprites`组件，然后把`Sprite`组件拖到里面的数组中。如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/微信截图_20201030112025.png)</br>
现在应该就可以看到显示的内容了，大概如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/微信截图_20201030135751.png)</br>

### 第三步，添加手柄控制器。
把`Controller`组件添加到里面去，里面可以选择玩家的数量，目前jsnes支持2个玩家，然后就可以修改按键映射。如下图:
</br>![avatar](https://github.com/lichongyang-LCY/lcc-nes/raw/master/docs/微信截图_20201030112038.png)</br>
你也可以在代码里面控制，可以直接看源码：
```
// 常量定义，注意模块嵌套
module lcc.nes {

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

}
```
* 通过节点事件控制游戏: nes_button_event 
```
// 玩家1，游戏按钮A， 按下
this.emit("nes_button_event", lcc.nes.Player.PLAYER_1, lcc.nes.Button.A, true);

// 玩家1，游戏按钮A， 放开
this.emit("nes_button_event", lcc.nes.Player.PLAYER_1, lcc.nes.Button.A, false);

// 注意: 虽然是直接通过代码控制，但是PLAYER_1玩家的控制器必须存在。也就是说必须有PLAYER_1的Controller在节点上。
```
* 也可以直接获取`Controller`组件，调用`onButtonEvent(lcc.nes.Button.A, true)`这种方式实现。

# 结束语
不管能不能用上，先储备起来。。。


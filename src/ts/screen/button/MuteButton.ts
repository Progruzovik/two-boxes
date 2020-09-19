import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class MuteButton extends druid.ToggleButton {

    constructor() {
        const audioIcon = new PIXI.Sprite(PIXI.Loader.shared.resources["audio"].texture);
        const audioMutedIcon = new PIXI.Sprite(PIXI.Loader.shared.resources["audio-muted"].texture);
        super("", audioIcon, audioIcon, audioIcon, audioMutedIcon, audioIcon);
    }
}

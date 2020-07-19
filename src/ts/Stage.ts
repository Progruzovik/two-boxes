import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class Stage extends druid.ScalableBranch {

    private static readonly WIDTH = 902;
    private static readonly HEIGHT = 705;

    constructor() {
        super();
        this.pivot.set(Stage.WIDTH / 2, Stage.HEIGHT / 2);
        this.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture));
    }
}

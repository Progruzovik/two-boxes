import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class Stage extends druid.ScalableBranch {

    private static readonly WIDTH = 902;
    private static readonly HEIGHT = 705;

    private currentItem: PIXI.Sprite;

    constructor() {
        super();
        this.pivot.set(Stage.WIDTH / 2, Stage.HEIGHT / 2);
        this.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture));
    }

    setUpItem(item: string) {
        if (this.currentItem != null) {
            this.removeChild(this.currentItem);
        }
        this.currentItem = new PIXI.Sprite(PIXI.Loader.shared.resources[item].texture);
        this.currentItem.anchor.set(0.5, 0.5);
        this.currentItem.position.set(Stage.WIDTH / 2, Stage.HEIGHT / 5);
        this.addChild(this.currentItem);
    }
}

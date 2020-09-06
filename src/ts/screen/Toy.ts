import * as PIXI from "pixi.js";
import * as druid from "pixi-druid";
import { Item } from "../util";

export class Toy extends PIXI.Container {

    private readonly highlighting: druid.Rectangle;

    constructor(readonly item: Item) {
        super();
        const texture: PIXI.Texture = PIXI.Loader.shared.resources[item.name].texture;
        this.highlighting = new druid.Rectangle(texture.width, texture.height, 0xffff00);
        this.highlighting.alpha = 0.3;
        this.highlighting.visible = false;
        this.addChild(this.highlighting);
        this.addChild(new PIXI.Sprite(texture));

        this.pivot.set(this.width / 2, this.height / 2);
    }

    highlight() {
        this.highlighting.visible = true;
    }

    removeHighLighting() {
        this.highlighting.visible = false;
    }
}

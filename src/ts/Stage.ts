import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { Box, Item } from "./util";

export class Stage extends druid.ScalableBranch {

    static readonly ITEM_MOVED = "itemMoved";

    private static readonly WIDTH = 902;
    private static readonly HEIGHT = 705;
    private static readonly ITEM_SPEED = 10;

    private isCurrentItemMoving = false;

    private readonly boxTom = new PIXI.Sprite(PIXI.Loader.shared.resources["box-tom"].texture);
    private readonly boxJenny = new PIXI.Sprite(PIXI.Loader.shared.resources["box-jenny"].texture);

    private currentItem: Item;
    private currentItemSprite: PIXI.Sprite;

    constructor() {
        super(true);
        this.pivot.set(Stage.WIDTH / 2, Stage.HEIGHT / 2);
        this.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture));
        this.boxTom.anchor.set(0.5, 0);
        this.boxTom.position.set(Stage.WIDTH / 4, Stage.HEIGHT - this.boxTom.height);
        this.addChild(this.boxTom);
        this.boxJenny.anchor.set(0.5, 0);
        this.boxJenny.position.set(Stage.WIDTH * 3 / 4, Stage.HEIGHT - this.boxJenny.height);
        this.addChild(this.boxJenny);
    }

    protected update(deltaTime: number) {
        if (!this.isCurrentItemMoving || this.currentItem == null) {
            this.isCurrentItemMoving = false;
            return;
        }

        const destination: PIXI.Sprite = this.currentItem.box == Box.Tom ? this.boxTom : this.boxJenny;
        const dx: number = destination.x - this.currentItemSprite.x;
        const dy: number = destination.y - this.currentItemSprite.y;
        if (Math.abs(dx) + Math.abs(dy) > Stage.ITEM_SPEED) {
            const angle: number = Math.atan2(dy, dx);
            this.currentItemSprite.x += Stage.ITEM_SPEED * Math.cos(angle) * deltaTime;
            this.currentItemSprite.y += Stage.ITEM_SPEED * Math.sin(angle) * deltaTime;
        } else {
            this.resetCurrentItem();
            this.emit(Stage.ITEM_MOVED);
        }
    }

    moveCurrentItemIntoBox() {
        this.isCurrentItemMoving = true;
    }

    setUpItem(item: Item) {
        this.resetCurrentItem();

        this.currentItem = item;
        this.currentItemSprite = new PIXI.Sprite(PIXI.Loader.shared.resources[item.name].texture);
        this.currentItemSprite.anchor.set(0.5, 0.5);
        this.currentItemSprite.position.set(Stage.WIDTH / 2, Stage.HEIGHT / 5);
        this.addChild(this.currentItemSprite);
    }

    private resetCurrentItem() {
        this.isCurrentItemMoving = false;
        this.currentItem = null;
        if (this.currentItemSprite != null) {
            this.removeChild(this.currentItemSprite);
            this.currentItemSprite = null;
        }
    }
}

import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { Box, Item } from "../util";
import { Toy } from "./Toy";

export class Stage extends druid.ScalableBranch {

    static readonly TOY_MOVED = "toyMoved";

    private static readonly WIDTH = 902;
    private static readonly HEIGHT = 705;
    private static readonly TOY_INDENT = 100;
    private static readonly TOY_SPEED = 10;

    private isCurrentToyMoving = false;

    private readonly boxTom = new PIXI.Sprite(PIXI.Loader.shared.resources["box-tom"].texture);
    private readonly boxJenny = new PIXI.Sprite(PIXI.Loader.shared.resources["box-jenny"].texture);

    private currentToyIndex: number = -1;
    private readonly toys: Toy[] = [];

    constructor(items: Item[]) {
        super(true);
        this.pivot.set(Stage.WIDTH / 2, Stage.HEIGHT / 2);
        this.addChild(new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture));
        this.boxTom.anchor.set(0.5, 0);
        this.boxTom.position.set(Stage.WIDTH / 4, Stage.HEIGHT - this.boxTom.height);
        this.addChild(this.boxTom);
        this.boxJenny.anchor.set(0.5, 0);
        this.boxJenny.position.set(Stage.WIDTH * 3 / 4, Stage.HEIGHT - this.boxJenny.height);
        this.addChild(this.boxJenny);

        items.forEach((item, i) => {
            const toy = new Toy(item);
            toy.x = Stage.TOY_INDENT + (Stage.WIDTH - Stage.TOY_INDENT * 2) / items.length * i;
            toy.y = Stage.HEIGHT / 5 + Stage.HEIGHT / 4 * (i % 3);
            this.toys.push(toy);
            this.addChild(toy);
        });
    }

    protected update(deltaTime: number) {
        if (!this.isCurrentToyMoving || this.currentToy == null) {
            this.isCurrentToyMoving = false;
            return;
        }

        const destination: PIXI.Sprite = this.currentToy.item.box == Box.Tom ? this.boxTom : this.boxJenny;
        const dx: number = destination.x - this.currentToy.x;
        const dy: number = destination.y - this.currentToy.y;
        if (Math.abs(dx) + Math.abs(dy) > Stage.TOY_SPEED) {
            const angle: number = Math.atan2(dy, dx);
            this.currentToy.x += Stage.TOY_SPEED * Math.cos(angle) * deltaTime;
            this.currentToy.y += Stage.TOY_SPEED * Math.sin(angle) * deltaTime;
        } else {
            this.resetCurrentToy();
            this.emit(Stage.TOY_MOVED);
        }
    }

    moveCurrentToyIntoBox() {
        this.isCurrentToyMoving = true;
        this.currentToy.removeHighLighting();
    }

    setUpItem(item: Item) {
        this.resetCurrentToy();
        this.currentToyIndex = this.toys.findIndex(t => t.item.name == item.name);
        this.setChildIndex(this.currentToy, this.children.length - 1);
        this.currentToy.highlight();
    }

    private get currentToy(): Toy {
        return this.currentToyIndex == -1 ? null : this.toys[this.currentToyIndex];
    }

    private resetCurrentToy() {
        this.isCurrentToyMoving = false;
        if (this.currentToy != null) {
            this.removeChild(this.currentToy);
            this.currentToyIndex = -1;
        }
    }
}

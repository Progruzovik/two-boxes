import * as PIXI from "pixi.js";
import { Box, Item } from "../util";

export class ItemService extends PIXI.utils.EventEmitter {

    static readonly SUCCESS = "success";
    static readonly MISTAKE = "mistake";

    private currentIndex: number;
    private readonly items: Item[] = [];

    get currentItem(): Item {
        return this.items[this.currentIndex];
    }

    constructor() {
        super();
        this.items.push(
            { name: "ball", box: Box.Jenny },
            { name: "bear", box: Box.Jenny },
            { name: "car", box: Box.Tom },
            { name: "cat", box: Box.Jenny },
            { name: "doll", box: Box.Jenny },
            { name: "horse", box: Box.Jenny },
            { name: "plane", box: Box.Tom },
            { name: "ship", box: Box.Tom },
            { name: "train", box: Box.Tom }
        );
        this.updateItem();
    }

    createExceptedString(): String {
        return `put the ${this.currentItem.name} into ${this.currentItem.box} box`
    }

    checkResult(result: boolean) {
        if (result) {
            this.updateItem();
            this.emit(ItemService.SUCCESS, this.currentItem);
        } else {
            this.emit(ItemService.MISTAKE);
        }
    }

    private updateItem() {
        let nextIndex: number = this.currentIndex;
        while (nextIndex == this.currentIndex) {
            nextIndex = Math.floor(Math.random() * this.items.length);
        }
        this.currentIndex = nextIndex;
    }
}

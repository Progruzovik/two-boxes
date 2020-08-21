import * as PIXI from "pixi.js";
import { Box, Item, RecognitionResult } from "../util";

export class ItemService extends PIXI.utils.EventEmitter {

    static readonly SUCCESS = "success";
    static readonly MISTAKE = "mistake";

    private currentIndex: number;
    readonly items: Item[] = [];

    get isFinished(): boolean {
        return this.items.length == 0;
    }

    get currentItem(): Item {
        return this.items[this.currentIndex];
    }

    constructor() {
        super();
        this.items.push(
            { name: "ball", box: Box.Jenny },
            { name: "cat", box: Box.Jenny },
            { name: "doll", box: Box.Jenny },
            { name: "car", box: Box.Tom },
            { name: "plane", box: Box.Tom },
            { name: "horse", box: Box.Jenny },
            { name: "bear", box: Box.Jenny },
            { name: "ship", box: Box.Tom },
            { name: "train", box: Box.Tom }
        );
        this.updateItem();
    }

    createExceptedString(): String {
        return `put the ${this.currentItem.name} into ${this.currentItem.box} box`
    }

    checkResult(result: RecognitionResult) {
        if (result.isRecognized) {
            this.updateItem();
            this.emit(ItemService.SUCCESS, this.currentItem);
        } else {
            this.emit(ItemService.MISTAKE, result.lastWord);
        }
    }

    private updateItem() {
        if (this.items.length > 0) {
            this.items.splice(this.currentIndex, 1);
            this.currentIndex = Math.floor(Math.random() * this.items.length);
        }
    }
}

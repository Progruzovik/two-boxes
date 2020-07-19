import * as PIXI from "pixi.js";

export class ItemService extends PIXI.utils.EventEmitter {

    static readonly SUCCESS = "success";
    static readonly MISTAKE = "mistake";

    private currentIndex: number;
    private readonly items: string[] = [];

    get currentItem(): string {
        return this.items[this.currentIndex];
    }

    constructor() {
        super();
        this.items.push(
            "ball",
            "bear",
            "car",
            "cat",
            "doll",
            "horse",
            "plane",
            "ship",
            "train"
        );
        this.updateItem();
    }

    checkItem(data: string[]) {
        if (data.includes(this.currentItem)) {
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

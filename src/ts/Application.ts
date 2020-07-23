import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { Root } from "./Root";
import { SpeechService } from "./service/speech/SpeechService";
import { ItemService } from "./service/ItemService";

export class Application extends druid.App {

    constructor(ratio: number, width: number, height: number, itemService: ItemService, speechService: SpeechService) {
        super(ratio, width, height, 0xffffff);
        PIXI.Loader.shared
            .add("ball", "img/ball.jpg")
            .add("bear", "img/bear.png")
            .add("bg", "img/bg.jpg")
            .add("box-jenny", "img/box-jenny.png")
            .add("box-tom", "img/box-tom.png")
            .add("car", "img/car.png")
            .add("cat", "img/cat.jpg")
            .add("doll", "img/doll.png")
            .add("horse", "img/horse.png")
            .add("plane", "img/plane.png")
            .add("ship", "img/ship.png")
            .add("train", "img/train.png");
        PIXI.Loader.shared.load(() => this.root = new Root(itemService, speechService));
    }
}

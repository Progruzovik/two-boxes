import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { Root } from "./screen/Root";
import { SpeechService } from "./service/speech/SpeechService";
import { ItemService } from "./service/ItemService";
import { AudioService } from "./service/AudioService";

export class Application extends druid.App {

    constructor(
        ratio: number,
        width: number,
        height: number,
        itemService: ItemService,
        audioService: AudioService,
        speechService: SpeechService
    ) {
        super(ratio, width, height, 0xffffff);
        PIXI.Loader.shared
            .add("ball", "img/toy/ball.jpg")
            .add("bear", "img/toy/bear.png")
            .add("car", "img/toy/car.png")
            .add("cat", "img/toy/cat.jpg")
            .add("doll", "img/toy/doll.png")
            .add("horse", "img/toy/horse.png")
            .add("plane", "img/toy/plane.png")
            .add("ship", "img/toy/ship.png")
            .add("train", "img/toy/train.png")
            .add("audio", "img/audio.png")
            .add("audio-muted", "img/audio-muted.png")
            .add("bg", "img/bg.jpg")
            .add("box-jenny", "img/box-jenny.png")
            .add("box-tom", "img/box-tom.png");
        PIXI.Loader.shared.load(() => this.root = new Root(itemService, audioService, speechService));
    }
}

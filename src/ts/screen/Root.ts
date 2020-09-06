import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { SpeechService } from "../service/speech/SpeechService";
import { Stage } from "./Stage";
import { ItemService } from "../service/ItemService";
import { PauseWindow } from "./window/PuseWindow";

export class Root extends druid.Branch {

    private readonly stage = new Stage(this.itemService.items);

    private readonly txtLastWord = new PIXI.Text("", { align: "left", fill: "red", fontSize: 28 });
    private readonly txtStatus = new PIXI.Text("Yep!", { align: "center", fill: "green", fontSize: 28 });
    private readonly txtFinish = new PIXI.Text("That's All Folks!", { align: "center", fontSize: 42 });
    private readonly btnSpeech = new druid.Button();

    private readonly pauseWindow = new PauseWindow();

    constructor(private readonly itemService: ItemService, private readonly speechService: SpeechService) {
        super();
        this.stage.setUpItem(itemService.currentItem);
        this.addChild(this.stage);

        this.txtLastWord.visible = false;
        this.txtLastWord.anchor.set(1, 0);
        this.addChild(this.txtLastWord);
        this.txtStatus.visible = false;
        this.txtStatus.anchor.set(0.5, 1);
        this.addChild(this.txtStatus);
        this.txtFinish.anchor.set(0.5, 0.5);

        this.btnSpeech.pivot.set(this.btnSpeech.width / 2, this.btnSpeech.height);
        this.updateButtonState();
        this.addChild(this.btnSpeech);

        this.updateState();

        itemService.on(ItemService.SUCCESS, () => {
            this.txtLastWord.visible = false;
            this.txtStatus.visible = true;
            this.stage.moveCurrentToyIntoBox();
        });
        itemService.on(ItemService.MISTAKE, (lastWord: string) => {
            this.txtLastWord.text = lastWord;
            this.txtLastWord.visible = true;
            this.txtStatus.visible = false;
            this.speechService.makeReady();
        });
        speechService.on(SpeechService.STATUS_UPDATE, () => this.updateState());

        this.stage.on(Stage.TOY_MOVED, () => {
            if (this.itemService.isFinished) {
                this.removeChildren();
                this.addChild(this.txtFinish);
            } else {
                this.stage.setUpItem(this.itemService.currentItem);
                this.speechService.makeReady();
            }
        });
        this.btnSpeech.on(druid.Button.TRIGGERED, () => {
            if (this.speechService.status == SpeechService.Status.Recording) {
                this.speechService.stop();
            }
        });
        this.pauseWindow.btnStart.on(druid.Button.TRIGGERED, () => this.speechService.start());
    }

    resize(width: number, height: number) {
        this.stage.resize(width, height);
        this.stage.position.set(width / 2, height / 2);
        this.txtLastWord.position.set(width, 0);
        this.btnSpeech.position.set(width / 2, height);
        this.txtStatus.position.set(this.btnSpeech.x, this.btnSpeech.y - this.btnSpeech.height);
        this.txtFinish.position.set(width / 2, height / 2);

        this.pauseWindow.resize(width, height);
    }

    private updateState() {
        if (this.speechService.status == SpeechService.Status.Ready) {
            this.addChild(this.pauseWindow);
        } else {
            this.txtLastWord.visible = false;
            this.removeChild(this.pauseWindow);
        }
        if (this.speechService.status != SpeechService.Status.Waiting) {
            this.txtStatus.visible = false;
        }
        this.updateButtonState();
    }

    private updateButtonState() {
        switch (this.speechService.status) {
            case SpeechService.Status.Loading:
                this.btnSpeech.text = "Loading";
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.Recording:
                this.btnSpeech.text = "Stop";
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.Processing:
                this.btnSpeech.text = "Processing";
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.Ready: case SpeechService.Status.Waiting:
                this.btnSpeech.visible = false;
                break;
        }
    }
}

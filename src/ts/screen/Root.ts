import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { SpeechService } from "../service/speech/SpeechService";
import { Stage } from "./Stage";
import { ItemService } from "../service/ItemService";

export class Root extends druid.Branch {

    private readonly btnSpeech = new druid.Button();

    constructor(private readonly itemService: ItemService, private readonly speechService: SpeechService) {
        super();
        const stage = new Stage(itemService.items);
        stage.setUpItem(itemService.currentItem);
        this.addChild(stage);

        const txtLastWord = new PIXI.Text("", { align: "left", fill: "red", fontSize: 28 });
        txtLastWord.visible = false;
        txtLastWord.anchor.set(1, 0);
        this.addChild(txtLastWord);
        const txtStatus = new PIXI.Text("Yep!", { align: "center", fill: "green", fontSize: 28 });
        txtStatus.visible = false;
        txtStatus.anchor.set(0.5, 1);
        this.addChild(txtStatus);
        const txtFinish = new PIXI.Text("That's All Folks!", { align: "center", fontSize: 42 });
        txtFinish.anchor.set(0.5, 0.5);

        this.btnSpeech.pivot.set(this.btnSpeech.width / 2, this.btnSpeech.height);
        this.updateButtonState();
        this.addChild(this.btnSpeech);

        itemService.on(ItemService.SUCCESS, () => {
            txtLastWord.visible = false;
            txtStatus.visible = true;
            stage.moveCurrentToyIntoBox();
        });
        itemService.on(ItemService.MISTAKE, (lastWord: string) => {
            txtLastWord.text = lastWord;
            txtLastWord.visible = true;
            txtStatus.visible = false;
            this.speechService.makeReady();
        });
        speechService.on(SpeechService.STATUS_UPDATE, (status: SpeechService.Status) => {
            if (status != SpeechService.Status.Ready) {
                txtLastWord.visible = false;
            }
            if (status != SpeechService.Status.Waiting) {
                txtStatus.visible = false;
            }
            this.updateButtonState();
        });
        this.btnSpeech.on(druid.Button.TRIGGERED, () => {
            if (this.speechService.status == SpeechService.Status.Recording) {
                this.speechService.stop();
            } else if (this.speechService.status == SpeechService.Status.Ready) {
                this.speechService.start();
            }
        });
        stage.on(Stage.TOY_MOVED, () => {
            if (this.itemService.isFinished) {
                this.removeChildren();
                this.addChild(txtFinish);
            } else {
                stage.setUpItem(this.itemService.currentItem);
                this.speechService.makeReady();
            }
        });
        this.on(druid.Event.RESIZE, (width, height) => {
            stage.resize(width, height);
            stage.position.set(width / 2, height / 2);
            txtLastWord.position.set(width, 0);
            this.btnSpeech.position.set(width / 2, height);
            txtStatus.position.set(this.btnSpeech.x, this.btnSpeech.y - this.btnSpeech.height);
            txtFinish.position.set(width / 2, height / 2);
        });
    }

    private updateButtonState() {
        switch (this.speechService.status) {
            case SpeechService.Status.Loading:
                this.btnSpeech.text = "Loading";
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.Ready:
                this.btnSpeech.text = "Start";
                this.btnSpeech.isEnabled = true;
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
            case SpeechService.Status.Waiting:
                this.btnSpeech.visible = false;
                break;
        }
    }
}

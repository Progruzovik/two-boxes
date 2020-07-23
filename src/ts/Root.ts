import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { SpeechService } from "./service/speech/SpeechService";
import { Stage } from "./Stage";
import { ItemService } from "./service/ItemService";

export class Root extends druid.Branch {

    private readonly btnSpeech = new druid.Button();

    constructor(private readonly itemService: ItemService, private readonly speechService: SpeechService) {
        super();
        const stage = new Stage();
        stage.setUpItem(itemService.currentItem);
        this.addChild(stage);

        const txtStatus = new PIXI.Text("Yep!", { align: "center", fill: "green", fontSize: 28 });
        txtStatus.visible = false;
        txtStatus.anchor.set(0.5, 1);
        this.addChild(txtStatus);
        this.btnSpeech.pivot.set(this.btnSpeech.width / 2, this.btnSpeech.height);
        this.updateButtonState();
        this.addChild(this.btnSpeech);

        itemService.on(ItemService.SUCCESS, () => {
            txtStatus.visible = true;
            stage.moveCurrentItemIntoBox();
        });
        itemService.on(ItemService.MISTAKE, () => {
            txtStatus.visible = false;
            this.speechService.makeReady();
        });
        speechService.on(SpeechService.STATUS_UPDATE, (status: SpeechService.Status) => {
            if (status != SpeechService.Status.WAITING) {
                txtStatus.visible = false;
            }
            this.updateButtonState();
        });
        this.btnSpeech.on(druid.Button.TRIGGERED, () => {
            if (this.speechService.status == SpeechService.Status.RECORDING) {
                this.speechService.stop();
            } else if (this.speechService.status == SpeechService.Status.READY) {
                this.speechService.start();
            }
        });
        stage.on(Stage.ITEM_MOVED, () => {
            stage.setUpItem(this.itemService.currentItem);
            this.speechService.makeReady();
        });
        this.on(druid.Event.RESIZE, (width, height) => {
            stage.resize(width, height);
            stage.position.set(width / 2, height / 2);
            this.btnSpeech.position.set(width / 2, height);
            txtStatus.position.set(this.btnSpeech.x, this.btnSpeech.y - this.btnSpeech.height);
        });
    }

    private updateButtonState() {
        switch (this.speechService.status) {
            case SpeechService.Status.LOADING:
                this.btnSpeech.text = "Loading";
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.READY:
                this.btnSpeech.text = "Start";
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.RECORDING:
                this.btnSpeech.text = "Stop";
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.PROCESSING:
                this.btnSpeech.text = "Processing";
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.visible = true;
                break;
            case SpeechService.Status.WAITING:
                this.btnSpeech.visible = false;
                break;
        }
    }
}

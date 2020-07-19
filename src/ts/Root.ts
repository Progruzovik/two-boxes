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

        itemService.on(ItemService.SUCCESS, (nextItem: string) => {
            txtStatus.visible = true;
            stage.setUpItem(nextItem);
        });
        itemService.on(ItemService.MISTAKE, () => txtStatus.visible = false);
        speechService.on(SpeechService.STATUS_UPDATE, (status: SpeechService.Status) => {
            if (status != SpeechService.Status.READY) {
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
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.text = "Loading";
                break;
            case SpeechService.Status.READY:
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.text = "Start";
                break;
            case SpeechService.Status.RECORDING:
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.text = "Stop";
                break;
            case SpeechService.Status.PROCESSING:
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.text = "Processing";
                break;
        }
    }
}

import * as druid from "pixi-druid";
import { SpeechService } from "./speech/SpeechService";
import { Stage } from "./Stage";

export class Root extends druid.Branch {

    private readonly btnSpeech = new druid.Button();

    constructor(private readonly speechService: SpeechService) {
        super();
        const stage = new Stage();
        this.addChild(stage);

        this.btnSpeech.pivot.set(this.btnSpeech.width / 2, this.btnSpeech.height);
        this.updateButtonState();
        this.addChild(this.btnSpeech);

        speechService.on(SpeechService.STATUS_UPDATE, () => this.updateButtonState());
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
        });
    }

    private updateButtonState() {
        switch (this.speechService.status) {
            case SpeechService.Status.LOADING:
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.text = "Загрузка";
                break;
            case SpeechService.Status.READY:
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.text = "Старт";
                break;
            case SpeechService.Status.RECORDING:
                this.btnSpeech.isEnabled = true;
                this.btnSpeech.text = "Стоп";
                break;
            case SpeechService.Status.PROCESSING:
                this.btnSpeech.isEnabled = false;
                this.btnSpeech.text = "Обработка";
                break;
        }
    }
}

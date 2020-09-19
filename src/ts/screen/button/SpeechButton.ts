import * as druid from "pixi-druid";
import { SpeechService } from "../../service/speech/SpeechService";

export class SpeechButton extends druid.Button {

    updateStatus(status: SpeechService.Status) {
        switch (status) {
            case SpeechService.Status.Loading:
                this.text = "Loading";
                this.isEnabled = false;
                this.visible = true;
                break;
            case SpeechService.Status.Recording:
                this.text = "Stop";
                this.isEnabled = true;
                this.visible = true;
                break;
            case SpeechService.Status.Processing:
                this.text = "Processing";
                this.isEnabled = false;
                this.visible = true;
                break;
            case SpeechService.Status.Ready: case SpeechService.Status.Waiting:
                this.visible = false;
                break;
        }
    }
}

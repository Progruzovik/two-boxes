import { SpeechConverter } from "./SpeechConverter";
import * as PIXI from "pixi.js";
import { ItemService } from "../ItemService";

export class SpeechService extends PIXI.utils.EventEmitter {

    static readonly STATUS_UPDATE = "statusUpdate";

    private static readonly RECORDER_INACTIVE = "inactive";
    private static readonly BACKEND_URL = process.env.NODE_ENV == "production" ? "https://speech-rec.ml" : "http://localhost:8080";

    private _status = SpeechService.Status.LOADING;
    private readonly chunks: Blob[] = [];
    private readonly converter = new SpeechConverter();

    private recorder: MediaRecorder;

    constructor(private readonly itemService: ItemService) {
        super();
    }

    get status(): SpeechService.Status {
        return this._status;
    }

    init(stream: MediaStream) {
        this.recorder = new MediaRecorder(stream);
        this.recorder.onstart = () => this.updateStatus(SpeechService.Status.RECORDING);
        this.recorder.ondataavailable = e => {
            this.chunks.push(e.data);

            if (this.recorder.state == SpeechService.RECORDER_INACTIVE) {
                this.updateStatus(SpeechService.Status.PROCESSING);
                const speech = new Blob(this.chunks, { type: "audio/ogg" });
                this.converter
                    .convertSpeechToWav(speech)
                    .then(wav => fetch(`${SpeechService.BACKEND_URL}/speech`, { method: "POST", body: wav }))
                    .then(r => r.json())
                    .then((d: string[]) => {
                        console.log(d);
                        this.itemService.checkItem(d);
                        this.updateStatus(SpeechService.Status.READY);
                    });
                this.chunks.length = 0;
            }
        };

        this.updateStatus(SpeechService.Status.READY);
    }

    start() {
        this.recorder.start();
    }

    stop() {
        this.recorder.stop();
    }

    private updateStatus(status: SpeechService.Status) {
        this._status = status;
        this.emit(SpeechService.STATUS_UPDATE, status);
    }
}

export namespace SpeechService {

    export enum Status {
        LOADING,
        READY,
        RECORDING,
        PROCESSING
    }
}

declare var process: any;

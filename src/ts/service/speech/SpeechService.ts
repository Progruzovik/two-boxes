import { SpeechConverter } from "./SpeechConverter";
import * as PIXI from "pixi.js";
import { ItemService } from "../ItemService";
import { RecognitionResult } from "../../util";

export class SpeechService extends PIXI.utils.EventEmitter {

    static readonly STATUS_UPDATE = "statusUpdate";

    private static readonly RECORDER_INACTIVE = "inactive";
    private static readonly BACKEND_URL = process.env.NODE_ENV == "production" ? "https://speech-rec.ml" : "http://localhost:8080";

    private _status = SpeechService.Status.Loading;
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
        this.recorder.onstart = () => this.updateStatus(SpeechService.Status.Recording);
        this.recorder.ondataavailable = e => {
            this.chunks.push(e.data);

            if (this.recorder.state == SpeechService.RECORDER_INACTIVE) {
                this.updateStatus(SpeechService.Status.Processing);
                const speech = new Blob(this.chunks, { type: "audio/ogg" });
                this.converter
                    .convertSpeechToWav(speech)
                    .then(wav => {
                        const excepted: String = this.itemService.createExceptedString();
                        return fetch(
                            `${SpeechService.BACKEND_URL}/speech?excepted=${excepted}`,
                            { method: "POST", body: wav }
                            )
                    })
                    .then(r => r.json())
                    .then((r: RecognitionResult) => {
                        this.updateStatus(SpeechService.Status.Waiting);
                        this.itemService.checkResult(r);
                    });
                this.chunks.length = 0;
            }
        };

        this.updateStatus(SpeechService.Status.Ready);
    }

    makeReady() {
        if (this.status == SpeechService.Status.Waiting) {
            this.updateStatus(SpeechService.Status.Ready);
        }
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

    export const enum Status {
        Loading,
        Ready,
        Recording,
        Processing,
        Waiting
    }
}

declare var process: any;

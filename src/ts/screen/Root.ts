import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";
import { SpeechService } from "../service/speech/SpeechService";
import { Stage } from "./Stage";
import { ItemService } from "../service/ItemService";
import { PauseWindow } from "./window/PuseWindow";
import { AudioService } from "../service/AudioService";
import { MuteButton } from "./button/MuteButton";
import { SpeechButton } from "./button/SpeechButton";

export class Root extends druid.Branch {

    private readonly stage = new Stage(this.itemService.items);

    private readonly txtFailedWord = new PIXI.Text("", { align: "left", fill: "red", fontSize: 28 });
    private readonly txtStatus = new PIXI.Text("Good job!", { align: "center", fill: "green", fontSize: 28 });
    private readonly txtFinish = new PIXI.Text("Thank you for your help!", { align: "center", fontSize: 42 });
    private readonly btnSpeech = new SpeechButton();
    private readonly btnMute = new MuteButton();

    private readonly pauseWindow = new PauseWindow();

    constructor(
        private readonly itemService: ItemService,
        private readonly audioService: AudioService,
        private readonly speechService: SpeechService
    ) {
        super();
        this.stage.setUpItem(itemService.currentItem);
        this.addChild(this.stage);

        this.txtFailedWord.visible = false;
        this.txtFailedWord.anchor.set(1, 0);
        this.addChild(this.txtFailedWord);
        this.txtStatus.visible = false;
        this.txtStatus.anchor.set(0.5, 1);
        this.addChild(this.txtStatus);
        this.txtFinish.anchor.set(0.5, 0.5);

        this.btnSpeech.pivot.set(this.btnSpeech.width / 2, this.btnSpeech.height);
        this.btnSpeech.updateStatus(this.speechService.status);
        this.addChild(this.btnSpeech);
        this.btnMute.pivot.set(0, this.btnMute.height);
        this.addChild(this.btnMute);

        this.updateState();

        itemService.on(ItemService.SUCCESS, () => {
            this.txtFailedWord.visible = false;
            this.txtStatus.visible = true;
            this.stage.moveCurrentToyIntoBox();
            audioService.playAudio(AudioService.AudioName.GoodJob);
        });
        itemService.on(ItemService.MISTAKE, (lastWord: string) => {
            this.txtFailedWord.text = lastWord;
            this.txtFailedWord.visible = true;
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
        this.btnMute.on(druid.ToggleButton.TOGGLE, (isToggled: boolean) => this.audioService.isMuted = isToggled);

        this.pauseWindow.btnStart.on(druid.Button.TRIGGERED, () => this.speechService.start());
    }

    resize(width: number, height: number) {
        this.stage.resize(width, height);
        this.stage.position.set(width / 2, height / 2);
        this.txtFailedWord.position.set(width, 0);
        this.btnSpeech.position.set(width / 2, height);
        this.txtStatus.position.set(this.btnSpeech.x, this.btnSpeech.y - this.btnSpeech.height);
        this.txtFinish.position.set(width / 2, height / 2);
        this.btnMute.position.set(0, height);

        this.pauseWindow.resize(width, height);
    }

    private updateState() {
        if (this.speechService.status == SpeechService.Status.Ready) {
            this.btnMute.buttonMode = false;
            this.addChild(this.pauseWindow);
        } else {
            this.txtFailedWord.visible = false;
            this.btnMute.buttonMode = true;
            this.removeChild(this.pauseWindow);
        }
        if (this.speechService.status != SpeechService.Status.Waiting) {
            this.txtStatus.visible = false;
        }
        this.btnSpeech.updateStatus(this.speechService.status);
    }
}

import { Application } from "./Application";
import * as PIXI from "pixi.js";
import { SpeechService } from "./service/speech/SpeechService";
import { ItemService } from "./service/ItemService";
import { SilenceService } from "./service/speech/SilenceService";

const silenceService = new SilenceService();
const itemService = new ItemService();
const speechService = new SpeechService(silenceService, itemService);
navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => {
        silenceService.init(s);
        speechService.init(s);
    });

PIXI.Loader.shared.baseUrl = "../";
PIXI.utils.skipHello();
const app = new Application(window.devicePixelRatio, window.innerWidth, window.innerHeight, itemService, speechService);
document.body.appendChild(app.view);

window.onresize = () => app.resize(window.innerWidth, window.innerHeight);

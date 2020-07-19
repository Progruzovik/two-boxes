import { Application } from "./Application";
import * as PIXI from "pixi.js";
import { SpeechService } from "./speech/SpeechService";

const speechService = new SpeechService();
navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(s => speechService.init(s));

PIXI.Loader.shared.baseUrl = "../";
PIXI.utils.skipHello();
const app = new Application(window.devicePixelRatio, window.innerWidth, window.innerHeight, speechService);
document.body.appendChild(app.view);

window.onresize = () => app.resize(window.innerWidth, window.innerHeight);

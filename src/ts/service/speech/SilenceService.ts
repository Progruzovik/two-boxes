import * as PIXI from "pixi.js";

// noinspection JSDeprecatedSymbols
export class SilenceService extends PIXI.utils.EventEmitter {

    static readonly SILENCE = "silence";

    private static readonly SILENCE_TO_NOISE_RATIO = 5 / 6;
    private static readonly SPEAK_TO_SILENCE_RATIO = 3 / 4;
    private static readonly SILENCE_WAITING_MS = 750;

    private isSpeakingStarted = false;
    private lastSilenceTime = 0;

    init(stream: MediaStream) {
        const context = new AudioContext();
        const gain: GainNode = context.createGain();
        gain.connect(context.destination);

        const analyser: AnalyserNode = context.createAnalyser();
        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = 2048;
        const bufferLength: number = analyser.frequencyBinCount;
        const microphoneStream: MediaStreamAudioSourceNode = context.createMediaStreamSource(stream);
        microphoneStream.connect(analyser);

        const scriptProcessor = context.createScriptProcessor(2048, 1, 1);
        scriptProcessor.connect(gain);
        const frequencyDomain = new Uint8Array(bufferLength);
        const timeDomain = new Uint8Array(bufferLength);

        scriptProcessor.onaudioprocess = () => {
            analyser.getByteFrequencyData(frequencyDomain);
            analyser.getByteTimeDomainData(timeDomain);
            if (context.state == "running") {
                let silenceCount = 0;
                for (let i = 0; i < frequencyDomain.length; i++) {
                    if (frequencyDomain[i] == 0) {
                        silenceCount++;
                    }
                }
                if (silenceCount > frequencyDomain.length * SilenceService.SILENCE_TO_NOISE_RATIO) {
                    if (this.isSpeakingStarted) {
                        if (this.lastSilenceTime == 0) {
                            this.lastSilenceTime = Date.now();
                        } else if (Date.now() - this.lastSilenceTime >= SilenceService.SILENCE_WAITING_MS) {
                            this.reset();
                            this.emit(SilenceService.SILENCE);
                        }
                    }
                } else {
                    this.lastSilenceTime = 0;
                }
                if (silenceCount < frequencyDomain.length * SilenceService.SPEAK_TO_SILENCE_RATIO) {
                    this.isSpeakingStarted = true;
                }
            }
        };
    }

    reset() {
        this.isSpeakingStarted = false;
        this.lastSilenceTime = 0;
    }
}

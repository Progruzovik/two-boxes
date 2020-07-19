import * as toWav from "audiobuffer-to-wav";

export class SpeechConverter {

    private static readonly SAMPLE_RATE = 16000;

    convertSpeechToWav(speech: Blob): Promise<Blob> {
        return new Promise<Blob>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const context = new AudioContext({ sampleRate: SpeechConverter.SAMPLE_RATE });
                context.decodeAudioData(reader.result as ArrayBuffer)
                    .then(audio => toWav(audio))
                    .then(wav => resolve(new Blob([wav], { type: "audio/wav" })))
            };
            reader.readAsArrayBuffer(speech);
        });
    }
}

export class AudioService {

    private _isMuted = false
    private readonly currentAudios: HTMLAudioElement[] = [];

    get isMuted(): boolean {
        return this._isMuted;
    }

    set isMuted(value: boolean) {
        this._isMuted = value;
        for (let audio of this.currentAudios) {
            audio.volume = this.volume;
        }
    }

    playAudio(audioName: AudioService.AudioName) {
        if (!this.isMuted) {
            const audio = new Audio(`audio/${audioName}.mp3`);
            audio.volume = this.volume;
            this.currentAudios.push(audio);
            audio.play()
                .finally(() => this.currentAudios.splice(this.currentAudios.indexOf(audio), 1));
        }
    }

    private get volume(): number {
        if (this.isMuted) return 0;
        return 1;
    }
}

export namespace AudioService {

    export const enum AudioName {
        GoodJob = "good-job"
    }
}

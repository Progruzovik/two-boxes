import * as toWav from "audiobuffer-to-wav";

const id = val => document.getElementById(val);
const ul = id('ul');
const gUMbtn = id('gUMbtn');
const btnStart = id('start') as HTMLButtonElement;
let btnStop = id('stop') as HTMLButtonElement;
let recorder;
let counter = 1;
let chunks;

gUMbtn.onclick = () => {
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(s => {
            id('gUMArea').style.display = 'none';
            id('btns').style.display = 'inherit';
            btnStart.removeAttribute('disabled');
            recorder = new MediaRecorder(s);
            recorder.ondataavailable = e => {
                chunks.push(e.data);
                if (recorder.state === 'inactive') {
                    makeLink();
                }
            };
        });
};

btnStart.onclick = () => {
    btnStart.disabled = true;
    btnStop.removeAttribute('disabled');
    chunks = [];
    recorder.start();
};

btnStop.onclick = () => {
    btnStop.disabled = true;
    recorder.stop();
    btnStart.removeAttribute('disabled');
};

function makeLink() {
    const blob = new Blob(chunks, { type: 'audio/ogg' });

    const context = new AudioContext({ sampleRate: 16000 });
    const reader = new FileReader();

    reader.onloadend = () => {
        const myArrayBuffer = reader.result as ArrayBuffer;

        context.decodeAudioData(myArrayBuffer)
            .then(ab => {
                const wav = toWav(ab) as ArrayBuffer;
                const wavBlob = new Blob([wav], { type: 'audio/wav' });

                const url = URL.createObjectURL(wavBlob);
                const li = document.createElement('li');
                const mt = document.createElement('audio');
                const hf = document.createElement('a');

                mt.controls = true;
                mt.src = url;
                hf.href = url;
                hf.download = `${counter++}.wav`;
                hf.innerHTML = `download ${hf.download}`;
                li.appendChild(mt);
                li.appendChild(hf);
                ul.appendChild(li);

                fetch("http://localhost:8080/speech", { method: "POST", body: wavBlob })
                    .then(r => r.json())
                    .then(d => console.log(d));
            });
    };

    reader.readAsArrayBuffer(blob);
}

import * as toWav from "audiobuffer-to-wav";

let log = console.log.bind(console);
const id = val => document.getElementById(val);
const ul = id('ul');
const gUMbtn = id('gUMbtn');
const start = id('start') as HTMLButtonElement;
let stopp = id('stop') as HTMLButtonElement;
let stream;
let recorder;
let counter = 1;
let chunks;

gUMbtn.onclick = e => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(_stream => {
        stream = _stream;
        id('gUMArea').style.display = 'none';
        id('btns').style.display = 'inherit';
        start.removeAttribute('disabled');
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state === 'inactive') makeLink();
        };
        log('got media successfully');
    }).catch(log);
}

start.onclick = e => {
    start.disabled = true;
    stopp.removeAttribute('disabled');
    chunks = [];
    recorder.start();
}

stopp.onclick = e => {
    stopp.disabled = true;
    recorder.stop();
    start.removeAttribute('disabled');
}

function makeLink(){
    let blob = new Blob(chunks, { type: 'audio/ogg' });

    const context = new AudioContext({ sampleRate: 16000 });
    const reader = new FileReader();

    reader.onloadend = () => {

        let myArrayBuffer = reader.result as ArrayBuffer;

        context.decodeAudioData(myArrayBuffer, (audioBuffer) => {
            const wav = toWav(audioBuffer) as ArrayBuffer;
            const wavBlob = new Blob([wav], { type: 'audio/wav' })

            let url = URL.createObjectURL(wavBlob), li = document.createElement('li'),
                mt = document.createElement('audio'),
                hf = document.createElement('a');

            mt.controls = true;
            mt.src = url;
            hf.href = url;
            hf.download = `${counter++}.wav`;
            hf.innerHTML = `download ${hf.download}`;
            li.appendChild(mt);
            li.appendChild(hf);
            ul.appendChild(li);
        });
    };

    //Load blob
    reader.readAsArrayBuffer(blob);
}

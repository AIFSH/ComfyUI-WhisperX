# ComfyUI-WhisperX
a comfyui cuatom node for audio subtitling based on [whisperX](https://github.com/m-bain/whisperX.git) and [translators](https://github.com/UlionTse/translators)
<div>
  <figure>
  <img alt='webpage' src="web.png?raw=true" width="600px"/>
  <figure>
</div>

## Features
- export `srt` file for subtitle was supported
- translate was supported by [translators](https://github.com/UlionTse/translators) with huge number engine
- mutiple speaker diarization was supported by [pyannote-audio](https://github.com/pyannote/pyannote-audio)
- huge comfyui custom nodes can merge in whisperx

## How to use
make sure `ffmpeg` is worked in your commandline
for Linux
```
apt update
apt install ffmpeg
```
for Windows,you can install `ffmpeg` by [WingetUI](https://github.com/marticliment/WingetUI) automatically

then!
```
git clone https://github.com/AIFSH/ComfyUI-WhisperX.git
cd ComfyUI-WhisperX
pip install -r requirements.txt
```
`weights` will be downloaded from huggingface automatically! if you in china,make sure your internet attach the huggingface
or if you still struggle with huggingface, you may try follow [hf-mirror](https://hf-mirror.com/) to config your env.

to speaker diarization, you need!
1. Accept [`pyannote/segmentation-3.0`](https://hf.co/pyannote/segmentation-3.0) user conditions
2. Accept [`pyannote/speaker-diarization-3.1`](https://hf.co/pyannote/speaker-diarization-3.1) user conditions
3. Create access token at [`hf.co/settings/tokens`](https://hf.co/settings/tokens).

## Tutorial
todo

## WeChat Group && Donate
<div>
  <figure>
  <img alt='Wechat' src="wechat.jpg?raw=true" width="300px"/>
  <img alt='donate' src="donate.jpg?raw=true" width="300px"/>
  <figure>
</div>

## Thanks
- [whisperX](https://github.com/m-bain/whisperX.git)
- [translators](https://github.com/UlionTse/translators)

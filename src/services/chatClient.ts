import type {AudioPromptResponse} from "../pages/api/audioPrompt";

export async function chatByAudio(audio: Blob): Promise<AudioPromptResponse> {
    const formData = new FormData();
    console.log(typeof audio, audio)
    const audioFile = new File([audio], 'audio.ogg', {type: audio.type});
    formData.append('audio', audioFile);
    formData.append('language', 'zh');

    const response: Response = await fetch('/api/audioPrompt', {
        method: 'POST',
        body: formData
    });

    return await response.json();
}
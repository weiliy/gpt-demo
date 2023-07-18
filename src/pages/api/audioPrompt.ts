import type {NextApiRequest, NextApiResponse} from "next";

export interface AudioPromptResponse {
   input: string;
   output: string;
   mode: 'happy' | 'neutral' | 'sad';
}

// receive audio blob in form data ('audio/ogg; codecs=opus')
// send audio to open ai whisper api
// send response to client
const audioPromptHandler = (req: NextApiRequest, res: NextApiResponse<AudioPromptResponse> ) => {
    const { method } = req;
    switch (method) {
        case 'POST':
            // TODO: remove mock response
            const n = Math.floor(Math.random() * 3);
            const dt = new Date().toLocaleString()
            if (n === 0) {
                return res.status(200).json({
                    input: 'Hello, my name is John. I am a doctor. Now I will ask you a few questions. What is your name?',
                    output: `My name is AI. I am a robot.${dt}`,
                    mode: 'happy',
                });
            }

            if (n === 1) {
                return res.status(200).json({
                    input: 'Hello, my name is John. I am a doctor. Now I will ask you a few questions. What is your name?',
                    output: `My name is AI. I am a robot.${dt}`,
                    mode: 'neutral',
                });
            }

            if (n === 2) {
                return res.status(200).json({
                    input: 'Hello, my name is John. I am a doctor. Now I will ask you a few questions. What is your name?',
                    output: `My name is AI. I am a robot. ${dt}`,
                    mode: 'sad',
                });
            }

            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
}

export default audioPromptHandler;
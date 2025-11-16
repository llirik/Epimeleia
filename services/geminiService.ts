import { GoogleGenAI, Modality } from "@google/genai";
import type { AppEvent, Settings, VoiceAccent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getBriefingScope = (frequency: Settings['briefingFrequency']) => {
    switch (frequency) {
        case 'daily':
            return "today's upcoming events";
        case 'two-three-days':
            return 'the upcoming 3 days';
        case 'weekly':
            return 'the upcoming week';
        default:
            return 'the upcoming week';
    }
}

export const generateWeeklyBriefing = async (events: AppEvent[], settings: Settings): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const model = 'gemini-2.5-flash';
  
  const today = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const briefingScope = getBriefingScope(settings.briefingFrequency);

  const salutationInstruction = settings.customSalutation
    ? `The user's preferred salutation is "${settings.customSalutation}". Start the briefing by addressing them with this salutation (e.g., "Good morning, ${settings.customSalutation}. Here is your briefing...").`
    : `Start with a friendly, generic opening like "Here's your briefing for ${briefingScope}:".`;

  const prompt = `
    You are a friendly and professional personal assistant. Your task is to generate a concise, easy-to-read summary of the user's schedule.
    The current date is ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
    The user's timezone is ${userTimezone}. All event times in your summary MUST be converted to this timezone.
    Pay special attention to times mentioned in event descriptions (e.g., "9am PST", "14:00 CET") and convert them accurately.
    The user wants a summary for ${briefingScope}, focusing on ${settings.briefingPriority === 'all' ? 'all events' : 'only the most important events'}.

    ${salutationInstruction}
    For each event, mention the day and time clearly.
    If an event description contains a meeting link (Zoom, Teams, etc.), mention that a link is available.
    Keep the tone encouraging and organized.

    Here are the events:
    ${JSON.stringify(events, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const generateSpeech = async (text: string, accent: VoiceAccent): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API key is not configured.");
    }

    // Voice mapping: American -> Zephyr (neutral), British -> Puck (clear British accent)
    const voiceName = accent === 'American' ? 'Zephyr' : 'Puck';

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech with Gemini:", error);
        throw new Error("Failed to generate audio briefing.");
    }
};
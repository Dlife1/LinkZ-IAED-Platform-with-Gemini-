
import { GoogleGenAI, FunctionDeclaration, Type, Tool, Modality } from "@google/genai";
import { ChatMessage, ContextData, UploadedFile } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const generateStrategicBriefingTool: FunctionDeclaration = {
  name: 'generateStrategicBriefing',
  parameters: {
    type: Type.OBJECT,
    description: 'Generates a high-fidelity strategic audio briefing for the artist.',
    properties: {
      title: { type: Type.STRING, description: 'The title of the briefing.' },
      summary: { type: Type.STRING, description: 'A concise summary of the strategic move.' },
      voicePrompt: { type: Type.STRING, description: 'The exact text for the TTS engine to read (should be visionary and professional).' }
    },
    required: ['title', 'summary', 'voicePrompt'],
  },
};

const initiateNegotiationTool: FunctionDeclaration = {
  name: 'initiateNegotiation',
  parameters: {
    type: Type.OBJECT,
    description: 'Initiates an autonomous negotiation mission with a third party.',
    properties: {
      counterparty: { type: Type.STRING, description: 'The entity we are negotiating with.' },
      dealType: { type: Type.STRING, enum: ['Sync', 'Brand', 'Collaboration'] },
      initialOffer: { type: Type.STRING, description: 'The opening term (e.g., "$50k for Global Sync").' }
    },
    required: ['counterparty', 'dealType', 'initialOffer'],
  }
};

const issueMandateTool: FunctionDeclaration = {
  name: 'issueMandate',
  parameters: {
    type: Type.OBJECT,
    description: 'Trigger a strategic deployment mandate.',
    properties: {
      actionName: { type: Type.STRING },
      urgency: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'CRITICAL'] },
    },
    required: ['actionName', 'urgency'],
  },
};

const updateComplianceStatusTool: FunctionDeclaration = {
  name: 'updateComplianceStatus',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates DDEX/SRM status.',
    properties: {
      status: { type: Type.STRING, enum: ['Verified', 'Pending', 'Failed'] },
      srmStatus: { type: Type.STRING, enum: ['Secure', 'Pending', 'Flagged'] },
      protocolVersion: { type: Type.STRING },
      checks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['PASS', 'FAIL', 'WARN'] },
            details: { type: Type.STRING }
          },
          required: ['label', 'status']
        }
      },
      auditLog: { type: Type.ARRAY, items: { type: Type.STRING } },
      violationSummary: { type: Type.STRING },
      remediationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
      ddexXml: { type: Type.STRING }
    },
    required: ['status'],
  },
};

const runViralOpportunityScanTool: FunctionDeclaration = {
  name: 'runViralOpportunityScan',
  parameters: {
    type: Type.OBJECT,
    description: 'Scans global social signals.',
    properties: {
      shazamVelocity: { type: Type.NUMBER },
      tikTokMomentum: { type: Type.NUMBER },
      location: { type: Type.STRING },
      status: { type: Type.STRING, enum: ['Stable', 'Rising', 'Spiking'] },
      recommendedMission: { type: Type.STRING },
      hotspots: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            label: { type: Type.STRING },
            intensity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
          }
        }
      }
    },
    required: ['shazamVelocity', 'tikTokMomentum', 'status']
  }
};

const analyzeMarketOpportunityTool: FunctionDeclaration = {
  name: 'analyzeMarketOpportunity',
  parameters: {
    type: Type.OBJECT,
    description: 'Performs deep-scan of market gaps.',
    properties: {
      hotspots: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            label: { type: Type.STRING },
            intensity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
          }
        }
      },
      recommendedMission: { type: Type.STRING }
    },
    required: ['hotspots', 'recommendedMission']
  }
};

const updateAssetMetadataTool: FunctionDeclaration = {
  name: 'updateAssetMetadata',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates asset metadata.',
    properties: {
      title: { type: Type.STRING },
      artist: { type: Type.STRING },
      isrc: { type: Type.STRING },
      label: { type: Type.STRING },
      genre: { type: Type.STRING },
    },
    required: [], 
  }
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  currentText: string,
  contextData: ContextData,
  attachments: { image?: UploadedFile, audio?: UploadedFile }
) => {
  const apiKey = process.env.API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  
  const formattedHistory = history.filter(m => m.role !== 'system').map(m => ({ 
    role: m.role === 'model' ? 'model' : 'user', 
    parts: [{ text: m.text }] 
  }));

  const currentParts: any[] = [
    { text: `[IAED_CORE_V3.5_TELEMETRY: ${JSON.stringify(contextData)}]\n\nUSER_QUERY: ${currentText}` }
  ];

  if (attachments.image) {
    currentParts.push({ 
      inlineData: { 
        mimeType: attachments.image.mimeType, 
        data: attachments.image.base64 
      } 
    });
  }

  if (attachments.audio) {
    currentParts.push({ 
      inlineData: { 
        mimeType: attachments.audio.mimeType, 
        data: attachments.audio.base64 
      } 
    });
  }

  const tools: Tool[] = [{ functionDeclarations: [
    generateStrategicBriefingTool,
    initiateNegotiationTool,
    issueMandateTool, 
    updateComplianceStatusTool, 
    updateAssetMetadataTool,
    runViralOpportunityScanTool,
    analyzeMarketOpportunityTool
  ]}];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [ ...formattedHistory, { role: 'user', parts: currentParts } ],
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION, 
        tools: tools, 
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 8000 } 
      }
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateAudioBriefing = async (text: string): Promise<string> => {
    const apiKey = process.env.API_KEY || "";
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) throw new Error("Audio generation failed");
    return audioBase64;
};

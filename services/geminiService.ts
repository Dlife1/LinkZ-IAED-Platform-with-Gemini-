
import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { ChatMessage, ContextData, UploadedFile } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Define the function tool
const issueMandateTool: FunctionDeclaration = {
  name: 'issueMandate',
  parameters: {
    type: Type.OBJECT,
    description: 'Trigger a strategic deployment mandate when synergy conditions are met.',
    properties: {
      actionName: {
        type: Type.STRING,
        description: 'The short name of the action to execute (e.g., "DEPLOY_SMART_CONTRACT", "INITIATE_PITCH").',
      },
      urgency: {
        type: Type.STRING,
        enum: ['LOW', 'MEDIUM', 'CRITICAL'],
        description: 'The urgency level of this mandate.',
      },
    },
    required: ['actionName', 'urgency'],
  },
};

const updateComplianceStatusTool: FunctionDeclaration = {
  name: 'updateComplianceStatus',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the DDEX compliance and SRM (Strategic Rights Management) status based on asset analysis.',
    properties: {
      status: {
        type: Type.STRING,
        enum: ['Verified', 'Pending', 'Failed'],
        description: 'The determined compliance status of the asset.',
      },
      srmStatus: {
        type: Type.STRING,
        enum: ['Secure', 'Pending', 'Flagged'],
        description: 'The Strategic Rights Management status.',
      },
      violationSummary: {
        type: Type.STRING,
        description: 'A brief summary of the primary violation if Failed (e.g. "Invalid ISRC format").',
      }
    },
    required: ['status'],
  },
};

const manageRolloutTool: FunctionDeclaration = {
  name: 'manageRollout',
  parameters: {
    type: Type.OBJECT,
    description: 'Manages the phased distribution rollout protocol.',
    properties: {
      action: {
        type: Type.STRING,
        enum: ['START', 'UPDATE', 'HALT'],
        description: 'Action to perform on the rollout.',
      },
      percentage: {
        type: Type.NUMBER,
        description: 'The target percentage for the rollout (0-100). Required for START and UPDATE.',
      }
    },
    required: ['action'],
  }
};

const updateAssetMetadataTool: FunctionDeclaration = {
  name: 'updateAssetMetadata',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates specific metadata fields for the current asset to ensure DDEX compliance or store analysis results.',
    properties: {
      title: { type: Type.STRING, description: 'The track title.' },
      artist: { type: Type.STRING, description: 'The performing artist.' },
      isrc: { type: Type.STRING, description: 'The International Standard Recording Code.' },
      label: { type: Type.STRING, description: 'The record label.' },
      genre: { type: Type.STRING, description: 'The primary genre.' },
      mood: { type: Type.STRING, description: 'The mood of the track (e.g. Energetic, Melancholic).' },
      productionQuality: { type: Type.STRING, description: 'Assessment of production quality (e.g. Demo, Professional, High Fidelity).' },
    },
    required: [], // All optional to allow partial updates
  }
};

const regenerateAssetIdTool: FunctionDeclaration = {
  name: 'regenerateAssetId',
  parameters: {
    type: Type.OBJECT,
    description: 'Regenerates the Asset ID if the current one is invalid or upon user request.',
    properties: {
      reason: {
        type: Type.STRING,
        description: 'Reason for regeneration (e.g., "Invalid Format", "User Request").',
      }
    },
    required: [],
  }
};

const manageAccessibilityTool: FunctionDeclaration = {
  name: 'manageAccessibility',
  parameters: {
    type: Type.OBJECT,
    description: 'Manages the Accessible Screen Reader API and WCAG compliance checks.',
    properties: {
      action: {
        type: Type.STRING,
        enum: ['ACTIVATE_API', 'RUN_AUDIT'],
        description: 'Activate the Screen Reader API or run a WCAG compliance audit.',
      },
    },
    required: ['action'],
  }
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  currentText: string,
  contextData: ContextData,
  attachments: { image?: UploadedFile, audio?: UploadedFile }
) => {
  const apiKey = process.env.API_KEY || "";
  // In the web container, assume api key is injected or handled. 
  // If not, we cannot proceed.
  
  // We initialize new client per request to ensure latest config (e.g. key from context if we had it)
  const ai = new GoogleGenAI({ apiKey });

  // Filter history to exclude system messages or client-only metadata
  // We need to format strictly for the SDK
  const formattedHistory = history
    .filter(m => m.role !== 'system')
    .map(m => {
      const parts: any[] = [{ text: m.text }];
      // Note: In a real app, we'd persist the inlineData in history if supported by storage cost,
      // or rely on the context. For now, we only send current attachments.
      return {
        role: m.role === 'model' ? 'model' : 'user',
        parts
      };
    });

  const currentParts: any[] = [{ 
    text: `[SYSTEM_DATA: ${JSON.stringify(contextData)}]\n\nUSER_QUERY: ${currentText}` 
  }];

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

  // Define tools configuration
  const tools: Tool[] = [{ functionDeclarations: [
    issueMandateTool, 
    updateComplianceStatusTool, 
    manageRolloutTool, 
    updateAssetMetadataTool,
    regenerateAssetIdTool,
    manageAccessibilityTool
  ]}];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
        temperature: 0.4,
        // Explicitly enable thinking for Gemini 2.5 Flash to improve strategic reasoning
        thinkingConfig: { thinkingBudget: 2048 },
      }
    });

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
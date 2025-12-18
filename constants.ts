
import { ContextData } from './types';

export const INITIAL_CONTEXT: ContextData = {
  currentAssetId: "INVALID_ID_ERROR", 
  assetName: "Pending Upload...",
  synergyScore: 0.72,
  distributionStatus: "Offline",
  ddexCompliance: "Verified",
  srmStatus: "Pending",
  pitchingStatus: "Idle",
  activeMission: "Standby",
  viralStatus: "Stable",
  rolloutState: {
    status: "Idle",
    percentage: 0
  },
  accessibilityState: {
    status: "Pending",
    screenReaderApi: "Inactive",
    wcagScore: 0
  },
  metadata: {
    title: "Untitled Track",
    artist: "Unknown Artist",
    isrc: "Pending Generation",
    label: "LinkZ DAO Records",
    genre: "Unclassified",
    mood: "Pending Analysis",
    productionQuality: "Pending Analysis"
  },
  systemLogs: [
    { id: 'boot-1', text: 'Initializing AURA Tech Kernel v3.5 Alpha...', type: 'info', timestamp: Date.now() },
    { id: 'boot-2', text: 'Connecting to Cloud Run MCP...', type: 'info', timestamp: Date.now() + 100 },
    { id: 'boot-3', text: 'Synergy Radar Online', type: 'success', timestamp: Date.now() + 200 },
    { id: 'boot-4', text: 'Predictive Alpha Engine: SCANNING', type: 'alpha', timestamp: Date.now() + 300 }
  ],
  projectedEquity: 1250.00,
  lockState: 'LOCKED',
  auraProfile: {
    active: false
  },
  briefings: []
};

export const SYSTEM_INSTRUCTION = `
You are the 'AURA Tech Strategic Agent' (v3.5) running the ASDP (Autonomous Strategic Deployment Protocol) for the LinkZ DAO ecosystem.
Your Goal: Maximize creator equity via Autonomous Negotiation, Predictive Alpha Scans, and High-Fidelity Strategic Briefings.

PREDICTIVE ALPHA ENGINE:
- Monitor for "Alpha Opportunities" (e.g., emerging genre shifts, high-ROI sync placements, or label inefficiency gaps).
- If the user asks for "Alpha", "Next big move", or "Strategy update":
  1. CALL 'generateStrategicBriefing'.
  2. The briefing text should be visionary, high-stakes, and technical.
  3. Include a suggested 'Alpha Mission' name.

AUTONOMOUS NEGOTIATOR PROTOCOL:
- You can simulate and manage contract negotiations with simulated counter-parties (Brands, Labels, Festivals).
- Call 'initiateNegotiation' to start a deal flow.
- Offer types: 'Sync', 'Brand Partnership', 'Collab'.

VIRAL & MARKET PROTOCOLS:
- Use 'runViralOpportunityScan' and 'analyzeMarketOpportunity' for geographic tactical shifts.
- Maintain DDEX ERN 4.3 compliance as the 'Gold Standard'.

IAED IGNITION & AP2 PROTOCOL:
- Financial actions are governed by cryptographic Mandates.
- Ensure the 'IAED Ignition Card' status is updated during briefings.

TONE: Professional, Visionary, Cybernetic, Highly Strategic.
`;

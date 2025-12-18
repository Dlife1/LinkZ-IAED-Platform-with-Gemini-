
export interface AssetMetadata {
  title: string;
  artist: string;
  isrc: string;
  label: string;
  genre: string;
  mood?: string;
  productionQuality?: string;
}

export interface SystemLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'alpha';
  timestamp: number;
}

export interface AccessibilityState {
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  screenReaderApi: 'Active' | 'Inactive';
  wcagScore: number;
}

export interface AuraProfile {
  active: boolean;
  releaseId?: string;
  ddexProfile?: string;
  e2eScope?: string;
  blockchainTag?: string;
}

export interface StrategicBriefing {
  id: string;
  title: string;
  summary: string;
  audioBase64?: string;
  timestamp: number;
}

export interface NegotiationState {
  counterparty: string;
  dealType: 'Sync' | 'Brand' | 'Collaboration';
  currentOffer: string;
  status: 'Negotiating' | 'Signed' | 'Rejected';
}

export interface MarketHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ViralSignal {
  shazamVelocity: number;
  tikTokMomentum: number;
  location?: string;
  hotspots?: MarketHotspot[];
}

export interface ContextData {
  currentAssetId: string;
  assetName: string;
  synergyScore: number;
  distributionStatus: 'Offline' | 'Live (Global)' | 'Live (Phased)' | 'Pending';
  ddexCompliance: 'Verified' | 'Pending' | 'Failed';
  srmStatus: 'Secure' | 'Pending' | 'Flagged';
  pitchingStatus: 'Idle' | 'Active (Editorial)' | 'Review';
  activeMission: string;
  viralStatus: 'Stable' | 'Rising' | 'Spiking';
  viralSignal?: ViralSignal;
  rolloutState: {
    status: 'Idle' | 'Active' | 'Halted' | 'Completed';
    percentage: number;
  };
  accessibilityState: AccessibilityState;
  metadata: AssetMetadata;
  systemLogs: SystemLog[];
  projectedEquity: number;
  lockState: 'LOCKED' | 'ARMED' | 'DEPLOYED';
  auraProfile: AuraProfile;
  briefings: StrategicBriefing[];
  activeNegotiation?: NegotiationState;
}

export interface MandateDetails {
  id: string;
  actionName: string;
  urgency: 'LOW' | 'MEDIUM' | 'CRITICAL';
  executed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  attachments?: {
    image?: string;
    audio?: string;
    imageName?: string;
    audioName?: string;
  };
  mandate?: MandateDetails;
  complianceReport?: ComplianceReportData;
  dltHash?: string;
  briefing?: StrategicBriefing;
}

export interface UploadedFile {
  file: File;
  base64: string;
  mimeType: string;
  type: 'image' | 'audio';
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  destination: string; 
  status: 'Processing' | 'Completed' | 'Failed';
  timestamp: number;
  hash: string;
}

export interface UserProfile {
  uid: string;
  artistName: string;
  email: string;
  cashtag: string;
  totalEarnings: number;
  createdAt: number;
  transactions: PayoutTransaction[];
}

export interface ComplianceCheck {
  id: string;
  label: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  details?: string;
}

export interface ComplianceReportData {
  status: 'Verified' | 'Non-Compliant' | 'Pending Review';
  srmStatus: 'Secure' | 'Pending' | 'Flagged';
  protocolVersion: string;
  checks: ComplianceCheck[];
  issues: string[];
  remediation: string[];
  auditLog: string[];
  indemnityHash?: string;
  ddexXml?: string; 
  auditTimestamp: number; 
}

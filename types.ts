
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
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export interface AccessibilityState {
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  screenReaderApi: 'Active' | 'Inactive';
  wcagScore: number;
}

export interface ContextData {
  currentAssetId: string;
  assetName: string;
  synergyScore: number;
  distributionStatus: 'Offline' | 'Live (Global)' | 'Live (Phased)' | 'Pending';
  ddexCompliance: 'Verified' | 'Pending' | 'Failed';
  srmStatus: 'Secure' | 'Pending' | 'Flagged';
  pitchingStatus: 'Idle' | 'Active (Editorial)' | 'Review';
  rolloutState: {
    status: 'Idle' | 'Active' | 'Halted' | 'Completed';
    percentage: number;
  };
  accessibilityState: AccessibilityState;
  metadata: AssetMetadata;
  systemLogs: SystemLog[];
  projectedEquity: number;
}

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
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
    image?: string; // base64
    audio?: string; // base64
    imageName?: string;
    audioName?: string;
  };
  mandate?: MandateDetails;
  dltHash?: string;
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
  destination: string; // e.g. $Cashtag
  status: 'Processing' | 'Completed' | 'Failed';
  timestamp: number;
  hash: string;
}

export interface UserProfile {
  uid: string;
  artistName: string;
  email: string;
  cashtag: string;
  totalEarnings: number; // Lifetime earnings
  createdAt: number;
  transactions: PayoutTransaction[];
}

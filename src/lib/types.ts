export interface VideoInfo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export interface CorePhilosophy {
  centralBelief: string;
  powerfulQuotes: string[];
  challengedWisdom: string;
}

export interface SignatureQuestion {
  question: string;
  reframingPower: string;
}

export interface OriginStory {
  title: string;
  summary: string;
  emotionalResonance: string;
  frameworkProof: string;
}

export interface TransformationArc {
  beforeState: string;
  pivotalMoment: string;
  afterState: string;
  mission: string;
}

export interface IPAsset {
  name: string;
  type: "signature_question" | "core_metaphor" | "framework" | "story" | "quote";
  description: string;
}

export interface FrameworkLetter {
  letter: string;
  principle: string;
  explanation: string;
  discoveryQuestions: string[];
  supportingQuote: string;
}

export interface AcronymFramework {
  acronym: string;
  fullName: string;
  letters: FrameworkLetter[];
}

export interface ThreeLayerReframe {
  level1Think: string;
  level2Say: string;
  level3Actually: string;
}

export interface ComparableExpert {
  name: string;
  knownFor: string;
  framework: string;
}

export interface Positioning {
  tagline: string;
  oneSentence: string;
  titleDescriptor: string;
}

export interface ServiceTier {
  name: string;
  description: string;
  included: string[];
  idealFor: string;
}

export interface BookConcept {
  workingTitle: string;
  subtitle: string;
  threePartStructure: { part: string; theme: string }[];
  description: string;
}

export interface WorkshopModule {
  name: string;
  duration: string;
  outcomes: string[];
}

export interface ExtractedContent {
  speakerName: string;
  talkTitle: string;
  videoId: string;
  youtubeUrl: string;

  // Phase 1: IP Extraction
  corePhilosophy: CorePhilosophy;
  signatureQuestion: SignatureQuestion;
  originStories: OriginStory[];
  transformationArc: TransformationArc;
  ipAssets: IPAsset[];

  // Phase 2: Framework
  acronymFramework: AcronymFramework;
  threeLayerReframe: ThreeLayerReframe;
  comparableExperts: ComparableExpert[];

  // Phase 3: Commercialization
  positioning: Positioning;
  serviceTiers: ServiceTier[];
  bookConcept: BookConcept;
  workshopModules: WorkshopModule[];

  // Bio
  speakerBio: string;
  pullQuote: string;
}

export interface GenerationStatus {
  step: "fetching" | "transcribing" | "extracting" | "generating" | "complete" | "error";
  message: string;
  progress: number;
}

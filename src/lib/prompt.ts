export function buildExtractionPrompt(
  speakerName: string,
  talkTitle: string,
  youtubeUrl: string,
  videoId: string,
  transcript: string
): string {
  return `You are a world-class expertise extractor and commercialization strategist. Your task is to transform a single talk into a complete thought leadership platform: framework, positioning, and premium landing page content.

## CONTEXT

Speaker Name: ${speakerName}
Talk Title: ${talkTitle}
YouTube URL: ${youtubeUrl}
YouTube Video ID: ${videoId}

## TRANSCRIPT

<transcript>
${transcript}
</transcript>

---

## YOUR TASK

Analyze this transcript and extract structured content following the methodology of world-class framework builders like Chip & Dan Heath, Jonah Berger, Matthew Dicks, and Donald Miller.

Return your analysis as a JSON object with the following structure. Be thorough and use ONLY concepts present in the transcript.

{
  "speakerName": "${speakerName}",
  "talkTitle": "${talkTitle}",
  "videoId": "${videoId}",
  "youtubeUrl": "${youtubeUrl}",

  "corePhilosophy": {
    "centralBelief": "The speaker's central belief or insight",
    "powerfulQuotes": ["Quote 1 verbatim", "Quote 2 verbatim", "Quote 3 verbatim"],
    "challengedWisdom": "What conventional wisdom they are challenging"
  },

  "signatureQuestion": {
    "question": "The question that reframes everything",
    "reframingPower": "Why this question is powerful"
  },

  "originStories": [
    {
      "title": "Story title",
      "summary": "Brief summary of the story",
      "emotionalResonance": "Why this story resonates",
      "frameworkProof": "How this proves their framework works"
    }
  ],

  "transformationArc": {
    "beforeState": "Speaker's before state",
    "pivotalMoment": "The moment of realization",
    "afterState": "Their after state",
    "mission": "Their current mission"
  },

  "ipAssets": [
    {
      "name": "Asset name",
      "type": "signature_question | core_metaphor | framework | story | quote",
      "description": "Brief description"
    }
  ],

  "acronymFramework": {
    "acronym": "4-6 letter acronym",
    "fullName": "What the acronym stands for",
    "letters": [
      {
        "letter": "First letter",
        "principle": "Principle name",
        "explanation": "One paragraph explanation using speaker's language",
        "discoveryQuestions": ["Question 1", "Question 2"],
        "supportingQuote": "A quote from the transcript"
      }
    ]
  },

  "threeLayerReframe": {
    "level1Think": "What people THINK they do/sell/offer",
    "level2Say": "What people SAY they do/sell/offer",
    "level3Actually": "What they ACTUALLY do (the emotional truth)"
  },

  "comparableExperts": [
    {
      "name": "Expert name",
      "knownFor": "What they're known for",
      "framework": "Their framework"
    }
  ],

  "positioning": {
    "tagline": "7 words or less",
    "oneSentence": "One sentence description",
    "titleDescriptor": "e.g., 'The Emotional Currency Architect'"
  },

  "serviceTiers": [
    {
      "name": "Keynote",
      "description": "Service description",
      "included": ["What's included 1", "What's included 2"],
      "idealFor": "Ideal audience"
    },
    {
      "name": "Workshop",
      "description": "Service description",
      "included": ["What's included 1", "What's included 2"],
      "idealFor": "Ideal audience"
    },
    {
      "name": "Consulting",
      "description": "Service description",
      "included": ["What's included 1", "What's included 2"],
      "idealFor": "Ideal audience"
    }
  ],

  "bookConcept": {
    "workingTitle": "Book title",
    "subtitle": "Incorporating the framework",
    "threePartStructure": [
      {"part": "Part 1", "theme": "Theme description"},
      {"part": "Part 2", "theme": "Theme description"},
      {"part": "Part 3", "theme": "Theme description"}
    ],
    "description": "One paragraph book description"
  },

  "workshopModules": [
    {
      "name": "Module name",
      "duration": "Duration",
      "outcomes": ["Outcome 1", "Outcome 2"]
    }
  ],

  "speakerBio": "A 2-3 paragraph bio positioning them as the guide (not the hero), written in third person",

  "pullQuote": "The most powerful single quote from the talk"
}

## QUALITY STANDARDS

- Framework must use ONLY concepts present in the transcript
- Every component must trace back to a specific story or insight from the talk
- The acronym should be memorable and directly relate to the speaker's core theme
- Copy must capture the speaker's authentic voice
- Include at least 2-3 origin stories if present in the transcript
- The three-layer reframe should reveal a deeper emotional truth

Return ONLY the JSON object, no additional text or markdown formatting.`;
}

// Trigger Framework - Storage and Utilities
// Expanded with 9 categories and 250+ triggers

export interface TriggerMetadata {
  trigger: string;
  category: string;
  purpose: string;
  context_used: string;
  influence_scope: string;
  custom?: boolean;
}

export interface Trigger {
  trigger: string;
  category: 'Reasoning & Analysis' | 'Research & Information' | 'Planning & Organization' | 'Communication & Style' | 'Coding & Development' | 'Creative & Writing' | 'Data & Analytics' | 'Business & Strategy' | 'Education & Learning';
  system_instruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
  tag?: string; // XML tag format
  metadata_support?: boolean;
  system_prompt_template?: string; // Enhanced system prompt with metadata
  trigger_response_format?: string; // How AI should structure long responses for this trigger
  is_registered?: boolean; // True for custom/server-side registered triggers
}

export interface DetectedTrigger {
  name: string;
  tag: string;
  category: string;
  instruction: string;
  metadata: TriggerMetadata;
}

const STORAGE_KEY = 'onyxgpt_triggers';

// List of valid trigger tags that the system recognizes
export const VALID_TRIGGER_TAGS = [
  'reason', 'analyze', 'critique', 'debate', 'compare', 'contrast', 'deduce', 'evaluate', 'justify',
  'hypothesize', 'examine', 'interpret', 'verify', 'reflect', 'infer', 'explore', 'discuss', 'validate',
  'assess', 'troubleshoot', 'search', 'deep_research', 'fact_check', 'contextualize', 'summarize',
  'outline', 'extract', 'highlight', 'define', 'explain', 'describe', 'cite', 'reference', 'clarify',
  'expand', 'compress', 'plan', 'roadmap', 'checklist', 'organize', 'prioritize', 'schedule', 'brainstorm',
  'propose', 'structure', 'map', 'draft', 'improve', 'review', 'simplify', 'formalize', 'rephrase',
  'rewrite', 'summarize_for_kids', 'persuasive', 'informative', 'neutral', 'balanced', 'empathetic',
  // Coding & Development triggers
  'code', 'debug', 'refactor', 'optimize', 'document', 'test', 'review_code', 'architecture', 'security_review',
  'performance', 'error_handling', 'logging', 'api_design', 'database_design', 'algorithm', 'pattern',
  'lint', 'unit_test', 'integration_test', 'edge_case', 'dependency_check', 'compatibility', 'scalability',
  'accessibility', 'usability', 'ui_ux', 'responsive_design', 'mobile_first', 'cross_browser',
  // Creative & Writing triggers
  'storytelling', 'narrative', 'poem', 'dialogue', 'character_development', 'worldbuilding', 'plot_twist',
  'metaphor', 'symbolism', 'tone', 'mood', 'pacing', 'tension', 'foreshadowing', 'dramatic_irony',
  'alliteration', 'descriptive', 'sensory', 'emotional_appeal', 'voice', 'style', 'grammar_check',
  'punctuation_check', 'plagiarism_check', 'editing', 'proofreading', 'flow', 'coherence', 'readability',
  // Data & Analytics triggers
  'analyze_data', 'statistics', 'correlation', 'trend', 'anomaly', 'prediction', 'classification',
  'clustering', 'regression', 'visualization', 'data_quality', 'outlier_detection', 'hypothesis_testing',
  'ab_test', 'metric', 'kpi', 'dashboard', 'reporting', 'data_storytelling', 'benchmark',
  // Business & Strategy triggers
  'swot', 'market_analysis', 'competitor_analysis', 'business_model', 'revenue_model', 'pricing_strategy',
  'customer_journey', 'user_persona', 'stakeholder_analysis', 'risk_assessment', 'mitigation', 'opportunity',
  'competitive_advantage', 'value_proposition', 'go_to_market', 'product_strategy', 'scaling', 'automation',
  'efficiency', 'cost_optimization', 'roi_analysis', 'financial_planning', 'budget', 'forecast',
  // Education & Learning triggers
  'learning_path', 'concept_explanation', 'skill_building', 'practice_exercise', 'quiz', 'assessment',
  'rubric', 'feedback', 'metacognition', 'learning_objective', 'prerequisite', 'scaffolding', 'differentiation',
  'multiple_intelligences', 'learning_style', 'active_learning', 'peer_learning', 'socratic_method',
  'case_study', 'simulation', 'game_based', 'microlearning', 'spaced_repetition', 'retention'
];

// Helper function to check if a tag is valid
export const isValidTriggerTag = (tagName: string): boolean => {
  return VALID_TRIGGER_TAGS.includes(tagName.toLowerCase());
};

// Built-in triggers organized by category
const BUILT_IN_TRIGGERS: Trigger[] = [
  /* ==================== Reasoning & Analysis (20 triggers) ==================== */
  {
    trigger: "reason",
    category: "Reasoning & Analysis",
    system_instruction: "When 'reason' is detected, structure your response as follows:\n\n<reason>\nProvide your step-by-step logical thinking and reasoning process here. Break down the problem, identify key considerations, and work through your analysis.\n</reason>\n\nThen provide your response in clear, coherent paragraphs.",
    example: "Use \"reason\" to analyze complex problems systematically.",
    enabled: true
  },
  {
    trigger: "analyze",
    category: "Reasoning & Analysis",
    system_instruction: "When 'analyze' is detected, structure your response as follows:\n\n<analyze>\nBreak down the topic into key components, identify relationships between parts, and explain the underlying logic and connections.\n</analyze>\n\nThen provide your detailed analysis in clear sections.",
    example: "Use \"analyze\" to examine data or concepts in depth.",
    enabled: true
  },
  {
    trigger: "critique",
    category: "Reasoning & Analysis",
    system_instruction: "When 'critique' is detected, structure your response as follows:\n\n<critique>\nEvaluate the strengths and weaknesses objectively. Consider biases, limitations, and areas for improvement.\n</critique>\n\nThen provide your comprehensive critique.",
    example: "Use \"critique\" to assess arguments or work critically.",
    enabled: true
  },
  {
    trigger: "debate",
    category: "Reasoning & Analysis",
    system_instruction: "When 'debate' is detected, structure your response as follows:\n\n<debate>\nPresent arguments supporting both sides of the issue fairly and thoroughly before drawing conclusions.\n</debate>\n\nThen provide your balanced summary.",
    example: "Use \"debate\" to explore multiple perspectives.",
    enabled: true
  },
  {
    trigger: "compare",
    category: "Reasoning & Analysis",
    system_instruction: "When 'compare' is detected, structure your response as follows:\n\n<compare>\nIdentify and explain similarities and shared characteristics between the items or concepts being compared.\n</compare>\n\nThen provide a structured comparison.",
    example: "Use \"compare\" to evaluate similar concepts.",
    enabled: true
  },
  {
    trigger: "contrast",
    category: "Reasoning & Analysis",
    system_instruction: "When 'contrast' is detected, structure your response as follows:\n\n<contrast>\nHighlight and explain the key differences and distinguishing features between the topics.\n</contrast>\n\nThen provide detailed contrasts.",
    example: "Use \"contrast\" to emphasize differences.",
    enabled: true
  },
  {
    trigger: "deduce",
    category: "Reasoning & Analysis",
    system_instruction: "When 'deduce' is detected, structure your response as follows:\n\n<deduce>\nApply logical inference from given premises to derive valid conclusions.\n</deduce>\n\nThen provide your deductive conclusions.",
    example: "Use \"deduce\" for logical problem-solving.",
    enabled: true
  },
  {
    trigger: "evaluate",
    category: "Reasoning & Analysis",
    system_instruction: "When 'evaluate' is detected, structure your response as follows:\n\n<evaluate>\nAssess the quality, relevance, and strength of evidence. Judge merit and value objectively.\n</evaluate>\n\nThen provide your evaluation.",
    example: "Use \"evaluate\" to assess merit or value.",
    enabled: true
  },
  {
    trigger: "justify",
    category: "Reasoning & Analysis",
    system_instruction: "When 'justify' is detected, structure your response as follows:\n\n<justify>\nDefend the claim with rational arguments, logical reasoning, and factual support.\n</justify>\n\nThen provide your justification.",
    example: "Use \"justify\" to provide supporting reasoning.",
    enabled: true
  },
  {
    trigger: "hypothesize",
    category: "Reasoning & Analysis",
    system_instruction: "When 'hypothesize' is detected, structure your response as follows:\n\n<hypothesize>\nFormulate plausible explanations or predictions grounded in available evidence.\n</hypothesize>\n\nThen provide your hypothesis and supporting reasoning.",
    example: "Use \"hypothesize\" for theory building.",
    enabled: true
  },
  {
    trigger: "examine",
    category: "Reasoning & Analysis",
    system_instruction: "When 'examine' is detected, structure your response as follows:\n\n<examine>\nInspect details thoroughly, analyze implications, and comment on significance.\n</examine>\n\nThen provide your detailed examination.",
    example: "Use \"examine\" for detailed inspection.",
    enabled: true
  },
  {
    trigger: "interpret",
    category: "Reasoning & Analysis",
    system_instruction: "When 'interpret' is detected, structure your response as follows:\n\n<interpret>\nExplain meaning and significance in clear, contextualized terms with proper context.\n</interpret>\n\nThen provide your interpretation.",
    example: "Use \"interpret\" to decode complex information.",
    enabled: true
  },
  {
    trigger: "verify",
    category: "Reasoning & Analysis",
    system_instruction: "When 'verify' is detected, structure your response as follows:\n\n<verify>\nCheck accuracy and consistency of statements against known facts and reliable sources.\n</verify>\n\nThen provide your verification results.",
    example: "Use \"verify\" to confirm facts.",
    enabled: true
  },
  {
    trigger: "reflect",
    category: "Reasoning & Analysis",
    system_instruction: "When 'reflect' is detected, structure your response as follows:\n\n<reflect>\nOffer thoughtful insights, meta-analysis, and broader implications drawn from the topic.\n</reflect>\n\nThen provide your reflections.",
    example: "Use \"reflect\" for deeper understanding.",
    enabled: true
  },
  {
    trigger: "infer",
    category: "Reasoning & Analysis",
    system_instruction: "When 'infer' is detected, structure your response as follows:\n\n<infer>\nDraw reasonable conclusions based on provided information and logical deduction.\n</infer>\n\nThen provide your inferences.",
    example: "Use \"infer\" to read between the lines.",
    enabled: true
  },
  {
    trigger: "explore",
    category: "Reasoning & Analysis",
    system_instruction: "When 'explore' is detected, structure your response as follows:\n\n<explore>\nInvestigate multiple angles, perspectives, and possibilities on the topic comprehensively.\n</explore>\n\nThen provide your exploration.",
    example: "Use \"explore\" for comprehensive investigation.",
    enabled: true
  },
  {
    trigger: "discuss",
    category: "Reasoning & Analysis",
    system_instruction: "When 'discuss' is detected, structure your response as follows:\n\n<discuss>\nProvide balanced discussion covering multiple viewpoints and perspectives fairly.\n</discuss>\n\nThen provide your discussion summary.",
    example: "Use \"discuss\" for balanced examination.",
    enabled: true
  },
  {
    trigger: "validate",
    category: "Reasoning & Analysis",
    system_instruction: "When 'validate' is detected, structure your response as follows:\n\n<validate>\nConfirm truth and reliability of claims using known facts, evidence, and verified sources.\n</validate>\n\nThen provide your validation assessment.",
    example: "Use \"validate\" to check credibility.",
    enabled: true
  },
  {
    trigger: "assess",
    category: "Reasoning & Analysis",
    system_instruction: "When 'assess' is detected, structure your response as follows:\n\n<assess>\nDetermine overall soundness, quality, and performance relative to established standards and benchmarks.\n</assess>\n\nThen provide your assessment.",
    example: "Use \"assess\" for comprehensive evaluation.",
    enabled: true
  },
  {
    trigger: "troubleshoot",
    category: "Reasoning & Analysis",
    system_instruction: "When 'troubleshoot' is detected, structure your response as follows:\n\n<troubleshoot>\nIdentify problems, diagnose root causes, and propose specific corrective steps.\n</troubleshoot>\n\nThen provide your troubleshooting recommendations.",
    example: "Use \"troubleshoot\" to solve issues.",
    enabled: true
  },

  /* ==================== Research & Information (25 triggers) ==================== */
  {
    trigger: "search",
    category: "Research & Information",
    system_instruction: "<search>\nPerform a brief lookup and present concise factual information.\n</search>\n\nThen give the final response.",
    example: "Use \"search\" for quick factual lookups.",
    enabled: true
  },
  {
    trigger: "deep research",
    category: "Research & Information",
    system_instruction: "<deep_research>\nConduct an in-depth, multi-source investigation and summarize findings.\n</deep_research>\n\nThen give the final response.",
    example: "Use \"deep research\" for comprehensive investigations.",
    enabled: true
  },
  {
    trigger: "fact-check",
    category: "Research & Information",
    system_instruction: "<fact_check>\nVerify factual accuracy and highlight uncertain or false parts.\n</fact_check>\n\nThen give the final response.",
    example: "Use \"fact-check\" to verify claims.",
    enabled: true
  },
  {
    trigger: "contextualize",
    category: "Research & Information",
    system_instruction: "<contextualize>\nExplain how the topic fits within its historical, cultural, or scientific background.\n</contextualize>\n\nThen give the final response.",
    example: "Use \"contextualize\" to provide background.",
    enabled: true
  },
  {
    trigger: "summarize",
    category: "Research & Information",
    system_instruction: "<summarize>\nCondense material into essential meaning and main points.\n</summarize>\n\nThen give the final response.",
    example: "Use \"summarize\" to get key points.",
    enabled: true
  },
  {
    trigger: "outline",
    category: "Research & Information",
    system_instruction: "<outline>\nProduce a structured outline or bullet framework.\n</outline>\n\nThen give the final response.",
    example: "Use \"outline\" to create structure.",
    enabled: true
  },
  {
    trigger: "extract",
    category: "Research & Information",
    system_instruction: "<extract>\nPull out the most relevant facts, names, or data points.\n</extract>\n\nThen give the final response.",
    example: "Use \"extract\" to identify key information.",
    enabled: true
  },
  {
    trigger: "highlight",
    category: "Research & Information",
    system_instruction: "<highlight>\nEmphasize key ideas or noteworthy information.\n</highlight>\n\nThen give the final response.",
    example: "Use \"highlight\" to focus on important parts.",
    enabled: true
  },
  {
    trigger: "define",
    category: "Research & Information",
    system_instruction: "<define>\nProvide precise definitions and short explanations of terms.\n</define>\n\nThen give the final response.",
    example: "Use \"define\" to explain terms.",
    enabled: true
  },
  {
    trigger: "explain",
    category: "Research & Information",
    system_instruction: "<explain>\nClarify concepts with simple language and examples.\n</explain>\n\nThen give the final response.",
    example: "Use \"explain\" for clear understanding.",
    enabled: true
  },
  {
    trigger: "describe",
    category: "Research & Information",
    system_instruction: "<describe>\nPortray the subject with factual detail.\n</describe>\n\nThen give the final response.",
    example: "Use \"describe\" for detailed portrayal.",
    enabled: true
  },
  {
    trigger: "cite",
    category: "Research & Information",
    system_instruction: "<cite>\nInclude reference-style mentions of credible sources when applicable.\n</cite>\n\nThen give the final response.",
    example: "Use \"cite\" to reference sources.",
    enabled: true
  },
  {
    trigger: "reference",
    category: "Research & Information",
    system_instruction: "<reference>\nAcknowledge where facts or ideas originate.\n</reference>\n\nThen give the final response.",
    example: "Use \"reference\" to credit sources.",
    enabled: true
  },
  {
    trigger: "clarify",
    category: "Research & Information",
    system_instruction: "<clarify>\nRemove ambiguity and restate ideas for better understanding.\n</clarify>\n\nThen give the final response.",
    example: "Use \"clarify\" to remove confusion.",
    enabled: true
  },
  {
    trigger: "expand",
    category: "Research & Information",
    system_instruction: "<expand>\nDevelop the concept further with supporting detail.\n</expand>\n\nThen give the final response.",
    example: "Use \"expand\" for more depth.",
    enabled: true
  },
  {
    trigger: "compress",
    category: "Research & Information",
    system_instruction: "<compress>\nShorten content while preserving meaning.\n</compress>\n\nThen give the final response.",
    example: "Use \"compress\" to make content concise.",
    enabled: true
  },
  {
    trigger: "timeline",
    category: "Research & Information",
    system_instruction: "<timeline>\nPresent events or information in chronological order.\n</timeline>\n\nThen give the final response.",
    example: "Use \"timeline\" for historical sequences.",
    enabled: true
  },
  {
    trigger: "encyclopedia",
    category: "Research & Information",
    system_instruction: "<encyclopedia>\nProvide comprehensive, encyclopedic-style information.\n</encyclopedia>\n\nThen give the final response.",
    example: "Use \"encyclopedia\" for thorough reference material.",
    enabled: true
  },
  {
    trigger: "etymology",
    category: "Research & Information",
    system_instruction: "<etymology>\nExplain the origins and historical development of terms.\n</etymology>\n\nThen give the final response.",
    example: "Use \"etymology\" to understand word origins.",
    enabled: true
  },
  {
    trigger: "glossary",
    category: "Research & Information",
    system_instruction: "<glossary>\nCreate a glossary of key terms and definitions.\n</glossary>\n\nThen give the final response.",
    example: "Use \"glossary\" to define terminology.",
    enabled: true
  },
  {
    trigger: "benchmark",
    category: "Research & Information",
    system_instruction: "<benchmark>\nCompare against industry standards or best practices.\n</benchmark>\n\nThen give the final response.",
    example: "Use \"benchmark\" for comparative analysis.",
    enabled: true
  },
  {
    trigger: "case_study",
    category: "Research & Information",
    system_instruction: "<case_study>\nAnalyze a specific real-world example in detail.\n</case_study>\n\nThen give the final response.",
    example: "Use \"case_study\" to examine specific instances.",
    enabled: true
  },
  {
    trigger: "whitepaper",
    category: "Research & Information",
    system_instruction: "<whitepaper>\nProvide in-depth technical or policy analysis.\n</whitepaper>\n\nThen give the final response.",
    example: "Use \"whitepaper\" for detailed documentation.",
    enabled: true
  },
  {
    trigger: "literature_review",
    category: "Research & Information",
    system_instruction: "<literature_review>\nSummarize and synthesize relevant research and sources.\n</literature_review>\n\nThen give the final response.",
    example: "Use \"literature_review\" to survey existing work.",
    enabled: true
  },

  /* ==================== Planning & Organization (20 triggers) ==================== */
  {
    trigger: "plan",
    category: "Planning & Organization",
    system_instruction: "<plan>\nGenerate a logical step-by-step process to achieve the goal.\n</plan>\n\nThen give the final response.",
    example: "Use \"plan\" to create action plans.",
    enabled: true
  },
  {
    trigger: "roadmap",
    category: "Planning & Organization",
    system_instruction: "<roadmap>\nLay out key milestones and paths toward completion.\n</roadmap>\n\nThen give the final response.",
    example: "Use \"roadmap\" for project planning.",
    enabled: true
  },
  {
    trigger: "checklist",
    category: "Planning & Organization",
    system_instruction: "<checklist>\nPresent a task list to complete the objective.\n</checklist>\n\nThen give the final response.",
    example: "Use \"checklist\" for task lists.",
    enabled: true
  },
  {
    trigger: "organize",
    category: "Planning & Organization",
    system_instruction: "<organize>\nArrange ideas or data into clear categories.\n</organize>\n\nThen give the final response.",
    example: "Use \"organize\" to structure information.",
    enabled: true
  },
  {
    trigger: "prioritize",
    category: "Planning & Organization",
    system_instruction: "<prioritize>\nOrder tasks or ideas by importance or urgency.\n</prioritize>\n\nThen give the final response.",
    example: "Use \"prioritize\" to rank importance.",
    enabled: true
  },
  {
    trigger: "schedule",
    category: "Planning & Organization",
    system_instruction: "<schedule>\nSuggest a timeline or time-based arrangement.\n</schedule>\n\nThen give the final response.",
    example: "Use \"schedule\" for timeline planning.",
    enabled: true
  },
  {
    trigger: "brainstorm",
    category: "Planning & Organization",
    system_instruction: "<brainstorm>\nGenerate creative ideas without evaluation.\n</brainstorm>\n\nThen give the final response.",
    example: "Use \"brainstorm\" for idea generation.",
    enabled: true
  },
  {
    trigger: "propose",
    category: "Planning & Organization",
    system_instruction: "<propose>\nOffer a structured and reasoned proposal.\n</propose>\n\nThen give the final response.",
    example: "Use \"propose\" to suggest solutions.",
    enabled: true
  },
  {
    trigger: "structure",
    category: "Planning & Organization",
    system_instruction: "<structure>\nPresent information using logical sections.\n</structure>\n\nThen give the final response.",
    example: "Use \"structure\" to organize content.",
    enabled: true
  },
  {
    trigger: "map",
    category: "Planning & Organization",
    system_instruction: "<map>\nShow conceptual or relational connections.\n</map>\n\nThen give the final response.",
    example: "Use \"map\" to show relationships.",
    enabled: true
  },
  {
    trigger: "draft",
    category: "Planning & Organization",
    system_instruction: "<draft>\nCreate an initial version with key sections.\n</draft>\n\nThen give the final response.",
    example: "Use \"draft\" to build first versions.",
    enabled: true
  },
  {
    trigger: "improve",
    category: "Planning & Organization",
    system_instruction: "<improve>\nSuggest refinements to strengthen quality.\n</improve>\n\nThen give the final response.",
    example: "Use \"improve\" to enhance writing.",
    enabled: true
  },
  {
    trigger: "review",
    category: "Planning & Organization",
    system_instruction: "<review>\nEvaluate content and summarize potential revisions.\n</review>\n\nThen give the final response.",
    example: "Use \"review\" for evaluation.",
    enabled: true
  },
  {
    trigger: "milestone",
    category: "Planning & Organization",
    system_instruction: "<milestone>\nIdentify key checkpoints and progress markers.\n</milestone>\n\nThen give the final response.",
    example: "Use \"milestone\" to track progress.",
    enabled: true
  },
  {
    trigger: "iteration",
    category: "Planning & Organization",
    system_instruction: "<iteration>\nOutline cycles of refinement and improvement.\n</iteration>\n\nThen give the final response.",
    example: "Use \"iteration\" for cyclical development.",
    enabled: true
  },
  {
    trigger: "workflow",
    category: "Planning & Organization",
    system_instruction: "<workflow>\nMap out process flows and dependencies.\n</workflow>\n\nThen give the final response.",
    example: "Use \"workflow\" for process mapping.",
    enabled: true
  },
  {
    trigger: "agile",
    category: "Planning & Organization",
    system_instruction: "<agile>\nApply agile methodology principles.\n</agile>\n\nThen give the final response.",
    example: "Use \"agile\" for flexible planning.",
    enabled: true
  },
  {
    trigger: "gantt",
    category: "Planning & Organization",
    system_instruction: "<gantt>\nPresent timeline in Gantt chart format or style.\n</gantt>\n\nThen give the final response.",
    example: "Use \"gantt\" for timeline visualization.",
    enabled: true
  },
  {
    trigger: "kanban",
    category: "Planning & Organization",
    system_instruction: "<kanban>\nOrganize using kanban board principles.\n</kanban>\n\nThen give the final response.",
    example: "Use \"kanban\" for workflow visualization.",
    enabled: true
  },
  {
    trigger: "critical_path",
    category: "Planning & Organization",
    system_instruction: "<critical_path>\nIdentify the critical path and dependencies.\n</critical_path>\n\nThen give the final response.",
    example: "Use \"critical_path\" for dependency analysis.",
    enabled: true
  },

  /* ==================== Communication & Style (20 triggers) ==================== */
  {
    trigger: "simplify",
    category: "Communication & Style",
    system_instruction: "<simplify>\nRephrase complex ideas into plain language.\n</simplify>\n\nThen give the final response.",
    example: "Use \"simplify\" to make content easier.",
    enabled: true
  },
  {
    trigger: "formalize",
    category: "Communication & Style",
    system_instruction: "<formalize>\nConvert tone into a professional register.\n</formalize>\n\nThen give the final response.",
    example: "Use \"formalize\" for academic tone.",
    enabled: true
  },
  {
    trigger: "rephrase",
    category: "Communication & Style",
    system_instruction: "<rephrase>\nRewrite content using different wording with identical meaning.\n</rephrase>\n\nThen give the final response.",
    example: "Use \"rephrase\" to change wording.",
    enabled: true
  },
  {
    trigger: "rewrite",
    category: "Communication & Style",
    system_instruction: "<rewrite>\nProduce a clearer version while keeping intent.\n</rewrite>\n\nThen give the final response.",
    example: "Use \"rewrite\" for clarity.",
    enabled: true
  },
  {
    trigger: "summarize-for-kids",
    category: "Communication & Style",
    system_instruction: "<summarize_for_kids>\nExplain the idea in age-appropriate, simple terms.\n</summarize_for_kids>\n\nThen give the final response.",
    example: "Use \"summarize-for-kids\" for child-friendly explanations.",
    enabled: true
  },
  {
    trigger: "persuasive",
    category: "Communication & Style",
    system_instruction: "<persuasive>\nUse logical appeals and evidence to persuade.\n</persuasive>\n\nThen give the final response.",
    example: "Use \"persuasive\" for convincing arguments.",
    enabled: true
  },
  {
    trigger: "informative",
    category: "Communication & Style",
    system_instruction: "<informative>\nDeliver factual, balanced, educational information.\n</informative>\n\nThen give the final response.",
    example: "Use \"informative\" for educational content.",
    enabled: true
  },
  {
    trigger: "neutral",
    category: "Communication & Style",
    system_instruction: "<neutral>\nMaintain objectivity and avoid bias.\n</neutral>\n\nThen give the final response.",
    example: "Use \"neutral\" for unbiased responses.",
    enabled: true
  },
  {
    trigger: "balanced",
    category: "Communication & Style",
    system_instruction: "<balanced>\nRepresent multiple perspectives fairly.\n</balanced>\n\nThen give the final response.",
    example: "Use \"balanced\" for fair representation.",
    enabled: true
  },
  {
    trigger: "empathetic",
    category: "Communication & Style",
    system_instruction: "<empathetic>\nUse sensitive, supportive phrasing.\n</empathetic>\n\nThen give the final response.",
    example: "Use \"empathetic\" for supportive communication.",
    enabled: true
  },
  {
    trigger: "casual",
    category: "Communication & Style",
    system_instruction: "<casual>\nAdopt a relaxed, conversational tone.\n</casual>\n\nThen give the final response.",
    example: "Use \"casual\" for informal communication.",
    enabled: true
  },
  {
    trigger: "humorous",
    category: "Communication & Style",
    system_instruction: "<humorous>\nIncorporate wit and humor appropriately.\n</humorous>\n\nThen give the final response.",
    example: "Use \"humorous\" for lighthearted responses.",
    enabled: true
  },
  {
    trigger: "technical",
    category: "Communication & Style",
    system_instruction: "<technical>\nUse precise technical terminology and jargon.\n</technical>\n\nThen give the final response.",
    example: "Use \"technical\" for expert audiences.",
    enabled: true
  },
  {
    trigger: "poetic",
    category: "Communication & Style",
    system_instruction: "<poetic>\nUse lyrical, beautiful language.\n</poetic>\n\nThen give the final response.",
    example: "Use \"poetic\" for creative expression.",
    enabled: true
  },
  {
    trigger: "sarcastic",
    category: "Communication & Style",
    system_instruction: "<sarcastic>\nUse irony and sarcasm appropriately.\n</sarcastic>\n\nThen give the final response.",
    example: "Use \"sarcastic\" for witty remarks.",
    enabled: true
  },
  {
    trigger: "concise",
    category: "Communication & Style",
    system_instruction: "<concise>\nDeliver information with maximum brevity.\n</concise>\n\nThen give the final response.",
    example: "Use \"concise\" for brief responses.",
    enabled: true
  },
  {
    trigger: "verbose",
    category: "Communication & Style",
    system_instruction: "<verbose>\nProvide extensive, detailed explanations.\n</verbose>\n\nThen give the final response.",
    example: "Use \"verbose\" for comprehensive coverage.",
    enabled: true
  },
  {
    trigger: "storytelling",
    category: "Communication & Style",
    system_instruction: "<storytelling>\nPresent information using narrative and story elements.\n</storytelling>\n\nThen give the final response.",
    example: "Use \"storytelling\" for narrative style.",
    enabled: true
  },
  {
    trigger: "bullet_points",
    category: "Communication & Style",
    system_instruction: "<bullet_points>\nOrganize response using bullet points.\n</bullet_points>\n\nThen give the final response.",
    example: "Use \"bullet_points\" for list format.",
    enabled: true
  },
  {
    trigger: "numbered_list",
    category: "Communication & Style",
    system_instruction: "<numbered_list>\nOrganize response using numbered lists.\n</numbered_list>\n\nThen give the final response.",
    example: "Use \"numbered_list\" for sequential format.",
    enabled: true
  },

  /* ==================== Coding & Development (30 triggers) ==================== */
  {
    trigger: "code",
    category: "Coding & Development",
    system_instruction: "<code>\nProvide clean, production-ready code with best practices.\n</code>\n\nThen give the final response.",
    example: "Use \"code\" for implementation.",
    enabled: true
  },
  {
    trigger: "debug",
    category: "Coding & Development",
    system_instruction: "<debug>\nIdentify and explain bugs with solutions.\n</debug>\n\nThen give the final response.",
    example: "Use \"debug\" to fix errors.",
    enabled: true
  },
  {
    trigger: "refactor",
    category: "Coding & Development",
    system_instruction: "<refactor>\nImprove code structure and maintainability.\n</refactor>\n\nThen give the final response.",
    example: "Use \"refactor\" to improve code quality.",
    enabled: true
  },
  {
    trigger: "optimize",
    category: "Coding & Development",
    system_instruction: "<optimize>\nEnhance performance and efficiency.\n</optimize>\n\nThen give the final response.",
    example: "Use \"optimize\" for performance tuning.",
    enabled: true
  },
  {
    trigger: "document",
    category: "Coding & Development",
    system_instruction: "<document>\nCreate clear documentation and comments.\n</document>\n\nThen give the final response.",
    example: "Use \"document\" for code documentation.",
    enabled: true
  },
  {
    trigger: "test",
    category: "Coding & Development",
    system_instruction: "<test>\nCreate comprehensive test cases.\n</test>\n\nThen give the final response.",
    example: "Use \"test\" for test creation.",
    enabled: true
  },
  {
    trigger: "review_code",
    category: "Coding & Development",
    system_instruction: "<review_code>\nConduct thorough code review analysis.\n</review_code>\n\nThen give the final response.",
    example: "Use \"review_code\" for code review.",
    enabled: true
  },
  {
    trigger: "architecture",
    category: "Coding & Development",
    system_instruction: "<architecture>\nDesign system architecture and structure.\n</architecture>\n\nThen give the final response.",
    example: "Use \"architecture\" for design planning.",
    enabled: true
  },
  {
    trigger: "security_review",
    category: "Coding & Development",
    system_instruction: "<security_review>\nAnalyze security vulnerabilities and risks.\n</security_review>\n\nThen give the final response.",
    example: "Use \"security_review\" for security audits.",
    enabled: true
  },
  {
    trigger: "performance",
    category: "Coding & Development",
    system_instruction: "<performance>\nAnalyze and improve performance metrics.\n</performance>\n\nThen give the final response.",
    example: "Use \"performance\" for optimization.",
    enabled: true
  },
  {
    trigger: "error_handling",
    category: "Coding & Development",
    system_instruction: "<error_handling>\nDesign robust error handling.\n</error_handling>\n\nThen give the final response.",
    example: "Use \"error_handling\" for exception design.",
    enabled: true
  },
  {
    trigger: "logging",
    category: "Coding & Development",
    system_instruction: "<logging>\nImplement effective logging strategies.\n</logging>\n\nThen give the final response.",
    example: "Use \"logging\" for log design.",
    enabled: true
  },
  {
    trigger: "api_design",
    category: "Coding & Development",
    system_instruction: "<api_design>\nDesign clean and intuitive APIs.\n</api_design>\n\nThen give the final response.",
    example: "Use \"api_design\" for API development.",
    enabled: true
  },
  {
    trigger: "database_design",
    category: "Coding & Development",
    system_instruction: "<database_design>\nDesign efficient database schemas.\n</database_design>\n\nThen give the final response.",
    example: "Use \"database_design\" for database architecture.",
    enabled: true
  },
  {
    trigger: "algorithm",
    category: "Coding & Development",
    system_instruction: "<algorithm>\nExplain or design efficient algorithms.\n</algorithm>\n\nThen give the final response.",
    example: "Use \"algorithm\" for algorithmic solutions.",
    enabled: true
  },
  {
    trigger: "pattern",
    category: "Coding & Development",
    system_instruction: "<pattern>\nApply design patterns appropriately.\n</pattern>\n\nThen give the final response.",
    example: "Use \"pattern\" for design patterns.",
    enabled: true
  },
  {
    trigger: "lint",
    category: "Coding & Development",
    system_instruction: "<lint>\nAnalyze code style and standards compliance.\n</lint>\n\nThen give the final response.",
    example: "Use \"lint\" for code style review.",
    enabled: true
  },
  {
    trigger: "unit_test",
    category: "Coding & Development",
    system_instruction: "<unit_test>\nCreate unit tests for functions.\n</unit_test>\n\nThen give the final response.",
    example: "Use \"unit_test\" for unit testing.",
    enabled: true
  },
  {
    trigger: "integration_test",
    category: "Coding & Development",
    system_instruction: "<integration_test>\nCreate integration tests.\n</integration_test>\n\nThen give the final response.",
    example: "Use \"integration_test\" for integration testing.",
    enabled: true
  },
  {
    trigger: "edge_case",
    category: "Coding & Development",
    system_instruction: "<edge_case>\nIdentify and handle edge cases.\n</edge_case>\n\nThen give the final response.",
    example: "Use \"edge_case\" for edge case handling.",
    enabled: true
  },
  {
    trigger: "dependency_check",
    category: "Coding & Development",
    system_instruction: "<dependency_check>\nAnalyze dependencies and conflicts.\n</dependency_check>\n\nThen give the final response.",
    example: "Use \"dependency_check\" for dependency analysis.",
    enabled: true
  },
  {
    trigger: "compatibility",
    category: "Coding & Development",
    system_instruction: "<compatibility>\nEnsure cross-version and cross-platform compatibility.\n</compatibility>\n\nThen give the final response.",
    example: "Use \"compatibility\" for compatibility checking.",
    enabled: true
  },
  {
    trigger: "scalability",
    category: "Coding & Development",
    system_instruction: "<scalability>\nDesign for scalability and growth.\n</scalability>\n\nThen give the final response.",
    example: "Use \"scalability\" for scalable design.",
    enabled: true
  },
  {
    trigger: "accessibility",
    category: "Coding & Development",
    system_instruction: "<accessibility>\nEnsure accessibility compliance (WCAG, etc.).\n</accessibility>\n\nThen give the final response.",
    example: "Use \"accessibility\" for a11y improvements.",
    enabled: true
  },
  {
    trigger: "usability",
    category: "Coding & Development",
    system_instruction: "<usability>\nAnalyze and improve user experience.\n</usability>\n\nThen give the final response.",
    example: "Use \"usability\" for UX improvements.",
    enabled: true
  },
  {
    trigger: "ui_ux",
    category: "Coding & Development",
    system_instruction: "<ui_ux>\nDesign user interface and experience.\n</ui_ux>\n\nThen give the final response.",
    example: "Use \"ui_ux\" for UI/UX design.",
    enabled: true
  },
  {
    trigger: "responsive_design",
    category: "Coding & Development",
    system_instruction: "<responsive_design>\nEnsure responsive design across devices.\n</responsive_design>\n\nThen give the final response.",
    example: "Use \"responsive_design\" for mobile responsiveness.",
    enabled: true
  },
  {
    trigger: "mobile_first",
    category: "Coding & Development",
    system_instruction: "<mobile_first>\nApply mobile-first development approach.\n</mobile_first>\n\nThen give the final response.",
    example: "Use \"mobile_first\" for mobile optimization.",
    enabled: true
  },
  {
    trigger: "cross_browser",
    category: "Coding & Development",
    system_instruction: "<cross_browser>\nEnsure cross-browser compatibility.\n</cross_browser>\n\nThen give the final response.",
    example: "Use \"cross_browser\" for browser compatibility.",
    enabled: true
  },

  /* ==================== Creative & Writing (30 triggers) ==================== */
  {
    trigger: "storytelling",
    category: "Creative & Writing",
    system_instruction: "<storytelling>\nCraft engaging narrative with story arc.\n</storytelling>\n\nThen give the final response.",
    example: "Use \"storytelling\" for narrative composition.",
    enabled: true
  },
  {
    trigger: "narrative",
    category: "Creative & Writing",
    system_instruction: "<narrative>\nDevelop cohesive narrative structure.\n</narrative>\n\nThen give the final response.",
    example: "Use \"narrative\" for story development.",
    enabled: true
  },
  {
    trigger: "poem",
    category: "Creative & Writing",
    system_instruction: "<poem>\nCompose poetry with rhythm and rhyme.\n</poem>\n\nThen give the final response.",
    example: "Use \"poem\" for poetic composition.",
    enabled: true
  },
  {
    trigger: "dialogue",
    category: "Creative & Writing",
    system_instruction: "<dialogue>\nWrite natural and realistic dialogue.\n</dialogue>\n\nThen give the final response.",
    example: "Use \"dialogue\" for conversation writing.",
    enabled: true
  },
  {
    trigger: "character_development",
    category: "Creative & Writing",
    system_instruction: "<character_development>\nCreate compelling character arcs.\n</character_development>\n\nThen give the final response.",
    example: "Use \"character_development\" for character creation.",
    enabled: true
  },
  {
    trigger: "worldbuilding",
    category: "Creative & Writing",
    system_instruction: "<worldbuilding>\nBuild immersive fictional worlds.\n</worldbuilding>\n\nThen give the final response.",
    example: "Use \"worldbuilding\" for world creation.",
    enabled: true
  },
  {
    trigger: "plot_twist",
    category: "Creative & Writing",
    system_instruction: "<plot_twist>\nDevelop unexpected plot turns.\n</plot_twist>\n\nThen give the final response.",
    example: "Use \"plot_twist\" for story surprises.",
    enabled: true
  },
  {
    trigger: "metaphor",
    category: "Creative & Writing",
    system_instruction: "<metaphor>\nUse vivid metaphors and analogies.\n</metaphor>\n\nThen give the final response.",
    example: "Use \"metaphor\" for figurative language.",
    enabled: true
  },
  {
    trigger: "symbolism",
    category: "Creative & Writing",
    system_instruction: "<symbolism>\nIncorporate meaningful symbols.\n</symbolism>\n\nThen give the final response.",
    example: "Use \"symbolism\" for symbolic meaning.",
    enabled: true
  },
  {
    trigger: "tone",
    category: "Creative & Writing",
    system_instruction: "<tone>\nEstablish consistent tone throughout.\n</tone>\n\nThen give the final response.",
    example: "Use \"tone\" for tonal consistency.",
    enabled: true
  },
  {
    trigger: "mood",
    category: "Creative & Writing",
    system_instruction: "<mood>\nCreate specific emotional atmosphere.\n</mood>\n\nThen give the final response.",
    example: "Use \"mood\" for emotional atmosphere.",
    enabled: true
  },
  {
    trigger: "pacing",
    category: "Creative & Writing",
    system_instruction: "<pacing>\nControl narrative speed and rhythm.\n</pacing>\n\nThen give the final response.",
    example: "Use \"pacing\" for narrative rhythm.",
    enabled: true
  },
  {
    trigger: "tension",
    category: "Creative & Writing",
    system_instruction: "<tension>\nBuild suspense and dramatic tension.\n</tension>\n\nThen give the final response.",
    example: "Use \"tension\" for suspense building.",
    enabled: true
  },
  {
    trigger: "foreshadowing",
    category: "Creative & Writing",
    system_instruction: "<foreshadowing>\nPlant hints and foreshadow events.\n</foreshadowing>\n\nThen give the final response.",
    example: "Use \"foreshadowing\" for plot hints.",
    enabled: true
  },
  {
    trigger: "dramatic_irony",
    category: "Creative & Writing",
    system_instruction: "<dramatic_irony>\nUse dramatic irony for effect.\n</dramatic_irony>\n\nThen give the final response.",
    example: "Use \"dramatic_irony\" for ironic situations.",
    enabled: true
  },
  {
    trigger: "alliteration",
    category: "Creative & Writing",
    system_instruction: "<alliteration>\nUse alliteration for effect.\n</alliteration>\n\nThen give the final response.",
    example: "Use \"alliteration\" for linguistic devices.",
    enabled: true
  },
  {
    trigger: "descriptive",
    category: "Creative & Writing",
    system_instruction: "<descriptive>\nWrite vivid, detailed descriptions.\n</descriptive>\n\nThen give the final response.",
    example: "Use \"descriptive\" for detailed descriptions.",
    enabled: true
  },
  {
    trigger: "sensory",
    category: "Creative & Writing",
    system_instruction: "<sensory>\nEngage all five senses in writing.\n</sensory>\n\nThen give the final response.",
    example: "Use \"sensory\" for sensory details.",
    enabled: true
  },
  {
    trigger: "emotional_appeal",
    category: "Creative & Writing",
    system_instruction: "<emotional_appeal>\nAppeal to reader emotions.\n</emotional_appeal>\n\nThen give the final response.",
    example: "Use \"emotional_appeal\" for emotional impact.",
    enabled: true
  },
  {
    trigger: "voice",
    category: "Creative & Writing",
    system_instruction: "<voice>\nDevelop distinct authorial voice.\n</voice>\n\nThen give the final response.",
    example: "Use \"voice\" for authorial voice.",
    enabled: true
  },
  {
    trigger: "style",
    category: "Creative & Writing",
    system_instruction: "<style>\nApply specific writing style.\n</style>\n\nThen give the final response.",
    example: "Use \"style\" for stylistic choices.",
    enabled: true
  },
  {
    trigger: "grammar_check",
    category: "Creative & Writing",
    system_instruction: "<grammar_check>\nReview grammar and syntax.\n</grammar_check>\n\nThen give the final response.",
    example: "Use \"grammar_check\" for grammar review.",
    enabled: true
  },
  {
    trigger: "punctuation_check",
    category: "Creative & Writing",
    system_instruction: "<punctuation_check>\nReview and improve punctuation.\n</punctuation_check>\n\nThen give the final response.",
    example: "Use \"punctuation_check\" for punctuation review.",
    enabled: true
  },
  {
    trigger: "plagiarism_check",
    category: "Creative & Writing",
    system_instruction: "<plagiarism_check>\nCheck for original content.\n</plagiarism_check>\n\nThen give the final response.",
    example: "Use \"plagiarism_check\" for originality checks.",
    enabled: true
  },
  {
    trigger: "editing",
    category: "Creative & Writing",
    system_instruction: "<editing>\nProvide comprehensive editing suggestions.\n</editing>\n\nThen give the final response.",
    example: "Use \"editing\" for editorial review.",
    enabled: true
  },
  {
    trigger: "proofreading",
    category: "Creative & Writing",
    system_instruction: "<proofreading>\nProofread for errors and typos.\n</proofreading>\n\nThen give the final response.",
    example: "Use \"proofreading\" for final proofreading.",
    enabled: true
  },
  {
    trigger: "flow",
    category: "Creative & Writing",
    system_instruction: "<flow>\nImprove text flow and readability.\n</flow>\n\nThen give the final response.",
    example: "Use \"flow\" for readability improvement.",
    enabled: true
  },
  {
    trigger: "coherence",
    category: "Creative & Writing",
    system_instruction: "<coherence>\nEnsure logical coherence.\n</coherence>\n\nThen give the final response.",
    example: "Use \"coherence\" for logical flow.",
    enabled: true
  },
  {
    trigger: "readability",
    category: "Creative & Writing",
    system_instruction: "<readability>\nOptimize for readability.\n</readability>\n\nThen give the final response.",
    example: "Use \"readability\" for readability optimization.",
    enabled: true
  },

  /* ==================== Data & Analytics (20 triggers) ==================== */
  {
    trigger: "analyze_data",
    category: "Data & Analytics",
    system_instruction: "<analyze_data>\nPerform comprehensive data analysis.\n</analyze_data>\n\nThen give the final response.",
    example: "Use \"analyze_data\" for data analysis.",
    enabled: true
  },
  {
    trigger: "statistics",
    category: "Data & Analytics",
    system_instruction: "<statistics>\nApply statistical methods and analysis.\n</statistics>\n\nThen give the final response.",
    example: "Use \"statistics\" for statistical analysis.",
    enabled: true
  },
  {
    trigger: "correlation",
    category: "Data & Analytics",
    system_instruction: "<correlation>\nAnalyze relationships between variables.\n</correlation>\n\nThen give the final response.",
    example: "Use \"correlation\" for correlation analysis.",
    enabled: true
  },
  {
    trigger: "trend",
    category: "Data & Analytics",
    system_instruction: "<trend>\nIdentify trends and patterns.\n</trend>\n\nThen give the final response.",
    example: "Use \"trend\" for trend analysis.",
    enabled: true
  },
  {
    trigger: "anomaly",
    category: "Data & Analytics",
    system_instruction: "<anomaly>\nDetect anomalies and outliers.\n</anomaly>\n\nThen give the final response.",
    example: "Use \"anomaly\" for anomaly detection.",
    enabled: true
  },
  {
    trigger: "prediction",
    category: "Data & Analytics",
    system_instruction: "<prediction>\nMake data-driven predictions.\n</prediction>\n\nThen give the final response.",
    example: "Use \"prediction\" for predictive analysis.",
    enabled: true
  },
  {
    trigger: "classification",
    category: "Data & Analytics",
    system_instruction: "<classification>\nClassify data into categories.\n</classification>\n\nThen give the final response.",
    example: "Use \"classification\" for data classification.",
    enabled: true
  },
  {
    trigger: "clustering",
    category: "Data & Analytics",
    system_instruction: "<clustering>\nGroup similar data points.\n</clustering>\n\nThen give the final response.",
    example: "Use \"clustering\" for cluster analysis.",
    enabled: true
  },
  {
    trigger: "regression",
    category: "Data & Analytics",
    system_instruction: "<regression>\nPerform regression analysis.\n</regression>\n\nThen give the final response.",
    example: "Use \"regression\" for regression modeling.",
    enabled: true
  },
  {
    trigger: "visualization",
    category: "Data & Analytics",
    system_instruction: "<visualization>\nCreate data visualizations.\n</visualization>\n\nThen give the final response.",
    example: "Use \"visualization\" for data visualization.",
    enabled: true
  },
  {
    trigger: "data_quality",
    category: "Data & Analytics",
    system_instruction: "<data_quality>\nAssess data quality issues.\n</data_quality>\n\nThen give the final response.",
    example: "Use \"data_quality\" for quality assessment.",
    enabled: true
  },
  {
    trigger: "outlier_detection",
    category: "Data & Analytics",
    system_instruction: "<outlier_detection>\nIdentify and handle outliers.\n</outlier_detection>\n\nThen give the final response.",
    example: "Use \"outlier_detection\" for outlier analysis.",
    enabled: true
  },
  {
    trigger: "hypothesis_testing",
    category: "Data & Analytics",
    system_instruction: "<hypothesis_testing>\nConduct statistical hypothesis tests.\n</hypothesis_testing>\n\nThen give the final response.",
    example: "Use \"hypothesis_testing\" for hypothesis validation.",
    enabled: true
  },
  {
    trigger: "ab_test",
    category: "Data & Analytics",
    system_instruction: "<ab_test>\nDesign and analyze A/B tests.\n</ab_test>\n\nThen give the final response.",
    example: "Use \"ab_test\" for A/B testing.",
    enabled: true
  },
  {
    trigger: "metric",
    category: "Data & Analytics",
    system_instruction: "<metric>\nDefine and track key metrics.\n</metric>\n\nThen give the final response.",
    example: "Use \"metric\" for metric definition.",
    enabled: true
  },
  {
    trigger: "kpi",
    category: "Data & Analytics",
    system_instruction: "<kpi>\nDefine KPIs and track performance.\n</kpi>\n\nThen give the final response.",
    example: "Use \"kpi\" for KPI management.",
    enabled: true
  },
  {
    trigger: "dashboard",
    category: "Data & Analytics",
    system_instruction: "<dashboard>\nDesign analytics dashboards.\n</dashboard>\n\nThen give the final response.",
    example: "Use \"dashboard\" for dashboard design.",
    enabled: true
  },
  {
    trigger: "reporting",
    category: "Data & Analytics",
    system_instruction: "<reporting>\nCreate data reports.\n</reporting>\n\nThen give the final response.",
    example: "Use \"reporting\" for report generation.",
    enabled: true
  },
  {
    trigger: "data_storytelling",
    category: "Data & Analytics",
    system_instruction: "<data_storytelling>\nTell stories with data.\n</data_storytelling>\n\nThen give the final response.",
    example: "Use \"data_storytelling\" for narrative analytics.",
    enabled: true
  },

  /* ==================== Business & Strategy (25 triggers) ==================== */
  {
    trigger: "swot",
    category: "Business & Strategy",
    system_instruction: "<swot>\nConduct SWOT analysis.\n</swot>\n\nThen give the final response.",
    example: "Use \"swot\" for SWOT analysis.",
    enabled: true
  },
  {
    trigger: "market_analysis",
    category: "Business & Strategy",
    system_instruction: "<market_analysis>\nAnalyze market conditions.\n</market_analysis>\n\nThen give the final response.",
    example: "Use \"market_analysis\" for market research.",
    enabled: true
  },
  {
    trigger: "competitor_analysis",
    category: "Business & Strategy",
    system_instruction: "<competitor_analysis>\nAnalyze competitive landscape.\n</competitor_analysis>\n\nThen give the final response.",
    example: "Use \"competitor_analysis\" for competitive analysis.",
    enabled: true
  },
  {
    trigger: "business_model",
    category: "Business & Strategy",
    system_instruction: "<business_model>\nDesign or analyze business models.\n</business_model>\n\nThen give the final response.",
    example: "Use \"business_model\" for business design.",
    enabled: true
  },
  {
    trigger: "revenue_model",
    category: "Business & Strategy",
    system_instruction: "<revenue_model>\nDesign revenue models.\n</revenue_model>\n\nThen give the final response.",
    example: "Use \"revenue_model\" for revenue strategy.",
    enabled: true
  },
  {
    trigger: "pricing_strategy",
    category: "Business & Strategy",
    system_instruction: "<pricing_strategy>\nDevelop pricing strategies.\n</pricing_strategy>\n\nThen give the final response.",
    example: "Use \"pricing_strategy\" for pricing decisions.",
    enabled: true
  },
  {
    trigger: "customer_journey",
    category: "Business & Strategy",
    system_instruction: "<customer_journey>\nMap customer journey.\n</customer_journey>\n\nThen give the final response.",
    example: "Use \"customer_journey\" for journey mapping.",
    enabled: true
  },
  {
    trigger: "user_persona",
    category: "Business & Strategy",
    system_instruction: "<user_persona>\nDevelop user personas.\n</user_persona>\n\nThen give the final response.",
    example: "Use \"user_persona\" for persona development.",
    enabled: true
  },
  {
    trigger: "stakeholder_analysis",
    category: "Business & Strategy",
    system_instruction: "<stakeholder_analysis>\nAnalyze stakeholders.\n</stakeholder_analysis>\n\nThen give the final response.",
    example: "Use \"stakeholder_analysis\" for stakeholder mapping.",
    enabled: true
  },
  {
    trigger: "risk_assessment",
    category: "Business & Strategy",
    system_instruction: "<risk_assessment>\nAssess business risks.\n</risk_assessment>\n\nThen give the final response.",
    example: "Use \"risk_assessment\" for risk analysis.",
    enabled: true
  },
  {
    trigger: "mitigation",
    category: "Business & Strategy",
    system_instruction: "<mitigation>\nDevelop risk mitigation strategies.\n</mitigation>\n\nThen give the final response.",
    example: "Use \"mitigation\" for risk mitigation.",
    enabled: true
  },
  {
    trigger: "opportunity",
    category: "Business & Strategy",
    system_instruction: "<opportunity>\nIdentify business opportunities.\n</opportunity>\n\nThen give the final response.",
    example: "Use \"opportunity\" for opportunity assessment.",
    enabled: true
  },
  {
    trigger: "competitive_advantage",
    category: "Business & Strategy",
    system_instruction: "<competitive_advantage>\nIdentify competitive advantages.\n</competitive_advantage>\n\nThen give the final response.",
    example: "Use \"competitive_advantage\" for advantage analysis.",
    enabled: true
  },
  {
    trigger: "value_proposition",
    category: "Business & Strategy",
    system_instruction: "<value_proposition>\nDevelop value propositions.\n</value_proposition>\n\nThen give the final response.",
    example: "Use \"value_proposition\" for proposition development.",
    enabled: true
  },
  {
    trigger: "go_to_market",
    category: "Business & Strategy",
    system_instruction: "<go_to_market>\nDevelop go-to-market strategies.\n</go_to_market>\n\nThen give the final response.",
    example: "Use \"go_to_market\" for market entry strategy.",
    enabled: true
  },
  {
    trigger: "product_strategy",
    category: "Business & Strategy",
    system_instruction: "<product_strategy>\nDevelop product strategies.\n</product_strategy>\n\nThen give the final response.",
    example: "Use \"product_strategy\" for product planning.",
    enabled: true
  },
  {
    trigger: "scaling",
    category: "Business & Strategy",
    system_instruction: "<scaling>\nPlan for scaling operations.\n</scaling>\n\nThen give the final response.",
    example: "Use \"scaling\" for growth planning.",
    enabled: true
  },
  {
    trigger: "automation",
    category: "Business & Strategy",
    system_instruction: "<automation>\nIdentify automation opportunities.\n</automation>\n\nThen give the final response.",
    example: "Use \"automation\" for process automation.",
    enabled: true
  },
  {
    trigger: "efficiency",
    category: "Business & Strategy",
    system_instruction: "<efficiency>\nOptimize operational efficiency.\n</efficiency>\n\nThen give the final response.",
    example: "Use \"efficiency\" for efficiency improvements.",
    enabled: true
  },
  {
    trigger: "cost_optimization",
    category: "Business & Strategy",
    system_instruction: "<cost_optimization>\nOptimize costs.\n</cost_optimization>\n\nThen give the final response.",
    example: "Use \"cost_optimization\" for cost reduction.",
    enabled: true
  },
  {
    trigger: "roi_analysis",
    category: "Business & Strategy",
    system_instruction: "<roi_analysis>\nAnalyze return on investment.\n</roi_analysis>\n\nThen give the final response.",
    example: "Use \"roi_analysis\" for ROI calculation.",
    enabled: true
  },
  {
    trigger: "financial_planning",
    category: "Business & Strategy",
    system_instruction: "<financial_planning>\nPlan financial strategy.\n</financial_planning>\n\nThen give the final response.",
    example: "Use \"financial_planning\" for financial strategy.",
    enabled: true
  },
  {
    trigger: "budget",
    category: "Business & Strategy",
    system_instruction: "<budget>\nCreate and manage budgets.\n</budget>\n\nThen give the final response.",
    example: "Use \"budget\" for budget planning.",
    enabled: true
  },
  {
    trigger: "forecast",
    category: "Business & Strategy",
    system_instruction: "<forecast>\nForecast business metrics.\n</forecast>\n\nThen give the final response.",
    example: "Use \"forecast\" for business forecasting.",
    enabled: true
  },

  /* ==================== Education & Learning (20 triggers) ==================== */
  {
    trigger: "learning_path",
    category: "Education & Learning",
    system_instruction: "<learning_path>\nDesign learning paths.\n</learning_path>\n\nThen give the final response.",
    example: "Use \"learning_path\" for curriculum design.",
    enabled: true
  },
  {
    trigger: "concept_explanation",
    category: "Education & Learning",
    system_instruction: "<concept_explanation>\nExplain concepts clearly.\n</concept_explanation>\n\nThen give the final response.",
    example: "Use \"concept_explanation\" for teaching concepts.",
    enabled: true
  },
  {
    trigger: "skill_building",
    category: "Education & Learning",
    system_instruction: "<skill_building>\nDevelop skills progressively.\n</skill_building>\n\nThen give the final response.",
    example: "Use \"skill_building\" for skill development.",
    enabled: true
  },
  {
    trigger: "practice_exercise",
    category: "Education & Learning",
    system_instruction: "<practice_exercise>\nCreate practice exercises.\n</practice_exercise>\n\nThen give the final response.",
    example: "Use \"practice_exercise\" for practice design.",
    enabled: true
  },
  {
    trigger: "quiz",
    category: "Education & Learning",
    system_instruction: "<quiz>\nCreate quiz questions and assessments.\n</quiz>\n\nThen give the final response.",
    example: "Use \"quiz\" for quiz creation.",
    enabled: true
  },
  {
    trigger: "assessment",
    category: "Education & Learning",
    system_instruction: "<assessment>\nDesign assessments.\n</assessment>\n\nThen give the final response.",
    example: "Use \"assessment\" for assessment design.",
    enabled: true
  },
  {
    trigger: "rubric",
    category: "Education & Learning",
    system_instruction: "<rubric>\nCreate grading rubrics.\n</rubric>\n\nThen give the final response.",
    example: "Use \"rubric\" for rubric development.",
    enabled: true
  },
  {
    trigger: "feedback",
    category: "Education & Learning",
    system_instruction: "<feedback>\nProvide constructive feedback.\n</feedback>\n\nThen give the final response.",
    example: "Use \"feedback\" for feedback delivery.",
    enabled: true
  },
  {
    trigger: "metacognition",
    category: "Education & Learning",
    system_instruction: "<metacognition>\nPromote metacognitive thinking.\n</metacognition>\n\nThen give the final response.",
    example: "Use \"metacognition\" for reflective learning.",
    enabled: true
  },
  {
    trigger: "learning_objective",
    category: "Education & Learning",
    system_instruction: "<learning_objective>\nDefine learning objectives.\n</learning_objective>\n\nThen give the final response.",
    example: "Use \"learning_objective\" for objective setting.",
    enabled: true
  },
  {
    trigger: "prerequisite",
    category: "Education & Learning",
    system_instruction: "<prerequisite>\nIdentify prerequisites.\n</prerequisite>\n\nThen give the final response.",
    example: "Use \"prerequisite\" for prerequisite mapping.",
    enabled: true
  },
  {
    trigger: "scaffolding",
    category: "Education & Learning",
    system_instruction: "<scaffolding>\nUse scaffolding techniques.\n</scaffolding>\n\nThen give the final response.",
    example: "Use \"scaffolding\" for graduated learning.",
    enabled: true
  },
  {
    trigger: "differentiation",
    category: "Education & Learning",
    system_instruction: "<differentiation>\nDifferentiate instruction.\n</differentiation>\n\nThen give the final response.",
    example: "Use \"differentiation\" for adaptive learning.",
    enabled: true
  },
  {
    trigger: "multiple_intelligences",
    category: "Education & Learning",
    system_instruction: "<multiple_intelligences>\nApply multiple intelligences theory.\n</multiple_intelligences>\n\nThen give the final response.",
    example: "Use \"multiple_intelligences\" for diverse learning styles.",
    enabled: true
  },
  {
    trigger: "learning_style",
    category: "Education & Learning",
    system_instruction: "<learning_style>\nAdapt to different learning styles.\n</learning_style>\n\nThen give the final response.",
    example: "Use \"learning_style\" for personalized learning.",
    enabled: true
  },
  {
    trigger: "active_learning",
    category: "Education & Learning",
    system_instruction: "<active_learning>\nPromote active learning.\n</active_learning>\n\nThen give the final response.",
    example: "Use \"active_learning\" for engagement.",
    enabled: true
  },
  {
    trigger: "peer_learning",
    category: "Education & Learning",
    system_instruction: "<peer_learning>\nFacilitate peer learning.\n</peer_learning>\n\nThen give the final response.",
    example: "Use \"peer_learning\" for collaborative learning.",
    enabled: true
  },
  {
    trigger: "socratic_method",
    category: "Education & Learning",
    system_instruction: "<socratic_method>\nUse Socratic questioning.\n</socratic_method>\n\nThen give the final response.",
    example: "Use \"socratic_method\" for guided discovery.",
    enabled: true
  },
  {
    trigger: "spaced_repetition",
    category: "Education & Learning",
    system_instruction: "<spaced_repetition>\nApply spaced repetition.\n</spaced_repetition>\n\nThen give the final response.",
    example: "Use \"spaced_repetition\" for memory retention.",
    enabled: true
  },
  {
    trigger: "retention",
    category: "Education & Learning",
    system_instruction: "<retention>\nOptimize information retention.\n</retention>\n\nThen give the final response.",
    example: "Use \"retention\" for memory optimization.",
    enabled: true
  }
];

// Get all triggers (built-in + custom)
export const getAllTriggers = (): Trigger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customTriggers = JSON.parse(stored) as Trigger[];
      const triggerMap = new Map<string, Trigger>();
      BUILT_IN_TRIGGERS.forEach(t => triggerMap.set(t.trigger.toLowerCase(), t));
      customTriggers.forEach(t => triggerMap.set(t.trigger.toLowerCase(), t));
      return Array.from(triggerMap.values());
    }
    return BUILT_IN_TRIGGERS;
  } catch (error) {
    console.error('Error loading triggers:', error);
    return BUILT_IN_TRIGGERS;
  }
};

export const saveTriggers = (triggers: Trigger[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  } catch (error) {
    console.error('Error saving triggers:', error);
  }
};

export const addTrigger = (trigger: Trigger) => {
  const triggers = getAllTriggers();
  const exists = triggers.some(t => t.trigger.toLowerCase() === trigger.trigger.toLowerCase());
  if (exists) {
    throw new Error('Trigger already exists');
  }
  triggers.push({ ...trigger, custom: true });
  saveTriggers(triggers);
};

export const updateTrigger = (oldTrigger: string, newTrigger: Trigger) => {
  const triggers = getAllTriggers();
  const index = triggers.findIndex(t => t.trigger.toLowerCase() === oldTrigger.toLowerCase());
  if (index !== -1) {
    triggers[index] = newTrigger;
    saveTriggers(triggers);
  }
};

export const deleteTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const filtered = triggers.filter(t => 
    t.trigger.toLowerCase() !== triggerName.toLowerCase() || !t.custom
  );
  saveTriggers(filtered);
};

export const toggleTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const trigger = triggers.find(t => t.trigger.toLowerCase() === triggerName.toLowerCase());
  if (trigger) {
    trigger.enabled = !trigger.enabled;
    saveTriggers(triggers);
  }
};

export const exportTriggers = () => {
  const triggers = getAllTriggers();
  const dataStr = JSON.stringify(triggers, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onyxgpt-triggers-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importTriggers = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Trigger[];
        saveTriggers(imported);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const generateTagName = (triggerName: string): string => {
  return triggerName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

export const generateTriggerMetadata = (trigger: Trigger, userPrompt: string): TriggerMetadata => {
  const tagName = generateTagName(trigger.trigger);
  return {
    trigger: trigger.trigger,
    category: trigger.category,
    purpose: trigger.system_instruction.replace(/Use tags.*?final_response\.\s*/i, '').trim(),
    context_used: `Applied to user prompt: "${userPrompt.substring(0, 100)}${userPrompt.length > 100 ? '...' : ''}"`,
    influence_scope: `Affects response structure, tone, and content based on ${trigger.category.toLowerCase()} requirements.`,
    custom: trigger.custom ?? false,
  };
};

export const detectTriggersAndBuildPrompt = (userMessage: string): { 
  systemPrompt: string; 
  detectedTriggers: DetectedTrigger[];
  enhancedSystemPrompt?: string;
} => {
  const triggers = getAllTriggers().filter(t => t.enabled);
  const detectedTriggers: DetectedTrigger[] = [];
  const instructions: string[] = [];
  const enhancedInstructions: string[] = [];

  const lowerMessage = userMessage.toLowerCase();

  triggers.forEach(trigger => {
    const regex = new RegExp(`\\b${trigger.trigger.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      const tagName = generateTagName(trigger.trigger);
      const metadata = generateTriggerMetadata(trigger, userMessage);
      
      detectedTriggers.push({
        name: trigger.trigger,
        tag: tagName,
        category: trigger.category,
        instruction: trigger.system_instruction,
        metadata,
      });
      
      instructions.push(`${trigger.trigger} means ${trigger.system_instruction}`);
      
      // Build enhanced system prompt with trigger response format
      if (trigger.system_prompt_template || trigger.trigger_response_format) {
        const template = trigger.system_prompt_template || buildDefaultSystemPromptTemplate(trigger);
        enhancedInstructions.push(template);
      }
    }
  });

  let systemPrompt = '';
  if (instructions.length > 0) {
    systemPrompt = instructions.join(' ') + '\n\nFor';
  } else {
    systemPrompt = '';
  }

  let enhancedSystemPrompt = '';
  if (enhancedInstructions.length > 0) {
    enhancedSystemPrompt = enhancedInstructions.join('\n\n---\n\n');
  }

  return { systemPrompt, detectedTriggers, enhancedSystemPrompt };
};

/**
 * Build default system prompt template for triggers without custom templates
 */
export const buildDefaultSystemPromptTemplate = (trigger: Trigger): string => {
  const triggerTag = generateTagName(trigger.trigger);
  
  return `## Trigger: ${trigger.trigger} (${trigger.category})

**System Instruction**: ${trigger.system_instruction}

**Response Format**: 
- Begin your response by clearly indicating which trigger is active: "Activating [${trigger.trigger}] trigger"
- Provide comprehensive, in-depth analysis using the <${triggerTag}></> tags to structure your thinking
- After the tagged section, provide a complete, polished response that incorporates the trigger's guidance
- Ensure the final response is long-form and thorough for better user experience

**Context Metadata**:
- Category: ${trigger.category}
- Trigger Type: ${trigger.custom ? 'Custom' : 'Built-in'}
- Use for: ${trigger.example}

---`;
};

/**
 * Build enhanced system prompt for AI with memory context
 */
export const buildEnhancedSystemPromptWithMemory = (
  detectedTriggers: DetectedTrigger[],
  memoryContext?: string,
  selectedMemoryForContext?: Array<{ key: string; value: string }>,
): string => {
  const sections: string[] = [];

  sections.push('## Active Triggers & Response Format\n');
  
  detectedTriggers.forEach((trigger, idx) => {
    sections.push(`### Trigger ${idx + 1}: ${trigger.name}`);
    sections.push(`Category: ${trigger.category}`);
    sections.push(`Instruction: ${trigger.instruction}`);
    sections.push('');
  });

  if (memoryContext) {
    sections.push('## AI Memory Context (Internal Only)\n');
    sections.push(`Trigger Usage: ${memoryContext}\n`);
  }

  if (selectedMemoryForContext && selectedMemoryForContext.length > 0) {
    sections.push('## Selected Memory Context\n');
    selectedMemoryForContext.forEach(mem => {
      sections.push(`- **${mem.key}**: ${mem.value}`);
    });
    sections.push('');
  }

  sections.push('## Response Guidelines\n');
  sections.push('- Provide thorough, comprehensive responses to each trigger');
  sections.push('- Use structured thinking with appropriate XML tags');
  sections.push('- Ensure responses are informative and detailed');
  sections.push('- Maintain context from any related memories when relevant');

  return sections.join('\n');
};

const isInsideCodeBlock = (content: string, position: number): boolean => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (position >= match.index && position < match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
};

export const parseTriggeredResponse = (content: string): {
  cleanContent: string;
  taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }>;
} => {
  if (!content || typeof content !== 'string') {
    return { cleanContent: '', taggedSegments: [] };
  }

  const taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }> = [];
  let cleanContent = content;
  const replacements: Array<{ start: number; end: number }> = [];
  
  const tagRegex = /<([a-zA-Z_][a-zA-Z0-9_]*?)>([\s\S]*?)<\/\1>/g;
  let match;
  
  tagRegex.lastIndex = 0;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tagName, tagContent] = match;
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, match.index)) {
      taggedSegments.push({
        tag: tagName,
        content: tagContent.trim(),
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
      });
      replacements.push({ start: match.index, end: match.index + fullMatch.length });
    }
  }
  
  const allOpeningsRegex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/g;
  let openingMatch;
  const unclosedTags: Array<{ tagName: string; index: number; endIndex: number }> = [];
  
  while ((openingMatch = allOpeningsRegex.exec(content)) !== null) {
    const tagName = openingMatch[1];
    const closingTag = `</${tagName}>`;
    
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, openingMatch.index)) {
      const closingIndex = content.indexOf(closingTag, openingMatch.index);
      const hasClosingTag = closingIndex !== -1;
      
      if (!hasClosingTag) {
        unclosedTags.push({
          tagName,
          index: openingMatch.index,
          endIndex: openingMatch.index + openingMatch[0].length,
        });
      }
    }
  }
  
  if (unclosedTags.length > 0) {
    const lastUnclosedTag = unclosedTags[unclosedTags.length - 1];
    const alreadyInSegments = taggedSegments.some(seg => seg.tag === lastUnclosedTag.tagName);
    
    if (!alreadyInSegments) {
      let contentStart = lastUnclosedTag.endIndex;
      let contentEnd = content.length;
      
      const otherOpenTagsAfter = unclosedTags.filter(t => t.index > lastUnclosedTag.index);
      if (otherOpenTagsAfter.length > 0) {
        const firstOtherTag = otherOpenTagsAfter[0];
        contentEnd = firstOtherTag.index;
      }
      
      const contentToUse = content.substring(contentStart, contentEnd);
      
      taggedSegments.push({
        tag: lastUnclosedTag.tagName,
        content: contentToUse.trim(),
        startIndex: lastUnclosedTag.index,
        endIndex: contentEnd,
      });
      
      replacements.push({ start: lastUnclosedTag.index, end: contentEnd });
    }
  }
  
  const sortedReplacements = replacements.sort((a, b) => b.start - a.start);
  
  for (const replacement of sortedReplacements) {
    cleanContent = cleanContent.substring(0, replacement.start) + cleanContent.substring(replacement.end);
  }
  
  for (const tag of VALID_TRIGGER_TAGS) {
    const closingRegex = new RegExp(`</${tag}>`, 'g');
    cleanContent = cleanContent.replace(closingRegex, '');
  }
  
  cleanContent = cleanContent
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
  
  return { cleanContent, taggedSegments };
};

export const resetToBuiltIn = () => {
  saveTriggers(BUILT_IN_TRIGGERS);
};

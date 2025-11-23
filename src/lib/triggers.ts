// Trigger Framework - Storage and Utilities

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
  category: 'Reasoning & Analysis' | 'Research & Information' | 'Planning & Organization' | 'Communication & Style';
  system_instruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
  tag?: string; // XML tag format
  metadata_support?: boolean;
}

export interface DetectedTrigger {
  name: string;
  tag: string;
  category: string;
  instruction: string;
  metadata: TriggerMetadata;
}

const STORAGE_KEY = 'onyxgpt_triggers';

// Built-in triggers organized by category
const BUILT_IN_TRIGGERS: Trigger[] = [
  /* ---------------------------- Reasoning & Analysis ---------------------------- */
  {
     "trigger": "reason",
     "category": "Reasoning & Analysis",
     "system_instruction": "When 'reason' is detected, structure your response as follows:\n\n<reason>\nProvide your step-by-step logical thinking and reasoning process here. Break down the problem, identify key considerations, and work through your analysis. Continue gathering logical insights throughout.\n</reason>\n\n[REASONING WORK COMPLETED]\n\nThen provide your final response in clear, coherent paragraphs.\n\nUse logical, step-by-step reasoning to reach conclusions clearly and coherently.",
     "example": "Use \"reason\" to analyze complex problems systematically.",
     "enabled": true
   },
  {
    "trigger": "analyze",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'analyze' is detected, structure your response as follows:\n\n<analyze>\nBreak down the topic into key components, identify relationships between parts, and explain the underlying logic and connections. Continue gathering analytical insights throughout.\n</analyze>\n\n[ANALYSIS WORK COMPLETED]\n\nThen provide your detailed analysis in clear sections.",
    "example": "Use \"analyze\" to examine data or concepts in depth.",
    "enabled": true
  },
  {
    "trigger": "critique",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'critique' is detected, structure your response as follows:\n\n<critique>\nEvaluate the strengths and weaknesses objectively. Consider biases, limitations, and areas for improvement. Continue gathering critical insights throughout.\n</critique>\n\n[CRITIQUE WORK COMPLETED]\n\nThen provide your comprehensive critique.",
    "example": "Use \"critique\" to assess arguments or work critically.",
    "enabled": true
  },
  {
    "trigger": "debate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'debate' is detected, structure your response as follows:\n\n<debate>\nPresent arguments supporting both sides of the issue fairly and thoroughly before drawing conclusions. Continue gathering perspectives throughout.\n</debate>\n\n[DEBATE WORK COMPLETED]\n\nThen provide your balanced summary.",
    "example": "Use \"debate\" to explore multiple perspectives.",
    "enabled": true
  },
  {
    "trigger": "compare",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'compare' is detected, structure your response as follows:\n\n<compare>\nIdentify and explain similarities and shared characteristics between the items or concepts being compared. Continue gathering comparative insights throughout.\n</compare>\n\n[COMPARISON WORK COMPLETED]\n\nThen provide a structured comparison.",
    "example": "Use \"compare\" to evaluate similar concepts.",
    "enabled": true
  },
  {
    "trigger": "contrast",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'contrast' is detected, structure your response as follows:\n\n<contrast>\nHighlight and explain the key differences and distinguishing features between the topics. Continue gathering contrasting insights throughout.\n</contrast>\n\n[CONTRAST WORK COMPLETED]\n\nThen provide detailed contrasts.",
    "example": "Use \"contrast\" to emphasize differences.",
    "enabled": true
  },
  {
    "trigger": "deduce",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'deduce' is detected, structure your response as follows:\n\n<deduce>\nApply logical inference from given premises to derive valid conclusions. Continue gathering deductive insights throughout.\n</deduce>\n\n[DEDUCTION WORK COMPLETED]\n\nThen provide your deductive conclusions.",
    "example": "Use \"deduce\" for logical problem-solving.",
    "enabled": true
  },
  {
    "trigger": "evaluate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'evaluate' is detected, structure your response as follows:\n\n<evaluate>\nAssess the quality, relevance, and strength of evidence. Judge merit and value objectively. Continue gathering evaluative insights throughout.\n</evaluate>\n\n[EVALUATION WORK COMPLETED]\n\nThen provide your evaluation.",
    "example": "Use \"evaluate\" to assess merit or value.",
    "enabled": true
  },
  {
    "trigger": "justify",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'justify' is detected, structure your response as follows:\n\n<justify>\nDefend the claim with rational arguments, logical reasoning, and factual support. Continue gathering justification throughout.\n</justify>\n\n[JUSTIFICATION WORK COMPLETED]\n\nThen provide your justification.",
    "example": "Use \"justify\" to provide supporting reasoning.",
    "enabled": true
  },
  {
    "trigger": "hypothesize",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'hypothesize' is detected, structure your response as follows:\n\n<hypothesize>\nFormulate plausible explanations or predictions grounded in available evidence. Continue gathering hypothesis insights throughout.\n</hypothesize>\n\n[HYPOTHESIS WORK COMPLETED]\n\nThen provide your hypothesis and supporting reasoning.",
    "example": "Use \"hypothesize\" for theory building.",
    "enabled": true
  },
  {
    "trigger": "examine",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'examine' is detected, structure your response as follows:\n\n<examine>\nInspect details thoroughly, analyze implications, and comment on significance. Continue gathering examination insights throughout.\n</examine>\n\n[EXAMINATION WORK COMPLETED]\n\nThen provide your detailed examination.",
    "example": "Use \"examine\" for detailed inspection.",
    "enabled": true
  },
  {
    "trigger": "interpret",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'interpret' is detected, structure your response as follows:\n\n<interpret>\nExplain meaning and significance in clear, contextualized terms with proper context. Continue gathering interpretive insights throughout.\n</interpret>\n\n[INTERPRETATION WORK COMPLETED]\n\nThen provide your interpretation.",
    "example": "Use \"interpret\" to decode complex information.",
    "enabled": true
  },
  {
    "trigger": "verify",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'verify' is detected, structure your response as follows:\n\n<verify>\nCheck accuracy and consistency of statements against known facts and reliable sources. Continue gathering verification insights throughout.\n</verify>\n\n[VERIFICATION WORK COMPLETED]\n\nThen provide your verification results.",
    "example": "Use \"verify\" to confirm facts.",
    "enabled": true
  },
  {
    "trigger": "reflect",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'reflect' is detected, structure your response as follows:\n\n<reflect>\nOffer thoughtful insights, meta-analysis, and broader implications drawn from the topic. Continue gathering reflective insights throughout.\n</reflect>\n\n[REFLECTION WORK COMPLETED]\n\nThen provide your reflections.",
    "example": "Use \"reflect\" for deeper understanding.",
    "enabled": true
  },
  {
    "trigger": "infer",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'infer' is detected, structure your response as follows:\n\n<infer>\nDraw reasonable conclusions based on provided information and logical deduction. Continue gathering inferential insights throughout.\n</infer>\n\n[INFERENCE WORK COMPLETED]\n\nThen provide your inferences.",
    "example": "Use \"infer\" to read between the lines.",
    "enabled": true
  },
  {
    "trigger": "explore",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'explore' is detected, structure your response as follows:\n\n<explore>\nInvestigate multiple angles, perspectives, and possibilities on the topic comprehensively. Continue gathering exploratory insights throughout.\n</explore>\n\n[EXPLORATION WORK COMPLETED]\n\nThen provide your exploration.",
    "example": "Use \"explore\" for comprehensive investigation.",
    "enabled": true
  },
  {
    "trigger": "discuss",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'discuss' is detected, structure your response as follows:\n\n<discuss>\nProvide balanced discussion covering multiple viewpoints and perspectives fairly. Continue gathering discussion points throughout.\n</discuss>\n\n[DISCUSSION WORK COMPLETED]\n\nThen provide your discussion summary.",
    "example": "Use \"discuss\" for balanced examination.",
    "enabled": true
  },
  {
    "trigger": "validate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'validate' is detected, structure your response as follows:\n\n<validate>\nConfirm truth and reliability of claims using known facts, evidence, and verified sources. Continue gathering validation insights throughout.\n</validate>\n\n[VALIDATION WORK COMPLETED]\n\nThen provide your validation assessment.",
    "example": "Use \"validate\" to check credibility.",
    "enabled": true
  },
  {
    "trigger": "assess",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'assess' is detected, structure your response as follows:\n\n<assess>\nDetermine overall soundness, quality, and performance relative to established standards and benchmarks. Continue gathering assessment insights throughout.\n</assess>\n\n[ASSESSMENT WORK COMPLETED]\n\nThen provide your assessment.",
    "example": "Use \"assess\" for comprehensive evaluation.",
    "enabled": true
  },
  {
    "trigger": "troubleshoot",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'troubleshoot' is detected, structure your response as follows:\n\n<troubleshoot>\nIdentify problems, diagnose root causes, and propose specific corrective steps. Continue gathering troubleshooting insights throughout.\n</troubleshoot>\n\n[TROUBLESHOOTING WORK COMPLETED]\n\nThen provide your troubleshooting recommendations.",
    "example": "Use \"troubleshoot\" to solve issues.",
    "enabled": true
  },

  /* ---------------------------- Research & Information ---------------------------- */
  {
    "trigger": "search",
    "category": "Research & Information",
    "system_instruction": "<search>\nPerform a brief lookup and present concise factual information. Continue gathering relevant facts throughout.\n</search>\n\n[SEARCH WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"search\" for quick factual lookups.",
    "enabled": true
  },
  {
    "trigger": "deep research",
    "category": "Research & Information",
    "system_instruction": "<deep_research>\nConduct an in-depth, multi-source investigation and summarize findings. Continue gathering comprehensive insights throughout.\n</deep_research>\n\n[DEEP RESEARCH WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"deep research\" for comprehensive investigations.",
    "enabled": true
  },
  {
    "trigger": "fact-check",
    "category": "Research & Information",
    "system_instruction": "<fact_check>\nVerify factual accuracy and highlight uncertain or false parts. Continue gathering verification insights throughout.\n</fact_check>\n\n[FACT-CHECK WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"fact-check\" to verify claims.",
    "enabled": true
  },
  {
    "trigger": "contextualize",
    "category": "Research & Information",
    "system_instruction": "<contextualize>\nExplain how the topic fits within its historical, cultural, or scientific background. Continue gathering contextual insights throughout.\n</contextualize>\n\n[CONTEXTUALIZATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"contextualize\" to provide background.",
    "enabled": true
  },
  {
    "trigger": "summarize",
    "category": "Research & Information",
    "system_instruction": "<summarize>\nCondense material into essential meaning and main points. Continue gathering key information throughout.\n</summarize>\n\n[SUMMARIZATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"summarize\" to get key points.",
    "enabled": true
  },
  {
    "trigger": "outline",
    "category": "Research & Information",
    "system_instruction": "<outline>\nProduce a structured outline or bullet framework. Continue gathering structural insights throughout.\n</outline>\n\n[OUTLINE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"outline\" to create structure.",
    "enabled": true
  },
  {
    "trigger": "extract",
    "category": "Research & Information",
    "system_instruction": "<extract>\nPull out the most relevant facts, names, or data points. Continue gathering extraction insights throughout.\n</extract>\n\n[EXTRACTION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"extract\" to identify key information.",
    "enabled": true
  },
  {
    "trigger": "highlight",
    "category": "Research & Information",
    "system_instruction": "<highlight>\nEmphasize key ideas or noteworthy information. Continue gathering highlights throughout.\n</highlight>\n\n[HIGHLIGHTING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"highlight\" to focus on important parts.",
    "enabled": true
  },
  {
    "trigger": "define",
    "category": "Research & Information",
    "system_instruction": "<define>\nProvide precise definitions and short explanations of terms. Continue gathering definitions throughout.\n</define>\n\n[DEFINITION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"define\" to explain terms.",
    "enabled": true
  },
  {
    "trigger": "explain",
    "category": "Research & Information",
    "system_instruction": "<explain>\nClarify concepts with simple language and examples. Continue gathering explanatory insights throughout.\n</explain>\n\n[EXPLANATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"explain\" for clear understanding.",
    "enabled": true
  },
  {
    "trigger": "describe",
    "category": "Research & Information",
    "system_instruction": "<describe>\nPortray the subject with factual detail. Continue gathering descriptive information throughout.\n</describe>\n\n[DESCRIPTION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"describe\" for detailed portrayal.",
    "enabled": true
  },
  {
    "trigger": "cite",
    "category": "Research & Information",
    "system_instruction": "<cite>\nInclude reference-style mentions of credible sources when applicable. Continue gathering citations throughout.\n</cite>\n\n[CITATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"cite\" to reference sources.",
    "enabled": true
  },
  {
    "trigger": "reference",
    "category": "Research & Information",
    "system_instruction": "<reference>\nAcknowledge where facts or ideas originate. Continue gathering references throughout.\n</reference>\n\n[REFERENCE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"reference\" to credit sources.",
    "enabled": true
  },
  {
    "trigger": "clarify",
    "category": "Research & Information",
    "system_instruction": "<clarify>\nRemove ambiguity and restate ideas for better understanding. Continue gathering clarifications throughout.\n</clarify>\n\n[CLARIFICATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"clarify\" to remove confusion.",
    "enabled": true
  },
  {
    "trigger": "expand",
    "category": "Research & Information",
    "system_instruction": "<expand>\nDevelop the concept further with supporting detail. Continue gathering expansions throughout.\n</expand>\n\n[EXPANSION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"expand\" for more depth.",
    "enabled": true
  },
  {
    "trigger": "compress",
    "category": "Research & Information",
    "system_instruction": "<compress>\nShorten content while preserving meaning. Continue gathering compressions throughout.\n</compress>\n\n[COMPRESSION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"compress\" to make content concise.",
    "enabled": true
  },

  /* ---------------------------- Planning & Organization ---------------------------- */
  {
    "trigger": "plan",
    "category": "Planning & Organization",
    "system_instruction": "<plan>\nGenerate a logical step-by-step process to achieve the goal. Continue gathering planning insights throughout.\n</plan>\n\n[PLANNING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"plan\" to create action plans.",
    "enabled": true
  },
  {
    "trigger": "roadmap",
    "category": "Planning & Organization",
    "system_instruction": "<roadmap>\nLay out key milestones and paths toward completion. Continue gathering roadmap insights throughout.\n</roadmap>\n\n[ROADMAP WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"roadmap\" for project planning.",
    "enabled": true
  },
  {
    "trigger": "checklist",
    "category": "Planning & Organization",
    "system_instruction": "<checklist>\nPresent a task list to complete the objective. Continue gathering checklist items throughout.\n</checklist>\n\n[CHECKLIST WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"checklist\" for task lists.",
    "enabled": true
  },
  {
    "trigger": "organize",
    "category": "Planning & Organization",
    "system_instruction": "<organize>\nArrange ideas or data into clear categories. Continue gathering organizational insights throughout.\n</organize>\n\n[ORGANIZATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"organize\" to structure information.",
    "enabled": true
  },
  {
    "trigger": "prioritize",
    "category": "Planning & Organization",
    "system_instruction": "<prioritize>\nOrder tasks or ideas by importance or urgency. Continue gathering prioritization insights throughout.\n</prioritize>\n\n[PRIORITIZATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"prioritize\" to rank importance.",
    "enabled": true
  },
  {
    "trigger": "schedule",
    "category": "Planning & Organization",
    "system_instruction": "<schedule>\nSuggest a timeline or time-based arrangement. Continue gathering scheduling insights throughout.\n</schedule>\n\n[SCHEDULING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"schedule\" for timeline planning.",
    "enabled": true
  },
  {
    "trigger": "brainstorm",
    "category": "Planning & Organization",
    "system_instruction": "<brainstorm>\nGenerate creative ideas without evaluation. Continue gathering brainstorming ideas throughout.\n</brainstorm>\n\n[BRAINSTORMING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"brainstorm\" for idea generation.",
    "enabled": true
  },
  {
    "trigger": "propose",
    "category": "Planning & Organization",
    "system_instruction": "<propose>\nOffer a structured and reasoned proposal. Continue gathering proposal insights throughout.\n</propose>\n\n[PROPOSAL WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"propose\" to suggest solutions.",
    "enabled": true
  },
  {
    "trigger": "structure",
    "category": "Planning & Organization",
    "system_instruction": "<structure>\nPresent information using logical sections. Continue gathering structural insights throughout.\n</structure>\n\n[STRUCTURE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"structure\" to organize content.",
    "enabled": true
  },
  {
    "trigger": "map",
    "category": "Planning & Organization",
    "system_instruction": "<map>\nShow conceptual or relational connections. Continue gathering mapping insights throughout.\n</map>\n\n[MAPPING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"map\" to show relationships.",
    "enabled": true
  },
  {
    "trigger": "draft",
    "category": "Planning & Organization",
    "system_instruction": "<draft>\nCreate an initial version with key sections. Continue gathering draft insights throughout.\n</draft>\n\n[DRAFTING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"draft\" to build first versions.",
    "enabled": true
  },
  {
    "trigger": "improve",
    "category": "Planning & Organization",
    "system_instruction": "<improve>\nSuggest refinements to strengthen quality. Continue gathering improvement insights throughout.\n</improve>\n\n[IMPROVEMENT WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"improve\" to enhance writing.",
    "enabled": true
  },
  {
    "trigger": "review",
    "category": "Planning & Organization",
    "system_instruction": "<review>\nEvaluate content and summarize potential revisions. Continue gathering review insights throughout.\n</review>\n\n[REVIEW WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"review\" for evaluation.",
    "enabled": true
  },

  /* ---------------------------- Communication & Style ---------------------------- */
  {
    "trigger": "simplify",
    "category": "Communication & Style",
    "system_instruction": "<simplify>\nRephrase complex ideas into plain language. Continue gathering simplifications throughout.\n</simplify>\n\n[SIMPLIFICATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"simplify\" to make content easier.",
    "enabled": true
  },
  {
    "trigger": "formalize",
    "category": "Communication & Style",
    "system_instruction": "<formalize>\nConvert tone into a professional register. Continue gathering formal language insights throughout.\n</formalize>\n\n[FORMALIZATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"formalize\" for academic tone.",
    "enabled": true
  },
  {
    "trigger": "rephrase",
    "category": "Communication & Style",
    "system_instruction": "<rephrase>\nRewrite content using different wording with identical meaning. Continue gathering rephrasings throughout.\n</rephrase>\n\n[REPHRASINGS WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"rephrase\" to change wording.",
    "enabled": true
  },
  {
    "trigger": "rewrite",
    "category": "Communication & Style",
    "system_instruction": "<rewrite>\nProduce a clearer version while keeping intent. Continue gathering rewriting insights throughout.\n</rewrite>\n\n[REWRITING WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"rewrite\" for clarity.",
    "enabled": true
  },
  {
    "trigger": "summarize-for-kids",
    "category": "Communication & Style",
    "system_instruction": "<summarize_for_kids>\nExplain the idea in age-appropriate, simple terms. Continue gathering kid-friendly explanations throughout.\n</summarize_for_kids>\n\n[KID-FRIENDLY SUMMARY WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"summarize-for-kids\" for child-friendly explanations.",
    "enabled": true
  },
  {
    "trigger": "persuasive",
    "category": "Communication & Style",
    "system_instruction": "<persuasive>\nUse logical appeals and evidence to persuade. Continue gathering persuasive arguments throughout.\n</persuasive>\n\n[PERSUASION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"persuasive\" for convincing arguments.",
    "enabled": true
  },
  {
    "trigger": "informative",
    "category": "Communication & Style",
    "system_instruction": "<informative>\nDeliver factual, balanced, educational information. Continue gathering informative content throughout.\n</informative>\n\n[INFORMATIVE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"informative\" for educational content.",
    "enabled": true
  },
  {
    "trigger": "neutral",
    "category": "Communication & Style",
    "system_instruction": "<neutral>\nMaintain objectivity and avoid bias. Continue gathering neutral perspectives throughout.\n</neutral>\n\n[NEUTRAL PERSPECTIVE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"neutral\" for unbiased responses.",
    "enabled": true
  },
  {
    "trigger": "balanced",
    "category": "Communication & Style",
    "system_instruction": "<balanced>\nRepresent multiple perspectives fairly. Continue gathering balanced insights throughout.\n</balanced>\n\n[BALANCED PERSPECTIVE WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"balanced\" for fair representation.",
    "enabled": true
  },
  {
    "trigger": "empathetic",
    "category": "Communication & Style",
    "system_instruction": "<empathetic>\nUse sensitive, supportive phrasing. Continue gathering empathetic insights throughout.\n</empathetic>\n\n[EMPATHETIC COMMUNICATION WORK COMPLETED]\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"empathetic\" for supportive communication.",
    "enabled": true
  }
];

// Get all triggers (built-in + custom)
export const getAllTriggers = (): Trigger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customTriggers = JSON.parse(stored) as Trigger[];
      // Merge built-in with custom, custom takes precedence
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

// Save triggers
export const saveTriggers = (triggers: Trigger[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  } catch (error) {
    console.error('Error saving triggers:', error);
  }
};

// Add new trigger
export const addTrigger = (trigger: Trigger) => {
  const triggers = getAllTriggers();
  const exists = triggers.some(t => t.trigger.toLowerCase() === trigger.trigger.toLowerCase());
  if (exists) {
    throw new Error('Trigger already exists');
  }
  triggers.push({ ...trigger, custom: true });
  saveTriggers(triggers);
};

// Update trigger
export const updateTrigger = (oldTrigger: string, newTrigger: Trigger) => {
  const triggers = getAllTriggers();
  const index = triggers.findIndex(t => t.trigger.toLowerCase() === oldTrigger.toLowerCase());
  if (index !== -1) {
    triggers[index] = newTrigger;
    saveTriggers(triggers);
  }
};

// Delete trigger (only custom ones)
export const deleteTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const filtered = triggers.filter(t => 
    t.trigger.toLowerCase() !== triggerName.toLowerCase() || !t.custom
  );
  saveTriggers(filtered);
};

// Toggle trigger enabled state
export const toggleTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const trigger = triggers.find(t => t.trigger.toLowerCase() === triggerName.toLowerCase());
  if (trigger) {
    trigger.enabled = !trigger.enabled;
    saveTriggers(triggers);
  }
};

// Export triggers as JSON
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

// Import triggers from JSON
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

// Generate tag name from trigger name (spaces to underscores, lowercase)
export const generateTagName = (triggerName: string): string => {
  return triggerName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Generate metadata for a trigger
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

// Detect triggers in user message and build system prompt with metadata
export const detectTriggersAndBuildPrompt = (userMessage: string): { 
  systemPrompt: string; 
  detectedTriggers: DetectedTrigger[] 
} => {
  const triggers = getAllTriggers().filter(t => t.enabled);
  const detectedTriggers: DetectedTrigger[] = [];
  const instructions: string[] = [];

  const lowerMessage = userMessage.toLowerCase();

  // Check for each trigger
  triggers.forEach(trigger => {
    // Match whole words or phrases
    const regex = new RegExp(`\\b${trigger.trigger.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      const tagName = generateTagName(trigger.trigger);
      detectedTriggers.push({
        name: trigger.trigger,
        tag: tagName,
        category: trigger.category,
        instruction: trigger.system_instruction,
        metadata: generateTriggerMetadata(trigger, userMessage),
      });
      instructions.push(`${trigger.trigger} means ${trigger.system_instruction}`);
    }
  });

  // Build system prompt
  let systemPrompt = '';
  if (instructions.length > 0) {
    systemPrompt = instructions.join(' ') + '\n\nFor';
  } else {
    // Default instruction
    systemPrompt = 'default means Respond helpfully, truthfully, and concisely.\n\nFor';
  }

  return { systemPrompt, detectedTriggers };
};

// Parse trigger tags from AI response
export const parseTriggeredResponse = (content: string): {
  cleanContent: string;
  taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }>;
} => {
  if (!content || typeof content !== 'string') {
    return { cleanContent: '', taggedSegments: [] };
  }

  const taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }> = [];
  let cleanContent = content;
  
  // Find all XML-style trigger tags (both paired tags and self-closing)
  // Match: <tag>content</tag> or <tag_name>content</tag_name>
  // Pattern handles underscores in tag names (e.g., deep_research, fact_check)
  const tagRegex = /<([a-zA-Z_][a-zA-Z0-9_]*?)>([\s\S]*?)<\/\1>/g;
  let match;
  
  // Reset regex state
  tagRegex.lastIndex = 0;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tagName, tagContent] = match;
    taggedSegments.push({
      tag: tagName,
      content: tagContent.trim(),
      startIndex: match.index,
      endIndex: match.index + fullMatch.length,
    });
  }
  
  // Remove ALL trigger tags from clean content (don't include the content)
  cleanContent = content.replace(/<([a-zA-Z_][a-zA-Z0-9_]*?)>([\s\S]*?)<\/\1>/g, '');
  
  // Remove any remaining unclosed or orphaned tags
  cleanContent = cleanContent.replace(/<\/?[a-zA-Z_][a-zA-Z0-9_]*?>/g, '');
  
  // Clean up extra whitespace and newlines
  cleanContent = cleanContent
    .replace(/\n\n\n+/g, '\n\n') // Remove excessive newlines
    .trim();
  
  return { cleanContent, taggedSegments };
};

// Reset to built-in triggers
export const resetToBuiltIn = () => {
  saveTriggers(BUILT_IN_TRIGGERS);
};

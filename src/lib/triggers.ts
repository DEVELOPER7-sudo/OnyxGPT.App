// Trigger Framework - Storage and Utilities

export interface Trigger {
  trigger: string;
  category: 'Reasoning & Analysis' | 'Research & Information' | 'Planning & Organization' | 'Communication & Style';
  system_instruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
}

const STORAGE_KEY = 'onyxgpt_triggers';

// Built-in triggers organized by category
const BUILT_IN_TRIGGERS: Trigger[] = [
  {
    trigger: 'reason',
    category: 'Reasoning & Analysis',
    system_instruction: `<reason>Use logical, step-by-step reasoning to reach conclusions clearly and coherently.</reason>final_response`,
    example: 'Use "reason" to analyze complex problems systematically.',
    enabled: true
  },
  {
    trigger: 'analyze',
    category: 'Reasoning & Analysis',
    system_instruction: `<analyze>Break down the topic into parts, identify relationships, and explain underlying logic.</analyze>final_response`,
    example: 'Use "analyze" to examine data or concepts in depth.',
    enabled: true
  },
  {
    trigger: 'critique',
    category: 'Reasoning & Analysis',
    system_instruction: `<critique>Evaluate the strengths, weaknesses, and biases of the subject objectively.</critique>final_response`,
    example: 'Use "critique" to assess arguments or work critically.',
    enabled: true
  },
  {
    trigger: 'debate',
    category: 'Reasoning & Analysis',
    system_instruction: `<debate>Present arguments for and against the issue before summarizing.</debate>final_response`,
    example: 'Use "debate" to explore multiple perspectives.',
    enabled: true
  },
  {
    trigger: 'compare',
    category: 'Reasoning & Analysis',
    system_instruction: `<compare>Identify similarities and differences between the items or ideas.</compare>final_response`,
    example: 'Use "compare" to evaluate similar concepts.',
    enabled: true
  },
  {
    trigger: 'contrast',
    category: 'Reasoning & Analysis',
    system_instruction: `<contrast>Highlight distinctions and divergent features between the listed topics.</contrast>final_response`,
    example: 'Use "contrast" to emphasize differences.',
    enabled: true
  },
  {
    trigger: 'deduce',
    category: 'Reasoning & Analysis',
    system_instruction: `<deduce>Apply inference and logic to derive valid conclusions.</deduce>final_response`,
    example: 'Use "deduce" for logical problem-solving.',
    enabled: true
  },
  {
    trigger: 'evaluate',
    category: 'Reasoning & Analysis',
    system_instruction: `<evaluate>Judge the quality, relevance, and strength of evidence.</evaluate>final_response`,
    example: 'Use "evaluate" to assess merit or value.',
    enabled: true
  },
  {
    trigger: 'justify',
    category: 'Reasoning & Analysis',
    system_instruction: `<justify>Defend the claim with rational arguments and factual support.</justify>final_response`,
    example: 'Use "justify" to provide supporting reasoning.',
    enabled: true
  },
  {
    trigger: 'hypothesize',
    category: 'Reasoning & Analysis',
    system_instruction: `<hypothesize>Formulate plausible explanations or predictions based on evidence.</hypothesize>final_response`,
    example: 'Use "hypothesize" for theory building.',
    enabled: true
  },
  {
    trigger: 'examine',
    category: 'Reasoning & Analysis',
    system_instruction: `<examine>Inspect details thoroughly and comment on implications.</examine>final_response`,
    example: 'Use "examine" for detailed inspection.',
    enabled: true
  },
  {
    trigger: 'interpret',
    category: 'Reasoning & Analysis',
    system_instruction: `<interpret>Explain meaning or significance in clear, contextualized terms.</interpret>final_response`,
    example: 'Use "interpret" to decode complex information.',
    enabled: true
  },
  {
    trigger: 'verify',
    category: 'Reasoning & Analysis',
    system_instruction: `<verify>Check the accuracy and consistency of statements or data.</verify>final_response`,
    example: 'Use "verify" to confirm facts.',
    enabled: true
  },
  {
    trigger: 'reflect',
    category: 'Reasoning & Analysis',
    system_instruction: `<reflect>Offer thoughtful insights and implications drawn from the topic.</reflect>final_response`,
    example: 'Use "reflect" for deeper understanding.',
    enabled: true
  },
  {
    trigger: 'infer',
    category: 'Reasoning & Analysis',
    system_instruction: `<infer>Draw reasonable conclusions based on provided information.</infer>final_response`,
    example: 'Use "infer" to read between the lines.',
    enabled: true
  },
  {
    trigger: 'explore',
    category: 'Reasoning & Analysis',
    system_instruction: `<explore>Investigate multiple angles or perspectives on the topic.</explore>final_response`,
    example: 'Use "explore" for comprehensive investigation.',
    enabled: true
  },
  {
    trigger: 'discuss',
    category: 'Reasoning & Analysis',
    system_instruction: `<discuss>Provide balanced discussion covering several viewpoints.</discuss>final_response`,
    example: 'Use "discuss" for balanced examination.',
    enabled: true
  },
  {
    trigger: 'validate',
    category: 'Reasoning & Analysis',
    system_instruction: `<validate>Confirm truth or reliability of claims using known facts.</validate>final_response`,
    example: 'Use "validate" to check credibility.',
    enabled: true
  },
  {
    trigger: 'assess',
    category: 'Reasoning & Analysis',
    system_instruction: `<assess>Determine overall soundness or performance relative to standards.</assess>final_response`,
    example: 'Use "assess" for comprehensive evaluation.',
    enabled: true
  },
  {
    trigger: 'troubleshoot',
    category: 'Reasoning & Analysis',
    system_instruction: `<troubleshoot>Identify problems, diagnose causes, and propose corrective steps.</troubleshoot>final_response`,
    example: 'Use "troubleshoot" to solve issues.',
    enabled: true
  },

  /* ---------------------------- Research & Information ---------------------------- */

  {
    trigger: 'search',
    category: 'Research & Information',
    system_instruction: `<search>Perform a brief lookup and present concise factual information.</search>final_response`,
    example: 'Use "search" for quick factual lookups.',
    enabled: true
  },
  {
    trigger: 'deep research',
    category: 'Research & Information',
    system_instruction: `<deep_research>Conduct an in-depth, multi-source investigation and summarize findings.</deep_research>final_response`,
    example: 'Use "deep research" for comprehensive investigations.',
    enabled: true
  },
  {
    trigger: 'fact-check',
    category: 'Research & Information',
    system_instruction: `<fact_check>Verify factual accuracy and highlight uncertain or false parts.</fact_check>final_response`,
    example: 'Use "fact-check" to verify claims.',
    enabled: true
  },
  {
    trigger: 'contextualize',
    category: 'Research & Information',
    system_instruction: `<contextualize>Explain how the topic fits within its historical, cultural, or scientific background.</contextualize>final_response`,
    example: 'Use "contextualize" to provide background.',
    enabled: true
  },
  {
    trigger: 'summarize',
    category: 'Research & Information',
    system_instruction: `<summarize>Condense material into essential meaning and main points.</summarize>final_response`,
    example: 'Use "summarize" to get key points.',
    enabled: true
  },
  {
    trigger: 'outline',
    category: 'Research & Information',
    system_instruction: `<outline>Produce a structured outline or bullet framework.</outline>final_response`,
    example: 'Use "outline" to create structure.',
    enabled: true
  },
  {
    trigger: 'extract',
    category: 'Research & Information',
    system_instruction: `<extract>Pull out the most relevant facts, names, or data points.</extract>final_response`,
    example: 'Use "extract" to identify key information.',
    enabled: true
  },
  {
    trigger: 'highlight',
    category: 'Research & Information',
    system_instruction: `<highlight>Emphasize key ideas or noteworthy information.</highlight>final_response`,
    example: 'Use "highlight" to focus on important parts.',
    enabled: true
  },
  {
    trigger: 'define',
    category: 'Research & Information',
    system_instruction: `<define>Provide precise definitions and short explanations of terms.</define>final_response`,
    example: 'Use "define" to explain terms.',
    enabled: true
  },
  {
    trigger: 'explain',
    category: 'Research & Information',
    system_instruction: `<explain>Clarify concepts with simple language and examples.</explain>final_response`,
    example: 'Use "explain" for clear understanding.',
    enabled: true
  },
  {
    trigger: 'describe',
    category: 'Research & Information',
    system_instruction: `<describe>Portray the subject with factual detail.</describe>final_response`,
    example: 'Use "describe" for detailed portrayal.',
    enabled: true
  },
  {
    trigger: 'cite',
    category: 'Research & Information',
    system_instruction: `<cite>Include reference-style mentions of credible sources when applicable.</cite>final_response`,
    example: 'Use "cite" to reference sources.',
    enabled: true
  },
  {
    trigger: 'reference',
    category: 'Research & Information',
    system_instruction: `<reference>Acknowledge where facts or ideas originate.</reference>final_response`,
    example: 'Use "reference" to credit sources.',
    enabled: true
  },
  {
    trigger: 'clarify',
    category: 'Research & Information',
    system_instruction: `<clarify>Remove ambiguity and restate ideas for better understanding.</clarify>final_response`,
    example: 'Use "clarify" to remove confusion.',
    enabled: true
  },
  {
    trigger: 'expand',
    category: 'Research & Information',
    system_instruction: `<expand>Develop the concept further with supporting detail.</expand>final_response`,
    example: 'Use "expand" for more depth.',
    enabled: true
  },
  {
    trigger: 'compress',
    category: 'Research & Information',
    system_instruction: `<compress>Shorten content while preserving meaning.</compress>final_response`,
    example: 'Use "compress" to make content concise.',
    enabled: true
  },

  /* ---------------------------- Planning & Organization ---------------------------- */

  {
    trigger: 'plan',
    category: 'Planning & Organization',
    system_instruction: `<plan>Generate a logical step-by-step process to achieve the goal.</plan>final_response`,
    example: 'Use "plan" to create action plans.',
    enabled: true
  },
  {
    trigger: 'roadmap',
    category: 'Planning & Organization',
    system_instruction: `<roadmap>Lay out key milestones and paths toward completion.</roadmap>final_response`,
    example: 'Use "roadmap" for project planning.',
    enabled: true
  },
  {
    trigger: 'checklist',
    category: 'Planning & Organization',
    system_instruction: `<checklist>Present a task list to complete the objective.</checklist>final_response`,
    example: 'Use "checklist" for task lists.',
    enabled: true
  },
  {
    trigger: 'organize',
    category: 'Planning & Organization',
    system_instruction: `<organize>Arrange ideas or data into clear categories.</organize>final_response`,
    example: 'Use "organize" to structure information.',
    enabled: true
  },
  {
    trigger: 'prioritize',
    category: 'Planning & Organization',
    system_instruction: `<prioritize>Order tasks or ideas by importance or urgency.</prioritize>final_response`,
    example: 'Use "prioritize" to rank importance.',
    enabled: true
  },
  {
    trigger: 'schedule',
    category: 'Planning & Organization',
    system_instruction: `<schedule>Suggest a timeline or time-based arrangement.</schedule>final_response`,
    example: 'Use "schedule" for timeline planning.',
    enabled: true
  },
  {
    trigger: 'brainstorm',
    category: 'Planning & Organization',
    system_instruction: `<brainstorm>Generate creative ideas without evaluation.</brainstorm>final_response`,
    example: 'Use "brainstorm" for idea generation.',
    enabled: true
  },
  {
    trigger: 'propose',
    category: 'Planning & Organization',
    system_instruction: `<propose>Offer a structured and reasoned proposal.</propose>final_response`,
    example: 'Use "propose" to suggest solutions.',
    enabled: true
  },
  {
    trigger: 'structure',
    category: 'Planning & Organization',
    system_instruction: `<structure>Present information using logical sections.</structure>final_response`,
    example: 'Use "structure" to organize content.',
    enabled: true
  },
  {
    trigger: 'map',
    category: 'Planning & Organization',
    system_instruction: `<map>Show conceptual or relational connections.</map>final_response`,
    example: 'Use "map" to show relationships.',
    enabled: true
  },
  {
    trigger: 'draft',
    category: 'Planning & Organization',
    system_instruction: `<draft>Create an initial version with key sections.</draft>final_response`,
    example: 'Use "draft" to build first versions.',
    enabled: true
  },
  {
    trigger: 'improve',
    category: 'Planning & Organization',
    system_instruction: `<improve>Suggest refinements to strengthen quality.</improve>final_response`,
    example: 'Use "improve" to enhance writing.',
    enabled: true
  },
  {
    trigger: 'review',
    category: 'Planning & Organization',
    system_instruction: `<review>Evaluate content and summarize potential revisions.</review>final_response`,
    example: 'Use "review" for evaluation.',
    enabled: true
  },

  /* ---------------------------- Communication & Style ---------------------------- */

  {
    trigger: 'simplify',
    category: 'Communication & Style',
    system_instruction: `<simplify>Rephrase complex ideas into plain language.</simplify>final_response`,
    example: 'Use "simplify" to make content easier.',
    enabled: true
  },
  {
    trigger: 'formalize',
    category: 'Communication & Style',
    system_instruction: `<formalize>Convert tone into a professional register.</formalize>final_response`,
    example: 'Use "formalize" for academic tone.',
    enabled: true
  },
  {
    trigger: 'rephrase',
    category: 'Communication & Style',
    system_instruction: `<rephrase>Rewrite content using different wording with identical meaning.</rephrase>final_response`,
    example: 'Use "rephrase" to change wording.',
    enabled: true
  },
  {
    trigger: 'rewrite',
    category: 'Communication & Style',
    system_instruction: `<rewrite>Produce a clearer version while keeping intent.</rewrite>final_response`,
    example: 'Use "rewrite" for clarity.',
    enabled: true
  },
  {
    trigger: 'summarize-for-kids',
    category: 'Communication & Style',
    system_instruction: `<summarize_for_kids>Explain the idea in age-appropriate, simple terms.</summarize_for_kids>final_response`,
    example: 'Use "summarize-for-kids" for child-friendly explanations.',
    enabled: true
  },
  {
    trigger: 'persuasive',
    category: 'Communication & Style',
    system_instruction: `<persuasive>Use logical appeals and evidence to persuade.</persuasive>final_response`,
    example: 'Use "persuasive" for convincing arguments.',
    enabled: true
  },
  {
    trigger: 'informative',
    category: 'Communication & Style',
    system_instruction: `<informative>Deliver factual, balanced, educational information.</informative>final_response`,
    example: 'Use "informative" for educational content.',
    enabled: true
  },
  {
    trigger: 'neutral',
    category: 'Communication & Style',
    system_instruction: `<neutral>Maintain objectivity and avoid bias.</neutral>final_response`,
    example: 'Use "neutral" for unbiased responses.',
    enabled: true
  },
  {
    trigger: 'balanced',
    category: 'Communication & Style',
    system_instruction: `<balanced>Represent multiple perspectives fairly.</balanced>final_response`,
    example: 'Use "balanced" for fair representation.',
    enabled: true
  },
  {
    trigger: 'empathetic',
    category: 'Communication & Style',
    system_instruction: `<empathetic>Use sensitive, supportive phrasing.</empathetic>final_response`,
    example: 'Use "empathetic" for supportive communication.',
    enabled: true
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

// Detect triggers in user message and build system prompt
export const detectTriggersAndBuildPrompt = (userMessage: string): { systemPrompt: string; detectedTriggers: string[] } => {
  const triggers = getAllTriggers().filter(t => t.enabled);
  const detectedTriggers: string[] = [];
  const instructions: string[] = [];

  const lowerMessage = userMessage.toLowerCase();

  // Check for each trigger
  triggers.forEach(trigger => {
    // Match whole words or phrases
    const regex = new RegExp(`\\b${trigger.trigger.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      detectedTriggers.push(trigger.trigger);
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

// Reset to built-in triggers
export const resetToBuiltIn = () => {
  saveTriggers(BUILT_IN_TRIGGERS);
};

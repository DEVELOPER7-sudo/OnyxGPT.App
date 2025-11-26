import { generateTriggerSystemPrompt } from './src/lib/trigger-system-prompts';
import { Trigger } from './src/lib/triggers';

const mockTrigger: Trigger = {
  trigger: 'reason',
  category: 'Reasoning and Analysis',
  systemInstruction: 'Test instruction',
  example: 'Test example',
  enabled: true
};

console.log(generateTriggerSystemPrompt(mockTrigger));

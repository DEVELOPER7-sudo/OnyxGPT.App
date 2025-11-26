# PASTE THIS INTO YOUR AI CHAT (Claude, ChatGPT, etc.)

---

I'm working on a React/TypeScript trigger system (Aionyx GPT) with 150+ AI triggers. I need you to write code that will make ALL triggers wrap their final response summary in XML tags.

## CONTEXT

**Project:** React 18 + TypeScript + Vite
**Files:** `/workspaces/aionyxgpt-9f7dd7e1/src/lib/triggers.ts` and `trigger-system-prompts.ts`
**Current Functions:**
- `buildDefaultSystemPromptTemplate(trigger: Trigger): string` - builds system prompts for each trigger
- `generateTagName(trigger.trigger): string` - converts trigger name to tag format
- `detectTriggersAndBuildPrompt(message)` - detects triggered keywords in user messages

## REQUIREMENT

When ANY of the 150+ triggers are used, the AI's response should:
1. Provide full response content (analysis, code, reasoning, etc.) as normal
2. **At the very end**, add a final summary wrapped in XML tags matching the trigger name

## EXAMPLE

User Input: "Can you reason through this complex problem?"

AI Response Output (ends with):
```
[Full reasoning and analysis...]

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Logical Steps: Problem decomposition → Analysis → Conclusion
- Main Conclusion: The solution requires both technical and user-centered thinking
- Method Applied: Deductive reasoning with multi-perspective evaluation
</reason>
```

## WHAT YOU NEED TO BUILD

### 1. NEW FUNCTION: `buildTriggerResponseWrapperInstruction()`
**File:** `src/lib/trigger-system-prompts.ts`

Create a function that:
- Takes a `Trigger` object as parameter
- Returns a formatted string with instructions for appending final summary tags
- The instruction should include:
  - Explanation of the XML tag format
  - Category-specific guidance on what to emphasize in the summary
  - Example of the final summary format

### 2. MODIFY EXISTING: `buildDefaultSystemPromptTemplate()`
**File:** `src/lib/triggers.ts` (currently at lines 1527-1546)

Enhance to:
- Call `buildTriggerResponseWrapperInstruction(trigger)` 
- Include the wrapper instruction in the returned template
- Keep the existing system instruction intact

## CATEGORY-SPECIFIC GUIDANCE

The summary should emphasize different things based on the trigger's category:

```
'Reasoning & Analysis' → Logical steps, key insights, conclusions drawn
'Research & Information' → Sources, main findings, relevance/context
'Planning & Organization' → Steps outlined, dependencies, timeline
'Communication & Style' → Tone applied, audience adaptation, structure
'Coding & Development' → Language, design patterns, key considerations
'Creative & Writing' → Literary techniques, narrative elements, tone/voice
'Data & Analytics' → Metrics analyzed, trends found, insights derived
'Business & Strategy' → Market factors, risks assessed, recommendations
'Education & Learning' → Concepts covered, examples provided, approach used
```

## TECHNICAL REQUIREMENTS

✅ Must work with streaming (closing tags at the very end)
✅ Must work when multiple triggers detected (each gets its own tag pair)
✅ Tags wrap ONLY the final summary, not the entire response
✅ Use `generateTagName(trigger.trigger)` for dynamic tag names
✅ Follow existing TypeScript patterns
✅ No breaking changes to existing APIs
✅ Include JSDoc comments for new functions

## EXAMPLE SYSTEM PROMPT OUTPUT

Here's what the function should generate (this is NOT code, just the output):

```
🔴 reason Trigger Active
Category: Reasoning and Analysis

Core Directive: [existing system instruction here]

Response Format:
Provide your full response with step-by-step reasoning...

FINAL RESPONSE REQUIREMENT:
At the very end of your response, AFTER all content, you MUST append a closing summary:

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Logical Steps: [describe your reasoning path]
- Main Conclusion: [primary insight or answer]
- Method Applied: [deductive/inductive/abductive reasoning type]
</reason>

Category-Specific Guidance (Reasoning & Analysis):
- Show step-by-step reasoning
- Identify and validate assumptions
- Consider multiple perspectives
- Draw evidence-based conclusions
```

## FILE LOCATIONS & IMPORTS

**In `src/lib/trigger-system-prompts.ts`:**
- Import: `import { Trigger } from '@/lib/triggers';`
- Already has function `getCategorySpecificGuidance(category)` you can reference

**In `src/lib/triggers.ts`:**
- Import from prompts: `import { buildTriggerResponseWrapperInstruction } from './trigger-system-prompts';`
- Can use existing `generateTagName()` function

## YOUR TASK

1. Create `buildTriggerResponseWrapperInstruction(trigger: Trigger): string` that returns the final summary instruction block
2. Modify `buildDefaultSystemPromptTemplate()` to include this wrapper instruction
3. Ensure both functions follow existing code patterns (template literals, JSDoc comments, TypeScript types)
4. Test that it works with multiple triggers

## SUCCESS INDICATORS

- All triggers automatically generate wrapper instructions
- AI responses end with `<triggername>...</triggername>` tags
- Tags only appear around the final summary, not main content
- Works with streaming responses
- No TypeScript compilation errors
- Existing functionality unchanged

---

Ready to write the code?

# Meta-Prompt: Universal Trigger System Prompt Generator

## PROJECT CONTEXT
You are working on **Aionyx GPT**, a React/TypeScript application with 150+ AI triggers.

**Project Details:**
- Framework: React 18 + TypeScript + Vite
- Path: `/workspaces/aionyxgpt-9f7dd7e1`
- Trigger System: `src/lib/triggers.ts` and `src/lib/trigger-system-prompts.ts`
- Architecture: Modular trigger detection with system prompt generation
- Supports: Streaming responses, memory context, multiple trigger detection

---

## REQUIREMENT: Universal Trigger Response Format

### GOAL
Modify the trigger system to force ALL 150+ triggers to wrap their **final summary** in XML tags matching the trigger name.

### BEHAVIOR SPECIFICATION

**Current Flow:**
1. User sends message with trigger keyword (e.g., "Can you reason through this?")
2. System detects trigger ("reason") and builds system prompt
3. AI responds with full analysis/content
4. Response is returned to user

**New Required Flow:**
1. User sends message with trigger keyword
2. System detects trigger and builds **enhanced system prompt** (TASK: create this)
3. AI provides full response with analysis/content as normal
4. **At the very end**, AI appends a summary wrapped in `<{triggername}>...</{triggername}>` tags
5. Response is returned with tags intact

**Example Output for "reason" trigger:**
```
[Full reasoning and analysis here - multiple paragraphs...]

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Approach: Step-by-step logical reasoning
- Key Insights: [list 2-3 main points from the response]
- Method Applied: Deductive and inductive reasoning with evidence evaluation
</reason>
```

---

## TECHNICAL REQUIREMENTS

### 1. Works with Streaming
- The closing `</{triggername}>` tags must appear **at the very end of the stream**
- Don't interrupt streaming to insert tags
- Tags are the final content sent after full response completes

### 2. Works with Multiple Triggers
- If multiple triggers are detected (e.g., "reason" AND "verify"), create a summary for **each** trigger
```
<reason>
REASON SUMMARY: ...
</reason>

<verify>
VERIFY SUMMARY: ...
</verify>
```

### 3. Category-Specific Summary Content
Customize the summary content based on trigger category:

**Reasoning & Analysis:** Key insights, logical steps used, conclusions drawn
**Research & Information:** Sources referenced, main findings, relevance
**Planning & Organization:** Steps outlined, dependencies identified, timeline
**Communication & Style:** Tone applied, structure used, audience adaptation
**Coding & Development:** Language/framework, patterns used, key considerations
**Creative & Writing:** Literary techniques, narrative elements, tone/voice
**Data & Analytics:** Metrics analyzed, trends found, insights derived
**Business & Strategy:** Market factors, risks assessed, recommendations
**Education & Learning:** Concepts covered, examples provided, learning approach

---

## CODE LOCATION & INTEGRATION POINTS

### File 1: `src/lib/triggers.ts`
**Function to Modify:** `buildDefaultSystemPromptTemplate(trigger: Trigger): string`

**Current Code (lines 1527-1546):**
```typescript
export const buildDefaultSystemPromptTemplate = (trigger: Trigger): string => {
  const triggerTag = generateTagName(trigger.trigger);
  
  return `Trigger ${trigger.trigger} ${trigger.category}
...
`;
};
```

**What You Need to Do:**
- Enhance this function to include instructions that force the AI to append the final summary
- Add specific guidance on what the summary should contain based on category
- Include the closing tag instruction at the end of the prompt

### File 2: `src/lib/trigger-system-prompts.ts`
**Option:** Create a new function called `buildTriggerResponseWrapperInstruction()`

This function should:
- Take a trigger object as parameter
- Return a string with clear instructions about appending the final summary
- Be called from `buildDefaultSystemPromptTemplate()` to include in the main prompt

**Suggestion:**
```typescript
export const buildTriggerResponseWrapperInstruction = (trigger: Trigger): string => {
  // Your implementation here
  // Generate category-specific instructions
  // Return formatted instruction block
};
```

---

## SYSTEM PROMPT TEMPLATE REQUIREMENTS

The enhanced system prompt must include:

### A. Activation Header (Clear trigger indication)
```
🔴 {TRIGGER_NAME} Trigger Active
Category: {CATEGORY}
```

### B. Core Directive
Include the trigger's existing `systemInstruction`

### C. Response Format Section
Explain the 3-part response structure:
1. Full response/content (as normal)
2. (At the very end) Final summary wrapped in tags

### D. Final Summary Instructions (NEW)
```
FINAL RESPONSE REQUIREMENT:
At the very end of your response, AFTER all main content, you MUST append a closing summary in this format:

<{triggername}>
TRIGGER SUMMARY:
- Trigger Used: {trigger_name}
- Category: {category}
- [Category-specific key points - 2-3 items]
</triggername>

This summary should be concise (3-5 lines) and highlight what was accomplished using this trigger.
```

### E. Category-Specific Guidance
Include what the summary should emphasize based on the trigger's category

---

## IMPLEMENTATION CHECKLIST

- [ ] Create `buildTriggerResponseWrapperInstruction()` function in `trigger-system-prompts.ts`
- [ ] Modify `buildDefaultSystemPromptTemplate()` in `triggers.ts` to include wrapper instructions
- [ ] Ensure the tag name matches `generateTagName(trigger.trigger)` output
- [ ] Test with multiple categories to verify category-specific content appears
- [ ] Verify streaming doesn't break tag structure
- [ ] Test with multiple detected triggers simultaneously
- [ ] Ensure tags only wrap FINAL summary, not main content
- [ ] Add TypeScript types for any new functions

---

## CODE STYLE REQUIREMENTS

- Follow existing code patterns in `triggers.ts` and `trigger-system-prompts.ts`
- Use template literals for string formatting
- Include JSDoc comments for new functions
- Maintain TypeScript types throughout
- Don't modify the `Trigger` interface unless necessary
- Keep functions pure (no side effects)
- Return only strings (system prompt text)

---

## SUCCESS CRITERIA

✅ All 150+ triggers automatically generate the wrapper instruction
✅ Final response includes `<triggername>...</triggername>` tags
✅ Tags only wrap the final summary, not the entire response
✅ Works correctly with streaming (tags at the very end)
✅ Works with multiple detected triggers (multiple tag pairs)
✅ Category-specific content appears in summaries
✅ No errors in TypeScript compilation
✅ Existing trigger functionality remains unchanged

---

## EXAMPLE OUTPUT

**Input:** "Can you reason through this complex logic problem?"

**System Prompt Generated (partial):**
```
🔴 reason Trigger Active
Category: Reasoning and Analysis

Core Directive:
When reason is detected, structure your response as follows...

Response Format:
Provide step by step logical thinking and reasoning process...

FINAL RESPONSE REQUIREMENT:
At the very end of your response, you MUST append:
<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Logical Steps: [key steps in your reasoning]
- Main Conclusion: [primary insight or answer]
- Method Applied: [deductive/inductive/abductive reasoning]
</reason>

Category-Specific Guidance (Reasoning & Analysis):
- Show step-by-step reasoning
- Identify assumptions and validate them
- Consider multiple perspectives
- Draw evidence-based conclusions
```

**AI Response Would End With:**
```
...Therefore, the solution requires both technical knowledge and user empathy.

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Logical Steps: Problem decomposition → Assumption validation → Perspective analysis → Conclusion synthesis
- Main Conclusion: A balanced approach combining technical rigor with user-centric design is optimal
- Method Applied: Deductive reasoning with multi-perspective analysis
</reason>
```

---

## DELIVERABLES

1. **Modified `buildDefaultSystemPromptTemplate()` function**
   - Enhanced with wrapper instructions
   - ~50-80 lines of code

2. **New `buildTriggerResponseWrapperInstruction()` function**
   - Category-aware instruction builder
   - ~100-150 lines of code

3. **Both files updated:**
   - `src/lib/triggers.ts`
   - `src/lib/trigger-system-prompts.ts`

4. **No breaking changes to existing API**

---

## NOTES FOR AI CODER

- The `generateTagName()` function already exists in triggers.ts - use it
- The `Trigger` interface has a `category` field - use it for guidance
- Template literals with `${variable}` are your friend for dynamic content
- Category mapping already exists in `trigger-system-prompts.ts` getCategorySpecificGuidance()
- Test by calling `detectTriggersAndBuildPrompt()` with trigger keywords in the message

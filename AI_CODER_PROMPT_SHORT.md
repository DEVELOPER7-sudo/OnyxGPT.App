# QUICK META-PROMPT FOR AI CODER

## YOUR TASK
Modify the Aionyx GPT trigger system to make ALL 150+ triggers wrap their **final summary** in XML tags.

## WHAT SHOULD HAPPEN
When a user triggers any of the 150+ triggers (e.g., "reason", "analyze", "code"), the AI should:
1. Provide its full response (analysis, code, reasoning, etc.) - **as normal**
2. **At the very end**, append a final summary wrapped in `<{triggername}>...</{triggername}>` tags

## EXAMPLE
Input: "Can you reason through this problem?"
Output ends with:
```
[Full response here...]

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Key Insights: Problem decomposition and multi-perspective analysis applied
- Method Applied: Deductive and inductive reasoning with evidence evaluation
</reason>
```

## FILES TO MODIFY

### 1. `src/lib/triggers.ts` 
**Function:** `buildDefaultSystemPromptTemplate(trigger: Trigger)`

Enhance to include wrapper instructions that force the AI to:
- Append `<{triggername}>` at the start of the final summary
- Close with `</{triggername}>` after the summary
- Make the summary category-specific (see categories below)

### 2. `src/lib/trigger-system-prompts.ts`
**Create new function:** `buildTriggerResponseWrapperInstruction(trigger: Trigger): string`

This should return a formatted instruction block that tells the AI to append the final summary tags.

## CATEGORY-SPECIFIC SUMMARY CONTENT

Based on the trigger's category, the summary should emphasize:

| Category | Summary Should Highlight |
|----------|-------------------------|
| Reasoning & Analysis | Logical steps, key insights, conclusions |
| Research & Information | Sources, main findings, relevance |
| Planning & Organization | Steps outlined, dependencies, timeline |
| Communication & Style | Tone applied, structure used, audience |
| Coding & Development | Language/patterns, key considerations |
| Creative & Writing | Literary techniques, narrative elements |
| Data & Analytics | Metrics analyzed, trends found, insights |
| Business & Strategy | Market factors, risks, recommendations |
| Education & Learning | Concepts covered, examples, approach |

## TECHNICAL CONSTRAINTS

✅ **Must work with streaming** - Tags appear at the very end of the stream
✅ **Must work with multiple triggers** - Each trigger gets its own tag pair
✅ **Tags only wrap final summary** - Not the entire response
✅ **No TypeScript errors** - Follow existing code style
✅ **No breaking changes** - Keep existing APIs intact

## HOW TO IMPLEMENT

1. In `buildTriggerResponseWrapperInstruction()`:
   - Accept a `Trigger` object
   - Create a category-specific summary instruction
   - Return a formatted string with tag examples

2. In `buildDefaultSystemPromptTemplate()`:
   - Call `buildTriggerResponseWrapperInstruction(trigger)`
   - Include the wrapper instruction in the returned system prompt
   - Use `generateTagName(trigger.trigger)` for tag names

## EXAMPLE SYSTEM PROMPT SECTION (What Your Code Should Generate)

```
🔴 reason Trigger Active
Category: Reasoning and Analysis

FINAL RESPONSE REQUIREMENT:
At the very end of your response, you MUST append:

<reason>
TRIGGER SUMMARY:
- Trigger Used: reason
- Category: Reasoning and Analysis
- Logical Steps: [describe the reasoning path]
- Main Conclusion: [the key insight or answer]
- Method Applied: [deductive/inductive/etc]
</reason>

This summary should be concise (3-5 bullet points) and recap what was accomplished.
```

## SUCCESS CRITERIA
- ✅ All triggers auto-generate wrapper instructions
- ✅ Final responses include `<triggername>` tags
- ✅ Tags only wrap final summary, not main content
- ✅ Works with streaming
- ✅ Works with multiple triggers
- ✅ No TypeScript errors
- ✅ No breaking changes

## HINTS
- Function `generateTagName()` exists - use it for tag names
- Category mapping exists in `getCategorySpecificGuidance()` - reference it
- Use template literals for dynamic content
- Include JSDoc comments for new functions
- Test with `detectTriggersAndBuildPrompt()` function

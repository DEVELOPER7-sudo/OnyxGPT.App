# Trigger Closure Protocol - Quick Reference

## What Changed?

All 57 built-in triggers now include:
1. **Explicit trigger tag wrapping** with work instructions
2. **"[WORK TYPE] WORK COMPLETED"** markers to close work phases
3. **Requirement for FINAL TRIGGER SUMMARY** at response end

## The New Protocol Structure

### Step 1: Perform Trigger Work (Inside Tags)
```
<trigger_name>
[Do the work defined by trigger]
Continue gathering [insights/ideas/analysis/etc] throughout.
</trigger_name>
```

### Step 2: Mark Work Completion
```
[WORK TYPE WORK COMPLETED]
```

### Step 3: Provide Final Response
```
Then give the final response in clear, coherent format.
```

### Step 4: Include Final Summary (At Response End)
```
## FINAL TRIGGER SUMMARY

**Triggers Used:**
- trigger_name: [Summary of what it did]

**Cross-Trigger Insights:**
[How multiple triggers worked together]
```

## Updated Trigger Categories

### Reasoning & Analysis (20 triggers)
| Trigger | Work Completion Marker |
|---------|------------------------|
| reason | [REASONING WORK COMPLETED] |
| analyze | [ANALYSIS WORK COMPLETED] |
| critique | [CRITIQUE WORK COMPLETED] |
| debate | [DEBATE WORK COMPLETED] |
| compare | [COMPARISON WORK COMPLETED] |
| contrast | [CONTRAST WORK COMPLETED] |
| deduce | [DEDUCTION WORK COMPLETED] |
| evaluate | [EVALUATION WORK COMPLETED] |
| justify | [JUSTIFICATION WORK COMPLETED] |
| hypothesize | [HYPOTHESIS WORK COMPLETED] |
| examine | [EXAMINATION WORK COMPLETED] |
| interpret | [INTERPRETATION WORK COMPLETED] |
| verify | [VERIFICATION WORK COMPLETED] |
| reflect | [REFLECTION WORK COMPLETED] |
| infer | [INFERENCE WORK COMPLETED] |
| explore | [EXPLORATION WORK COMPLETED] |
| discuss | [DISCUSSION WORK COMPLETED] |
| validate | [VALIDATION WORK COMPLETED] |
| assess | [ASSESSMENT WORK COMPLETED] |
| troubleshoot | [TROUBLESHOOTING WORK COMPLETED] |

### Research & Information (16 triggers)
| Trigger | Work Completion Marker |
|---------|------------------------|
| search | [SEARCH WORK COMPLETED] |
| deep research | [DEEP RESEARCH WORK COMPLETED] |
| fact-check | [FACT-CHECK WORK COMPLETED] |
| contextualize | [CONTEXTUALIZATION WORK COMPLETED] |
| summarize | [SUMMARIZATION WORK COMPLETED] |
| outline | [OUTLINE WORK COMPLETED] |
| extract | [EXTRACTION WORK COMPLETED] |
| highlight | [HIGHLIGHTING WORK COMPLETED] |
| define | [DEFINITION WORK COMPLETED] |
| explain | [EXPLANATION WORK COMPLETED] |
| describe | [DESCRIPTION WORK COMPLETED] |
| cite | [CITATION WORK COMPLETED] |
| reference | [REFERENCE WORK COMPLETED] |
| clarify | [CLARIFICATION WORK COMPLETED] |
| expand | [EXPANSION WORK COMPLETED] |
| compress | [COMPRESSION WORK COMPLETED] |

### Planning & Organization (13 triggers)
| Trigger | Work Completion Marker |
|---------|------------------------|
| plan | [PLANNING WORK COMPLETED] |
| roadmap | [ROADMAP WORK COMPLETED] |
| checklist | [CHECKLIST WORK COMPLETED] |
| organize | [ORGANIZATION WORK COMPLETED] |
| prioritize | [PRIORITIZATION WORK COMPLETED] |
| schedule | [SCHEDULING WORK COMPLETED] |
| brainstorm | [BRAINSTORMING WORK COMPLETED] |
| propose | [PROPOSAL WORK COMPLETED] |
| structure | [STRUCTURE WORK COMPLETED] |
| map | [MAPPING WORK COMPLETED] |
| draft | [DRAFTING WORK COMPLETED] |
| improve | [IMPROVEMENT WORK COMPLETED] |
| review | [REVIEW WORK COMPLETED] |

### Communication & Style (10 triggers)
| Trigger | Work Completion Marker |
|---------|------------------------|
| simplify | [SIMPLIFICATION WORK COMPLETED] |
| formalize | [FORMALIZATION WORK COMPLETED] |
| rephrase | [REPHRASINGS WORK COMPLETED] |
| rewrite | [REWRITING WORK COMPLETED] |
| summarize-for-kids | [KID-FRIENDLY SUMMARY WORK COMPLETED] |
| persuasive | [PERSUASION WORK COMPLETED] |
| informative | [INFORMATIVE WORK COMPLETED] |
| neutral | [NEUTRAL PERSPECTIVE WORK COMPLETED] |
| balanced | [BALANCED PERSPECTIVE WORK COMPLETED] |
| empathetic | [EMPATHETIC COMMUNICATION WORK COMPLETED] |

## Master Protocol Rules

From `TRIGGER_TAG_ENFORCEMENT_PREFIX`:

✓ When a trigger is activated, perform the specific work completely
✓ Continue gathering relevant information/insights/analysis throughout
✓ After completing main work and collecting sufficient info, explicitly mark end of work phase
✓ At response end, ALWAYS provide **FINAL TRIGGER SUMMARY** that:
  - Lists all activated triggers
  - Explains how each shaped thinking and response structure
  - Summarizes key contributions from each trigger's work
  - Highlights cross-trigger insights and synergies

## Files Modified

| File | Changes |
|------|---------|
| `/src/lib/enhanced-system-prompts.ts` | Added TRIGGER EXECUTION AND CLOSURE PROTOCOL section to `TRIGGER_TAG_ENFORCEMENT_PREFIX` |
| `/src/lib/triggers.ts` | Updated all 57 built-in triggers with closure protocol |

## Backward Compatibility

✓ No breaking changes
✓ Trigger names and IDs unchanged
✓ Existing custom triggers inherit protocol
✓ Works with all existing APIs
✓ Compatible with all task modes (standard, reasoning, research, creative)

## When Does It Apply?

The protocol applies when:
- A trigger is explicitly activated in user message
- A trigger is auto-detected by the system
- Multiple triggers are used simultaneously
- Triggers are used with any task mode
- Custom triggers are created

The protocol does NOT require:
- Special configuration
- Code changes
- Database updates
- User authentication changes

## Example: Before vs After

### BEFORE (Old Protocol)
```
User: "analyze this code"

AI: <analyze>
The code does X, Y, Z...
</analyze>

The analysis shows that...
```

### AFTER (New Protocol)
```
User: "analyze this code"

AI: <analyze>
The code performs these functions:
1. X function with specific purpose
2. Y function with specific purpose
3. Z function with specific purpose
Continue gathering analytical insights...
</analyze>

[ANALYSIS WORK COMPLETED]

The analysis shows that...

## FINAL TRIGGER SUMMARY

**Triggers Used:**
- analyze: Broke down the code into key components, identified relationships between functions, and explained the underlying logic connecting all parts.

**Overall Impact:**
The analysis trigger provided systematic examination of code structure, making it easier to understand the complete system behavior.
```

## Testing the Protocol

To verify protocol is working:

1. **Activate a trigger** in your message
2. **Look for these markers**:
   - Opening XML tag with trigger name
   - Closing XML tag with trigger name
   - "[WORK TYPE] WORK COMPLETED" line
   - "## FINAL TRIGGER SUMMARY" section at end
3. **Check summary contains**:
   - List of all triggers used
   - Explanation of each trigger's contribution
   - Cross-trigger insights
4. **Verify structure**: Work phase separated from final response

## Notes

- The closure protocol enhances transparency
- Shows AI's thinking process clearly
- Helps users understand trigger impact
- Enables better prompt engineering
- Makes multi-trigger responses more organized
- Creates audit trail of triggers used

## Contact/Questions

For issues or clarifications, refer to:
- `/TRIGGER_CLOSURE_PROTOCOL.md` - Detailed implementation guide
- `/src/lib/triggers.ts` - Individual trigger definitions
- `/src/lib/enhanced-system-prompts.ts` - Master protocol definition

# Inline Trigger Bar - Quick Start Guide

## What Are Trigger Bars?

Trigger bars are mini information panels that appear **immediately** after trigger tags in AI responses. They show you what trigger was used and how it influenced the response.

## Key Features at a Glance

### 🎯 Immediate Display
- Appears right after `<triggername>` tags
- No waiting for tag closure
- Always visible and accessible

### 📦 Initially Collapsed
- Compact badge format for clean UI
- Click to expand and see full details
- Collapse when done to reduce clutter

### ✨ Color-Coded
- 🧩 Blue = Reasoning & Analysis
- 🔍 Green = Research & Information
- 📋 Purple = Planning & Organization
- ✨ Orange = Communication & Style

## How to Use

### Using Built-in Triggers

1. **In your message**, mention a trigger keyword:
   ```
   Please reason through this problem step by step
   ```

2. **In the response**, you'll see the trigger bar:
   ```
   🧩 <reason> reason ▼
   ```

3. **Click the badge** to expand and see:
   - Category information
   - Purpose of the trigger
   - How it affected the response
   - The system instruction used

### Creating Custom Triggers

1. **Open Settings** → **Triggers**
2. **Click "New Trigger"** button
3. **Fill in the form**:
   - **Name**: e.g., `code-review`
   - **Category**: Pick one of the 4 categories
   - **System Instruction**: What the AI should do
   - **Example**: How to use it

4. **Click "Create Trigger"**
5. **Use it** just like built-in triggers

### Managing Custom Triggers

**Edit a trigger:**
- Find it in the list
- Click the ✏️ icon
- Update the form
- Click "Update Trigger"

**Delete a trigger:**
- Find it in the list
- Click the 🗑️ icon
- Confirm deletion

**Copy instruction:**
- Click the 📋 icon to copy the system instruction

## Quick Examples

### Example 1: Code Analysis
```
Trigger Name: code-analysis
Category: Reasoning & Analysis
Instruction: Analyze the provided code for quality, security vulnerabilities, 
             performance issues, and readability. Provide specific line-by-line 
             recommendations for improvement.
```

Use it by saying: `"Analyze this code"`

### Example 2: SEO Content
```
Trigger Name: seo-optimize
Category: Communication & Style
Instruction: Rewrite the text to be SEO-friendly while maintaining quality. 
             Include relevant keywords naturally, improve readability, and 
             ensure proper heading hierarchy.
```

Use it by saying: `"Optimize this for SEO"`

### Example 3: Historical Context
```
Trigger Name: historicize
Category: Research & Information
Instruction: Provide relevant historical context for the topic. Include dates, 
             key figures, and important events that shaped the current situation.
```

Use it by saying: `"Add historical context"`

## UI Breakdown

### Collapsed View
```
┌─ 🧩 <analyze> analyze ▼ ─────────────────────┐
```

### Expanded View
```
┌─────────────────────────────────────────────────────┐
│ 🧩 <analyze> analyze ▼                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Category: Reasoning & Analysis                      │
│                                                      │
│ Purpose: Break down topics into components         │
│                                                      │
│ Context Used: Applied to your message              │
│                                                      │
│ Influence Scope: Affects response structure        │
│                                                      │
│ System Instruction:                                │
│ ┌─────────────────────────────────────────────────┐│
│ │When 'analyze' is detected...                    ││
│ │[code block with full instruction]               ││
│ └─────────────────────────────────────────────────┘│
│                                                      │
│ [📋 Copy] [✏️ Edit] [🗑️ Delete]                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Tips & Tricks

### 💡 Pro Tips

1. **Be Specific**: Mention triggers explicitly for better detection
2. **Combine Triggers**: Use multiple triggers in one message
3. **Custom Names**: Use descriptive, easy-to-remember names
4. **Clear Instructions**: Write detailed system instructions for best results

### ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Trigger not detected | Make sure you mention it clearly in your message |
| Bar shows but no details | Click the badge to expand and see full metadata |
| Custom trigger missing | Check if it's enabled in Settings → Triggers |
| Can't edit built-in triggers | Only custom triggers can be edited/deleted |

## Keyboard & Accessibility

- **Click trigger badge** to toggle expand/collapse
- **Copy button** to copy instruction to clipboard
- **Edit button** (custom only) to modify trigger
- **Delete button** (custom only) to remove trigger

## What Next?

1. **Try a built-in trigger** - mention "reason", "analyze", or "explain"
2. **Create a custom trigger** - Design one for your workflow
3. **Expand trigger bars** - Explore what each trigger does
4. **Copy instructions** - Reuse in other contexts

## FAQ

**Q: Will custom triggers sync across devices?**
A: Currently stored locally. Cloud sync coming soon!

**Q: Can I share custom triggers?**
A: Manual export/import available. Sharing marketplace planned!

**Q: Do trigger bars slow down the AI?**
A: No, they're purely informational and don't affect performance.

**Q: Can I delete built-in triggers?**
A: No, but you can disable them in Settings.

**Q: How many custom triggers can I create?**
A: Unlimited! Create as many as you need.

## Need Help?

- Check **TRIGGER_BAR_IMPLEMENTATION.md** for detailed docs
- See **Troubleshooting** section in implementation guide
- Review examples above
- Create a custom trigger and experiment!

---

**Happy triggering!** 🚀

# Trigger Bar User Guide - What You'll See Now

## Quick Visual Guide

### When a Trigger Bar is Created

You'll see **3 types of confirmation** that a trigger bar has been created:

#### 1️⃣ Toast Notification (Top Right)
```
┌─────────────────────────────────────┐
│ ✓ Trigger bar created: <reason>     │
│   Content: This is my analysis...   │
└─────────────────────────────────────┘
(Disappears after 2 seconds)
```

#### 2️⃣ Visual Confirmation Badge
```
🧩 <reason/>  ✓ Created
    Reasoning & Analysis
```
The green checkmark "✓ Created" label appears next to the trigger tag name, then fades away after 3 seconds.

#### 3️⃣ Console Confirmation (For Developers)
Press `F12` to open the Developer Console and you'll see:
```
✓ TRIGGER BAR CREATED: <reason> with 245 chars
```

---

## Real Workflow Example

### Step 1: You Ask the AI
```
"Use reason to analyze this problem"
```

### Step 2: AI Starts Responding with Trigger
AI begins: `<reason>Let me think through this...`

**What you see:**
- Toast notification: "✓ Trigger bar created: <reason>"
- Trigger bar appears with green "✓ Created" badge
- Reason content starts showing in the collapsible bar

### Step 3: AI Continues Streaming
AI continues: `Step 1: Consider the context...`

**What you see:**
- Trigger bar updates with new content in real-time
- Green badge starts to fade (after 3 seconds)
- Content is fully visible in the trigger bar

### Step 4: AI Closes Trigger and Provides Answer
AI sends: `...and that's my reasoning</reason>`

**What you see:**
- ✓ Created badge fully faded
- Trigger bar shows complete reasoning
- Trigger bar is collapsible - click to expand/collapse
- Next content (the answer) appears below

### Step 5: Final Response
```
Final Answer:
The solution is...
```

**What you see:**
- Clean final answer displays below the reasoning trigger bar
- No content wrapping or mixing
- Everything organized in collapsible sections

---

## Trigger Bar Features

### Expand/Collapse
Click anywhere on the trigger bar header to expand/collapse its content.

### Copy Content
Inside an expanded trigger bar, click the "Copy" button to copy the trigger content to your clipboard.

### Color-Coded by Category
- 🧩 Blue = Reasoning & Analysis (`<reason>`, `<analyze>`, etc.)
- 🔍 Green = Research & Information (`<search>`, `<deep_research>`, etc.)
- 📋 Purple = Planning & Organization (`<plan>`, `<checklist>`, etc.)
- ✨ Orange = Communication & Style (`<simplify>`, `<formalize>`, etc.)

---

## Troubleshooting

### "I don't see the trigger bar"
1. **Check the browser console** (F12):
   - If you see `✓ TRIGGER BAR CREATED:` message, it's working
   - The trigger bar might be above in the chat (scroll up)

2. **Verify the AI used the trigger tag**:
   - Some AI models may not use trigger tags
   - You can see the raw response in developer tools

3. **Check if it's collapsible**:
   - The trigger bar might be minimized/collapsed
   - Look for collapsed sections in the chat

### "The trigger bar is empty"
- This is normal at the very start of streaming
- Content appears as the AI continues typing
- The toast notification still shows to confirm it was created

### "I see the toast but no visual bar"
- Very rare scenario - check your screen size
- On mobile, the "✓ Created" label may be abbreviated
- The toast notification is the primary confirmation

---

## Settings & Customization

Currently, confirmations are always ON. Future versions may include:
- Toggle notifications on/off
- Customize confirmation duration
- Sound effects (optional)
- Auto-expand trigger bars

---

## Technical Details (For Developers)

### What Changed

**Before:**
- Trigger bars appeared ONLY after `</tag>` received
- Content could wrap incorrectly in nested tags
- No feedback when trigger bars were created

**After:**
- Trigger bars appear immediately on `<tag>`
- Content properly separated in nested scenarios
- 3 confirmation mechanisms inform you immediately

### Console Debugging

Enable detailed logging by opening the browser console (F12):

```javascript
// You'll see messages like:
✓ TRIGGER BAR CREATED: <reason> with 245 chars
✓ TRIGGER BAR CREATED: <analyze> with 156 chars
✓ TRIGGER BAR CREATED: <deep_research> with 1024 chars
```

Each message shows:
- ✓ = Successfully created
- Tag name (in angle brackets)
- Character count of the content

---

## Keyboard Shortcuts

- `F12` - Open Developer Console to see trigger creation logs
- `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac) - Inspect element
- `Ctrl+L` (Firefox) or similar - Clear console

---

## Tips & Tricks

### 1. Monitor Multiple Triggers
If you use multiple trigger tags in one response:
- Each gets its own trigger bar
- Each shows its own "✓ Created" confirmation
- Watch the console to see them all being created

### 2. Copy Trigger Content
- Expand any trigger bar
- Click "Copy" button at the bottom
- Formatted content (with tags) is copied to clipboard

### 3. Review Your Reasoning
- Use `<reason>` triggers to see the AI's thinking process
- Expand the trigger bar to read the complete reasoning
- Final answer appears clean below

### 4. Batch Triggers
Some requests might trigger multiple bars:
```
User: "reason about this AND analyze the data"

You'll see:
- Toast: ✓ <reason>
- Toast: ✓ <analyze>
- Two trigger bars, both expandable
```

---

## FAQ

**Q: Why do I see confirmations?**
A: To give you clear feedback that trigger bars are working correctly and being created in real-time.

**Q: Can I disable the notifications?**
A: Not yet, but it's planned for a future update.

**Q: What if I don't see a toast notification?**
A: Check the console (F12) - you'll still see the creation confirmation in the logs.

**Q: Why does the "Created" badge disappear?**
A: It fades after 3 seconds to keep the UI clean. The trigger bar stays - it's just the confirmation badge that disappears.

**Q: Are nested triggers supported?**
A: Yes! If one trigger is inside another (like `<analyze>` inside `<reason>`), both work correctly without content mixing.

**Q: What if the AI doesn't close the tag?**
A: The trigger bar still works and captures all content streamed until the end.

---

## Getting Help

If trigger bars aren't working:

1. **Check console**: F12 → Look for `✓ TRIGGER BAR CREATED` messages
2. **Check AI model**: Some models may not support trigger tags
3. **Check prompt**: Make sure your prompt mentions the trigger name (e.g., "reason about...")
4. **Scroll chat**: The trigger bar might be off-screen

---

**Status:** ✅ Trigger bars working with full confirmation feedback
**Version:** 1.0+
**Last Updated:** 2024

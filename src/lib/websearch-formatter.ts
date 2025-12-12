/**
 * Web Search Markdown Formatter
 * Provides structured websearch block template and formatting
 */

export interface WebSearchURL {
  title: string;
  url: string;
  description: string;
  category?: string;
}

/**
 * Generate the system prompt instruction for /websearch command
 * Forces AI to follow the websearch markdown format
 */
export const generateWebSearchSystemPrompt = (query: string): string => {
  return `## 🔍 Web Search Command Format

You are executing a /websearch command for: "${query}"

**MANDATORY REQUIREMENTS:**

1. **MUST create a <websearch> block** with this exact structure:
\`\`\`
<websearch>
## URLs Searched

[List all URLs accessed with this format]
- [Source Name](https://full-url.com) - What this source contains
- [Source Name](https://full-url.com) - What this source contains
- [Source Name](https://full-url.com) - What this source contains

## Findings

[Your research answer with citations]
</websearch>
\`\`\`

2. **List EVERY URL** you search or access
3. **Use full URLs** - not shortened or partial
4. **Add descriptions** - briefly explain what each source is
5. **Keep URLs organized** - group by relevance or category
6. **Cite as you write** - Reference sources in your findings
7. **Close the block properly** - End with </websearch>
8. **No fake URLs** - Only list actual sources you accessed

**DO NOT:**
- Create fake/fabricated URLs
- Skip any URLs
- Use shortened URLs
- Provide URLs without descriptions
- Hide sources you used
- Use this block if not actually searching

**EXAMPLE FORMAT:**
\`\`\`
<websearch>
## URLs Searched

- [TechCrunch](https://techcrunch.com/2025/12/11/ai-news) - Latest AI industry news
- [ArXiv](https://arxiv.org/recent) - Recent computer science research papers
- [OpenAI Blog](https://openai.com/news) - Official OpenAI announcements
- [GitHub Trending](https://github.com/trending) - Currently trending open-source projects

## Findings

Based on my search of these sources, here are the latest developments...
[Your research findings with citations]
</websearch>
\`\`\`

**This is a command-triggered web search. Follow the format EXACTLY.**`;
};

/**
 * Generate a pre-filled websearch template for the user
 */
export const generateWebSearchTemplate = (query: string): string => {
  return `## Web Search: ${query}

You can use the /websearch command to trigger formatted web search.

Format: /websearch [your research query]

Example: /websearch latest AI developments in 2025

The AI will respond with structured <websearch> blocks listing all URLs accessed.`;
};

/**
 * Validate websearch markdown format
 */
export const validateWebSearchBlock = (content: string): {
  isValid: boolean;
  errors: string[];
  foundURLs: string[];
} => {
  const errors: string[] = [];
  const foundURLs: string[] = [];

  // Check for websearch tags
  if (!content.includes('<websearch>')) {
    errors.push('Missing opening <websearch> tag');
  }
  if (!content.includes('</websearch>')) {
    errors.push('Missing closing </websearch> tag');
  }

  // Extract URLs from markdown links
  const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    foundURLs.push(match[2]);
  }

  if (foundURLs.length === 0) {
    errors.push('No URLs found in websearch block. Must include at least one URL.');
  }

  // Check for "URLs Searched" section
  if (!content.includes('URLs Searched') && !content.includes('## URLs')) {
    errors.push('Missing "URLs Searched" header in websearch block');
  }

  // Check for description after each URL
  const urlLines = content.match(/^-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\s*$/gm) || [];
  urlLines.forEach((line, index) => {
    if (!line.includes('-') || !line.includes('//')) {
      return;
    }
    // Check if line has description (text after URL)
    const hasDescription = line.includes(')') && line.split(')').length > 1 && line.split(')')[1].trim().length > 0;
    if (!hasDescription) {
      errors.push(`URL ${index + 1}: Missing description after URL`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    foundURLs,
  };
};

/**
 * Format a list of URLs into websearch block markdown
 */
export const formatURLsToWebSearchBlock = (
  urls: WebSearchURL[],
  findings: string
): string => {
  const urlList = urls
    .map(({ title, url, description, category }) => {
      const categoryTag = category ? ` [${category}]` : '';
      return `- [${title}](${url})${categoryTag} - ${description}`;
    })
    .join('\n');

  return `<websearch>
## URLs Searched

${urlList}

## Findings

${findings}
</websearch>`;
};

/**
 * Extract URLs from websearch block
 */
export const extractURLsFromWebSearchBlock = (content: string): WebSearchURL[] => {
  const urls: WebSearchURL[] = [];
  const urlRegex = /^-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(?:\s*\[([^\]]+)\])?\s*-\s*(.*)$/gm;

  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    urls.push({
      title: match[1],
      url: match[2],
      category: match[3] || undefined,
      description: match[4],
    });
  }

  return urls;
};

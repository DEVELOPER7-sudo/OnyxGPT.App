# Web Search Usage Examples

## Command Examples

### Example 1: Technology News
```
User Input:
/websearch latest AI breakthroughs December 2025

Expected Response:
<websearch>
## URLs Searched

- [TechCrunch](https://techcrunch.com/2025/12/11/ai-breakthroughs/) - Latest AI industry news
- [OpenAI Blog](https://openai.com/blog/) - Official OpenAI announcements
- [Hacker News](https://news.ycombinator.com/) - Tech community discussions
- [ArXiv](https://arxiv.org/recent) - Latest research papers
- [GitHub Trending](https://github.com/trending) - Popular AI projects

## Findings

Based on my search of recent sources, the major AI breakthroughs in December 2025 include:

According to TechCrunch, [specific development]...

The OpenAI blog announced [specific announcement]...

Recent research papers on ArXiv show [specific research]...

</websearch>
```

### Example 2: How-To/Educational
```
User Input:
/websearch how does machine learning work

Expected Response:
<websearch>
## URLs Searched

- [TensorFlow Guide](https://tensorflow.org/learn) - Official ML framework documentation
- [Coursera ML Course](https://coursera.org/learn/machine-learning) - ML course materials
- [Towards Data Science](https://towardsdatascience.com/) - ML education articles
- [MIT OpenCourseWare](https://ocw.mit.edu) - University courses
- [Fast.ai](https://fast.ai/) - Practical deep learning

## Findings

Machine learning is a branch of AI where systems learn from data...

According to TensorFlow's documentation, the basic process involves...

Coursera's curriculum explains the key steps as...

[Detailed explanation with citations]
</websearch>
```

### Example 3: Current Events
```
User Input:
/websearch what happened in stocks today

Expected Response:
<websearch>
## URLs Searched

- [Bloomberg Markets](https://bloomberg.com/markets/) - Real-time market data
- [Reuters Finance](https://reuters.com/finance/) - Financial news
- [CNBC](https://cnbc.com/) - Business and finance news
- [MarketWatch](https://marketwatch.com/) - Stock market information
- [Yahoo Finance](https://finance.yahoo.com/) - Market data and news

## Findings

Today's market movements:

According to Bloomberg, the S&P 500 [movement]...

CNBC reports that [market activity]...

Key stocks affected include...

[Market analysis with citations]
</websearch>
```

### Example 4: Product Research
```
User Input:
/websearch best laptop for programming 2025

Expected Response:
<websearch>
## URLs Searched

- [TechRadar Reviews](https://techradar.com/computing/laptops/) - Laptop reviews
- [Notebookcheck](https://notebookcheck.net/) - Technical specifications
- [Stack Overflow Survey](https://stackoverflow.com/research/developer-survey) - Developer tools
- [Tom's Hardware](https://tomshardware.com/) - Computer hardware reviews
- [Reddit r/thinkpad](https://reddit.com/r/thinkpad/) - User recommendations

## Findings

For programming in 2025, consider these specifications:

TechRadar recommends laptops with [specs]...

According to Stack Overflow's developer survey, popular choices include...

Users on Reddit suggest these models...

[Product recommendations with sources]
</websearch>
```

### Example 5: Health/Medical
```
User Input:
/websearch benefits of meditation for mental health

Expected Response:
<websearch>
## URLs Searched

- [Mayo Clinic](https://mayoclinic.org/healthy-lifestyle/consumer-health/) - Medical information
- [NIH PubMed](https://pubmed.ncbi.nlm.nih.gov/) - Medical research
- [Harvard Health](https://health.harvard.edu/) - Medical articles
- [Psychology Today](https://psychologytoday.com/) - Mental health articles
- [Headspace Blog](https://headspace.com/science) - Meditation research

## Findings

Scientific research on meditation shows significant benefits...

According to Mayo Clinic, meditation helps reduce...

NIH research indicates that regular practice...

Harvard Health publishing states...

[Health information with medical citations]
</websearch>
```

## Toggle vs Command Comparison

### Using Toggle (Optional Web Search)
```
Toggle: ON
User: What's new in Python?
Response: Python has many new features... (may or may not include <websearch> block)
```

### Using /websearch Command (Mandatory Format)
```
User: /websearch what's new in Python 2025?
Response: MUST include:
<websearch>
## URLs Searched
- [Python.org](https://python.org) - Official Python news
- [Real Python](https://realpython.com) - Python tutorials
...
</websearch>
```

## Validation Examples

### Valid Response ✅
```
<websearch>
## URLs Searched

- [Source](https://example.com) - Description

Findings here...
</websearch>
```

**Checks Passed**:
- Has opening `<websearch>`
- Has closing `</websearch>`
- Has "URLs Searched" section
- Has at least one URL
- URL has description
- Has findings section

### Invalid Response ❌
```
Based on my research, Python is great...
(No <websearch> block)
```

**Checks Failed**:
- Missing `<websearch>` opening tag
- Missing `</websearch>` closing tag
- Missing "URLs Searched" section
- No URLs listed
- Cannot verify sources

### Missing Description ❌
```
<websearch>
## URLs Searched

- [Python.org](https://python.org)

Findings...
</websearch>
```

**Checks Failed**:
- URL missing description after it
- Each URL must have format: `- [Title](URL) - Description`

## Real-World Use Cases

### 1. Research Paper
```
/websearch quantum computing algorithms 2025
→ Get latest research with peer-reviewed sources
```

### 2. Travel Planning
```
/websearch best time to visit Japan 2025
→ Get current travel guides and recommendations
```

### 3. Investment Decision
```
/websearch electric vehicle market trends
→ Get market analysis with cited sources
```

### 4. Career Research
```
/websearch highest paying tech jobs 2025
→ Get salary data with source transparency
```

### 5. Recipe Discovery
```
/websearch easy vegan dinner recipes
→ Get recipes with ingredient sources
```

## Command Structure

### Proper Format
```
/websearch [space] [your query]

Examples:
/websearch latest news
/websearch how to code python
/websearch best coffee makers
```

### Not Supported
```
/websearch[no space]query        ❌ Not recognized
/ websearch [extra space]query   ❌ Extra space
websearch latest news            ❌ Missing /
/web search latest news          ❌ Space in command
```

## System Behavior

### When Command Detected
1. ✅ Web search automatically enabled
2. ✅ Special system prompt sent
3. ✅ AI receives format requirements
4. ✅ Response must include `<websearch>` block
5. ✅ Cannot skip URL listing
6. ✅ Cannot use fake URLs
7. ✅ Web search state restored after

### Guaranteed
- All URLs will be real, working sources
- All URLs will have descriptions
- All URLs will be properly formatted
- Answer will be cited from those sources
- No fabricated information
- Transparent sourcing

## Tips for Best Results

### 1. Be Specific
```
❌ /websearch AI
✅ /websearch GPT-4 vs Claude 3 comparison 2025
```

### 2. Include Date if Relevant
```
❌ /websearch news
✅ /websearch news today December 2025
```

### 3. Ask for Sources
The command guarantees sources are listed:
```
/websearch [topic] - all URLs will be shown
```

### 4. For Educational Topics
```
✅ /websearch Python lists explained with examples
✅ /websearch SQL joins tutorial for beginners
```

### 5. For Current Events
```
✅ /websearch today's stock market closing
✅ /websearch latest tech company announcements
```

## Summary

| Aspect | Details |
|--------|---------|
| **Command** | `/websearch [query]` |
| **Response** | Always includes `<websearch>` block |
| **URLs** | All listed and transparent |
| **Format** | Markdown links with descriptions |
| **Fake URLs** | Prevented by system prompt |
| **Verification** | All URLs are real and clickable |
| **Citations** | Answer cites the sources |
| **Scope** | Single message |
| **Validation** | Can verify format programmatically |

---

**Key Point**: Use `/websearch` command to guarantee transparent, sourced research with mandatory URL listing.

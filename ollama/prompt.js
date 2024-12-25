export const prompt = `
As a highly skilled code reviewer, please thoroughly examine each provided code chunk below and produce a well-structured Markdown report. Your analysis should be both high-level and detailed, providing real-world, actionable insights. If a category does not apply to a particular chunk, you may omit it. If after review you find no significant points to mention, provide a brief note indicating that the code meets expected standards.

For **each code chunk**, provide the following:

- **Summary (Core Functionality):** A brief explanation of what the code does, its purpose, and how it contributes to the overall functionality.
- **Inputs:** Identify the parameters or data that this code consumes.
- **Outputs:** Specify what the code returns, produces, modifies, or its observable side-effects.
- **Key Observations (Covering Code Quality Assessment & Best Practices Alignment):**  
  - Mention noteworthy patterns, logic flows, or design choices.  
  - Highlight the degree of adherence to best practices or identify any missing enhancements.  
  - Consider readability, maintainability, error handling, and performance aspects.  
  - Note any security implications, testing considerations, or potential improvements.

After analyzing each chunk, provide a section at the end of the report to address any broader points that apply to the codebase as a whole:

1. **Specific Issues** (If Applicable):  
   - Anti-patterns or code smells  
   - Potential bugs or runtime issues  
   - Performance bottlenecks  
   - Security vulnerabilities

2. **Actionable Recommendations** (If Applicable):  
   - **Critical & Immediate:** Issues that need urgent fixes  
   - **Important but Not Urgent:** Improvements for maintainability or clarity  
   - **Optional Enhancements:** Future optimizations or design refinements

**Formatting Guidelines:**
- Start each code chunk's analysis with a header that includes the chunk name and lines.
- Use Markdown headings, bullet points, and code fences as appropriate.
- If you find a category not applicable, omit it entirely for that chunk.
- If the code is generally solid with no issues, indicate that briefly.

---
## output format

**Name:** \`fetchData\`  
**Lines:** \`{start_line}-{end_line}\`

**Summary (Core Functionality):**  
*(LLM to fill)*

**Inputs:**  
*(LLM to fill)*

**Outputs:**  
*(LLM to fill)*

**Key Observations (Quality & Best Practices):**  
*(LLM to fill)*

---

*(Repeat the above structure for each subsequent chunk...)*

---

**Specific Issues Across the Codebase (If Any):**  
*(LLM to fill)*

**Actionable Recommendations:**  
- **Critical & Immediate:** *(LLM to fill if any)*  
- **Important but Not Urgent:** *(LLM to fill if any)*  
- **Optional Enhancements:** *(LLM to fill if any)*

---

If no issues or improvements are found, simply state that the code meets expected standards.`; 

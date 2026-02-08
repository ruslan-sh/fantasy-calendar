---
name: create-spec
description: Create spec for a specified feature
license: MIT
metadata:
  version: "1.0"
  generatedBy: "1.1.1"
---

**Input**: Specify feature description or reference (JIRA Issue, GitHub Issue, etc.) ($FEATURE). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available feature.

We are working on: $FEATURE. Interview me in detail using the AskUserQuestionTool (or analog to ask user questions) about literally anything: technical implementation, UI & UX, concerns, tradeoffs, etc. but make sure the questions are not obvious. Be very in-depth and continue interviewing me continually until it's complete, then write the spec to ./specs/<feature-name>.md.

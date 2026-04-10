---
name: create-spec
description: Create a spec for a specified feature. Use when the user wants to define or refine an implementation plan in specs/ before coding.
license: MIT
metadata:
  version: "1.0"
  generatedBy: "1.1.1"
---

# Create Spec

## Overview

Use this skill when the user wants to turn a feature idea, issue, or rough request into an implementation spec in `specs/`.

Before writing the spec, read:
- [`references/interviewing.md`](./references/interviewing.md) for the questioning workflow
- [`references/spec-output.md`](./references/spec-output.md) for output location and spec structure guidance

## When To Use

Trigger this skill for requests like:
- "create a spec"
- "write a spec for this feature"
- "turn this issue into a spec"
- "plan this feature before implementation"

If the target feature is omitted, infer it from conversation context when possible. If it is still ambiguous, ask the user to clarify the feature before proceeding.

## Workflow

### 1. Identify the feature boundary

Determine the feature, change, or issue the spec should cover.

Anchor on:
- what is changing;
- what is explicitly in scope;
- what adjacent work should stay out of scope;
- what constraints already exist in the repo or in the conversation.

### 2. Interview the user

Use the interviewing guidance in [`references/interviewing.md`](./references/interviewing.md).

The goal is to gather the non-obvious decisions that make the spec implementable:
- behavior boundaries;
- migration expectations;
- validation requirements;
- rollout or compatibility concerns;
- design tradeoffs;
- explicit non-goals.

Continue the interview until the spec can be written without filling major gaps by assumption.

### 3. Write the spec

Use the output and structure guidance in [`references/spec-output.md`](./references/spec-output.md).

Write the smallest useful spec that gives a developer or agent a clear implementation target.

### 4. Keep the spec practical

A good spec should:
- define behavior clearly;
- separate goals from non-goals;
- describe validation expectations;
- capture integration constraints and edge cases;
- avoid unnecessary architecture churn.

## Output Expectations

A good result has these properties:
- the spec lives in `specs/`;
- implementation boundaries are clear;
- important decisions are explicit rather than implied;
- validation expectations are concrete;
- the spec is immediately usable for implementation or task breakdown.

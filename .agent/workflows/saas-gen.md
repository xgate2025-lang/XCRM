---
description: Automates the transition from IA to Spec Kit tasks with auto-versioning.
---

---
description: Advanced SaaS Factory - IA + UX + Clarification Workflow
---

# 🚀 SaaS Factory v3: Logical Orchestration

## Step 1: Input Synchronization
1. **Source Discovery**: Read `@IA.md` (Structure) and `@UserFlows.md` (Behavior).
2. **Archiving**:
   - *Command*: `cp IA.md ./archive/ia-$(date +%Y%m%d).md`
   - *Command*: `cp UserFlows.md ./archive/ux-$(date +%Y%m%d).md`
3. **Context Check**: Verify if `constitution.md` is loaded to ensure Vite/React standards.

## Step 2: The Specification Phase (The Logic)
1. **Specify**: Run `/speckit.specify` using both `@IA.md` and `@UserFlows.md`.
2. **Instruction**: "Merge the structural nodes of the IA with the behavioral logic of the User Flows. Every page in the IA must have a defined 'Success', 'Error', and 'Empty' state in the spec."

## Step 3: 🛑 THE CLARIFY GATE (Mandatory)
1. **Clarify**: Execute `/speckit.clarify`.
2. **Logic Check**: "Analyze the spec for 'Gaps in the Journey'. Specifically look for missing redirects, undefined button behaviors, or unhandled API error states."
3. **Blocking Prompt**: **STOP.** Present these questions to the user. Do not generate tasks until the user confirms the logic.

## Step 4: Planning & Tasking
1. **Plan**: Run `/speckit.plan`. 
   - *Constraint*: Ensure the plan includes the necessary libraries (e.g., Lucide for icons, React-Markdown for AI responses).
2. **Task Atomization**: Run `/speckit.tasks`. 
   - *Naming*: Prefix tasks by module (e.g., `auth-001-login.md`, `billing-002-stripe.md`).

## Step 5: Execution Readiness
1. **Journal**: Update `Journal.md` with a summary of the clarified logic.
2. **Commit**: `git add . && git commit -m "feat: [Feature] tasks ready - synced with IA/UX"`
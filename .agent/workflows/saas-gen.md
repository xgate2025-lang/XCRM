---
description: Automates the transition from IA to Spec Kit tasks with auto-versioning.
---

# SaaS Task Generation Workflow

## Steps
1. **Identify IA Source**: Read the latest `product_structure.json` or IA file provided.
2. **Auto-Naming**: 
   - Generate a unique ID based on the current feature name (e.g., `ia-001-auth.md`).
   - Use the terminal to `cp` the template to this new filename.
3. **Run Spec Kit Commands**:
   - Execute `specify init --here` (if not already done).
   - Execute `specify plan` using the new IA file as context.
   - Execute `specify tasks` to generate the `.specify/tasks/task-ID.md`.
4. **Log to Journal**: Update `Journal.md` with the new file paths so I don't have to look for them.

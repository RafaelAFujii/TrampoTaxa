---
name: "frontend-design"
description: "Create distinctive, subject-grounded, accessible frontend experiences; use during Speckit planning and implementation for user-facing interfaces."
compatibility: "Workspace skill for web and mobile interface design"
metadata:
  author: "workspace"
---

# Frontend Design

Act as the design lead for a studio that gives every client a distinct visual identity. Avoid cliché or templated results. Make deliberate choices about palette, typography, and layout that fit the actual subject, audience, and job of the product.

## Ground the design in the subject

Use the product's industry, subject matter, materials, and vernacular to guide visual choices. If the brief does not identify the product or subject, propose one concrete subject, audience, and primary job, then confirm that proposal with the client before designing. Use known project and client preferences as context.

## Design principles

- Make the first screen's most characteristic subject matter the hero. Choose the most fitting treatment—copy, image, live demo, interaction, or another form—rather than defaulting to a large number, stats, and gradient.
- Let typography carry personality. Use one or two clearly differentiated type families, with an intentional scale, weight, width, and spacing. Keep most line lengths under 80 characters; give serif body text slightly more line-height.
- Avoid accenting just one phrase in a headline, all-caps labels, and unnecessary labels above headings.
- Use outlines, borders, numbering, dividers, and labels to communicate structure, not as decoration. Number only genuine sequences.
- Use non-user-triggered motion sparingly and deliberately. Prefer motion that responds to user action; respect reduced-motion preferences.
- Write concise, plain-language UI copy from the user's perspective. Prefer active voice, sentence case, consistent action names, and clear recovery guidance for errors and empty states. Avoid decorative copy.
- Avoid using the same visual defaults irrespective of the subject. In particular, do not reach automatically for warm cream/serif/clay, near-black/neon, newspaper columns, identical rounded SaaS cards, generic tracked uppercase eyebrows, monospace data labels, or arrows appended to actions. These can be used when the brief specifically supports them.
- Spend boldness in one memorable element and keep supporting elements disciplined. Remove decoration that does not serve the brief.
- Build responsively, ensure visible keyboard focus and accessible contrast, and critique the result as you work. Take screenshots for visual review when the environment supports it.

## Process: plan, review, build, critique

Before writing UI code, create a compact design plan from the brief:

1. **Color**: name 4–6 core colors with hex values.
2. **Type**: name typefaces and their roles.
3. **Layout**: describe the layout in prose and compare ideas with ASCII wireframes; specify alignment (left, centered, or justified) and why.
4. **Principles**: state the high-level choices that make this design specific to the brief.
5. **Uniqueness review**: compare the plan with the brief and with the generic defaults above. Revise any choice that feels interchangeable with a similar product, and record what changed and why. Start implementation only after this review.

During implementation, follow the approved plan. Structure CSS selectors so type, component, and section styles do not unintentionally override one another. Critique the rendered result against the brief, accessibility, responsive behavior, and the plan; when possible, review a screenshot and remove one unnecessary flourish.

## Speckit integration

For features that create or change a user-facing web or mobile interface, `/speckit-plan` must read and apply this skill and record the design plan and uniqueness review in the feature's `plan.md`. `/speckit-implement` must read that section, follow it, and perform the available visual/accessibility review. Skip this design process for features with no user-facing interface.

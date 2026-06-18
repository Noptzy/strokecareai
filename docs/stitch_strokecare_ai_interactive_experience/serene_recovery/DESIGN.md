---
name: Serene Recovery
colors:
  surface: '#f4fafd'
  surface-dim: '#d4dbdd'
  surface-bright: '#f4fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f7'
  surface-container: '#e8eff1'
  surface-container-high: '#e2e9ec'
  surface-container-highest: '#dde4e6'
  on-surface: '#161d1f'
  on-surface-variant: '#564242'
  inverse-surface: '#2b3234'
  inverse-on-surface: '#ebf2f4'
  outline: '#897271'
  outline-variant: '#dcc0bf'
  surface-tint: '#a03e42'
  primary: '#892d32'
  on-primary: '#ffffff'
  primary-container: '#a84448'
  on-primary-container: '#ffdad9'
  inverse-primary: '#ffb3b2'
  secondary: '#99452c'
  on-secondary: '#ffffff'
  secondary-container: '#ff9475'
  on-secondary-container: '#762b14'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b2'
  on-primary-fixed: '#410008'
  on-primary-fixed-variant: '#81272c'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#7b2e17'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f4fafd'
  on-background: '#161d1f'
  surface-variant: '#dde4e6'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  section-gap: 64px
  stack-sm: 12px
  stack-md: 24px
---

## Brand & Style
The design system is built on a philosophy of "Empathetic Precision," merging the technical reliability of modern health interfaces with the intentionality of Japanese editorial design. The brand targets stroke survivors, caregivers, and medical professionals, necessitating an environment that feels restorative rather than clinical.

The visual style is **Minimalist and Editorial**. It prioritizes high-order information hierarchy, using generous whitespace to reduce cognitive load—a critical requirement for users recovering from neurological events. By eschewing aggressive "AI" tropes like neon glows or complex gradients, the system instead uses a warm, tactile palette and structured vertical rhythms to evoke a sense of calm, stability, and human-centric care.

## Colors
The palette is grounded in a warm ivory base, providing a softer, more organic reading surface than pure white. 

- **Primary (Deep Muted Red):** Used for critical actions, branding elements, and significant data points. It conveys authority without the alarmism of bright red.
- **Secondary (Soft Terracotta):** Applied to supporting interactive elements and decorative accents to maintain a human, approachable warmth.
- **Tertiary (Muted Gold):** Reserved for achievement states, milestones, and high-value insights.
- **Neutral (Slate Grey):** Used for primary text to ensure high legibility while appearing softer and more sophisticated than true black.
- **Background (Warm Ivory):** The foundational layer for all screens, creating a paper-like, editorial quality.

## Typography
The typography system utilizes **Inter** for its exceptional legibility and systematic weights. The editorial feel is achieved through a strong vertical rhythm and generous letter spacing in labels and body text.

To mimic Japanese editorial layouts, use `label-caps` for section headers and metadata to create clear visual anchors. Line heights are intentionally loose (1.6x for body) to assist users with visual tracking difficulties. All headings should follow a strict downward hierarchy, ensuring that the most critical information is the largest and most accessible.

## Layout & Spacing
This design system employs a **Fluid Grid** model with a focus on "Breathing Space." 

- **Desktop:** 12-column grid with wide 32px margins and 24px gutters. Content should be centered with a maximum readable width of 1100px.
- **Mobile:** 4-column grid with 20px margins.
- **Vertical Rhythm:** Components are spaced using an 8px base unit. Section-level gaps are generous (64px+) to prevent information density from becoming overwhelming. 

Layouts should favor asymmetrical balance where possible, using large margins to frame content blocks like an art gallery or a high-end magazine.

## Elevation & Depth
The system uses **Tonal Layers and Delicate Borders** rather than aggressive shadows.

Depth is communicated through:
1.  **Subtle Ambient Shadows:** Cards use a multi-layered shadow with very low opacity (4-8%) and a large blur radius (20px+) to feel "lifted" rather than "floating."
2.  **Hairline Outlines:** Elements are defined by 1px borders in a slightly darker shade of the background color (or #EAE8DD) to provide structure without visual noise.
3.  **Tonal Offsets:** Use subtle shifts in background color (e.g., a slightly cooler off-white) to differentiate secondary information panels from the primary canvas.

## Shapes
Shapes follow a **Soft** geometry. Corner radii are kept disciplined—0.25rem for small UI elements like checkboxes and 0.75rem for cards and large containers. This balance between sharp editorial lines and softened corners maintains a professional tone while remaining approachable and safe. Avoid fully circular "pill" buttons unless used for floating action buttons, to keep the design feeling grounded and structured.

## Components
- **Buttons:** Primary buttons use the Deep Muted Red with white text. Secondary buttons are ghost-style with Soft Terracotta borders and text. All buttons feature a 1px delicate border.
- **Minimalist Cards:** The core unit of the UI. Cards have no heavy borders; they rely on the `warm-ivory` background against a slightly deeper container-fill or a soft ambient shadow. Typography within cards should be highly prioritized.
- **Data Visualizations:** Charts use the Muted Gold and Soft Terracotta colors. Use thick, soft lines for progress tracking to emphasize a "journey" rather than a "target."
- **Inputs:** Text fields use a 1px Slate Grey border at 20% opacity. Upon focus, the border shifts to Soft Terracotta. Label text always sits above the field in `label-caps` style.
- **Progress Indicators:** Use "Step" indicators that feel like a table of contents in a book, utilizing vertical lines and clear typography to show the recovery path.
- **Status Chips:** Small, rectangular chips with 2px roundedness. Backgrounds are very desaturated versions of the status color (e.g., pale terracotta for "In Progress") with full-strength text.
# JobSwipe Pitch Deck

11-slide English pitch deck for the JobSwipe business — built for a professor (businessman) audience.

## Files

- `JobSwipe_Pitch_Deck.pptx` — the deck (LibreOffice / PowerPoint compatible)
- `build.js` — pptxgenjs source. Edit and rebuild when changing content.

## Rebuild

```bash
node docs/pitch-deck/build.js
```

Output is overwritten in place at `JobSwipe_Pitch_Deck.pptx`.

## Editorial rules

- **No fabricated statistics.** If you cannot cite a source, do not put a number on the slide. The current deck deliberately avoids "120+ entry sheets" / "70% burnout" / "1.38 openings per grad" type claims.
- The financial model on slide 06 (`¥0` for students, `¥500,000 per successful hire` for companies) is the canonical phrasing. Do not soften.
- Target user (slide 03) is **mid-tier and below universities + high school graduates**. Do not water this down with elite schools.
- Slides 09 (validation hypotheses) and 10 (risks) are intentionally honest. Keep them.

## Placeholders to fill

- Slide 1 subtitle: `[Your Name]`
- Slide 11 footer: `[Your Name]`

Open the .pptx, type over them, and save.

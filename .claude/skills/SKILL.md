# Post-Processing Pipeline Skill

## Purpose

This skill automates Counter Formation's brand-standard post-processing pipeline. It takes raw AI-generated images (from Ideogram, Midjourney, etc.) and produces color-graded, multi-format, QA-checked assets ready for web, social, and print deployment.

## When to Use

Trigger this skill when the user says any of:
- "Run the post-processing pipeline"
- "Process these images"
- "Color grade these"
- "Run post-processing on [folder]"
- "Grade and resize these assets"
- Any reference to processing raw images for Counter Formation

## Prerequisites

- Python 3 with Pillow installed (`pip install Pillow --break-system-packages`)
- Raw images in a source directory (PNG or JPG)
- The `cf_postprocess.py` script (located in this skill folder or copied to the project)

## Workflow

### Step 1: Confirm Source Directory

Ask the user where the raw images are. Default location: `./drops/[drop-name]/raw/`

If the user hasn't organized images into a drop folder yet, help them create the structure:
```
drops/
  [drop-name]/
    raw/           ← source images go here
    processed/     ← color-graded outputs land here
    export/        ← multi-format resized outputs
    print/         ← print-ready files
    reports/       ← QA reports
```

### Step 2: Run the Pipeline

Execute the processing script:

```bash
python cf_postprocess.py --source ./drops/[drop-name]/raw/ --output ./drops/[drop-name]/ --config standard
```

**Config options:**
- `standard` — Default Counter Formation brand grade (warm dark, champagne gold highlights)
- `collective` — The Collective variant (sage accent #8FAF8A, slightly cooler shadows)
- `campaign-light` — Light-mode campaign pages (warm cream palette, inverted treatment)

### Step 3: Review QA Report

The script generates a QA report at `./drops/[drop-name]/reports/qa_report.txt`. Present the results to the user:

- **PASS** — Image meets all brand color criteria
- **FLAG: [reason]** — Image has a potential issue that needs human review
- **FAIL: [reason]** — Image has a definitive brand violation

Common flags:
- `COLOR_TEMP_COOL` — Average color temperature is cooler than brand standard
- `COLOR_TEMP_HOT` — Average color temperature is warmer than expected (may be intentional)
- `HIGHLIGHT_BLOWN` — Highlights exceed the champagne gold ceiling
- `PURE_BLACK` — Significant areas of #000000 detected
- `PURE_WHITE` — Significant areas of #FFFFFF detected
- `SATURATION_HIGH` — Areas with saturation above brand threshold
- `DPI_LOW` — Resolution below 300 DPI (print-designated assets only)

### Step 4: Handle Flagged Images

For flagged images, offer the user these options:
1. **Re-grade with adjusted parameters** — Modify the color grade settings for this specific image
2. **Accept with noted exception** — Log the flag in the asset registry but proceed
3. **Reject and re-generate** — The image needs a new generation, not a processing fix

### Step 5: Confirm Outputs

List all outputs produced with file sizes and formats. The standard pipeline produces these outputs per source image:

| Output | Dimensions | Format | Location |
|--------|-----------|--------|----------|
| Web hero | 1920×1080 | WebP | `export/web-hero/` |
| Web card | 800×600 | WebP | `export/web-card/` |
| Social grid | 1080×1080 | PNG | `export/social-grid/` |
| Social stories | 1080×1920 | PNG | `export/social-stories/` |
| Print-ready | Full resolution | PNG (300 DPI) | `print/` |
| Formation Shareable (stories) | 1080×1920 | PNG | `export/shareable-9x16/` |
| Formation Shareable (feed) | 1080×1080 | PNG | `export/shareable-1x1/` |
| Color-graded master | Full resolution | PNG | `processed/` |

## Brand Color Grade Specification

These are the exact processing parameters for the standard Counter Formation grade. Reference target: Gospel of Peace hero image from Drop 002.

### Color Grade Parameters

```
DESATURATION: 0.15 to 0.20 (reduce saturation by 15-20%)
SHADOW_SHIFT_HUE: 30 (warm brown, toward #17140F)
SHADOW_SHIFT_STRENGTH: 0.25
HIGHLIGHT_SHIFT_HUE: 45 (champagne gold, toward #C9A84C)
HIGHLIGHT_SHIFT_STRENGTH: 0.15
CONTRAST_BOOST: 1.08
WARMTH_SHIFT: +8 (subtle warm push across midtones)
GRAIN_INTENSITY: 0.03 (subtle, not heavy)
GRAIN_SIZE: 1 (fine grain, not chunky)
```

### QA Thresholds

```
MAX_AVG_SATURATION: 0.35 (flag if average saturation exceeds this)
MIN_AVG_WARMTH: 0.52 (flag if average hue warmth falls below — image is too cool)
MAX_HIGHLIGHT_BRIGHTNESS: 0.92 (flag if highlights exceed this — blown out)
PURE_BLACK_THRESHOLD: 0.02 (flag if more than 2% of pixels are pure black)
PURE_WHITE_THRESHOLD: 0.01 (flag if more than 1% of pixels are pure white)
MIN_PRINT_DPI: 300 (flag print-designated assets below this)
```

## Error Handling

- If Pillow is not installed, run: `pip install Pillow --break-system-packages`
- If source directory is empty, inform the user and ask for the correct path
- If an image fails to process (corrupt file, unsupported format), log the error and continue processing remaining images
- If the output directory already contains processed files, ask the user whether to overwrite or create a versioned subfolder

## Notes

- The color grade is designed to match the Gospel of Peace hero image from Drop 002 as the tonal reference anchor
- Darkness is intentional, not decorative — the grade should preserve deep, warm shadows
- Pure grayscale is NOT on brand — processed images must retain warm undertones even in the darkest areas
- Film grain is applied to photographic assets only; skip grain for icons and graphic marks (detect by checking if source filename contains "icon" or "mark")
- The Collective variant swaps Champagne Gold (#C9A84C) for Collective Sage (#8FAF8A) in the highlight shift

#!/usr/bin/env python3
"""
Counter Formation — Post-Processing Pipeline
Applies brand-standard color grade, multi-format export, and QA checks.

Usage:
  python cf_postprocess.py --source ./raw/ --output ./drop_folder/ --config standard
  python cf_postprocess.py --source ./raw/ --output ./drop_folder/ --config collective
  python cf_postprocess.py --source ./raw/ --output ./drop_folder/ --config standard --skip-grain
"""

import argparse
import os
import sys
import json
import random
import math
from pathlib import Path
from datetime import datetime

try:
    from PIL import Image, ImageEnhance, ImageFilter, ImageStat
except ImportError:
    print("ERROR: Pillow is not installed.")
    print("Run: pip install Pillow --break-system-packages")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════════
# BRAND COLOR CONFIGURATIONS
# ═══════════════════════════════════════════════════════════════════

CONFIGS = {
    "standard": {
        "name": "Counter Formation Standard",
        "desaturation": 0.17,          # Reduce saturation by 17%
        "shadow_hue": 30,              # Warm brown (toward #17140F)
        "shadow_strength": 0.25,
        "highlight_hue": 45,           # Champagne gold (toward #C9A84C)
        "highlight_strength": 0.15,
        "contrast": 1.08,
        "warmth": 8,                   # Subtle warm push on midtones
        "grain_intensity": 0.03,
        "grain_size": 1,
        # QA thresholds
        "qa_max_saturation": 0.35,
        "qa_min_warmth": 0.52,
        "qa_max_highlight": 0.92,
        "qa_pure_black_pct": 0.02,
        "qa_pure_white_pct": 0.01,
        "qa_min_dpi": 300,
    },
    "collective": {
        "name": "The Collective (Sage)",
        "desaturation": 0.20,
        "shadow_hue": 25,              # Slightly cooler shadow
        "shadow_strength": 0.20,
        "highlight_hue": 140,          # Sage green (toward #8FAF8A)
        "highlight_strength": 0.12,
        "contrast": 1.06,
        "warmth": 4,
        "grain_intensity": 0.03,
        "grain_size": 1,
        "qa_max_saturation": 0.30,
        "qa_min_warmth": 0.45,
        "qa_max_highlight": 0.90,
        "qa_pure_black_pct": 0.02,
        "qa_pure_white_pct": 0.01,
        "qa_min_dpi": 300,
    },
    "campaign-light": {
        "name": "Campaign Light Mode",
        "desaturation": 0.10,
        "shadow_hue": 35,
        "shadow_strength": 0.10,
        "highlight_hue": 40,
        "highlight_strength": 0.08,
        "contrast": 1.04,
        "warmth": 5,
        "grain_intensity": 0.01,
        "grain_size": 1,
        "qa_max_saturation": 0.40,
        "qa_min_warmth": 0.48,
        "qa_max_highlight": 0.95,
        "qa_pure_black_pct": 0.01,
        "qa_pure_white_pct": 0.05,
        "qa_min_dpi": 300,
    },
}

# Output format specifications
OUTPUT_FORMATS = {
    "web-hero":          {"size": (1920, 1080), "format": "WEBP", "quality": 85, "subdir": "export/web-hero"},
    "web-card":          {"size": (800, 600),   "format": "WEBP", "quality": 85, "subdir": "export/web-card"},
    "social-grid":       {"size": (1080, 1080), "format": "PNG",  "quality": None, "subdir": "export/social-grid"},
    "social-stories":    {"size": (1080, 1920), "format": "PNG",  "quality": None, "subdir": "export/social-stories"},
    "shareable-9x16":    {"size": (1080, 1920), "format": "PNG",  "quality": None, "subdir": "export/shareable-9x16"},
    "shareable-1x1":     {"size": (1080, 1080), "format": "PNG",  "quality": None, "subdir": "export/shareable-1x1"},
}


# ═══════════════════════════════════════════════════════════════════
# COLOR GRADING FUNCTIONS
# ═══════════════════════════════════════════════════════════════════

def apply_desaturation(img, amount):
    """Reduce saturation while preserving warm tones."""
    enhancer = ImageEnhance.Color(img)
    return enhancer.enhance(1.0 - amount)


def apply_contrast(img, factor):
    """Boost contrast slightly for cinematic depth."""
    enhancer = ImageEnhance.Contrast(img)
    return enhancer.enhance(factor)


def apply_warmth(img, shift):
    """Push midtones toward warm. Positive shift = warmer."""
    if shift == 0:
        return img

    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]
            a = pixels[x, y][3] if img.mode == "RGBA" else 255

            # Apply warm shift: boost red slightly, reduce blue slightly
            r = min(255, r + shift)
            b = max(0, b - (shift // 2))

            if img.mode == "RGBA":
                pixels[x, y] = (r, g, b, a)
            else:
                pixels[x, y] = (r, g, b)

    return img


def apply_shadow_shift(img, hue, strength):
    """Shift shadow tones toward a target hue (warm brown for CF standard).

    Works by identifying dark pixels (luminance < 0.3) and blending them
    toward the target hue color. Strength controls how much blending occurs.
    """
    import colorsys

    # Convert target hue to RGB
    target_r, target_g, target_b = colorsys.hls_to_rgb(hue / 360.0, 0.15, 0.3)
    target_r = int(target_r * 255)
    target_g = int(target_g * 255)
    target_b = int(target_b * 255)

    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]
            a = pixels[x, y][3] if img.mode == "RGBA" else 255

            # Calculate luminance
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

            if lum < 0.3:
                # Shadow region — blend toward target hue
                # Blend strength scales with how deep the shadow is
                blend = strength * (1.0 - (lum / 0.3))
                r = int(r * (1 - blend) + target_r * blend)
                g = int(g * (1 - blend) + target_g * blend)
                b = int(b * (1 - blend) + target_b * blend)

                if img.mode == "RGBA":
                    pixels[x, y] = (r, g, b, a)
                else:
                    pixels[x, y] = (r, g, b)

    return img


def apply_highlight_shift(img, hue, strength):
    """Shift highlight tones toward a target hue (champagne gold for CF standard).

    Works by identifying bright pixels (luminance > 0.7) and blending them
    toward the target hue color. Strength controls how much blending occurs.
    """
    import colorsys

    target_r, target_g, target_b = colorsys.hls_to_rgb(hue / 360.0, 0.85, 0.4)
    target_r = int(target_r * 255)
    target_g = int(target_g * 255)
    target_b = int(target_b * 255)

    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]
            a = pixels[x, y][3] if img.mode == "RGBA" else 255

            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

            if lum > 0.7:
                # Highlight region — blend toward target hue
                blend = strength * ((lum - 0.7) / 0.3)
                r = int(r * (1 - blend) + target_r * blend)
                g = int(g * (1 - blend) + target_g * blend)
                b = int(b * (1 - blend) + target_b * blend)

                if img.mode == "RGBA":
                    pixels[x, y] = (r, g, b, a)
                else:
                    pixels[x, y] = (r, g, b)

    return img


def apply_film_grain(img, intensity, grain_size):
    """Add subtle film grain. Intensity 0.0-1.0, grain_size 1-3."""
    pixels = img.load()
    width, height = img.size
    grain_amount = int(intensity * 255)

    for y in range(0, height, grain_size):
        for x in range(0, width, grain_size):
            noise = random.randint(-grain_amount, grain_amount)

            for dy in range(grain_size):
                for dx in range(grain_size):
                    px, py = x + dx, y + dy
                    if px < width and py < height:
                        r, g, b = pixels[px, py][:3]
                        a = pixels[px, py][3] if img.mode == "RGBA" else 255

                        r = max(0, min(255, r + noise))
                        g = max(0, min(255, g + noise))
                        b = max(0, min(255, b + noise))

                        if img.mode == "RGBA":
                            pixels[px, py] = (r, g, b, a)
                        else:
                            pixels[px, py] = (r, g, b)

    return img


def color_grade(img, config, skip_grain=False, is_icon=False):
    """Apply the full Counter Formation color grade to an image."""
    print(f"    Applying color grade: {config['name']}")

    # Step 1: Desaturation
    img = apply_desaturation(img, config["desaturation"])

    # Step 2: Contrast boost
    img = apply_contrast(img, config["contrast"])

    # Step 3: Warmth shift on midtones
    img = apply_warmth(img, config["warmth"])

    # Step 4: Shadow shift toward warm brown
    img = apply_shadow_shift(img, config["shadow_hue"], config["shadow_strength"])

    # Step 5: Highlight shift toward champagne gold (or sage for Collective)
    img = apply_highlight_shift(img, config["highlight_hue"], config["highlight_strength"])

    # Step 6: Film grain (skip for icons/graphic marks)
    if not skip_grain and not is_icon:
        img = apply_film_grain(img, config["grain_intensity"], config["grain_size"])

    return img


# ═══════════════════════════════════════════════════════════════════
# MULTI-FORMAT EXPORT
# ═══════════════════════════════════════════════════════════════════

def resize_and_crop(img, target_size):
    """Resize image to fill target dimensions, cropping from center if needed."""
    target_w, target_h = target_size
    img_w, img_h = img.size

    # Calculate scale to fill (not fit)
    scale = max(target_w / img_w, target_h / img_h)
    new_w = int(img_w * scale)
    new_h = int(img_h * scale)

    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center crop
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    img = img.crop((left, top, left + target_w, top + target_h))

    return img


def export_formats(img, source_name, output_base, formats):
    """Export image to all required formats."""
    results = []

    for format_name, spec in formats.items():
        subdir = os.path.join(output_base, spec["subdir"])
        os.makedirs(subdir, exist_ok=True)

        resized = resize_and_crop(img.copy(), spec["size"])

        ext = "webp" if spec["format"] == "WEBP" else "png"
        filename = f"{source_name}.{ext}"
        filepath = os.path.join(subdir, filename)

        save_kwargs = {}
        if spec["format"] == "WEBP":
            save_kwargs["quality"] = spec["quality"]
            save_kwargs["method"] = 4
        elif spec["format"] == "PNG":
            save_kwargs["optimize"] = True

        # Convert RGBA to RGB for WebP if needed
        if spec["format"] == "WEBP" and resized.mode == "RGBA":
            background = Image.new("RGB", resized.size, (14, 12, 10))  # Obsidian
            background.paste(resized, mask=resized.split()[3])
            resized = background

        resized.save(filepath, **save_kwargs)
        file_size = os.path.getsize(filepath)
        results.append({
            "format": format_name,
            "path": filepath,
            "dimensions": spec["size"],
            "file_size": file_size,
        })
        print(f"    Exported: {format_name} → {filepath} ({file_size // 1024}KB)")

    return results


def export_print_ready(img, source_name, output_base):
    """Export full-resolution print-ready PNG with DPI metadata."""
    subdir = os.path.join(output_base, "print")
    os.makedirs(subdir, exist_ok=True)

    filename = f"{source_name}-print.png"
    filepath = os.path.join(subdir, filename)

    # Save with 300 DPI metadata
    img.save(filepath, dpi=(300, 300), optimize=True)
    file_size = os.path.getsize(filepath)
    print(f"    Exported: print-ready → {filepath} ({file_size // 1024}KB)")

    return {
        "format": "print-ready",
        "path": filepath,
        "dimensions": img.size,
        "file_size": file_size,
        "dpi": 300,
    }


def export_master(img, source_name, output_base):
    """Save the color-graded master at full resolution."""
    subdir = os.path.join(output_base, "processed")
    os.makedirs(subdir, exist_ok=True)

    filename = f"{source_name}-graded.png"
    filepath = os.path.join(subdir, filename)

    img.save(filepath, optimize=True)
    file_size = os.path.getsize(filepath)
    print(f"    Exported: graded master → {filepath} ({file_size // 1024}KB)")

    return {
        "format": "graded-master",
        "path": filepath,
        "dimensions": img.size,
        "file_size": file_size,
    }


# ═══════════════════════════════════════════════════════════════════
# BRAND QA CHECK
# ═══════════════════════════════════════════════════════════════════

def run_qa_check(img, config, source_name, is_print=False):
    """Run brand QA checks on a processed image. Returns list of flags."""
    import colorsys

    flags = []
    pixels = list(img.getdata())
    total_pixels = len(pixels)

    # Metrics
    total_saturation = 0.0
    total_warmth = 0.0
    pure_black_count = 0
    pure_white_count = 0
    max_brightness = 0.0

    for pixel in pixels:
        r, g, b = pixel[:3]
        r_n, g_n, b_n = r / 255.0, g / 255.0, b / 255.0

        # Convert to HLS for analysis
        h, l, s = colorsys.rgb_to_hls(r_n, g_n, b_n)

        total_saturation += s
        total_warmth += h  # Hue position (0-1, warm hues around 0.0-0.15)
        max_brightness = max(max_brightness, l)

        # Pure black check (within tolerance)
        if r <= 2 and g <= 2 and b <= 2:
            pure_black_count += 1

        # Pure white check (within tolerance)
        if r >= 253 and g >= 253 and b >= 253:
            pure_white_count += 1

    avg_saturation = total_saturation / total_pixels
    avg_warmth = total_warmth / total_pixels
    pure_black_pct = pure_black_count / total_pixels
    pure_white_pct = pure_white_count / total_pixels

    # Check thresholds
    if avg_saturation > config["qa_max_saturation"]:
        flags.append(f"FLAG: SATURATION_HIGH — avg {avg_saturation:.3f} exceeds {config['qa_max_saturation']}")

    if avg_warmth < config["qa_min_warmth"]:
        flags.append(f"FLAG: COLOR_TEMP_COOL — avg warmth {avg_warmth:.3f} below {config['qa_min_warmth']}")

    if max_brightness > config["qa_max_highlight"]:
        flags.append(f"FLAG: HIGHLIGHT_BLOWN — max brightness {max_brightness:.3f} exceeds {config['qa_max_highlight']}")

    if pure_black_pct > config["qa_pure_black_pct"]:
        flags.append(f"FLAG: PURE_BLACK — {pure_black_pct*100:.1f}% pure black pixels (threshold: {config['qa_pure_black_pct']*100:.0f}%)")

    if pure_white_pct > config["qa_pure_white_pct"]:
        flags.append(f"FLAG: PURE_WHITE — {pure_white_pct*100:.1f}% pure white pixels (threshold: {config['qa_pure_white_pct']*100:.0f}%)")

    # DPI check for print assets
    if is_print:
        dpi = img.info.get("dpi", (72, 72))
        if isinstance(dpi, tuple):
            effective_dpi = min(dpi)
        else:
            effective_dpi = dpi
        if effective_dpi < config["qa_min_dpi"]:
            flags.append(f"FLAG: DPI_LOW — {effective_dpi} DPI (minimum: {config['qa_min_dpi']})")

    return {
        "name": source_name,
        "status": "PASS" if len(flags) == 0 else "FLAGGED",
        "flags": flags,
        "metrics": {
            "avg_saturation": round(avg_saturation, 4),
            "avg_warmth": round(avg_warmth, 4),
            "max_brightness": round(max_brightness, 4),
            "pure_black_pct": round(pure_black_pct, 4),
            "pure_white_pct": round(pure_white_pct, 4),
        }
    }


# ═══════════════════════════════════════════════════════════════════
# MAIN PIPELINE
# ═══════════════════════════════════════════════════════════════════

def is_icon_file(filename):
    """Check if a file is an icon/graphic mark (skip grain for these)."""
    name_lower = filename.lower()
    return any(keyword in name_lower for keyword in ["icon", "mark", "logo", "symbol", "graphic"])


def process_image(filepath, output_base, config, skip_grain=False):
    """Process a single image through the full pipeline."""
    filename = os.path.basename(filepath)
    source_name = os.path.splitext(filename)[0]
    is_icon = is_icon_file(filename)

    print(f"\n  Processing: {filename}")
    print(f"    Type: {'Icon/Mark (no grain)' if is_icon else 'Photographic'}")

    # Load image
    img = Image.open(filepath)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    original_size = img.size
    print(f"    Source: {original_size[0]}×{original_size[1]}")

    # Step 1: Color grade
    graded = color_grade(img.copy(), config, skip_grain=skip_grain, is_icon=is_icon)

    # Step 2: Export graded master
    master_result = export_master(graded, source_name, output_base)

    # Step 3: Export all formats
    format_results = export_formats(graded, source_name, output_base, OUTPUT_FORMATS)

    # Step 4: Export print-ready
    print_result = export_print_ready(graded, source_name, output_base)

    # Step 5: Run QA check on graded master
    qa_result = run_qa_check(graded, config, source_name, is_print=True)

    return {
        "source": filepath,
        "source_name": source_name,
        "source_dimensions": original_size,
        "is_icon": is_icon,
        "master": master_result,
        "formats": format_results,
        "print": print_result,
        "qa": qa_result,
    }


def generate_report(results, config_name, output_base):
    """Generate the QA report."""
    report_dir = os.path.join(output_base, "reports")
    os.makedirs(report_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_path = os.path.join(report_dir, "qa_report.txt")

    passed = sum(1 for r in results if r["qa"]["status"] == "PASS")
    flagged = sum(1 for r in results if r["qa"]["status"] == "FLAGGED")

    lines = [
        "=" * 60,
        "COUNTER FORMATION — POST-PROCESSING QA REPORT",
        "=" * 60,
        f"Generated: {timestamp}",
        f"Config: {config_name}",
        f"Total images processed: {len(results)}",
        f"Passed: {passed}",
        f"Flagged: {flagged}",
        "=" * 60,
        "",
    ]

    for r in results:
        qa = r["qa"]
        lines.append(f"{'PASS' if qa['status'] == 'PASS' else 'FLAG'} — {qa['name']}")
        lines.append(f"  Source: {r['source_dimensions'][0]}×{r['source_dimensions'][1]}")
        lines.append(f"  Type: {'Icon/Mark' if r['is_icon'] else 'Photographic'}")
        lines.append(f"  Saturation: {qa['metrics']['avg_saturation']:.4f}")
        lines.append(f"  Warmth: {qa['metrics']['avg_warmth']:.4f}")
        lines.append(f"  Max brightness: {qa['metrics']['max_brightness']:.4f}")
        lines.append(f"  Pure black: {qa['metrics']['pure_black_pct']*100:.1f}%")
        lines.append(f"  Pure white: {qa['metrics']['pure_white_pct']*100:.1f}%")

        if qa["flags"]:
            for flag in qa["flags"]:
                lines.append(f"  >>> {flag}")

        lines.append("")

    lines.extend([
        "=" * 60,
        "END OF REPORT",
        "=" * 60,
    ])

    report_text = "\n".join(lines)

    with open(report_path, "w") as f:
        f.write(report_text)

    # Also save as JSON for programmatic access
    json_path = os.path.join(report_dir, "qa_report.json")
    json_data = {
        "timestamp": timestamp,
        "config": config_name,
        "summary": {"total": len(results), "passed": passed, "flagged": flagged},
        "results": [r["qa"] for r in results],
    }
    with open(json_path, "w") as f:
        json.dump(json_data, f, indent=2)

    print(f"\n  QA Report saved: {report_path}")
    print(f"  QA JSON saved: {json_path}")

    return report_path


def main():
    parser = argparse.ArgumentParser(
        description="Counter Formation Post-Processing Pipeline"
    )
    parser.add_argument(
        "--source", required=True,
        help="Source directory containing raw images"
    )
    parser.add_argument(
        "--output", required=True,
        help="Output base directory (will create subdirectories)"
    )
    parser.add_argument(
        "--config", default="standard", choices=CONFIGS.keys(),
        help="Color grade configuration (default: standard)"
    )
    parser.add_argument(
        "--skip-grain", action="store_true",
        help="Skip film grain on all images"
    )

    args = parser.parse_args()

    # Validate source directory
    if not os.path.isdir(args.source):
        print(f"ERROR: Source directory not found: {args.source}")
        sys.exit(1)

    # Find images
    supported_ext = {".png", ".jpg", ".jpeg", ".webp", ".tiff", ".bmp"}
    image_files = [
        os.path.join(args.source, f)
        for f in sorted(os.listdir(args.source))
        if os.path.splitext(f)[1].lower() in supported_ext
    ]

    if not image_files:
        print(f"ERROR: No images found in {args.source}")
        print(f"Supported formats: {', '.join(supported_ext)}")
        sys.exit(1)

    config = CONFIGS[args.config]

    print("=" * 60)
    print("COUNTER FORMATION — POST-PROCESSING PIPELINE")
    print("=" * 60)
    print(f"Config: {config['name']}")
    print(f"Source: {args.source}")
    print(f"Output: {args.output}")
    print(f"Images found: {len(image_files)}")
    print(f"Skip grain: {args.skip_grain}")
    print("=" * 60)

    # Process each image
    results = []
    for filepath in image_files:
        try:
            result = process_image(filepath, args.output, config, skip_grain=args.skip_grain)
            results.append(result)
        except Exception as e:
            print(f"\n  ERROR processing {filepath}: {e}")
            results.append({
                "source": filepath,
                "source_name": os.path.splitext(os.path.basename(filepath))[0],
                "error": str(e),
                "qa": {"name": os.path.basename(filepath), "status": "ERROR", "flags": [f"ERROR: {e}"], "metrics": {}},
            })

    # Generate report
    report_path = generate_report(results, config["name"], args.output)

    # Summary
    passed = sum(1 for r in results if r["qa"]["status"] == "PASS")
    flagged = sum(1 for r in results if r["qa"]["status"] == "FLAGGED")
    errors = sum(1 for r in results if r["qa"]["status"] == "ERROR")

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETE")
    print("=" * 60)
    print(f"  Processed: {len(results)} images")
    print(f"  Passed QA: {passed}")
    print(f"  Flagged:   {flagged}")
    print(f"  Errors:    {errors}")
    print(f"  Report:    {report_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()

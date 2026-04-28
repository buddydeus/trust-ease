from __future__ import annotations

from pathlib import Path

from render_ui_mockups import (
    PHONE_H,
    PHONE_W,
    Palette,
    Scheme,
    draw_create,
    draw_home,
    draw_welcome,
    rounded_rect,
    svg_text,
)


ROOT = Path(__file__).resolve().parent.parent
UI_DIR = ROOT / "ui"


def variant_scheme(base: Scheme, name: str, subtitle: str, palette: Palette, board_bg: str) -> Scheme:
    return Scheme(
        slug=name,
        title=f"{base.title} · {name}",
        subtitle=subtitle,
        board_bg=board_bg,
        fonts=base.fonts,
        palette=palette,
        accent_style=base.accent_style,
    )


def write_variant_assets(base_dir: Path, schemes: list[Scheme]) -> list[tuple[Scheme, list[Path]]]:
    output: list[tuple[Scheme, list[Path]]] = []
    for scheme in schemes:
        assets_dir = base_dir / scheme.slug
        assets_dir.mkdir(parents=True, exist_ok=True)
        files = [
            ("欢迎页.svg", draw_welcome(scheme)),
            ("首页.svg", draw_home(scheme)),
            ("创建事项页.svg", draw_create(scheme)),
        ]
        paths: list[Path] = []
        for filename, svg in files:
            path = assets_dir / filename
            path.write_text(svg, encoding="utf-8")
            paths.append(path)
        output.append((scheme, paths))
    return output


def comparison_board(title: str, subtitle: str, board_bg: str, variants: list[tuple[Scheme, list[Path]]], output_path: Path) -> None:
    width = 1550
    height = 1720
    scale = 0.46
    scaled_w = PHONE_W * scale
    scaled_h = PHONE_H * scale
    col_x = [70, 540, 1010]
    row_y = [230, 670, 1110]
    labels = ["欢迎页", "首页", "创建事项页"]
    first_scheme = variants[0][0]
    ink = first_scheme.palette.ink
    muted = first_scheme.palette.muted
    title_font, body_font = first_scheme.fonts

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">']
    parts.append(f'<rect width="{width}" height="{height}" fill="{board_bg}"/>')
    parts.append(svg_text(70, 74, title, size=42, weight=700, fill=ink, family=title_font))
    parts.append(svg_text(70, 120, subtitle, size=18, fill=muted, family=body_font))
    parts.append(rounded_rect(1110, 52, 360, 86, 26, "#FFFFFF", stroke=first_scheme.palette.border))
    parts.append(svg_text(1290, 87, "评估重点", size=18, weight=650, fill=ink, family=title_font, anchor="middle"))
    parts.append(svg_text(1290, 115, "主色面积是否轻盈、是否仍保留信任感", size=14, fill=muted, family=body_font, anchor="middle"))

    for idx, (scheme, paths) in enumerate(variants):
        x = col_x[idx]
        parts.append(rounded_rect(x, 156, 400, 46, 18, scheme.palette.panel_alt, stroke=scheme.palette.border))
        parts.append(svg_text(x + 26, 185, scheme.slug, size=19, weight=700, fill=scheme.palette.primary, family=title_font))
        parts.append(svg_text(x + 170, 185, scheme.subtitle, size=13, fill=scheme.palette.muted, family=body_font))
        for row, (label, path) in enumerate(zip(labels, paths)):
            y = row_y[row]
            parts.append(svg_text(x + 90, y - 18, label, size=16, weight=650, fill=scheme.palette.ink, family=title_font, anchor="middle"))
            rel = f"{path.parent.name}/{path.name}"
            parts.append(f'<g transform="translate({x},{y}) scale({scale})"><image href="{rel}" width="{PHONE_W}" height="{PHONE_H}"/></g>')
    parts.append("</svg>")
    output_path.write_text("".join(parts), encoding="utf-8")


def html_index(output_path: Path, sections: list[tuple[str, str]]) -> None:
    cards = []
    for title, svg_path in sections:
        cards.append(
            f"""
            <section class="card">
              <h2>{title}</h2>
              <img src="{svg_path}" alt="{title}" />
            </section>
            """
        )
    html = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>安心 App 配色审查</title>
  <style>
    :root {{
      --bg: #f5f2ec;
      --ink: #2f3935;
      --muted: #6c746f;
      --card: #ffffff;
      --border: #dde4df;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      padding: 40px;
      background: var(--bg);
      color: var(--ink);
      font-family: "PingFang SC","Helvetica Neue",sans-serif;
    }}
    h1 {{
      margin: 0 0 10px;
      font-size: 34px;
    }}
    p {{
      margin: 0 0 28px;
      color: var(--muted);
      font-size: 16px;
    }}
    .grid {{
      display: grid;
      gap: 24px;
    }}
    .card {{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 18px 18px 22px;
      box-shadow: 0 12px 40px rgba(42, 57, 51, 0.06);
    }}
    .card h2 {{
      margin: 4px 0 16px;
      font-size: 22px;
    }}
    .card img {{
      width: 100%;
      display: block;
      border-radius: 18px;
      background: #fff;
    }}
  </style>
</head>
<body>
  <h1>安心 App 配色审查</h1>
  <p>通过关键页面对比两套方案在不同提亮方向下的实际观感，重点看是否还压抑、是否保留信任感、是否贴合产品气质。</p>
  <div class="grid">
    {''.join(cards)}
  </div>
</body>
</html>"""
    output_path.write_text(html, encoding="utf-8")


def main() -> None:
    base_letter = Scheme(
        slug="信笺秩序",
        title="方案 A｜信笺秩序",
        subtitle="品牌型方向",
        board_bg="#F1ECE2",
        fonts=("Songti SC, STSong, serif", "Arial Unicode MS, PingFang SC, sans-serif"),
        accent_style="paper",
        palette=Palette(
            bg="#F6F1E8",
            panel="#EEE7DB",
            panel_alt="#FBF8F1",
            ink="#2F3935",
            muted="#6A716C",
            primary="#264E46",
            accent="#E4D2A7",
            success="#6E8B78",
            danger="#8E5E5A",
            border="#D9DED7",
            tag_missing_bg="#DCE8E0",
            tag_missing_fg="#315348",
            tag_death_bg="#E6D7D2",
            tag_death_fg="#6C4C47",
        ),
    )
    base_quiet = Scheme(
        slug="静默实用",
        title="方案 B｜静默实用",
        subtitle="工具型方向",
        board_bg="#F4F2EE",
        fonts=("Arial Unicode MS, PingFang SC, sans-serif", "Arial Unicode MS, PingFang SC, sans-serif"),
        accent_style="product",
        palette=Palette(
            bg="#FAF8F4",
            panel="#FFFFFF",
            panel_alt="#F1F4F1",
            ink="#28302D",
            muted="#6A7870",
            primary="#31574E",
            accent="#E3E7E3",
            success="#5F7D6C",
            danger="#8A4D4D",
            border="#D7DFDA",
            tag_missing_bg="#DDE9E3",
            tag_missing_fg="#355247",
            tag_death_bg="#E9DCDD",
            tag_death_fg="#704B4C",
        ),
    )

    letter_variants = [
        variant_scheme(
            base_letter,
            "晨雾青绿",
            "更透气，保留托付感",
            Palette(
                bg="#FBF7F0",
                panel="#EFF5F1",
                panel_alt="#FFFDFC",
                ink="#35574E",
                muted="#6F7F78",
                primary="#5E9C8A",
                accent="#E8D7AF",
                success="#7FB199",
                danger="#B57C74",
                border="#DCE6E0",
                tag_missing_bg="#E2F1EA",
                tag_missing_fg="#40695B",
                tag_death_bg="#EFD9D5",
                tag_death_fg="#7B5550",
            ),
            "#F6F1E7",
        ),
        variant_scheme(
            base_letter,
            "海盐蓝绿",
            "更清爽，现代感更强",
            Palette(
                bg="#FAF8F3",
                panel="#EEF6F8",
                panel_alt="#FEFCF8",
                ink="#33515A",
                muted="#6A7F86",
                primary="#6EA8B6",
                accent="#E5D3A8",
                success="#88B7BE",
                danger="#B48179",
                border="#DDE7E9",
                tag_missing_bg="#E1F0F4",
                tag_missing_fg="#48636A",
                tag_death_bg="#F0DDD8",
                tag_death_fg="#7A5852",
            ),
            "#F3F1EB",
        ),
        variant_scheme(
            base_letter,
            "鼠尾草暖杏",
            "最温和，家书感更强",
            Palette(
                bg="#FCF8F1",
                panel="#F4EEE3",
                panel_alt="#FFFDF9",
                ink="#4E6257",
                muted="#7A847D",
                primary="#8CAF97",
                accent="#E6BF95",
                success="#9FC1AE",
                danger="#B98C82",
                border="#E1E4DB",
                tag_missing_bg="#E7F0E7",
                tag_missing_fg="#5A7263",
                tag_death_bg="#F1E3DB",
                tag_death_fg="#82665D",
            ),
            "#F6F0E7",
        ),
    ]

    quiet_variants = [
        variant_scheme(
            base_quiet,
            "晨雾青绿",
            "更轻，更有呼吸感",
            Palette(
                bg="#F7FBF9",
                panel="#FFFFFF",
                panel_alt="#ECF6F2",
                ink="#2F5148",
                muted="#6A8177",
                primary="#6AAE9B",
                accent="#DCEAE4",
                success="#7EB6A1",
                danger="#AF7A74",
                border="#D8E6E0",
                tag_missing_bg="#E3F2EB",
                tag_missing_fg="#4D6D62",
                tag_death_bg="#EFDEDB",
                tag_death_fg="#775652",
            ),
            "#F1F6F3",
        ),
        variant_scheme(
            base_quiet,
            "海盐蓝绿",
            "更清爽，更现代",
            Palette(
                bg="#F6FBFC",
                panel="#FFFFFF",
                panel_alt="#EAF5F8",
                ink="#2E4D56",
                muted="#6A8087",
                primary="#74B7C4",
                accent="#D9EBEF",
                success="#8ABDC6",
                danger="#B07F78",
                border="#D8E6EA",
                tag_missing_bg="#E4F1F5",
                tag_missing_fg="#4A6770",
                tag_death_bg="#F0DEDB",
                tag_death_fg="#775954",
            ),
            "#EFF5F7",
        ),
        variant_scheme(
            base_quiet,
            "鼠尾草暖杏",
            "最柔和，生活感更强",
            Palette(
                bg="#FAFCF8",
                panel="#FFFFFF",
                panel_alt="#EEF4EE",
                ink="#466055",
                muted="#73837A",
                primary="#93B8A3",
                accent="#E7D7C4",
                success="#A9C6B6",
                danger="#B58A80",
                border="#D9E4DA",
                tag_missing_bg="#E7F0E8",
                tag_missing_fg="#5A7466",
                tag_death_bg="#F0E2DB",
                tag_death_fg="#7E625B",
            ),
            "#F3F6F1",
        ),
    ]

    letter_root = UI_DIR / "信笺秩序" / "palette-review"
    quiet_root = UI_DIR / "静默实用" / "palette-review"
    letter_variants_written = write_variant_assets(letter_root, letter_variants)
    quiet_variants_written = write_variant_assets(quiet_root, quiet_variants)

    comparison_board(
        "方案 A｜信笺秩序 · 配色提亮审查",
        "同一套页面结构下，仅调整主配色与背景氛围，观察是否减轻压抑感，同时保留家书感与托付感。",
        "#F4EFE7",
        letter_variants_written,
        letter_root / "总览.svg",
    )
    comparison_board(
        "方案 B｜静默实用 · 配色提亮审查",
        "同一套页面结构下，仅调整主配色与背景氛围，观察是否更轻、更成熟，同时不丢掉清晰度。",
        "#F1F5F2",
        quiet_variants_written,
        quiet_root / "总览.svg",
    )

    html_index(
        UI_DIR / "配色审查.html",
        [
            ("方案 A｜信笺秩序", "信笺秩序/palette-review/总览.svg"),
            ("方案 B｜静默实用", "静默实用/palette-review/总览.svg"),
        ],
    )


if __name__ == "__main__":
    main()

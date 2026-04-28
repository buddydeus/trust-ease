from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from textwrap import wrap
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent.parent
UI_DIR = ROOT / "ui"

PHONE_W = 390
PHONE_H = 844


@dataclass
class Palette:
    bg: str
    panel: str
    panel_alt: str
    ink: str
    muted: str
    primary: str
    accent: str
    success: str
    danger: str
    border: str
    tag_missing_bg: str
    tag_missing_fg: str
    tag_death_bg: str
    tag_death_fg: str


@dataclass
class Scheme:
    slug: str
    title: str
    subtitle: str
    board_bg: str
    fonts: tuple[str, str]
    palette: Palette
    accent_style: str


def chunk_text(text: str, width: int) -> list[str]:
    lines: list[str] = []
    for part in text.split("\n"):
        if not part:
            lines.append("")
            continue
        pieces = wrap(part, width=width, break_long_words=False, break_on_hyphens=False)
        lines.extend(pieces or [""])
    return lines


def svg_text(
    x: int,
    y: int,
    text: str,
    *,
    size: int = 16,
    weight: int = 400,
    fill: str = "#000000",
    family: str = "Arial Unicode MS",
    anchor: str = "start",
    line_height: int | None = None,
    opacity: float | None = None,
) -> str:
    attrs = [
        f'x="{x}"',
        f'y="{y}"',
        f'font-size="{size}"',
        f'font-weight="{weight}"',
        f'fill="{fill}"',
        f'font-family="{family}"',
        f'text-anchor="{anchor}"',
    ]
    if opacity is not None:
        attrs.append(f'fill-opacity="{opacity}"')
    attr_str = " ".join(attrs)
    lines = text.split("\n")
    if len(lines) == 1:
        return f"<text {attr_str}>{escape(text)}</text>"
    lh = line_height or int(size * 1.45)
    tspans = [f'<tspan x="{x}" dy="0">{escape(lines[0])}</tspan>']
    for line in lines[1:]:
        tspans.append(f'<tspan x="{x}" dy="{lh}">{escape(line)}</tspan>')
    return f"<text {attr_str}>{''.join(tspans)}</text>"


def rounded_rect(x: int, y: int, w: int, h: int, r: int, fill: str, stroke: str | None = None, stroke_width: int = 1, extra: str = "") -> str:
    stroke_attr = ""
    if stroke:
        stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"'
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{stroke_attr} {extra}/>'


def circle(cx: int, cy: int, r: int, fill: str, extra: str = "") -> str:
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" {extra}/>'


def line(x1: int, y1: int, x2: int, y2: int, color: str, width: int = 1, extra: str = "") -> str:
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round" {extra}/>'


def polygon(points: list[tuple[int, int]], fill: str, extra: str = "") -> str:
    pts = " ".join(f"{x},{y}" for x, y in points)
    return f'<polygon points="{pts}" fill="{fill}" {extra}/>'


def tag(x: int, y: int, text: str, bg: str, fg: str, width: int) -> str:
    return (
        rounded_rect(x, y, width, 28, 14, bg)
        + svg_text(x + width // 2, y + 19, text, size=13, weight=600, fill=fg, anchor="middle")
    )


def ribbon_corner(x: int, y: int, fill: str, accent: str) -> str:
    return (
        rounded_rect(x, y, 18, 44, 5, fill)
        + polygon([(x, y + 38), (x + 9, y + 50), (x + 18, y + 38)], fill)
        + polygon([(x + 12, y), (x + 18, y), (x + 18, y + 18)], accent, 'fill-opacity="0.42"')
        + line(x + 4, y + 6, x + 4, y + 34, "#FFFFFF", 1, 'stroke-opacity="0.22"')
    )


def card_title_block(x: int, y: int, title: str, subtitle: str, scheme: Scheme) -> str:
    title_font, body_font = scheme.fonts
    return (
        svg_text(x, y, title, size=20, weight=650, fill=scheme.palette.ink, family=title_font)
        + svg_text(x, y + 30, subtitle, size=13, fill=scheme.palette.muted, family=body_font)
    )


def phone_shell(inner: str, scheme: Scheme) -> str:
    outer = []
    outer.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{PHONE_W}" height="{PHONE_H}" viewBox="0 0 {PHONE_W} {PHONE_H}">')
    outer.append(
        """
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity="0.12"/>
          </filter>
          <linearGradient id="paperGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
          </linearGradient>
        </defs>
        """
    )
    outer.append(rounded_rect(18, 12, 354, 820, 42, "#1D1D1D", extra='filter="url(#shadow)"'))
    outer.append(rounded_rect(31, 27, 328, 790, 34, scheme.palette.bg))
    outer.append(rounded_rect(140, 40, 110, 20, 10, "#101010"))
    outer.append(inner)
    outer.append("</svg>")
    return "".join(outer)


def draw_welcome(scheme: Scheme) -> str:
    p = scheme.palette
    title_font, body_font = scheme.fonts
    parts = []
    parts.append(rounded_rect(31, 27, 328, 790, 34, p.bg))
    if scheme.slug == "信笺秩序":
        parts.append('<defs><linearGradient id="mist" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FBF7F0"/><stop offset="100%" stop-color="#F1EBDE"/></linearGradient></defs>')
        parts.append(rounded_rect(31, 27, 328, 790, 34, "url(#mist)"))
        parts.append(rounded_rect(70, 200, 190, 220, 26, p.panel, stroke=p.border))
        parts.append(rounded_rect(98, 174, 184, 232, 26, "#F3EEE4", stroke=p.border))
        parts.append(rounded_rect(122, 148, 182, 242, 26, "#FBF8F1", stroke=p.border))
        parts.append(rounded_rect(230, 126, 70, 28, 14, p.accent))
        parts.append(svg_text(265, 145, "已整理", size=12, weight=700, fill=p.primary, family=body_font, anchor="middle"))
        parts.append(svg_text(150, 200, "联系人", size=16, weight=650, fill=p.ink, family=body_font))
        parts.append(svg_text(150, 236, "事项", size=16, weight=650, fill=p.ink, family=body_font))
        parts.append(svg_text(150, 272, "确认记录", size=16, weight=650, fill=p.ink, family=body_font))
        parts.append(line(148, 212, 248, 212, p.border, 2))
        parts.append(line(148, 248, 222, 248, p.border, 2))
        parts.append(line(148, 284, 260, 284, p.border, 2))
        parts.append(svg_text(62, 100, "安心", size=34, weight=650, fill=p.primary, family=title_font))
        parts.append(svg_text(62, 142, "提前交代，事后有序", size=14, weight=500, fill=p.muted, family=body_font))
        welcome_lines = "先把重要的事，\n安静地交代好"
        parts.append(svg_text(62, 470, welcome_lines, size=28, weight=650, fill=p.ink, family=title_font, line_height=40))
        body = "意外、失联或无法亲自处理时，\n你写下的事项会按约定被看见。"
        parts.append(svg_text(62, 555, body, size=15, fill=p.muted, family=body_font, line_height=24))
    else:
        parts.append(svg_text(62, 96, "安心", size=32, weight=700, fill=p.primary, family=title_font))
        parts.append(svg_text(62, 142, "管理重要事项与触发保护", size=28, weight=650, fill=p.ink, family=title_font))
        body = "提前配置联系人、事项和触发条件，\n在需要时按规则处理。"
        parts.append(svg_text(62, 190, body, size=15, fill=p.muted, family=body_font, line_height=24))
        card_y = 260
        specs = [
            ("每日确认", "每天只需完成一次平安申报"),
            ("事项托付", "线下事项和线上事项分组管理"),
            ("低误触发保护", "不会因一次未响应直接执行"),
        ]
        for i, (title, subtitle) in enumerate(specs):
            y = card_y + i * 112
            parts.append(rounded_rect(58, y, 274, 92, 22, p.panel, stroke=p.border))
            parts.append(circle(88, y + 30, 12, p.primary))
            parts.append(svg_text(110, y + 35, title, size=17, weight=650, fill=p.ink, family=title_font))
            parts.append(svg_text(110, y + 61, subtitle, size=13, fill=p.muted, family=body_font))
    parts.append(rounded_rect(58, 690, 274, 56, 20, p.primary))
    parts.append(svg_text(195, 724, "开始设置", size=18, weight=700, fill="#FFFFFF", family=body_font, anchor="middle"))
    parts.append(rounded_rect(58, 756, 274, 44, 18, p.panel, stroke=p.border))
    parts.append(svg_text(195, 783, "先了解怎么运作", size=15, weight=600, fill=p.ink, family=body_font, anchor="middle"))
    return phone_shell("".join(parts), scheme)


def draw_report(scheme: Scheme) -> str:
    p = scheme.palette
    title_font, body_font = scheme.fonts
    parts = [rounded_rect(31, 27, 328, 790, 34, p.bg)]
    if scheme.slug == "信笺秩序":
        parts.append(svg_text(62, 96, "2026 / 04 / 24", size=14, weight=600, fill=p.muted, family=body_font))
        parts.append(svg_text(62, 132, "今天也为自己报个平安", size=28, weight=650, fill=p.ink, family=title_font))
        parts.append(rounded_rect(62, 182, 266, 54, 18, p.accent, extra='fill-opacity="0.22"'))
        parts.append(svg_text(84, 215, "今天首次进入，需要完成一次完整确认", size=14, weight=600, fill=p.primary, family=body_font))
        parts.append(rounded_rect(62, 272, 266, 314, 30, "#FBF8F1", stroke=p.border))
        parts.append(svg_text(195, 380, "我今天还在", size=34, weight=700, fill=p.primary, family=title_font, anchor="middle"))
        parts.append(svg_text(195, 424, "完成一次平安记录", size=15, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(circle(195, 480, 34, p.primary))
        parts.append(svg_text(195, 488, "✓", size=32, weight=700, fill="#FFFFFF", family=body_font, anchor="middle"))
        parts.append(svg_text(195, 748, "查看完整校验方式", size=15, weight=600, fill=p.primary, family=body_font, anchor="middle"))
    else:
        parts.append(svg_text(62, 98, "今日申报", size=30, weight=700, fill=p.ink, family=title_font))
        parts.append(svg_text(62, 138, "今天首次进入，需要进行完整确认", size=15, fill=p.muted, family=body_font))
        parts.append(rounded_rect(58, 182, 274, 70, 22, p.panel, stroke=p.border))
        parts.append(svg_text(78, 214, "今日确认方式", size=13, weight=600, fill=p.muted, family=body_font))
        parts.append(svg_text(78, 239, "完整确认", size=20, weight=700, fill=p.primary, family=title_font))
        parts.append(rounded_rect(58, 300, 274, 188, 28, p.primary))
        parts.append(svg_text(195, 396, "我今天还在", size=34, weight=700, fill="#FFFFFF", family=title_font, anchor="middle"))
        parts.append(rounded_rect(58, 528, 274, 76, 22, p.panel, stroke=p.border))
        parts.append(svg_text(80, 560, "今天首次进入，需要完整确认后进入首页", size=14, weight=600, fill=p.muted, family=body_font))
        parts.append(svg_text(195, 666, "查看完整校验方式", size=15, weight=600, fill=p.primary, family=body_font, anchor="middle"))
    return phone_shell("".join(parts), scheme)


def draw_home(scheme: Scheme) -> str:
    p = scheme.palette
    title_font, body_font = scheme.fonts
    parts = [rounded_rect(31, 27, 328, 790, 34, p.bg)]
    if scheme.slug == "信笺秩序":
        parts.append(rounded_rect(52, 86, 286, 182, 30, p.primary))
        parts.append(svg_text(76, 130, "从注册那天起", size=13, weight=600, fill="#DCEAE5", family=body_font))
        parts.append(svg_text(76, 184, "第 127 天", size=42, weight=700, fill="#FFFFFF", family=title_font))
        parts.append(svg_text(76, 228, "今天也继续好好生活。", size=16, weight=500, fill="#EAF4F0", family=body_font))
        parts.append(svg_text(58, 304, "线下事项", size=15, weight=650, fill=p.muted, family=body_font))
        parts.append(rounded_rect(52, 326, 286, 118, 24, "#FBF8F1", stroke=p.border))
        parts.append(svg_text(72, 362, "联系姐姐处理宠物", size=20, weight=650, fill=p.ink, family=title_font))
        parts.append(svg_text(72, 392, "告知宠物安排、钥匙位置与医院联系方式", size=13, fill=p.muted, family=body_font))
        parts.append(ribbon_corner(284, 326, p.tag_death_bg, p.danger))
        parts.append(svg_text(308, 416, "›", size=22, weight=700, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(svg_text(58, 482, "线上事项", size=15, weight=650, fill=p.muted, family=body_font))
        parts.append(rounded_rect(52, 504, 286, 118, 24, "#FBF8F1", stroke=p.border))
        parts.append(svg_text(72, 540, "执行博客静态备份脚本", size=20, weight=650, fill=p.ink, family=title_font))
        parts.append(svg_text(72, 570, "在触发后运行 Python 脚本导出静态站点备份", size=13, fill=p.muted, family=body_font))
        parts.append(ribbon_corner(284, 504, p.tag_missing_bg, p.primary))
        parts.append(svg_text(308, 594, "›", size=22, weight=700, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(rounded_rect(52, 656, 286, 58, 20, p.primary))
        parts.append(svg_text(195, 691, "新增事项", size=18, weight=700, fill="#FFFFFF", family=body_font, anchor="middle"))
        parts.append(svg_text(195, 756, "先了解怎么运作", size=15, weight=600, fill=p.primary, family=body_font, anchor="middle"))
    else:
        parts.append(rounded_rect(52, 86, 286, 152, 28, p.primary))
        parts.append(svg_text(76, 126, "当前正常", size=14, weight=650, fill="#D7E6DE", family=body_font))
        parts.append(svg_text(76, 178, "第 127 天", size=40, weight=700, fill="#FFFFFF", family=title_font))
        parts.append(svg_text(76, 208, "今天已完成申报", size=14, fill="#E6F0EB", family=body_font))
        parts.append(svg_text(58, 286, "线下事项", size=14, weight=650, fill=p.muted, family=body_font))
        parts.append(rounded_rect(52, 306, 286, 106, 22, p.panel, stroke=p.border))
        parts.append(svg_text(74, 342, "联系姐姐处理宠物", size=18, weight=650, fill=p.ink, family=title_font))
        parts.append(svg_text(74, 369, "告知宠物安排、钥匙位置与医院联系方式", size=13, fill=p.muted, family=body_font))
        parts.append(ribbon_corner(284, 306, p.tag_death_bg, p.danger))
        parts.append(svg_text(308, 391, "›", size=22, weight=700, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(svg_text(58, 448, "线上事项", size=14, weight=650, fill=p.muted, family=body_font))
        parts.append(rounded_rect(52, 468, 286, 106, 22, p.panel, stroke=p.border))
        parts.append(svg_text(74, 504, "执行博客静态备份脚本", size=18, weight=650, fill=p.ink, family=title_font))
        parts.append(svg_text(74, 531, "在触发后运行 Python 脚本导出静态站点备份", size=13, fill=p.muted, family=body_font))
        parts.append(ribbon_corner(284, 468, p.tag_missing_bg, p.primary))
        parts.append(svg_text(308, 553, "›", size=22, weight=700, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(rounded_rect(52, 620, 286, 56, 20, p.primary))
        parts.append(svg_text(195, 655, "新增事项", size=18, weight=700, fill="#FFFFFF", family=body_font, anchor="middle"))
        parts.append(rounded_rect(52, 692, 286, 44, 18, p.panel_alt))
        parts.append(svg_text(195, 719, "先了解怎么运作", size=15, weight=600, fill=p.primary, family=body_font, anchor="middle"))
    return phone_shell("".join(parts), scheme)


def draw_create(scheme: Scheme) -> str:
    p = scheme.palette
    title_font, body_font = scheme.fonts
    parts = [rounded_rect(31, 27, 328, 790, 34, p.bg)]
    parts.append(svg_text(58, 90, "新建事项", size=28, weight=700, fill=p.ink, family=title_font))
    if scheme.slug == "信笺秩序":
        parts.append(rounded_rect(58, 118, 126, 42, 20, p.primary))
        parts.append(svg_text(121, 144, "线下事项", size=15, weight=650, fill="#FFFFFF", family=body_font, anchor="middle"))
        parts.append(rounded_rect(174, 124, 116, 38, 18, p.panel, stroke=p.border))
        parts.append(svg_text(232, 148, "线上事项", size=14, weight=600, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(rounded_rect(58, 178, 274, 54, 18, p.accent, extra='fill-opacity="0.22"'))
        parts.append(svg_text(78, 210, "默认死亡 = 3 次未申报，可稍后调整", size=14, weight=600, fill=p.primary, family=body_font))
    else:
        parts.append(rounded_rect(58, 118, 274, 46, 20, p.panel_alt))
        parts.append(rounded_rect(60, 120, 132, 42, 18, p.primary))
        parts.append(svg_text(126, 146, "线下事项", size=15, weight=650, fill="#FFFFFF", family=body_font, anchor="middle"))
        parts.append(svg_text(258, 146, "线上事项", size=15, weight=650, fill=p.muted, family=body_font, anchor="middle"))
        parts.append(rounded_rect(58, 176, 274, 50, 18, p.panel, stroke=p.border))
        parts.append(svg_text(78, 206, "死亡 = 3 次未申报，创建后可修改", size=14, weight=600, fill=p.primary, family=body_font))

    sections = [
        ("协助人", "姐姐 · 手机 / 邮件"),
        ("处理说明", "请帮我联系宠物医院，并安排短期照护。"),
        ("事项标题", "联系姐姐处理宠物"),
        ("触发条件", "死亡"),
    ]
    start_y = 254
    for i, (label, value) in enumerate(sections):
        y = start_y + i * 108
        parts.append(rounded_rect(58, y, 274, 86, 22 if scheme.slug == "静默实用" else 24, "#FBF8F1" if scheme.slug == "信笺秩序" else p.panel, stroke=p.border))
        parts.append(svg_text(78, y + 28, label, size=13, weight=650, fill=p.muted, family=body_font))
        lines = "\n".join(chunk_text(value, 18)[:2])
        parts.append(svg_text(78, y + 56, lines, size=17, weight=600, fill=p.ink, family=title_font, line_height=22))
    parts.append(rounded_rect(58, 726, 274, 58, 20, p.primary))
    parts.append(svg_text(195, 761, "保存线下事项", size=18, weight=700, fill="#FFFFFF", family=body_font, anchor="middle"))
    return phone_shell("".join(parts), scheme)


SCREEN_BUILDERS = [
    ("01-欢迎页.svg", draw_welcome),
    ("02-申报页.svg", draw_report),
    ("03-首页.svg", draw_home),
    ("04-创建事项页.svg", draw_create),
]


def board_svg(scheme: Scheme, screen_svgs: list[str]) -> str:
    positions = [(130, 220), (710, 220), (130, 1130), (710, 1130)]
    board_w = 1400
    board_h = 2060
    title_font, body_font = scheme.fonts
    p = scheme.palette
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{board_w}" height="{board_h}" viewBox="0 0 {board_w} {board_h}">']
    parts.append(f'<rect width="{board_w}" height="{board_h}" fill="{scheme.board_bg}"/>')
    parts.append(svg_text(72, 86, f"{scheme.title} · 审查总览", size=44, weight=700, fill=p.ink, family=title_font))
    summary_lines = "\n".join(chunk_text(scheme.subtitle, 42))
    parts.append(svg_text(72, 132, summary_lines, size=18, fill=p.muted, family=body_font, line_height=28))
    parts.append(rounded_rect(998, 72, 330, 74, 26, p.panel, stroke=p.border))
    parts.append(svg_text(1163, 103, "安心 App 核心 4 屏", size=18, weight=650, fill=p.ink, family=title_font, anchor="middle"))
    parts.append(svg_text(1163, 130, "欢迎 / 申报 / 首页(含事项) / 创建", size=13, fill=p.muted, family=body_font, anchor="middle"))
    labels = ["欢迎页", "申报页", "首页（含事项）", "创建事项页"]
    for (x, y), svg_path, label in zip(positions, screen_svgs, labels):
        rel = Path(svg_path).name
        parts.append(f'<g transform="translate({x},{y})"><image href="{escape(rel)}" width="{PHONE_W}" height="{PHONE_H}"/></g>')
        parts.append(svg_text(x + PHONE_W // 2, y - 24, label, size=18, weight=650, fill=p.ink, family=title_font, anchor="middle"))
    parts.append("</svg>")
    return "".join(parts)


def write_scheme_assets(scheme: Scheme) -> None:
    assets_dir = UI_DIR / scheme.slug / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    created_paths: list[str] = []
    for filename, builder in SCREEN_BUILDERS:
        svg = builder(scheme)
        path = assets_dir / filename
        path.write_text(svg, encoding="utf-8")
        created_paths.append(str(path))
    overview = board_svg(scheme, created_paths)
    (assets_dir / "总览.svg").write_text(overview, encoding="utf-8")


def main() -> None:
    schemes = [
        Scheme(
            slug="信笺秩序",
            title="方案 A｜信笺秩序",
            subtitle="品牌型方向。核心隐喻是被认真整理好的私人托付册，强调暖纸感、页签、留白与郑重感。",
            board_bg="#F3F1EB",
            fonts=("Songti SC, STSong, serif", "Arial Unicode MS, PingFang SC, sans-serif"),
            accent_style="paper",
            palette=Palette(
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
        ),
        Scheme(
            slug="静默实用",
            title="方案 B｜静默实用",
            subtitle="工具型方向。核心表达是安静、成熟、规则清楚的日常管理工具，不借助纸张与信件隐喻。",
            board_bg="#EFF5F7",
            fonts=("Arial Unicode MS, PingFang SC, sans-serif", "Arial Unicode MS, PingFang SC, sans-serif"),
            accent_style="product",
            palette=Palette(
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
        ),
    ]
    for scheme in schemes:
        write_scheme_assets(scheme)


if __name__ == "__main__":
    main()

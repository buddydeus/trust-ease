from __future__ import annotations

"""Generate scripted phone-frame PNG design previews for the current UI across supported locales."""

import json
import shutil
import subprocess
import tempfile
from pathlib import Path
from time import perf_counter
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "designs"

PHONE_W = 390
PHONE_H = 844
SCALE = 2

COLORS = {
    "page": "#F7FBFA",
    "card": "#FFFFFF",
    "border": "#DEEBE6",
    "muted": "#6F837D",
    "text": "#243F39",
    "accent": "#86B1A2",
    "accent_soft": "#EEF5F2",
    "offline_ribbon": "#DBEAE6",
    "online_ribbon": "#EADFDB",
}

LOCALES = ("zh-CN", "zh-TW", "en-US")

MESSAGES = {
    "zh-CN": {
        "home": {
            "statusLabel": "今日状态",
            "heroTitle": "今天也好好生活着",
            "streakLabel": "已连续平安记录",
            "reportButton": "查看本次确认",
            "itemsLabel": "事项",
            "helpersLabel": "协助人",
        },
        "my": {
            "title": "我的",
            "statusLabel": "当前状态",
            "statusValue": "今天已完成确认",
            "triggerStateTitle": "触发状态",
            "triggerStateSummary": "死亡：3 次未申报",
            "identityTitle": "身份与安全",
            "identitySummary": "实名、密码与恢复方式",
        },
        "report": {
            "streakTitle": "已申报 128 天",
            "body": "慢一点也没关系，\n今天也为自己报个平安。",
            "primaryButton": "我活着",
        },
        "items": {
            "title": "重要事项",
            "filterAll": "全部",
            "filterOffline": "线下事项",
            "itemOneTitle": "把宠物交给林杉照料",
            "itemOneMeta": "线下事项 · 协助人 1 位",
            "itemTwoTitle": "导出私有仓库备份脚本",
            "itemTwoMeta": "线上事项 · 自定义脚本",
            "hint": "向下滚动后继续查看其他事项",
        },
        "itemForm": {
            "title": "先写第一件事",
            "typeLabel": "事项类型",
            "offlineTitle": "线下事项",
            "offlineSummary": "交代给某个人处理",
            "onlineTitle": "线上事项",
            "onlineSummary": "触发后执行脚本",
            "stepLabel": "当前步骤",
            "stepValue": "选择协助人",
        },
        "triggerState": {
            "title": "触发状态",
            "currentLabel": "当前生效",
            "currentValue": "死亡 = 3 次未申报",
            "missingLabel": "失联状态",
            "missingToggle": "启用失联",
            "description": "连续未申报达到阈值后，才进入后续处理。",
        },
        "tabs": {
            "home": "首页",
            "items": "事项",
            "my": "我的",
        },
    },
    "zh-TW": {
        "home": {
            "statusLabel": "今日狀態",
            "heroTitle": "今天也好好生活著",
            "streakLabel": "已連續平安記錄",
            "reportButton": "查看本次確認",
            "itemsLabel": "事項",
            "helpersLabel": "協助人",
        },
        "my": {
            "title": "我的",
            "statusLabel": "當前狀態",
            "statusValue": "今天已完成確認",
            "triggerStateTitle": "觸發狀態",
            "triggerStateSummary": "死亡：3 次未申報",
            "identityTitle": "身份與安全",
            "identitySummary": "實名、密碼與恢復方式",
        },
        "report": {
            "streakTitle": "已申報 128 天",
            "body": "慢一點也沒關係，\n今天也為自己報個平安。",
            "primaryButton": "我活著",
        },
        "items": {
            "title": "重要事項",
            "filterAll": "全部",
            "filterOffline": "線下事項",
            "itemOneTitle": "把寵物交給林杉照料",
            "itemOneMeta": "線下事項 · 協助人 1 位",
            "itemTwoTitle": "導出私有倉庫備份腳本",
            "itemTwoMeta": "線上事項 · 自訂腳本",
            "hint": "向下捲動後繼續查看其他事項",
        },
        "itemForm": {
            "title": "先寫第一件事",
            "typeLabel": "事項類型",
            "offlineTitle": "線下事項",
            "offlineSummary": "交代給某個人處理",
            "onlineTitle": "線上事項",
            "onlineSummary": "觸發後執行腳本",
            "stepLabel": "當前步驟",
            "stepValue": "選擇協助人",
        },
        "triggerState": {
            "title": "觸發狀態",
            "currentLabel": "當前生效",
            "currentValue": "死亡 = 3 次未申報",
            "missingLabel": "失聯狀態",
            "missingToggle": "啟用失聯",
            "description": "連續未申報達到閾值後，才進入後續處理。",
        },
        "tabs": {
            "home": "首頁",
            "items": "事項",
            "my": "我的",
        },
    },
    "en-US": {
        "home": {
            "statusLabel": "Today",
            "heroTitle": "Still living well today",
            "streakLabel": "Safe check-ins in a row",
            "reportButton": "View this check-in",
            "itemsLabel": "Items",
            "helpersLabel": "Helpers",
        },
        "my": {
            "title": "My",
            "statusLabel": "Current status",
            "statusValue": "Checked in today",
            "triggerStateTitle": "Trigger status",
            "triggerStateSummary": "Death: 3 missed check-ins",
            "identityTitle": "Identity & Security",
            "identitySummary": "Identity, password, and recovery options",
        },
        "report": {
            "streakTitle": "Checked in for 128 days",
            "body": "No rush.\nCheck in safe for yourself today.",
            "primaryButton": "I'm alive",
        },
        "items": {
            "title": "Important Items",
            "filterAll": "All",
            "filterOffline": "Offline",
            "itemOneTitle": "Hand over pet care to Lin Shan",
            "itemOneMeta": "Offline item · 1 helper",
            "itemTwoTitle": "Export private repo backup script",
            "itemTwoMeta": "Online item · Custom script",
            "hint": "Scroll down to continue viewing other items",
        },
        "itemForm": {
            "title": "Start with the first item",
            "typeLabel": "Item type",
            "offlineTitle": "Offline item",
            "offlineSummary": "Ask someone to handle it",
            "onlineTitle": "Online item",
            "onlineSummary": "Run a script after trigger",
            "stepLabel": "Current step",
            "stepValue": "Choose a helper",
        },
        "triggerState": {
            "title": "Trigger status",
            "currentLabel": "Currently active",
            "currentValue": "Death = 3 missed check-ins",
            "missingLabel": "Missing status",
            "missingToggle": "Enable missing state",
            "description": "The follow-up flow starts only after the missed check-ins reach the threshold.",
        },
        "tabs": {
            "home": "Home",
            "items": "Items",
            "my": "My",
        },
    },
}


def log_stage(message: str) -> None:
    """Print a high-level export stage message."""
    print(f"[design] {message}", flush=True)


def log_file(action: str, path: Path, index: int | None = None, total: int | None = None) -> None:
    """Print per-file progress while rendering thumbnails."""
    prefix = f"[{index}/{total}] " if index is not None and total is not None else ""
    print(f"[design] {prefix}{action}: {path.relative_to(ROOT)}", flush=True)


def rect(x: int, y: int, w: int, h: int, r: int, fill: str, stroke: str | None = None, stroke_width: int = 1) -> str:
    extra = ""
    if stroke:
        extra = f' stroke="{stroke}" stroke-width="{stroke_width}"'
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{extra}/>'


def line(x1: int, y1: int, x2: int, y2: int, color: str, width: int = 1) -> str:
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>'


def circle(cx: int, cy: int, r: int, fill: str) -> str:
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>'


def outline_circle(cx: int, cy: int, r: int, stroke: str, width: int = 1) -> str:
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{stroke}" stroke-width="{width}"/>'


def path(d: str, stroke: str, width: int = 1, fill: str = "none") -> str:
    return f'<path d="{d}" stroke="{stroke}" stroke-width="{width}" fill="{fill}" stroke-linecap="round" stroke-linejoin="round"/>'


def text(
    x: int,
    y: int,
    value: str,
    *,
    size: int = 16,
    weight: int = 400,
    fill: str = COLORS["text"],
    anchor: str = "start",
    line_height: int | None = None,
) -> str:
    attrs = (
        f'x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" '
        f'fill="{fill}" text-anchor="{anchor}" '
        'font-family="PingFang SC, Helvetica Neue, Arial Unicode MS, sans-serif"'
    )
    lines = value.split("\n")
    if len(lines) == 1:
        return f"<text {attrs}>{escape(value)}</text>"
    lh = line_height or int(size * 1.45)
    tspans = [f'<tspan x="{x}" dy="0">{escape(lines[0])}</tspan>']
    for part in lines[1:]:
        tspans.append(f'<tspan x="{x}" dy="{lh}">{escape(part)}</tspan>')
    return f"<text {attrs}>{''.join(tspans)}</text>"


def phone_shell(inner: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{PHONE_W}" height="{PHONE_H}" viewBox="0 0 {PHONE_W} {PHONE_H}">'
        "<defs>"
        '<filter id="shadow" x="-20%" y="-20%" width="160%" height="160%">'
        '<feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity="0.12"/>'
        "</filter>"
        '<clipPath id="screenClip">'
        f'{rect(31, 27, 328, 790, 34, "#FFFFFF")}'
        "</clipPath>"
        "</defs>"
        f'{rect(18, 12, 354, 820, 42, "#1D1D1D")[:-2]} filter="url(#shadow)"/>'
        f'{rect(31, 27, 328, 790, 34, COLORS["page"])}'
        f'{rect(140, 40, 110, 20, 10, "#101010")}'
        f'<g clip-path="url(#screenClip)">{inner}</g></svg>'
    )


def content_card(x: int, y: int, w: int, h: int) -> str:
    return rect(x, y, w, h, 24, COLORS["card"], COLORS["border"])


def copy(locale: str, section: str) -> dict[str, str]:
    return MESSAGES[locale][section]


def fit_text(value: str, *, default: int, medium: int | None = None, small: int | None = None) -> int:
    length = len(value)
    if small is not None and length >= 28:
        return small
    if medium is not None and length >= 18:
        return medium
    return default


def tab_bar(active: str, locale: str) -> str:
    labels = copy(locale, "tabs")
    items = [("home", labels["home"]), ("items", labels["items"]), ("my", labels["my"])]
    base_y = 736
    parts = [rect(31, base_y, 328, 81, 0, "#FFFFFF"), line(31, base_y, 359, base_y, COLORS["border"], 1)]
    xs = [90, 195, 300]
    for x, (key, label) in zip(xs, items):
        fill = COLORS["accent"] if key == active else "#8EA09B"
        weight = 600 if key == active else 500
        parts.append(tab_icon(key, x, base_y + 21, fill))
        parts.append(text(x, base_y + 52, label, size=12, weight=weight, fill=fill, anchor="middle"))
    parts.append(rect(148, 803, 94, 5, 3, "#0F1413"))
    return "".join(parts)


def tab_icon(kind: str, x: int, y: int, color: str) -> str:
    if kind == "home":
        return "".join(
            [
                path(f"M {x-10} {y+1} L {x} {y-9} L {x+10} {y+1}", color, 2.5),
                path(f"M {x-7} {y+2} V {y+11} H {x+7} V {y+2}", color, 2.5),
            ]
        )
    if kind == "items":
        return "".join(
            [
                line(x - 9, y - 6, x + 9, y - 6, color, 2.5),
                line(x - 9, y, x + 9, y, color, 2.5),
                line(x - 9, y + 6, x + 9, y + 6, color, 2.5),
            ]
        )
    return "".join(
        [
            outline_circle(x, y - 2, 4.5, color, 2.5),
            path(f"M {x-9} {y+10} C {x-6} {y+4}, {x+6} {y+4}, {x+9} {y+10}", color, 2.5),
        ]
    )


def draw_report(locale: str) -> str:
    """Render the current `/report` page preview."""
    report = copy(locale, "report")
    title_size = fit_text(report["streakTitle"], default=18, medium=17, small=15)
    body_size = 18 if locale != "en-US" else 16
    button_size = fit_text(report["primaryButton"], default=24, medium=20, small=17)
    parts = [rect(31, 27, 328, 790, 34, "#F7F4EB")]
    parts.append(rect(53, 170, 284, 410, 30, "#F8F5EE", "#E5E8DD"))
    parts.append(circle(112, 238, 96, "#EAF2ED"))
    parts.append(circle(298, 254, 84, "#EDF4EF"))
    parts.append(circle(102, 530, 82, "#E5EFEB"))
    parts.append(circle(314, 544, 102, "#EAF3EF"))
    parts.append(path("M 70 508 C 106 470, 138 454, 176 448 C 210 442, 246 452, 318 500", "#D8E5E0", 2))
    parts.append(path("M 88 434 C 132 396, 168 382, 206 378 C 244 374, 276 388, 322 426", "#DDE8E3", 1.8))
    parts.append(path("M 120 304 C 156 278, 190 270, 228 270 C 262 270, 286 280, 314 300", "#DFEAE4", 1.6))
    parts.append(path("M 114 252 C 160 228, 206 224, 254 234 C 282 240, 304 252, 320 266", "#E3ECE7", 1.3))
    parts.append(text(195, 236, report["streakTitle"], size=title_size, weight=600, fill=COLORS["muted"], anchor="middle"))
    parts.append(text(195, 318, report["body"], size=body_size, weight=600, anchor="middle", line_height=26))
    parts.append(circle(195, 488, 82, COLORS["accent"]))
    parts.append(text(195, 498, report["primaryButton"], size=button_size, weight=700, fill="#FFFFFF", anchor="middle"))
    return phone_shell("".join(parts))


def draw_home(locale: str) -> str:
    home = copy(locale, "home")
    hero_size = fit_text(home["heroTitle"], default=27, medium=24, small=22)
    report_button_size = fit_text(home["reportButton"], default=15, medium=14, small=13)
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(content_card(53, 74, 284, 328))
    parts.append(text(71, 108, home["statusLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 150, home["heroTitle"], size=hero_size, weight=700))
    parts.append(rect(71, 214, 248, 114, 20, COLORS["accent_soft"]))
    parts.append(text(89, 244, home["streakLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(89, 294, "128", size=40, weight=700))
    parts.append(rect(71, 338, 248, 50, 18, COLORS["accent"]))
    parts.append(text(195, 369, home["reportButton"], size=report_button_size, weight=600, fill="#FFFFFF", anchor="middle"))
    parts.append(content_card(53, 410, 136, 110))
    parts.append(text(71, 444, home["itemsLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 488, "6", size=24, weight=700))
    parts.append(content_card(201, 410, 136, 110))
    parts.append(text(219, 444, home["helpersLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(219, 488, "3", size=24, weight=700))
    parts.append(tab_bar("home", locale))
    return phone_shell("".join(parts))


def draw_items(locale: str) -> str:
    items_copy = copy(locale, "items")
    title_size = fit_text(items_copy["title"], default=23, medium=21, small=19)
    filter_size = 12 if locale != "en-US" else 11
    card_title_size = 15 if locale != "en-US" else 14
    hint_size = 12 if locale != "en-US" else 11
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 106, items_copy["title"], size=title_size, weight=700))
    parts.append(circle(316, 98, 21, COLORS["accent"]))
    parts.append(text(316, 104, "+", size=22, weight=600, fill="#FFFFFF", anchor="middle"))
    parts.append(rect(53, 135, 68, 36, 18, COLORS["accent"]))
    parts.append(text(87, 158, items_copy["filterAll"], size=filter_size, fill="#FFFFFF", anchor="middle"))
    parts.append(rect(133, 135, 92, 36, 18, "#FFFFFF", COLORS["border"]))
    parts.append(text(179, 158, items_copy["filterOffline"], size=filter_size, fill="#466059", anchor="middle"))
    cards = [
        (194, items_copy["itemOneTitle"], items_copy["itemOneMeta"], COLORS["offline_ribbon"]),
        (318, items_copy["itemTwoTitle"], items_copy["itemTwoMeta"], COLORS["online_ribbon"]),
        (442, items_copy["itemOneTitle"], items_copy["itemOneMeta"], COLORS["offline_ribbon"]),
        (566, items_copy["itemTwoTitle"], items_copy["itemTwoMeta"], COLORS["online_ribbon"]),
    ]
    for y, title_value, sub, ribbon in cards:
        parts.append(content_card(53, y, 284, 104))
        parts.append(text(71, y + 34, title_value, size=card_title_size, weight=600))
        parts.append(text(71, y + 59, sub, size=11, fill="#6B817B"))
        parts.append(rect(309, y + 24, 10, 40, 5, ribbon))
    parts.append(text(195, 708, items_copy["hint"], size=hint_size, fill="#728680", anchor="middle"))
    parts.append(tab_bar("items", locale))
    return phone_shell("".join(parts))


def draw_new_item(locale: str) -> str:
    item_form = copy(locale, "itemForm")
    title_size = fit_text(item_form["title"], default=23, medium=21, small=19)
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 106, item_form["title"], size=title_size, weight=700))
    parts.append(content_card(53, 142, 284, 184))
    parts.append(text(71, 172, item_form["typeLabel"], size=12, fill="#6F837D"))
    parts.append(rect(71, 190, 116, 104, 24, COLORS["accent_soft"], COLORS["border"]))
    parts.append(text(89, 226, item_form["offlineTitle"], size=14, weight=600))
    parts.append(text(89, 249, item_form["offlineSummary"], size=11, fill="#73867F"))
    parts.append(content_card(199, 190, 120, 104))
    parts.append(text(217, 226, item_form["onlineTitle"], size=14, weight=600))
    parts.append(text(217, 249, item_form["onlineSummary"], size=11, fill="#73867F"))
    parts.append(content_card(53, 344, 284, 112))
    parts.append(text(71, 374, item_form["stepLabel"], size=12, fill="#6F837D"))
    parts.append(text(71, 408, item_form["stepValue"], size=15, weight=600))
    parts.append(content_card(53, 474, 284, 112))
    parts.append(text(71, 504, "下一步预览", size=12, fill="#6F837D"))
    parts.append(text(71, 538, "补充说明与触发条件", size=15, weight=600))
    return phone_shell("".join(parts))


def draw_my(locale: str) -> str:
    my = copy(locale, "my")
    identity_summary_size = 12 if locale != "en-US" else 11
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 106, my["title"], size=23, weight=700))
    parts.append(content_card(53, 142, 284, 104))
    parts.append(text(71, 176, my["statusLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 210, my["statusValue"], size=15, weight=600))
    parts.append(content_card(53, 264, 284, 98))
    parts.append(text(71, 298, my["triggerStateTitle"], size=15, weight=600))
    parts.append(text(71, 323, my["triggerStateSummary"], size=12, fill=COLORS["muted"]))
    parts.append(content_card(53, 380, 284, 98))
    parts.append(text(71, 414, my["identityTitle"], size=15, weight=600))
    parts.append(text(71, 439, my["identitySummary"], size=identity_summary_size, fill=COLORS["muted"]))
    parts.append(content_card(53, 496, 284, 98))
    parts.append(text(71, 530, "提醒与偏好", size=15, weight=600))
    parts.append(text(71, 555, "申报时间、通知方式与勿扰设置", size=12, fill=COLORS["muted"]))
    parts.append(tab_bar("my", locale))
    return phone_shell("".join(parts))


def draw_trigger_state(locale: str) -> str:
    trigger = copy(locale, "triggerState")
    value_size = 15 if locale != "en-US" else 14
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 106, trigger["title"], size=23, weight=700))
    parts.append(content_card(53, 142, 284, 104))
    parts.append(text(71, 176, trigger["currentLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 210, trigger["currentValue"], size=value_size, weight=600))
    parts.append(content_card(53, 264, 284, 126))
    parts.append(text(71, 298, trigger["missingLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 338, trigger["missingToggle"], size=15))
    parts.append(rect(273, 318, 46, 28, 14, COLORS["border"]))
    parts.append(circle(287, 332, 11, "#FFFFFF"))
    parts.append(content_card(53, 408, 284, 126))
    parts.append(text(71, 442, "触发说明", size=12, fill=COLORS["muted"]))
    parts.append(text(71, 476, trigger["description"], size=14 if locale != "en-US" else 13, line_height=22))
    return phone_shell("".join(parts))


def build_screens(locale: str) -> list[tuple[str, str]]:
    """Builds the exported screen set using the current in-app route semantics."""
    return [
        ("report.svg", draw_report(locale)),
        ("home.svg", draw_home(locale)),
        ("items.svg", draw_items(locale)),
        ("new-item.svg", draw_new_item(locale)),
        ("my.svg", draw_my(locale)),
        ("trigger-state.svg", draw_trigger_state(locale)),
    ]


def write_svg(directory: Path, filename: str, svg: str) -> Path:
    """Writes the intermediate SVG used as the PNG render source."""
    path = directory / filename
    path.write_text(svg, encoding="utf-8")
    return path


def write_jxa_script(path: Path, payload: dict[str, str | int]) -> None:
    script = """
ObjC.import('AppKit');
ObjC.import('WebKit');
ObjC.import('Foundation');

const payload = __PAYLOAD__;

function fileUrl(path) {
  return $.NSURL.fileURLWithPath($(path));
}

const frame = $.NSMakeRect(0, 0, payload.width, payload.height);
const styleMask = $.NSWindowStyleMaskBorderless;
const win = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(frame, styleMask, $.NSBackingStoreBuffered, false);
win.setOpaque(false);
win.setBackgroundColor($.NSColor.clearColor);

const webView = $.WKWebView.alloc.initWithFrame(frame);
win.setContentView(webView);
webView.loadFileURLAllowingReadAccessToURL(fileUrl(payload.input), fileUrl(payload.readAccess));

const deadline = Date.now() + 5000;
while (Date.now() < deadline) {
  $.NSRunLoop.currentRunLoop.runUntilDate($.NSDate.dateWithTimeIntervalSinceNow(0.05));
}

const rep = webView.bitmapImageRepForCachingDisplayInRect(frame);
webView.cacheDisplayInRectToBitmapImageRep(frame, rep);
const pngData = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));
pngData.writeToURLAtomically(fileUrl(payload.output), true);
"""
    script = script.replace("__PAYLOAD__", json.dumps(payload, ensure_ascii=False))
    path.write_text(script, encoding="utf-8")


def render_png(svg_path: Path, out_path: Path, workdir: Path) -> None:
    """Renders a single phone mockup PNG from the generated SVG using JXA/WebKit."""
    html_path = workdir / f"{svg_path.stem}.html"
    html_path.write_text(
        "\n".join(
            [
                "<!doctype html>",
                "<html>",
                '<body style="margin:0;background:#eef4f2;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;">',
                f'<img src="{svg_path.name}" style="width:{PHONE_W}px;height:{PHONE_H}px;display:block;" />',
                "</body>",
                "</html>",
            ]
        ),
        encoding="utf-8",
    )
    jxa_path = workdir / "render.jxa"
    write_jxa_script(
        jxa_path,
        {
            "input": str(html_path),
            "readAccess": str(workdir),
            "output": str(out_path),
            "width": PHONE_W,
            "height": PHONE_H,
        },
    )
    subprocess.run(
        ["osascript", "-l", "JavaScript", str(jxa_path)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if SCALE != 1:
        subprocess.run(
            [
                "sips",
                "-z",
                str(PHONE_H * SCALE),
                str(PHONE_W * SCALE),
                str(out_path),
                "--out",
                str(out_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def main() -> None:
    """Exports all localized scripted previews into the project-level `designs/` directory."""
    started_at = perf_counter()
    total_files = len(LOCALES) * len(build_screens(LOCALES[0]))

    log_stage(f"Starting thumbnail export to {OUT_DIR.relative_to(ROOT)}")
    if OUT_DIR.exists():
        log_stage(f"Cleaning output directory {OUT_DIR.relative_to(ROOT)}")
        shutil.rmtree(OUT_DIR)

    generated = 0
    with tempfile.TemporaryDirectory() as tmp_name:
        tmpdir = Path(tmp_name)
        for locale in LOCALES:
            log_stage(f"Preparing locale {locale}")
            png_dir = OUT_DIR / locale
            png_dir.mkdir(parents=True, exist_ok=True)
            svg_dir = tmpdir / locale
            svg_dir.mkdir(parents=True, exist_ok=True)
            screens = build_screens(locale)
            for filename, svg in screens:
                generated += 1
                svg_path = write_svg(svg_dir, filename, svg)
                png_path = png_dir / f"{svg_path.stem}.png"
                log_file("Rendering", png_path, generated, total_files)
                render_png(svg_path, png_path, svg_dir)

    elapsed = perf_counter() - started_at
    log_stage(f"Completed {total_files} thumbnails in {elapsed:.2f}s")


if __name__ == "__main__":
    main()

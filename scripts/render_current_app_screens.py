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
    "page": "#F6FAF8",
    "card": "#FFFFFF",
    "border": "#D8E7E2",
    "muted": "#667B76",
    "text": "#173B37",
    "body": "#2F4541",
    "accent": "#0A6B63",
    "accent_soft": "#EAF4F1",
    "offline_ribbon": "#2F8A67",
    "online_ribbon": "#9A6A2D",
}

LOCALES = ("zh-CN", "zh-TW", "en-US")

MESSAGES = {
    "zh-CN": {
        "home": {
            "statusLabel": "当前预案",
            "heroTitle": "安心托付",
            "heroBody": "重要事项先整理好，后续再一步步补充。",
            "dailyStatus": "今日已申报",
            "dailyTime": "最近申报 · 09:12",
            "offlineLabel": "线下线索",
            "onlineLabel": "线上说明",
            "readinessHeading": "本地准备",
            "readinessStatus": "可以做一次本地复核",
            "readinessNotice": "这只是本机上的准备摘要。",
        },
        "my": {
            "title": "我的",
            "statusLabel": "当前状态",
            "statusValue": "今天已完成确认",
            "triggerStateTitle": "触发状态",
            "triggerStateSummary": "本地预警与演练设置",
            "identityTitle": "身份与安全",
            "identitySummary": "实名、密码与恢复方式",
        },
        "report": {
            "brand": "安心",
            "status": "今日未申报",
            "eyebrow": "每日首次进入",
            "title": "今天先确认一次",
            "body": "只记录你的今日状态，不会触发任何执行。",
            "lastLabel": "上次申报",
            "lastValue": "昨天 21:08",
            "waitingLabel": "本次状态",
            "waitingValue": "等待确认",
            "primaryButton": "我今天平安",
            "secondaryButton": "先看预案",
            "footer": "可随时暂停或修改托付内容",
        },
        "items": {
            "title": "事项",
            "itemOneTitle": "医疗信息",
            "itemOneMeta": "过敏、常用药、就诊偏好",
            "itemTwoTitle": "重要文件",
            "itemTwoMeta": "证件位置和查找说明",
            "itemThreeTitle": "数字账号说明",
            "itemThreeMeta": "不保存明文密码",
            "kindOffline": "线下事项",
            "kindOnline": "线上事项",
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
            "previewLabel": "下一步预览",
            "previewSummary": "补充说明与触发条件",
        },
        "triggerState": {
            "title": "触发状态",
            "currentLabel": "当前生效",
            "currentValue": "连续未确认才进入预警",
            "missingLabel": "失联状态",
            "missingToggle": "启用失联",
            "description": "连续未申报达到阈值后，才进入后续处理。",
            "descriptionLabel": "触发说明",
        },
        "settings": {
            "preferencesTitle": "提醒与偏好",
            "preferencesSummary": "申报时间、通知方式与勿扰设置",
        },
        "tabs": {
            "home": "首页",
            "items": "事项",
            "my": "我的",
        },
    },
    "zh-TW": {
        "home": {
            "statusLabel": "目前預案",
            "heroTitle": "安心託付",
            "heroBody": "重要事項先整理好，之後再一步步補充。",
            "dailyStatus": "今日已申報",
            "dailyTime": "最近申報 · 09:12",
            "offlineLabel": "線下線索",
            "onlineLabel": "線上說明",
            "readinessHeading": "本地準備",
            "readinessStatus": "可以做一次本地複核",
            "readinessNotice": "這只是本機上的準備摘要。",
        },
        "my": {
            "title": "我的",
            "statusLabel": "當前狀態",
            "statusValue": "今天已完成確認",
            "triggerStateTitle": "觸發狀態",
            "triggerStateSummary": "本地預警與演練設定",
            "identityTitle": "身份與安全",
            "identitySummary": "實名、密碼與恢復方式",
        },
        "report": {
            "brand": "安心",
            "status": "今日未申報",
            "eyebrow": "每日首次進入",
            "title": "今天先確認一次",
            "body": "只記錄你的今日狀態，不會觸發任何執行。",
            "lastLabel": "上次申報",
            "lastValue": "昨天 21:08",
            "waitingLabel": "本次狀態",
            "waitingValue": "等待確認",
            "primaryButton": "我今天平安",
            "secondaryButton": "先看預案",
            "footer": "可隨時暫停或修改託付內容",
        },
        "items": {
            "title": "事項",
            "itemOneTitle": "醫療資訊",
            "itemOneMeta": "過敏、常用藥、就診偏好",
            "itemTwoTitle": "重要文件",
            "itemTwoMeta": "證件位置和查找說明",
            "itemThreeTitle": "數位帳號說明",
            "itemThreeMeta": "不保存明文密碼",
            "kindOffline": "線下事項",
            "kindOnline": "線上事項",
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
            "previewLabel": "下一步預覽",
            "previewSummary": "補充說明與觸發條件",
        },
        "triggerState": {
            "title": "觸發狀態",
            "currentLabel": "當前生效",
            "currentValue": "連續未確認才進入預警",
            "missingLabel": "失聯狀態",
            "missingToggle": "啟用失聯",
            "description": "連續未申報達到閾值後，才進入後續處理。",
            "descriptionLabel": "觸發說明",
        },
        "settings": {
            "preferencesTitle": "提醒與偏好",
            "preferencesSummary": "申報時間、通知方式與勿擾設定",
        },
        "tabs": {
            "home": "首頁",
            "items": "事項",
            "my": "我的",
        },
    },
    "en-US": {
        "home": {
            "statusLabel": "Current plan",
            "heroTitle": "Trusted handoff",
            "heroBody": "Keep the important things organized first, then add details step by step.",
            "dailyStatus": "Reported today",
            "dailyTime": "Last report · 09:12",
            "offlineLabel": "Offline clues",
            "onlineLabel": "Online notes",
            "readinessHeading": "Local readiness",
            "readinessStatus": "Ready for a local review",
            "readinessNotice": "This is a local advisory summary.",
        },
        "my": {
            "title": "My",
            "statusLabel": "Current status",
            "statusValue": "Checked in today",
            "triggerStateTitle": "Trigger status",
            "triggerStateSummary": "Local warning and rehearsal settings",
            "identityTitle": "Identity & Security",
            "identitySummary": "Identity, password, and recovery options",
        },
        "report": {
            "brand": "Anxin",
            "status": "Not reported today",
            "eyebrow": "First entry today",
            "title": "Confirm once today",
            "body": "This only records today's status. It will not trigger any execution.",
            "lastLabel": "Last report",
            "lastValue": "Yesterday 21:08",
            "waitingLabel": "This status",
            "waitingValue": "Waiting",
            "primaryButton": "I'm safe today",
            "secondaryButton": "View plan first",
            "footer": "You can pause or edit handoff details anytime",
        },
        "items": {
            "title": "Items",
            "itemOneTitle": "Medical info",
            "itemOneMeta": "Allergies, medications, care notes",
            "itemTwoTitle": "Important files",
            "itemTwoMeta": "Document location and lookup notes",
            "itemThreeTitle": "Account notes",
            "itemThreeMeta": "No plain-text passwords",
            "kindOffline": "Offline item",
            "kindOnline": "Online item",
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
            "previewLabel": "Next preview",
            "previewSummary": "Add notes and trigger conditions",
        },
        "triggerState": {
            "title": "Trigger status",
            "currentLabel": "Currently active",
            "currentValue": "Warning starts after repeated misses",
            "missingLabel": "Missing status",
            "missingToggle": "Enable missing state",
            "description": "The follow-up flow starts only after the missed check-ins reach the threshold.",
            "descriptionLabel": "Trigger notes",
        },
        "settings": {
            "preferencesTitle": "Reminders & preferences",
            "preferencesSummary": "Report time, notifications, and quiet hours",
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
    return rect(x, y, w, h, 8, COLORS["card"], COLORS["border"])


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
    title_size = fit_text(report["title"], default=30, medium=27, small=24)
    body_size = 16 if locale != "en-US" else 14
    button_size = fit_text(report["primaryButton"], default=16, medium=15, small=14)
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 102, report["brand"], size=22, weight=700))
    parts.append(rect(246, 80, 91, 32, 16, COLORS["accent_soft"]))
    parts.append(circle(260, 96, 4, COLORS["accent"]))
    parts.append(text(292, 101, report["status"], size=12, weight=700, fill=COLORS["accent"], anchor="middle"))
    parts.append(text(53, 206, report["eyebrow"], size=13, fill=COLORS["muted"]))
    parts.append(text(53, 250, report["title"], size=title_size, weight=700))
    parts.append(text(53, 302, report["body"], size=body_size, fill=COLORS["body"], line_height=24))
    parts.append(rect(53, 374, 284, 114, 8, COLORS["accent_soft"], COLORS["border"]))
    parts.append(text(72, 412, report["lastLabel"], size=13, fill=COLORS["muted"]))
    parts.append(text(319, 412, report["lastValue"], size=14, weight=700, anchor="end"))
    parts.append(text(72, 452, report["waitingLabel"], size=13, fill=COLORS["muted"]))
    parts.append(text(319, 452, report["waitingValue"], size=14, weight=700, anchor="end"))
    parts.append(rect(53, 650, 284, 54, 8, COLORS["accent"]))
    parts.append(text(195, 684, report["primaryButton"], size=button_size, weight=700, fill="#FFFFFF", anchor="middle"))
    parts.append(rect(53, 716, 284, 48, 8, COLORS["card"], COLORS["border"]))
    parts.append(text(195, 746, report["secondaryButton"], size=15, weight=700, fill=COLORS["accent"], anchor="middle"))
    parts.append(text(195, 800, report["footer"], size=11, fill=COLORS["muted"], anchor="middle"))
    return phone_shell("".join(parts))


def draw_home(locale: str) -> str:
    home = copy(locale, "home")
    hero_size = fit_text(home["heroTitle"], default=30, medium=27, small=24)
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(rect(53, 82, 284, 48, 8, COLORS["accent_soft"], COLORS["border"]))
    parts.append(circle(72, 106, 4, COLORS["offline_ribbon"]))
    parts.append(text(86, 111, home["dailyStatus"], size=14, weight=700))
    parts.append(text(319, 111, home["dailyTime"], size=11, fill=COLORS["muted"], anchor="end"))
    parts.append(content_card(53, 146, 284, 140))
    parts.append(text(71, 180, home["statusLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 224, home["heroTitle"], size=hero_size, weight=700))
    parts.append(text(71, 260, home["heroBody"], size=13, fill=COLORS["muted"], line_height=20))
    parts.append(content_card(53, 306, 136, 98))
    parts.append(text(71, 340, home["offlineLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 374, "3", size=24, weight=700, fill=COLORS["accent"]))
    parts.append(content_card(201, 306, 136, 98))
    parts.append(text(219, 340, home["onlineLabel"], size=12, fill=COLORS["muted"]))
    parts.append(text(219, 374, "3", size=24, weight=700, fill=COLORS["accent"]))
    parts.append(content_card(53, 424, 284, 116))
    parts.append(text(71, 458, home["readinessHeading"], size=12, fill=COLORS["muted"]))
    parts.append(text(71, 494, home["readinessStatus"], size=15, weight=700))
    parts.append(text(71, 520, home["readinessNotice"], size=12, fill=COLORS["muted"]))
    parts.append(tab_bar("home", locale))
    return phone_shell("".join(parts))


def draw_items(locale: str) -> str:
    items_copy = copy(locale, "items")
    title_size = fit_text(items_copy["title"], default=23, medium=21, small=19)
    card_title_size = 15 if locale != "en-US" else 14
    hint_size = 12 if locale != "en-US" else 11
    parts = [rect(31, 27, 328, 790, 34, COLORS["page"])]
    parts.append(text(53, 106, items_copy["title"], size=title_size, weight=700))
    parts.append(circle(316, 98, 21, COLORS["accent"]))
    parts.append(text(316, 104, "+", size=22, weight=600, fill="#FFFFFF", anchor="middle"))
    cards = [
        (154, items_copy["itemOneTitle"], items_copy["itemOneMeta"], items_copy["kindOffline"], COLORS["offline_ribbon"]),
        (278, items_copy["itemTwoTitle"], items_copy["itemTwoMeta"], items_copy["kindOffline"], COLORS["offline_ribbon"]),
        (402, items_copy["itemThreeTitle"], items_copy["itemThreeMeta"], items_copy["kindOnline"], COLORS["online_ribbon"]),
    ]
    for y, title_value, sub, kind_label, ribbon in cards:
        parts.append(content_card(53, y, 284, 104))
        parts.append(text(71, y + 34, title_value, size=card_title_size, weight=600))
        parts.append(rect(71, y + 48, 70, 24, 12, COLORS["accent_soft"]))
        parts.append(text(106, y + 64, kind_label, size=10, weight=700, fill=ribbon, anchor="middle"))
        parts.append(text(71, y + 90, sub, size=11, fill="#6B817B"))
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
    parts.append(text(71, 504, item_form["previewLabel"], size=12, fill="#6F837D"))
    parts.append(text(71, 538, item_form["previewSummary"], size=15, weight=600))
    return phone_shell("".join(parts))


def draw_my(locale: str) -> str:
    my = copy(locale, "my")
    settings = copy(locale, "settings")
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
    parts.append(text(71, 530, settings["preferencesTitle"], size=15, weight=600))
    parts.append(text(71, 555, settings["preferencesSummary"], size=12, fill=COLORS["muted"]))
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
    parts.append(text(71, 442, trigger["descriptionLabel"], size=12, fill=COLORS["muted"]))
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
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for locale in LOCALES:
        locale_dir = OUT_DIR / locale
        if locale_dir.exists():
            log_stage(f"Cleaning output directory {locale_dir.relative_to(ROOT)}")
            shutil.rmtree(locale_dir)

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

# anxin-mobile-app — mobile

**Preview file:** designs/previews/anxin-mobile-app-mobile.png
**Spec SSOT:** designs/specs/anxin-mobile-app.md

## Layout

390 x 844 single mobile home dashboard. The first viewport should communicate safety state, next action, and plan readiness.

Order:

1. Header: `首页`, small reassurance copy.
2. Signature flat sealed-plan card.
3. Next confirmation card.
4. Readiness checklist.
5. Two quick actions.
6. Bottom tabs.

## Modules

- Status flat plan card: seal band, `当前正常`, `不会因单次未响应直接执行`.
- Confirmation card: `下次确认 06.28`, primary action `完成确认`.
- Readiness checklist: `事项 3`, `文件 2`, `协助人 1`, `触发规则 已设置`.
- Quick actions: `创建预案`, `模拟演练`, plus `保险箱` as a small flat safe shortcut rather than a bottom tab.
- Bottom tabs: `首页`, `预案`, `执行`, `我的`.

## Visual details

- Use the final tokens from the spec.
- The flat sealed-plan card is the only strong signature element; other cards stay quiet.
- Text should be readable and fit all cards.
- Motion is not visible in static preview; imply sequence through the seal timeline and readiness chips.

## Image prompt

Use case: ui-mockup
Asset type: single mobile app home dashboard preview
Primary request: Create a high-fidelity 390 x 844 iOS mobile UI screen for a Chinese app named "安心". The app helps users create emergency entrusted plans for digital legacy, lost contact, important files, and helper execution. Show the Home dashboard as the first screen after setup. The signature element is a flat vector sealed-plan dossier/envelope card with a seal band that communicates plan status and trigger safety.
Scene/backdrop: one full mobile screen, no outside marketing layout, calm mist app background.
Subject: Home dashboard UI. Header "首页" with small copy "你的托付预案保持正常". Large flat sealed-plan card with "当前正常", "不会因单次未响应直接执行", "预案已生效 3/5". Next confirmation card with "下次确认 06.28" and button "完成确认". Readiness checklist with "事项 3", "文件 2", "协助人 1", "触发规则 已设置". Quick action cards "创建预案", "模拟演练", and a small shortcut "保险箱". Bottom tab bar with "首页", "预案", "执行", "我的".
Style/medium: polished modern React Native iOS app UI, soft card depth, accessible text, calm trust, flat dossier identity, professional and warm but not sentimental. Use clean vector UI shapes rather than realistic object rendering.
Composition/framing: 390 x 844, safe-area top and bottom, generous 20px side padding, stable card dimensions, no overlapping text.
Lighting/mood: quiet, reassuring, clear, orderly, controllable.
Color palette: #F3F8F7 background, #FFFEFA cards, #0A6B63 primary teal, #174842 deep teal, #1B2D3A ink text, #607078 muted text, #B7791F seal amber, #E7EFEC muted panel, #2F8A67 safe green, #8A2D2A risk only as tiny boundary marker.
Materials/textures: flat vector layered envelope/dossier silhouette, clean rounded component edges, file tab, seal band, very soft UI shadow. No realistic paper grain, no wax seal, no rope/string binding, no leather, no 3D book, no photographic envelope.
Text (verbatim): "首页", "你的托付预案保持正常", "当前正常", "不会因单次未响应直接执行", "预案已生效 3/5", "下次确认 06.28", "完成确认", "事项 3", "文件 2", "协助人 1", "触发规则 已设置", "创建预案", "模拟演练", "保险箱", "首页", "预案", "执行", "我的".
Constraints: Chinese text must fit within cards and buttons; use vector-style icons, no emoji icons; high contrast; touch-friendly 44pt controls; no hover-only affordances; no huge marketing hero; no dark funeral theme; no purple/blue gradient template. The dossier/envelope motif must be flat and component-like so it can be implemented in React Native with simple shapes.
Avoid: realistic book, realistic envelope, wax seal, rope/string binding, leather, heavy paper texture, photographic object edges, death imagery, candles, black-and-white mourning design, insurance sales dashboard, cybersecurity neon, generic SaaS cards, decorative orbs, bokeh, random numbers used as decoration.

"""MHRice 怪物页解析：把 section 里的表格读成「行 → 单元格文本」。
单元格里只保留英文与简中两种语言。"""
import re, html
from html.parser import HTMLParser

KEEP = {"en", "zh-CN"}

class _T(HTMLParser):
    def __init__(self):
        super().__init__(); self.tables = []; self.stack = []; self.skip = 0; self.cell = None; self.lang = []
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "span":
            l = a.get("lang"); self.lang.append(l)
            if "-cond" in (a.get("class") or "") and self.cell is not None: self.cell["text"].append(" | ")
            if l and l not in KEEP: self.skip += 1
        if tag == "table": self.stack.append([])
        elif tag == "tr" and self.stack: self.stack[-1].append([])
        elif tag in ("td", "th") and self.stack and self.stack[-1]:
            self.cell = {"text": [], "zh": None, "en": None, "rowspan": int(a.get("rowspan", 1) or 1)}
        elif tag == "br" and self.cell is not None: self.cell["text"].append(" / ")
        elif tag in ("div", "p", "li") and self.cell is not None: self.cell["text"].append(" | ")
    def handle_endtag(self, tag):
        if tag == "span" and self.lang:
            l = self.lang.pop()
            if l and l not in KEEP: self.skip -= 1
        if tag in ("td", "th") and self.cell is not None and self.stack and self.stack[-1]:
            c = self.cell; c["text"] = " ".join("".join(c["text"]).split()); self.stack[-1][-1].append(c); self.cell = None
        elif tag == "table" and self.stack: self.tables.append(self.stack.pop())
    def handle_data(self, d):
        if self.cell is None or self.skip: return
        self.cell["text"].append(d)
        cur = next((l for l in reversed(self.lang) if l), None)
        if cur == "zh-CN" and d.strip(): self.cell["zh"] = (self.cell["zh"] or "") + d.strip()
        if cur == "en" and d.strip(): self.cell["en"] = (self.cell["en"] or "") + d.strip()

def section(page, sid):
    i = page.find(f'<section id="{sid}"')
    if i < 0: return ""
    j = page.find("<section id=", i + 10)
    return page[i: j if j > 0 else len(page)]

def tables(fragment):
    p = _T(); p.feed(fragment); return p.tables

def names(page):
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1)
    g = lambda l: html.unescape((re.search(rf'lang="{l}"><span>([^<]+)', h1) or [None, ""])[1])
    return {"zh": g("zh-CN"), "en": g("en"), "ja": g("ja")}

def text(fragment):
    f = re.sub(r'<span class="(?:lang-default )?mh-lang" lang="(ja|fr|it|de|es|ru|pl|pt|ko|zh-TW|ar|es-419)">.*?</span></span>', "", fragment, flags=re.S)
    return html.unescape(" ".join(re.sub(r"<[^>]+>", " ", f).split()))

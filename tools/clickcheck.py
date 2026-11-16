"""点击审计：在 headless Chrome 里打开每个页面，逐个点击可交互元素，
检查点击后是否有变化（网址 / 页面内容 / 展开状态）。没变化 = 死按钮。
用法：python3 -I tools/clickcheck.py [routes...]"""
import json, os, subprocess, sys, time, urllib.request, tempfile
import websocket  # websocket-client

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROUTES = sys.argv[1:] or ["", "guide/lbg", "sources"] + [f"m/{m}/{p}" for m in ("em132_05", "em072_08")
          for p in ("", "map", "map?v=2d", "ammo", "phase/0", "phase/1", "formula", "builds", "status", "videos")] + ["m/em132_05/followers"]
PORT = 9333

AUDIT_JS = r"""
(async (route) => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const SEL = 'a[href], button, [data-part], summary, [role=button], select, input[type=checkbox], canvas#pmc';
  const snap = () => location.hash + '|' + document.querySelector('#main').innerHTML.length + '|' + document.querySelector('#main').innerHTML.slice(0, 4000)
      + '|' + [...document.querySelectorAll('details')].map(d => d.open ? 1 : 0).join('')
      + '|' + document.querySelector('#side').innerHTML + '|' + (document.activeElement && document.activeElement.id) + '|' + document.querySelector('#monMenu').hidden + '|' + document.body.className + '|' + (document.querySelector('#search') ? document.querySelector('#search').value : '');
  const reset = async () => { document.querySelector('#monMenu').hidden = true; document.body.classList.remove('drawer'); location.hash = '#/' + route; await sleep(80); history.replaceState(null, '', '#/' + route); };
  await reset();
  const n = document.querySelectorAll(SEL).length;
  const dead = [], skipped = [];
  for (let i = 0; i < n; i++) {
    await reset();
    const el = document.querySelectorAll(SEL)[i];
    if (!el) continue;
    const label = (el.tagName + ' ' + (el.textContent || el.getAttribute('href') || el.dataset.part || '').trim().replace(/\s+/g, ' ')).slice(0, 60);
    const href = el.getAttribute && el.getAttribute('href');
    if (href && /^https?:/.test(href)) { skipped.push(label); continue; }           // 外链
    if (el.getAttribute('aria-pressed') === 'true') { skipped.push(label); continue; }   // 已选中的切换按钮
    if (el.tagName === 'SELECT' || (el.tagName === 'INPUT')) { skipped.push(label); continue; } // 表单控件另测
    const before = snap();
    if (el.tagName === 'CANVAS') {   // 点在一个部位的中心（左上角是透明背景）
      const pm = (MHR.partmaps || {})[location.hash.split('/')[2]], r = el.getBoundingClientRect();
      const c = pm && Object.entries(pm.centers).find(([k]) => !document.querySelector('.hs.sel[data-part="' + k + '"]'));
      const [cx, cy] = c ? c[1] : [50, 50];
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + r.width * cx / 100, clientY: r.top + r.height * cy / 100 }));
    } else if (typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(120);
    const after = snap();
    // 指向当前页的链接（href 与当前路由相同）不算死按钮
    const same = href && href.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '') === route.split('?')[0].replace(/\/$/, '');
    if (before === after && !same) dead.push(label);
  }
  return { route, total: n, dead, skipped: skipped.length };
})
"""

def main():
    prof = tempfile.mkdtemp(prefix="mhr_cc_")
    proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", f"--remote-debugging-port={PORT}", f"--user-data-dir={prof}",
                             "--window-size=1440,1000", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")); break
            except Exception: time.sleep(0.2)
        ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=120)
        mid = [0]
        def call(method, **params):
            mid[0] += 1; ws.send(json.dumps({"id": mid[0], "method": method, "params": params}))
            while True:
                m = json.loads(ws.recv())
                if m.get("id") == mid[0]: return m
        url = "file://" + os.path.join(ROOT, "index.html")
        call("Page.enable"); call("Page.navigate", url=url + "#/"); time.sleep(1.5)
        bad = 0
        for r in ROUTES:
            res = call("Runtime.evaluate", expression=f"({AUDIT_JS})({json.dumps(r)})", awaitPromise=True, returnByValue=True)
            v = res["result"]["result"].get("value") or res
            if not isinstance(v, dict) or "dead" not in v:
                print("ERROR", r, json.dumps(v)[:300]); bad += 1; continue
            bad += len(v["dead"])
            print(f"#/{r:<12} 元素 {v['total']:>3}  死按钮 {len(v['dead'])}  (跳过外链/表单 {v['skipped']})")
            for d in v["dead"]: print("    ✕", d)
        print("RESULT:", "PASS" if bad == 0 else f"FAIL ({bad})")
        sys.exit(1 if bad else 0)
    finally:
        proc.terminate()

main()

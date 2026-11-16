"""手机端截图：用 DevTools 协议模拟 390×844 手机（headless 窗口有最小宽度，不能直接用 --window-size）。
用法：python3 -I tools/mobileshot.py out_dir route1 route2 ..."""
import base64, json, os, subprocess, sys, tempfile, time, urllib.request
import websocket
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
out, routes = sys.argv[1], sys.argv[2:]
os.makedirs(out, exist_ok=True)
PORT = 9334
proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", f"--remote-debugging-port={PORT}", f"--user-data-dir={tempfile.mkdtemp()}", "about:blank"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")); break
        except Exception: time.sleep(0.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
    n = [0]
    def call(m, **p):
        n[0] += 1; ws.send(json.dumps({"id": n[0], "method": m, "params": p}))
        while True:
            r = json.loads(ws.recv())
            if r.get("id") == n[0]: return r
    call("Emulation.setDeviceMetricsOverride", width=390, height=844, deviceScaleFactor=2, mobile=True)
    call("Emulation.setTouchEmulationEnabled", enabled=True)
    base = "file://" + os.path.join(ROOT, "index.html")
    for r in routes:
        call("Page.navigate", url=base + "#/" + r); time.sleep(1.6)
        sw = call("Runtime.evaluate", expression="[document.documentElement.scrollWidth, innerWidth]", returnByValue=True)["result"]["result"]["value"]
        png = call("Page.captureScreenshot", format="png")["result"]["data"]
        name = (r or "lib").replace("/", "_").replace("?", "_").replace("=", "_")
        open(os.path.join(out, name + ".png"), "wb").write(base64.b64decode(png))
        print(f"{r or '#/'}: scrollWidth={sw[0]} innerWidth={sw[1]} {'OVERFLOW' if sw[0] > sw[1] else 'ok'}")
finally:
    proc.terminate()

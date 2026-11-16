import sys, re, json, urllib.request, urllib.parse
q = sys.argv[1]
import subprocess
url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote(q) + "&hl=zh-CN"
html = subprocess.run(["curl","-sL","-A","Mozilla/5.0 (Macintosh)","-H","Accept-Language: zh-CN,zh;q=0.9",url],capture_output=True).stdout.decode("utf-8","ignore")
m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
data = json.loads(m.group(1))
out = []
def walk(o):
    if isinstance(o, dict):
        if "videoRenderer" in o:
            v = o["videoRenderer"]
            t = "".join(r.get("text", "") for r in v.get("title", {}).get("runs", []))
            ch = "".join(r.get("text", "") for r in v.get("ownerText", {}).get("runs", []))
            ln = v.get("lengthText", {}).get("simpleText", "")
            vc = v.get("viewCountText", {}).get("simpleText", "")
            pt = v.get("publishedTimeText", {}).get("simpleText", "")
            out.append((v["videoId"], t, ch, ln, vc, pt))
        for x in o.values(): walk(x)
    elif isinstance(o, list):
        for x in o: walk(x)
walk(data)
for r in out[:int(sys.argv[2]) if len(sys.argv) > 2 else 12]:
    print(" | ".join(r))

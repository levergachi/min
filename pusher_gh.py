# -*- coding: utf-8 -*-
"""
원복 객장 시세 송신기 (GitHub Actions 에서 자동 실행)
- 야후 파이낸스(yfinance)로 프리장·애프터장 포함 최신가를 받아 Firebase 에 올립니다.
- 진짜 지수(나스닥·코스피·필라델피아 반도체), 원/달러, 미국 10년물 금리, 비트코인, 히트맵 종목, 차트 기록.
- 미국 정규장에는 미국 종목은 사이트의 Finnhub(15초 실시간)가 맡고, 이 송신기는 지수·환율·차트만 올립니다.
"""
import time, json, math, re, datetime as dt, requests, xml.etree.ElementTree as ET_XML
from zoneinfo import ZoneInfo
import yfinance as yf

API_KEY = "AIzaSyDQm1IcdcjItUlOufrY7jpkkU7In3bWzJY"   # 공개용 웹 키(사이트 config.js 와 같음)
DB = "https://wonbok-gaekjang-default-rtdb.asia-southeast1.firebasedatabase.app"
RUN_SEC = 19 * 60      # 한 번 실행에 최대 19분 (10분마다 새로 켜지고, 새 실행이 이전 실행을 이어받음)
QUOTE_EVERY = 45       # 시세 갱신 간격(초)
HIST_EVERY = 5 * 60    # 차트 기록 갱신 간격(초)
T0 = 1767225600000     # 차트 분 단위 기준 (2026-01-01, 사이트와 같음)
ET, KST = ZoneInfo("America/New_York"), ZoneInfo("Asia/Seoul")

# 사이트 키 → 야후 심볼
PRICES = {"KORU": "KORU", "SOXL": "SOXL", "NASDAQ": "^IXIC", "KOSPI": "^KS11", "SOX": "^SOX", "USDKRW": "KRW=X"}
HEAT = ["NVDA","MSFT","AAPL","AVGO","ORCL","PLTR","AMD","CSCO","IBM","CRM","MU","ADBE","QCOM","TXN","INTU","NOW","AMAT","LRCX","KLAC","ADI","ARM","INTC","ANET","PANW","CRWD","MRVL","DELL","SMCI","GOOGL","META","NFLX","TMUS","DIS","T","VZ","AMZN","TSLA","HD","MCD","BKNG","NKE","SBUX","JPM","V","MA","BAC","WFC","GS","MS","AXP","BLK","COIN","LLY","JNJ","ABBV","UNH","MRK","TMO","ISRG","PFE","WMT","COST","PG","KO","PEP","PM","GE","CAT","RTX","UBER","HON","BA","ETN","VRT","XOM","CVX","CEG","VST","NEE","TSM","ASML"]
XQ = {s: s for s in HEAT}; XQ.update({"BTC": "BTC-USD", "TNX": "^TNX", "IEF": "IEF"})
# v16: 리포트 센터용 지수·지표
XQ.update({"SPX": "^GSPC", "DJI": "^DJI", "RUT": "^RUT", "VIX": "^VIX", "KOSDAQ": "^KQ11", "KOSPI": "^KS11", "NDX": "^NDX", "SOX": "^SOX", "DXY": "DX-Y.NYB", "WTI": "CL=F", "GOLD": "GC=F", "USDKRW": "KRW=X", "ETH": "ETH-USD", "SPY": "SPY", "QQQ": "QQQ", "SOXL": "SOXL", "KORU": "KORU", "TQQQ": "TQQQ"})
# v16: 한국 대형주(국장 히트맵) — 키는 KS/KQ + 종목코드
KR = ["005930","000660","373220","207940","005380","000270","068270","005490","035420","035720","105560","055550","012330","051910","006400","028260","003670","066570","096770","034020","012450","329180","009540","086790","015760","017670","032830","010130","011200","259960","042700","323410","000810","064350","010140","042660","003550","034730","018260","316140"]
KQ = ["247540","086520","196170","028300","058470","263750","293490","357780"]
for c in KR: XQ["KS" + c] = c + ".KS"
for c in KQ: XQ["KQ" + c] = c + ".KQ"
HIST = {"KORU": "KORU", "SOXL": "SOXL", "NASDAQ": "^IXIC", "TNX": "^TNX", "BTC": "BTC-USD"}
US_STOCKS = set(HEAT) | {"KORU", "SOXL", "IEF"}
HEAT_SET = set(HEAT) | {"IEF"}
TZ = {"^KS11": KST, "^KQ11": KST}
def tz_of(sym): return KST if sym.endswith((".KS", ".KQ")) or sym in ("^KS11", "^KQ11") else TZ.get(sym, ET)

def session():
    n = dt.datetime.now(ET); m = n.hour * 60 + n.minute
    if n.weekday() >= 5: return "closed"
    if 4 * 60 <= m < 570: return "pre"
    if 570 <= m < 960: return "regular"
    if 960 <= m < 1200: return "after"
    return "overnight"

class FB:
    def __init__(self): self.tok, self.exp = None, 0
    def token(self):
        if not self.tok or time.time() > self.exp:
            r = requests.post(f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}", json={"returnSecureToken": True}, timeout=20)
            r.raise_for_status(); j = r.json(); self.tok = j["idToken"]; self.exp = time.time() + int(j.get("expiresIn", 3600)) - 120
        return self.tok
    def get(self, path):
        try:
            r = requests.get(f"{DB}/{path}.json", params={"auth": self.token()}, timeout=20)
            return r.json() if r.status_code == 200 else None
        except Exception: return None
    def patch(self, data):
        if not data: return
        r = requests.patch(f"{DB}/.json", params={"auth": self.token()}, data=json.dumps(data), timeout=30)
        if r.status_code != 200: print("DB 오류", r.status_code, r.text[:300])
        else: print("DB 기록", len(data), "건")

def col(df, sym, field):
    try:
        if hasattr(df.columns, "levels") and sym in df.columns.get_level_values(0): s = df[sym][field]
        else: s = df[field]
        return s.dropna()
    except Exception:
        return None

def prev_close(daily, sym):
    s = col(daily, sym, "Close")
    if s is None or s.empty: return None
    tz = tz_of(sym); today = dt.datetime.now(tz).date()
    last = s.index[-1].date() if hasattr(s.index[-1], "date") else s.index[-1]
    if last == today and len(s) > 1: return float(s.iloc[-2])
    return float(s.iloc[-1])

def r6(x): return float(f"{x:.6g}") if x < 1000 else round(x, 2)

def fetch_daily(syms):
    return yf.download(syms, period="10d", interval="1d", prepost=False, group_by="ticker", progress=False, auto_adjust=False, threads=True)

REQ = {}   # 사이트 이용자가 요청한 '내 종목' (키 → 야후 심볼)
def key_to_sym(k):
    if re.fullmatch(r"KS[0-9A-Z]{6}", k): return k[2:] + ".KS"
    if re.fullmatch(r"KQ[0-9A-Z]{6}", k): return k[2:] + ".KQ"
    if re.fullmatch(r"[A-Z][A-Z0-9]{0,6}", k): return k
    return None
def load_requests(fb):
    d = fb.get("mkt/req") or {}; now = time.time() * 1000; out = {}
    for k, ts in sorted(d.items(), key=lambda kv: -(kv[1] or 0) if isinstance(kv[1], (int, float)) else 0)[:120]:
        if isinstance(ts, (int, float)) and now - ts < 3 * 86400000 and k not in XQ:
            sym = key_to_sym(k)
            if sym: out[k] = sym
    return out

def quotes(fb, pcs):
    ses = session(); now_ms = int(time.time() * 1000)
    want = dict(PRICES); want.update({"x_" + k: v for k, v in XQ.items()}); want.update({"x_" + k: v for k, v in REQ.items()})
    syms = sorted(set(want.values()))
    df = yf.download(syms, period="2d", interval="1m", prepost=True, group_by="ticker", progress=False, auto_adjust=False, threads=True)
    up = {}
    for key, sym in want.items():
        is_x = key.startswith("x_"); k = key[2:] if is_x else key
        if ses == "regular" and ((not is_x and k in US_STOCKS) or (is_x and k in HEAT_SET)): continue      # 정규장: 사이트 Finnhub 가 실시간 처리
        s = col(df, sym, "Close")
        if s is None or s.empty: continue
        p = float(s.iloc[-1]); ts = int(s.index[-1].timestamp() * 1000)
        if not (p > 0) or math.isnan(p): continue
        pc = pcs.get(sym)
        row = {"p": r6(p), "ts": ts, "src": "pusher", "wt": now_ms}
        if pc and pc > 0: row["pc"] = r6(pc)
        up[("mkt/q/" if is_x else "prices/") + k] = row
    fb.patch(up)

def history(fb):
    syms = sorted(set(HIST.values()))
    df = yf.download(syms, period="2d", interval="5m", prepost=True, group_by="ticker", progress=False, auto_adjust=False, threads=True)
    up = {}
    for k, sym in HIST.items():
        s = col(df, sym, "Close")
        if s is None or s.empty: continue
        s = s.iloc[-230:]
        pts = []
        for t, v in s.items():
            m = int((t.timestamp() * 1000 - T0) // 60000); v = float(v)
            if v > 0 and not math.isnan(v): pts.append(f"{m},{v:.1f}" if v >= 1000 else f"{m},{v:.3f}")
        st = ";".join(pts)
        while len(st) > 4900: pts = pts[10:]; st = ";".join(pts)
        if pts: up["mkt/h/" + k] = st
    fb.patch(up)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}
def fear_greed(fb):
    try:
        j = requests.get("https://production.dataviz.cnn.io/index/fearandgreed/graphdata", headers=UA, timeout=20).json()["fear_and_greed"]
        row = {"s": round(float(j["score"]), 1), "r": str(j.get("rating", ""))[:20], "ts": int(time.time() * 1000)}
        for a, b in (("pc", "previous_close"), ("w", "previous_1_week"), ("m", "previous_1_month"), ("y", "previous_1_year")):
            if j.get(b) is not None: row[a] = round(float(j[b]), 1)
        fb.patch({"mkt/fg": row})
    except Exception as e: print("공포탐욕 실패", repr(e)[:200])

def options(fb):
    up = {}
    for sym in ["SPY", "QQQ", "SOXL", "NVDA", "TSLA"]:
        try:
            t = yf.Ticker(sym); exps = t.options
            if not exps: continue
            exp = exps[0]; ch = t.option_chain(exp); c, p = ch.calls, ch.puts
            coi, poi = float(c["openInterest"].fillna(0).sum()), float(p["openInterest"].fillna(0).sum())
            strikes = sorted(set(c["strike"]).union(set(p["strike"])))
            def pain(k):
                return float(((k - c["strike"]).clip(lower=0) * c["openInterest"].fillna(0)).sum() + ((p["strike"] - k).clip(lower=0) * p["openInterest"].fillna(0)).sum())
            mp = min(strikes, key=pain) if strikes else None
            cw = float(c.loc[c["openInterest"].fillna(0).idxmax(), "strike"]) if len(c) else None
            pw = float(p.loc[p["openInterest"].fillna(0).idxmax(), "strike"]) if len(p) else None
            row = {"exp": exp, "pcr": round(poi / coi, 2) if coi > 0 else 0, "ts": int(time.time() * 1000)}
            if mp is not None: row["mp"] = float(mp)
            if cw is not None: row["cw"] = cw
            if pw is not None: row["pw"] = pw
            up["mkt/opt/" + sym] = row
        except Exception as e: print("옵션 실패", sym, repr(e)[:160])
    fb.patch(up)

def rss(url, n=10):
    out = []
    try:
        r = requests.get(url, headers=UA, timeout=20); root = ET_XML.fromstring(r.content)
        for it in root.iter("item"):
            t = (it.findtext("title") or "").strip(); u = (it.findtext("link") or "").strip(); src = (it.findtext("source") or "").strip()
            if " - " in t and not src: t, src = t.rsplit(" - ", 1)
            elif src and t.endswith(" - " + src): t = t[: -len(src) - 3]
            pd = it.findtext("pubDate") or ""
            try: ts = int(dt.datetime.strptime(pd[:25].strip(), "%a, %d %b %Y %H:%M:%S").replace(tzinfo=dt.timezone.utc).timestamp() * 1000)
            except Exception: ts = int(time.time() * 1000)
            if t and u.startswith("http"): out.append({"t": t[:140], "s": src[:30], "u": u[:400], "ts": ts})
            if len(out) >= n: break
    except Exception as e: print("뉴스 실패", url[:60], repr(e)[:160])
    return out

def news(fb):
    kr = rss("https://news.google.com/rss/search?q=%EC%A6%9D%EC%8B%9C+OR+%EC%BD%94%EC%8A%A4%ED%94%BC+OR+%EB%82%98%EC%8A%A4%EB%8B%A5+when:1d&hl=ko&gl=KR&ceid=KR:ko")
    us = rss("https://news.google.com/rss/search?q=stock+market+when:1d&hl=en-US&gl=US&ceid=US:en")
    if kr or us: fb.patch({"mkt/news": {"kr": kr, "us": us, "ts": int(time.time() * 1000)}})

def main():
    global REQ
    fb = FB(); t0 = time.time(); last_h = 0; last_daily = 0; pcs = {}; last_x = 0; last_req = 0
    while time.time() - t0 < RUN_SEC:
        try:
            if time.time() - last_req > 60:
                new = load_requests(fb); fresh = set(new) - set(REQ); REQ = new; last_req = time.time()
                if fresh: last_daily = 0; print("요청 종목", sorted(fresh)[:20])
            allsyms = sorted(set(list(PRICES.values()) + list(XQ.values()) + list(REQ.values())))
            if time.time() - last_daily > 30 * 60:
                d = fetch_daily(allsyms); pcs = {s: prev_close(d, s) for s in allsyms}; last_daily = time.time()
                print("전일종가", {k: v for k, v in list(pcs.items())[:6]})
            quotes(fb, pcs)
            if time.time() - last_h > HIST_EVERY: history(fb); last_h = time.time()
            if time.time() - last_x > 15 * 60:
                last_x = time.time(); fear_greed(fb); news(fb); options(fb)
        except Exception as e:
            print("오류:", repr(e)[:300])
        if session() == "closed": break   # 주말: 한 번만 갱신하고 종료(코인·환율용)
        time.sleep(QUOTE_EVERY)

if __name__ == "__main__":
    main()

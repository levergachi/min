# -*- coding: utf-8 -*-
"""
원복 객장 시세 송신기 (GitHub Actions 에서 자동 실행)
- 야후 파이낸스(yfinance)로 프리장·애프터장 포함 최신가를 받아 Firebase 에 올립니다.
- 진짜 지수(나스닥·코스피·필라델피아 반도체), 원/달러, 미국 10년물 금리, 비트코인, 히트맵 종목, 차트 기록.
- 미국 정규장에는 미국 종목은 사이트의 Finnhub(15초 실시간)가 맡고, 이 송신기는 지수·환율·차트만 올립니다.
"""
import time, json, math, datetime as dt, requests
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
HEAT = ["AAPL","MSFT","GOOGL","AMZN","META","TSLA","NFLX","NVDA","AVGO","TSM","ASML","AMD","MU","QCOM","TXN","ARM","INTC",
        "ORCL","PLTR","ANET","CEG","DELL","VRT","SMCI","JPM","V","MA","BAC","GS","LLY","WMT","XOM","COST","UNH","JNJ","KO"]
XQ = {s: s for s in HEAT}; XQ.update({"BTC": "BTC-USD", "TNX": "^TNX", "IEF": "IEF"})
HIST = {"KORU": "KORU", "SOXL": "SOXL", "NASDAQ": "^IXIC", "TNX": "^TNX", "BTC": "BTC-USD"}
US_STOCKS = set(HEAT) | {"KORU", "SOXL", "IEF"}
TZ = {"^KS11": KST}

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
    tz = TZ.get(sym, ET); today = dt.datetime.now(tz).date()
    last = s.index[-1].date() if hasattr(s.index[-1], "date") else s.index[-1]
    if last == today and len(s) > 1: return float(s.iloc[-2])
    return float(s.iloc[-1])

def r6(x): return float(f"{x:.6g}") if x < 1000 else round(x, 2)

def fetch_daily(syms):
    return yf.download(syms, period="10d", interval="1d", prepost=False, group_by="ticker", progress=False, auto_adjust=False, threads=True)

def quotes(fb, pcs):
    ses = session(); now_ms = int(time.time() * 1000)
    want = dict(PRICES); want.update({"x_" + k: v for k, v in XQ.items()})
    syms = sorted(set(want.values()))
    df = yf.download(syms, period="2d", interval="1m", prepost=True, group_by="ticker", progress=False, auto_adjust=False, threads=True)
    up = {}
    for key, sym in want.items():
        is_x = key.startswith("x_"); k = key[2:] if is_x else key
        if ses == "regular" and k in US_STOCKS: continue      # 정규장: 사이트 Finnhub 가 실시간 처리
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

def main():
    fb = FB(); t0 = time.time(); last_h = 0; last_daily = 0; pcs = {}
    allsyms = sorted(set(list(PRICES.values()) + list(XQ.values())))
    while time.time() - t0 < RUN_SEC:
        try:
            if time.time() - last_daily > 30 * 60:
                d = fetch_daily(allsyms); pcs = {s: prev_close(d, s) for s in allsyms}; last_daily = time.time()
                print("전일종가", {k: v for k, v in list(pcs.items())[:6]})
            quotes(fb, pcs)
            if time.time() - last_h > HIST_EVERY: history(fb); last_h = time.time()
        except Exception as e:
            print("오류:", repr(e)[:300])
        if session() == "closed": break   # 주말: 한 번만 갱신하고 종료(코인·환율용)
        time.sleep(QUOTE_EVERY)

if __name__ == "__main__":
    main()

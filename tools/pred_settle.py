# 🔮 원복 객장 '오늘의 예측' 자동 정산 (GitHub Actions에서 미국장 마감 뒤 실행)
#  - SOXL·KORU 의 정규장 종가를 전날 종가와 비교해 pred/{날짜}/res 에 결과를 씀
#  - 다음 거래일의 투표 마감(정규장 개장 시각)을 pred/{다음날짜}/dl 에 씀
#  - 방장 코드는 저장소 Secret(HOST_CODE)으로만 받음 — 코드에 적지 않음
import os, re, sys, time, datetime as dt
from zoneinfo import ZoneInfo
import requests, yfinance as yf

ET = ZoneInfo("America/New_York")
SYMS = ["SOXL", "KORU"]
HOL = {"2026-11-26", "2026-12-25", "2027-01-01", "2027-01-18", "2027-02-15", "2027-03-26", "2027-05-31", "2027-06-18", "2027-07-05", "2027-09-06", "2027-11-25", "2027-12-24"}

def cfg():
    s = open(os.path.join(os.path.dirname(__file__), "..", "config.js"), encoding="utf-8").read()
    k = re.search(r'apiKey:\s*"([^"]+)"', s).group(1); u = re.search(r'databaseURL:\s*"([^"]+)"', s).group(1)
    return k, u.rstrip("/")

def trade_day(d): return d.weekday() < 5 and d.isoformat() not in HOL

def main():
    code = os.environ.get("HOST_CODE", "").strip()
    if not code: print("HOST_CODE Secret이 없어요 — 저장소 Settings > Secrets 에 추가해 주세요"); sys.exit(1)
    key, db = cfg()
    j = requests.post(f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={key}", json={"returnSecureToken": True}, timeout=15).json()
    tok, uid = j["idToken"], j["localId"]; A = {"auth": tok}
    requests.put(f"{db}/hosts/{uid}.json", params=A, json={"code": code}, timeout=15).raise_for_status()
    try:
        last = None
        for s in SYMS:
            h = yf.Ticker(s).history(period="10d", interval="1d", auto_adjust=False)
            h = h.dropna(subset=["Close"])
            if len(h) < 2: print(s, "데이터 부족"); continue
            day = h.index[-1].tz_convert(ET).date() if h.index[-1].tzinfo else h.index[-1].date()
            now_et = dt.datetime.now(ET)
            if day == now_et.date() and now_et.hour < 16: print(s, "아직 장중 — 건너뜀"); continue
            c0, c1 = float(h["Close"].iloc[-2]), float(h["Close"].iloc[-1]); pct = (c1 / c0 - 1) * 100
            d = day.strftime("%Y%m%d"); last = day
            cur = requests.get(f"{db}/pred/{d}/res/{s}.json", params=A, timeout=15).json()
            if cur: print(s, d, "이미 정산됨", cur); continue
            res = {"r": "u" if pct >= 0 else "d", "c": round(pct, 2), "p": round(c1, 4), "ts": int(time.time() * 1000)}
            requests.put(f"{db}/pred/{d}/res/{s}.json", params=A, json=res, timeout=15).raise_for_status(); print(s, d, res)
        if last:
            n = last + dt.timedelta(days=1)
            while not trade_day(n): n += dt.timedelta(days=1)
            dl = int(dt.datetime(n.year, n.month, n.day, 9, 30, tzinfo=ET).timestamp() * 1000)
            requests.put(f"{db}/pred/{n.strftime('%Y%m%d')}/dl.json", params=A, json=dl, timeout=15).raise_for_status(); print("다음 마감", n, dl)
    finally:
        requests.delete(f"{db}/hosts/{uid}.json", params=A, timeout=15)

if __name__ == "__main__":
    main()

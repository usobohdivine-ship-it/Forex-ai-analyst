# Forex AI Analyst — complete starter prototype

This is a self-contained, installable web-app prototype. Open `index.html` in a browser.

## Included
- Dashboard
- Confluence-based chart analysis
- Candlestick/market-structure knowledge base
- Risk calculator
- CSV backtesting lab
- Mobile-friendly layout
- PWA manifest

## Important
This prototype does NOT contain live broker data, a live economic calendar, or automatic MT5 order execution. Those require external APIs/backend infrastructure and should be added only after testing.

It deliberately does not claim that any pattern or AI signal is always accurate. Forex is high risk and past performance does not guarantee future results.

## Suggested production architecture
Frontend: React/Next.js or Flutter
Backend: Python/FastAPI
Database: PostgreSQL
Market data: licensed real-time/historical FX feed
Economic calendar: licensed provider
Research: Python/pandas/numpy
Backtesting: event-driven engine with spread, commission, slippage and walk-forward testing
Broker integration: MT5/API, demo-first
Model layer: rules + statistical models + AI explanation layer

## Research principles
- Prevent look-ahead bias.
- Separate training/development and unseen test data.
- Use walk-forward/out-of-sample validation.
- Include spread, commission and slippage.
- Track drawdown, expectancy and profit factor—not win rate alone.
- Keep a no-trade state.
- Never expose a “guaranteed win” claim.

Official/current references consulted:
CFTC Forex Frauds: https://www.cftc.gov/LearnAndProtect/forexfrauds
CFTC Forex advisory: https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html
BIS backtesting framework: https://www.bis.org/committees/bcbs/basel_framework/standard/mar/99/inforce/2023-01-01/published/2020-03-27

const $=id=>document.getElementById(id);
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));$(b.dataset.tab).classList.add("active");b.classList.add("active")});

const KB=[
["Market structure","Study HH/HL and LH/LL, break of structure, failed breaks, trend and range conditions. Structure should be evaluated across multiple timeframes."],
["Candlesticks","Engulfing, pin bars, doji, hammer, shooting star, inside bars, morning/evening star and other formations are context signals—not guarantees."],
["Support/resistance","Use reaction zones rather than assuming a single exact price. Check whether a level has been respected and whether a breakout was accepted or rejected."],
["Trend filters","EMA/SMA relationships can help describe trend; ADX can describe trend strength; RSI/MACD can describe momentum. Avoid treating indicators as independent proof when they derive from the same price data."],
["Volatility","ATR and Bollinger Bands can help identify changing volatility and help place stops relative to market conditions."],
["Fundamentals","Interest rates, inflation, employment, GDP, PMI, central-bank communication and major geopolitical/economic events can move currencies."],
["News risk","High-impact events can cause spread widening, slippage and rapid price movement. The safest action can be no trade."],
["Risk management","Predefine maximum risk, stop loss, daily loss limit and exposure. Position sizing should follow the stop distance and account risk."],
["Backtesting","Include spread, commission and slippage assumptions. Separate development data from unseen test data and use walk-forward/out-of-sample checks."],
["Bias control","Never use future candles, future news or information unavailable at the time of the simulated trade. Record every rule and exception."],
["Psychology","A system should reduce impulsive decisions: predefined entries, exits, risk limits and a journal are more useful than chasing losses."],
["Execution","Real execution differs from historical candles because of spread, latency, liquidity and slippage. Demo results are not proof of live performance."]
];
$("knowledgeList").innerHTML=KB.map(x=>`<div class="kb"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");

function score(o){
 let s=0, reasons=[];
 if(o.trend!=="Range/unclear"){s+=15;reasons.push("Higher-timeframe direction is defined")}
 if(o.structure==="Break of structure"){s+=15;reasons.push("Structure break")}
 if(o.structure==="Retest"){s+=12;reasons.push("Retest condition")}
 if(o.candle==="Bullish engulfing"||o.candle==="Bearish engulfing"){s+=12;reasons.push("Engulfing confirmation")}
 if(o.candle==="Pin bar"){s+=9;reasons.push("Pin-bar confirmation")}
 if(o.location==="Strong support/resistance"){s+=15;reasons.push("Key level")}
 if(o.location==="Supply/demand"){s+=12;reasons.push("Supply/demand location")}
 if(o.momentum==="Strong"){s+=12;reasons.push("Strong momentum")}
 if(o.momentum==="Moderate"){s+=7;reasons.push("Moderate momentum")}
 if(o.rr==="1:3+"){s+=10;reasons.push("Attractive R:R")}
 if(o.rr==="1:2"){s+=8;reasons.push("Acceptable R:R")}
 if(o.rr==="<1:1.5"){s-=15;reasons.push("Poor R:R")}
 if(o.news==="High"){s-=30;reasons.push("High news risk")}
 if(o.news==="Medium"){s-=8;reasons.push("Medium news risk")}
 s=Math.max(0,Math.min(100,s));
 let action=s>=70?"CONFLUENCE SETUP":s>=50?"WAIT / NEED MORE CONFIRMATION":"NO TRADE";
 return {s,action,reasons};
}
function renderResult(el,pair,tf,r){
 const cls=r.s>=70?"good":r.s>=50?"warn":"bad";
 el.innerHTML=`<div class="score ${cls}">${r.s}/100</div><h3>${r.action}</h3><p><b>${pair}</b> · ${tf}</p><ul>${r.reasons.map(x=>`<li>${x}</li>`).join("")}</ul><p><b>Important:</b> this score is a rules-based checklist, not a probability of winning.</p>`;
}
function getForm(){
 return {pair:$("pair").value,tf:$("tf").value,trend:$("trend").value,structure:$("structure").value,candle:$("candle").value,location:$("location").value,momentum:$("momentum").value,news:$("news").value,rr:$("rr").value};
}
function analyzeForm(){let o=getForm(),r=score(o);renderResult($("analysisResult"),o.pair,o.tf,r)}
function runAnalysis(){
 $("pair").value=$("dashPair").value;$("tf").value=$("dashTf").value;
 let o=getForm(),r=score(o);renderResult($("dashResult"),o.pair,o.tf,r);
 document.querySelector('[data-tab="analyzer"]').click();
}
function calcRisk(){
 const b=+$("balance").value,r=+$("riskPct").value/100,sl=+$("slPips").value,pv=+$("pipValue").value;
 const money=b*r, lots=money/(sl*pv);
 $("riskResult").innerHTML=`Risk amount: <b>${money.toFixed(2)}</b><br>Approx. position size: <b>${lots.toFixed(3)} lots</b><br><small>Confirm pip value with your broker/instrument before trading. This calculator is educational.</small>`;
}
function parseCSV(text){
 const lines=text.trim().split(/\r?\n/); const head=lines.shift().split(",").map(x=>x.trim().toLowerCase());
 return lines.map(line=>{let a=line.split(",");let o={};head.forEach((h,i)=>o[h]=+a[i]||a[i]);return o}).filter(x=>[x.open,x.high,x.low,x.close].every(v=>typeof v==="number"&&!Number.isNaN(v)));
}
function ema(vals,p){let k=2/(p+1),out=[],e=vals[0];for(let i=0;i<vals.length;i++){e=i===0?vals[0]:vals[i]*k+e*(1-k);out.push(e)}return out}
function rsi(vals,p=14){let out=Array(vals.length).fill(null),g=0,l=0;for(let i=1;i<vals.length;i++){let d=vals[i]-vals[i-1];g=(g*(p-1)+Math.max(d,0))/p;l=(l*(p-1)+Math.max(-d,0))/p;if(i>=p)out[i]=l===0?100:100-(100/(1+g/l))}return out}
function backtest(){
 const f=$("csvFile").files[0]; if(!f){$("btResult").innerHTML='<span class="bad">Upload a CSV first.</span>';return}
 const reader=new FileReader(); reader.onload=()=>{
  const rows=parseCSV(reader.result); if(rows.length<100){$("btResult").innerHTML='<span class="bad">Need at least 100 valid OHLC rows.</span>';return}
  const c=rows.map(x=>x.close), e20=ema(c,20),e50=ema(c,50),rs=rsi(c), riskPct=+$("btRisk").value/100, rr=+$("btRR").value;
  let bal=+$("btBalance").value,trades=0,wins=0,losses=0,peak=bal,maxDD=0;
  for(let i=50;i<rows.length-1;i++){
   let long=e20[i]>e50[i]&&rs[i]>=50&&rs[i]<=70, short=e20[i]<e50[i]&&rs[i]<=50&&rs[i]>=30;
   if(!long&&!short)continue;
   let entry=c[i], stopDist=Math.max(Math.abs(c[i]-c[i-20]),entry*0.002);
   let risk=bal*riskPct, win=long?c[i+1]>entry+stopDist*rr:c[i+1]<entry-stopDist*rr;
   trades++;
   if(win){bal+=risk*rr;wins++;}else{bal-=risk;losses++}
   peak=Math.max(peak,bal);maxDD=Math.max(maxDD,(peak-bal)/peak);
  }
  const wr=trades?wins/trades*100:0;
  $("btResult").innerHTML=`Trades: <b>${trades}</b><br>Wins: <b>${wins}</b> · Losses: <b>${losses}</b><br>Historical win rate in this simplified simulation: <b>${wr.toFixed(1)}%</b><br>Ending balance: <b>${bal.toFixed(2)}</b><br>Max drawdown: <b>${(maxDD*100).toFixed(1)}%</b><br><small>This demo backtest uses next-candle outcome logic and does not model spread/slippage. Do not treat it as evidence of live profitability.</small>`;
 }; reader.readAsText(f);
}
$("dashPair").onchange=()=>{};

(function(){
  const power = document.getElementById('power');      // Watts
  const hours = document.getElementById('hours');      // Hours
  const intensity = document.getElementById('intensity'); // gCO2/kWh
  const out = document.getElementById('calcOut');
  const bars = document.getElementById('bars');

  if(!power || !hours || !intensity || !out) return;

  function fmt(n){ return Number(n).toLocaleString(undefined, {maximumFractionDigits: 2}); }

  function update(){
    const p = +power.value || 0;
    const h = +hours.value || 0;
    const gi = +intensity.value || 0; // grams CO2 per kWh

    const kWh = (p * h) / 1000.0;
    const gCO2 = kWh * gi;
    const kgCO2 = gCO2 / 1000.0;
    const trees = kgCO2 / 21.77; // rough yearly sequestration per tree (kg) — illustrative only
    out.innerHTML = `
      <div class="card">
        <h3 style="margin:0 0 8px">Estimated Impact</h3>
        <table class="table">
          <tr><th>Energy</th><td><strong>${fmt(kWh)}</strong> kWh</td></tr>
          <tr><th>Emissions</th><td><strong>${fmt(kgCO2)}</strong> kg CO₂</td></tr>
          <tr><th>Equivalent</th><td>≈ planting <strong>${fmt(trees)}</strong> trees for a year</td></tr>
        </table>
        <small class="kicker">Illustrative only — not for regulatory use.</small>
      </div>
    `;

    if(bars){
      const e = Math.min(100, kWh*10);
      const c = Math.min(100, kgCO2*2);
      bars.innerHTML = `
        <div style="display:grid;gap:10px">
          <div><small>Energy</small><div style="height:10px;border-radius:999px;background:rgba(148,163,184,0.2)"><div style="height:10px;border-radius:999px;background:linear-gradient(90deg,#0ea5e9,#22c55e);width:${e}%"></div></div></div>
          <div><small>CO₂</small><div style="height:10px;border-radius:999px;background:rgba(148,163,184,0.2)"><div style="height:10px;border-radius:999px;background:linear-gradient(90deg,#22c55e,#0ea5e9);width:${c}%"></div></div></div>
        </div>
      `;
    }
  }

  ['input','change'].forEach(evt => {
    power.addEventListener(evt, update);
    hours.addEventListener(evt, update);
    intensity.addEventListener(evt, update);
  });
  update();
})();

window.calculateTax = function () {
  const income = +document.getElementById("income").value;
  const spouse = document.getElementById("spouse").checked;
  const children = +document.getElementById("children").value || 0;
  const parents = +document.getElementById("parents").value || 0;
  const insurance = +document.getElementById("insurance").value || 0;
  const loan = +document.getElementById("loan").value || 0;
  const invest = +document.getElementById("invest").value || 0;
  const donate = +document.getElementById("donate").value || 0;

  const personal = 60000;
  const spouseDeduct = spouse ? 60000 : 0;
  const childrenDeduct = children * 30000;
  const parentDeduct = parents * 30000;
  const expense = income * 0.5;

  const totalDeduct = personal + spouseDeduct + childrenDeduct + parentDeduct + insurance + loan + invest + donate + expense;
  const taxable = Math.max(income - totalDeduct, 0);

  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 2000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 }
  ];

  let tax = 0;
  let remain = taxable;
  let breakdown = "";

  for (let b of brackets) {
    const amt = Math.min(b.limit, remain);
    const t = amt * b.rate;
    if (amt > 0) {
      breakdown += `<div>ช่วง ${amt.toLocaleString()} บาท x ${(b.rate * 100).toFixed(0)}% = ${t.toLocaleString()} บาท</div>`;
    }
    tax += t;
    remain -= amt;
    if (remain <= 0) break;
  }

  document.getElementById("result").innerHTML = `
    <h3>ผลการคำนวณ</h3>
    <p>รายได้สุทธิ: <strong>${taxable.toLocaleString()}</strong> บาท</p>
    <p>ภาษีที่ต้องจ่าย: <strong>${tax.toLocaleString()}</strong> บาท</p>
    <div>${breakdown}</div>
  `;
}

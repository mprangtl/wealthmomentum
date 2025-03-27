
import { useState } from "react";

export default function TaxCalculator() {
  const [income, setIncome] = useState(0);
  const personalDeduction = 60000;
  const [spouse, setSpouse] = useState(false);
  const [children, setChildren] = useState(0);
  const [parents, setParents] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [loanInterest, setLoanInterest] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [donation, setDonation] = useState(0);
  const [tax, setTax] = useState(null);
  const [summary, setSummary] = useState(null);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [advice, setAdvice] = useState("");

  const calculateTax = () => {
    const allowedExpenses = income * 0.5;

    const spouseDeduction = spouse ? 60000 : 0;
    const childrenDeduction = children * 30000;
    const parentsDeduction = parents * 30000;
    const totalDeduction =
      personalDeduction + spouseDeduction + childrenDeduction + parentsDeduction + insurance + loanInterest;

    const taxableIncome = Math.max(
      income - allowedExpenses - totalDeduction - investment - donation,
      0
    );

    let calculatedTax = 0;
    let remaining = taxableIncome;
    const breakdown = [];

    const brackets = [
      { limit: 150000, rate: 0 },
      { limit: 150000, rate: 0.05 },
      { limit: 200000, rate: 0.1 },
      { limit: 250000, rate: 0.15 },
      { limit: 250000, rate: 0.2 },
      { limit: 1000000, rate: 0.25 },
      { limit: 2000000, rate: 0.3 },
      { limit: Infinity, rate: 0.35 },
    ];

    for (let b of brackets) {
      const amt = Math.min(remaining, b.limit);
      const taxAmt = amt * b.rate;
      breakdown.push({ amount: amt, rate: b.rate, tax: taxAmt });
      calculatedTax += taxAmt;
      remaining -= amt;
      if (remaining <= 0) break;
    }

    setTax(calculatedTax);
    setTaxBreakdown(breakdown);
    setSummary({
      totalIncome: income,
      totalDeduction: totalDeduction + allowedExpenses + investment + donation,
      netIncome: taxableIncome,
    });

    let adviceMsg = [];
    if (investment < 100000) adviceMsg.push("📈 ควรพิจารณาลงทุนเพิ่มใน RMF/SSF เพื่อประหยัดภาษีได้มากขึ้น");
    if (donation < 100000) adviceMsg.push("❤️ สามารถบริจาคเพื่อการกุศลเพิ่มเติมเพื่อใช้สิทธิลดหย่อน");
    if (!spouse) adviceMsg.push("👩‍❤️‍👨 หากมีคู่สมรสไม่มีรายได้ สามารถใช้สิทธิลดหย่อนได้");
    if (insurance < 100000) adviceMsg.push("🏥 สามารถใช้สิทธิลดหย่อนจากเบี้ยประกันชีวิต/สุขภาพได้มากถึง 100,000 บาท");

    setAdvice(adviceMsg);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>คำนวณภาษีบุคคลธรรมดา</h1>
      <input type="number" placeholder="รายได้รวม" value={income} onChange={e => setIncome(+e.target.value)} />
      <div>
        <label>
          <input type="checkbox" checked={spouse} onChange={e => setSpouse(e.target.checked)} />
          คู่สมรสไม่มีรายได้
        </label>
      </div>
      <input type="number" placeholder="จำนวนบุตร" value={children} onChange={e => setChildren(+e.target.value)} />
      <input type="number" placeholder="จำนวนพ่อแม่" value={parents} onChange={e => setParents(+e.target.value)} />
      <input type="number" placeholder="ประกัน" value={insurance} onChange={e => setInsurance(+e.target.value)} />
      <input type="number" placeholder="ดอกเบี้ยบ้าน" value={loanInterest} onChange={e => setLoanInterest(+e.target.value)} />
      <input type="number" placeholder="ลงทุน RMF/SSF" value={investment} onChange={e => setInvestment(+e.target.value)} />
      <input type="number" placeholder="บริจาค" value={donation} onChange={e => setDonation(+e.target.value)} />
      <button onClick={calculateTax}>คำนวณภาษี</button>
      {tax !== null && (
        <div>
          <p>รายได้สุทธิ: {summary.netIncome.toLocaleString()} บาท</p>
          <p>ภาษีที่ต้องชำระ: {tax.toLocaleString()} บาท</p>
          <ul>
            {advice.map((tip, idx) => <li key={idx}>{tip}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

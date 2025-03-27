import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">โปรแกรมคำนวณภาษีบุคคลธรรมดา</h1>
      <Card className="mb-4">
        <CardContent className="grid gap-4 p-4">
          <div>
            <label>รายได้รวมทั้งปี (บาท)</label>
            <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={spouse} onChange={(e) => setSpouse(e.target.checked)} />
            <label>👩‍❤️‍👨 คู่สมรสไม่มีรายได้ (60,000 บาท)</label>
          </div>
          <div>
            <label>👶 จำนวนบุตร (คน)</label>
            <Input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value))} />
          </div>
          <div>
            <label>👵 จำนวนพ่อแม่ที่ดูแล (คน)</label>
            <Input type="number" value={parents} onChange={(e) => setParents(Number(e.target.value))} />
          </div>
          <div>
            <label>🏥 ประกันสุขภาพ / ประกันชีวิต (บาท)</label>
            <Input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} />
          </div>
          <div>
            <label>📚 ดอกเบี้ยบ้าน (บาท)</label>
            <Input type="number" value={loanInterest} onChange={(e) => setLoanInterest(Number(e.target.value))} />
          </div>
          <div>
            <label>การลงทุนลดหย่อน (RMF, SSF ฯลฯ)</label>
            <Input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
          </div>
          <div>
            <label>เงินบริจาค</label>
            <Input type="number" value={donation} onChange={(e) => setDonation(Number(e.target.value))} />
          </div>
          <Button onClick={calculateTax}>คำนวณภาษี</Button>
        </CardContent>
      </Card>

      {tax !== null && summary && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">สรุปผล</h2>
            <p>รายได้สุทธิหลังหักลดหย่อน: <span className="font-bold">{summary.netIncome.toLocaleString()} บาท</span></p>
            <p>ภาระภาษีที่ต้องชำระ: <span className="font-bold text-green-600">{tax.toLocaleString()} บาท</span></p>

            <h3 className="text-md font-semibold mt-4 mb-2">ตารางคำนวณภาษี</h3>
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ช่วงรายได้</th>
                  <th className="border px-2 py-1">อัตราภาษี</th>
                  <th className="border px-2 py-1">ภาษีที่คำนวณ</th>
                </tr>
              </thead>
              <tbody>
                {taxBreakdown.map((b, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{b.amount.toLocaleString()}</td>
                    <td className="border px-2 py-1">{(b.rate * 100).toFixed(0)}%</td>
                    <td className="border px-2 py-1">{b.tax.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {advice.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">💡 คำแนะนำเพิ่มเติม</h3>
                <div className="grid gap-2">
                  {advice.map((tip, idx) => (
                    <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow-sm">
                      <p className="text-sm text-yellow-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

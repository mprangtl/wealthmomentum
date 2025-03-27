
 document.getElementById("app").innerHTML = `
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
 `;

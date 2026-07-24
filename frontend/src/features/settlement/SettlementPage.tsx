import { useMemo, useState } from 'react'
import { Transaction, money, total } from '../shared/domain'
export function SettlementPage({ transactions }: { transactions: Transaction[] }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const rows = useMemo(
    () => transactions.filter((item) => (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate)),
    [transactions, startDate, endDate]
  )
  const incoming = total(rows, 'in'),
    outgoing = total(rows, 'out'),
    net = outgoing - incoming
  const companies = [...new Set(rows.map((item) => item.company))].map((name) => {
    const companyRows = rows.filter((item) => item.company === name)
    return { name, input: total(companyRows, 'in'), output: total(companyRows, 'out') }
  })
  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">SETTLEMENT REPORT</p>
          <h1>정산 리포트</h1>
          <p className="sub">입고, 출고 및 전체 금액을 기준으로 정산합니다.</p>
        </div>
        <button className="secondary" onClick={() => window.print()}>
          ↗ 리포트 인쇄
        </button>
      </header>
      <section className="settlement-filter panel">
        <div>
          <p className="eyebrow">PERIOD</p>
          <strong>정산 기간</strong>
        </div>
        <div className="date-filter">
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} aria-label="정산 시작일" />
          <span>~</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} aria-label="정산 종료일" />
        </div>
        <button className="secondary period-reset" onClick={() => { setStartDate(''); setEndDate('') }} disabled={!startDate && !endDate}>전체 기간</button>
      </section>
      <p className="settlement-summary">{startDate || endDate ? `${startDate || '처음'} ~ ${endDate || '오늘'} 기간의 거래 ${rows.length}건` : `전체 기간의 거래 ${rows.length}건`}</p>
      <section className="settle-hero">
        <div>
          <p>입고 총액</p>
          <strong>{money(incoming)}</strong>
          <span>상품 매입 금액</span>
        </div>
        <b>−</b>
        <div>
          <p>출고 총액</p>
          <strong>{money(outgoing)}</strong>
          <span>상품 판매 금액</span>
        </div>
        <b>=</b>
        <div className="net">
          <p>정산 차액</p>
          <strong>{money(net)}</strong>
          <span>{net >= 0 ? '흑자' : '적자'} 기준</span>
        </div>
      </section>
      <section className="report-grid">
        <article className="panel">
          <div className="panel-title">
            <h2>입출고 금액 비교</h2>
          </div>
          <div className="bar-area">
            <div>
              <span>입고</span>
              <i>
                <em style={{ width: '100%' }} />
              </i>
              <b>{money(incoming)}</b>
            </div>
            <div>
              <span>출고</span>
              <i>
                <em
                  className="out-bar"
                  style={{ width: `${incoming ? Math.min((outgoing / incoming) * 100, 100) : 0}%` }}
                />
              </i>
              <b>{money(outgoing)}</b>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="panel-title">
            <h2>회사별 정산</h2>
          </div>
          <div className="company-list">
            {companies.map((company) => (
              <div key={company.name}>
                <span>{company.name}</span>
                <small>
                  입고 {money(company.input)} · 출고 {money(company.output)}
                </small>
                <b>{money(company.output - company.input)}</b>
              </div>
            ))}
            {!companies.length && <p className="empty">선택한 기간에 거래 내역이 없습니다.</p>}
          </div>
        </article>
      </section>
    </main>
  )
}

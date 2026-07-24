import { useMemo, useState } from 'react'
import { Transaction, money, number, quantity } from '../shared/domain'
export function InventoryPage({ transactions }: { transactions: Transaction[] }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const filteredTransactions = useMemo(
    () => transactions.filter((item) => (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate)),
    [transactions, startDate, endDate]
  )
  const rows = new Map<
    string,
    { company: string; product: string; incoming: number; outgoing: number; value: number }
  >()
  filteredTransactions.forEach((item) => {
    const key = `${item.company}/${item.product}`
    const row = rows.get(key) || {
      company: item.company,
      product: item.product,
      incoming: 0,
      outgoing: 0,
      value: 0,
    }
    item.flow === 'in' ? (row.incoming += item.quantity) : (row.outgoing += item.quantity)
    if (item.flow === 'in') row.value += item.price * item.quantity
    rows.set(key, row)
  })
  const incoming = quantity(filteredTransactions, 'in'),
    outgoing = quantity(filteredTransactions, 'out')
  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">INVENTORY</p>
          <h1>재고 현황</h1>
          <p className="sub">제품별 현재 재고와 입출고 수량을 확인하세요.</p>
        </div>
      </header>
      <section className="settlement-filter panel">
        <div>
          <p className="eyebrow">PERIOD</p>
          <strong>재고 집계 기간</strong>
        </div>
        <div className="date-filter">
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} aria-label="재고 집계 시작일" />
          <span>~</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} aria-label="재고 집계 종료일" />
        </div>
        <button className="secondary period-reset" onClick={() => { setStartDate(''); setEndDate('') }} disabled={!startDate && !endDate}>전체 기간</button>
      </section>
      <p className="settlement-summary">{startDate || endDate ? `${startDate || '처음'} ~ ${endDate || '오늘'} 기간의 거래 ${filteredTransactions.length}건` : `전체 기간의 거래 ${filteredTransactions.length}건`}</p>
      <section className="cards">
        <article>
          <span className="icon green">↓</span>
          <div>
            <p>총 입고 수량</p>
            <strong>{number(incoming)}개</strong>
            <small>전체 제품 기준</small>
          </div>
        </article>
        <article>
          <span className="icon coral">↑</span>
          <div>
            <p>총 출고 수량</p>
            <strong>{number(outgoing)}개</strong>
            <small>전체 제품 기준</small>
          </div>
        </article>
        <article className="balance">
          <span className="icon purple">□</span>
          <div>
            <p>현재 총 재고</p>
            <strong>{number(incoming - outgoing)}개</strong>
            <small>입고 − 출고</small>
          </div>
        </article>
      </section>
      <section className="panel">
        <div className="panel-title">
          <h2>제품별 재고</h2>
          <span>{rows.size}개 품목</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>제품</th>
                <th>입고 회사</th>
                <th>입고 개수</th>
                <th>출고 개수</th>
                <th>총 재고량</th>
                <th>재고 원가</th>
              </tr>
            </thead>
            <tbody>
              {[...rows.values()].map((row) => (
                <tr key={`${row.company}/${row.product}`}>
                  <td className="product">{row.product}</td>
                  <td>{row.company}</td>
                  <td className="green-text">+{number(row.incoming)}개</td>
                  <td className="coral-text">-{number(row.outgoing)}개</td>
                  <td>
                    <b>{number(row.incoming - row.outgoing)}개</b>
                  </td>
                  <td>{money(row.value)}</td>
                </tr>
              ))}
              {!rows.size && <tr><td colSpan={6} className="empty">선택한 기간에 재고 변동 내역이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

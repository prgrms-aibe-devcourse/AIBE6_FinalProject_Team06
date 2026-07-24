import { ChangeEvent, useMemo, useState } from 'react'
import { Filter, Transaction, money, number, quantity, total } from '../shared/domain'

type Props = {
  transactions: Transaction[]
  filter: Filter
  setFilter: (filter: Filter) => void
  onAdd: (transaction: Transaction) => void
  onUpdate: (transaction: Transaction) => void
  onDelete: (id: number) => void
  companies: string[]
  products: string[]
}
export function LedgerPage({
  transactions,
  filter,
  setFilter,
  onAdd,
  onUpdate,
  onDelete,
  companies,
  products,
}: Props) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const rows = useMemo(
    () =>
      transactions.filter((item) => {
        const fields =
          filter.field === 'all'
            ? [item.company, item.product, item.member]
            : [item[filter.field as 'company' | 'product' | 'member']]
        return (
          (!filter.startDate || item.date >= filter.startDate) &&
          (!filter.endDate || item.date <= filter.endDate) &&
          (filter.flow === 'all' || item.flow === filter.flow) &&
          (!filter.keyword ||
            fields.some((value) => value.toLowerCase().includes(filter.keyword.toLowerCase())))
        )
      }),
    [transactions, filter]
  )
  const change =
    (key: keyof Filter) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFilter({ ...filter, [key]: event.target.value })
  const submit = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    let image = editing?.image || ''
    if (file)
      image = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const response = await fetch("http://localhost:8080/insert/ProductList", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flow: data.get('flow') as 'in' | 'out',
          company: data.get('company') as string,
          product: data.get('product') as string,
          quantity: Number(data.get('quantity')),
          image,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

   console.log(respData);

    const transaction: Transaction = {
      id: respData.id,
      date: respData.date,
      flow: respData.flow,
      company: respData.company,
      product: respData.product,
      member: respData.member,
      quantity: respData.quantity,
      price: respData.price,
      image,
    } 
    if (editing) onUpdate(transaction)
    else onAdd(transaction)
    closeModal()
    form.reset()
  }
  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    setFile(null)
  }
  const openCreateModal = () => {
    setEditing(null)
    setFile(null)
    setOpen(true)
  }
  const openEditModal = (transaction: Transaction) => {
    setEditing(transaction)
    setFile(null)
    setOpen(true)
  }
  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">STORE LEDGER</p>
          <h1>거래 내역</h1>
          <p className="sub">가게의 모든 입출고 내역을 관리하세요.</p>
        </div>
        <button className="primary" onClick={openCreateModal}>
          ＋ 새 거래 등록
        </button>
      </header>
      <section className="cards">
        <article>
          <span className="icon green">↓</span>
          <div>
            <p>총 입고 금액</p>
            <strong>{money(total(transactions, 'in'))}</strong>
            <small>입고 {number(quantity(transactions, 'in'))}개</small>
          </div>
        </article>
        <article>
          <span className="icon coral">↑</span>
          <div>
            <p>총 출고 금액</p>
            <strong>{money(total(transactions, 'out'))}</strong>
            <small>출고 {number(quantity(transactions, 'out'))}개</small>
          </div>
        </article>
        <article className="balance">
          <span className="icon purple">₩</span>
          <div>
            <p>입출고 차액</p>
            <strong>{money(total(transactions, 'out') - total(transactions, 'in'))}</strong>
            <small>출고 − 입고 기준</small>
          </div>
        </article>
      </section>
      <section className="panel">
        <div className="filters">
          <div className="search">
            <span>⌕</span>
            <input
              value={filter.keyword}
              onChange={change('keyword')}
              placeholder="회사, 제품, 회원 이름으로 검색"
            />
          </div>
          <select value={filter.field} onChange={change('field')}>
            <option value="all">전체 항목</option>
            <option value="company">회사별</option>
            <option value="product">제품별</option>
            <option value="member">회원 이름별</option>
          </select>
          <select value={filter.flow} onChange={change('flow')}>
            <option value="all">입출고 전체</option>
            <option value="in">입고만</option>
            <option value="out">출고만</option>
          </select>
          <div className="date-filter">
            <input type="date" value={filter.startDate} onChange={change('startDate')} />
            <span>~</span>
            <input type="date" value={filter.endDate} onChange={change('endDate')} />
          </div>
        </div>
        <TransactionTable rows={rows} onEdit={openEditModal} onDelete={onDelete} />
      </section>
      {open && (
        <div className="overlay">
          <form
            key={editing?.id || 'new'}
            className="modal"
            onSubmit={(event) => {
              event.preventDefault()
              void submit(event.currentTarget)
            }}
          >
            <div className="modal-head">
              <h2>{editing ? '거래 내역 수정' : '새 거래 등록'}</h2>
              <button type="button" onClick={closeModal} aria-label="닫기">
                ×
              </button>
            </div>
            <div className="type-switch">
              <label>
                <input type="radio" name="flow" value="in" defaultChecked={!editing || editing.flow === 'in'} />
                <span>↓ 입고</span>
              </label>
              <label>
                <input type="radio" name="flow" value="out" defaultChecked={editing?.flow === 'out'} />
                <span>↑ 출고</span>
              </label>
            </div>
            <div className="form-grid">
              <label>
                거래일
                <input name="date" type="date" defaultValue={editing?.date} required />
              </label>
              <label>
                회사명
                <input name="company" list="companies" defaultValue={editing?.company} required />
              </label>
              <label>
                제품명
                <select name="product" defaultValue={editing?.product} required>
                 {products ? products.map((product, index)=>{
                    return <option value={product}>{product}</option>;
                 }) : null};
                 </select>


              </label>
           
              <label>
                수량
                <input name="quantity" type="number" min="1" defaultValue={editing?.quantity} required />
              </label>
             
              <label className="photo">
                사진 첨부
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                <small>{file?.name || (editing?.image ? '기존 사진 유지' : '선택된 사진 없음')}</small>
              </label>
            </div>
            <datalist id="companies">
              {companies.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <datalist id="products">
              {products.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <button className="primary submit">{editing ? '수정 저장하기' : '거래 저장하기'}</button>
          </form>
        </div>
      )}
    </main>
  )
}
function TransactionTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>일자</th>
            <th>구분</th>
            <th>회사</th>
            <th>제품</th>
            <th>회원 이름</th>
            <th>수량</th>
            <th>단가</th>
            <th>합계</th>
            <th>사진</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>
                <span className={`badge ${item.flow}`}>
                  {item.flow === 'in' ? '↓ 입고' : '↑ 출고'}
                </span>
              </td>
              <td>{item.company}</td>
              <td className="product">{item.product}</td>
              <td>{item.member}</td>
              <td>{number(item.quantity)}개</td>
              <td>{money(item.price)}</td>
              <td className={`amount ${item.flow}`}>{money(item.quantity * item.price)}</td>
              <td>{item.image ? <img className="thumb" src={item.image} alt={`${item.product} 사진`} /> : '—'}</td>
              <td>
                <div className="transaction-actions">
                  <button type="button" className="edit-action" onClick={() => onEdit(item)}>
                    수정
                  </button>
                  <button
                    type="button"
                    className="delete-action"
                    onClick={() => {
                      if (window.confirm('이 거래 내역을 삭제할까요?')) onDelete(item.id)
                    }}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

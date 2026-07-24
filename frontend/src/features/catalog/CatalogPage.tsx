import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { CatalogInput, Company, Product, money, number } from '../shared/domain'

type Props = {
  kind: 'company' | 'product'
  items: Company[] | Product[]
  onAdd: (input: CatalogInput) => void
  onUpdate: (id: number, input: CatalogInput) => void
  onDelete: (id: number) => void
}

export function CatalogPage({ kind, items, onAdd, onUpdate, onDelete }: Props) {
  const isProduct = kind === 'product'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Company | Product | null>(null)
  const [editing, setEditing] = useState<Company | Product | null>(null)
  const filteredItems = useMemo(
    () => items.filter((item) => item?.name?.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query]
  )
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    onAdd({
      name: data.get('name')?.toString().trim() || '',
      productNumber: data.get('productNumber')?.toString().trim(),
      productType: data.get('productType')?.toString().trim(),
      companyNumber: data.get('companyNumber')?.toString().trim(),
      companyType: data.get('companyType')?.toString().trim(),
      stock: Number(data.get('stock') || 0),
      price: Number(data.get('price') || 0),
      image: data.get('image')?.toString() || undefined,
    })
    form.reset()
  }

  if (selected) {
    return <CatalogDetail item={selected} kind={kind} onBack={() => setSelected(null)} />
  }

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">{isProduct ? 'PRODUCT CATALOG' : 'COMPANY DIRECTORY'}</p>
          <h1>{isProduct ? '물품 등록' : '회사 등록'}</h1>
          <p className="sub">{isProduct ? '물품 정보와 사진, 초기 재고 및 가격을 등록해 관리하세요.' : '회사 정보와 거래처 분류를 등록해 관리하세요.'}</p>
        </div>
      </header>
      <section className="catalog-grid product-catalog-grid">
        <article className="panel catalog-form">
          <div className="panel-title"><h2>새 {isProduct ? '물품' : '회사'} 등록</h2></div>
          <form onSubmit={submit}>
            {isProduct ? <ProductFields /> : <CompanyFields />}
            <button className="primary">{isProduct ? '물품' : '회사'} 등록</button>
          </form>
        </article>
        <article className="panel catalog-list">
          <div className="panel-title">
            <h2>등록된 {isProduct ? '물품' : '회사'}</h2><span>{filteredItems.length}개</span>
          </div>
          <div className="catalog-search">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${isProduct ? '물품명' : '회사명'} 검색`} />
          </div>
          {isProduct ? <ProductTable items={filteredItems as Product[]} onSelect={setSelected} onEdit={setEditing} onDelete={onDelete} /> : <CompanyTable items={filteredItems as Company[]} onSelect={setSelected} onEdit={setEditing} onDelete={onDelete} />}
        </article>
      </section>
      {editing && <CatalogEditModal item={editing} kind={kind} onClose={() => setEditing(null)} onUpdate={onUpdate} />}
    </main>
  )
}

function ProductFields() {
  const [image, setImage] = useState('')
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }
  return <>
    <label>물품번호<input name="productNumber" placeholder="예: PRD-001" required /></label>
    <label>물품명<input name="name" placeholder="물품명을 입력하세요" required /></label>
    <label className="image-field">사진 추가
      <input type="file" accept="image/*" onChange={handleImage} />
      <input type="hidden" name="image" value={image} />
      <span className="image-upload">{image ? '사진 선택 완료' : '이미지 선택'}</span>
      {image && <img className="image-preview" src={image} alt="선택한 물품 미리보기" />}
    </label>
    <div className="catalog-number-fields">
      <label>초기 재고<input name="stock" type="number" min="0" defaultValue="0" required /></label>
      <label>가격<input name="price" type="number" min="0" defaultValue="0" required /></label>
    </div>
  </>
}

function CompanyFields() {
  return <>
    <label>회사번호<input name="companyNumber" placeholder="예: COM-001" required /></label>
    <label>회사명<input name="name" placeholder="회사명을 입력하세요" required /></label>
   
  </>
}

function CompanyTable({ items, onSelect, onEdit, onDelete }: { items: Company[]; onSelect: (item: Company) => void; onEdit: (item: Company) => void; onDelete: (id: number) => void }) {
  return <div className="table-wrap product-table"><table><thead><tr><th>회사번호</th><th>회사명</th><th>관리</th></tr></thead><tbody>
    {items.map((item) => <tr key={item.id}><td>{item.companyNumber}</td><td><button className="catalog-link" onClick={() => onSelect(item)}>{item.name}</button></td><td><Actions item={item} onEdit={onEdit} onDelete={onDelete} /></td></tr>)}
    {!items.length && <tr><td colSpan={4} className="empty">검색 결과가 없습니다.</td></tr>}
  </tbody></table></div>
}

function ProductTable({ items, onSelect, onEdit, onDelete }: { items: Product[]; onSelect: (item: Product) => void; onEdit: (item: Product) => void; onDelete: (id: number) => void }) {
  return <div className="table-wrap product-table"><table><thead><tr><th>사진</th><th>물품번호</th><th>물품명</th><th>초기 재고</th><th>가격</th><th>관리</th></tr></thead><tbody>
    {items.map((item) => <tr key={item.id}><td>{item.image ? <img className="catalog-thumb" src={item.image} alt="" /> : <span className="no-image">—</span>}</td><td>{item.productNumber}</td><td><button className="catalog-link" onClick={() => onSelect(item)}>{item.name}</button></td><td>{number(item.stock)}개</td><td>{money(item.price)}</td><td><Actions item={item} onEdit={onEdit} onDelete={onDelete} /></td></tr>)}
    {!items.length && <tr><td colSpan={7} className="empty">검색 결과가 없습니다.</td></tr>}
  </tbody></table></div>
}

function Actions({ item, onEdit, onDelete }: { item: Company | Product; onEdit: (item: any) => void; onDelete: (id: number) => void }) {
  return <div className="catalog-actions">
    <button className="edit-button" onClick={() => onEdit(item)}>수정</button>
    <button className="delete-button" onClick={() => { if (window.confirm(`“${item.name}”을(를) 삭제할까요?`)) onDelete(item.id) }}>삭제</button>
  </div>
}

function CatalogEditModal({ item, kind, onClose, onUpdate }: { item: Company | Product; kind: Props['kind']; onClose: () => void; onUpdate: Props['onUpdate'] }) {
  const isProduct = kind === 'product'
  const product = item as Product
  const company = item as Company
  const [image, setImage] = useState(isProduct ? product.image || '' : '')
  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onUpdate(item.id, {
      name: String(data.get('name') || '').trim(), productNumber: String(data.get('productNumber') || '').trim(), productType: String(data.get('productType') || '').trim(), companyNumber: String(data.get('companyNumber') || '').trim(), companyType: String(data.get('companyType') || '').trim(), stock: Number(data.get('stock') || 0), price: Number(data.get('price') || 0), image: image || undefined,
    })
    onClose()
  }
  return <div className="overlay"><form className="modal catalog-edit-modal" onSubmit={submit}>
    <div className="modal-head"><h2>{isProduct ? '물품' : '회사'} 수정</h2><button type="button" onClick={onClose}>×</button></div>
    <div className="form-grid">
      {isProduct ? <>
        <label>물품번호<input name="productNumber" defaultValue={product.productNumber} required /></label><label>물품명<input name="name" defaultValue={product.name} required /></label>
        <label>초기 재고<input name="stock" type="number" min="0" defaultValue={product.stock} required /></label><label>가격<input name="price" type="number" min="0" defaultValue={product.price} required /></label>
        <label className="image-field">사진 변경<input type="file" accept="image/*" onChange={handleImage} /><span className="image-upload">{image ? '사진 변경하기' : '이미지 선택'}</span>{image && <img className="image-preview" src={image} alt="물품 미리보기" />}</label>
      </> : <><label>회사번호<input name="companyNumber" defaultValue={company.companyNumber} required /></label><label>회사명<input name="name" defaultValue={company.name} required /></label></>}
    </div>
    <button className="primary submit">수정 내용 저장</button>
  </form></div>
}

function CatalogDetail({ item, kind, onBack }: { item: Company | Product; kind: Props['kind']; onBack: () => void }) {
  const isProduct = kind === 'product'
  const product = item as Product
  const company = item as Company
  return <main>
    <header><div><p className="eyebrow">{isProduct ? 'PRODUCT DETAIL' : 'COMPANY DETAIL'}</p><h1>{item.name}</h1><p className="sub">등록된 {isProduct ? '물품' : '회사'} 상세 정보입니다.</p></div><button className="secondary" onClick={onBack}>← 목록으로</button></header>
    <article className="panel catalog-detail">
      {isProduct && <div className="detail-image">{product.image ? <img src={product.image} alt={product.name} /> : <span>사진 없음</span>}</div>}
      <dl>
        <div><dt>{isProduct ? '물품번호' : '회사번호'}</dt><dd>{isProduct ? product.productNumber : company.companyNumber}</dd></div>
        
        {isProduct && <><div><dt>초기 재고</dt><dd>{number(product.stock)}개</dd></div><div><dt>가격</dt><dd>{money(product.price)}</dd></div></>}
        <div><dt>등록일</dt><dd>{item.createdAt}</dd></div>
      </dl>
    </article>
  </main>
}

export type WorkspaceFrame = 'WF01' | 'WF02' | 'WF03' | 'WF04' | 'WF05' | 'WF07' | 'WF08' | 'WF11' | 'WF13'
export interface ConceptFixture { id: string; title: string; kind: string; area: string; description: string }
export const paymentConcepts: ConceptFixture[] = [
  { id: 'payment-intent', title: 'Payment Intent', kind: 'Process', area: 'Payment lifecycle', description: 'Отслеживает платёж от создания до подтверждения и итогового результата.' },
  { id: 'authorization', title: 'Authorization', kind: 'Operation', area: 'Card processing', description: 'Резервирует средства после одобрения карточного платежа эмитентом.' },
  { id: 'capture', title: 'Capture', kind: 'Operation', area: 'Payment lifecycle', description: 'Завершает авторизованный платёж и инициирует расчёты.' },
  { id: 'idempotency-key', title: 'Idempotency Key', kind: 'Mechanism', area: 'Reliability', description: 'Предотвращает создание дублирующей операции при повторе запроса.' },
  { id: 'refund', title: 'Refund', kind: 'Process', area: 'Post-payment', description: 'Возвращает плательщику средства после завершённого Capture.' },
  { id: 'merchant', title: 'Merchant', kind: 'Participant', area: 'Payment ecosystem', description: 'Принимает оплату клиента за товары или услуги.' },
  { id: 'payment-gateway', title: 'Payment Gateway', kind: 'Component', area: 'Payment infrastructure', description: 'Передаёт платёжные запросы между интеграцией Merchant и процессингом.' },
  { id: 'acquirer', title: 'Acquirer', kind: 'Participant', area: 'Card processing', description: 'Предоставляет Merchant возможность принимать карточные платежи.' },
  { id: 'issuer', title: 'Issuer', kind: 'Participant', area: 'Card processing', description: 'Выпускает платёжный инструмент и принимает решение об Authorization.' },
  { id: 'authentication', title: 'Cardholder Authentication', kind: 'Mechanism', area: 'Risk controls', description: 'Собирает подтверждения того, что плательщик является владельцем карты.' },
  { id: 'settlement', title: 'Settlement', kind: 'Process', area: 'Payment lifecycle', description: 'Перемещает итоговые суммы между финансовыми участниками после клиринга.' },
  { id: 'chargeback', title: 'Chargeback', kind: 'Process', area: 'Post-payment', description: 'Отменяет карточный платёж после формального оспаривания.' },
]
export const selectedConcept = paymentConcepts[0]
export const selectedRelations = {
  outgoing: [{ type: 'contains', target: 'Authorization' }, { type: 'contains', target: 'Capture' }, { type: 'protected_by', target: 'Idempotency Key' }],
  incoming: [{ type: 'precedes', target: 'Refund' }],
}

export const normalDensityConcepts = Array.from({ length: 48 }, (_, index) => ({
  id: `normal-${index + 1}`,
  reference: `FX-${String(index + 1).padStart(3, '0')}`,
  title: index < paymentConcepts.length ? paymentConcepts[index].title : `Payment fixture item ${String(index + 1).padStart(2, '0')}`,
  kind: paymentConcepts[index % paymentConcepts.length].kind,
  area: paymentConcepts[index % paymentConcepts.length].area,
}))

export const denseConcepts = Array.from({ length: 144 }, (_, index) => ({
  id: `dense-${index + 1}`,
  reference: `DFX-${String(index + 1).padStart(3, '0')}`,
  title: index < paymentConcepts.length ? paymentConcepts[index].title : `Payment fixture item ${String(index + 1).padStart(3, '0')}`,
  kind: paymentConcepts[index % paymentConcepts.length].kind,
  area: paymentConcepts[index % paymentConcepts.length].area,
}))

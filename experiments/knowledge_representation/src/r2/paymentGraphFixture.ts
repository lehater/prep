export type PaymentArea = 'Lifecycle' | 'Participants' | 'Infrastructure' | 'Risk' | 'Reliability' | 'Post-payment'
export type PaymentRelationType = 'prerequisite' | 'contains' | 'protected_by' | 'precedes' | 'uses' | 'similar_to'
export type RelationType = PaymentRelationType | 'wikilink'

export interface PaymentGraphNode {
  id: string
  title: string
  kind: string
  area: string
  description: string
  sourcePath?: string
  x: number
  y: number
  z: number
}

export interface PaymentGraphLink {
  id: string
  source: string | PaymentGraphNode
  target: string | PaymentGraphNode
  type: RelationType
}

const areaTerms: Record<PaymentArea, string[]> = {
  Lifecycle: ['Payment Intent', 'Authorization', 'Capture', 'Clearing', 'Settlement', 'Payment Attempt', 'Payment Confirmation', 'Payment Failure', 'Payment State', 'Payment Completion'],
  Participants: ['Merchant', 'Customer', 'Issuer', 'Acquirer', 'Card Network', 'Payment Facilitator', 'Processor', 'Payee', 'Payer', 'Operations Team'],
  Infrastructure: ['Payment Gateway', 'Token Vault', 'Ledger', 'Payment API', 'Webhook Delivery', 'Routing Engine', 'Message Queue', 'Reconciliation Service', 'Connector', 'Payment Adapter'],
  Risk: ['Cardholder Authentication', 'Fraud Screening', 'Velocity Check', 'Risk Score', '3-D Secure', 'Device Signal', 'Address Verification', 'Manual Review', 'Decline Rule', 'Risk Policy'],
  Reliability: ['Idempotency Key', 'Retry Policy', 'Deduplication', 'Timeout', 'Circuit Breaker', 'Request Correlation', 'Delivery Guarantee', 'Recovery Job', 'Failure Classification', 'Audit Trail'],
  'Post-payment': ['Refund', 'Chargeback', 'Dispute', 'Reversal', 'Partial Refund', 'Refund Failure', 'Evidence Package', 'Representment', 'Fee Adjustment', 'Payout Correction'],
}

export const areaColors: Record<PaymentArea, string> = {
  Lifecycle: '#4f8df7', Participants: '#22a06b', Infrastructure: '#8b6bd9', Risk: '#e06c75', Reliability: '#d19a3d', 'Post-payment': '#29a3b4',
}

export const relationColors: Record<PaymentRelationType, string> = {
  prerequisite: '#f0b44d', contains: '#63a4ff', protected_by: '#e879a7', precedes: '#64c28a', uses: '#a88be0', similar_to: '#7f8fa4',
}

const areas = Object.keys(areaTerms) as PaymentArea[]
export const paymentGraphNodes: PaymentGraphNode[] = areas.flatMap((area, areaIndex) => areaTerms[area].map((title, index) => {
  const angle = (index / 10) * Math.PI * 2 + areaIndex * 0.31
  const radius = 82 + (index % 3) * 12
  return {
    id: `${area.toLowerCase().replace(/[^a-z]+/g, '-')}-${index}`,
    title,
    kind: index % 3 === 0 ? 'Process' : index % 3 === 1 ? 'Concept' : 'Mechanism',
    area,
    description: `Provisional Payment Processing fixture: ${title}.`,
    x: Math.cos(angle) * radius + (areaIndex - 2.5) * 44,
    y: Math.sin(angle) * radius,
    z: (index - 4.5) * 18 + (areaIndex % 2 ? 28 : -28),
  }
}))

export const paymentRelationTypes = Object.keys(relationColors) as PaymentRelationType[]
export const paymentGraphLinks: PaymentGraphLink[] = paymentGraphNodes.flatMap((node, index) => {
  const links: PaymentGraphLink[] = [{ id: `ring-${index}`, source: node.id, target: paymentGraphNodes[(index + 1) % paymentGraphNodes.length].id, type: paymentRelationTypes[index % paymentRelationTypes.length] }]
  if (index % 2 === 0) links.push({ id: `cross-${index}`, source: node.id, target: paymentGraphNodes[(index + 11) % paymentGraphNodes.length].id, type: paymentRelationTypes[(index + 2) % paymentRelationTypes.length] })
  return links
})

export const paymentGraphData = { nodes: paymentGraphNodes, links: paymentGraphLinks }

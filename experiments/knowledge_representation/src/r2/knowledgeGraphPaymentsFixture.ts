import type { PaymentGraphLink, PaymentGraphNode } from './paymentGraphFixture'

// Source-derived fields: immutable card ID, canonical name, description and authored wikilink direction.
// UI-only fields: the five visual groups below. The source cards in this bounded slice do not
// persist useful area/kind classification, so these groups exist only to make the prototype readable.
// No typed semantic relation is inferred: every copied edge is represented as a generic `wikilink`.
export const knowledgeGraphSource = {
  repository: 'lehater/knowledge-graph',
  revision: '130d705e5250dfc82693a133a8a15494f9795745',
  path: 'graph/*.md',
} as const

export type KnowledgeGraphVisualGroup =
  | 'Core payments'
  | 'Digital payments'
  | 'Card payments'
  | 'Open finance'
  | 'Digital banking'

export const knowledgeGraphAreaColors: Record<KnowledgeGraphVisualGroup, string> = {
  'Core payments': '#4f8df7',
  'Digital payments': '#22a06b',
  'Card payments': '#8b6bd9',
  'Open finance': '#d19a3d',
  'Digital banking': '#29a3b4',
}

export const knowledgeGraphRelationColors = {
  wikilink: '#9aadc2',
} as const

export type KnowledgeGraphPaymentCardSeed = {
  id: string
  slug: string
  title: string
  description: string
  group: KnowledgeGraphVisualGroup
  links: string[]
}

export const knowledgeGraphPaymentCardSeeds: KnowledgeGraphPaymentCardSeed[] = [
  {
    id: '01a07751-62c1-7646-a78b-54c18ef3128c',
    slug: 'payments',
    title: 'Payments',
    description: 'Payments — передача денежных средств от плательщика к получателю для исполнения денежного обязательства или обмена стоимости.',
    group: 'Core payments',
    links: ['payment-service-provider', 'payment-clearing', 'payment-settlement', 'digital-payments'],
  },
  {
    id: '01a0772a-d69d-70ca-a0da-8a46670ac649',
    slug: 'fintech',
    title: 'Fintech',
    description: 'Fintech — технологически обеспеченные инновации в финансовых услугах, способные менять бизнес-модели, приложения, процессы и продукты финансового сектора.',
    group: 'Digital banking',
    links: ['digital-finance', 'digital-banking', 'digital-payments', 'open-banking'],
  },
  {
    id: '01a07751-d1d1-78da-b2a4-5f1e19770f8e',
    slug: 'digital-payments',
    title: 'Digital Payments',
    description: 'Digital Payments — платежи, при которых передача стоимости выполняется с использованием цифрового устройства или электронного канала связи.',
    group: 'Digital payments',
    links: ['payments', 'e-money', 'mobile-money', 'payment-service-provider'],
  },
  {
    id: '01a0776a-a6ea-75d4-8db1-dd2d930e1307',
    slug: 'card-processing',
    title: 'Card Processing',
    description: 'Card Processing — технологическая обработка карточных платежных транзакций, включая передачу данных и сообщений между участниками карточной платежной цепочки.',
    group: 'Card payments',
    links: ['card-issuing', 'merchant-acquiring'],
  },
  {
    id: '01a0776a-28ea-7032-bfda-4699ae7e4c5a',
    slug: 'card-issuing',
    title: 'Card Issuing',
    description: 'Card Issuing — выпуск платежной карты или карточного платежного инструмента эмитентом и обслуживание его использования держателем.',
    group: 'Card payments',
    links: ['merchant-acquiring', 'payments'],
  },
  {
    id: '01a07752-3c14-7ea7-9326-7b2948256bda',
    slug: 'payment-service-provider',
    title: 'Payment Service Provider',
    description: 'Payment Service Provider (PSP) — организация, предоставляющая платежные услуги; таким поставщиком может быть банк или небанковская финансовая организация.',
    group: 'Digital payments',
    links: ['payments', 'digital-payments', 'e-money'],
  },
  {
    id: '01a07769-b96b-7f28-8d76-5f5083e90c6c',
    slug: 'merchant-acquiring',
    title: 'Merchant Acquiring',
    description: 'Merchant Acquiring — деятельность по подключению торговцев к приему безналичных платежей и обработке их платежных операций на стороне эквайера.',
    group: 'Card payments',
    links: ['payments', 'payment-processor'],
  },
  {
    id: '01a0776d-d729-7b9a-8e43-bc0b32d96aca',
    slug: 'payment-clearing',
    title: 'Payment Clearing',
    description: 'Payment Clearing — процесс передачи, сверки и в необходимых случаях неттинга платежных инструкций до окончательного расчета обязательств.',
    group: 'Core payments',
    links: ['payments', 'payment-settlement'],
  },
  {
    id: '01a0776e-3e81-7473-8b40-49e30287820f',
    slug: 'payment-settlement',
    title: 'Payment Settlement',
    description: 'Payment Settlement — окончательное исполнение платежного обязательства путем перевода расчетного актива между участниками.',
    group: 'Core payments',
    links: ['payment-clearing', 'payments'],
  },
  {
    id: '01a0774d-6cbf-7ba7-81b2-2f8a2c18b2c9',
    slug: 'digital-finance',
    title: 'Digital Finance',
    description: 'Digital Finance — цифровая трансформация финансовых услуг и денег, при которой финансовые продукты и операции предоставляются и используются через цифровые технологии.',
    group: 'Digital banking',
    links: ['digital-payments', 'digital-banking', 'fintech'],
  },
  {
    id: '01a0774d-e88e-768a-a042-9549ed404f06',
    slug: 'digital-banking',
    title: 'Digital Banking',
    description: 'Digital Banking — предоставление банковских услуг через цифровые каналы, включая интернет и мобильные приложения; в полностью цифровой модели операции могут выполняться без физической филиальной сети.',
    group: 'Digital banking',
    links: ['digital-finance', 'neobank'],
  },
  {
    id: '01a0774e-cee0-7bdf-84f1-e41bdfea8782',
    slug: 'open-banking',
    title: 'Open Banking',
    description: 'Open Banking — модель контролируемого клиентом обмена банковскими данными с третьими сторонами для создания финансовых приложений и услуг.',
    group: 'Open finance',
    links: ['financial-api', 'account-information-service', 'payment-initiation-service', 'open-finance'],
  },
  {
    id: '01a07752-aa97-7cd1-beb2-214b3634e57a',
    slug: 'e-money',
    title: 'E-Money',
    description: 'E-Money — цифровое представление фиатной стоимости, являющееся требованием к поставщику, погашаемое по номиналу и принимаемое для платежей другими лицами помимо самого эмитента.',
    group: 'Digital payments',
    links: ['digital-payments', 'mobile-money', 'digital-wallet'],
  },
  {
    id: '01a07753-1908-7cd6-b472-4e0649c4bf69',
    slug: 'mobile-money',
    title: 'Mobile Money',
    description: 'Mobile Money — форма электронных денег, в которой стоимость хранится на мобильном устройстве или в центральной системе и доступна через платежные инструкции с мобильного телефона.',
    group: 'Digital payments',
    links: ['e-money', 'digital-payments'],
  },
  {
    id: '01a07768-fa8f-7d65-a308-56e72fe9be90',
    slug: 'payment-processor',
    title: 'Payment Processor',
    description: 'Payment Processor — участник или технологический сервис платежной цепочки, выполняющий машинную обработку платежных сообщений и транзакций между точкой приема и последующими платежными системами.',
    group: 'Card payments',
    links: ['payment-gateway', 'payments'],
  },
  {
    id: '01a0774e-6330-786e-90f6-d083bd537771',
    slug: 'neobank',
    title: 'Neobank',
    description: 'Neobank — технологическая компания, предоставляющая банковские или bank-like услуги преимущественно цифровым способом без обязательного наличия собственной полной банковской лицензии.',
    group: 'Digital banking',
    links: ['digital-banking', 'payment-service-provider', 'challenger-bank'],
  },
  {
    id: '01a0774f-df29-7380-9538-8f6a477e655c',
    slug: 'financial-api',
    title: 'Financial API',
    description: 'Financial API — программный интерфейс, через который финансовые системы и внешние приложения стандартизированно обмениваются данными или инициируют разрешенные финансовые действия.',
    group: 'Open finance',
    links: ['open-banking', 'open-finance', 'payment-initiation-service'],
  },
  {
    id: '01a07750-577a-7ed8-bf68-e1582d36fc67',
    slug: 'account-information-service',
    title: 'Account Information Service',
    description: 'Account Information Service — сервис, который с разрешения клиента получает информацию по его финансовым счетам и может агрегировать данные из нескольких учреждений.',
    group: 'Open finance',
    links: ['open-banking', 'financial-api'],
  },
  {
    id: '01a07750-d104-70e2-a2e1-df3c5b5b71a6',
    slug: 'payment-initiation-service',
    title: 'Payment Initiation Service',
    description: 'Payment Initiation Service — сервис третьей стороны, который с явного согласия владельца счета инициирует платеж непосредственно с его банковского счета.',
    group: 'Open finance',
    links: ['open-banking', 'financial-api', 'payments'],
  },
  {
    id: '01a0774f-6702-7bf8-a1ff-becee2d7a1d8',
    slug: 'open-finance',
    title: 'Open Finance',
    description: 'Open Finance — модель разрешенного клиентом доступа к финансовым данным и их использования для новых или улучшенных услуг, расширяющая Open Banking на более широкий набор финансовых продуктов.',
    group: 'Open finance',
    links: ['open-banking', 'financial-api'],
  },
  {
    id: '01a07753-bb48-7f3a-801c-8cc72da90c74',
    slug: 'digital-wallet',
    title: 'Digital Wallet',
    description: 'Digital Wallet — электронный кошелек, который хранит или представляет платежную стоимость и позволяет пользователю применять ее через цифровое устройство для финансовых операций.',
    group: 'Digital payments',
    links: ['e-money', 'digital-payments', 'payment-service-provider'],
  },
  {
    id: '01a07768-90ca-7b24-9116-25957fea02f0',
    slug: 'payment-gateway',
    title: 'Payment Gateway',
    description: 'Payment Gateway — технологический компонент приема и передачи платежных данных между пользовательским или торговым интерфейсом и последующей платежной обработкой.',
    group: 'Card payments',
    links: ['digital-payments', 'payment-service-provider'],
  },
  {
    id: '01a0776b-127e-77ba-bcc1-4a7effdd9c44',
    slug: 'mobile-payment',
    title: 'Mobile Payment',
    description: 'Mobile Payment — платеж, инициируемый или выполняемый с использованием мобильного устройства как пользовательского платежного канала.',
    group: 'Digital payments',
    links: ['digital-payments', 'digital-wallet'],
  },
  {
    id: '01a0776c-022d-78f0-bff7-2d2dc290d726',
    slug: 'instant-payment',
    title: 'Instant Payment',
    description: 'Instant Payment — розничный электронный платеж, при котором передача платежного сообщения и доступность средств получателю происходят почти немедленно, обычно с круглосуточной доступностью сервиса.',
    group: 'Core payments',
    links: ['digital-payments', 'payments'],
  },
  {
    id: '01a0776c-7472-71a4-807f-bbf9a4151107',
    slug: 'real-time-payment',
    title: 'Real-Time Payment',
    description: 'Real-Time Payment — платежный перевод, обработка и связанное с ним зачисление которого выполняются в реальном или близком к реальному времени вместо ожидания длительного расчетного цикла.',
    group: 'Core payments',
    links: ['instant-payment', 'payments'],
  },
  {
    id: '01a0776b-7c96-7f66-ab1d-e231f76a6f92',
    slug: 'contactless-payment',
    title: 'Contactless Payment',
    description: 'Contactless Payment — платеж, при котором платежная информация передается устройству приема без физического контакта платежного устройства с терминалом.',
    group: 'Digital payments',
    links: ['mobile-payment', 'digital-payments'],
  },
  {
    id: '01a0776c-e6dd-79db-86ff-76a83e04e816',
    slug: 'cross-border-payment',
    title: 'Cross-Border Payment',
    description: 'Cross-Border Payment — платеж, в котором плательщик и получатель либо обслуживающие их финансовые учреждения находятся в разных юрисдикциях и платеж проходит через трансграничные механизмы.',
    group: 'Core payments',
    links: ['payments', 'payment-clearing'],
  },
  {
    id: '01a07769-51d3-7a1a-9db2-870079f6c0ca',
    slug: 'payment-orchestration',
    title: 'Payment Orchestration',
    description: 'Payment Orchestration — координация нескольких платежных провайдеров, маршрутов и этапов обработки через единый технологический слой.',
    group: 'Card payments',
    links: ['payment-processor', 'payment-service-provider'],
  },
  {
    id: '01a0776d-47cd-7eb6-a34e-ec2786666205',
    slug: 'remittance',
    title: 'Remittance',
    description: 'Remittance — перевод денежных средств, обычно инициируемый физическим лицом в пользу другого физического лица, часто в трансграничном контексте.',
    group: 'Core payments',
    links: ['cross-border-payment', 'payments'],
  },
  {
    id: '01a0776e-ace9-7748-bea1-0260d910747f',
    slug: 'financial-market-infrastructure',
    title: 'Financial Market Infrastructure',
    description: 'Financial Market Infrastructure — многосторонняя система, используемая участвующими организациями для платежей, клиринга, расчетов, учета или связанных финансовых функций.',
    group: 'Core payments',
    links: ['payment-clearing', 'payment-settlement'],
  },
  {
    id: '01a07767-2cbb-7b1b-9687-dd88a22b8b4d',
    slug: 'challenger-bank',
    title: 'Challenger Bank',
    description: 'Challenger Bank — цифровой или преимущественно цифровой банк, использующий технологическую модель предоставления банковских услуг как альтернативу традиционным каналам.',
    group: 'Digital banking',
    links: ['digital-banking', 'neobank'],
  },
]

const goldenAngle = Math.PI * (3 - Math.sqrt(5))
export const knowledgeGraphPaymentNodes: PaymentGraphNode[] = knowledgeGraphPaymentCardSeeds.map((seed, index) => {
  const normalizedZ = 1 - 2 * ((index + .5) / knowledgeGraphPaymentCardSeeds.length)
  const radial = 150 * Math.sqrt(Math.max(0, 1 - normalizedZ * normalizedZ))
  const angle = index * goldenAngle

  return {
    id: seed.id,
    title: seed.title,
    kind: 'Concept Card',
    area: seed.group,
    description: seed.description,
    sourcePath: `graph/${seed.slug}.md`,
    x: Math.cos(angle) * radial,
    y: Math.sin(angle) * radial,
    z: normalizedZ * 150,
  }
})

const nodeIdBySlug = new Map(knowledgeGraphPaymentCardSeeds.map((seed) => [seed.slug, seed.id]))
const seenLinks = new Set<string>()

export const knowledgeGraphPaymentLinks: PaymentGraphLink[] = knowledgeGraphPaymentCardSeeds.flatMap((seed) => {
  const source = nodeIdBySlug.get(seed.slug)
  if (!source) return []

  return seed.links.flatMap((targetSlug) => {
    const target = nodeIdBySlug.get(targetSlug)
    if (!target) return []

    const key = `${source}->${target}`
    if (seenLinks.has(key)) return []
    seenLinks.add(key)

    return [{
      id: `kg-wikilink-${seed.slug}-${targetSlug}`,
      source,
      target,
      type: 'wikilink' as const,
    }]
  })
})

export const knowledgeGraphPaymentFixture = {
  title: 'Knowledge Graph · Payments',
  fixtureLabel: `Real Concept Card snapshot · ${knowledgeGraphPaymentNodes.length} nodes · ${knowledgeGraphPaymentLinks.length} authored wikilinks`,
  nodes: knowledgeGraphPaymentNodes,
  links: knowledgeGraphPaymentLinks,
  areaColors: knowledgeGraphAreaColors,
  relationColors: knowledgeGraphRelationColors,
} as const


import { knowledgeGraphPaymentCardSeeds, knowledgeGraphSource } from './knowledgeGraphPaymentsFixture'
import type { KnowledgeGraphSnapshot, KnowledgeGraphSnapshotQuestion } from './knowledgeGraphSnapshotModel'

const questionDetails: Record<string, KnowledgeGraphSnapshotQuestion[]> = {
  payments: [
    {
      question: 'Из каких функций складывается выполнение платежа?',
      answer: 'Платежная архитектура обычно разделяется на front end и back end. Front end связывает пользователя с источником средств, платежным инструментом и каналом доступа; back end выполняет обработку, клиринг и расчет, чтобы передача средств завершила денежное обязательство между сторонами.',
      links: [
        { target: 'payment-service-provider', label: 'Payment Service Provider', explanation: 'PSP связывает плательщика или получателя с платежной цепочкой и может предоставлять платежные инструменты и розничные платежные услуги.' },
        { target: 'payment-clearing', label: 'Payment Clearing', explanation: 'Клиринг передает, сверяет и при необходимости подтверждает платежные инструкции до окончательного расчета.' },
        { target: 'payment-settlement', label: 'Payment Settlement', explanation: 'Расчет переводит средства для погашения денежных обязательств между участниками.' },
      ],
    },
    {
      question: 'Чем розничные платежи отличаются от оптовых?',
      answer: 'Розничные платежные системы обрабатывают большое число сравнительно небольших платежей потребителей и компаний, тогда как оптовые системы предназначены для крупных межфинансовых переводов и связанных обязательств.',
      links: [
        { target: 'digital-payments', label: 'Digital Payments', explanation: 'Digital Payments описывают электронную форму платежей, которая стала основной областью технологических изменений в розничных платежах.' },
      ],
    },
  ],
  'payment-service-provider': [
    {
      question: 'Какую роль PSP выполняет в платежной цепочке?',
      answer: 'PSP предоставляет пользователям платежные услуги и может выпускать платежные инструменты. В розничной платежной архитектуре PSP связывают плательщика и получателя с front-end каналами и с инфраструктурой обработки, клиринга и расчета.',
      links: [
        { target: 'payments', label: 'Payments', explanation: 'PSP является институциональным участником, через которого пользователи получают доступ к платежной системе.' },
        { target: 'digital-payments', label: 'Digital Payments', explanation: 'Рост цифровых платежей расширил роль небанковских PSP и разнообразие предоставляемых ими розничных сервисов.' },
      ],
    },
    {
      question: 'Почему PSP не обязательно является банком?',
      answer: 'Платежные услуги могут предоставлять как банки и депозитные учреждения, так и специализированные небанковские организации, включая операторов денежных переводов и эмитентов электронных денег. Конкретный набор разрешенных услуг зависит от регуляторной модели юрисдикции.',
      links: [
        { target: 'e-money', label: 'E-Money', explanation: 'Эмитенты e-money являются одним из типов специализированных небанковских поставщиков платежных услуг.' },
      ],
    },
  ],
  'payment-clearing': [
    {
      question: 'Чем clearing отличается от settlement?',
      answer: 'Clearing определяет и подготавливает обязательства участников по платежным инструкциям, тогда как settlement завершает исполнение этих обязательств путем окончательного перевода расчетного актива.',
      links: [
        { target: 'payments', label: 'Payments', explanation: 'Clearing является промежуточным инфраструктурным этапом платежного процесса.' },
        { target: 'payment-settlement', label: 'Payment Settlement', explanation: 'Результаты clearing становятся основой для последующего settlement.' },
      ],
    },
  ],
  'payment-settlement': [
    {
      question: 'Почему settlement finality важна для платежной системы?',
      answer: 'Окончательность определяет момент, после которого перевод считается завершенным и не может быть отозван по обычной процедуре; ясная finality снижает settlement risk и неопределенность участников.',
      links: [
        { target: 'payment-clearing', label: 'Payment Clearing', explanation: 'Settlement исполняет обязательства, подготовленные на стадии clearing.' },
        { target: 'payments', label: 'Payments', explanation: 'Settlement завершает инфраструктурный цикл платежного перевода.' },
      ],
    },
  ],
}

const sourceDetails: Record<string, string[]> = {
  payments: ['https://www.bis.org/publications/aer-2020/central-banks-payments-digital-era'],
  'payment-service-provider': ['https://digitalfinance.worldbank.org/glossary', 'https://www.bis.org/publications/fast-payments-design-and-adoption'],
  'payment-clearing': ['https://www.bis.org/committees/cpmi/glossary', 'https://www.bis.org/committees/cpmi/pfmi/overview'],
  'payment-settlement': ['https://www.bis.org/committees/cpmi/pfmi/overview', 'https://www.bis.org/committees/cpmi/glossary'],
}

export const fallbackKnowledgeGraphSnapshot: KnowledgeGraphSnapshot = {
  repository: knowledgeGraphSource.repository,
  revision: knowledgeGraphSource.revision,
  sourceMode: 'fallback',
  contentHash: 'payments-fallback-v1',
  cards: knowledgeGraphPaymentCardSeeds.map((seed) => ({
    id: seed.id,
    slug: seed.slug,
    name: seed.title,
    kind: null,
    areas: [],
    aliases: [],
    sources: sourceDetails[seed.slug] ?? [],
    description: seed.description,
    questions: questionDetails[seed.slug] ?? [],
    outgoing: [...seed.links],
    sourcePath: `graph/${seed.slug}.md`,
  })),
}

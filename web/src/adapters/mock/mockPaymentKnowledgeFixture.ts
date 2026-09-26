import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
  KnowledgeSemanticKind,
} from "../../features/knowledge-explorer/model/knowledge";

type DonorSeed = readonly [
  id: string,
  semanticKind: KnowledgeSemanticKind,
  title: string,
  summary: string,
];

// Adapted from the experiment branch's payment/fintech knowledge snapshot.
// This is mock/demo data only: it does not become canonical domain knowledge.
const DONOR_SEEDS: readonly DonorSeed[] = [
  ["payments", "concept", "Payments", "Transfer of monetary value from payer to payee to discharge an obligation or exchange value."],
  ["fintech", "strategy", "Fintech", "Technology-enabled change in financial services, products, processes and business models."],
  ["digital-payments", "concept", "Digital payments", "Payments in which value transfer is initiated or completed through a digital device or electronic channel."],
  ["card-processing", "concept", "Card processing", "Processing of card-payment transaction data and messages across the card-payment chain."],
  ["card-issuing", "concept", "Card issuing", "Issuance and servicing of a payment card or card-based payment instrument by an issuer."],
  ["payment-service-provider", "mechanism", "Payment service provider", "A provider that exposes payment services to merchants or users and coordinates access to payment rails."],
  ["merchant-acquiring", "mechanism", "Merchant acquiring", "Services that connect merchants to card acceptance and process merchant-side payment operations."],
  ["payment-clearing", "procedure", "Payment clearing", "Transmission, reconciliation and possible netting of payment instructions before final settlement."],
  ["payment-settlement", "procedure", "Payment settlement", "Final discharge of a payment obligation through transfer of a settlement asset."],
  ["digital-finance", "concept", "Digital finance", "Financial products and operations delivered or transformed through digital technology."],
  ["digital-banking", "strategy", "Digital banking", "Delivery of banking services primarily through digital channels and software-mediated operations."],
  ["open-banking", "strategy", "Open banking", "Customer-controlled sharing of banking data and initiation capabilities with authorized third parties."],
  ["e-money", "concept", "E-money", "Digitally represented fiat value that is a claim on an issuer and is accepted for payment by others."],
  ["mobile-money", "mechanism", "Mobile money", "Electronic value accessed through a mobile device or centrally managed mobile account system."],
  ["payment-processor", "mechanism", "Payment processor", "A service that performs machine processing and routing of payment messages between participants."],
  ["neobank", "strategy", "Neobank", "A predominantly digital provider of banking or bank-like services without reliance on a traditional branch network."],
  ["financial-api", "mechanism", "Financial API", "A standardized software interface for exchanging financial data or initiating authorized financial actions."],
  ["account-information-service", "mechanism", "Account information service", "A consent-based service that retrieves and aggregates account information from one or more institutions."],
  ["payment-initiation-service", "mechanism", "Payment initiation service", "A third-party service that initiates a payment from a customer's account with explicit authorization."],
  ["open-finance", "strategy", "Open finance", "Consent-based use of a broader range of financial data and services beyond traditional bank accounts."],
  ["digital-wallet", "mechanism", "Digital wallet", "A software wallet that stores or represents payment credentials or value for digital transactions."],
  ["payment-gateway", "mechanism", "Payment gateway", "A component that accepts payment data and forwards it from a merchant-facing channel into payment processing."],
  ["mobile-payment", "mechanism", "Mobile payment", "A payment initiated or completed using a mobile device as the user interaction channel."],
  ["instant-payment", "mechanism", "Instant payment", "An electronic retail payment where processing and availability of funds happen near-immediately, usually continuously."],
  ["real-time-payment", "mechanism", "Real-time payment", "A payment whose processing and associated crediting happen in real or near-real time."],
  ["contactless-payment", "mechanism", "Contactless payment", "A payment where payment information is transferred to an acceptance device without physical contact."],
  ["cross-border-payment", "concept", "Cross-border payment", "A payment where parties or their financial institutions are located in different jurisdictions."],
  ["payment-orchestration", "strategy", "Payment orchestration", "Coordination of multiple payment providers, routes and processing stages through one control layer."],
  ["remittance", "concept", "Remittance", "A person-to-person transfer of funds, often across borders, usually for household or family support."],
  ["financial-market-infrastructure", "mechanism", "Financial market infrastructure", "A multilateral system used for payment, clearing, settlement, recording or related financial functions."],
  ["challenger-bank", "strategy", "Challenger bank", "A predominantly digital bank competing with traditional banking channels through a technology-led operating model."],

  ["duplicate-payment-processing", "concept", "Duplicate payment processing", "Repeated delivery or retry can create more than one side effect for one intended payment operation."],
  ["idempotency-key", "mechanism", "Idempotency key", "A stable request identity used to make retried payment commands resolve to one logical operation."],
  ["transient-payment-failure", "concept", "Transient payment failure", "A temporary infrastructure or dependency failure that may succeed when retried under controlled policy."],
  ["retry-policy", "strategy", "Retry policy", "A bounded strategy for retrying transient failures with explicit backoff, limits and non-retryable classifications."],
  ["fraud-risk", "concept", "Payment fraud risk", "The risk that a payment or account action is unauthorized, deceptive or intentionally abusive."],
  ["fraud-screening", "mechanism", "Fraud screening", "Rules, models and signals used to detect or challenge suspicious payment activity."],
  ["routing-fragmentation", "concept", "Payment routing fragmentation", "Operational complexity caused by multiple providers, rails, capabilities and routing policies."],
  ["reconciliation-gap", "concept", "Reconciliation gap", "A mismatch between internal payment records and external processor, bank or settlement records."],
  ["reconciliation-service", "mechanism", "Reconciliation service", "A service that compares internal and external financial records and identifies mismatches for resolution."],
];

export const donorKnowledgeNodes: readonly KnowledgeNodeModel[] = DONOR_SEEDS.map(
  ([id, semanticKind, title, summary]) => ({
    id: `demo-payment-${id}`,
    semanticKind,
    title,
    summary,
  }),
);

const relation = (
  id: string,
  source: string,
  target: string,
  type: "addresses" | "realizes",
): KnowledgeRelationModel => ({
  id: `demo-payment-relation-${id}`,
  sourceId: `demo-payment-${source}`,
  targetId: `demo-payment-${target}`,
  type,
});

export const donorKnowledgeRelations: readonly KnowledgeRelationModel[] = [
  relation("psp-digital", "payment-service-provider", "digital-payments", "realizes"),
  relation("processor-card", "payment-processor", "card-processing", "realizes"),
  relation("acquiring-card", "merchant-acquiring", "card-processing", "realizes"),
  relation("gateway-digital", "payment-gateway", "digital-payments", "realizes"),
  relation("wallet-digital", "digital-wallet", "digital-payments", "realizes"),
  relation("mobile-money-emoney", "mobile-money", "e-money", "realizes"),
  relation("mobile-digital", "mobile-payment", "digital-payments", "realizes"),
  relation("contactless-digital", "contactless-payment", "digital-payments", "realizes"),
  relation("instant-digital", "instant-payment", "digital-payments", "realizes"),
  relation("realtime-instant", "real-time-payment", "instant-payment", "realizes"),
  relation("api-open-banking", "financial-api", "open-banking", "realizes"),
  relation("ais-open-banking", "account-information-service", "open-banking", "realizes"),
  relation("pis-open-banking", "payment-initiation-service", "open-banking", "realizes"),
  relation("open-banking-open-finance", "open-banking", "open-finance", "realizes"),
  relation("neobank-digital-banking", "neobank", "digital-banking", "realizes"),
  relation("challenger-digital-banking", "challenger-bank", "digital-banking", "realizes"),
  relation("digital-banking-finance", "digital-banking", "digital-finance", "realizes"),
  relation("fintech-finance", "fintech", "digital-finance", "realizes"),
  relation("fmi-clearing", "financial-market-infrastructure", "payment-clearing", "realizes"),
  relation("fmi-settlement", "financial-market-infrastructure", "payment-settlement", "realizes"),
  relation("orchestration-fragmentation", "payment-orchestration", "routing-fragmentation", "addresses"),
  relation("idempotency-duplicates", "idempotency-key", "duplicate-payment-processing", "addresses"),
  relation("retry-transient", "retry-policy", "transient-payment-failure", "addresses"),
  relation("screening-fraud", "fraud-screening", "fraud-risk", "addresses"),
  relation("reconcile-gap", "reconciliation-service", "reconciliation-gap", "addresses"),
];

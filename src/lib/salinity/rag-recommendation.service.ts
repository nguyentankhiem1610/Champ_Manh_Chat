import {
  RICE_STAGE_KNOWLEDGE,
  VARIETY_KNOWLEDGE,
  type KnowledgeSource,
  type RiceGrowthStage,
  type RiceVarietyKey,
  type SalinityBand,
} from "./rag-knowledge-base";

export type RecommendationRisk =
  | "unknown"
  | "low"
  | "moderate"
  | "high"
  | "critical";

export interface RiceRecommendationInput {
  salinity: number | null;
  salinitySource: "field" | "regional_forecast";
  province: string;
  riceVariety?: string | null;
  growthStage?: string | null;
  sowingDate?: string | null;
  measuredAt?: string | null;
  station?: string | null;
}

export interface RiceRagRecommendation {
  id: string;
  title: string;
  summary: string;
  risk: RecommendationRisk;
  riskLabel: string;
  salinityBand: SalinityBand | null;
  stage: RiceGrowthStage;
  stageLabel: string;
  stageSource: "confirmed" | "inferred" | "fallback";
  variety: RiceVarietyKey;
  immediateActions: string[];
  monitoringActions: string[];
  avoidActions: string[];
  confidence: "high" | "medium" | "limited";
  confidenceLabel: string;
  evidence: KnowledgeSource[];
  retrievedChunkIds: string[];
  dataNote: string;
}

const STAGE_LABELS: Array<{
  stage: RiceGrowthStage;
  aliases: string[];
}> = [
  { stage: "germination", aliases: ["gieo sa", "nay mam", "moc mam"] },
  { stage: "seedling", aliases: ["ma", "cay con"] },
  { stage: "tillering", aliases: ["de nhanh", "vuon long", "dung cai"] },
  { stage: "panicle", aliases: ["lam dong", "phan hoa dong"] },
  { stage: "flowering", aliases: ["tro", "ra hoa", "thu phan", "thu tinh"] },
  { stage: "grain_filling", aliases: ["vao sua", "chac hat", "chin"] },
  { stage: "maturity", aliases: ["thu hoach", "truoc thu hoach", "chin hoan toan"] },
];

const RISK_LABELS: Record<RecommendationRisk, string> = {
  unknown: "Chưa đủ dữ liệu",
  low: "Nguy cơ thấp",
  moderate: "Cần theo dõi",
  high: "Nguy cơ cao",
  critical: "Khẩn cấp",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function classifySalinity(salinity: number): SalinityBand {
  if (salinity < 2) return "low";
  if (salinity < 3) return "medium";
  if (salinity < 4) return "high";
  return "critical";
}

export function resolveRiceVariety(value?: string | null): RiceVarietyKey {
  if (!value) return "unknown";
  const normalized = normalizeText(value);

  for (const [key, knowledge] of Object.entries(VARIETY_KNOWLEDGE)) {
    if (
      knowledge.aliases.some((alias) => normalizeText(alias) === normalized)
    ) {
      return key as Exclude<RiceVarietyKey, "unknown">;
    }
  }

  return "unknown";
}

function inferStageFromSowingDate(sowingDate?: string | null): RiceGrowthStage | null {
  if (!sowingDate) return null;
  const sowing = new Date(sowingDate);
  if (Number.isNaN(sowing.getTime())) return null;

  const days = Math.floor((Date.now() - sowing.getTime()) / 86_400_000);
  if (days < 0) return null;
  if (days < 7) return "germination";
  if (days < 20) return "seedling";
  if (days < 40) return "tillering";
  if (days < 60) return "panicle";
  if (days < 75) return "flowering";
  if (days < 95) return "grain_filling";
  return "maturity";
}

export function resolveGrowthStage(
  growthStage?: string | null,
  sowingDate?: string | null,
): { stage: RiceGrowthStage; source: "confirmed" | "inferred" | "fallback" } {
  if (growthStage) {
    const normalized = normalizeText(growthStage);
    const match = STAGE_LABELS.find(({ aliases }) =>
      aliases.some((alias) => normalized.includes(alias)),
    );
    if (match) return { stage: match.stage, source: "confirmed" };
  }

  const inferred = inferStageFromSowingDate(sowingDate);
  if (inferred) return { stage: inferred, source: "inferred" };

  return { stage: "tillering", source: "fallback" };
}

function assessRisk(
  band: SalinityBand,
  salinity: number,
  stage: RiceGrowthStage,
  variety: RiceVarietyKey,
): RecommendationRisk {
  const bandScore: Record<SalinityBand, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };
  const sensitivityScore: Record<RiceGrowthStage, number> = {
    germination: 0,
    seedling: 1,
    tillering: 0,
    panicle: 1,
    flowering: 1,
    grain_filling: 0,
    maturity: -1,
  };

  let score = bandScore[band] + sensitivityScore[stage];

  if (band === "low" && salinity < 1) score -= 1;
  if (
    salinity >= 2 &&
    ((variety === "Đài Thơm 8" && stage === "seedling") ||
      (variety === "IR4625" && stage === "seedling"))
  ) {
    score += 1;
  }

  if (score <= 0) return "low";
  if (score === 1) return "moderate";
  if (score === 2) return "high";
  return "critical";
}

function uniqueSources(sources: KnowledgeSource[]): KnowledgeSource[] {
  return Array.from(new Map(sources.map((source) => [source.id, source])).values());
}

function getDataNote(input: RiceRecommendationInput): string {
  if (input.salinitySource === "field") {
    return "Ưu tiên số đo tại ruộng do người dùng nhập. Hãy đo lại nếu giá trị đã cũ hoặc điều kiện nước vừa thay đổi.";
  }

  const station = input.station ? ` tại trạm ${input.station}` : "";
  return `Đang dùng dữ liệu trung bình/dự báo khu vực${station}; độ mặn thực tế tại ruộng có thể khác, nên đo tại chỗ trước khi bơm nước.`;
}

function assessConfidence(
  stageSource: RiceRagRecommendation["stageSource"],
  variety: RiceVarietyKey,
  stage: RiceGrowthStage,
  salinitySource: RiceRecommendationInput["salinitySource"],
): Pick<RiceRagRecommendation, "confidence" | "confidenceLabel"> {
  const directEvidence =
    variety !== "unknown" &&
    VARIETY_KNOWLEDGE[variety].directStages.includes(stage);

  if (
    directEvidence &&
    stageSource === "confirmed" &&
    salinitySource === "field"
  ) {
    return {
      confidence: "high",
      confidenceLabel: "Cao - đúng giống, đúng giai đoạn và có số đo tại ruộng",
    };
  }

  if (variety !== "unknown" && stageSource !== "fallback") {
    return {
      confidence: "medium",
      confidenceLabel: directEvidence
        ? "Khá - có bằng chứng trực tiếp, nhưng dữ liệu mặn mang tính đại diện"
        : "Khá - có bằng chứng theo giống; một phần được suy luận thận trọng từ sinh lý lúa",
    };
  }

  return {
    confidence: "limited",
    confidenceLabel:
      "Giới hạn - thiếu giống hoặc giai đoạn xác nhận; chỉ dùng khung chung cho cây lúa",
  };
}

export function buildRiceRagRecommendation(
  input: RiceRecommendationInput,
): RiceRagRecommendation {
  const { stage, source: stageSource } = resolveGrowthStage(
    input.growthStage,
    input.sowingDate,
  );
  const stageKnowledge = RICE_STAGE_KNOWLEDGE[stage];
  const variety = resolveRiceVariety(input.riceVariety);
  const varietyKnowledge =
    variety === "unknown" ? null : VARIETY_KNOWLEDGE[variety];
  const evidence = uniqueSources([
    ...stageKnowledge.sources,
    ...(varietyKnowledge?.sources ?? []),
  ]);
  const confidence = assessConfidence(
    stageSource,
    variety,
    stage,
    input.salinitySource,
  );

  if (
    input.salinity === null ||
    !Number.isFinite(input.salinity) ||
    input.salinity < 0
  ) {
    return {
      id: `rice-rag-missing-${stage}-${variety}`,
      title: `Cần bổ sung độ mặn cho giai đoạn ${stageKnowledge.label}`,
      summary:
        "Chưa có giá trị độ mặn hợp lệ nên hệ thống chưa thể đối chiếu đúng ô giống × giai đoạn × mức mặn.",
      risk: "unknown",
      riskLabel: RISK_LABELS.unknown,
      salinityBand: null,
      stage,
      stageLabel: stageKnowledge.label,
      stageSource,
      variety,
      immediateActions: [
        "Đo độ mặn tại ruộng trước khi lấy nước hoặc cập nhật giá trị vào hồ sơ canh tác.",
        "Nếu chưa có thiết bị, dùng dữ liệu trạm gần nhất như chỉ báo tạm thời và xác nhận lại tại ruộng.",
      ],
      monitoringActions: [
        "Xác nhận giai đoạn sinh trưởng hiện tại để tăng độ chính xác của khuyến nghị.",
      ],
      avoidActions: [
        "Không đưa ra quyết định tưới chỉ dựa trên cảnh báo chung khi chưa biết độ mặn nguồn nước.",
      ],
      ...confidence,
      evidence,
      retrievedChunkIds: [
        stageKnowledge.id,
        ...(varietyKnowledge ? [varietyKnowledge.id] : []),
      ],
      dataNote:
        "Thiếu dữ liệu độ mặn. Tài liệu EUREKA yêu cầu hoàn thiện đầu vào bằng số đo tại ruộng hoặc dữ liệu trạm phù hợp trước khi sinh khuyến nghị.",
    };
  }

  const salinityBand = classifySalinity(input.salinity);
  const risk = assessRisk(salinityBand, input.salinity, stage, variety);
  const varietyText = varietyKnowledge
    ? ` ${varietyKnowledge.summary}`
    : " Chưa có bằng chứng riêng cho giống đã nhập nên hệ thống chỉ dùng khung chung cho cây lúa.";
  const highPriorityAction =
    risk === "critical"
      ? [
          `Đo xác nhận lại độ mặn ${input.salinity.toFixed(2)} g/L trước khi hành động nếu số đo chỉ có một lần.`,
        ]
      : [];

  return {
    id: `rice-rag-${stage}-${variety}-${salinityBand}`,
    title: `${RISK_LABELS[risk]} cho ${stageKnowledge.label}`,
    summary: `${stageKnowledge.impacts[salinityBand]}${varietyText}`,
    risk,
    riskLabel: RISK_LABELS[risk],
    salinityBand,
    stage,
    stageLabel: stageKnowledge.label,
    stageSource,
    variety,
    immediateActions: [
      ...highPriorityAction,
      ...stageKnowledge.actions[salinityBand],
    ].slice(0, 3),
    monitoringActions: [
      "Đo lại trước mỗi lần lấy nước và theo dõi xu hướng trong 24-48 giờ.",
      stageSource === "inferred"
        ? "Giai đoạn đang được ước tính từ ngày gieo sạ; hãy xác nhận lại theo tình trạng ruộng."
        : "Cập nhật giai đoạn khi cây chuyển pha để hệ thống truy xuất khuyến nghị mới.",
    ],
    avoidActions: [
      ...stageKnowledge.avoid,
      ...(varietyKnowledge ? [varietyKnowledge.caution] : []),
    ].slice(0, 2),
    ...confidence,
    evidence,
    retrievedChunkIds: [
      stageKnowledge.id,
      ...(varietyKnowledge ? [varietyKnowledge.id] : []),
      `salinity-${salinityBand}`,
    ],
    dataNote: getDataNote(input),
  };
}


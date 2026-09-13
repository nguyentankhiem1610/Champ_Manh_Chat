import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Droplets,
  Info,
  MapPin,
  ShieldAlert,
  Sparkles,
  Sprout,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  buildRiceRagRecommendation,
  type RecommendationRisk,
} from "../../lib/salinity/rag-recommendation.service";

interface AlertNotificationProps {
  province: string;
  salinity: number | null;
  latestDate?: string | null;
  latestStation?: string | null;
  salinitySource?: "field" | "regional_forecast";
  riceVariety?: string | null;
  growthStage?: string | null;
  sowingDate?: string | null;
  onViewDetails?: () => void;
}
interface RiskStyle {
  button: string;
  header: string;
  panel: string;
  badge: string;
  dot: string;
}

const RISK_STYLES: Record<RecommendationRisk, RiskStyle> = {
  unknown: {
    button:
      "bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700",
    header: "bg-gradient-to-r from-sky-600 to-blue-700",
    panel: "border-sky-200 bg-sky-50 text-sky-950",
    badge: "bg-sky-100 text-sky-800",
    dot: "bg-sky-400",
  },
  low: {
    button:
      "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
    header: "bg-gradient-to-r from-emerald-600 to-green-700",
    panel: "border-emerald-200 bg-emerald-50 text-emerald-950",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-400",
  },
  moderate: {
    button:
      "bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    header: "bg-gradient-to-r from-amber-500 to-orange-600",
    panel: "border-amber-200 bg-amber-50 text-amber-950",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
  },
  high: {
    button:
      "bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
    header: "bg-gradient-to-r from-orange-600 to-red-600",
    panel: "border-orange-200 bg-orange-50 text-orange-950",
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-500",
  },
  critical: {
    button:
      "bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800",
    header: "bg-gradient-to-r from-red-600 to-rose-700",
    panel: "border-red-200 bg-red-50 text-red-950",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
};

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AlertNotification({
  province,
  salinity,
  latestDate,
  latestStation,
  salinitySource = "regional_forecast",
  riceVariety,
  growthStage,
  sowingDate,
  onViewDetails,
}: AlertNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const recommendation = useMemo(
    () =>
      buildRiceRagRecommendation({
        province,
        salinity,
        salinitySource,
        riceVariety,
        growthStage,
        sowingDate,
        measuredAt: latestDate,
        station: latestStation,
      }),
    [
      growthStage,
      latestDate,
      latestStation,
      province,
      riceVariety,
      salinity,
      salinitySource,
      sowingDate,
    ],
  );
  const style = RISK_STYLES[recommendation.risk];
  const updatedAt = formatDate(latestDate);
  const isUrgent =
    recommendation.risk === "high" || recommendation.risk === "critical";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 top-24 z-40 rounded-full p-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${style.button} ${
          isUrgent ? "animate-pulse" : ""
        }`}
        title={`Khuyến nghị RAG: ${recommendation.riskLabel}`}
        aria-label={`Mở khuyến nghị canh tác: ${recommendation.riskLabel}`}
      >
        <Bell className="h-6 w-6" fill="currentColor" />
        <span
          className={`absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-black text-white shadow-md ${style.dot}`}
        >
          {recommendation.risk === "critical"
            ? "!!"
            : recommendation.risk === "high"
              ? "!"
              : "AI"}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <section
            className="mt-12 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:mt-16"
            onClick={(event) => event.stopPropagation()}
            aria-label="Khuyến nghị thích ứng xâm nhập mặn"
          >
            <header
              className={`flex items-start justify-between gap-4 p-5 text-white ${style.header}`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-white/15 p-2.5 ring-1 ring-white/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    Khuyến nghị có căn cứ từ EUREKA
                  </p>
                  <h2 className="text-lg font-bold leading-snug">
                    {recommendation.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                    <MapPin className="h-3.5 w-3.5" /> {province}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <Droplets className="mb-2 h-4 w-4 text-blue-600" />
                  <p className="text-[11px] font-semibold uppercase text-gray-500">
                    Độ mặn
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-950 sm:text-base">
                    {salinity === null
                      ? "Chưa có"
                      : `${salinity.toFixed(2)} g/L`}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <Sprout className="mb-2 h-4 w-4 text-emerald-600" />
                  <p className="text-[11px] font-semibold uppercase text-gray-500">
                    Giống
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold text-gray-950 sm:text-base">
                    {recommendation.variety === "unknown"
                      ? riceVariety || "Chưa rõ"
                      : recommendation.variety}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <Clock3 className="mb-2 h-4 w-4 text-violet-600" />
                  <p className="text-[11px] font-semibold uppercase text-gray-500">
                    Giai đoạn
                  </p>
                  <p className="mt-0.5 text-sm font-bold leading-tight text-gray-950 sm:text-base">
                    {recommendation.stageLabel}
                  </p>
                </div>
              </div>

              <div className={`rounded-xl border-2 p-4 ${style.panel}`}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}
                  >
                    {recommendation.riskLabel}
                  </span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    Tin cậy:{" "}
                    {recommendation.confidence === "high"
                      ? "cao"
                      : recommendation.confidence === "medium"
                        ? "khá"
                        : "giới hạn"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {recommendation.summary}
                </p>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-950">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  Hành động ngay
                </h3>
                <div className="space-y-2.5">
                  {recommendation.immediateActions.map((action, index) => (
                    <div
                      key={action}
                      className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-800">
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-950">
                    <CheckCircle2 className="h-4 w-4" /> Theo dõi tiếp
                  </h3>
                  <ul className="space-y-2 text-sm leading-relaxed text-emerald-900">
                    {recommendation.monitoringActions.map((action) => (
                      <li key={action} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-950">
                    <TriangleAlert className="h-4 w-4" /> Không nên làm
                  </h3>
                  <ul className="space-y-2 text-sm leading-relaxed text-rose-900">
                    {recommendation.avoidActions.map((action) => (
                      <li key={action} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-2 text-sm text-blue-950">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Chất lượng dữ liệu</p>
                    <p className="mt-1 leading-relaxed">
                      {recommendation.dataNote}
                    </p>
                    {(updatedAt || latestStation) && (
                      <p className="mt-2 text-xs text-blue-800">
                        {updatedAt ? `Cập nhật: ${updatedAt}` : ""}
                        {updatedAt && latestStation ? " • " : ""}
                        {latestStation ? `Trạm: ${latestStation}` : ""}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-blue-800">
                      {recommendation.confidenceLabel}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-500">
                Khuyến nghị hỗ trợ quyết định, không thay thế kiểm tra tại ruộng
                hoặc tư vấn của cán bộ nông nghiệp trong tình huống thiệt hại
                nghiêm trọng.
              </p>
            </div>

            <footer className="flex gap-3 border-t border-gray-200 bg-gray-50 p-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300"
              >
                Đã hiểu
              </button>
              {onViewDetails && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onViewDetails();
                  }}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Xem dữ liệu độ mặn
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

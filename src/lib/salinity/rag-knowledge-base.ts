export type SalinityBand = "low" | "medium" | "high" | "critical";

export type RiceGrowthStage =
  | "germination"
  | "seedling"
  | "tillering"
  | "panicle"
  | "flowering"
  | "grain_filling"
  | "maturity";

export type RiceVarietyKey =
  | "OM18"
  | "OM5451"
  | "Đài Thơm 8"
  | "IR4625"
  | "IR50404"
  | "ST24"
  | "unknown";

export interface KnowledgeSource {
  id: string;
  label: string;
  pages: string;
  evidence: "direct" | "general";
}

export interface StageKnowledge {
  id: string;
  label: string;
  irriStage: string;
  sensitivity: "lower" | "medium" | "high" | "very_high";
  impacts: Record<SalinityBand, string>;
  actions: Record<SalinityBand, string[]>;
  avoid: string[];
  sources: KnowledgeSource[];
}

export interface VarietyKnowledge {
  id: string;
  aliases: string[];
  summary: string;
  caution: string;
  directStages: RiceGrowthStage[];
  sources: KnowledgeSource[];
}

const frameworkSource: KnowledgeSource = {
  id: "eureka3-framework",
  label: "EUREKA (3) - Bảng 3.1, 3.2 và cơ chế khuyến nghị",
  pages: "22-31",
  evidence: "general",
};

const waterManagementSource: KnowledgeSource = {
  id: "eureka3-solutions",
  label: "EUREKA (3) - Ma trận giải pháp thích ứng theo giai đoạn",
  pages: "68-95",
  evidence: "general",
};

export const RICE_STAGE_KNOWLEDGE: Record<
  RiceGrowthStage,
  StageKnowledge
> = {
  germination: {
    id: "stage-germination",
    label: "Nảy mầm - mọc mầm",
    irriStage: "Stage 0",
    sensitivity: "medium",
    impacts: {
      low: "Nguy cơ nhìn chung thấp, nhưng mặn vẫn có thể làm cây mầm yếu sau khi nảy.",
      medium:
        "Sức sống cây mầm bắt đầu bị ảnh hưởng; cần quan tâm cả chất lượng cây sau nảy mầm.",
      high:
        "Vùng cảnh báo cho việc thiết lập cây; rễ, chiều cao và sinh khối có thể suy giảm.",
      critical:
        "Nguy cơ cao đối với cây mầm khỏe, dù hạt vẫn có thể nảy trong một số thí nghiệm.",
    },
    actions: {
      low: [
        "Dùng nguồn nước có độ mặn thấp nhất để ngâm, ủ và gieo.",
        "Theo dõi dự báo mặn trước khi quyết định ngày xuống giống.",
      ],
      medium: [
        "Chỉ xuống giống khi có cửa sổ nước tốt và xu hướng mặn không tăng.",
        "Nếu chưa gieo, cân nhắc lùi lịch ngắn hạn để tránh đợt mặn.",
      ],
      high: [
        "Ưu tiên né mặn bằng điều chỉnh ngày gieo thay vì dựa vào sức chịu mặn của giống.",
        "Chuẩn bị nguồn nước ngọt hoặc nước ít mặn trước khi ngâm ủ.",
      ],
      critical: [
        "Không dùng trực tiếp nguồn nước từ 4 g/L để ngâm, ủ hoặc gieo.",
        "Trì hoãn xuống giống cho đến khi có nguồn nước phù hợp hoặc cửa sổ mặn giảm.",
      ],
    },
    avoid: [
      "Không coi tỷ lệ nảy mầm cao là bằng chứng cây con sẽ tiếp tục khỏe trong môi trường mặn.",
    ],
    sources: [frameworkSource, waterManagementSource],
  },
  seedling: {
    id: "stage-seedling",
    label: "Mạ/cây con",
    irriStage: "Stage 1",
    sensitivity: "very_high",
    impacts: {
      low: "Nguy cơ thấp nhưng cần thận trọng vì cây con là một trong hai cửa sổ nhạy mặn nhất.",
      medium: "Stress có thể biểu hiện ở rễ, chiều cao, lá và sinh khối khi tiếp xúc kéo dài.",
      high: "Nguy cơ cao; tổn thương vùng rễ và sinh khối có thể tăng nhanh.",
      critical: "Nguy cơ rất cao, đặc biệt khi mặn kéo dài; khả năng thiết lập ruộng bị đe dọa.",
    },
    actions: {
      low: [
        "Đo độ mặn trước mỗi lần lấy nước và ưu tiên nước ngọt; nếu bất khả kháng chỉ xem xét mức dưới 1 g/L.",
        "Tránh để muối tích tụ lâu trong vùng rễ.",
      ],
      medium: [
        "Hạn chế lấy thêm nước mặn, rút ngắn thời gian cây tiếp xúc và tăng tần suất đo.",
        "Dùng nguồn nước tốt hơn để duy trì vùng rễ khi có điều kiện.",
      ],
      high: [
        "Chủ động ngừng hoặc hạn chế mạnh nguồn nước mặn.",
        "Tận dụng nước ngọt hoặc nước mưa để pha loãng/rửa mặn khi điều kiện thủy lợi cho phép.",
      ],
      critical: [
        "Ngừng đưa nước mặn vào ruộng và giảm thời gian phơi nhiễm càng nhanh càng tốt.",
        "Ưu tiên nước phù hợp để hạ mặn vùng rễ; liên hệ khuyến nông nếu cây đã biểu hiện cháy lá hoặc suy rễ.",
      ],
    },
    avoid: [
      "Không dùng tăng phân đơn thuần hoặc chế phẩm như biện pháp thay thế cho kiểm soát nước.",
    ],
    sources: [frameworkSource, waterManagementSource],
  },
  tillering: {
    id: "stage-tillering",
    label: "Đẻ nhánh - vươn lóng/đứng cái",
    irriStage: "Stage 2-3",
    sensitivity: "medium",
    impacts: {
      low: "Cây thường chịu mặn tương đối tốt hơn giai đoạn mạ, nhưng vẫn có nguy cơ tích lũy muối.",
      medium: "Nguy cơ trung bình; stress kéo dài có thể hạn chế sinh khối và phát triển nhánh.",
      high: "Cảnh báo cao, nhất là khi độ mặn tiếp tục tăng hoặc phơi nhiễm kéo dài.",
      critical: "Nguy cơ cao đến rất cao; sinh trưởng, số nhánh và năng suất có thể suy giảm.",
    },
    actions: {
      low: [
        "Có thể quản lý nước bình thường nhưng phải đo trước khi bơm và tránh tích tụ muối.",
        "Nếu thiếu nước ngọt, chỉ cân nhắc nước mặn nhẹ dưới 2 g/L theo hướng dẫn địa phương.",
      ],
      medium: [
        "Hạn chế thời gian tiếp xúc, theo dõi xu hướng tăng mặn và duy trì dinh dưỡng cân đối.",
        "Bảo tồn nguồn nước ngọt cho các giai đoạn làm đòng và trổ sắp tới.",
      ],
      high: [
        "Hạn chế hoặc ngừng lấy nước mặn nếu nồng độ còn tăng.",
        "Pha loãng hoặc rửa mặn bằng nguồn nước tốt khi có thể.",
      ],
      critical: [
        "Ngừng lấy nước mặn và giảm thời gian phơi nhiễm.",
        "Ưu tiên phục hồi vùng rễ bằng quản lý nước; dinh dưỡng chỉ là biện pháp hỗ trợ.",
      ],
    },
    avoid: ["Không tăng phân để cố bù cho stress mặn."],
    sources: [frameworkSource, waterManagementSource],
  },
  panicle: {
    id: "stage-panicle",
    label: "Phân hóa đòng - làm đòng",
    irriStage: "Stage 4",
    sensitivity: "high",
    impacts: {
      low: "Nồng độ còn thấp nhưng rủi ro tăng do cây bắt đầu chuyển sang sinh trưởng sinh sản.",
      medium: "Nguy cơ trung bình đến cao đối với hình thành bông và thành phần năng suất.",
      high: "Nguy cơ cao; đây là vùng cảnh báo trong một giai đoạn nhạy cảm.",
      critical: "Nguy cơ rất cao/tới hạn nếu kéo dài, trực tiếp đe dọa hình thành bông và năng suất.",
    },
    actions: {
      low: [
        "Ưu tiên nước ngọt; nếu bắt buộc dùng nước nhiễm mặn, chỉ xem xét mức dưới 1 g/L theo hướng dẫn chuyên môn.",
        "Đo độ mặn thường xuyên trước khi lấy nước.",
      ],
      medium: [
        "Hạn chế lấy nguồn nước này vào ruộng và giảm thời gian tiếp xúc.",
        "Dành nguồn nước ngọt cho ruộng đang hình thành đòng.",
      ],
      high: [
        "Ngừng hoặc hạn chế mạnh nguồn nước mặn; thay hoặc pha loãng bằng nước tốt nếu có.",
        "Theo dõi sát trong 24-48 giờ vì cây đang bước vào cửa sổ quyết định năng suất.",
      ],
      critical: [
        "Cắt nguồn mặn và ưu tiên nước ngọt cho ruộng đang làm đòng.",
        "Liên hệ cán bộ kỹ thuật địa phương nếu không thể hạ mặn hoặc cây đã biểu hiện stress.",
      ],
    },
    avoid: [
      "Không diễn giải một thí nghiệm ngắn hạn thành ngưỡng tưới an toàn cho cả giai đoạn.",
    ],
    sources: [frameworkSource, waterManagementSource],
  },
  flowering: {
    id: "stage-flowering",
    label: "Trổ - ra hoa - thụ phấn - thụ tinh",
    irriStage: "Stage 5-6",
    sensitivity: "very_high",
    impacts: {
      low: "Chỉ được xem là nguy cơ thấp khi mặn thực sự thấp và thời gian tiếp xúc ngắn.",
      medium: "Nguy cơ cao hơn cùng mức mặn ở đẻ nhánh vì có thể ảnh hưởng đậu hạt và số hạt/bông.",
      high: "Nguy cơ rất cao trong một trong những cửa sổ nhạy mặn nhất của lúa.",
      critical: "Mức tới hạn; nguy cơ giảm đậu hạt và năng suất rất lớn.",
    },
    actions: {
      low: [
        "Duy trì nguồn nước ổn định và ưu tiên nước ngọt; nếu bất khả kháng chỉ xem xét nước dưới 1 g/L.",
        "Tránh để độ mặn tăng đột ngột trong thời kỳ trổ.",
      ],
      medium: [
        "Hạn chế tối đa lấy thêm nước mặn và ưu tiên nước ngọt cho ruộng đang trổ.",
        "Tăng tần suất đo để phát hiện sớm xu hướng tăng.",
      ],
      high: [
        "Cảnh báo khẩn theo giai đoạn: ngừng đưa nước 3-<4 g/L vào ruộng.",
        "Thay hoặc pha loãng bằng nguồn nước tốt nếu hệ thống thủy lợi cho phép.",
      ],
      critical: [
        "Can thiệp ưu tiên cao nhất: cắt nguồn mặn và giảm thời gian stress tối đa.",
        "Nếu không thể hạ mặn, cần cảnh báo nguy cơ năng suất và liên hệ khuyến nông thay vì dựa vào vật tư bổ sung.",
      ],
    },
    avoid: [
      "Không coi phân bón, chất kích thích hoặc chế phẩm là giải pháp có thể loại bỏ rủi ro mặn ở giai đoạn trổ.",
    ],
    sources: [frameworkSource, waterManagementSource],
  },
  grain_filling: {
    id: "stage-grain-filling",
    label: "Vào sữa - chắc hạt",
    irriStage: "Stage 7-8",
    sensitivity: "medium",
    impacts: {
      low: "Nguy cơ tương đối thấp nếu mặn xuất hiện muộn và ngắn.",
      medium: "Stress kéo dài có thể làm giảm quang hợp và lượng vật chất chuyển vào hạt.",
      high: "Nguy cơ cao đối với tỷ lệ hạt chắc, khối lượng và chất lượng hạt.",
      critical: "Nguy cơ cao đến rất cao nếu hạt còn đang tích lũy mạnh hoặc stress kéo dài từ trổ.",
    },
    actions: {
      low: [
        "Duy trì đủ nước cho quá trình làm đầy hạt và hạn chế đưa thêm muối vào ruộng.",
        "Theo dõi mức chín thực tế trước khi quyết định ưu tiên nước.",
      ],
      medium: [
        "Tránh để mặn kéo dài và ưu tiên nguồn nước ít mặn khi có thể.",
        "Duy trì dinh dưỡng cân đối để hỗ trợ vận chuyển vật chất vào hạt.",
      ],
      high: [
        "Hạ mặn khi có nguồn nước phù hợp nếu hạt còn đang tích lũy mạnh.",
        "Nếu nước ngọt khan hiếm, ưu tiên ruộng đang làm đòng hoặc trổ trước.",
      ],
      critical: [
        "Giảm độ mặn nếu hạt chưa đạt chín sinh lý và nguồn nước cho phép.",
        "Phân bổ nước ngọt theo mức nhạy: ruộng làm đòng/trổ trước, ruộng chắc hạt sau.",
      ],
    },
    avoid: ["Không dùng tỷ lệ thiệt hại của giống khác để dự đoán trực tiếp cho ruộng hiện tại."],
    sources: [frameworkSource, waterManagementSource],
  },
  maturity: {
    id: "stage-maturity",
    label: "Chín - trước thu hoạch",
    irriStage: "Stage 9",
    sensitivity: "lower",
    impacts: {
      low: "Nguy cơ thấp khi hạt đã gần chín sinh lý.",
      medium: "Ảnh hưởng năng suất có thể hạn chế nếu mặn xuất hiện sát thu hoạch, nhưng muối vẫn tích lũy trong đất.",
      high: "Nguy cơ trung bình, phụ thuộc mức hoàn tất làm đầy hạt và thời gian còn lại trước thu hoạch.",
      critical: "Rủi ro vẫn đáng kể nếu hạt chưa chín sinh lý; nếu đã gần hoàn tất, trọng tâm chuyển sang vụ sau.",
    },
    actions: {
      low: [
        "Không đưa thêm muối vào ruộng; tập trung quản lý nước cuối vụ và chuẩn bị thu hoạch.",
        "Lập kế hoạch rửa mặn đất sau thu hoạch nếu có tích lũy muối.",
      ],
      medium: [
        "Hạn chế lấy thêm nước mặn và theo dõi mức chín thực tế.",
        "Chuẩn bị phương án rửa mặn đất và điều chỉnh lịch gieo vụ sau.",
      ],
      high: [
        "Nếu hạt gần chín sinh lý, ngừng lấy nước mặn và thu hoạch đúng thời điểm.",
        "Ưu tiên nguồn lực cho quản lý tồn dư muối hơn là dùng lượng lớn nước ngọt để cứu phần năng suất đã hình thành.",
      ],
      critical: [
        "Nếu hạt chưa hoàn tất làm đầy, giảm mặn khi có nguồn nước phù hợp; nếu đã gần chín, ưu tiên thu hoạch đúng lúc.",
        "Rửa mặn đất sau vụ và điều chỉnh lịch xuống giống vụ tiếp theo để né cửa sổ mặn cao.",
      ],
    },
    avoid: ["Không triển khai biện pháp chống mặn tốn kém khi hạt đã chín mà không đánh giá lợi ích thực tế."],
    sources: [frameworkSource, waterManagementSource],
  },
};

export const VARIETY_KNOWLEDGE: Record<
  Exclude<RiceVarietyKey, "unknown">,
  VarietyKnowledge
> = {
  OM18: {
    id: "variety-om18",
    aliases: ["om18", "om 18"],
    summary:
      "OM18 có thể chịu mặn tương đối tốt hơn sau giai đoạn cây con, nhưng rủi ro tăng rõ ở làm đòng và trổ; không có một ngưỡng an toàn cố định cho toàn chu kỳ.",
    caution:
      "Không dùng khả năng duy trì nảy mầm hoặc đẻ nhánh để suy đoán khả năng chịu mặn ở pha sinh sản.",
    directStages: ["germination", "seedling", "tillering"],
    sources: [
      {
        id: "eureka3-om18",
        label: "EUREKA (3) - Ma trận ảnh hưởng và giải pháp cho OM18",
        pages: "35-41, 68-73",
        evidence: "direct",
      },
    ],
  },
  OM5451: {
    id: "variety-om5451",
    aliases: ["om5451", "om 5451"],
    summary:
      "OM5451 có bằng chứng trực tiếp tốt ở nảy mầm, cây con và một phần đẻ nhánh/làm đòng; tỷ lệ nảy mầm cao không đồng nghĩa cây con không bị tổn thương.",
    caution:
      "Brassinolide hoặc CaO chỉ là bằng chứng hỗ trợ trong điều kiện nghiên cứu, không thay thế kiểm soát nguồn nước và không tự suy ra liều dùng ngoài đồng.",
    directStages: ["germination", "seedling", "tillering", "panicle"],
    sources: [
      {
        id: "eureka2-om5451",
        label: "EUREKA (2) - Bảng 1, 2 về OM5451",
        pages: "1-9",
        evidence: "direct",
      },
      {
        id: "eureka3-om5451",
        label: "EUREKA (3) - Ma trận OM5451",
        pages: "42-48, 74-79",
        evidence: "direct",
      },
    ],
  },
  "Đài Thơm 8": {
    id: "variety-dai-thom-8",
    aliases: ["đài thơm 8", "dai thom 8", "dt8"],
    summary:
      "Đài Thơm 8 cần theo dõi đặc biệt ở cây con; bằng chứng cho thấy stress sinh hóa và suy giảm sinh khối rễ quanh 2,92 g/L.",
    caution:
      "Biện pháp sinh học chỉ đứng sau né mặn, kiểm soát nước và rửa/pha loãng; không thay thế quản lý nước ở 3-4 g/L trở lên.",
    directStages: ["seedling", "tillering"],
    sources: [
      {
        id: "eureka3-dt8",
        label: "EUREKA (3) - Ma trận Đài Thơm 8",
        pages: "49-53, 80-84",
        evidence: "direct",
      },
    ],
  },
  IR4625: {
    id: "variety-ir4625",
    aliases: ["ir4625", "ir 4625"],
    summary:
      "IR4625 là giống nếp đặc sản có mức mẫn cảm trung bình trong sàng lọc; chưa đủ bằng chứng để xem là giống chịu mặn chuyên dụng.",
    caution:
      "Ưu tiên né mặn và quản lý nước; không tự động đề xuất vật tư, phân bón hay chế phẩm riêng cho IR4625 khi thiếu bằng chứng đúng tổ hợp.",
    directStages: ["seedling"],
    sources: [
      {
        id: "eureka2-ir4625",
        label: "EUREKA (2) - Bảng 3, 4 về IR4625",
        pages: "10-19",
        evidence: "direct",
      },
      {
        id: "eureka3-ir4625",
        label: "EUREKA (3) - Ma trận IR4625",
        pages: "53-60, 85-90",
        evidence: "direct",
      },
    ],
  },
  IR50404: {
    id: "variety-ir50404",
    aliases: ["ir50404", "ir 50404"],
    summary:
      "IR50404 có bằng chứng trực tiếp ở cây con và sau cấy; tiếp xúc 4 g/L sớm hoặc lặp lại gây ảnh hưởng mạnh hơn tiếp xúc muộn.",
    caution:
      "Silic và vi khuẩn hòa tan khoáng silic mới là giải pháp hỗ trợ trong điều kiện thí nghiệm, chưa đủ để khuyến cáo chủng hoặc liều lượng ngoài đồng.",
    directStages: ["seedling", "tillering", "panicle"],
    sources: [
      {
        id: "eureka2-ir50404",
        label: "EUREKA (2) - Bảng 5, 6 về IR50404",
        pages: "19-28",
        evidence: "direct",
      },
      {
        id: "eureka3-ir50404",
        label: "EUREKA (3) - Ma trận IR50404",
        pages: "61-67, 90-95",
        evidence: "direct",
      },
    ],
  },
  ST24: {
    id: "variety-st24",
    aliases: ["st24", "st 24"],
    summary:
      "ST24 có bằng chứng trực tiếp cho thấy cùng mức mặn nhưng tác động nặng nhất khi xuất hiện ở giai đoạn trổ.",
    caution:
      "Khả năng thích nghi vùng lúa-tôm không đồng nghĩa không mất năng suất; chế phẩm hỗ trợ không thể thay thế kiểm soát nước mặn cao.",
    directStages: ["seedling", "tillering", "flowering"],
    sources: [
      {
        id: "eureka2-st24",
        label: "EUREKA (2) - Bảng 7, 8 về ST24",
        pages: "28-37",
        evidence: "direct",
      },
    ],
  },
};


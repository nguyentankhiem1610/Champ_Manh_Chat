// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Sprout,
  MapPin,
  Calendar,
  Layers,
  TrendingUp,
  Edit3,
  Check,
  X,
  Navigation,
  Compass,
  User,
  Phone,
  Home,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Waves,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserProfile, UpdateProfileData } from "../../lib/auth/auth.types";

interface FarmerFarmingProfileProps {
  editable?: boolean;
  userProfile?: UserProfile | null;
  onUpdated?: () => void;
}

const RICE_VARIETIES = [
  "OM18",
  "OM5451",
  "Đài Thơm 8",
  "IR4625",
  "IR50404",
  "ST24",
  "Khác",
];

const FARMING_MODELS = [
  "Lúa độc canh – chỉ sản xuất lúa",
  "Lúa – Lúa – sản xuất nhiều vụ lúa trong năm",
  "Lúa – Tôm – luân canh lúa và tôm",
  "Lúa – Màu – luân canh lúa với cây màu",
  "Khác",
];

const CROP_SEASONS = [
  "Đông Xuân",
  "Hè Thu",
  "Thu Đông",
  "Vụ Mùa",
  "Khác",
];

const GROWTH_STAGES = [
  { id: "Gieo sạ", label: "Gieo sạ", icon: "🌱", days: "0 - 7 ngày" },
  { id: "Mạ", label: "Mạ", icon: "🌿", days: "7 - 20 ngày" },
  { id: "Đẻ nhánh", label: "Đẻ nhánh", icon: "🌾", days: "20 - 40 ngày" },
  { id: "Làm đòng", label: "Làm đòng", icon: "🌾", days: "40 - 60 ngày" },
  { id: "Trổ", label: "Trổ", icon: "🌾", days: "60 - 75 ngày" },
  { id: "Chín", label: "Chín", icon: "🌾", days: "75 - 95 ngày" },
  { id: "Thu hoạch", label: "Thu hoạch", icon: "🚜", days: "95 - 105+ ngày" },
];

export function FarmerFarmingProfile({
  editable = true,
  userProfile,
  onUpdated,
}: FarmerFarmingProfileProps) {
  const { profile: currentAuthProfile, updateProfile } = useAuth();
  const profile = userProfile || currentAuthProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [farmAddress, setFarmAddress] = useState("");

  const [cropType, setCropType] = useState("Lúa");
  const [cropTypeOther, setCropTypeOther] = useState("");
  const [farmArea, setFarmArea] = useState<string>("");
  const [gpsLat, setGpsLat] = useState<string>("");
  const [gpsLng, setGpsLng] = useState<string>("");
  const [gpsLocationName, setGpsLocationName] = useState("");

  const [farmingModel, setFarmingModel] = useState("Lúa độc canh – chỉ sản xuất lúa");
  const [farmingModelOther, setFarmingModelOther] = useState("");

  const [riceVariety, setRiceVariety] = useState("OM18");
  const [riceVarietyOther, setRiceVarietyOther] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [cropSeason, setCropSeason] = useState("Đông Xuân");
  const [cropSeasonOther, setCropSeasonOther] = useState("");
  const [growthStage, setGrowthStage] = useState("Đẻ nhánh");
  const [expectedYield, setExpectedYield] = useState<string>("");
  const [currentSalinity, setCurrentSalinity] = useState<string>("");

  // Sync state when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
      setFarmAddress(profile.farm_address || "");

      setCropType(profile.crop_type || "Lúa");
      setFarmArea(profile.farm_area !== undefined && profile.farm_area !== null ? String(profile.farm_area) : "");
      setGpsLat(profile.gps_lat !== undefined && profile.gps_lat !== null ? String(profile.gps_lat) : "");
      setGpsLng(profile.gps_lng !== undefined && profile.gps_lng !== null ? String(profile.gps_lng) : "");
      setGpsLocationName(profile.gps_location_name || "");

      const isKnownModel = FARMING_MODELS.includes(profile.farming_model || "");
      if (profile.farming_model && !isKnownModel) {
        setFarmingModel("Khác");
        setFarmingModelOther(profile.farming_model);
      } else {
        setFarmingModel(profile.farming_model || "Lúa độc canh – chỉ sản xuất lúa");
        setFarmingModelOther(profile.farming_model_other || "");
      }

      const isKnownVariety = RICE_VARIETIES.includes(profile.rice_variety || "");
      if (profile.rice_variety && !isKnownVariety) {
        setRiceVariety("Khác");
        setRiceVarietyOther(profile.rice_variety);
      } else {
        setRiceVariety(profile.rice_variety || "OM18");
        setRiceVarietyOther(profile.rice_variety_other || "");
      }

      setSowingDate(profile.sowing_date ? profile.sowing_date.split("T")[0] : "");

      const isKnownSeason = CROP_SEASONS.includes(profile.crop_season || "");
      if (profile.crop_season && !isKnownSeason) {
        setCropSeason("Khác");
        setCropSeasonOther(profile.crop_season);
      } else {
        setCropSeason(profile.crop_season || "Đông Xuân");
        setCropSeasonOther(profile.crop_season_other || "");
      }

      setGrowthStage(profile.growth_stage || "Đẻ nhánh");
      setExpectedYield(profile.expected_yield !== undefined && profile.expected_yield !== null ? String(profile.expected_yield) : "");
      setCurrentSalinity(profile.current_salinity !== undefined && profile.current_salinity !== null ? String(profile.current_salinity) : "");
    }
  }, [profile]);

  // Handle get current GPS Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Trình duyệt không hỗ trợ định vị GPS");
      return;
    }

    setLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGpsLat(lat.toFixed(6));
        setGpsLng(lng.toFixed(6));
        setGpsLocationName(
          `Toạ độ: ${lat.toFixed(4)}°B, ${lng.toFixed(4)}°Đ`
        );
        setLocating(false);
      },
      (error) => {
        console.warn("Lỗi lấy vị trí GPS:", error);
        setErrorMessage("Không thể lấy toạ độ GPS. Vui lòng bật quyền vị trí hoặc nhập tay.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const updateData: UpdateProfileData = {
      phone_number: phoneNumber.trim() || undefined,
      full_name: fullName.trim() || null,
      farm_address: farmAddress.trim() || null,
      crop_type: cropType === "Khác" ? cropTypeOther.trim() || "Lúa" : cropType,
      farm_area: farmArea ? parseFloat(farmArea) : null,
      gps_lat: gpsLat ? parseFloat(gpsLat) : null,
      gps_lng: gpsLng ? parseFloat(gpsLng) : null,
      gps_location_name: gpsLocationName.trim() || null,
      farming_model: farmingModel === "Khác" ? (farmingModelOther.trim() || "Khác") : farmingModel,
      farming_model_other: farmingModelOther.trim() || null,
      rice_variety: riceVariety === "Khác" ? (riceVarietyOther.trim() || "Khác") : riceVariety,
      rice_variety_other: riceVarietyOther.trim() || null,
      sowing_date: sowingDate || null,
      crop_season: cropSeason === "Khác" ? (cropSeasonOther.trim() || "Khác") : cropSeason,
      crop_season_other: cropSeasonOther.trim() || null,
      growth_stage: growthStage || null,
      expected_yield: expectedYield ? parseFloat(expectedYield) : null,
      current_salinity: currentSalinity ? parseFloat(currentSalinity) : null,
    };

    const res = await updateProfile(updateData);
    setSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1500);
      onUpdated?.();
    } else {
      setErrorMessage(res.error || "Không thể lưu thông tin. Vui lòng thử lại!");
    }
  };

  // Calculate days since sowing
  const getDaysSinceSowing = () => {
    if (!profile?.sowing_date) return null;
    const sow = new Date(profile.sowing_date);
    const now = new Date();
    const diffTime = now.getTime() - sow.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const daysSinceSow = getDaysSinceSowing();
  const currentStageIndex = GROWTH_STAGES.findIndex(
    (s) => s.id === (profile?.growth_stage || "Đẻ nhánh")
  );

  const hasFarmingData = Boolean(
    profile?.full_name ||
    profile?.farm_address ||
    profile?.farm_area ||
    profile?.rice_variety ||
    profile?.sowing_date ||
    profile?.crop_season ||
    profile?.growth_stage ||
    profile?.expected_yield ||
    (profile?.current_salinity !== undefined && profile?.current_salinity !== null)
  );

  return (
    <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Thông tin sản xuất & Canh tác</h3>
              </div>
              <p className="text-emerald-100/90 text-xs mt-0.5">
                Hồ sơ thông tin canh tác và theo dõi mùa vụ của nông hộ
              </p>
            </div>
          </div>

          {editable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-emerald-700" />
              {hasFarmingData ? "Chỉnh sửa" : "Điền thông tin"}
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="p-5 space-y-6">
          {!hasFarmingData && (
            <div className="bg-emerald-50/70 border border-dashed border-emerald-300 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Chưa cập nhật thông tin sản xuất
              </h4>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
                Điền đầy đủ thông tin về loại cây trồng, diện tích, giống lúa, vị trí GPS và lịch thời vụ để nhận hỗ trợ dự báo độ mặn và kết nối tiêu thụ nông sản tốt nhất.
              </p>
              {editable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Điền thông tin ngay
                </button>
              )}
            </div>
          )}

          {hasFarmingData && (
            <>
              {/* SECTION 1: THÔNG TIN CÁ NHÂN */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  1. Thông tin cá nhân
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Họ và tên</span>
                    <span className="font-semibold text-gray-900">
                      {profile?.full_name || profile?.username || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Số điện thoại</span>
                    <span className="font-semibold text-gray-900">
                      {profile?.phone_number || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Địa chỉ sản xuất</span>
                    <span className="font-semibold text-gray-900 line-clamp-1" title={profile?.farm_address || ""}>
                      {profile?.farm_address || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: THÔNG TIN SẢN XUẤT 🌾 */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-base">🌾</span>
                  2. Thông tin sản xuất
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* 2.1 Loại cây trồng */}
                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-medium block mb-1">
                      2.1. Loại cây trồng
                    </span>
                    <span className="font-bold text-emerald-950 text-base">
                      {profile?.crop_type || "Lúa"}
                    </span>
                  </div>

                  {/* 2.2 Diện tích canh tác */}
                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-medium block mb-1">
                      2.2. Diện tích canh tác
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-900">
                        {profile?.farm_area ? profile.farm_area : "—"}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">ha</span>
                    </div>
                  </div>

                  {/* Vị trí GPS */}
                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 sm:col-span-2 lg:col-span-1">
                    <span className="text-xs text-emerald-700 font-medium block mb-1">
                      Vị trí GPS
                    </span>
                    {profile?.gps_lat && profile?.gps_lng ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-gray-800">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{Number(profile.gps_lat).toFixed(4)}, {Number(profile.gps_lng).toFixed(4)}</span>
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${profile.gps_lat},${profile.gps_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5"
                        >
                          Xem bản đồ
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Chưa gắn toạ độ GPS</span>
                    )}
                  </div>

                  {/* 2.3 Mô hình canh tác */}
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 sm:col-span-2 lg:col-span-3">
                    <span className="text-xs text-gray-500 block mb-1">
                      2.3. Mô hình canh tác hiện tại
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {profile?.farming_model || "Chưa cập nhật"}
                    </span>
                  </div>

                  {/* 2.4 Độ mặn hiện tại */}
                  <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 sm:col-span-2 lg:col-span-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-blue-800 font-medium block mb-1 flex items-center gap-1.5">
                          <Waves className="w-3.5 h-3.5 text-blue-600" />
                          2.4. Độ mặn hiện tại tại ruộng
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-blue-950">
                            {profile?.current_salinity !== undefined && profile?.current_salinity !== null
                              ? profile.current_salinity
                              : "—"}
                          </span>
                          <span className="text-xs font-bold text-blue-800">‰ (g/lít)</span>
                        </div>
                      </div>

                      {profile?.current_salinity !== undefined && profile?.current_salinity !== null && (
                        <div>
                          {Number(profile.current_salinity) < 1.0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">
                              🟢 Nước ngọt an toàn (&lt; 1‰)
                            </span>
                          ) : Number(profile.current_salinity) <= 2.0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                              🟡 Nhiễm mặn nhẹ (1 - 2‰) - Theo dõi
                            </span>
                          ) : Number(profile.current_salinity) <= 4.0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full border border-orange-200">
                              🟠 Nhiễm mặn cao (2 - 4‰) - Hạn chế tưới
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">
                              🔴 Rất nguy hiểm (&gt; 4‰) - Ngừng lấy nước
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: THÔNG TIN MÙA VỤ */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  3. Thông tin mùa vụ
                </h4>

                {/* Cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {/* 3.1 Giống đang sử dụng */}
                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
                    <span className="text-xs text-amber-800 font-medium block mb-1">
                      3.1. Giống lúa
                    </span>
                    <span className="font-bold text-amber-950 text-base">
                      {profile?.rice_variety || "Chưa chọn"}
                    </span>
                  </div>

                  {/* 3.2 Ngày gieo sạ */}
                  <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                    <span className="text-xs text-blue-800 font-medium block mb-1">
                      3.2. Ngày gieo sạ
                    </span>
                    <span className="font-bold text-blue-950 text-sm block">
                      {profile?.sowing_date
                        ? new Date(profile.sowing_date).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"}
                    </span>
                    {daysSinceSow !== null && (
                      <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
                        (Đã gieo {daysSinceSow} ngày)
                      </span>
                    )}
                  </div>

                  {/* 3.3 Vụ sản xuất */}
                  <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
                    <span className="text-xs text-purple-800 font-medium block mb-1">
                      3.3. Vụ sản xuất
                    </span>
                    <span className="font-bold text-purple-950 text-base">
                      {profile?.crop_season || "Chưa chọn"}
                    </span>
                  </div>

                  {/* 3.5 Sản lượng dự kiến */}
                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-medium block mb-1">
                      3.5. Sản lượng dự kiến
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-emerald-950">
                        {profile?.expected_yield ? profile.expected_yield : "—"}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">tấn/vụ</span>
                    </div>
                  </div>
                </div>

                {/* 3.4 Giai đoạn sinh trưởng visual tracker */}
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">
                      3.4. Giai đoạn sinh trưởng hiện tại:
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      {profile?.growth_stage || "Gieo sạ"}
                    </span>
                  </div>

                  {/* Visual timeline */}
                  <div className="grid grid-cols-7 gap-1">
                    {GROWTH_STAGES.map((stage, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div
                          key={stage.id}
                          className={`flex flex-col items-center text-center p-1.5 rounded-lg transition-all ${isCurrent
                              ? "bg-emerald-600 text-white font-bold shadow-sm scale-105"
                              : isPast
                                ? "bg-emerald-100 text-emerald-900 font-medium"
                                : "bg-white text-gray-400"
                            }`}
                        >
                          <span className="text-base mb-0.5">{stage.icon}</span>
                          <span className="text-[10px] leading-tight line-clamp-1">
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* EDIT MODE FORM */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-5 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Đã lưu thông tin hồ sơ sản xuất thành công!</span>
            </div>
          )}

          {/* 1. THÔNG TIN CÁ NHÂN */}
          <div className="border-b border-gray-100 pb-5">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              1. Thông tin cá nhân
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ sản xuất
                </label>
                <input
                  type="text"
                  value={farmAddress}
                  onChange={(e) => setFarmAddress(e.target.value)}
                  placeholder="Ấp, Xã, Huyện, Tỉnh..."
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. THÔNG TIN SẢN XUẤT 🌾 */}
          <div className="border-b border-gray-100 pb-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="text-base">🌾</span>
              2. THÔNG TIN SẢN XUẤT
            </h4>

            {/* 2.1 Loại cây trồng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                2.1. Loại cây trồng: Bạn đang sản xuất cây trồng gì?
              </label>
              <div className="flex flex-wrap gap-2">
                {["Lúa", "Khác"].map((c) => (
                  <label
                    key={c}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${cropType === c
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="crop_type"
                      checked={cropType === c}
                      onChange={() => setCropType(c)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
              {cropType === "Khác" && (
                <input
                  type="text"
                  value={cropTypeOther}
                  onChange={(e) => setCropTypeOther(e.target.value)}
                  placeholder="Nhập tên cây trồng khác..."
                  className="mt-2 w-full max-w-xs px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              )}
            </div>

            {/* 2.2 Diện tích canh tác & GPS */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                2.2. Diện tích canh tác & Vị trí GPS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Diện tích sản xuất (ha)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={farmArea}
                      onChange={(e) => setFarmArea(e.target.value)}
                      placeholder="Ví dụ: 2.5"
                      className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-12"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-bold">
                      ha
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-gray-500">
                      Vị trí GPS (Toạ độ thửa ruộng)
                    </label>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
                    >
                      <Navigation className={`w-3 h-3 ${locating ? "animate-spin" : ""}`} />
                      {locating ? "Đang định vị..." : "📍 Lấy vị trí hiện tại"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={gpsLat}
                      onChange={(e) => setGpsLat(e.target.value)}
                      placeholder="Vĩ độ (Lat)"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                    />
                    <input
                      type="number"
                      step="any"
                      value={gpsLng}
                      onChange={(e) => setGpsLng(e.target.value)}
                      placeholder="Kinh độ (Lng)"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2.3 Mô hình canh tác hiện tại */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                2.3. Mô hình canh tác hiện tại: Bạn đang sản xuất theo mô hình nào?
              </label>
              <div className="space-y-2">
                {FARMING_MODELS.map((model) => (
                  <label
                    key={model}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${farmingModel === model
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-medium"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="farming_model"
                      checked={farmingModel === model}
                      onChange={() => setFarmingModel(model)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{model}</span>
                  </label>
                ))}
              </div>
              {farmingModel === "Khác" && (
                <input
                  type="text"
                  value={farmingModelOther}
                  onChange={(e) => setFarmingModelOther(e.target.value)}
                  placeholder="Nhập mô hình canh tác cụ thể..."
                  className="mt-2 w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              )}
            </div>

            {/* 2.4 Độ mặn hiện tại */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  2.4. Độ mặn hiện tại tại ruộng (‰ hoặc g/L)
                </label>
                <span className="text-[11px] text-gray-500">
                  Mức an toàn cho lúa: &lt; 1.0 ‰
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative w-full sm:w-48">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentSalinity}
                    onChange={(e) => setCurrentSalinity(e.target.value)}
                    placeholder="Ví dụ: 0.8"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-12 font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-bold">
                    ‰
                  </span>
                </div>

                {/* Quick preset chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs text-gray-400">Chọn nhanh:</span>
                  {[0.2, 0.5, 0.8, 1.2, 2.0, 3.5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCurrentSalinity(String(val))}
                      className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${currentSalinity === String(val)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      {val} ‰
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. THÔNG TIN MÙA VỤ */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              3. THÔNG TIN MÙA VỤ
            </h4>

            {/* 3.1 Giống đang sử dụng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                3.1. Giống đang sử dụng: Bạn đang sử dụng giống lúa nào?
              </label>
              <div className="flex flex-wrap gap-2">
                {RICE_VARIETIES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRiceVariety(v)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${riceVariety === v
                        ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {riceVariety === "Khác" && (
                <input
                  type="text"
                  value={riceVarietyOther}
                  onChange={(e) => setRiceVarietyOther(e.target.value)}
                  placeholder="Nhập tên giống lúa khác..."
                  className="mt-2 w-full max-w-xs px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              )}
            </div>

            {/* 3.2 Ngày gieo sạ & 3.3 Vụ sản xuất */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  3.2. Ngày gieo sạ / trồng
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  3.3. Vụ sản xuất: Bạn đang sản xuất vụ nào?
                </label>
                <select
                  value={cropSeason}
                  onChange={(e) => setCropSeason(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  {CROP_SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {cropSeason === "Khác" && (
                  <input
                    type="text"
                    value={cropSeasonOther}
                    onChange={(e) => setCropSeasonOther(e.target.value)}
                    placeholder="Nhập vụ sản xuất khác..."
                    className="mt-2 w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                )}
              </div>
            </div>

            {/* 3.4 Giai đoạn sinh trưởng hiện tại */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                3.4. Giai đoạn sinh trưởng hiện tại: Cây lúa hiện đang ở giai đoạn nào?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {GROWTH_STAGES.map((stg) => {
                  const isSelected = growthStage === stg.id;
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setGrowthStage(stg.id)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white font-bold shadow-md ring-2 ring-emerald-300"
                          : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                    >
                      <span className="text-xl mb-1">{stg.icon}</span>
                      <span className="text-xs">{stg.label}</span>
                      <span
                        className={`text-[10px] mt-0.5 ${isSelected ? "text-emerald-100" : "text-gray-400"
                          }`}
                      >
                        {stg.days}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3.5 Sản lượng dự kiến */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                3.5. Sản lượng dự kiến
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(e.target.value)}
                  placeholder="Ví dụ: 6.5"
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-16"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">
                  tấn/vụ
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrorMessage(null);
              }}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Lưu thông tin
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

import Layout from "@/components/Layout";
import { MapView } from "@/components/Map";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Activity,
  MapPin,
  Radio,
  Zap,
  TrendingUp,
  Clock,
  Gauge,
  Heart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Status = "normal" | "danger" | "warning";
type Action = "walking" | "standing" | "running" | "falling" | "impact";

interface MonitoringData {
  id: string;
  name: string;
  status: Status;
  action: Action;
  location: google.maps.LatLngLiteral;
  lastUpdate: string;
  timestamp: string;
  battery: number;
  heartRate: number;
  riskLevel: number;
  aiConfidence: number;
}

const generateMonitoringData = (): MonitoringData[] => [
  {
    id: "SEC-001",
    name: "أحمد محمد العتيبي",
    status: "normal",
    action: "walking",
    location: { lat: 24.7455, lng: 46.6260 },
    lastUpdate: "الآن",
    timestamp: new Date().toISOString(),
    battery: 85,
    heartRate: 72,
    riskLevel: 5,
    aiConfidence: 98,
  },
  {
    id: "SEC-002",
    name: "خالد عبدالله السالم",
    status: "danger",
    action: "falling",
    location: { lat: 24.7565, lng: 46.6753 },
    lastUpdate: "منذ دقيقة",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    battery: 42,
    heartRate: 110,
    riskLevel: 95,
    aiConfidence: 96,
  },
  {
    id: "SEC-003",
    name: "فهد ناصر القحطاني",
    status: "normal",
    action: "standing",
    location: { lat: 24.7245, lng: 46.6100 },
    lastUpdate: "الآن",
    timestamp: new Date().toISOString(),
    battery: 92,
    heartRate: 68,
    riskLevel: 2,
    aiConfidence: 99,
  },
  {
    id: "SEC-004",
    name: "سعد إبراهيم الدوسري",
    status: "warning",
    action: "impact",
    location: { lat: 24.7725, lng: 46.6450 },
    lastUpdate: "منذ دقيقتين",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    battery: 15,
    heartRate: 95,
    riskLevel: 65,
    aiConfidence: 94,
  },
  {
    id: "SEC-005",
    name: "محمد علي الزهراني",
    status: "normal",
    action: "walking",
    location: { lat: 24.6875, lng: 46.6950 },
    lastUpdate: "الآن",
    timestamp: new Date().toISOString(),
    battery: 78,
    heartRate: 75,
    riskLevel: 8,
    aiConfidence: 97,
  },
];

export default function RealtimeMonitoring() {
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>(
    generateMonitoringData()
  );
  const [selectedPersonnel, setSelectedPersonnel] = useState<MonitoringData | null>(
    monitoringData[0]
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const dangerCount = monitoringData.filter((p) => p.status === "danger").length;
  const warningCount = monitoringData.filter((p) => p.status === "warning").length;
  const normalCount = monitoringData.filter((p) => p.status === "normal").length;

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    monitoringData.forEach((p) => {
      const markerContent = document.createElement("div");
      markerContent.className = `w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg ${
        p.status === "danger"
          ? "bg-red-500 border-white animate-pulse"
          : p.status === "warning"
          ? "bg-yellow-500 border-white"
          : "bg-green-500 border-white"
      }`;
      markerContent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: p.location,
        title: p.name,
        content: markerContent,
      });

      marker.addListener("click", () => {
        setSelectedPersonnel(p);
        mapRef.current?.panTo(p.location);
        mapRef.current?.setZoom(16);
      });

      markersRef.current.push(marker);
    });
  }, [monitoringData]);

  const getRiskColor = (level: number) => {
    if (level >= 80) return "text-red-600";
    if (level >= 50) return "text-orange-600";
    if (level >= 20) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskBgColor = (level: number) => {
    if (level >= 80) return "bg-red-50";
    if (level >= 50) return "bg-orange-50";
    if (level >= 20) return "bg-yellow-50";
    return "bg-green-50";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/10 pb-20">
        <div className="container py-8 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Radio className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                وحدة الرصد اللحظي
              </h1>
            </div>
            <p className="text-muted-foreground">
              مراقبة فورية وتحليل ذكي لحالة رجال الأمن في الميدان
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">إجمالي الأفراد</p>
                  <p className="text-3xl font-bold text-primary">
                    {monitoringData.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-2">طبيعي</p>
                  <p className="text-3xl font-bold text-green-600">{normalCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-yellow-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-yellow-700 mb-2">تحذير</p>
                  <p className="text-3xl font-bold text-yellow-600">{warningCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-red-700 mb-2">خطر</p>
                  <p className="text-3xl font-bold text-red-600">{dangerCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Monitoring Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map */}
            <Card className="lg:col-span-2 border-none shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b bg-muted/30">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  الخريطة الحية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                <MapView />
              </CardContent>
            </Card>

            {/* Personnel Details */}
            <Card className="border-none shadow-lg flex flex-col overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-lg font-heading">بيانات الفرد</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                {selectedPersonnel ? (
                  <div
                    className={cn(
                      "p-6 h-full flex flex-col",
                      getRiskBgColor(selectedPersonnel.riskLevel)
                    )}
                  >
                    {/* Personnel Info */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center border-2",
                            selectedPersonnel.status === "danger"
                              ? "bg-red-100 border-red-300 text-red-600"
                              : selectedPersonnel.status === "warning"
                              ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                              : "bg-green-100 border-green-300 text-green-600"
                          )}
                        >
                          <Activity className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{selectedPersonnel.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedPersonnel.id}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className={cn(
                          "w-full justify-center py-1 text-xs",
                          selectedPersonnel.status === "danger" &&
                            "bg-red-600 hover:bg-red-700",
                          selectedPersonnel.status === "warning" &&
                            "bg-yellow-600 hover:bg-yellow-700 text-white",
                          selectedPersonnel.status === "normal" &&
                            "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        {selectedPersonnel.status === "danger"
                          ? "حالة خطرة"
                          : selectedPersonnel.status === "warning"
                          ? "حالة تحذيرية"
                          : "حالة طبيعية"}
                      </Badge>
                    </div>

                    {/* Vital Signs */}
                    <div className="space-y-3 mb-6 pb-6 border-b">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Heart className="h-4 w-4" /> نبض القلب
                        </span>
                        <span className="font-bold">{selectedPersonnel.heartRate} bpm</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Zap className="h-4 w-4" /> البطارية
                        </span>
                        <span className="font-bold">{selectedPersonnel.battery}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" /> آخر تحديث
                        </span>
                        <span className="font-bold text-xs">
                          {selectedPersonnel.lastUpdate}
                        </span>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold flex items-center gap-2">
                            <Gauge className="h-4 w-4" /> مستوى الخطورة
                          </span>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              getRiskColor(selectedPersonnel.riskLevel)
                            )}
                          >
                            {selectedPersonnel.riskLevel}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              selectedPersonnel.riskLevel >= 80
                                ? "bg-red-600"
                                : selectedPersonnel.riskLevel >= 50
                                ? "bg-orange-600"
                                : selectedPersonnel.riskLevel >= 20
                                ? "bg-yellow-600"
                                : "bg-green-600"
                            )}
                            style={{
                              width: `${selectedPersonnel.riskLevel}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> ثقة الذكاء الاصطناعي
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            {selectedPersonnel.aiConfidence}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${selectedPersonnel.aiConfidence}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    اختر فرداً من القائمة
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Personnel List */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-heading">
                قائمة الأفراد المراقبين
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="divide-y">
                  {monitoringData.map((personnel) => (
                    <div
                      key={personnel.id}
                      onClick={() => setSelectedPersonnel(personnel)}
                      className={cn(
                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-4",
                        selectedPersonnel?.id === personnel.id
                          ? "bg-primary/10 border-l-primary"
                          : "border-l-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center border",
                              personnel.status === "danger"
                                ? "bg-red-100 border-red-200 text-red-600"
                                : personnel.status === "warning"
                                ? "bg-yellow-100 border-yellow-200 text-yellow-600"
                                : "bg-green-100 border-green-200 text-green-600"
                            )}
                          >
                            <Activity className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{personnel.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Heart className="h-3 w-3" />
                              {personnel.heartRate} bpm
                              <span>•</span>
                              {personnel.battery}% بطارية
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Badge
                              variant={
                                personnel.status === "danger"
                                  ? "destructive"
                                  : personnel.status === "warning"
                                  ? "secondary"
                                  : "outline"
                              }
                              className={cn(
                                personnel.status === "warning" &&
                                  "bg-yellow-500 text-white hover:bg-yellow-600"
                              )}
                            >
                              {personnel.riskLevel}%
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {personnel.lastUpdate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

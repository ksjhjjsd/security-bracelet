import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  MapPin,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";

type IncidentType = "falling" | "impact" | "assault" | "health_alert" | "other";
type IncidentSeverity = "critical" | "high" | "medium" | "low";

interface Incident {
  id: string;
  reportNumber: string;
  personnelName: string;
  personnelId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  timestamp: Date;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  responseTime: number; // in minutes
  status: "resolved" | "ongoing" | "pending";
  responders: string[];
  notes: string;
}

// Mock Data Generator
const generateMockIncidents = (): Incident[] => [
  {
    id: "INC-001",
    reportNumber: "RPT-2025-001",
    personnelName: "خالد عبدالله السالم",
    personnelId: "SEC-002",
    type: "falling",
    severity: "critical",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: "شارع الملك فهد، الرياض",
    coordinates: { lat: 24.7236, lng: 46.6853 },
    description: "تم رصد سقوط مفاجئ في منطقة العملية الميدانية",
    responseTime: 1.2,
    status: "resolved",
    responders: ["فريق الإسعاف - الوحدة 5", "الشرطة - الدورية 12"],
    notes: "تم نقل الموظف للمستشفى، الإصابات طفيفة",
  },
  {
    id: "INC-002",
    reportNumber: "RPT-2025-002",
    personnelName: "سعد إبراهيم الدوسري",
    personnelId: "SEC-004",
    type: "impact",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: "ساحة الملك عبدالعزيز، الرياض",
    coordinates: { lat: 24.7336, lng: 46.6953 },
    description: "اهتزاز قوي ومفاجئ تم رصده بواسطة حساسات السوار",
    responseTime: 0.8,
    status: "resolved",
    responders: ["فريق الأمن - الوحدة 3"],
    notes: "تبين أنها اصطدام بسيط، الموظف بحالة جيدة",
  },
  {
    id: "INC-003",
    reportNumber: "RPT-2025-003",
    personnelName: "أحمد محمد العتيبي",
    personnelId: "SEC-001",
    type: "health_alert",
    severity: "high",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    location: "حي النخيل، الرياض",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    description: "ارتفاع غير طبيعي في معدل ضربات القلب",
    responseTime: 2.5,
    status: "resolved",
    responders: ["فريق الطب - الوحدة 2"],
    notes: "تم التحقق، الموظف يعاني من إرهاق بسيط",
  },
  {
    id: "INC-004",
    reportNumber: "RPT-2025-004",
    personnelName: "فهد ناصر القحطاني",
    personnelId: "SEC-003",
    type: "assault",
    severity: "critical",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    location: "منطقة الدرعية، الرياض",
    coordinates: { lat: 24.7036, lng: 46.6653 },
    description: "تم رصد اعتداء جسدي على الموظف",
    responseTime: 0.5,
    status: "resolved",
    responders: ["فريق الطوارئ - الوحدة 1", "الشرطة - الدورية 8", "الإسعاف - الوحدة 4"],
    notes: "تم القبض على المعتدي، الموظف تحت الملاحظة الطبية",
  },
  {
    id: "INC-005",
    reportNumber: "RPT-2025-005",
    personnelName: "محمد علي الزهراني",
    personnelId: "SEC-005",
    type: "other",
    severity: "medium",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    location: "منطقة الملز، الرياض",
    coordinates: { lat: 24.6936, lng: 46.6553 },
    description: "فقدان الاتصال مع الموظف لمدة 5 دقائق",
    responseTime: 5.0,
    status: "resolved",
    responders: ["مركز القيادة"],
    notes: "تم استعادة الاتصال، المشكلة تقنية في الجهاز",
  },
  {
    id: "INC-006",
    reportNumber: "RPT-2025-006",
    personnelName: "خالد عبدالله السالم",
    personnelId: "SEC-002",
    type: "falling",
    severity: "medium",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
    location: "شارع الملك فهد، الرياض",
    coordinates: { lat: 24.7236, lng: 46.6853 },
    description: "سقوط خفيف أثناء الحركة السريعة",
    responseTime: 1.5,
    status: "resolved",
    responders: ["فريق الأمن - الوحدة 5"],
    notes: "لا توجد إصابات، الموظف بحالة طبيعية",
  },
];

export default function IncidentReports() {
  const [incidents] = useState<Incident[]>(generateMockIncidents());
  const [filterType, setFilterType] = useState<IncidentType | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "resolved" | "ongoing" | "pending">("all");
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter and search logic
  const filteredIncidents = useMemo(() => {
    let result = incidents;

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((i) => i.type === filterType);
    }

    // Filter by severity
    if (filterSeverity !== "all") {
      result = result.filter((i) => i.severity === filterSeverity);
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((i) => i.status === filterStatus);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange === "today") {
      result = result.filter((i) => {
        const diff = now.getTime() - i.timestamp.getTime();
        return diff < 24 * 60 * 60 * 1000;
      });
    } else if (dateRange === "week") {
      result = result.filter((i) => {
        const diff = now.getTime() - i.timestamp.getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      });
    } else if (dateRange === "month") {
      result = result.filter((i) => {
        const diff = now.getTime() - i.timestamp.getTime();
        return diff < 30 * 24 * 60 * 60 * 1000;
      });
    }

    // Search by personnel name or report number
    if (searchTerm) {
      result = result.filter(
        (i) =>
          i.personnelName.includes(searchTerm) ||
          i.reportNumber.includes(searchTerm) ||
          i.location.includes(searchTerm)
      );
    }

    return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [incidents, filterType, filterSeverity, filterStatus, dateRange, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: incidents.length,
      critical: incidents.filter((i) => i.severity === "critical").length,
      avgResponseTime: (
        incidents.reduce((sum, i) => sum + i.responseTime, 0) / incidents.length
      ).toFixed(1),
      resolved: incidents.filter((i) => i.status === "resolved").length,
    };
  }, [incidents]);

  const resetFilters = () => {
    setFilterType("all");
    setFilterSeverity("all");
    setFilterStatus("all");
    setDateRange("all");
    setSearchTerm("");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/10 pb-20">
        <div className="container py-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold text-primary">
              سجل الحوادث والتقارير
            </h1>
            <p className="text-muted-foreground">
              مراجعة شاملة لجميع الحوادث والتنبيهات مع إمكانية البحث والفلترة
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="إجمالي الحوادث"
              value={stats.total.toString()}
              icon={<AlertTriangle className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="حوادث حرجة"
              value={stats.critical.toString()}
              icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
              trend="critical"
            />
            <StatCard
              title="متوسط وقت الاستجابة"
              value={`${stats.avgResponseTime} دقيقة`}
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            />
            <StatCard
              title="الحوادث المحلولة"
              value={`${stats.resolved}/${stats.total}`}
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
            />
          </div>

          {/* Filters Section */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  الفلاتر والبحث
                </CardTitle>
                {(filterType !== "all" ||
                  filterSeverity !== "all" ||
                  filterStatus !== "all" ||
                  dateRange !== "all" ||
                  searchTerm) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 ml-1" />
                    إعادة تعيين
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث عن الموظف أو رقم التقرير أو الموقع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border rounded-md pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    نوع الحادث
                  </label>
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="falling">سقوط</SelectItem>
                      <SelectItem value="impact">اصطدام</SelectItem>
                      <SelectItem value="assault">اعتداء</SelectItem>
                      <SelectItem value="health_alert">تنبيه صحي</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    مستوى الخطورة
                  </label>
                  <Select value={filterSeverity} onValueChange={(v: any) => setFilterSeverity(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="critical">حرج</SelectItem>
                      <SelectItem value="high">مرتفع</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="low">منخفض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    الحالة
                  </label>
                  <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="resolved">محلول</SelectItem>
                      <SelectItem value="ongoing">جاري</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    نطاق التاريخ
                  </label>
                  <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="today">اليوم</SelectItem>
                      <SelectItem value="week">هذا الأسبوع</SelectItem>
                      <SelectItem value="month">هذا الشهر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                تم العثور على <span className="font-bold text-foreground">{filteredIncidents.length}</span> حادثة
              </div>
            </CardContent>
          </Card>

          {/* Incidents Table */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading">قائمة الحوادث</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  تحميل التقرير
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredIncidents.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد حوادث تطابق معايير البحث
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          رقم التقرير
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          الموظف
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          النوع
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          الخطورة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          الوقت
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          الاستجابة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                          الحالة
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredIncidents.map((incident) => (
                        <tr
                          key={incident.id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() =>
                            setExpandedId(expandedId === incident.id ? null : incident.id)
                          }
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-bold text-primary">
                              {incident.reportNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-sm">{incident.personnelName}</p>
                              <p className="text-xs text-muted-foreground">{incident.personnelId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{getIncidentTypeLabel(incident.type)}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={cn(
                                incident.severity === "critical" &&
                                  "bg-destructive text-destructive-foreground",
                                incident.severity === "high" &&
                                  "bg-orange-500 text-white",
                                incident.severity === "medium" &&
                                  "bg-yellow-500 text-white",
                                incident.severity === "low" && "bg-blue-500 text-white"
                              )}
                            >
                              {getSeverityLabel(incident.severity)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(incident.timestamp)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium">{incident.responseTime} دقيقة</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                incident.status === "resolved"
                                  ? "secondary"
                                  : incident.status === "ongoing"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {getStatusLabel(incident.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expanded Details */}
          {expandedId && (
            <Card className="border-none shadow-lg bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-heading">
                  تفاصيل الحادثة
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {filteredIncidents
                  .filter((i) => i.id === expandedId)
                  .map((incident) => (
                    <div key={incident.id} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-heading font-bold mb-4">معلومات الحادثة</h3>
                          <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">الوصف:</dt>
                              <dd className="font-medium">{incident.description}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">الموقع:</dt>
                              <dd className="font-medium flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {incident.location}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">التاريخ والوقت:</dt>
                              <dd className="font-medium">{formatDateFull(incident.timestamp)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">وقت الاستجابة:</dt>
                              <dd className="font-medium text-green-600">{incident.responseTime} دقيقة</dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold mb-4">فريق الاستجابة</h3>
                          <div className="space-y-2">
                            {incident.responders.map((responder, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-background rounded border"
                              >
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-sm">{responder}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h3 className="font-heading font-bold mb-2">ملاحظات</h3>
                        <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                          {incident.notes}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "critical";
}) {
  return (
    <Card
      className={cn(
        "border-none shadow-sm",
        trend === "critical" && "border-destructive/50 border shadow-red-100"
      )}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className={cn("text-2xl font-bold font-heading", trend === "critical" && "text-destructive")}>
            {value}
          </h3>
        </div>
        <div className={cn("h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center", trend === "critical" && "bg-red-100")}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function getIncidentTypeLabel(type: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    falling: "سقوط",
    impact: "اصطدام",
    assault: "اعتداء",
    health_alert: "تنبيه صحي",
    other: "أخرى",
  };
  return labels[type];
}

function getSeverityLabel(severity: IncidentSeverity): string {
  const labels: Record<IncidentSeverity, string> = {
    critical: "حرج",
    high: "مرتفع",
    medium: "متوسط",
    low: "منخفض",
  };
  return labels[severity];
}

function getStatusLabel(status: "resolved" | "ongoing" | "pending"): string {
  const labels: Record<"resolved" | "ongoing" | "pending", string> = {
    resolved: "محلول",
    ongoing: "جاري",
    pending: "قيد الانتظار",
  };
  return labels[status];
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "منذ قليل";
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return date.toLocaleDateString("ar-SA");
}

function formatDateFull(date: Date): string {
  return date.toLocaleString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

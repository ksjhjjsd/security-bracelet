import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Download,
} from "lucide-react";

// Data for charts
const incidentTypeData = [
  { name: "سقوط", value: 24, fill: "#ef4444" },
  { name: "اصطدام", value: 18, fill: "#f97316" },
  { name: "اعتداء", value: 12, fill: "#dc2626" },
  { name: "تنبيه صحي", value: 15, fill: "#eab308" },
  { name: "أخرى", value: 8, fill: "#6b7280" },
];

const peakHoursData = [
  { hour: "00:00", incidents: 2 },
  { hour: "04:00", incidents: 1 },
  { hour: "08:00", incidents: 5 },
  { hour: "12:00", incidents: 8 },
  { hour: "16:00", incidents: 12 },
  { hour: "20:00", incidents: 9 },
  { hour: "23:00", incidents: 4 },
];

const dailyTrendData = [
  { day: "السبت", incidents: 8, resolved: 7 },
  { day: "الأحد", incidents: 12, resolved: 11 },
  { day: "الاثنين", incidents: 15, resolved: 14 },
  { day: "الثلاثاء", incidents: 10, resolved: 9 },
  { day: "الأربعاء", incidents: 18, resolved: 17 },
  { day: "الخميس", incidents: 14, resolved: 13 },
  { day: "الجمعة", incidents: 9, resolved: 8 },
];

const dangerousAreasData = [
  { name: "شارع الملك فهد", incidents: 12, lat: 24.7236, lng: 46.6853, severity: "high" },
  { name: "ساحة الملك عبدالعزيز", incidents: 8, lat: 24.7336, lng: 46.6953, severity: "high" },
  { name: "حي النخيل", incidents: 6, lat: 24.7136, lng: 46.6753, severity: "medium" },
  { name: "منطقة الدرعية", incidents: 9, lat: 24.7036, lng: 46.6653, severity: "high" },
  { name: "منطقة الملز", incidents: 5, lat: 24.6936, lng: 46.6553, severity: "medium" },
];

const severityDistributionData = [
  { name: "حرج", value: 18, fill: "#dc2626" },
  { name: "مرتفع", value: 35, fill: "#f97316" },
  { name: "متوسط", value: 32, fill: "#eab308" },
  { name: "منخفض", value: 15, fill: "#3b82f6" },
];

const responseTimeData = [
  { minute: "0-1", count: 28 },
  { minute: "1-2", count: 22 },
  { minute: "2-3", count: 15 },
  { minute: "3-5", count: 12 },
  { minute: "5+", count: 23 },
];

export default function Analytics() {
  const COLORS = ["#ef4444", "#f97316", "#dc2626", "#eab308", "#6b7280"];

  return (
    <Layout>
      <div className="min-h-screen bg-muted/10 pb-20">
        <div className="container py-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold text-primary">
              التحليلات والإحصائيات
            </h1>
            <p className="text-muted-foreground">
              رؤية شاملة لأنماط الحوادث والمناطق الخطرة وأوقات الذروة
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              title="إجمالي الحوادث"
              value="97"
              change="+12%"
              trend="up"
              icon={<AlertTriangle className="h-5 w-5" />}
            />
            <KPICard
              title="معدل الحل"
              value="89%"
              change="+5%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <KPICard
              title="متوسط الاستجابة"
              value="1.8 دقيقة"
              change="-0.3 دقيقة"
              trend="down"
              icon={<Clock className="h-5 w-5" />}
            />
            <KPICard
              title="المناطق الحساسة"
              value="5"
              change="مراقبة مكثفة"
              trend="neutral"
              icon={<MapPin className="h-5 w-5" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Types Pie Chart */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-heading">توزيع أنواع الحوادث</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incidentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incidentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} حادثة`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-heading">توزيع مستويات الخطورة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} حادثة`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Trend Chart */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-heading">الاتجاه اليومي للحوادث</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="إجمالي الحوادث"
                    dot={{ fill: "#ef4444", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="الحوادث المحلولة"
                    dot={{ fill: "#22c55e", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Peak Hours and Response Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-heading">أوقات الذروة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="incidents" fill="#3b82f6" name="عدد الحوادث" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time Distribution */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-heading">توزيع أوقات الاستجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="minute" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#10b981" name="عدد الحوادث" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Dangerous Areas */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-destructive" />
                  المناطق الأكثر خطورة
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dangerousAreasData.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{area.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          الإحداثيات: {area.lat.toFixed(4)}, {area.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-destructive">{area.incidents}</p>
                        <p className="text-xs text-muted-foreground">حادثة</p>
                      </div>
                      <Badge
                        className={
                          area.severity === "high"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {area.severity === "high" ? "خطر مرتفع" : "خطر متوسط"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights Section */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-lg font-heading">الرؤى والتوصيات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard
                  title="أعلى ساعات الخطر"
                  description="الساعات من 16:00 إلى 20:00 تشهد أعلى معدلات الحوادث"
                  icon="⏰"
                  action="زيادة الدوريات"
                />
                <InsightCard
                  title="أكثر الحوادث شيوعاً"
                  description="السقوط يمثل 24% من إجمالي الحوادث، يليه الاصطدام بـ 18%"
                  icon="📊"
                  action="تحسين التدريب"
                />
                <InsightCard
                  title="المناطق الحساسة"
                  description="شارع الملك فهد وساحة الملك عبدالعزيز تحتاج مراقبة مكثفة"
                  icon="🗺️"
                  action="تعزيز الوجود"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function KPICard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4" />
            ) : null}
            {change}
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-heading">{value}</h3>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: string;
  action: string;
}) {
  return (
    <div className="p-4 bg-background rounded-lg border">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-sm mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8 text-xs">
        {action}
      </Button>
    </div>
  );
}

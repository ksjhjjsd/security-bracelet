import Layout from "@/components/Layout";
import { MapView } from "@/components/Map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Activity,
  AlertTriangle,
  Filter,
  MapPin,
  Search,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAudioAlert } from "@/hooks/useAudioAlert";


// Types for our security personnel
type Status = "normal" | "danger" | "warning";
type Action = "walking" | "standing" | "running" | "falling" | "impact";

interface SecurityPersonnel {
  id: string;
  name: string;
  status: Status;
  action: Action;
  location: google.maps.LatLngLiteral;
  lastUpdate: string;
  battery: number;
  heartRate: number;
}

// Mock Data Generator
const generateMockData = (): SecurityPersonnel[] => [
  {
    id: "SEC-001",
    name: "أحمد محمد العتيبي",
    status: "normal",
    action: "walking",
    location: { lat: 24.7455, lng: 46.6260 },
    lastUpdate: "الآن",
    battery: 85,
    heartRate: 72,
  },
  {
    id: "SEC-002",
    name: "خالد عبدالله السالم",
    status: "danger",
    action: "falling",
    location: { lat: 24.7565, lng: 46.6753 },
    lastUpdate: "منذ دقيقة",
    battery: 42,
    heartRate: 110,
  },
  {
    id: "SEC-003",
    name: "فهد ناصر القحطاني",
    status: "normal",
    action: "standing",
    location: { lat: 24.7245, lng: 46.6100 },
    lastUpdate: "الآن",
    battery: 92,
    heartRate: 68,
  },
  {
    id: "SEC-004",
    name: "سعد إبراهيم الدوسري",
    status: "warning",
    action: "impact",
    location: { lat: 24.7725, lng: 46.6450 },
    lastUpdate: "منذ دقيقتين",
    battery: 15,
    heartRate: 95,
  },
  {
    id: "SEC-005",
    name: "محمد علي الزهراني",
    status: "normal",
    action: "walking",
    location: { lat: 24.6875, lng: 46.6950 },
    lastUpdate: "الآن",
    battery: 78,
    heartRate: 75,
  },
];

export default function Dashboard() {
  const [personnel, setPersonnel] = useState<SecurityPersonnel[]>(generateMockData());
  const [filter, setFilter] = useState<"all" | "danger" | "warning">("all");

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);



  // Filter logic
  const filteredPersonnel = personnel.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  // Sort: Danger first
  const sortedPersonnel = [...filteredPersonnel].sort((a, b) => {
    const priority = { danger: 3, warning: 2, normal: 1 };
    return priority[b.status] - priority[a.status];
  });

  // Active Alerts (Danger status)
  const activeAlerts = personnel.filter((p) => p.status === "danger");

  // Update Map Markers when data changes
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    // Add new markers
    sortedPersonnel.forEach((p) => {
      const markerContent = document.createElement("div");
      markerContent.className = `w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
        p.status === "danger"
          ? "bg-red-500 border-white animate-pulse"
          : p.status === "warning"
          ? "bg-yellow-500 border-white"
          : "bg-green-500 border-white"
      }`;
      markerContent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: p.location,
        title: p.name,
        content: markerContent,
      });

      // Add click listener to center map
      marker.addListener("click", () => {
        mapRef.current?.panTo(p.location);
        mapRef.current?.setZoom(16);
      });

      markersRef.current.push(marker);
    });
  }, [sortedPersonnel]);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/10 pb-20">
        {/* Top Alert Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-destructive text-destructive-foreground px-4 py-3 shadow-md animate-in slide-in-from-top duration-500">
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full animate-pulse">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">تنبيه أمني: تم رصد حالة خطرة!</p>
                  <p className="text-sm opacity-90">
                    {activeAlerts[0].name} - {getActionLabel(activeAlerts[0].action)} - {activeAlerts[0].lastUpdate}
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  mapRef.current?.panTo(activeAlerts[0].location);
                  mapRef.current?.setZoom(18);
                }}
              >
                تحديد الموقع
              </Button>
            </div>
          </div>
        )}

        <div className="container py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">لوحة التحكم الذكية</h1>
              <p className="text-muted-foreground">مراقبة لحظية لرجال الأمن والميدان مدعومة بالذكاء الاصطناعي</p>
            </div>
            <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
              <Button 
                variant={filter === "all" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("all")}
              >
                الكل
              </Button>
              <Button 
                variant={filter === "danger" ? "destructive" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("danger")}
                className={filter === "danger" ? "" : "text-destructive hover:text-destructive hover:bg-destructive/10"}
              >
                الخطر ({personnel.filter(p => p.status === "danger").length})
              </Button>
              <Button 
                variant={filter === "warning" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setFilter("warning")}
                className={filter === "warning" ? "bg-yellow-500 text-white hover:bg-yellow-600" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"}
              >
                تحذير ({personnel.filter(p => p.status === "warning").length})
              </Button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            
            {/* Personnel List */}
            <Card className="lg:col-span-1 flex flex-col h-full overflow-hidden border-none shadow-lg">
              <CardHeader className="pb-2 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    القوة الميدانية
                  </CardTitle>
                  <Badge variant="outline" className="font-mono">
                    {filteredPersonnel.length} نشط
                  </Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="بحث عن رجل أمن..." 
                    className="w-full bg-background border rounded-md pr-8 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="divide-y">
                    {sortedPersonnel.map((p) => (
                      <div 
                        key={p.id} 
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between group",
                          p.status === "danger" && "bg-red-50 hover:bg-red-100"
                        )}
                        onClick={() => {
                          mapRef.current?.panTo(p.location);
                          mapRef.current?.setZoom(16);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border",
                            p.status === "danger" ? "bg-red-100 border-red-200 text-red-600" :
                            p.status === "warning" ? "bg-yellow-100 border-yellow-200 text-yellow-600" :
                            "bg-green-100 border-green-200 text-green-600"
                          )}>
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{p.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" /> {p.heartRate} bpm
                              </span>
                              <span>•</span>
                              <span>{p.battery}% بطارية</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge variant={p.status === "danger" ? "destructive" : p.status === "warning" ? "secondary" : "outline"} className={cn(
                            p.status === "warning" && "bg-yellow-500 text-white hover:bg-yellow-600"
                          )}>
                            {getActionLabel(p.action)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{p.lastUpdate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Map View */}
            <Card className="lg:col-span-2 h-full overflow-hidden border-none shadow-lg relative">
              <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur p-2 rounded-lg shadow border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span> طبيعي
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span> تحذير
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span> خطر
                </div>
              </div>
              <MapView 
                className="w-full h-full"
                initialCenter={{ lat: 24.7455, lng: 46.6400 }} // Riyadh Center
                initialZoom={13}
                onMapReady={(map) => {
                  mapRef.current = map;
                }}
              />
            </Card>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="إجمالي القوة" 
              value={personnel.length.toString()} 
              icon={<Shield className="h-5 w-5 text-primary" />} 
            />
            <StatCard 
              title="حالات الخطر" 
              value={personnel.filter(p => p.status === "danger").length.toString()} 
              icon={<AlertTriangle className="h-5 w-5 text-destructive" />} 
              trend="requires_action"
            />
            <StatCard 
              title="متوسط الاستجابة" 
              value="1.2 دقيقة" 
              icon={<Activity className="h-5 w-5 text-blue-500" />} 
            />
            <StatCard 
              title="تغطية الميدان" 
              value="94%" 
              icon={<MapPin className="h-5 w-5 text-green-500" />} 
            />
          </div>
        </div>


      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: "requires_action" }) {
  return (
    <Card className={cn("border-none shadow-sm", trend === "requires_action" && "border-destructive/50 border shadow-red-100")}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className={cn("text-2xl font-bold font-heading", trend === "requires_action" && "text-destructive")}>{value}</h3>
        </div>
        <div className={cn("h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center", trend === "requires_action" && "bg-red-100")}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function getActionLabel(action: Action): string {
  const labels: Record<Action, string> = {
    walking: "مشي",
    standing: "وقوف",
    running: "جري",
    falling: "سقوط",
    impact: "اصطدام",
  };
  return labels[action] || action;
}

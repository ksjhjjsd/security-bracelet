import Layout from "@/components/Layout";
import TeamMap from "@/components/TeamMap";
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
import { cn } from "@/lib/utils";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  Radio,
  Briefcase,
  User,
} from "lucide-react";
import { useState } from "react";

type TeamType = "medical" | "security" | "command" | "technical";
type TeamStatus = "active" | "standby" | "deployed" | "unavailable";
type TaskStatus = "pending" | "assigned" | "in_progress" | "completed";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: "available" | "busy" | "offline";
  experience: number; // years
}

interface Team {
  id: string;
  name: string;
  type: TeamType;
  status: TeamStatus;
  location: string;
  members: TeamMember[];
  leader: string;
  responseTime: number; // minutes
  capacity: number;
  currentLoad: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTeam: string;
  priority: "high" | "medium" | "low";
  status: TaskStatus;
  dueDate: Date;
  location: string;
  estimatedDuration: number; // minutes
}

// Mock Data
const generateMockTeams = (): Team[] => [
  {
    id: "TEAM-001",
    name: "فريق الإسعاف الأول",
    type: "medical",
    status: "active",
    location: "محطة الإسعاف المركزية",
    members: [
      { id: "M-001", name: "د. محمد علي", role: "قائد الفريق", phone: "+966501234567", status: "available", experience: 8 },
      { id: "M-002", name: "أحمد الحسن", role: "طبيب طوارئ", phone: "+966501234568", status: "available", experience: 5 },
      { id: "M-003", name: "فاطمة السالم", role: "ممرضة", phone: "+966501234569", status: "busy", experience: 3 },
    ],
    leader: "د. محمد علي",
    responseTime: 2.5,
    capacity: 4,
    currentLoad: 3,
  },
  {
    id: "TEAM-002",
    name: "فريق الأمن الميداني",
    type: "security",
    status: "active",
    location: "مركز الأمن الشرقي",
    members: [
      { id: "S-001", name: "خالد الدوسري", role: "قائد الفريق", phone: "+966501234570", status: "available", experience: 10 },
      { id: "S-002", name: "سعد العتيبي", role: "ضابط أمن", phone: "+966501234571", status: "available", experience: 6 },
      { id: "S-003", name: "ناصر القحطاني", role: "ضابط أمن", phone: "+966501234572", status: "available", experience: 4 },
      { id: "S-004", name: "محمود الزهراني", role: "حارس أمن", phone: "+966501234573", status: "offline", experience: 2 },
    ],
    leader: "خالد الدوسري",
    responseTime: 1.8,
    capacity: 5,
    currentLoad: 3,
  },
  {
    id: "TEAM-003",
    name: "مركز القيادة والتحكم",
    type: "command",
    status: "active",
    location: "مركز القيادة الرئيسي",
    members: [
      { id: "C-001", name: "العقيد أحمد الشمري", role: "قائد العمليات", phone: "+966501234574", status: "available", experience: 15 },
      { id: "C-002", name: "الملازم فهد الرشيد", role: "منسق العمليات", phone: "+966501234575", status: "available", experience: 7 },
      { id: "C-003", name: "سارة الخالد", role: "محلل بيانات", phone: "+966501234576", status: "available", experience: 4 },
    ],
    leader: "العقيد أحمد الشمري",
    responseTime: 0.5,
    capacity: 3,
    currentLoad: 3,
  },
  {
    id: "TEAM-004",
    name: "فريق الدعم التقني",
    type: "technical",
    status: "standby",
    location: "مركز التكنولوجيا",
    members: [
      { id: "T-001", name: "علي المطيري", role: "قائد الفريق", phone: "+966501234577", status: "available", experience: 6 },
      { id: "T-002", name: "زيد الجعفري", role: "مهندس أنظمة", phone: "+966501234578", status: "available", experience: 5 },
    ],
    leader: "علي المطيري",
    responseTime: 5.0,
    capacity: 2,
    currentLoad: 1,
  },
];

const generateMockTasks = (): Task[] => [
  {
    id: "TASK-001",
    title: "الاستجابة لحادثة سقوط",
    description: "تم رصد سقوط في شارع الملك فهد، يتطلب فريق إسعاف",
    assignedTeam: "TEAM-001",
    priority: "high",
    status: "in_progress",
    dueDate: new Date(Date.now() + 30 * 60 * 1000),
    location: "شارع الملك فهد",
    estimatedDuration: 20,
  },
  {
    id: "TASK-002",
    title: "دوريات أمنية روتينية",
    description: "دوريات أمنية في المناطق المحددة",
    assignedTeam: "TEAM-002",
    priority: "medium",
    status: "in_progress",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    location: "شارع الملك عبدالعزيز",
    estimatedDuration: 120,
  },
  {
    id: "TASK-003",
    title: "صيانة أجهزة المراقبة",
    description: "صيانة دورية لأجهزة المراقبة والاتصالات",
    assignedTeam: "TEAM-004",
    priority: "low",
    status: "pending",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    location: "مركز التكنولوجيا",
    estimatedDuration: 180,
  },
];

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>(generateMockTeams());
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0]);
  const [filterStatus, setFilterStatus] = useState<TeamStatus | "all">("all");
  const [filterType, setFilterType] = useState<TeamType | "all">("all");

  const filteredTeams = teams.filter((team) => {
    if (filterStatus !== "all" && team.status !== filterStatus) return false;
    if (filterType !== "all" && team.type !== filterType) return false;
    return true;
  });

  // Convert teams to TeamLocation format for map
  const teamLocations = teams.map((team) => ({
    id: team.id,
    name: team.name,
    type: team.type,
    status: team.status,
    lat: team.members[0]?.id === "M-001" ? 24.7236 : team.members[0]?.id === "S-001" ? 24.7336 : 24.7136,
    lng: team.members[0]?.id === "M-001" ? 46.6853 : team.members[0]?.id === "S-001" ? 46.6953 : 46.6753,
    leader: team.leader,
    members: team.members.length,
    responseTime: team.responseTime,
    activeIncidents: Math.floor(Math.random() * 3),
  }));

  const teamTasks = tasks.filter((task) => task.assignedTeam === selectedTeam?.id);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/10 pb-20">
        <div className="container py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-bold text-primary">
                إدارة فرق الاستجابة
              </h1>
              <p className="text-muted-foreground">
                تنظيم الفرق وتعيين المهام والمسؤوليات
              </p>
            </div>
            <Button className="gap-2 font-heading">
              <Plus className="h-4 w-4" />
              إضافة فريق جديد
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="إجمالي الفرق"
              value={teams.length.toString()}
              icon={<Users className="h-5 w-5 text-primary" />}
            />
            <StatCard
              label="الفرق النشطة"
              value={teams.filter((t) => t.status === "active").length.toString()}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <StatCard
              label="المهام الجارية"
              value={tasks.filter((t) => t.status === "in_progress").length.toString()}
              icon={<Briefcase className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              label="متوسط وقت الاستجابة"
              value={`${(teams.reduce((sum, t) => sum + t.responseTime, 0) / teams.length).toFixed(1)} دقيقة`}
              icon={<Clock className="h-5 w-5 text-orange-500" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teams List */}
            <Card className="lg:col-span-1 border-none shadow-lg">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-heading">الفرق المتاحة</CardTitle>
                <div className="space-y-2 mt-4">
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="medical">إسعاف</SelectItem>
                      <SelectItem value="security">أمن</SelectItem>
                      <SelectItem value="command">قيادة</SelectItem>
                      <SelectItem value="technical">تقني</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                    <SelectTrigger className="w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="standby">في الانتظار</SelectItem>
                      <SelectItem value="deployed">مُنتشر</SelectItem>
                      <SelectItem value="unavailable">غير متاح</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4",
                        selectedTeam?.id === team.id
                          ? "bg-primary/10 border-l-primary"
                          : "border-l-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-sm">{team.name}</h3>
                          <p className="text-xs text-muted-foreground">{team.leader}</p>
                        </div>
                        <Badge
                          className={cn(
                            team.status === "active" && "bg-green-500 text-white",
                            team.status === "standby" && "bg-yellow-500 text-white",
                            team.status === "deployed" && "bg-blue-500 text-white",
                            team.status === "unavailable" && "bg-red-500 text-white"
                          )}
                        >
                          {getStatusLabel(team.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {team.members.length} أعضاء
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {team.responseTime} دقيقة استجابة
                        </p>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(team.currentLoad / team.capacity) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs">
                          {team.currentLoad}/{team.capacity} مشغول
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Details */}
            {selectedTeam && (
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-heading mb-2">
                        {selectedTeam.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{getTeamTypeLabel(selectedTeam.type)}</Badge>
                        <Badge
                          className={cn(
                            selectedTeam.status === "active" && "bg-green-500 text-white",
                            selectedTeam.status === "standby" && "bg-yellow-500 text-white",
                            selectedTeam.status === "deployed" && "bg-blue-500 text-white",
                            selectedTeam.status === "unavailable" && "bg-red-500 text-white"
                          )}
                        >
                          {getStatusLabel(selectedTeam.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Team Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الموقع</p>
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {selectedTeam.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">وقت الاستجابة</p>
                      <p className="font-medium">{selectedTeam.responseTime} دقيقة</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="font-heading font-bold mb-3">أعضاء الفريق</h3>
                    <div className="space-y-2">
                      {selectedTeam.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">الخبرة</p>
                              <p className="font-medium text-sm">{member.experience} سنوات</p>
                            </div>
                            <Badge
                              className={cn(
                                member.status === "available" && "bg-green-100 text-green-700",
                                member.status === "busy" && "bg-yellow-100 text-yellow-700",
                                member.status === "offline" && "bg-gray-100 text-gray-700"
                              )}
                              variant="outline"
                            >
                              {getMemberStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interactive Map */}
          <TeamMap
            teams={teamLocations}
            selectedTeamId={selectedTeam?.id}
            onTeamSelect={(teamId) => {
              const team = teams.find((t) => t.id === teamId);
              if (team) setSelectedTeam(team);
            }}
          />

          {/* Tasks Assignment */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  المهام المعينة
                </CardTitle>
                <Button className="gap-2 font-heading" size="sm">
                  <Plus className="h-4 w-4" />
                  تعيين مهمة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {teamTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مهام معينة لهذا الفريق حالياً
                </div>
              ) : (
                <div className="space-y-4">
                  {teamTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-background rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sm">{task.title}</h3>
                            <Badge
                              className={cn(
                                task.priority === "high" && "bg-red-500 text-white",
                                task.priority === "medium" && "bg-yellow-500 text-white",
                                task.priority === "low" && "bg-blue-500 text-white"
                              )}
                            >
                              {getPriorityLabel(task.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <Badge
                          className={cn(
                            task.status === "pending" && "bg-gray-500 text-white",
                            task.status === "assigned" && "bg-blue-500 text-white",
                            task.status === "in_progress" && "bg-orange-500 text-white",
                            task.status === "completed" && "bg-green-500 text-white"
                          )}
                        >
                          {getTaskStatusLabel(task.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {task.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedDuration} دقيقة
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            تحديث
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Tasks Overview */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-heading">جميع المهام</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-right font-semibold">المهمة</th>
                      <th className="px-4 py-3 text-right font-semibold">الفريق</th>
                      <th className="px-4 py-3 text-right font-semibold">الأولوية</th>
                      <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                      <th className="px-4 py-3 text-right font-semibold">الموقع</th>
                      <th className="px-4 py-3 text-right font-semibold">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tasks.map((task) => {
                      const team = teams.find((t) => t.id === task.assignedTeam);
                      return (
                        <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium">{task.title}</p>
                          </td>
                          <td className="px-4 py-3 text-sm">{team?.name}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={cn(
                                task.priority === "high" && "bg-red-500 text-white",
                                task.priority === "medium" && "bg-yellow-500 text-white",
                                task.priority === "low" && "bg-blue-500 text-white"
                              )}
                            >
                              {getPriorityLabel(task.priority)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={cn(
                                task.status === "pending" && "bg-gray-500 text-white",
                                task.status === "assigned" && "bg-blue-500 text-white",
                                task.status === "in_progress" && "bg-orange-500 text-white",
                                task.status === "completed" && "bg-green-500 text-white"
                              )}
                            >
                              {getTaskStatusLabel(task.status)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{task.location}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              تعديل
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-2xl font-bold font-heading">{value}</h3>
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function getTeamTypeLabel(type: TeamType): string {
  const labels: Record<TeamType, string> = {
    medical: "إسعاف",
    security: "أمن",
    command: "قيادة",
    technical: "تقني",
  };
  return labels[type];
}

function getStatusLabel(status: TeamStatus): string {
  const labels: Record<TeamStatus, string> = {
    active: "نشط",
    standby: "في الانتظار",
    deployed: "مُنتشر",
    unavailable: "غير متاح",
  };
  return labels[status];
}

function getMemberStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: "متاح",
    busy: "مشغول",
    offline: "غير متصل",
  };
  return labels[status] || status;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
  };
  return labels[priority] || priority;
}

function getTaskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    pending: "قيد الانتظار",
    assigned: "معينة",
    in_progress: "جاري",
    completed: "مكتملة",
  };
  return labels[status];
}

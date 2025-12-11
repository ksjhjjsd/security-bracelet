import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import { MapPin, AlertTriangle, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamLocation {
  id: string;
  name: string;
  type: "medical" | "security" | "command" | "technical";
  status: "active" | "standby" | "deployed" | "unavailable";
  lat: number;
  lng: number;
  leader: string;
  members: number;
  responseTime: number;
  activeIncidents: number;
}

interface TeamMapProps {
  teams: TeamLocation[];
  selectedTeamId?: string;
  onTeamSelect?: (teamId: string) => void;
}

export default function TeamMap({ teams, selectedTeamId, onTeamSelect }: TeamMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Set initial center to Riyadh
    map.setCenter({ lat: 24.7136, lng: 46.6753 });
    map.setZoom(12);

    // Add markers for each team
    addTeamMarkers(map);
  };

  const addTeamMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    teams.forEach((team) => {
      const marker = new google.maps.Marker({
        position: { lat: team.lat, lng: team.lng },
        map: map,
        title: team.name,
        icon: getMarkerIcon(team.type, team.status === "active"),
        animation: team.status === "active" ? google.maps.Animation.BOUNCE : undefined,
      });

      marker.addListener("click", () => {
        showTeamInfoWindow(map, marker, team);
        onTeamSelect?.(team.id);
      });

      markersRef.current.push(marker);
    });
  };

  const showTeamInfoWindow = (
    map: google.maps.Map,
    marker: google.maps.Marker,
    team: TeamLocation
  ) => {
    // Close existing info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const content = `
      <div style="min-width: 250px; font-family: Cairo, sans-serif; direction: rtl;">
        <div style="padding: 12px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${team.name}</h3>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
            <p style="margin: 4px 0;"><strong>القائد:</strong> ${team.leader}</p>
            <p style="margin: 4px 0;"><strong>الأعضاء:</strong> ${team.members}</p>
            <p style="margin: 4px 0;"><strong>وقت الاستجابة:</strong> ${team.responseTime} دقيقة</p>
            <p style="margin: 4px 0;"><strong>الحوادث النشطة:</strong> ${team.activeIncidents}</p>
          </div>
          <div style="display: flex; gap: 4px; margin-top: 8px;">
            <button style="flex: 1; padding: 6px; background: #16a34a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              تفاصيل
            </button>
            <button style="flex: 1; padding: 6px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              تعيين مهمة
            </button>
          </div>
        </div>
      </div>
    `;

    infoWindowRef.current = new google.maps.InfoWindow({
      content: content,
      pixelOffset: new google.maps.Size(0, -40),
    });

    infoWindowRef.current.open(map, marker);
  };

  const getMarkerIcon = (
    type: "medical" | "security" | "command" | "technical",
    isActive: boolean
  ): string => {
    const colors: Record<string, string> = {
      medical: "FF6B6B", // Red for medical
      security: "4ECDC4", // Teal for security
      command: "FFE66D", // Yellow for command
      technical: "95E1D3", // Light green for technical
    };

    const color = colors[type] || "808080";
    const opacity = isActive ? "FF" : "99";

    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23${color}${opacity}'/%3E%3Ccircle cx='16' cy='16' r='10' fill='%23FFF'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23${color}'/%3E%3C/svg%3E`;
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          خريطة مواقع الفرق
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[500px]">
          {/* Map */}
          <div className="lg:col-span-3">
            <MapView onMapReady={handleMapReady} />
          </div>

          {/* Teams List Sidebar */}
          <div className="bg-background border-l overflow-y-auto">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-bold text-sm">الفرق المتاحة</h3>
              <p className="text-xs text-muted-foreground mt-1">{teams.length} فريق</p>
            </div>
            <div className="divide-y">
              {teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => onTeamSelect?.(team.id)}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4",
                    selectedTeamId === team.id
                      ? "bg-primary/10 border-l-primary"
                      : "border-l-transparent"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs">{team.name}</h4>
                      <p className="text-xs text-muted-foreground">{team.leader}</p>
                    </div>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full",
                        team.status === "active" && "bg-green-500 animate-pulse",
                        team.status === "standby" && "bg-yellow-500",
                        team.status === "deployed" && "bg-blue-500",
                        team.status === "unavailable" && "bg-red-500"
                      )}
                    />
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {team.members} أعضاء
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {team.responseTime} دقيقة
                    </p>
                    {team.activeIncidents > 0 && (
                      <p className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        {team.activeIncidents} حادثة نشطة
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-muted/30 border-t">
          <p className="text-xs font-semibold mb-2">مفتاح الألوان:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>إسعاف</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-teal-500" />
              <span>أمن</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>قيادة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span>تقني</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

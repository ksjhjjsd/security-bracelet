import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

interface CasualtyFormData {
  name: string;
  injuryType: "falling" | "impact" | "assault" | "health_alert" | "other";
  severity: "critical" | "high" | "medium" | "low";
  location: string;
  notes: string;
}

interface AddCasualtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CasualtyFormData) => void;
}

export default function AddCasualtyModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCasualtyModalProps) {
  const [formData, setFormData] = useState<CasualtyFormData>({
    name: "",
    injuryType: "falling",
    severity: "high",
    location: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CasualtyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم المصاب");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("يرجى إدخال موقع الحادثة");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      toast.success("تم تسجيل المصاب بنجاح وإرسال الإنذار");
      
      // Reset form
      setFormData({
        name: "",
        injuryType: "falling",
        severity: "high",
        location: "",
        notes: "",
      });
      
      onClose();
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-destructive/10 to-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg font-heading">تسجيل مصاب جديد</CardTitle>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-sm font-medium mb-2 block">اسم المصاب *</label>
            <input
              type="text"
              placeholder="أدخل اسم المصاب"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>

          {/* Injury Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">نوع الإصابة *</label>
            <Select
              value={formData.injuryType}
              onValueChange={(value: any) => handleInputChange("injuryType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="falling">سقوط</SelectItem>
                <SelectItem value="impact">اصطدام</SelectItem>
                <SelectItem value="assault">اعتداء</SelectItem>
                <SelectItem value="health_alert">تنبيه صحي</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity Level */}
          <div>
            <label className="text-sm font-medium mb-2 block">مستوى الخطورة *</label>
            <Select
              value={formData.severity}
              onValueChange={(value: any) => handleInputChange("severity", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600" />
                    حرج
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    مرتفع
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    متوسط
                  </span>
                </SelectItem>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    منخفض
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Field */}
          <div>
            <label className="text-sm font-medium mb-2 block">موقع الحادثة *</label>
            <input
              type="text"
              placeholder="أدخل موقع الحادثة"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="text-sm font-medium mb-2 block">ملاحظات إضافية</label>
            <textarea
              placeholder="أضف أي ملاحظات مهمة..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
            />
          </div>

          {/* Alert Box */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-900">
              ⚠️ سيتم إرسال إنذار فوري إلى فرق الاستجابة عند تسجيل هذا المصاب
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              className="flex-1 gap-2 font-heading"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  تسجيل المصاب
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

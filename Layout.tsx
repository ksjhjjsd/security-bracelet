import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground" dir="rtl">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-heading text-xl font-bold text-primary">السوار الأمني الوطني</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              المميزات
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              آلية العمل
            </Link>
            <Link href="#integration" className="text-sm font-medium hover:text-primary transition-colors">
              التكامل الوطني
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors text-primary font-bold">
              لوحة التحكم
            </Link>
            <Link href="/incidents" className="text-sm font-medium hover:text-primary transition-colors">
              سجل الحوادث
            </Link>
            <Link href="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
              التحليلات
            </Link>
            <Link href="/teams" className="text-sm font-medium hover:text-primary transition-colors">
              إدارة الفرق
            </Link>
            <Link href="/monitoring" className="text-sm font-medium hover:text-primary transition-colors">
              الرصد اللحظي
            </Link>
            <Button variant="default" size="sm" className="font-heading">
              تواصل معنا
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-4">
            <Link href="#features" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              المميزات
            </Link>
            <Link href="#how-it-works" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              آلية العمل
            </Link>
            <Link href="#integration" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              التكامل الوطني
            </Link>
            <Link href="/dashboard" className="block text-sm font-medium hover:text-primary text-primary font-bold" onClick={() => setIsMenuOpen(false)}>
              لوحة التحكم
            </Link>
            <Link href="/incidents" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              سجل الحواث
            </Link>
            <Link href="/analytics" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              التحليلات
            </Link>
            <Link href="/teams" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              إدارة الفرق
            </Link>
            <Link href="/monitoring" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              الرصد اللحظي
            </Link>
            <Button className="w-full font-heading" onClick={() => setIsMenuOpen(false)}>
              تواصل معنا
            </Button>
          </div>
        )}
      </nav>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="container grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-heading text-lg font-bold text-primary">السوار الأمني الوطني</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              حل أمني وطني مبتكر يعتمد على الذكاء الاصطناعي لحماية رجال الأمن والميدان.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary">المميزات</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary">آلية العمل</Link></li>
              <li><Link href="#integration" className="hover:text-primary">التكامل</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>الرياض، المملكة العربية السعودية</li>
              <li>info@security-bracelet.sa</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">الشركاء</h3>
            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              {/* Placeholders for partner logos */}
              <div className="h-8 w-20 bg-muted-foreground/20 rounded"></div>
              <div className="h-8 w-20 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2025 السوار الأمني الوطني. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

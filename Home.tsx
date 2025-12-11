import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Activity, MapPin, Radio, Zap, Lock, Server, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 100 C 30 20 70 20 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="container grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 text-right">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-primary bg-primary/5">
              <span className="flex h-2 w-2 rounded-full bg-primary ml-2 animate-pulse"></span>
              الجيل القادم من الحماية الميدانية
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              السوار الأمني الوطني <br />
              <span className="text-primary">حماية ذكية للميدان</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed max-w-lg mr-0">
              حل مبتكر يعتمد على إنترنت الأشياء والذكاء الاصطناعي لحماية رجال الأمن والمفتشين والموظفين الميدانيين أثناء أداء مهامهم.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="font-heading text-lg px-8">
                طلب عرض تجريبي
              </Button>
              <Button size="lg" variant="outline" className="font-heading text-lg px-8">
                تعرف على المزيد
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border bg-background/50 backdrop-blur-sm p-2">
              <img 
                src="/assets/hero-bracelet.png" 
                alt="السوار الأمني الذكي" 
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Floating UI Elements */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 right-8 bg-background/90 backdrop-blur border p-4 rounded-xl shadow-lg flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">الحالة الحيوية</p>
                  <p className="text-sm font-bold text-green-600">مستقرة - طبيعية</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">مميزات النظام</h2>
            <p className="text-muted-foreground text-lg">
              تقنيات متقدمة تعمل بتناغم لتوفير أقصى درجات الأمان والاستجابة الفورية
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={<Activity className="h-8 w-8" />}
              title="مراقبة حيوية لحظية"
              description="تحليل مستمر للحركة والعلامات الحيوية للكشف عن الإجهاد أو الحالات الصحية الطارئة."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8" />}
              title="كشف السقوط والاعتداء"
              description="خوارزميات ذكاء اصطناعي دقيقة (96%) للتمييز بين الحركة الطبيعية وحالات الخطر."
            />
            <FeatureCard 
              icon={<MapPin className="h-8 w-8" />}
              title="تحديد الموقع الجغرافي"
              description="تتبع دقيق للموقع لضمان وصول فرق الدعم إلى المكان الصحيح بأسرع وقت."
            />
            <FeatureCard 
              icon={<Radio className="h-8 w-8" />}
              title="اتصال دائم ومشفر"
              description="شبكة اتصال آمنة تربط السوار بمركز القيادة لضمان وصول التنبيهات في جميع الظروف."
            />
            <FeatureCard 
              icon={<Server className="h-8 w-8" />}
              title="لوحة قيادة مركزية"
              description="منصة موحدة تعرض حالة جميع الوحدات الميدانية وتدير البلاغات بشكل آلي."
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8" />}
              title="أمان وخصوصية البيانات"
              description="تشفير عالي المستوى لجميع البيانات المنقولة والمخزنة وفق المعايير الوطنية."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border">
                <img 
                  src="/assets/dashboard.jpg" 
                  alt="مركز القيادة والتحكم" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">كيف يعمل النظام؟</h2>
              
              <div className="space-y-6">
                <Step 
                  number="01"
                  title="الاستشعار والتحليل"
                  description="تقوم حساسات السوار بجمع بيانات الحركة وتحليلها محلياً باستخدام نموذج الذكاء الاصطناعي."
                />
                <Step 
                  number="02"
                  title="اكتشاف الخطر"
                  description="عند رصد حالة غير طبيعية (سقوط، اهتزاز عنيف)، يتم تفعيل بروتوكول الطوارئ فوراً."
                />
                <Step 
                  number="03"
                  title="إرسال التنبيه"
                  description="يتم إرسال إشارة استغاثة لمركز القيادة تتضمن نوع الخطر، الموقع، وبيانات المستخدم."
                />
                <Step 
                  number="04"
                  title="الاستجابة"
                  description="يتلقى المشرفون التنبيه ويتم توجيه أقرب وحدات الدعم للموقع تلقائياً."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container relative z-10 text-center space-y-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">التكامل مع المنظومة الوطنية</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            تم تصميم النظام ليكون جزءاً لا يتجزأ من البنية التحتية الرقمية للأمن الوطني، مع ربط مباشر بمنصات مثل "أبشر".
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl">
              <Smartphone className="h-10 w-10 mx-auto mb-4 opacity-90" />
              <h3 className="font-heading font-bold text-xl mb-2">التحقق من الهوية</h3>
              <p className="text-sm opacity-80">التحقق الآلي من هوية رجل الأمن عبر النفاذ الوطني الموحد.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl">
              <Server className="h-10 w-10 mx-auto mb-4 opacity-90" />
              <h3 className="font-heading font-bold text-xl mb-2">أتمتة البلاغات</h3>
              <p className="text-sm opacity-80">إنشاء سجلات الحوادث والبلاغات بشكل آلي في الأنظمة المركزية.</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl">
              <Activity className="h-10 w-10 mx-auto mb-4 opacity-90" />
              <h3 className="font-heading font-bold text-xl mb-2">تحليل البيانات</h3>
              <p className="text-sm opacity-80">تزويد مراكز دعم القرار ببيانات دقيقة لتحسين الاستجابة وتوزيع الموارد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">جاهزون للمستقبل؟</h2>
          <p className="text-muted-foreground text-lg">
            انضموا إلينا في رحلة بناء بيئة عمل ميدانية أكثر أماناً وذكاءً. تواصلوا معنا اليوم للحصول على عرض تفصيلي.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="font-heading text-lg px-12">
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="font-heading text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary font-bold font-heading">
          {number}
        </span>
      </div>
      <div>
        <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

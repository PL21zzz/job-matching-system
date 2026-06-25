import { Sparkles } from "lucide-react";

const AboutHero = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} /> Khởi nguồn của sự công bằng
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight dark:text-white">
          Chúng tôi định nghĩa lại <br />
          <span className="text-primary italic">Năng Lực.</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
          Equitas AI không nhìn vào những gì bạn "không thể". Chúng tôi dùng AI
          để khai phá những tiềm năng mà thế giới vô tình bỏ lỡ.
        </p>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative aspect-video rounded-4xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
            alt="Tech Visualization"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutHero;

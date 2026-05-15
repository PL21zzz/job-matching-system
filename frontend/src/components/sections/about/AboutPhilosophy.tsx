import { Quote } from "lucide-react";

const AboutPhilosophy = () => (
  <section className="py-24 bg-primary text-white overflow-hidden relative">
    <Quote className="absolute top-10 left-10 opacity-10" size={200} />
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-serif italic leading-snug">
        "Chúng tôi không thay đổi người khuyết tật để thích nghi với công việc.
        Chúng tôi dùng công nghệ để tìm thấy công việc thích nghi với họ."
      </h2>
      <div className="mt-10 flex items-center justify-center gap-4">
        <div className="h-px w-12 bg-white/30"></div>
        <p className="font-bold tracking-widest uppercase text-sm">
          Equitas AI Philosophy
        </p>
        <div className="h-px w-12 bg-white/30"></div>
      </div>
    </div>
  </section>
);

export default AboutPhilosophy;

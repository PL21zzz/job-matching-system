import { HandHeart, ShieldCheck, Sparkles } from "lucide-react";

const AboutImpact = () => (
  <section className="py-24 max-w-7xl mx-auto px-4 text-center">
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8"></div>
      <h2 className="text-3xl md:text-5xl font-black dark:text-white">
        Cam Kết Của Equitas AI
      </h2>
      <p className="text-slate-500 dark:text-gray-400 leading-relaxed italic">
        "Chúng tôi không chỉ xây dựng phần mềm, chúng tôi xây dựng niềm tin.
        Equitas AI cam kết bảo mật dữ liệu tuyệt đối và duy trì tính minh bạch
        trong mọi thuật toán khớp lệnh."
      </p>
    </div>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: ShieldCheck,
          title: "Bảo Mật Dữ Liệu",
          desc: "Thông tin về tình trạng khuyết tật được mã hóa và chỉ dùng cho mục đích hỗ trợ tương thích.",
        },
        {
          icon: HandHeart,
          title: "Hỗ Trợ Tận Tâm",
          desc: "Đội ngũ luôn lắng nghe phản hồi từ cộng đồng để cải thiện trải nghiệm người dùng mỗi ngày.",
        },
        {
          icon: Sparkles,
          title: "Minh Bạch Thuật Toán",
          desc: "Match Score được tính toán dựa trên các tiêu chí rõ ràng, loại bỏ hoàn toàn sự cảm tính.",
        },
      ].map((item, i) => (
        <div key={i} className="p-8 space-y-4">
          <item.icon className="text-primary mx-auto" size={40} />
          <h4 className="text-xl font-bold dark:text-white">{item.title}</h4>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default AboutImpact;

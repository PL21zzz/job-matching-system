export const SectionHeading = ({
  title,
  description,
  badge,
  align = "center",
}: any) => (
  <div
    className={`space-y-4 ${align === "center" ? "text-center max-w-2xl mx-auto" : "text-left"}`}
  >
    {badge && (
      <span className="inline-flex items-center py-1 px-3 rounded-full text-xs font-semibold bg-primary/10 text-primary">
        {badge}
      </span>
    )}
    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {title}
    </h2>
    {description && (
      <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

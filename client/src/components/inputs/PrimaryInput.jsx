export default function PrimaryInput({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "off",
  className = "",
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-white placeholder:text-white/50 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/30 ${className}`}
    />
  );
}

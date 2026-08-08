import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Search,
} from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "bn", name: "Bangla", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
];

export default function LanguagePage() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );

  const [search, setSearch] = useState("");

  const filteredLanguages = languages.filter((language) =>
    `${language.name} ${language.nativeName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleContinue = () => {
    localStorage.setItem("selectedLanguage", selectedLanguage);

    // Language setup completed, now go ONLY to location.
    localStorage.setItem("languageSetupCompleted", "true");

    navigate("/location", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#fff8f1] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-4 pb-6 pt-5 sm:px-6 sm:pt-7">

        {/* TOP BAR */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft size={21} strokeWidth={2.2} />
          </button>
        </div>

        {/* HEADER */}
        <div className="mt-5">
          <h1 className="text-[27px] font-bold tracking-[-0.6px] sm:text-[30px]">
            Choose the language
          </h1>

          <p className="mt-2 max-w-[420px] text-[13px] leading-5 text-slate-500 sm:text-sm">
            Don't worry if it happens. Please select the language
            you'd like to use in the app.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-6 flex h-[52px] items-center rounded-2xl border border-[#f0e7df] bg-white px-4 shadow-[0_4px_16px_rgba(120,70,30,0.04)]">
          <Search
            size={20}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* LANGUAGE LIST */}
        <div className="mt-5 flex-1 space-y-2.5 overflow-y-auto pb-2">
          {filteredLanguages.map((language) => {
            const selected =
              selectedLanguage === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() =>
                  setSelectedLanguage(language.code)
                }
                className={`flex min-h-[58px] w-full items-center justify-between rounded-2xl border px-4 text-left transition-all duration-200 ${
                  selected
                    ? "border-[#f6b77d] bg-[#fff1e4] shadow-[0_5px_18px_rgba(242,140,55,0.10)]"
                    : "border-[#eee7e1] bg-white hover:border-[#f7c89f] hover:bg-[#fffaf6]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[23px]">
                    {language.flag}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold ${
                        selected
                          ? "text-[#df7629]"
                          : "text-slate-700"
                      }`}
                    >
                      {language.nativeName}
                    </p>

                    {language.nativeName !== language.name && (
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {language.name}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? "border-[#ef934e] bg-[#ef934e] text-white"
                      : "border-slate-200 bg-white text-transparent"
                  }`}
                >
                  <Check
                    size={14}
                    strokeWidth={3}
                  />
                </span>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-400">
              No language found
            </div>
          )}
        </div>

        {/* CONTINUE */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-4 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-5 text-sm font-bold text-white shadow-[0_9px_24px_rgba(242,154,82,0.24)] transition hover:bg-[#ed8e42] active:scale-[0.98]"
        >
          Continue
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Aprivity_ Portfolio",
  description: "A futuristic personal portfolio and blog homepage.",
};

const bootScript = `
(function () {
  try {
    var themeKey = 'aprivity-theme';
    var storedTheme = localStorage.getItem(themeKey);
    var theme = storedTheme === 'light' ? 'light' : 'dark';
    var languageKey = 'aprivity-language';
    var storedLanguage = localStorage.getItem(languageKey);
    var language = storedLanguage === 'en' ? 'en' : 'zh';
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.language = language;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  } catch (error) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.dataset.language = 'zh';
    document.documentElement.lang = 'zh-CN';
    document.documentElement.classList.add('dark');
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="dark"
      data-theme="dark"
      data-language="zh"
      suppressHydrationWarning
    >
      <body
        className={`${sora.variable} ${spaceGrotesk.variable} min-h-screen bg-[#050816] font-[family-name:var(--font-sora)] text-slate-100 antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <LanguageProvider>
          <div className="theme-shell relative isolate overflow-hidden transition-colors duration-300 ease-out">
            <div className="app-bg-primary absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.26),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.22),_transparent_28%),linear-gradient(135deg,_#040814_0%,_#0a1022_45%,_#130d2e_100%)]" />
            <div className="app-bg-top absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] blur-3xl" />
            <div className="app-bg-violet absolute left-1/2 top-1/3 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

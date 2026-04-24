import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { BackgroundLayer } from "@/components/background-layer";
import { Navbar } from "@/components/navbar";
import { RippleBackground } from "@/components/ripple-background";

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
        className={`${sora.variable} ${spaceGrotesk.variable} min-h-screen bg-[#030712] font-[family-name:var(--font-sora)] text-slate-100 antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <LanguageProvider>
          <div className="theme-shell relative isolate min-h-screen overflow-x-hidden transition-colors duration-300 ease-out">
            <BackgroundLayer />
            <RippleBackground />
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
              <Navbar />
              <main className="relative z-10 flex-1">{children}</main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

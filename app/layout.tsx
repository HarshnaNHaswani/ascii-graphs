import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ASCII Graphs - CSV to Graph Converter",
  description:
    "Convert CSV data to ASCII bar graphs, area charts, and pie charts",
  icons: {
    icon: [
      { url: "/icon3.svg", type: "image/svg+xml" },
      { url: "/icon2.png", type: "image/png" },
      { url: "/icon1.png", type: "image/jpeg" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Script
          id="hotjar-tracking"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6590589,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
        <header className="flex justify-between items-center p-4 gap-4 flex-wrap">
          <Image src="/icon3.svg" alt="ASCII Graphs" width={100} height={100} />
          <section className="flex justify-end items-center gap-4">
            <a
              href="http://github.com/HarshnaNHaswani/ascii-graphs"
              target="_blank"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.producthunt.com/products/ascii-graphs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ascii&#0045;graphs"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1048348&theme=light&t=1765315268839"
                alt="ASCII&#0032;Graphs - Csv&#0032;to&#0032;graph&#0032;converter | Product Hunt"
                style={{ width: "250px", height: "54px" }}
                width="250"
                height="54"
              />
            </a>
          </section>
        </header>
        {children}
      </body>
    </html>
  );
}

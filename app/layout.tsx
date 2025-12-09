import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
      <body>
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
        {children}
      </body>
    </html>
  );
}

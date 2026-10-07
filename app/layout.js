import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { hasDb } from "@/lib/db";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Huddle — pick your next team day",
  description: "Pitch teambuilding ideas, upvote the best, and plan within budget.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {hasDb ? children : (
          <main className="auth-panel" style={{ minHeight: "100vh" }}>
            <div className="card empty" style={{ maxWidth: 460 }}>
              <div className="empty-icon">🔌</div>
              <h3>Database not connected</h3>
              <p className="muted">
                In Vercel, open this project → Storage → connect a Neon database, then redeploy.
              </p>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}

import { Header } from "./components/header/Header";
import { Scene } from "./components/scene/Scene";
import { Footer } from "./components/footer/Footer";

export function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        minHeight: "0",
        background: "var(--bg-deep)",
        overflow: "hidden",
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          minHeight: "0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <Scene />
      </main>
      <Footer />
    </div>
  );
}

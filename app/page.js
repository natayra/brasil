import Image from "next/image";
import styles from "./page.module.css";
import GraphDashboard from "./components/GraphDashboard";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <GraphDashboard />
      </main>
    </div>
  );
}

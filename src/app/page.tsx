import { getInsights } from "@/lib/markdown";
import ClientPage from "@/components/ClientPage";

export default function Home() {
  const insights = getInsights();
  return <ClientPage insights={insights} />;
}

import { basePath } from "@/lib/seo";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / CUT TO BLACK</p>
      <h1>Այս էջը սցենարում չկա։</h1>
      <a href={`${basePath}/`}>Վերադառնալ գլխավոր էջ</a>
    </main>
  );
}

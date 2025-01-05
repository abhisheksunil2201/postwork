import { getFeatureFlags } from "postwork-sdk";

export default function Home() {
  const flags = getFeatureFlags(
    "postwork-sdk-demo",
    "user-id-123",
    {
      email: "user@example.com",
    },
    "https://postwork-sdk-demo.postwork.workers.dev"
  );
  console.log(flags);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>This is a Next.js app with Postwork SDK</p>
      </main>
    </div>
  );
}

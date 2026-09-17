import { redirect } from "next/navigation";
// Proxy resolves the initial locale; this is a defensive fallback.
export default function EntryPage() { redirect("/en"); }

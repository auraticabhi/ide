import { redirect } from "next/navigation";

export default function Home() {
  redirect("/ide?lang=1");
  return null;
}

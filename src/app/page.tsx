import { redirect } from "next/navigation";

// the site lives under /th and /en
export default function Root() {
  redirect("/th");
}

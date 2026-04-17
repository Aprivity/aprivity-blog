import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";

export const metadata: Metadata = {
  title: "Contact | Aprivity_ Portfolio",
  description: "Get in touch with Aprivity_ for collaboration, submissions, and project conversations.",
};

export default function ContactPage() {
  return <ContactSection />;
}

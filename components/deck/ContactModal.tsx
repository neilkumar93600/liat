"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CTAType } from "@/lib/moa-data";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  type: CTAType;
  email: string;
}

const TITLES: Record<CTAType, string> = {
  lease:   "Start a Leasing Conversation",
  sponsor: "Explore Sponsorship Opportunities",
  events:  "Book Your Event at Mall of America",
};

export default function ContactModal({ open, onClose, type, email }: ContactModalProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(TITLES[type]);
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\n\n${message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onClose();
  };

  const inputClass =
    "w-full rounded px-4 py-3 font-sans text-sm outline-none transition-colors duration-200 placeholder:opacity-30";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg border"
        style={{
          background: "#1A1A1A",
          borderColor: "rgba(201,168,76,0.2)",
          color: "#F5F5F0",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-display)", color: "#F5F5F0" }}
          >
            {TITLES[type]}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Submit your contact details to begin a conversation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            required
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            style={{
              background: "#2A2A2A",
              border: "1px solid rgba(245,245,240,0.1)",
              color: "#F5F5F0",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(245,245,240,0.1)")}
          />
          <input
            required
            placeholder="Company"
            value={company}
            onChange={e => setCompany(e.target.value)}
            className={inputClass}
            style={{
              background: "#2A2A2A",
              border: "1px solid rgba(245,245,240,0.1)",
              color: "#F5F5F0",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(245,245,240,0.1)")}
          />
          <textarea
            placeholder="Tell us about your interest..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            style={{
              background: "#2A2A2A",
              border: "1px solid rgba(245,245,240,0.1)",
              color: "#F5F5F0",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(245,245,240,0.1)")}
          />
          <button
            type="submit"
            className="w-full py-3 rounded font-sans font-semibold text-sm tracking-wider transition-colors duration-200"
            style={{ background: "#C9A84C", color: "#0A0A0A" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#E8C97A")}
            onMouseLeave={e => (e.currentTarget.style.background = "#C9A84C")}
          >
            Send Inquiry
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  formPropertyTypes,
  formServiceTypes,
  formTimings,
  site,
  type City,
  type Service,
} from "@/config/site";

const SUCCESS_MESSAGE = "Request sent. A local company will call you.";

const fieldClassName =
  "h-11 w-full rounded-lg border border-input bg-card px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

type Draft = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  zip: string;
  service_type: string;
  timing: string;
  property_type: string;
  message: string;
  sms_consent: boolean;
  privacy_consent: boolean;
};

const drafts = new Map<string, Draft>();

function emptyDraft(service?: Service): Draft {
  return {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    zip: "",
    service_type: service?.formValue ?? "tree service",
    timing: service?.slug === "emergency-tree-service" ? "emergency" : "this_week",
    property_type: "",
    message: "",
    sms_consent: false,
    privacy_consent: false,
  };
}

function draftKey(city?: City, service?: Service) {
  return `${city?.slug ?? "home"}:${service?.slug ?? "none"}`;
}

function readDraft(key: string, service?: Service): Draft {
  const cached = drafts.get(key);
  if (cached) return cached;
  return emptyDraft(service);
}

function writeDraft(key: string, draft: Draft) {
  drafts.set(key, draft);
}

type QuoteFormProps = {
  city?: City;
  service?: Service;
  listingId?: string;
  compact?: boolean;
};

export function QuoteForm({ city, service, listingId, compact }: QuoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastKeyRef = useRef("");
  const key = draftKey(city, service);
  const [draft, setDraft] = useState<Draft>(() => readDraft(key, service));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  function update<K extends keyof Draft>(name: K, value: Draft[K]) {
    setDraft((prev) => {
      const next = { ...prev, [name]: value };
      writeDraft(key, next);
      return next;
    });
  }

  function onTextChange<K extends "first_name" | "last_name" | "phone" | "email" | "zip" | "message">(
    name: K,
    value: string
  ) {
    const lastKey = lastKeyRef.current;
    const clearing =
      value === "" &&
      draft[name] !== "" &&
      lastKey !== "Backspace" &&
      lastKey !== "Delete";
    if (clearing) {
      setDraft((current) => ({ ...current }));
      return;
    }
    update(name, value);
  }

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    setHidden(form, "page_url", window.location.href);
    setHidden(form, "gclid", params.get("gclid") ?? "");
    setHidden(form, "utm_source", params.get("utm_source") ?? "");
    setHidden(form, "utm_medium", params.get("utm_medium") ?? "");
    setHidden(form, "utm_campaign", params.get("utm_campaign") ?? "");
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.sms_consent = data.get("sms_consent") ? "true" : "false";
    payload.privacy_consent = data.get("privacy_consent") ? "true" : "false";

    try {
      const response = await fetch(site.formAjax, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: `${site.name} quote request`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = (await response.json()) as {
        success?: string | boolean;
        message?: string;
      };
      const ok =
        response.ok &&
        (json.success === true ||
          json.success === "true" ||
          json.message?.toLowerCase().includes("success"));
      if (!ok) {
        throw new Error(json.message ?? "Could not send the request.");
      }
      drafts.delete(key);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send the request.");
    }
  }

  if (status === "success") {
    return (
      <div
        id="quote"
        className="rounded-lg border border-border bg-card p-5 shadow-sm"
        role="status"
      >
        <p className="font-heading text-lg font-semibold">{SUCCESS_MESSAGE}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {site.name} is a directory. The call will come from a local company,
          not from a {site.name} crew.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 h-11"
          onClick={() => {
            writeDraft(key, emptyDraft(service));
            setDraft(emptyDraft(service));
            setStatus("idle");
          }}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      id="quote"
      action={site.formAction}
      method="POST"
      autoComplete="off"
      onSubmit={onSubmit}
      onKeyDown={(event) => {
        lastKeyRef.current = event.key;
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        setDraft((current) => ({ ...current }));
      }}
      onFocusCapture={() => {
        window.setTimeout(() => {
          const form = formRef.current;
          if (!form) return;
          for (const name of [
            "first_name",
            "last_name",
            "phone",
            "email",
            "zip",
          ] as const) {
            const field = form.elements.namedItem(name);
            if (field instanceof HTMLInputElement && field.value) {
              update(name, field.value);
            }
          }
        }, 50);
      }}
      className="rounded-lg border border-border bg-card p-5 shadow-sm"
    >
      <h2 className="font-heading text-lg font-semibold sm:text-xl">
        Request a callback
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No credit card. We route this to a company that covers your ZIP.
      </p>

      <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="First name" htmlFor="first_name">
          <input
            id="first_name"
            name="first_name"
            required
            autoComplete="given-name"
            className={fieldClassName}
            value={draft.first_name}
            onChange={(event) => onTextChange("first_name", event.target.value)}
          />
        </Field>
        <Field label="Last name" htmlFor="last_name">
          <input
            id="last_name"
            name="last_name"
            required
            autoComplete="family-name"
            className={fieldClassName}
            value={draft.last_name}
            onChange={(event) => onTextChange("last_name", event.target.value)}
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder={site.phone}
            className={fieldClassName}
            value={draft.phone}
            onChange={(event) => onTextChange("phone", event.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClassName}
            value={draft.email}
            onChange={(event) => onTextChange("email", event.target.value)}
          />
        </Field>
        <Field label="ZIP" htmlFor="zip">
          <input
            id="zip"
            name="zip"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            className={fieldClassName}
            value={draft.zip}
            onChange={(event) => onTextChange("zip", event.target.value)}
          />
        </Field>
        <Field label="Service type" htmlFor="service_type">
          <select
            id="service_type"
            name="service_type"
            required
            className={fieldClassName}
            value={draft.service_type}
            onChange={(event) => update("service_type", event.target.value)}
          >
            {formServiceTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Timing" htmlFor="timing">
          <select
            id="timing"
            name="timing"
            required
            className={fieldClassName}
            value={draft.timing}
            onChange={(event) => update("timing", event.target.value)}
          >
            {formTimings.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Property type (optional)" htmlFor="property_type">
          <select
            id="property_type"
            name="property_type"
            className={fieldClassName}
            value={draft.property_type}
            onChange={(event) => update("property_type", event.target.value)}
          >
            {formPropertyTypes.map((item) => (
              <option key={item.value || "empty"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message (optional)" htmlFor="message" className="mt-3">
        <textarea
          id="message"
          name="message"
          rows={4}
          className="min-h-24 w-full rounded-lg border border-input bg-card px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          placeholder="What needs work, access notes, or a photo description."
          value={draft.message}
          onChange={(event) => onTextChange("message", event.target.value)}
        />
      </Field>

      <label className="mt-4 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="sms_consent"
          value="true"
          className="mt-1 size-4 accent-primary"
          checked={draft.sms_consent}
          onChange={(event) => update("sms_consent", event.target.checked)}
        />
        <span>You may text me about this request at the number I provided.</span>
      </label>
      <label className="mt-2 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="privacy_consent"
          value="true"
          required
          className="mt-1 size-4 accent-primary"
          checked={draft.privacy_consent}
          onChange={(event) => update("privacy_consent", event.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          . Required.
        </span>
      </label>

      <input type="hidden" name="_subject" value={`${site.name} quote request`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input
        type="hidden"
        name="_next"
        value={`${site.url.replace(/\/$/, "")}/request-sent/`}
      />
      <input type="hidden" name="page_url" defaultValue="" />
      <input type="hidden" name="city" defaultValue={city?.name ?? ""} />
      <input type="hidden" name="state_abbr" defaultValue={city?.stateAbbr ?? ""} />
      <input type="hidden" name="service" defaultValue={service?.slug ?? ""} />
      <input type="hidden" name="listing_id" defaultValue={listingId ?? ""} />
      <input type="hidden" name="gclid" defaultValue="" />
      <input type="hidden" name="utm_source" defaultValue="" />
      <input type="hidden" name="utm_medium" defaultValue="" />
      <input type="hidden" name="utm_campaign" defaultValue="" />

      {status === "error" ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 h-11 w-full text-base"
      >
        {status === "submitting" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

function setHidden(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement) field.value = value;
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5">
        {label}
      </Label>
      {children}
    </div>
  );
}

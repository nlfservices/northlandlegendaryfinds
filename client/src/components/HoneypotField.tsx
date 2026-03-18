/**
 * Honeypot Field - Invisible field that catches bots
 * Bots will fill this field, humans won't see it.
 * Include this in any public form and check the value server-side.
 */
export default function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        tabIndex: -1,
      }}
    >
      <label htmlFor="website_url_confirm">Website</label>
      <input
        type="text"
        id="website_url_confirm"
        name="website_url_confirm"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

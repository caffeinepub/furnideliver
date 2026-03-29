interface StatusPillProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusPill({ status, size = "md" }: StatusPillProps) {
  const styles: Record<string, string> = {
    Pending: "bg-[#F6D77A] text-[#4a3a0a]",
    "Out for Delivery": "bg-[#E7B27A] text-[#4a2a0a]",
    Delivered: "bg-[#B9E0C0] text-[#0a3a1a]",
  };
  const style = styles[status] ?? "bg-muted text-muted-foreground";
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding} ${style}`}
    >
      {status}
    </span>
  );
}

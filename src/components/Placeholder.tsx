// กล่องรูปภาพ/โลโก้ชั่วคราว รอไฟล์จริง
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={`flex items-center justify-center bg-raised text-xs text-ink-3 ${className}`}>
      {label}
    </div>
  );
}

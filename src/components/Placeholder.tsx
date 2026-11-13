// กล่องรูปภาพชั่วคราว รอไฟล์จริง: ตราสัญลักษณ์มหาวิทยาลัยจางเป็นลายน้ำเหนือข้อความ
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={`flex flex-col items-center justify-center gap-2 bg-raised p-2 text-center text-xs text-ink-3 ${className}`}>
      <img src="/brand/logo-up-mark.png" alt="" aria-hidden="true" className="h-1/3 max-h-14 min-h-6 w-auto opacity-30 grayscale" />
      <span className="line-clamp-2">{label}</span>
    </div>
  );
}

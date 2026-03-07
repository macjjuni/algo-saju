interface InfoCardProps {
  label: string
  value: string
}

export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-md font-medium">{value}</p>
    </div>
  )
}

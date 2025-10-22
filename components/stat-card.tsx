interface StatCardProps {
  label: string
  value: string | number
  icon: string
  trend?: number
  color?: "primary" | "success" | "warning" | "danger"
}

export function StatCard({ label, value, icon, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground-secondary text-sm">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? "text-success" : "text-danger"}`}>
              {trend >= 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <span className={`text-4xl ${colorClasses[color]}`}>{icon}</span>
      </div>
    </div>
  )
}

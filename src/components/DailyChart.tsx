import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Array<{ day: string; count: number }>;
}

export default function DailyChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  return (
    <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl p-5">
      <h3 className="text-sm font-medium text-surface-300 mb-4">Leads por dia (30 dias)</h3>
      {formatted.length === 0 ? (
        <p className="text-xs text-surface-300/50 py-8 text-center">Sem dados no período</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4882e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#d4882e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(241,245,249,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#d4882e" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Leads"
              stroke="#d4882e"
              strokeWidth={2}
              fill="url(#brandGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

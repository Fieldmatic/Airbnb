import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { date: "14/6/2022", Total: 1200 },
//   { date: "15/6/2022", Total: 2100 },
//   { date: "16/6/2022", Total: 800 },
//   { date: "17/6/2022", Total: 1600 },
//   { date: "18/6/2022", Total: 900 },
//   { date: "19/6/2022", Total: 1700 },
// ];

const Chart = ({ aspect, title, data }) => {
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5A5F" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF5A5F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="gray" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#FF5A5F"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
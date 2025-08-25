import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { apiClient } from "@/lib/api-client"
import { DATA_CHART } from "@/utils/constant"
import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const Home = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const currentMonth = new Date().getMonth() + 1
  const [selectedMonths, setSelectedMonths] = useState([currentMonth]); // แสดงเดือนปัจจุบันเมื่อเริ่มต้น
  const [selectedYear, setSelectedYear] = useState(currentYear); // สำหรับปี
  const [chartData, setChartData] = useState([])
  const [openMonth, setOpenMonth] = useState(false)
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(600); // ตั้งค่าเริ่มต้น
  const [chartHeight, setChartHeight] = useState(400);

  const months = [
    { value: 1, label: "ม.ค." },
    { value: 2, label: "ก.พ." },
    { value: 3, label: "มี.ค." },
    { value: 4, label: "เม.ย." },
    { value: 5, label: "พ.ค." },
    { value: 6, label: "มิ.ย." },
    { value: 7, label: "ก.ค." },
    { value: 8, label: "ส.ค." },
    { value: 9, label: "ก.ย." },
    { value: 10, label: "ต.ค." },
    { value: 11, label: "พ.ย." },
    { value: 12, label: "ธ.ค." },
  ];
  const currentMonthLabel = months.find(month => month.value === currentMonth)?.label; // หา label ของเดือนปัจจุบัน
  // ฟังก์ชันการเลือกเดือนแบบ MultiSelect
  const handleMonthSelect = (value) => {
    const isSelected = selectedMonths.includes(value);

    if (isSelected) {
      setSelectedMonths(selectedMonths.filter((m) => m !== value)); // ลบเดือนที่เลือกออกถ้าเลือกซ้ำ
    } else {
      setSelectedMonths([...selectedMonths, value]); // เพิ่มเดือนที่เลือกเข้า array
    }
  };

  const token = localStorage.getItem("token");

  async function getDataChart() {
    if (currentYear) {
      await apiClient.post(DATA_CHART, {
        months: selectedMonths,
        year: selectedYear
      }, {
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(response => {
        setChartData(response.data)
      })
    }
  }

  useEffect(() => {
    getDataChart();
  }, [selectedMonths, selectedYear]);

  const updateChartSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setChartWidth(width);
    setChartHeight(height > 400 ? 400 : height);
  };

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  const getSelectedMonthsLabels = () => {
    return selectedMonths
      .map((month) => months.find(m => m.value === month)?.label)
      .filter(label => label)
      .join(" - ");
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-2))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  };

  const ITEMS_PER_CHART = 10;
  const splitDataIntoGroups = (data, itemsPerGroup) => {
    let result = [];
    for (let i = 0; i < data.length; i += itemsPerGroup) {
      result.push(data.slice(i, i + itemsPerGroup));
    }
    return result;
  };

  const dataGroups = splitDataIntoGroups(chartData, ITEMS_PER_CHART);

  return (
    <div className="h-full mb-32">
      <CardHeader>
        <CardTitle>กราฟแสดงราคาต้นทุนในเดือน</CardTitle>
        <CardDescription>{getSelectedMonthsLabels()} ปี {selectedYear + 543}</CardDescription>
        <div className="flex flex-col gap-5">
          {
            openMonth ? (
              <Button onClick={(e) => setOpenMonth(false)} className="bg-red-500">
                ปิด
              </Button>
            ) : (
              <Button onClick={(e) => setOpenMonth(true)} className="bg-green_seccond">
                เลือก เดือน-ปี
              </Button>
            )
          }
          {
            openMonth && (
              <div className="flex flex-col gap-3">
                {/* MultiSelect สำหรับเดือน */}
                <Select onValueChange={handleMonthSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedMonths.length > 0 ? getSelectedMonthsLabels() : "เลือกเดือน"}>
                      {selectedMonths.length > 0 ? getSelectedMonthsLabels() : "เลือกเดือน"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="z-[1002]">
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value}
                        selected={selectedMonths.includes(month.value) || month.value === currentMonth} // เช็คเดือนปัจจุบันด้วย
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* เลือกปี */}
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year + 543}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          }
        </div>
      </CardHeader>

      <CardContent className="h-full min-h-[500px] p-0 mx-3 overflow-auto">
        <ChartContainer className="" config={chartConfig}>
          {dataGroups.map((group, index) => (
            <div ref={chartContainerRef} key={index} className="chart-container">
              <BarChart
                width={chartWidth}
                height={chartHeight}
                data={group}
                layout="vertical"
                margin={{
                  right: 45,
                  left: 30,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="list_name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <XAxis dataKey="total_cost" type="number" tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="total_cost"
                  layout="vertical"
                  fill="var(--color-desktop)"
                  radius={4}
                >
                  <LabelList
                    dataKey="list_name"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="total_cost"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </div>
          ))}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
      <hr />
    </div>
  )
}

export default Home;

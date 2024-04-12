/* eslint-disable react/no-this-in-sfc */
import Highcharts from "highcharts"
// import HC_sunburst from "highcharts/modules/sunburst"
import HighchartsReact from "highcharts-react-official"
import React, { useEffect } from "react"

const CourseAnalyticsChart = ({ reportData = [] }) => {
  useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: "",
      },
    })
  }, [])
  return (
    <div id="totalgoods-hight-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          credits: {
            enabled: false,
          },
          chart: {
            type: "spline",
          },
          title: {
            text: "Course Analytics",
          },
          xAxis: {
            categories: reportData?.map((x) => x.xAxis),
          },
          yAxis: [
            {
              title: {
                text: "Revenue",
                style: {
                  color: "#7cb5ec",
                },
              },
              labels: {
                formatter() {
                  return `${Number(this.value)}`
                },
                style: {
                  color: "#7cb5ec",
                },
              },
            },
            {
              title: {
                text: "Total Sales",
              },
              labels: {
                formatter() {
                  return `${this.value}`
                },
              },
              opposite: true,
            },
          ],
          tooltip: {
            crosshairs: true,
            shared: true,
          },
          plotOptions: {
            spline: {
              marker: {
                radius: 5,
                // lineColor: "#666666",
                // lineWidth: 2,
              },
            },
          },
          series: [
            {
              name: "Revenue",
              marker: {
                symbol: "round",
              },
              data: reportData.map((x) => x.revenue),
              Color: "#7cb5ec",
            },
            {
              name: "Total Sales",
              marker: {
                symbol: "diamond",
              },
              data: reportData.map((x) => x.totalSales),
              yAxis: 1,
            },
          ],
        }}
      />
    </div>
  )
}

export default CourseAnalyticsChart

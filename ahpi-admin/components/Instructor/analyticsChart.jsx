/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/no-null */
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import React, { useEffect } from "react"

const AnalyticsChart = ({ reportData = [], title = "" }) => {
  useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: "",
      },
    })
  }, [])
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        credits: {
          enabled: false,
        },
        chart: {
          type: "column",
        },
        title: {
          text: title,
        },
        xAxis: {
          categories: reportData?.map((x) => x.name),
        },
        yAxis: [
          {
            title: {
              text: title,
              style: {
                color: "#7cb5ec",
              },
            },
            labels: {
              formatter() {
                return `${this.value}`
              },
              style: {
                color: "#7cb5ec",
              },
            },
          },
        ],
        tooltip: {
          crosshairs: true,
          shared: true,
          pointFormat: `<b>${title}:</b> {point.y}`,
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 5,
            },
          },
        },
        series: [
          {
            name: title,
            marker: {
              symbol: "round",
            },
            data: reportData.map((x) => x.y),
            Color: "#7cb5ec",
          },
        ],
      }}
    />
  )
}

export default AnalyticsChart

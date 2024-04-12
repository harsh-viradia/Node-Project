/* eslint-disable react/no-this-in-sfc */
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import React, { useEffect } from "react"

const MyEarningChart = ({ reportData = [] }) => {
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
            text: "",
          },
          xAxis: {
            categories: reportData?.map((x) => x.x),
          },
          yAxis: {
            title: {
              text: "",
              style: {
                color: "#7cb5ec",
              },
            },
          },
          tooltip: {
            headerFormat: "<b>{point.x}</b><br />",
            pointFormat: "Earnings : {point.y}",
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
              name: "Earnings",
              marker: {
                symbol: "round",
              },
              data: reportData.map((x) => Number.parseFloat(x?.y?.toFixed(2) || 0)),
              Color: "#7cb5ec",
            },
          ],
        }}
      />
    </div>
  )
}

export default MyEarningChart

/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/no-null */
import Highcharts from "highcharts"
import BubbleHighcharts from "highcharts/highcharts-more"
import HighchartsReact from "highcharts-react-official"
import React, { useEffect, useState } from "react"

const EmployerAnalytics = ({ reportData }) => {
  const [mount, setMount] = useState(false)

  useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: "",
      },
    })
    BubbleHighcharts(Highcharts)
    setMount(true)
  }, [])

  const bubbleOptions = {
    credits: {
      enabled: false,
    },
    chart: {
      type: "packedbubble",
      height: "400px",
    },
    title: {
      text: `Program Analytics`,
    },
    tooltip: {
      useHTML: true,
      pointFormat: "<b>{point.name}:</b> {point.value}",
    },
    plotOptions: {
      packedbubble: {
        minSize: "10%",
        maxSize: "100%",
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02,
        },
        dataLabels: {
          enabled: true,
          useHTML: true,
          style: { textShadow: "none", fontSize: "10px", color: "black", textAlign: "center" },
          formatter() {
            // eslint-disable-next-line react/no-this-in-sfc
            const { name } = this.point.options

            return name.split(" ").join("<br>")
          },
          filter: {
            property: "y",
            operator: ">",
            value: 0,
          },
        },
      },
    },
    series: [
      {
        name: "Program",
        data: reportData?.map((a) => ({ name: a._id, value: a.revenue })),
      },
    ],
  }

  return mount ? <HighchartsReact highcharts={Highcharts} options={bubbleOptions} /> : ""
}

export default EmployerAnalytics

import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "./redux/store";
import { ApexOptions } from "apexcharts";

export const ApexChart = () => {
  const { todayHourForecast, todayWeather } = useAppSelector(
    (state) => state.weather
  );
  const isNight = todayWeather && todayWeather?.dt > todayWeather?.sys.sunset;

  const state = {
    series: [
      {
        name: "Humidity",
        data: todayHourForecast.map((item) => item.main.humidity),
      },

      {
        name: "Cloudiness",
        data: todayHourForecast.map((item) => item.clouds.all),
      },
    ],

    options: {
      colors: ["#4dd0e1", "#a1887f"],
      markers: {
        size: 6,
        colors: ["#4dd0e1", "#a1887f"],
        hover: {
          size: 7,
        },
      },

      chart: {
        toolbar: {
          show: false,
        },
        height: 350,
        type: "area",
      },

      theme: {
        monochrome: {
          enabled: false,
          shadeTo: "light",
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: todayHourForecast.map((item) => item.dt_txt),
        labels: {
          style: {
            colors: isNight ? "white" : "black",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isNight ? "white" : "black",
          },
        },
      },
      legend: {
        labels: {
          colors: isNight ? "white" : "black",
        },

        markers: {
          fillColors: ["#4dd0e1", "#a1887f"],
        },
      },
      tooltip: {
        theme: isNight ? "dark" : "light",
        colors: ["#4dd0e1", "#a1887f"],
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <div id="chart" style={{ width: "100%" }}>
        <ReactApexChart
          options={state.options as ApexOptions}
          series={state.series}
          type="area"
          height={"100%"}
          width={"100%"}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

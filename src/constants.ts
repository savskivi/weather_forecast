import clouds from "./assets/cloudy.png";
import clearDay from "./assets/clear-day.png";
import clearNight from "./assets/clear-night.png";
import lightRainDay from "./assets/light-rain-day.png";
import lightRainNight from "./assets/light-rain-night.png";
import heavyRain from "./assets/heavy-rain.png";
import thunderstorm from "./assets/thunderstorm.png";
import windyDay from "./assets/windy-day.png";
import windyNight from "./assets/windy-night.png";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const daysShorten = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

export const weekWeather = [
    {
      id: 1,
      title: "Mon",
      value: 32,
    },
  
    {
      id: 2,
      title: "Tue",
      value: 31,
    },
  
    {
      id: 3,
      title: "Wed",
      value: 31,
    },
  
    {
      id: 4,
      title: "Thu",
      value: 25,
    },
  
    {
      id: 5,
      title: "Fri",
      value: 26,
    },
  
    {
      id: 6,
      title: "Sat",
      value: 30,
    },
  
    {
      id: 7,
      title: "Sun",
      value: 32,
    },
  ];

export function getWeekDay(timezone: number, isShort: boolean) {
  const timezoneOffset = timezone * 1000;
  const now = new Date(Date.now());
  const local = new Date(now.getTime() + timezoneOffset);
  const dayNum = local.getDay();
  return isShort ? daysShorten[dayNum] : days[dayNum]
}

export function formatTime(timestamp: number) {
  const date = new Date(timestamp * 1000);
  console.log(date);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formatMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${formatMinutes} ${ampm}`;
}

export function getWeatherIcon(id: number, isNight: boolean) {
  if (isNight) {
    if (id > 800) {
      return clouds;
    }
    if (id === 800) {
      return clearNight;
    }
    if (id === 500 || id === 501) {
      return lightRainNight;
    }
    if (id > 501 && id < 600) {
      return heavyRain;
    }
    if (id >= 200 && id < 300) {
      return thunderstorm;
    }
    return windyNight;
  } else {
    if (id > 800) {
      return clouds;
    }
    if (id === 800) {
      return clearDay;
    }
    if (id === 500 || id === 501) {
      return lightRainDay;
    }
    if (id > 501 && id < 600) {
      return heavyRain;
    }
    if (id >= 200 && id < 300) {
      return thunderstorm;
    }
    return windyDay;
  }
}


import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Separator,
  Tabs,
  Text,
  TextField,
  Theme,
} from "@radix-ui/themes";
import HumidityIcon from "./assets/icons/HumidityIcon";
import WindIcon from "./assets/icons/WindIcon";
import RainIcon from "./assets/icons/RainIcon";
import MinTempIcon from "./assets/icons/MinTempIcon";
import MaxTempIcon from "./assets/icons/MaxTempIcon";
import barometer from "./assets/barometer.png";
import SunriseIcon from "./assets/icons/SunriseIcon";
import SunsetIcon from "./assets/icons/SunsetIcon";
import cloudiness from "./assets/cloudiness.png";
import visibility from "./assets/visibility.png";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect, useState } from "react";
import { apiKey, axiosInstance } from "./axiosInstance";
import {
  setCity,
  setTheme,
  setTodayHourForecast,
  setTodayWeather,
  setWeekWeather,
} from "./redux/slices/weatherReducer";
import { formatTime, getWeatherIcon, getWeekDay } from "./constants";
import { Theme as ThemeType } from "./types.ts";
import { ApexChart } from "./ApexChart.tsx";

function App() {
  const dispatch = useAppDispatch();
  const { theme, todayWeather, city, weekWeather, todayHourForecast } =
    useAppSelector((state) => state.weather);

  const [searchValue, setSearchValue] = useState<string>("");

  const isNight = todayWeather && todayWeather?.dt > todayWeather?.sys.sunset;

  useEffect(() => {
    dispatch(setTheme(isNight ? ThemeType.DARK : ThemeType.LIGHT));
  }, [isNight]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser does not support geolocation");
    }
  }, []);

  function onError(error: GeolocationPositionError) {
    console.log(error);
  }

  function onSuccess(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;

    getWeatherApi(latitude, longitude);

    axiosInstance
      .get(`/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
      .then((res) => {
        dispatch(setCity(res.data[0]));
      });

    getForecastApi(latitude, longitude);
  }

  function getWeatherApi(lat: number, lon: number) {
    return axiosInstance
      .get(
        `/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      .then((res) => {
        dispatch(setTodayWeather(res.data));
      });
  }

  function getForecastApi(lat: number, lon: number) {
    return axiosInstance
      .get(
        `/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      .then((res) => {
        dispatch(setWeekWeather(res.data.list));
        dispatch(setTodayHourForecast(res.data.list));
      });
  }

  function getWeatherInCity() {
    axiosInstance
      .get(`/geo/1.0/direct?q=${searchValue}&appid=${apiKey}`)
      .then((res) => {
        const { lat, lon } = res.data[0];
        dispatch(setCity(res.data[0]));

        getWeatherApi(lat, lon);

        getForecastApi(lat, lon);
      });
  }

  return (
    <Theme accentColor="cyan" radius="large" appearance={theme}>
      <Flex
        gap={"3"}
        p={"3"}
        minHeight={"100vh"}
        style={{ backgroundColor: "var(--cyan-2)" }}
      >
        <Flex
          direction={"column"}
          width={"450px"}
          p={"5"}
          style={{
            backgroundColor: "var(--cyan-3)",
            borderRadius: "var(--radius-5)",
          }}
        >
          <Flex mt={"1"} gap={"2"}>
            <TextField.Root
              style={{ width: "100%" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search the city..."
            ></TextField.Root>

            <IconButton onClick={getWeatherInCity}>
              <MagnifyingGlassIcon height="16" width="16" />
            </IconButton>
          </Flex>

          <Flex justify={"center"} mt={"4"} mb={"2"}>
            {todayWeather && (
              <img
                src={getWeatherIcon(
                  todayWeather?.weather[0].id,
                  Boolean(isNight)
                )}
                width="250px"
              />
            )}
          </Flex>

          <Heading size={"9"} align={"center"} mb={"5"}>
            {todayWeather && Math.round(todayWeather?.main.temp)}°C
          </Heading>

          <Flex justify={"between"} mt={"4"} mb={"2"}>
            <Text>{city?.name}</Text>
            <Text>
              {todayWeather && getWeekDay(todayWeather?.timezone, false)}
            </Text>
          </Flex>

          <Separator size={"4"} mb={"4"} />

          <Flex direction={"column"} mb={"4"} mt={"3"} gap={"3"}>
            <Flex gap={"2"} align={"center"}>
              <RainIcon />
              <Text size={"2"}>
                {todayWeather?.weather[0].description
                  ? todayWeather?.weather[0].description
                      .charAt(0)
                      .toUpperCase() +
                    todayWeather?.weather[0].description.slice(1)
                  : ""}
              </Text>
            </Flex>

            <Flex gap={"2"} align={"center"}>
              <MinTempIcon />
              <Text size={"2"}>
                Min Temperature{" "}
                {todayWeather && Math.round(todayWeather?.main.temp_min)}°C
              </Text>
            </Flex>

            <Flex gap={"2"} align={"center"}>
              <MaxTempIcon />
              <Text size={"2"}>
                Max Temperature{" "}
                {todayWeather && Math.round(todayWeather?.main.temp_max)}°C
              </Text>
            </Flex>
          </Flex>

          <Card mt={"4"}>
            <Flex justify={"between"}>
              <Flex gap={"3"}>
                <HumidityIcon />
                <Flex direction={"column"}>
                  <Text>{todayWeather?.main.humidity}%</Text>
                  <Text size={"2"}>Humidity</Text>
                </Flex>
              </Flex>

              <Flex gap={"3"}>
                <WindIcon />
                <Flex direction={"column"}>
                  <Text>
                    {todayWeather && Math.round(todayWeather.wind.speed)}km/h
                  </Text>
                  <Text size={"2"}>Wind Speed</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Flex
          direction={"column"}
          width={"100%"}
          p={"5"}
          style={{
            backgroundColor: "var(--cyan-3)",
            borderRadius: "var(--radius-5)",
          }}
        >
          <Tabs.Root defaultValue="week">
            <Tabs.List style={{ width: "140px" }}>
              <Tabs.Trigger value="today">Today</Tabs.Trigger>
              <Tabs.Trigger value="week">Week</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="today">
                <Flex justify={"between"}>
                  {todayHourForecast.map((weather, index) => (
                    <Card key={index}>
                      <Flex direction={"column"} align={"center"}>
                        <Text>{formatTime(weather.dt)}</Text>
                        <img
                          src={getWeatherIcon(weather.weather[0].id, false)}
                          width="70px"
                        />
                        <Text>{Math.round(weather.main.temp)}°</Text>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="week">
                <Flex justify={"between"}>
                  {weekWeather.map((weather, index) => (
                    <Card key={index}>
                      <Flex direction={"column"} align={"center"}>
                        <Text>{getWeekDay(weather.dt, true)}</Text>
                        <img
                          src={getWeatherIcon(weather.weather[0].id, false)}
                          width="70px"
                        />
                        <Text>{Math.round(weather.main.temp)}°</Text>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Tabs.Content>

              <Heading my={"6"}>Today’s Overview</Heading>

              <Flex justify={"between"}>
                <Card>
                  <Box minWidth={"240px"}>
                    <Flex justify={"between"} align={"center"}>
                      <Box>
                        <Text>Cloudiness</Text>
                        <Heading size={"8"} mt={"4"}>
                          {todayWeather?.clouds.all}%
                        </Heading>
                      </Box>

                      <img src={cloudiness} width={"80px"} />
                    </Flex>
                  </Box>
                </Card>

                <Card>
                  <Box minWidth={"240px"}>
                    <Flex justify={"between"} align={"center"}>
                      <Box>
                        <Text>Visibility</Text>
                        <Heading size={"8"} mt={"4"}>
                          {todayWeather &&
                            Math.round(todayWeather?.visibility / 1000)}{" "}
                          km
                        </Heading>
                      </Box>

                      <img src={visibility} width={"60px"} />
                    </Flex>
                  </Box>
                </Card>

                <Card>
                  <Box minWidth={"240px"}>
                    <Flex justify={"between"} align={"center"}>
                      <Box>
                        <Text>Pressure (hpa)</Text>
                        <Heading size={"8"} mt={"4"}>
                          {todayWeather?.main.pressure}
                        </Heading>
                      </Box>
                      <img src={barometer} width={"70px"} />
                    </Flex>
                  </Box>
                </Card>
              </Flex>

              <Flex gap={"4"} mt={"6"}>
                <Card style={{ width: "100%" }}>
                  <Box minWidth={"100%"} width={"100%"}>
                    <Text>Humidity & Cloudiness</Text>
                    <ApexChart />
                  </Box>
                </Card>

                <Card>
                  <Box minWidth={"240px"}>
                    <Text>Sunrise & Sunset</Text>
                    <Flex align={"center"} gap={"3"} mt={"3"}>
                      <SunriseIcon />
                      <Flex direction={"column"}>
                        <Text color="gray" size={"2"}>
                          Sunrise
                        </Text>
                        <Text>
                          {todayWeather && formatTime(todayWeather.sys.sunrise)}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex align={"center"} gap={"3"} mt={"3"}>
                      <SunsetIcon />
                      <Flex direction={"column"}>
                        <Text color="gray" size={"2"}>
                          Sunset
                        </Text>
                        <Text>
                          {todayWeather && formatTime(todayWeather.sys.sunset)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Card>
              </Flex>
            </Box>
          </Tabs.Root>
        </Flex>
      </Flex>
    </Theme>
  );
}

export default App;

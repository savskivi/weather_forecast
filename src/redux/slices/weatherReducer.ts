import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { City, CurrentWeather, Theme } from "../../types";

interface InitialState {
  theme: Theme;
  todayWeather: CurrentWeather | null;
  city: City | null;
  weekWeather: CurrentWeather[];
  todayHourForecast: CurrentWeather[];
}

const initialState: InitialState = {
  theme: Theme.LIGHT,
  todayWeather: null,
  city: null,
  weekWeather: [],
  todayHourForecast: [],
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    setTodayWeather: (state, action: PayloadAction<CurrentWeather>) => {
      state.todayWeather = action.payload;
    },

    setCity: (state, action: PayloadAction<City>) => {
        state.city = action.payload;
    },

    setWeekWeather: (state, action: PayloadAction<CurrentWeather[]>) => {
        state.weekWeather = action.payload.filter((item)=> item.dt_txt.includes('15:00:00'))
    },

    setTodayHourForecast: (state, action: PayloadAction<CurrentWeather[]>) => {
        state.todayHourForecast = action.payload.slice(0, 5);
    },
  },
});

export const { setTheme, setTodayWeather, setCity, setWeekWeather, setTodayHourForecast } = weatherSlice.actions;
export default weatherSlice.reducer;

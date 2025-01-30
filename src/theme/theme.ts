import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  // 画面幅sm: 1024px(ipadMiniの幅)を超えるとsideBarが出現
  // md, lg, xlは適当に設定している。
  breakpoints: {
    values: {
      xs: 0,
      sm: 1025,
      md: 1200,
      lg: 1300,
      xl: 1563
    }
  }
}
)
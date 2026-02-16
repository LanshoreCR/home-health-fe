import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D4F91'
    },
    secondary: {
      main: '#F77222'
    }
  },
  // You can also customize other colors, like background or text
  background: {
    default: '#D9D8D6'
  },
  text: {
    primary: '#000000'
  }
})

export default function HomeHealthThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

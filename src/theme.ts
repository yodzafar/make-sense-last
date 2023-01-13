import { createTheme } from '@mui/material';

export const $primaryColor = '#2af598';
export const $secondary = '#009efd';
export const $dangerSecondaryColor = '#f4c2c2';

export const $darkThemeFirstColor = '#171717';
export const $darkThemeSecondColor = '#282828';
export const $darkThemeThirdColor = '#4c4c4c';
export const $darkThemeForthColor = '#262c2f';

export const $topNavigationBarHeight = '35px';
export const $stateBarHeight = '2px';
export const $sideNavigationBarCompanionWidth = '23px';
export const $sideNavigationBarContentWidth = '300px';
export const $editorBottomNavigationBarHeight = '40px';
export const $editorTopNavigationBarHeight = '40px';
export const $toolboxWidth = '50px';

export const theme = createTheme({
  palette: {
    primary: {
      main: $primaryColor
    },
    secondary: {
      main: $secondary
    },
    text: {
      primary: '#fff',
      secondary: '#b6b1b1'
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
        variant: 'contained',
        color: 'secondary'
      },
      styleOverrides: {
        root: {
          letterSpacing: 'unset',
          '&.Mui-disabled': {
            backgroundColor: $darkThemeThirdColor,
            color: $darkThemeSecondColor
          }
        },

        sizeMedium: {
          padding: '9.5px 30px',
          lineHeight: 1.5,
          fontWeight: 700,
          borderRadius: 2
        },
        contained: {
          color: '#fff'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {}
    },
    MuiTextField: {
      defaultProps: {
        color: 'secondary'
      },
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': {
            borderBottomColor: 'white'
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomColor: 'white'
          },
          '&:hover::before': {
            borderColor: $darkThemeThirdColor
          },

          'input': {
            color: '#fff'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Saira Semi Condensed", sans-serif'
  }
});
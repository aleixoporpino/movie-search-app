import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Container from '@mui/material/Container';
import axios from 'axios';
import MoviesPage from './containers/MoviesPage';
import { LoadingContext } from './contexts/LoadingContext';
import { MenuContext } from './contexts/MenuContext';
import TVShowsPage from './containers/TVShowsPage';
import NotFound from './NotFound';
import Footer from './components/Footer';
import { movieColors, tvShowsColors } from './utils/colorScheme';
import { UserContext } from './contexts/UserContext';
import { getUser } from './api/userApi';
import UserProfilePage from './containers/UserProfilePage';
import WatchlistPage from './containers/WatchlistPage';
import AddToHomeScreenTip from './components/AddToHomeScreenTip';

function App() {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState('movies');
  const [user, setUser] = useState({});
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#0c0a08',
        paper: '#17130f',
      },
      text: {
        primary: '#f1e9dc',
        secondary: '#b9ac97',
      },
      divider: 'rgba(215,165,68,0.16)',
      warning: {
        main: movieColors.active,
        contrastText: '#0c0a08',
      },
      secondary: {
        main: tvShowsColors.active,
        contrastText: '#000',
      },
    },
    shape: {
      borderRadius: 3,
    },
    typography: {
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      h1: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      h2: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      h3: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      h4: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      h5: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      h6: { fontFamily: 'Iowan Old Style,Palatino Linotype,Georgia,serif' },
      button: {
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            letterSpacing: '0.08em',
            fontSize: '0.75rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: '1px solid rgba(215,165,68,0.12)',
            boxShadow: '0 14px 30px -14px rgba(0,0,0,0.7)',
          },
        },
      },
    },
  });

  // TODO: Move this to Main container maybe
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (!user.email > 0) {
      getUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.setItem('token', '');
          window.location.href = '/';
        });
    }
  }

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <MenuContext.Provider value={{ menu, setMenu }}>
        <ThemeProvider theme={darkTheme}>
          <UserContext.Provider value={{ user, setUser }}>
            <CssBaseline />
            <AddToHomeScreenTip />
            <Container sx={{ position: 'relative', minHeight: '100vh' }}>
              <Router>
                <Routes>
                  <Route exact path='/' element={<MoviesPage />} />
                  <Route exact path='/movies' element={<MoviesPage user={user} />} />
                  <Route exact path='/movies/:id' element={<MoviesPage user={user} />} />
                  <Route exact path='/tv-shows' element={<TVShowsPage user={user} />} />
                  <Route exact path='/tv-shows/:id' element={<TVShowsPage user={user} />} />
                  <Route exact path='/profile' element={<UserProfilePage user={user} />} />
                  <Route
                    exact
                    path='/watchlist'
                    element={<WatchlistPage page='movies' colorScheme={movieColors} />}
                  />
                  <Route
                    exact
                    path='/watchlist/movies'
                    element={<WatchlistPage page='movies' colorScheme={movieColors} />}
                  />
                  <Route
                    exact
                    path='/watchlist/tv-shows'
                    element={<WatchlistPage page='tv-shows' colorScheme={tvShowsColors} />}
                  />
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Router>
              <Footer />
            </Container>
          </UserContext.Provider>
        </ThemeProvider>
      </MenuContext.Provider>
    </LoadingContext.Provider>
  );
}

export default App;

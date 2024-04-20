import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Container from '@mui/material/Container';
import axios from 'axios';
import MoviesPage from './containers/MoviesPage';
import { LoadingContext } from './contexts/LoadingContext';
import RandomQuote from './components/RandomQuote';
import { MenuContext } from './contexts/MenuContext';
import TVShowsPage from './containers/TVShowsPage';
import NotFound from './NotFound';
import Footer from './components/Footer';
import { movieColors, tvShowsColors } from './utils/colorScheme';
import { UserContext } from './contexts/UserContext';
import { getUser } from './api/userApi';
import UserProfilePage from './containers/UserProfilePage';
import WatchlistPage from './containers/WatchlistPage';

function App() {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState('movies');
  const [user, setUser] = useState({});
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      secondary: {
        main: tvShowsColors.active,
        contrastText: '#000',
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
            <Container sx={{ position: 'relative', minHeight: '100vh' }}>
              <RandomQuote />
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

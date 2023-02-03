import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Container from '@mui/material/Container';
import MoviesPage from './containers/MoviesPage';
import { LoadingContext } from './contexts/LoadingContext';
import RandomQuote from './components/RandomQuote';
import { MenuContext } from './contexts/MenuContext';
import TVShowsPage from './containers/TVShowsPage';
import NotFound from './NotFound';
import Footer from './components/Footer';
import { tvShowsColors } from './utils/colorScheme';

function App() {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState('movies');
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      secondary: {
        main: tvShowsColors.active,
        contrastText: '#000',
      },
    },
  });
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <MenuContext.Provider value={{ menu, setMenu }}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Container sx={{ position: 'relative', minHeight: '100vh' }}>
            <RandomQuote />
            <Router>
              <Routes>
                <Route exact path='/' element={<MoviesPage />} />
                <Route exact path='/movies' element={<MoviesPage />} />
                <Route exact path='/movies/:id' element={<MoviesPage />} />
                <Route exact path='/tv-shows' element={<TVShowsPage />} />
                <Route exact path='/tv-shows/:id' element={<TVShowsPage />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Router>
            <Footer />
          </Container>
        </ThemeProvider>
      </MenuContext.Provider>
    </LoadingContext.Provider>
  );
}

export default App;

import React, { useContext, useEffect, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { QuestionMark } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import CountryFilter from '../components/CountryFilter';
import { tvShowsColors } from '../utils/colorScheme';
import CountryCodeEnum from '../utils/CountryCodeEnum';
import { API_URL } from '../../app.properties';
import { saveUser } from '../api/userApi';

const UserProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [countryListSelected, setCountryListSelected] = useState({});
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    buy: false,
    rent: false,
    streaming: false,
    countries: [],
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      const apiUrl = `${API_URL}auth/google?token=${localStorage.getItem('token')}`;
      window.location.href = apiUrl || `${window.location.origin}/${apiUrl}`;
      return;
    }

    if (!userForm.email && user && user.email) {
      setUserForm((prevState) => ({
        ...prevState,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rent: user.watchlist.rent,
        buy: user.watchlist.buy,
        streaming: user.watchlist.streaming,
        countries:
          user.watchlist.countries && user.watchlist.countries.length > 0
            ? user.watchlist.countries
            : [],
      }));

      if (
        Object.keys(countryListSelected).length === 0 &&
        user.watchlist &&
        user.watchlist.countries &&
        user.watchlist.countries.length > 0
      ) {
        const countryList = {};
        user.watchlist.countries.forEach((v) => {
          countryList[v] = true;
        });
        setCountryListSelected((prevState) => ({ ...prevState, ...countryList }));
      }
    }

    setCountries(Object.keys(CountryCodeEnum).map((it) => ({ country: it })));
  }, [countryListSelected, user, userForm]);

  const onChangeText = (e) => {
    userForm[e.target.id] = e.target.value;
    setUserForm((prevState) => ({
      ...prevState,
      ...userForm,
    }));
  };

  const onChangeCheckBox = (e) => {
    userForm[e.target.id] = e.target.checked;
    setUserForm({
      ...userForm,
    });
  };

  const onChangeCountry = (country) => {
    const newCountryListSelected = { ...countryListSelected };
    newCountryListSelected[country] = !newCountryListSelected[country];
    setCountryListSelected(newCountryListSelected);
    const selectedCountries = [];
    countries.forEach((item) => {
      if (newCountryListSelected[item.country]) {
        selectedCountries.push(item.country);
      }
    });

    const updatedUserForm = { ...userForm };
    updatedUserForm.countries = selectedCountries;
    setUserForm(updatedUserForm);
  };

  const onClickSave = () => {
    saveUser(userForm)
      .then((r) => {
        // TODO: Fix page refreshing
        setUser(r);
      })
      .catch(() => {
        // TODO: show error message
      });
  };

  return (
    <Box>
      {user && user.email ? (
        <FormControl>
          <Box>
            <Button variant='outlined' onClick={() => navigate('/movies')} size='medium'>
              HOME
            </Button>
          </Box>
          <Box
            display='flex'
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 6,
            }}
          >
            <Avatar alt='your profile avatar' src={user.avatarURL} sx={{ width: 80, height: 80 }} />
            <Typography variant='h5' component='div'>
              {user.email}
            </Typography>
          </Box>
          <Typography variant='h5' sx={{ pb: 2, pt: 10 }}>
            User Profile
          </Typography>

          <TextField
            id='firstName'
            label='First Name'
            value={userForm.firstName}
            onChange={onChangeText}
            sx={{ mb: 2 }}
          />
          <TextField
            id='lastName'
            label='Last Name'
            value={userForm.lastName}
            onChange={onChangeText}
            sx={{ mb: 2 }}
          />
          <Box sx={{ pt: 5 }}>
            <Tooltip
              title='will notify by email when movies you watchlisted are available for
              the following configuration'
            >
              <Typography variant='h5' sx={{ pb: 2 }}>
                Watchlist Configuration
                <IconButton aria-label='question-mark' disabled color='primary'>
                  <QuestionMark />
                </IconButton>
              </Typography>
            </Tooltip>

            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Checkbox id='rent' checked={userForm.rent} onChange={onChangeCheckBox} />}
                label='Notify for rent'
              />
              <FormControlLabel
                control={<Checkbox id='buy' checked={userForm.buy} onChange={onChangeCheckBox} />}
                label='Notify for Buy'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id='streaming'
                    checked={userForm.streaming}
                    onChange={onChangeCheckBox}
                  />
                }
                label='Notify for Streaming'
              />
            </FormGroup>
            {Object.keys(countryListSelected).length > 0 ? (
              <>
                <Typography>Preferred Countries:</Typography>
                <CountryFilter
                  selectAllValue={false}
                  onChangeSelectAll={() => {}}
                  countryList={countries}
                  countryListSelected={countryListSelected}
                  onChangeCountry={(country) => onChangeCountry(country)}
                  colorScheme={tvShowsColors}
                  showApplyFilter={false}
                  showSelectAll={false}
                />
              </>
            ) : (
              <></>
            )}
          </Box>
          <Box sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
            <Button variant='contained' onClick={onClickSave} size='large' color='secondary'>
              SAVE CHANGES
            </Button>
          </Box>
        </FormControl>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default UserProfilePage;

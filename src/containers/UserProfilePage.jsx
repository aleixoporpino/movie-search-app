import React, { useContext, useEffect, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ArrowBackIosNew, FavoriteBorder, InfoOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserContext } from '../contexts/UserContext';
import CountryFilter from '../components/CountryFilter';
import { tvShowsColors } from '../utils/colorScheme';
import CountryCodeEnum from '../utils/CountryCodeEnum';
import { API_URL } from '../../app.properties';
import { saveUser } from '../api/userApi';
import {
  disablePushNotifications,
  enablePushNotifications,
  getExistingPushSubscription,
  isPushSupported,
} from '../utils/pushNotifications';

const UserProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [countryListSelected, setCountryListSelected] = useState({});
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushError, setPushError] = useState('');
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
    if (!isPushSupported()) return;
    getExistingPushSubscription()
      .then((subscription) => setPushEnabled(!!subscription))
      .catch(() => {});
  }, []);

  const onChangePushEnabled = async (e) => {
    const { checked } = e.target;
    setPushError('');
    try {
      if (checked) {
        await enablePushNotifications();
      } else {
        await disablePushNotifications();
      }
      setPushEnabled(checked);
    } catch (err) {
      setPushError(err.message || 'Failed to update push notification settings');
    }
  };

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
      <Helmet>
        <title>User Profile | Search Movies and TV Shows</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      {user && user.email ? (
        <FormControl sx={{ width: '100%' }}>
          <Box
            sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Button
              variant='text'
              onClick={() => navigate('/movies')}
              size='medium'
              startIcon={<ArrowBackIosNew sx={{ fontSize: '0.8rem' }} />}
              sx={{ color: 'text.secondary' }}
            >
              Home
            </Button>
            <Button
              variant='outlined'
              onClick={() => navigate('/watchlist')}
              size='medium'
              startIcon={<FavoriteBorder sx={{ fontSize: '1rem' }} />}
            >
              Watchlist
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              borderRadius: 1,
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(215,165,68,0.16) 0%, rgba(23,19,15,0) 70%)',
              border: '1px solid rgba(215,165,68,0.12)',
            }}
          >
            <Avatar
              alt='your profile avatar'
              src={user.avatarURL}
              sx={{
                width: 84,
                height: 84,
                mx: 'auto',
                border: '2px solid rgba(215,165,68,0.35)',
              }}
            />
            <Typography variant='h6' component='div' sx={{ pt: 2 }}>
              {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {user.email}
            </Typography>
          </Box>

          <Card sx={{ mt: 5, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant='h6' sx={{ pb: 2.5 }}>
              Account Details
            </Typography>
            <TextField
              id='firstName'
              label='First Name'
              value={userForm.firstName}
              onChange={onChangeText}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              id='lastName'
              label='Last Name'
              value={userForm.lastName}
              onChange={onChangeText}
              fullWidth
            />
          </Card>

          <Card sx={{ mt: 3, p: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 0.5 }}>
              <Typography variant='h6'>Watchlist Configuration</Typography>
              <Tooltip title='Will notify by email when movies you watchlisted are available for the following configuration'>
                <IconButton aria-label='watchlist configuration info' size='small' color='primary'>
                  <InfoOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>

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
              {isPushSupported() ? (
                <FormControlLabel
                  control={<Checkbox checked={pushEnabled} onChange={onChangePushEnabled} />}
                  label='Enable browser push notifications'
                />
              ) : (
                <></>
              )}
              {pushError ? (
                <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                  {pushError}
                </Typography>
              ) : (
                <></>
              )}
            </FormGroup>
            {countries.length > 0 ? (
              <>
                <Typography sx={{ pb: 1 }}>Preferred Countries:</Typography>
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
          </Card>

          <Box sx={{ mt: 4, mb: 5, textAlign: 'center' }}>
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

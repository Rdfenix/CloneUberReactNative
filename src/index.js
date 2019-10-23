import React from 'react';
import Map from './components/Map';
import Geocoder from 'react-native-geocoding';
import {API_GOOGLE_KEY} from './API';

Geocoder.init(API_GOOGLE_KEY);

const App = () => <Map />;

export default App;

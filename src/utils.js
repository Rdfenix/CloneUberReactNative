import {
  PixelRatio
} from 'react-native'

import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

export const getPixelSize = (pixels) => (
  PixelRatio.getPixelSizeForLayoutSize(pixels)
);

export const getPositionInGPS = () => (
  new Promise((resolve, reject) => (
    Geolocation.getCurrentPosition(
      async position => {
          const {
            coords: {
              latitude,
              longitude
            },
          } = position;

          let region = {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
          };

          const response = await Geocoder.from({
            latitude,
            longitude
          });
          const address = response.results[0].formatted_address;
          const location = address.substring(0, address.indexOf(','));

          resolve({
            region,
            location
          })
        },
        err => {
          console.log('error');
          console.log(err);
          reject(err)
        }, {
          timeout: 2000,
          enableHighAccuracy: true,
          maximumAge: 1000,
        },
    )
  ))
);
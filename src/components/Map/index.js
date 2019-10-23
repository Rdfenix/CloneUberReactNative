import React, {Component, Fragment} from 'react';
import {View, Image, SafeAreaView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {PermissionsAndroid} from 'react-native';
import {getPixelSize, getPositionInGPS} from '../../utils';
import {API_GOOGLE_KEY} from '../../API';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';
import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeSmall,
} from './styles';

class Map extends Component {
  state = {
    region: {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: 0.0143,
      longitudeDelta: 0.0134,
    },
    destination: null,
    duration: null,
    location: null,
  };

  getLocation = () => {
    getPositionInGPS().then(result => {
      const {location, region} = result;

      this.setState(() => ({location, region}));
    });
  };

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message:
            'Maps App needs access to your map ' + 'so you can be navigated.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        return true;
      } else {
        console.log('location permission denied');
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    await this.requestLocationPermission().then(result => {
      if (result) {
        this.getLocation();
      }
    });

    this.getLocation();
  }

  handleLocationSelected = (data, details) => {
    const {geometry} = details;
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;

    this.setState(() => ({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text,
      },
    }));
  };

  handleBack = () => {
    this.setState(() => ({destination: null}));
  };

  render() {
    const {region, destination, duration, location} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <MapView
            style={{
              flex: 1,
            }}
            region={region}
            onMapReady={() => {}}
            showsMyLocationButton={false}
            showsUserLocation={true}
            loadingEnabled={true}
            cacheEnabled={false}
            followsUserLocation={true}
            ref={map => (this.mapView = map)}>
            {destination && (
              <Fragment>
                <Directions
                  origin={region}
                  destination={destination}
                  APIGoogle={API_GOOGLE_KEY}
                  onReady={result => {
                    this.setState(() => ({
                      duration: Math.floor(result.duration),
                    }));

                    this.mapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: getPixelSize(50),
                        left: getPixelSize(50),
                        top: getPixelSize(50),
                        bottom: getPixelSize(350),
                      },
                    });
                  }}
                />
                <Marker
                  coordinate={destination}
                  anchor={{x: 0, y: 0}}
                  image={markerImage}>
                  <LocationBox>
                    <LocationText>{destination.title}</LocationText>
                  </LocationBox>
                </Marker>

                <Marker coordinate={region} anchor={{x: 0, y: 0}}>
                  <LocationBox>
                    <LocationTimeBox>
                      <LocationTimeText>{duration}</LocationTimeText>
                      <LocationTimeSmall>MIN</LocationTimeSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                  </LocationBox>
                </Marker>
              </Fragment>
            )}
          </MapView>

          {destination ? (
            <Fragment>
              <Back onPress={this.handleBack}>
                <Image source={backImage} />
              </Back>
              <Details />
            </Fragment>
          ) : (
            <Search
              onLocationSelected={this.handleLocationSelected}
              APIGoogle={API_GOOGLE_KEY}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default Map;

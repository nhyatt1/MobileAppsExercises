import { Button, StyleSheet, View, Text, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';

export default function MapScreen () {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('Your marker has no title!');
  const [description, setDescription] = useState('Your marker has no description!')
  const regionRef = useRef();
  regionRef.current = region;
  const [region, setRegion] = useState ({
    latitude: 39.9937,
    longitude: -81.7340,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
    });
  
    useEffect(() => {
      (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
      // Need some error handling here, exactly what depends on the app
      return;
      }
      await Location.watchPositionAsync({
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 3,
      }, watchLocation);
      })();
      }, []);
      

    const watchLocation = (location) => {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: regionRef.latitudeDelta,
        longitudeDelta: regionRef.longitudeDelta
      }
      setRegion(newRegion);
    }
  
  const zoomChanges = (newRegion) => {
    setRegion (newRegion)
    }

    const markerTapped = (data) => {
      console.log(data.nativeEvent.id)

      }
  const markersPlaces = [];
  return (
    <View style={styles.container}>
      <MapView style={{width: '75%', height: '75%'}} 
      initialRegion={region}
      region={region}
      onRegionChangeComplete={zoomChanges}>
        {}
        <Marker
        key='currentLocation'
        identifier={"CurrentLocation"}
        coordinate={region}
        title='You'
        description="This is the location you're looking at"
        onPress={markerTapped}
        />
      </MapView>
      <Text>
        Want to place a marker where you're at?{"\n"}
        Give it a title and description, then hit the button below.
      </Text>
      <TextInput placeholder='Give your marker a title:'/>
      <TextInput placeholder='Give your marker a description:'/>
      <Button title='Place Marker'></Button>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

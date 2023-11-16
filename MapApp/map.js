  import { Button, StyleSheet, View, Text, TextInput, Alert } from 'react-native';
  import { useState, useEffect, useRef } from 'react';
  import { useDispatch, useSelector } from 'react-redux'
  import MapView from 'react-native-maps';
  import * as Location from 'expo-location';
  import { Marker } from 'react-native-maps';
  import { AntDesign } from '@expo/vector-icons';
  import { numIncrement, numDecrement, addMarker, removeMarker } from './slices.js';

  export default function MapScreen () {
    const markerList = useSelector((state) => state.markers.markerList);
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const regionRef = useRef();
    regionRef.current = region;
    const [region, setRegion] = useState ({
      latitude: 39.9937,
      longitude: -81.7340,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
      });
    const displayMarkers = () =>{
      return markerList.map((marker, index) => (
        <Marker
          key={index}
          identifier={index}
          coordinate={marker.location}
          title={marker.title}
          description={marker.description}
          onPress={() =>
            Alert.alert('Delete this Pin?', 'If you delete this pin, it will not be recoverable.', [
                {text: 'Yes', onPress:()=>{
                    console.log('Yes Pressed'); 
                    dispatch(removeMarker(marker.id));
                    dispatch(numDecrement());
                  }},
                {text: 'No', onPress:()=>{console.log('Cancel Pressed')}, style: 'cancel'}])}/>  
      ))};

      useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
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


    return (
      <View style={styles.container}>
        <MapView style={{width: '100%', height: '50%'}} 
        initialRegion={region}
        onRegionChangeComplete={zoomChanges}>
        {displayMarkers()}
        <Marker
        key='currentLocation'
        identifier={"CurrentLocation"}
        coordinate={region}
        title='You'
        description="This is the location you're looking at"
        onPress={markerTapped}
        />
        </MapView>
        <Text style={{textAlign:"center", marginTop:20, marginBottom:20}}>
          Want to place a marker where you're at?{"\n"}
          Give it a title and description, then hit the button below.
        </Text>
        <TextInput placeholder='Enter text here to give your marker a title:' onChangeText={(data) => setTitle(data)} style={{backgroundColor: '#89CFF0', marginBottom: 20, width: 350}}/>
        <TextInput placeholder='Enter text here to give your marker a description:' onChangeText={(data) => setDescription(data)} style={{backgroundColor: '#89CFF0', marginBottom: 20, width: 350}}/>
        <AntDesign.Button 
        name='pluscircleo'
        color={title == '' || description == '' ? 'gray' : '#FFFFFF'}
        disabled={title == '' || description == ''}
        onPress={()=> {{dispatch(addMarker({id: markerList.length, title: title, description: description, location: region})); dispatch(numIncrement());}}}>
          Place Marker
        </AntDesign.Button>
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

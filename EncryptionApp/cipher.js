import { useState, useEffect } from 'react';
import { Text, View, Image, Button, TextInput } from 'react-native';
import { styles } from './styles.js';
import { useDispatch, useSelector } from 'react-redux';
import { numCipheredIncrement, addMessages } from './slices.js';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen({navigation}){
  //Cipher screen is returned with an image, two textinputs, 3 buttons, and 2 sections of text. 
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const [ciphered, setCiphered] = useState('');
  const numCiphered = useSelector((state) => state.history.numCiphered);

  const [location, setLocation] = useState(null);
  const [locMessage, setLocMessage] = useState('Waiting...');
  
  let accShift = 0;
  // console.log(Math.round("latitude * 10000", location.coords.latitude * 10000));
  // console.log(Math.round("longitude * 10000", location.coords.longitude * 10000));
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
        setLocation(location);
        setLocMessage("Location retreived!");
        })()
      },
    []
  );

  function caesarCipher(text){
    //Function to cipher a message, uses charCodes. 
    let cipheredText = '';

    let latitude = parseInt(location.coords.latitude * 10000);
    let longitude = parseInt(location.coords.longitude * 10000);

    accShift = Math.abs((latitude + longitude) % 26);

    console.log("latitude: ", latitude);
    console.log("longitude: ", longitude);
    console.log("accShift: ", accShift);

      //encryption
      for (let i=0; i < text.length; i++){
        if(text.charCodeAt(i) >= 65 && text.charCodeAt(i) <= 90){
          //UPPERCASE alphabet encryption
          if((text.charCodeAt(i) + accShift) > 90){
            //for shifts that wrap to start of alphabet
            cipheredText += String.fromCharCode(64 + ((text.charCodeAt(i) + accShift) % 90));
          }
          else{
            //concatenates any non alphabet letter back to the decrypted message.
            cipheredText += String.fromCharCode(text.charCodeAt(i) + accShift);
          }
        }
        else if(text.charCodeAt(i) >= 97 && text.charCodeAt(i) <= 122){
          //LOWERCASE alphabet encryption
          if ((text.charCodeAt(i) + accShift) > 122){
            //for shifts that wrap to start of alphabet
            cipheredText += String.fromCharCode(96 + ((text.charCodeAt(i) + accShift) % 122));
          }
          else{
            cipheredText += String.fromCharCode(text.charCodeAt(i) + accShift);
          }
        }
        else{
          cipheredText += text.charAt(i);
        }
      }
    return cipheredText;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 55, fontWeight: 'bold', marginBottom: 20, color: 'black'}}>
        Caesar Cipher
      </Text>
      <Image style={{resizeMode: 'contain', width: 300, height: 300, marginBottom: 15}} 
      source={require('./assets/Caesar.png')}/>
      {/*TextInputs for user's message and chosen cipher key.*/}
        <View>
          <TextInput placeholder= 'Enter a message to encrypt.' 
          style={{width: 300, height: 25, backgroundColor: '#857b69', color: 'white'}}
          onChangeText={text => setMessage(text)}
          />
        </View>
        <Text style={{textAlign: "center"}}>
          Encrypt your message once your location loads.{"\n"}
          Location Status: {locMessage}
        </Text>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
        {/*Buttons will encrypt user's message and dispatch the messages 
        to the history slice/reducer/store, adding them to an array of objects.
        Each time the button is pressed this occurs.*/}
        
          <AntDesign.Button name='arrowup' style={{marginRight: 10}} 
          color={message == '' || location == null ? 'gray' : '#FFFFFF'}
          onPress={() => {
            setCiphered(caesarCipher(message));
            let temp = caesarCipher(message);
            dispatch(addMessages(
              { id: numCiphered,
                result: temp
              }));
            dispatch(numCipheredIncrement());
          }}
          disabled={ message == '' || location == null }>
            Encrypt
          </AntDesign.Button>
        </View>
        <Text style={{marginBottom: 10, textAlign:"center"}}>
          {"\n"}Your ciphered message will appear here: {ciphered}
        </Text>

        <AntDesign.Button name='book'
          onPress ={() => navigation.navigate('History')}>
            Go to History
          </AntDesign.Button>
    </View>
  );
}


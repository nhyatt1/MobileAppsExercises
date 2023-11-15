import { View, Button, Text } from 'react-native';
import { styles } from './styles.js';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons'; 
import * as Location from 'expo-location';

export default function DetailsScreen ({route, navigation}) {
    const messages = useSelector((state) => state.history.messages);
    const [decryptedMessage, setDecryptedMessage] = useState('');
    const [location, setLocation] = useState(null);
    const [locMessage, setLocMessage] = useState('Waiting...');
    let accShift = 0;

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
            },[]);

    function caesarCipher(text){
        //Function to cipher a message, uses charCodes. 
        console.log(location);
        let cipheredText = '';
        let latitude = parseInt(location.coords.latitude * 10000);
        let longitude = parseInt(location.coords.longitude * 10000);

        accShift = Math.abs((latitude + longitude) % 26);
        console.log("latitude: ", latitude);
        console.log("longitude: ", longitude);
        console.log("accShift: ", accShift);
          //decryption
          for (let i=0; i < text.length; i++) {
            if ((text.charCodeAt(i) + accShift == text.charCodeAt(i)) && accShift != 0){
              setCiphered('You must enter a number for your key!');
              return; 
            }
            if(text.charCodeAt(i) >= 65 && text.charCodeAt(i) <= 90){
              //uppercase alphabet decryption
              if((text.charCodeAt(i) - accShift) < 65){
                //for shifts that wrap to end of alphabet
                cipheredText += String.fromCharCode(91 - (65 % (text.charCodeAt(i) - accShift)));
              }
              else{
                //concatenates any non alphabet letter back to the decrypted message.
                cipheredText += String.fromCharCode(text.charCodeAt(i) - accShift);
              }
            }
            else if(text.charCodeAt(i) >= 97 && text.charCodeAt(i) <= 122){
              //lowercase alphabet decryption by caesar cipher
              if ((text.charCodeAt(i) - accShift) < 97){
                //for shifts that wrap to end of alphabet
                cipheredText += String.fromCharCode(123 - (97 % (text.charCodeAt(i) - accShift)));
              }
              else{
                cipheredText += String.fromCharCode(text.charCodeAt(i) - accShift);
              }
            }
            else{
              cipheredText += text.charAt(i);
            }
          }
        return cipheredText;
      }

    return(
        <View style={styles.container}> 
            <View style={styles.container}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'black', textAlign: 'center'}}>
                    Your message encrypted as: {messages[route.params.detailID].result}
                </Text>
                    <View>
                        <Text style={{marginBottom: 25, textAlign:"center"}}>
                            Press the decrypt button once your location updates to see the original message. You will only see the message if you are within 11m/36ft of where the message was originally encrypted.{"\n\n"}
                            Location status: {locMessage}{"\n"}
                            Decrypted Message: {decryptedMessage}
                        </Text>
                    </View>
                    <AntDesign.Button 
                    name='arrowdown' 
                    onPress={() => {setDecryptedMessage(caesarCipher(messages[route.params.detailID].result))}}
                    color={ location == null ? 'gray' : '#FFFFFF' }
                    disabled={location == null}
                    >
                        Decrypt
                    </AntDesign.Button>
            </View>
            <View style={{marginTop: 60}}>
                <AntDesign.Button name='enter' onPress={()=>{navigation.navigate('Home')}}>
                    Back to Home
                </AntDesign.Button>
            </View>
        </View>
    );
}
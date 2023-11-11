import { useState } from 'react';
import { Text, View, Image, Button, TextInput } from 'react-native';
import { styles } from './styles.js';
import { useDispatch, useSelector } from 'react-redux';
import { numCipheredIncrement, addMessages } from './slices.js';
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons'; 


export default function CipherScreen({navigation}){
  //Cipher screen is returned with an image, two textinputs, 3 buttons, and 2 sections of text. 
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('1');
  const shift = parseInt(key, 10);
  const [ciphered, setCiphered] = useState('');
  const dispatch = useDispatch();
  const numCiphered = useSelector((state) => state.history.numCiphered);
  const [slider, setSlider] = useState (1);
  
  let accShift = 1;

  // function isValidKey(key) {
  //   //Function to ensure a user enters a valid key (will most likely be irrelevant when a slider is implemented.)
  //   const isValid = /^\d{1,2}$/.test(key.trim());
  //   const parsedKey = parseInt(key, 10);
  //   return isValid && !isNaN(parsedKey) && parsedKey >= 1 && parsedKey <= 25;
  // }

  function caesarCipher(text, index, direction){
    //Function to cipher a message, uses charCodes. 
    let cipheredText = '';
    accShift = index % 26;
    if (direction == 1) {
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
    }
    else if (direction == -1) {
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
          <TextInput placeholder= 'Enter a message to cipher.' 
          style={{width: 300, height: 25, backgroundColor: '#857b69', color: 'white'}}
          onChangeText={text => setMessage(text)}
          />
          <Text style={{textAlign: 'center', marginTop: 15}}>
            Move the slider to change your encryption key:
          </Text>
          <Slider 
            style={{width: 300, height: 10, marginTop: 20, marginBottom: 20}}
            minimumValue={1}
            maximumValue={25}
            onValueChange={(data) => {setKey(data); setSlider(data)}}
            step={1}
            minimumTrackTintColor="#857b69"
            maximumTrackTintColor="#F0F0F0"

          />
          <Text style={{textAlign: 'center'}}>
          Current value: {slider}
          </Text>
        </View>
        
        {/* <View style={{marginBottom: 10}}>
          <TextInput placeholder= 'Enter your encryption key (1-25).' 
          style={{width: 300, height: 25, backgroundColor: '#857b69', color: 'white'}}
          onChangeText={text => setKey(text)}
          />
        </View>    */}
        <View style={{flexDirection: 'row', marginBottom: 20}}>
        {/*Buttons will encrypt or decrypt user's message respectively, 
        and dispatch the messages to the history slice/reducer/store, adding them to an array of objects.
        Each time the button is pressed this occurs.*/}
          <AntDesign.Button name='arrowup' style={{marginRight: 10}} 
          color={message == '' ? 'gray' : '#89CFF0'}
          onPress={() => {
            setCiphered(caesarCipher(message, key, 1));
            let temp = caesarCipher(message, key, 1);
            dispatch(addMessages(
              { id: numCiphered,
                message: message,
                shift: shift,
                type:"Encryption",
                result: temp
              }));
            dispatch(numCipheredIncrement());
          }}
          disabled={ message == ''}>
            Encrypt
          </AntDesign.Button>
          <Text> </Text>
          <AntDesign.Button name='arrowdown'
          color={message == '' ? 'gray' : '#89CFF0'}
          onPress={() => {
            setCiphered(caesarCipher(message, shift, -1));
            let temp = caesarCipher(message, shift, -1)
            dispatch(addMessages(
              { id: numCiphered,
                message: message,
                shift: shift,
                type:"Decryption",
                result: temp
              }));
            dispatch(numCipheredIncrement());
          }}
          disabled={ message == ''}>
            Decrypt
          </AntDesign.Button>
        </View>
        <Text style={{marginBottom: 10}}>
          Your message will appear here: {ciphered}
        </Text>
        {/*Takes user to the History Page. */}
        <AntDesign.Button name='book'
          onPress ={() => navigation.navigate('History')}>
            Go to History
          </AntDesign.Button>
    </View>
  );
}


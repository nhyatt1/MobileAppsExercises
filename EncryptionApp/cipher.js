import { useState } from 'react';
import { Text, View, Image, Button, TextInput } from 'react-native';
import { styles } from './styles.js';
import { useDispatch, useSelector } from 'react-redux';
import { numCipheredIncrement, addMessages } from './slices.js';

export default function CipherScreen({navigation}){
  //Cipher screen is returned with an image, two textinputs, 3 buttons, and 2 sections of text. 
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('0');
  const shift = parseInt(key, 10);
  const [ciphered, setCiphered] = useState('');
  const dispatch = useDispatch();
  const numCiphered = useSelector((state) => state.history.numCiphered);
  
  let accShift = 0;

  function isValidKey(key) {
    //Function to ensure a user enters a valid key (will most likely be irrelevant when a slider is implemented.)
    const isValid = /^\d{1,2}$/.test(key.trim());
    const parsedKey = parseInt(key, 10);
    return isValid && !isNaN(parsedKey) && parsedKey >= 1 && parsedKey <= 25;
  }

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
      <Text style={{ fontSize: 55, fontWeight: 'bold', marginBottom: 40, color: 'black'}}>
        Caesar Cipher Machine
      </Text>
      <Image style={{resizeMode: 'contain', width: 300, height: 300, marginBottom: 25}} 
      source={require('./assets/Caesar.png')}/>
      {/*TextInputs for user's message and chosen cipher key.*/}
        <View style={{marginBottom: 10}}>
          <TextInput placeholder= 'Input your message to cipher.' 
          style={{width: 300, height: 25, backgroundColor: '#857b69', color: 'white'}}
          onChangeText={text => setMessage(text)}
          />
        </View> 
        <View style={{marginBottom: 10}}>
          <TextInput placeholder= 'Enter your encryption key (1-25).' 
          style={{width: 300, height: 25, backgroundColor: '#857b69', color: 'white'}}
          onChangeText={text => setKey(text)}
          />
        </View>   
        <View style={{flexDirection: 'row', marginTop: 10}}>
        {/*Buttons will encrypt or decrypt user's message respectively, 
        and dispatch the messages to the history slice/reducer/store, adding them to an array of objects.
        Each time the button is pressed this occurs.*/}
          <Button title='Encrypt' style={{marginRight: 10}} 
          onPress={() => {
            setCiphered(caesarCipher(message, shift, 1));
            let temp = caesarCipher(message, shift, 1);
            dispatch(addMessages(
              { id: numCiphered,
                message: message,
                shift: shift,
                type:"Encryption",
                result: temp
              }));
            dispatch(numCipheredIncrement());
          }}
          disabled={!isValidKey(key) || message == ''}/>

          <Button title='Decrypt' style={{marginLeft: 10}} 
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
          disabled={!isValidKey(key) || message == ''}/>
        </View>
        <Text>
          Your message will appear here: {ciphered}
        </Text>
        {/*Takes user to the History Page. */}
        <Button title='To History'
          onPress ={() => navigation.navigate('History')}/>
    </View>
  );
}


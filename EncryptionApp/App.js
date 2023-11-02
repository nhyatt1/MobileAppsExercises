import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [message, setMessage] = useState('');
  const [key, setKey] = useState('0');
  const shift = parseInt(key, 10);
  const [ciphered, setCiphered] = useState('');
 
  let accShift = 0;

  function isValidKey(key) {
    //Function to ensure a user enters a valid key (will most likely be irrelevant when a slider is implemented.)
    const isValid = /^\d{1,2}$/.test(key.trim());
    const parsedKey = parseInt(key, 10);
    return isValid && !isNaN(parsedKey) && parsedKey >= 1 && parsedKey <= 25;
  }

  function caesarCipher(text, index, direction){
    //Function to cipher a message
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
      <Text style={{ fontSize: 55, fontWeight: 'bold', marginBottom: 40, color: 'black'}}>Caesar Cipher Machine</Text>
      <Image style={{resizeMode: 'contain', width: 300, height: 300, marginBottom: 25}} 
      source={require('./assets/Caesar.png')}/>
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
          <Button title='Encrypt' style={{marginRight: 10}} 
          onPress={() => setCiphered(caesarCipher(message, shift, 1))}
          disabled={!isValidKey(key) || message == ''}/>

          <Button title='Decrypt' style={{marginLeft: 10}} 
          onPress={() => setCiphered(caesarCipher(message, shift, -1))}
          disabled={!isValidKey(key) || message == ''}/>
        </View>
        <Text>Your message will appear here: {ciphered}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

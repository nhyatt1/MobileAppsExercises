import { Text, View, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles.js';
import { useSelector, useDispatch } from 'react-redux';
import { removeMessage } from './slices.js';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { AntDesign } from '@expo/vector-icons'; 

export default function HistoryScreen ({navigation}) {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.history.messages);
    let selectedKeys = [];
    const deleteMultipleKeys = () =>{
        for (let i = 0; i < selectedKeys.length; i++){
            dispatch(removeMessage(selectedKeys[i]));
        }
        selectedKeys = [];
    }
    const buttonConfirmation = () =>
        Alert.alert('ARE YOU SURE?', 'If you delete this message, it will not be recoverable.', [
            {text: 'Confirm', onPress:()=>{
                console.log('Confirm Pressed'); 
                deleteMultipleKeys();
                navigation.navigate('Home');
        }},
            {text: 'Cancel', onPress:()=>{console.log('Cancel Pressed')}, style: 'cancel'}
    ]);
    
//when this returns and you delete the list, i send the user back home because the visual check confirm doesn't reset unless you go to homepage
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black', textAlign: 'center'}}>Here is your history of messages ciphered</Text>
            <Text style={{fontSize: 15, textAlign: 'center'}}>Press on the message to see its details.</Text>
            <Text style={{fontSize: 15, marginTop: 10, textAlign: 'center'}}>If you want to delete multiple messages from the history, select the checkboxes and press the trash button. YOU WILL BE SENT BACK HOME</Text>
            <AntDesign.Button name='enter'
                onPress ={() => {navigation.navigate('Home'); 
                }}>
                    Back Home
                </AntDesign.Button>
            <FlatList
                style={{marginTop: 10}}
                data = {messages}
                extraData={messages.state}
                renderItem ={( item ) => (
                    <TouchableOpacity
                        onPress={ () => {navigation.navigate('Details', {detailID: item.index})} }> 
                        <View style={{flexDirection: 'row', marginBottom: 25}}>
                        <BouncyCheckbox
                            size={25}
                            fillColor="#857b69"
                            unfillColor="#F0F0F0"
                            iconStyle={{ borderColor: "#857b69" }}
                            innerIconStyle={{ borderWidth: 1 }}
                            onPress={() => {{
                                if(selectedKeys.includes(item.item.id)){
                                    if (selectedKeys.length == 1){
                                        selectedKeys.pop()
                                    }
                                    else{
                                        selectedKeys = selectedKeys.filter(num => num !== item.item.id);
                                    }
                                }
                                else{
                                    selectedKeys.push(item.item.id);
                                }
                                }}}/>
                            <Text style={{fontSize: 20}}>
                                Message: {item.item.message}
                            </Text>
                        </View>
                        
                    </TouchableOpacity>   
                )}
                keyExtractor={(item, index) => index}
                />
            <AntDesign.Button name='delete'
                onPress ={buttonConfirmation}
            >DELETE</AntDesign.Button>
        </View>
      );
}

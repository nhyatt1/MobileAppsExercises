import { View, Button, Text, Alert } from 'react-native';
import { styles } from './styles.js';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from './slices.js';

export default function DetailsScreen ({route, navigation}) {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.history.messages);
    const buttonConfirmation = () =>
    Alert.alert('ARE YOU SURE?', 'If you delete this message, it will not be recoverable.', [
        {text: 'Confirm', onPress:()=>{console.log('Confirm Pressed'); navigation.navigate('History'); dispatch(removeMessage(messages[route.params.detailID].id)); }},
        {text: 'Cancel', onPress:()=>{console.log('Cancel Pressed')}, style: 'cancel'}
    ]);

    return(
        <View style={styles.container}> 
            <View style={styles.container}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'black'}}>
                    Here are the details of this Cipher:
                </Text>
                    <View>
                        <Text style={{marginBottom: 25}}>
                            Your original message was: {messages[route.params.detailID].message}
                            {"\n"}
                            The Cipher key was: {messages[route.params.detailID].shift}
                            {"\n"}
                            Your Cipher type: {messages[route.params.detailID].type}
                            {"\n"}
                            The result was: {messages[route.params.detailID].result}
                        </Text>
                    </View>
                    <Button title='DELETE?' onPress={buttonConfirmation}/>
            </View>
            <View style={{marginTop: 60}}>
                <Button title='To History' onPress={()=>{navigation.navigate('History')}}/>
            </View>
        </View>
    );
}
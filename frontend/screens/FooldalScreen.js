import { StyleSheet, View, Button, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

const getData = async () => {
    const felhasznalo = await AsyncStorage.getItem('@felhasznalo_email');
    return felhasznalo != null ? felhasznalo : "";
};

export default function FooldalScreen({navigation}) {
    const [felhasznalo,setFelhasznalo] = useState("")

    useEffect(() => {
        getData().then(adat => setFelhasznalo(adat))
    },[])
    
    useFocusEffect(
        useCallback(() => {
            getData().then(adat => setFelhasznalo(adat))
            return () => {}
    },[]))

    return (
        <View style={styles.container}>
            <Text>{felhasznalo}</Text>
            <Button title='Kvíz' onPress={() => navigation.navigate('Kvíz')}/>
            <Button title='Profil' onPress={felhasznalo == "" ? () => navigation.navigate('Bejelentkezés') : () => navigation.navigate('Profil')}/>
            <Button title='Kapcsolat' onPress={felhasznalo == "" ? () => navigation.navigate('Bejelentkezés') : () => navigation.navigate('Kapcsolat')}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
});

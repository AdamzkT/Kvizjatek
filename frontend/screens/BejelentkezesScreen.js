import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export default function BejelentkezesScreen({navigation}) {
    const [felhasznalo, setFelhasznalo] = useState('')
    const [jelszo, setJelszo] = useState('')
    const [megjegyzes, setMegjegyzes] = useState('')

    const signIn = () =>{
        if(felhasznalo == "" || jelszo == "") { setMegjegyzes("Minden adatot meg kell adni")}
        else{
            Alert.alert("Beléptél")
        }
    }

    return (
        <View style={styles.container}>
        <Text>Felhasználónév</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setFelhasznalo} value={felhasznalo}/>
        <Text>Jelszó</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo} value={jelszo}/>
        <Button title='Bejelentkezés' onPress={() => signIn()}/>
        <Button title='Regisztráció' onPress={() => navigation.navigate('Regisztráció')}/>
        <Text>{megjegyzes}</Text>
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

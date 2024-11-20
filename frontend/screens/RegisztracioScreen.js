import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export default function RegisztracioScreen(navigation) {
    const [felhasznalo, setFelhasznalo] = useState('')
    const [email, setEmail] = useState('')
    const [jelszo, setJelszo] = useState('')
    const [jelszo2, setJelszo2] = useState('')
    const [megjegyzes, setMegjegyzes] = useState('')

    const signIn = () =>{
        setMegjegyzes('')
        let jo = true
        if(felhasznalo == "" || email == "" || jelszo == "" || jelszo2 == "") { setMegjegyzes("Minden adatot meg kell adni"); jo = false}
        
    }

    return (
        <View style={styles.container}>
        <Text>Felhasználónév</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setFelhasznalo} value={felhasznalo}/>
        <Text>Email</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setEmail} value={email}/>
        <Text>Jelszó</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo} value={jelszo}/>
        <Text>Jelszó megerősítés</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo2} value={jelszo2}/>
        <Button title='Regisztráció' onPress={() => signUp()}/>
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

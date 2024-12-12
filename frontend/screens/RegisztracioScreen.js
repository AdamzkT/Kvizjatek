import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useState } from 'react';
import Ipcim from '../Ipcim';

export default function RegisztracioScreen({navigation}) {
    const [felhasznalo, setFelhasznalo] = useState('')
    const [email, setEmail] = useState('')
    const [jelszo, setJelszo] = useState('')
    const [jelszo2, setJelszo2] = useState('')
    const [megjegyzes, setMegjegyzes] = useState('')

    const regisztracio = async (felhasznalo,email,jelszo) => {
      let x = await fetch(`${Ipcim.Ipcim1}/regisztracio`, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "felhasznalo_email" : email,
          "felhasznalo_nev" : felhasznalo,
          "felhasznalo_jelszo" : jelszo,
        })
      });
      let y = await x.text()
      Alert.alert('',y,[{text: 'OK', onPress: () => navigation.goBack()}])
      if( x.status == 200 ){
        setFelhasznalo("")
        setEmail("")
        setJelszo("")
        setJelszo2("")
      }
    }

    const signUp = async () =>{
      setMegjegyzes('')
      const nevFoglaltE = await felhasznalo_foglalt(felhasznalo);
      const emailFoglaltE = await email_foglalt(email);
      let jo = true

      const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]{1,63}[a-zA-Z0-9]@[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9-]{0,63}(\.[a-zA-Z]{2,})+$/;

      if (felhasznalo == "" || email == "" || jelszo == "" || jelszo2 == "") { setMegjegyzes("Minden adatot meg kell adni"); jo = false }
      // Felhasználó
      else if (felhasznalo.length < 2 || felhasznalo.length > 20) { setMegjegyzes("Felhasználónév 2-20 karakter hosszú legyen"); jo = false }
      else if (nevFoglaltE) { setMegjegyzes("Felhasználónév foglalt"); jo = false }
      // Email
      else if (!emailRegex.test(email)) { setMegjegyzes("Nem megfelelő email formátum"); jo = false }
      else if (emailFoglaltE) { setMegjegyzes("Foglalt felhasználónév"); jo = false }
      // Jelszó
      else if (jelszo.length < 8 || jelszo.length > 64) { setMegjegyzes("Jelszó 8-64 karakter hosszú legyen"); jo = false }
      else if (jelszo != jelszo2) { setMegjegyzes("Jelszavak nem egyeznek meg"); jo = false }
      
      if(jo) { regisztracio(felhasznalo,email,jelszo) }
    }

    const felhasznalo_foglalt = async (teszt_nev) => {
      let x = await fetch(`${Ipcim.Ipcim1}/regisztracio_felhasznalo`, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "felhasznalo_nev" : teszt_nev
        })
      });
      let y = await x.json()
      
      return y.length !== 0
    }

    const email_foglalt = async (teszt_email) => {
      let x = await fetch(`${Ipcim.Ipcim1}/regisztracio_email`, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "felhasznalo_email" : teszt_email
        })
      });
      let y = await x.json()
      
      return y.length !== 0
    }

    return (
        <View style={styles.container}>
        <Text>Felhasználónév</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setFelhasznalo} value={felhasznalo}/>
        <Text>Email</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setEmail} value={email}/>
        <Text>Jelszó</Text>
        <TextInput autoCapitalize='none' secureTextEntry={true} style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo} value={jelszo}/>
        <Text>Jelszó megerősítés</Text>
        <TextInput autoCapitalize='none' secureTextEntry={true} style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo2} value={jelszo2}/>
        <Button title='Regisztráció' onPress={signUp}/>
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

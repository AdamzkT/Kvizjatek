import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useState } from 'react';
import Ipcim from '../Ipcim';

export default function RegisztracioScreen(navigation) {
    const [felhasznalo, setFelhasznalo] = useState('')
    const [email, setEmail] = useState('')
    const [jelszo, setJelszo] = useState('')
    const [jelszo2, setJelszo2] = useState('')
    const [megjegyzes, setMegjegyzes] = useState('')
    const [felhasznaloFoglalt, setFelhasznaloFoglalt] = useState(true)
    const [emailFoglalt, setEmailFoglalt] = useState(true)

    const signUp = () =>{
        setMegjegyzes('')
        felhasznalo_foglalt(felhasznalo)
        email_foglalt(email)
        let jo = true

        if (felhasznalo == "" || email == "" || jelszo == "" || jelszo2 == "") { setMegjegyzes("Minden adatot meg kell adni"); jo = false }
        // Felhasználó
        else if (felhasznalo.length < 2) { setMegjegyzes("Felhasználónév rövid (legalább 2, legfeljebb 20 karakter lehet)"); jo = false }
        else if (felhasznalo.length > 20) { setMegjegyzes("Felhasználónév hosszú (legalább 2, legfeljebb 20 karakter lehet)"); jo = false }
        else if (felhasznaloFoglalt) { setMegjegyzes("Felhasználónév foglalt"); jo = false }
        // Email
        else if (email.split('@').length != 2 || email.split('@')[1].split('.').length != 2) { setMegjegyzes("Nem megfelelő email formátum"); jo = false }
        else if (emailFoglalt) { setMegjegyzes("Foglalt felhasználónév"); jo = false }
        // Jelszó
        else if (jelszo.length < 8) { setMegjegyzes("Jelszó túl rövid (legalább 8 karakter legyen)"); jo = false }
        else if (jelszo.length > 64) { setMegjegyzes("Jelszó túl hosszú (legfeljebb 64 karakter hosszú lehet)"); jo = false }
        else if (jelszo != jelszo2) { setMegjegyzes("Jelszavak nem egyeznek meg"); jo = false }
        
        if(jo) { Alert.alert("Sikeres regisztráció!") }
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
      
      if(y.length == 0) { setFelhasznaloFoglalt(false) }
      else { setEmailFoglalt(true) }
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
      if(y.length == 0) { setEmailFoglalt(false) }
      else { setEmailFoglalt(true) }
    }

    return (
        <View style={styles.container}>
        <Text>Felhasználónév</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setFelhasznalo} value={felhasznalo}/>
        <Text>Email</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setEmail} value={email}/>
        <Text>Jelszó</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo} value={jelszo}/>
        <Text>Jelszó megerősítés</Text>
        <TextInput autoCapitalize='none' style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo2} value={jelszo2}/>
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

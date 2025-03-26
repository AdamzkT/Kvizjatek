import { TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useState } from 'react';
import Ipcim from '../Ipcim';

export default function RegisztracioScreen({navigation}) {
    const [felhasznalo, setFelhasznalo] = useState('')
    const [email, setEmail] = useState('')
    const [jelszo, setJelszo] = useState('')
    const [jelszo2, setJelszo2] = useState('')
    const [megjegyzes, setMegjegyzes] = useState('')

    const regisztracio = async (felhasznalo,email,jelszo) => {
      let x = await fetch(`${Ipcim.Server}/regisztracio`, {
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
      if( x.status == 200 ){
        setFelhasznalo("")
        setEmail("")
        setJelszo("")
        setJelszo2("")
        Alert.alert('',y,[{text: 'OK', onPress: () => navigation.goBack()}])
      }
      else{
        Alert.alert('',y,[{text: 'OK'}])
      }
    }

    const signUp = async () =>{
      setMegjegyzes('')
      const nevFoglaltE = await felhasznalo_foglalt(felhasznalo);
      const emailFoglaltE = await email_foglalt(email);

      const emailRegex = /^[a-zA-Z0-9](?!.*([._%+-=])\1)[a-zA-Z0-9._%+-=]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9](?!.*--)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;

      if (felhasznalo == "" || email == "" || jelszo == "" || jelszo2 == "") { setMegjegyzes("Minden adatot meg kell adni"); }
      // Felhasználó
      else if (felhasznalo.length < 2 || felhasznalo.length > 20) { setMegjegyzes("Felhasználónév 2-20 karakter hosszú legyen"); }
      else if (nevFoglaltE) { setMegjegyzes("Felhasználónév foglalt"); }
      // Email
      else if (!emailRegex.test(email) || email.length > 254) { setMegjegyzes("Nem megfelelő email formátum"); }
      else if (emailFoglaltE) { setMegjegyzes("Foglalt felhasználónév"); }
      // Jelszó
      else if (jelszo.length < 8 || jelszo.length > 64) { setMegjegyzes("Jelszó 8-64 karakter hosszú legyen"); }
      else if (jelszo != jelszo2) { setMegjegyzes("Jelszavak nem egyeznek meg"); }
      else {
        regisztracio(felhasznalo,email,jelszo);
      }
    }

    const felhasznalo_foglalt = async (teszt_nev) => {
      let x = await fetch(`${Ipcim.Server}/regisztracio_felhasznalo`, {
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
      let x = await fetch(`${Ipcim.Server}/regisztracio_email`, {
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
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Felhasználónév</Text>
            <TextInput autoCapitalize='none' style={styles.bemenet} onChangeText={setFelhasznalo} value={felhasznalo}/>
          </View>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Email</Text>
            <TextInput autoCapitalize='none' style={styles.bemenet} onChangeText={setEmail} value={email}/>
          </View>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Jelszó</Text>
            <TextInput autoCapitalize='none' secureTextEntry={true} style={styles.bemenet} onChangeText={setJelszo} value={jelszo}/>
          </View>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Jelszó megerősítés</Text>
            <TextInput autoCapitalize='none' secureTextEntry={true} style={styles.bemenet} onChangeText={setJelszo2} value={jelszo2}/>
          </View>
          <TouchableOpacity style={styles.gomb} onPress={() => signUp()}>
            <Text style={styles.gomb_szoveg}>Regisztráció</Text>
          </TouchableOpacity>
          <Text style={styles.megjegyzes_szoveg}>{megjegyzes}</Text>
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
  adat: {
    width: '60%',
    alignItems: 'center',
    paddingBottom: '3%',
  },
  szoveg:{
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: '2%',
  },
  bemenet: {
    backgroundColor: 'lightgray',
    height: 40,
    fontSize: 14,
    width: '100%',
  },
  gomb: {
    width: '60%',
    height: 70,
    borderRadius: 5,
    marginTop: 15,
    backgroundColor: '#3399ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gomb_szoveg: {
    color: 'white',
    fontSize: 22,
    fontWeight: 500,
  },
  megjegyzes_szoveg: {
    marginTop: '2%',
    fontSize: 16,
    fontWeight: 500,
  }
});

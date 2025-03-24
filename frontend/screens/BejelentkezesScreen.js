import { Alert, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import Ipcim from '../Ipcim';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BejelentkezesScreen({navigation}) {
    const [felhasznalo, setFelhasznalo] = useState("")
    const [jelszo, setJelszo] = useState("")
    const [megjegyzes, setMegjegyzes] = useState("")

    const storeData = async (email, nev) => {
      await AsyncStorage.setItem('@felhasznalo_email', email);
      await AsyncStorage.setItem('@felhasznalo_nev', nev);
  };

    const bejelentkezes = async (felhasznalo,jelszo) => {
      let x = await fetch(`${Ipcim.Server}/bejelentkezes`, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "felhasznalo_email" : felhasznalo,
          "felhasznalo_nev" : felhasznalo,
          "felhasznalo_jelszo" : jelszo,
        })
      });
      if (x.status == 200) {
        let y = await x.json()
        storeData(y[0].felhasznalo_email, y[0].felhasznalo_nev);
        Alert.alert('',"Sikeres bejelentkezés",[{text: 'OK', onPress: () => navigation.goBack()}]) }
      else {
        let y = await x.text()
        setMegjegyzes(y)
      }
    }

    const signIn = () =>{
        if(felhasznalo == "" || jelszo == "") { setMegjegyzes("Minden adatot meg kell adni")}
        else{
          bejelentkezes(felhasznalo,jelszo);
        }
    }

    return (
        <View style={styles.container}>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Felhasználónév vagy Email</Text>
            <TextInput autoCapitalize='none' style={styles.bemenet} onChangeText={setFelhasznalo} value={felhasznalo} onChange={() => setMegjegyzes("")}/>
          </View>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Jelszó</Text>
            <TextInput autoCapitalize='none' secureTextEntry={true} style={styles.bemenet} onChangeText={setJelszo} value={jelszo} onChange={() => setMegjegyzes("")}/>
          </View>

          <TouchableOpacity style={styles.gomb} onPress={() => signIn()}>
            <Text>Bejelentkezés</Text>
          </TouchableOpacity>
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
  adat: {
    width: '50%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  szoveg:{
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 5,
  },
  bemenet: {
    backgroundColor: 'lightgray',
    height: 40,
    width: '100%',
  },
  gomb: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

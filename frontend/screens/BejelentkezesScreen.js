import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import Ipcim from '../Ipcim';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BejelentkezesScreen({navigation}) {
    const [felhasznalo, setFelhasznalo] = useState("")
    const [jelszo, setJelszo] = useState("")
    const [megjegyzes, setMegjegyzes] = useState("")

    const storeData = async (value) => {
      await AsyncStorage.setItem('@felhasznalo_email', value);
  };

    const bejelentkezes = async (felhasznalo,jelszo) => {
      let x = await fetch(`${Ipcim.Ipcim1}/bejelentkezes`, {
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
      let y = await x.json()
      if(y.length == 0) { setMegjegyzes("Rossz felhasználónév vagy jelszó.") }
      else if(y.length == 1) { Alert.alert("Sikeres bejelentkezés"); storeData(y[0].felhasznalo_email); navigation.popToTop() }
      else { Alert.alert("Valami nagyon nem jó") }
    }

    const signIn = () =>{
        if(felhasznalo == "" || jelszo == "") { setMegjegyzes("Minden adatot meg kell adni")}
        else{
          bejelentkezes(felhasznalo,jelszo);
        }
    }

    return (
        <View style={styles.container}>
        <Text>Felhasználónév vagy Email</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setFelhasznalo} value={felhasznalo} onChange={() => setMegjegyzes("")}/>
        <Text>Jelszó</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: 150}} onChangeText={setJelszo} value={jelszo} onChange={() => setMegjegyzes("")}/>
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

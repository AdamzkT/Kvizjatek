import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import Ipcim from '../Ipcim';

export default function KapcsolatScreen({route}) {
  const [tema, setTema] = useState("")
  const [tipus, setTipus] = useState("javaslat")
  const [uzenet, setUzenet] = useState("")
  const [datum, setDatum] = useState("")
  const { email } = route.params

  useEffect(() => {
    setDatum(new Date().toISOString().slice(0, 19).replace('T', ' '))
  }, [])

  //Üzenet felvitele adatbázisba
  const kuldes = (email, tema, tipus, uzenet) => {
    setDatum(new Date().toISOString().slice(0, 19).replace('T', ' '))
    let adatok =
    {
        "visszajelzes_felhasznalo":email,
        "visszajelzes_datum":datum,
        "visszajelzes_tema":tema,
        "visszajelzes_tipus":tipus,
        "visszajelzes_uzenet":uzenet
    }
    const felvitel = async () =>{
      let x = await fetch(`${Ipcim.Server}/uzenet_kuldes`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.text()
      Alert.alert(y)
      if(x.status == 200){
        setTema("")
        setUzenet("")
      }
    }
    felvitel()
  }

  return (
    <View style={styles.container}>
      <View style={styles.adat}>
        <Text style={styles.szoveg}>Téma</Text>
        <TextInput style={[styles.bemenet, {height: 40}]} onChangeText={setTema} value={tema} maxLength={50}/>
      </View>

      <View style={styles.adat}>
        <Text style={styles.szoveg}>Típus</Text>
        <View style={styles.tipusok_keret}>
          <Picker selectedValue={tipus} onValueChange={(itemValue) => setTipus(itemValue)}>
            <Picker.Item label="Javaslat" value="javaslat"/>
            <Picker.Item label="Hibajelentés" value="hiba"/>
            <Picker.Item label="Felhasználó jelentése" value="report"/>
            <Picker.Item label="Egyéb" value="egyéb"/>
          </Picker>
        </View>
      </View>

      <View style={styles.adat}>
        <Text style={styles.szoveg}>Üzenet</Text>
        <TextInput style={[styles.bemenet, {height: 120}]} onChangeText={setUzenet} value={uzenet} multiline={true} maxLength={255}/>
      </View>

      <TouchableOpacity style={styles.gomb} onPress={() => kuldes(email, tema, tipus, uzenet)}>
        <Text style={styles.gomb_szoveg}>Küldés</Text>
      </TouchableOpacity>
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
    width: '80%',
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
    fontSize: 14,
    backgroundColor: 'lightgray',
    width: '100%',
  },
  tipusok_keret: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  gomb: {
    width: '50%',
    height: 60,
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
  }
});

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

const getData = async () => {
  const felhasznalo = await AsyncStorage.getItem('@felhasznalo_nev');
  const email = await AsyncStorage.getItem('@felhasznalo_email');
  return email != null && felhasznalo != null ? [felhasznalo, email] : ["",""];
};

export default function ProfilScreen({navigation}) {
  const [felhasznalo,setFelhasznalo] = useState("")
  const [email,setEmail] = useState("")

  useEffect(() => {
      getData().then(adat => {setFelhasznalo(adat[0]); setEmail(adat[1])})
  },[felhasznalo])

  useFocusEffect(
      useCallback(() => {
          getData().then(adat => {setFelhasznalo(adat[0]); setEmail(adat[1])})
          return () => {}
  },[]))

  const storeData = async (email, nev) => {
    await AsyncStorage.setItem('@felhasznalo_email', email);
    await AsyncStorage.setItem('@felhasznalo_nev', nev);
  };

  const kijelentkezes = async() => {
      await storeData("","")
      setFelhasznalo("")
  }

  return (
      <View style={styles.container}>
      {
        felhasznalo == ""
        ?
        <View style={[styles.container, {width: '100%', height: '100%'}]}>
          <TouchableOpacity style={styles.gomb} onPress={() => { navigation.navigate('Bejelentkezés')}}>
            <Text style={styles.gomb_szoveg}>Bejelentkezés</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gomb} onPress={() => { navigation.navigate('Regisztráció')}}>
            <Text style={styles.gomb_szoveg}>Regisztráció</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={{width: '100%', height: '100%'}}>
          <Text style={styles.felhasznalo}>{email}</Text>
          <View style={styles.container}>
            <TouchableOpacity style={styles.gomb} onPress={() => { navigation.navigate('Új Kvíz', {email:email})}}>
              <Text style={styles.gomb_szoveg}>Új Kvíz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gomb} onPress={() => { navigation.navigate('Kapcsolat', {email:email})}}>
              <Text style={styles.gomb_szoveg}>Kapcsolat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gomb, {backgroundColor: 'red'}]} onPress={() => kijelentkezes()}>
              <Text style={styles.gomb_szoveg}>Kijelentkezés</Text>
            </TouchableOpacity>
          </View>

        </View>
      }
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
  felhasznalo: {
    width: '100%',
    textAlign: 'right',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#3399ff',
  },
  gomb: {
    backgroundColor: '#3399ff',
    width: '60%',
    height: 80,
    borderRadius: 5,
    marginVertical: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gomb_szoveg: {
    color: 'white',
    fontSize: 24,
    fontWeight: 500,
  }
});

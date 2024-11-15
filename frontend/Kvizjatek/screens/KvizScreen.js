import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Ipcim1 } from '../Ipcim';
import { Ipcim2 } from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen() {
  const [adatok,setAdatok] = useState([]);
  const [kerdes,setKerdes] = useState("");
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");

  const lekerdez = async () => {
    let x = await fetch(`${Ipcim1}/kerdesek`)
    let y = await x.json()
    setAdatok(y)
    setKerdes(adatok[0].kerdes)
    setValaszok([adatok[0].valasz_jo, adatok[0].valasz_rossz1, adatok[0].valasz_rossz2, adatok[0].valasz_rossz3])
    setJoValasz(adatok[0].valasz_jo)
  }

  useEffect(() => {lekerdez()},[])

  const ujKerdes = () => {
    let ujIndex = Math.floor(Math.random() * adatok.length)
    setKerdes(adatok[ujIndex].kerdes)
    setValaszok([adatok[ujIndex].valasz_jo, adatok[ujIndex].valasz_rossz1, adatok[ujIndex].valasz_rossz2, adatok[ujIndex].valasz_rossz3])
    setJoValasz(adatok[ujIndex].valasz_jo)
  }

  const valaszEllenorzes = (valasz) => {
    if(valasz == joValasz) { Alert.alert('','Jó válasz') }
    else { Alert.alert('','Rossz válasz')}
    ujKerdes()
  }

  return (
    <View style={styles.container}>
      <Button title='Új kérdés' onPress={() => ujKerdes()}/>
      <Text>{kerdes}</Text>
      {valaszok.map((valasz, k) =><Button key={k} title={valasz} onPress={() => valaszEllenorzes(valasz)}/>)}
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

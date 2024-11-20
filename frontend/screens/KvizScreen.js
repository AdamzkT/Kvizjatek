import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Ipcim1 } from '../Ipcim';
import { Ipcim2 } from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen() {
  const [adatok,setAdatok] = useState([]);
  const [kerdes,setKerdes] = useState("");
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");

  const keveres = (tomb) => {
    let sorrend = []

    while(sorrend.length < tomb.length){
      let r = Math.floor(Math.random() * tomb.length)
      if(!sorrend.includes(r)) { sorrend.push(r) }
    }

    let valasz_1 = tomb[sorrend[0]]
    let valasz_2 = tomb[sorrend[1]]
    let valasz_3 = tomb[sorrend[2]]
    let valasz_4 = tomb[sorrend[3]]
    setValaszok([valasz_1, valasz_2, valasz_3, valasz_4])
  }

  const lekerdez = async () => {
    let x = await fetch(`${Ipcim1}/kerdesek`)
    let y = await x.json()
    setAdatok(y)
    setKerdes(y[0].kerdes)
    keveres([y[0].valasz_jo, y[0].valasz_rossz1, y[0].valasz_rossz2, y[0].valasz_rossz3])
    setJoValasz(y[0].valasz_jo)
  }

  useEffect(() => {
    lekerdez()
  },[])

  const ujKerdes = async () => {
    let ujIndex = Math.floor(Math.random() * adatok.length)
    setKerdes(adatok[ujIndex].kerdes)
    keveres([adatok[ujIndex].valasz_jo, adatok[ujIndex].valasz_rossz1, adatok[ujIndex].valasz_rossz2, adatok[ujIndex].valasz_rossz3])
    setJoValasz(adatok[ujIndex].valasz_jo)
  }

  const valaszEllenorzes = (valasz) => {
    if(valasz == joValasz) { Alert.alert('','Jó válasz') }
    else { Alert.alert('','Rossz válasz')}
    ujKerdes()
  }

  return (
    <View style={styles.container}>
      <Button title='Új kérdés' onPress={async () => ujKerdes()}/>
      <Text>{kerdes}</Text>
      {valaszok.map((valasz, k) => <Button key={k} title={valasz} onPress={() => valaszEllenorzes(valasz)}/>)}
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
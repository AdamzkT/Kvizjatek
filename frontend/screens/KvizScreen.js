import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Ipcim from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen({route}) {
  const {kvizId} = route.params;
  const [adatok,setAdatok] = useState([]);
  const [kerdes,setKerdes] = useState("");
  const [kerdesIndex, setKerdesIndex] = useState(0);
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");

  const valasz_keveres = (valaszok) => {
    let sorrend = []

    while(sorrend.length < valaszok.length){
      let r = Math.floor(Math.random() * valaszok.length)
      if(!sorrend.includes(r)) { sorrend.push(r) }
    }

    let uj_valaszok = []
    for (const sorszam of sorrend) {
      uj_valaszok.push(valaszok[sorszam])
    }

    setValaszok(uj_valaszok)
  }

  const lekerdez = async () => {
    let x = await fetch(`${Ipcim.Ipcim1}/kviz_kerdesek`, {
      method: "POST",
      body: JSON.stringify({"kviz_id": kvizId}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    let y = await x.json()
    setAdatok(y)
    setKerdes(y[kerdesIndex].kerdes)
    valasz_keveres([y[kerdesIndex].valasz_jo, y[kerdesIndex].valasz_rossz1, y[kerdesIndex].valasz_rossz2, y[kerdesIndex].valasz_rossz3])
    setJoValasz(y[kerdesIndex].valasz_jo)
  }

  useEffect(() => {
    lekerdez()
  },[])

  const ujKerdes = async () => {
    let ujIndex = kerdesIndex;
    while(ujIndex == kerdesIndex){
      ujIndex = Math.floor(Math.random() * adatok.length)
      if (adatok.length < 2) { break; }
    }
    setKerdes(adatok[ujIndex].kerdes)
    valasz_keveres([adatok[ujIndex].valasz_jo, adatok[ujIndex].valasz_rossz1, adatok[ujIndex].valasz_rossz2, adatok[ujIndex].valasz_rossz3])
    setJoValasz(adatok[ujIndex].valasz_jo)
    setKerdesIndex(ujIndex)
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
      <View style={styles.valaszok}>
        {valaszok.map((valasz, k) => <Button key={k} title={valasz} onPress={() => valaszEllenorzes(valasz)}/>)}
      </View>
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
  valaszok: {
    width: "100%",
    borderWidth: 1,
  }
});

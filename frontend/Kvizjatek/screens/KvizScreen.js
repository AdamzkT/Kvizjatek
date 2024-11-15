import { Button, StyleSheet, Text, View } from 'react-native';
import { Ipcim1 } from '../Ipcim';
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
    setJoValasz(adatok[0].valasz_jo)
  }

  useEffect(() => {lekerdez()},[])

  return (
    <View style={styles.container}>
      <Button title='Új kérdés'/>
      <Text>{kerdes}</Text>
      <Text>{joValasz}</Text>
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

import { Button, StyleSheet, Text, View } from 'react-native';
import { Ipcim1 } from '../Ipcim';
import { useEffect, useState } from 'react';

export default function App() {
  const [adatok,setAdatok] = useState([]);

  const lekerdez = async () => {
    let x = await fetch(`http://${Ipcim1}/kerdesek`)
    let y = await x.json()
    setAdatok(y)
    console.log(adatok)
  }

  useEffect(() => {lekerdez()},[])

  return (
    <View style={styles.container}>
      <Button>AAA</Button>
      <Text>{adatok[0].kerdes}</Text>
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

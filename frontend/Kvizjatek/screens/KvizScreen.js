import { Button, StyleSheet, Text, View } from 'react-native';
import { Ipcim1 } from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen() {
  const [adatok,setAdatok] = useState([]);

  const lekerdez = async () => {
    console.log('1')
    let x = await fetch(`http://${Ipcim1}/kerdesek`)
    console.log('2')
    let y = await x.json()
    console.log('3')
    setAdatok(y)
    console.log(adatok)
  }

  useEffect(() => {lekerdez()},[])

  return (
    <View style={styles.container}>
      <Button title='AAA'/>
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

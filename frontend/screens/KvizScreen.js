import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Ipcim from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen({navigation, route}) {
  const {kvizId} = route.params;
  const [kerdesek,setKerdesek] = useState([]);
  const [kerdesekDb, setKerdesekDb] = useState(0);
  const [kerdesSzam, setKerdesSzam] = useState(1);
  const [kerdes,setKerdes] = useState("");
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");
  const [pontok, setPontok] = useState(0);

  const keveres = (adatok) => {
    let sorrend = []

    while(sorrend.length < adatok.length){
      let r = Math.floor(Math.random() * adatok.length)
      if(!sorrend.includes(r)) { sorrend.push(r) }
    }

    let uj_adatok = []
    for (const sorszam of sorrend) {
      uj_adatok.push(adatok[sorszam])
    }

    return uj_adatok
  }

  const lekerdez = async () => {
    let x = await fetch(`${Ipcim.Ipcim1}/kviz_kerdesek`, {
      method: "POST",
      body: JSON.stringify({"kviz_id": kvizId}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    let y = await x.json()
    let kevert_kerdesek = keveres(y)
    setKerdesek(kevert_kerdesek)
    setKerdesekDb(y.length)
    kerdesBetolt(kevert_kerdesek[0])
  }

  useEffect(() => {
    lekerdez()
  },[])

  const kerdesBetolt = async (kerdes) => {
    setKerdes(kerdes.kerdes)
    let valaszok = await keveres([kerdes.valasz_jo, kerdes.valasz_rossz1, kerdes.valasz_rossz2, kerdes.valasz_rossz3])
    setValaszok(valaszok)
    setJoValasz(kerdes.valasz_jo)
  }

  const valaszEllenorzes = async (valasz) => {
    if(valasz == joValasz) {
      setPontok(pontok+1)
      Alert.alert('','Jó válasz', [{text: 'OK', onPress: () => koviKerdes(pontok+1)}])
    }
    else { Alert.alert('','Rossz válasz', [{text: 'OK', onPress: () => koviKerdes(pontok)}])}
  }

  const koviKerdes = (eredmeny) =>{
    if(kerdesSzam < kerdesekDb) {
      let kovi_index = kerdesSzam
      setKerdesSzam(kerdesSzam+1)
      kerdesBetolt(kerdesek[kovi_index])
    }
    else { Alert.alert('Kvíz vége', `Eredmény: ${eredmeny}/${kerdesekDb}`, [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ])}
  }

  return (
    <View style={styles.container}>
      <Text>{kerdesSzam}/{kerdesekDb} Kérdés</Text>
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

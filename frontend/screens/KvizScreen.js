import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [gombSzinek, setGombSzinek] = useState(["lightblue","lightblue","lightblue","lightblue"])

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

  const valaszEllenorzes = async (valasz, gombId) => {
    if (valasz == joValasz) {
      let ujGombSzinek = [...gombSzinek];
      ujGombSzinek[gombId] = "lightgreen";
      setGombSzinek(ujGombSzinek);
      setPontok(pontok + 1);
      setTimeout(() => {
        Alert.alert('','Jó válasz', [{text: 'OK', onPress: () => koviKerdes(pontok + 1)}]);
      }, 1000);
    }
    else {
      let joIndex = valaszok.indexOf(joValasz);
      let ujGombSzinek = [...gombSzinek];
      ujGombSzinek[gombId] = "pink";
      ujGombSzinek[joIndex] = "lightgreen";
      setGombSzinek(ujGombSzinek);
      setTimeout(() => {
        Alert.alert('','Rossz válasz', [{text: 'OK', onPress: () => koviKerdes(pontok)}]);
      }, 1000);
    }
  }

  const koviKerdes = (eredmeny) =>{
    if(kerdesSzam < kerdesekDb) {
      let kovi_index = kerdesSzam
      setKerdesSzam(kerdesSzam+1)
      kerdesBetolt(kerdesek[kovi_index])
      setGombSzinek(["lightblue","lightblue","lightblue","lightblue"])
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
        {valaszok.map((valasz, k) =>
        <Pressable style={[styles.gomb, {backgroundColor: `${gombSzinek[k]}`}]} key={k} onPress={() => valaszEllenorzes(valasz, k)}>
          <Text>{valasz}</Text>
        </Pressable>
        )}
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
    borderColor: "lightgray",
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gomb: {
    borderRadius: 10,
    width: "46%",
    margin: "2%",
    alignItems: "center",
    paddingVertical: 25,
  }
});

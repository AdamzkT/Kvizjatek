import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import Ipcim from '../Ipcim';
import { useEffect, useState } from 'react';

export default function KvizScreen({navigation, route}) {
  const {kvizId} = route.params;
  const [kerdesek,setKerdesek] = useState([""]);
  const [kerdesSzam, setKerdesSzam] = useState(1);
  const [kerdes,setKerdes] = useState("");
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");
  const [pontok, setPontok] = useState(0);
  const [gombSzinek, setGombSzinek] = useState(["lightblue","lightblue","lightblue","lightblue"]);
  const [gombKapcsolo, setGombKapcsolo] = useState(false);
  const [koviKerdesKapcsolo, setKoviKerdesKapcsolo] = useState(true);
  const [maxMasodperc] = useState(15)
  const [masodperc, setMasodperc] = useState(0);
  const [idozito, setIdozito] = useState(false);

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
    setMasodperc(maxMasodperc)
    setIdozito(true);
  }

  useEffect(() => {
    if(idozito == true){
      if(masodperc > 0){
        const timer = setInterval(() => {
          let koviMasodperc = masodperc-(maxMasodperc/50)
          if(koviMasodperc > 0) { setMasodperc(koviMasodperc) }
          else { setMasodperc(0) }
        }, maxMasodperc/50*1000);
    
        return () => clearInterval(timer)
      }
      else {
        setMasodperc(0)
        valaszEllenorzes("0"+joValasz,-1)
      }
    }
  },[masodperc, idozito])

  const valaszEllenorzes = async (valasz, gombId) => {
    setGombKapcsolo(true);
    setIdozito(false);
    if (valasz == joValasz) {
      let ujGombSzinek = [...gombSzinek];
      ujGombSzinek[gombId] = "lightgreen";
      setGombSzinek(ujGombSzinek);
      setPontok(pontok + 1);
      setTimeout(() => {
        setKoviKerdesKapcsolo(false)
      }, 800);
    }
    else {
      let joIndex = valaszok.indexOf(joValasz);
      let ujGombSzinek = [...gombSzinek];
      if(gombId != -1) { ujGombSzinek[gombId] = "pink"; }
      else{
        for (let i = 0; i < 4; i++) {
          ujGombSzinek[i] = "pink";
        }
      }
      ujGombSzinek[joIndex] = "lightgreen";
      setGombSzinek(ujGombSzinek);
      setTimeout(() => {
        setKoviKerdesKapcsolo(false)
      }, 800);
    }
  }

  const koviKerdes = (eredmeny) =>{
    if(kerdesSzam < kerdesek.length) {
      let kovi_index = kerdesSzam
      setKerdesSzam(kerdesSzam+1)
      kerdesBetolt(kerdesek[kovi_index])
      setGombSzinek(["lightblue","lightblue","lightblue","lightblue"])
      setGombKapcsolo(false)
      setKoviKerdesKapcsolo(true)
    }
    else { Alert.alert('Kvíz vége', `Eredmény: ${eredmeny}/${kerdesek.length}`, [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ])}
  }

  return (
    <View style={styles.container}>
      <Text>{kerdesSzam}/{kerdesek.length} Kérdés</Text>
      <Text>{kerdes}</Text>
      <View style={{borderColor: "black", borderWidth: 1, borderStyle: "solid", width: "90%"}}>
        <View style={{backgroundColor: "gray", width: 100*masodperc/maxMasodperc + "%", height: 30}}/>
      </View>
      <View style={styles.valaszok}>
        {valaszok.map((valasz, k) =>
        <Pressable disabled={gombKapcsolo} style={[styles.gomb, {backgroundColor: `${gombSzinek[k]}`}]} key={k} onPress={() => valaszEllenorzes(valasz, k)}>
          <Text>{valasz}</Text>
        </Pressable>
        )}
      </View>
      <Button disabled={koviKerdesKapcsolo} title='->' onPress={() => koviKerdes(pontok)}/>
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

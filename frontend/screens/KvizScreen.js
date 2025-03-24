import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ipcim from '../Ipcim';
import { useEffect, useState } from 'react';
import { AntDesign } from 'react-native-vector-icons';

export default function KvizScreen({navigation, route}) {
  const {kvizId, kvizNev} = route.params;
  const [kerdesek,setKerdesek] = useState([""]);
  const [kerdesSzam, setKerdesSzam] = useState(1);
  const [kerdes,setKerdes] = useState("");
  const [valaszok,setValaszok] = useState([]);
  const [joValasz,setJoValasz] = useState("");
  const [pontok, setPontok] = useState(0);
  const [gombSzinek, setGombSzinek] = useState(["lightblue","lightblue","lightblue","lightblue"]);
  const [gombKapcsolo, setGombKapcsolo] = useState(false);
  const [koviKerdesKapcsolo, setKoviKerdesKapcsolo] = useState(true);
  const [maxMasodperc] = useState(20)
  const [masodperc, setMasodperc] = useState(0);
  const [idozito, setIdozito] = useState(false);
  const [modalLathato, setModalLathato] = useState(false);

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
    let x = await fetch(`${Ipcim.Server}/kviz_kerdesek`, {
      method: "POST",
      body: JSON.stringify({"kerdes_kviz": kvizId}),
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
    else { setModalLathato(true) }
  }

  const kvizVege = () => {
    fetch(`${Ipcim.Server}/kviz_kitoltes`, {
      method: "PUT",
      body: JSON.stringify({"kviz_id": kvizId}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    setModalLathato(false)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.kviz_cim}>{kvizNev}</Text>
      <Text style={styles.kerdes_szamlalo}>{kerdesSzam}/{kerdesek.length}</Text>
      <View style={styles.kerdes_keret}>
        <Text style={styles.kerdes}>{kerdes}</Text>
      </View>
      <View style={styles.idozito_keret}>
        <View style={[styles.idozito, {width: 100*masodperc/maxMasodperc + "%"}]}/>
      </View>
      <View style={styles.valaszok}>
        {valaszok.map((valasz, k) =>
        <Pressable disabled={gombKapcsolo} style={[styles.gomb, {backgroundColor: `${gombSzinek[k]}`}]} key={k} onPress={() => valaszEllenorzes(valasz, k)}>
          <Text>{valasz}</Text>
        </Pressable>
        )}
      </View>
      <TouchableOpacity disabled={koviKerdesKapcsolo} onPress={() => koviKerdes(pontok)}>
        <AntDesign name="rightcircle" size={55} color={koviKerdesKapcsolo ? '#f0f0f0' : '#3399ff'}/>
      </TouchableOpacity>

      <View>
        <Modal
          transparent={true}
          visible={modalLathato}
          onRequestClose={() => {
            setModalLathato(false);
            navigation.goBack();
          }}>
          <View style={styles.modal_hatter}>
            <View style={styles.modal}>
              <Text style={[{fontSize: 32, marginBottom: 20, fontWeight: '600'}]}>Kvíz vége</Text>
              <Text style={[{fontSize: 20, marginBottom: 25}]}>Eredmény</Text>
              <Text style={[{fontSize: 20, marginBottom: 25}]}>{pontok}/{kerdesSzam}</Text>
              <TouchableOpacity onPress={() => { kvizVege() }}>
                <AntDesign name="rightcircle" size={50} color='#3399ff'/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  kviz_cim: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
  },
  kerdes_keret: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 10
  },
  kerdes_szamlalo: {
    width: '100%',
    textAlign: 'right',
    paddingHorizontal: '5%',
  },
  kerdes: {
    width: '90%',
    textAlign: 'center',
  },
  idozito_keret: {
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    width: "90%",
    marginBottom: 10,
  },
  idozito: {
    backgroundColor: "gray",
    height: 30
  },
  valaszok: {
    width: "100%",
    borderWidth: 1,
    borderColor: "lightgray",
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  gomb: {
    borderRadius: 10,
    height: 150,
    width: "46%",
    margin: "2%",
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: 25,
  },
  modal_hatter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 60,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

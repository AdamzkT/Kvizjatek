import { useEffect, useState } from 'react';
import Ipcim from '../Ipcim';
import { StyleSheet, View, Text, TextInput, FlatList, Modal, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { FontAwesome } from 'react-native-vector-icons';

export default function UjKvizScreen({route}) {
    const {email} = route.params;
    const [kategoriak, setKategoriak] = useState([])
    const [selectedKategoria, setSelectedKategoria] = useState({"kategoria_id": 0, "kategoria_nev": ""})
    const [ujCim, setUjCim] = useState("")
    const [ujLeiras, setUjLeiras] = useState("")
    const [kerdesek, setKerdesek] = useState([])
    const [modalLathato, setModalLathato] = useState(false);
    const [ujKerdes, setUjKerdes] = useState("")
    const [joValasz, setJoValasz] = useState("")
    const [rosszValasz1, setRosszValasz1] = useState("")
    const [rosszValasz2, setRosszValasz2] = useState("")
    const [rosszValasz3, setRosszValasz3] = useState("")

    const lekerdez_kategoriak = async () => {
      let x = await fetch(`${Ipcim.Server}/kategoriak`)
      let y = await x.json()
      setKategoriak(y)
      setSelectedKategoria(y[0])
    }

    useEffect(() => {
      lekerdez_kategoriak()
    },[])

    const hozzaad = () => {
      if(ujKerdes == "" || joValasz == "" || rosszValasz1 == "" ||  rosszValasz2 == "" ||  rosszValasz3 == "" ){
        Alert.alert("Minden adatot meg kell adni!")
      }
      else{
        const lista = kerdesek
        let jo_kerdes = true
        for (const i of lista) {
          if (ujKerdes == i.kerdes) { jo_kerdes = false; break}
        }
        if(jo_kerdes){
          const uj = {
            kerdes: ujKerdes,
            jo_valasz: joValasz,
            rossz_valasz_1: rosszValasz1,
            rossz_valasz_2: rosszValasz2,
            rossz_valasz_3: rosszValasz3
          }
          lista.push(uj)
          setKerdesek(lista)
          setUjKerdes("")
          setJoValasz("")
          setRosszValasz1("")
          setRosszValasz2("")
          setRosszValasz3("")
          setModalLathato(!modalLathato)
        }
        else{ Alert.alert("Már van ilyen kérdés!")}
      }
    }

    const torol = (elem) => {
      const updatedKerdesek = kerdesek.filter(item => item !== elem);
      setKerdesek(updatedKerdesek);
    }

    const letrehoz = async () => {
      console.log(selectedKategoria)
      if(ujCim == "") {Alert.alert("A kvíznek nincs címe.")}
      else if (kerdesek.length < 5) { Alert.alert("Legalább 5 kérdés kell egy kvíz létrehozásához.")}
      else{
        const kvizNemFoglalt = await ellenorzes_kviz_nem_foglalt(email, ujCim)
        if (kvizNemFoglalt) {
          const sikeresKvizLetrehozas = await kviz_felvitel(email, ujCim, selectedKategoria, ujLeiras)
          if (sikeresKvizLetrehozas){
            const kvizId = await leker_kviz_id(email, ujCim, selectedKategoria, ujLeiras)
            if(kvizId != 0){
              for (const kerdes of kerdesek) {
                kerdes_felvitel(kvizId, kerdes.kerdes, kerdes.jo_valasz, kerdes.rossz_valasz_1, kerdes.rossz_valasz_2, kerdes.rossz_valasz_3)
              }
              admin_ertekeles(kvizId)
              Alert.alert("Kvíz sikeresen létrehozva.")
              setUjCim("")
              setUjLeiras("")
              setKerdesek([])
            }
          }
        }
      }
    }

    const ellenorzes_kviz_nem_foglalt = async (email, kviz_nev) => {
      let adatok =
      {
        "felhasznalo_email": email,
        "kviz_nev": kviz_nev,
        "kategoria_nev": "%%",
        "kviz_leiras": "%%"
      }
      let x = await fetch(`${Ipcim.Server}/kvizek_szures`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      if(x.status == 200){
        let y = await x.json()
        if (y.length == 0) { return true }
        else {
          Alert.alert("Már létezik ilyen című kvíze a felhasználónak")
          return false
        }
      }
      else {
        let y = await x.text()
        Alert.alert(y)
      }
    }

    const kviz_felvitel = async (email, kviz_nev, kategoria, leiras) => {
      let adatok =
      {
        "felhasznalo_email": email,
        "kviz_nev": kviz_nev,
        "kviz_kategoria": kategoria.kategoria_id,
        "kviz_leiras": leiras
      }
      let x = await fetch(`${Ipcim.Server}/kviz_felvitel`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.text()
      if(x.status == 200) {return true}
      else {
        Alert.alert(y)
        return false
      }
    }

    const leker_kviz_id = async (email, kviz_nev, kategoria, leiras) => {
      let adatok =
      {
        "felhasznalo_email": email,
        "kviz_nev": kviz_nev,
        "kategoria_nev": kategoria.kategoria_nev,
        "kviz_leiras": leiras
      }
      let x = await fetch(`${Ipcim.Server}/kvizek_szures`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.json()
      if (y.length == 1) { return y[0].kviz_id }
      else {
        Alert.alert("Nem sikerült lekérni a kvíz id-t")
        return 0
      }
    }

    const kerdes_felvitel = (id, kerdes, jo, rossz1, rossz2, rossz3) => {
      let adatok =
      {
        "kerdes_kviz": id,
        "kerdes": kerdes,
        "valasz_jo": jo,
        "valasz_rossz1": rossz1,
        "valasz_rossz2": rossz2,
        "valasz_rossz3": rossz3,
      }
      fetch(`${Ipcim.Server}/kerdes_felvitel`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
    }

    const admin_ertekeles = (id) => {
      let adatok =
      {
        "ertekeles_felhasznalo": "Admin",
        "ertekeles_kviz": id,
        "ertekeles_pont": 0
      }
      fetch(`${Ipcim.Server}/ertekeles_felvitel`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
    }

    return (
        <View style={styles.container}>
          <View style={styles.adat}>
            <Text style={styles.szoveg}>Cím</Text>
            <TextInput style={[styles.bemenet, {height: 40}]} onChangeText={setUjCim} value={ujCim} maxLength={50}/>
          </View>

          <View style={styles.adat}>
            <Text style={styles.szoveg}>Leírás</Text>
            <TextInput style={[styles.bemenet, {height: 120}]} onChangeText={setUjLeiras} value={ujLeiras} multiline={true} maxLength={255}/>
          </View>

          <View style={styles.adat}>
            <Text style={styles.szoveg}>Kategória</Text>
            <View style={styles.kategoriak_keret}>
              <Picker
                style={{width: '100%'}}
                selectedValue={selectedKategoria}
                onValueChange={(itemValue) =>
                  {setSelectedKategoria(itemValue)}
                }>
                {kategoriak.map((item) => <Picker.Item value={item} label={item.kategoria_nev} key={item.kategoria_id}/>)}
              </Picker>
            </View>
          </View>

          <View style={styles.kerdesek_fejlec}>
            <Text style={{fontWeight: 500, fontSize: 18, flex: 7}}>Kérdések</Text>
            <TouchableOpacity style={{alignItems: 'flex-end', flex: 1}} onPress={() => setModalLathato(true)}>
              <FontAwesome name="plus-square" size={40} color='#3399ff'/>
            </TouchableOpacity>
          </View>

          <View style={styles.kerdesek_lista}>
            <FlatList
              data={kerdesek}
              renderItem={({item}) =>
                <View style={styles.kerdesek_elem}>
                  <Text style={{flex: 7}} numberOfLines={1}>{item.kerdes}</Text>
                  <TouchableOpacity style={{alignItems: 'flex-end', flex: 1}} onPress={() => torol(item)}>
                    <FontAwesome name="minus-square" size={40} color='#ff8888'/>
                  </TouchableOpacity>
                </View>
            }
              keyExtractor={item => item.kerdes}
            />
          </View>

          <View>
            <Modal
              transparent={true}
              visible={modalLathato}
              onRequestClose={() => {
                setModalLathato(!modalLathato);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.adat}>
                    <Text style={styles.szoveg}>Kérdés</Text>
                    <TextInput style={[styles.bemenet, {height: 80, width: 300}]} onChangeText={setUjKerdes} value={ujKerdes} multiline={true} maxLength={255}/>
                  </View>
                  <View style={styles.adat}>
                    <Text style={styles.szoveg}>Jó válasz</Text>
                    <TextInput style={[styles.bemenet, {backgroundColor: 'lightgreen', width: 300}]} onChangeText={setJoValasz} value={joValasz} maxLength={50}/>
                  </View>
                  <View style={styles.adat}>
                    <Text style={styles.szoveg}>Rossz válaszok</Text>
                    <TextInput style={[styles.bemenet, {backgroundColor: 'pink', width: 300, marginBottom: 5}]} onChangeText={setRosszValasz1} value={rosszValasz1} maxLength={50}/>
                    <TextInput style={[styles.bemenet, {backgroundColor: 'pink', width: 300, marginBottom: 5}]} onChangeText={setRosszValasz2} value={rosszValasz2} maxLength={50}/>
                    <TextInput style={[styles.bemenet, {backgroundColor: 'pink', width: 300, marginBottom: 5}]} onChangeText={setRosszValasz3} value={rosszValasz3} maxLength={50}/>
                  </View>
                  <TouchableOpacity style={[styles.gomb, {width: 150}]} onPress={() => hozzaad()}>
                    <Text style={styles.gomb_szoveg}>Hozzáad</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={{width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.gomb} onPress={() => letrehoz()}>
              <Text style={styles.gomb_szoveg}>Létrehoz</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  adat: {
    width: '90%',
    alignItems: 'center',
    paddingBottom: '3%',
  },
  szoveg:{
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: '2%',
  },
  bemenet: {
    fontSize: 14,
    backgroundColor: 'lightgray',
    width: '100%',
  },
  kategoriak_keret: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  kerdesek_fejlec:{
    height: 50,
    width: "90%",
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: 10,
    borderColor: 'lightgray',
  },
  kerdesek_lista:{
    height: 200,
    width: "90%",
    paddingTop: 5,
    borderWidth: 2,
    borderColor: 'lightgray',
    backgroundColor: 'lightgray'
  },
  kerdesek_elem:{
    flexDirection: "row",
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  gomb: {
    width: '50%',
    height: 60,
    borderRadius: 5,
    marginTop: 15,
    backgroundColor: '#3399ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gomb_szoveg: {
    color: 'white',
    fontSize: 22,
    fontWeight: 500,
  }
});

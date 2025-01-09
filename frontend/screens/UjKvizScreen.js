import { useEffect, useState } from 'react';
import Ipcim from '../Ipcim';
import { StyleSheet, View, Text, TextInput, FlatList, Modal, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'

export default function UjKvizScreen({route}) {
    const {email} = route.params;
    const [kategoriak, setKategoriak] = useState([])
    const [selectedKategoria, setSelectedKategoria] = useState({"kategoria_id": 1, "kategoria_nev": "teszt"})
    const [ujCim, setUjCim] = useState("")
    const [ujLeiras, setUjLeiras] = useState("")
    const [kerdesek, setKerdesek] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [ujKerdes, setUjKerdes] = useState("")
    const [joValasz, setJoValasz] = useState("")
    const [rosszValasz1, setRosszValasz1] = useState("")
    const [rosszValasz2, setRosszValasz2] = useState("")
    const [rosszValasz3, setRosszValasz3] = useState("")
  
    const lekerdez_kategoriak = async () => {
      let x = await fetch(`${Ipcim.Ipcim1}/kategoriak`)
      let y = await x.json()
      setKategoriak(y)
    }

    useEffect(() => {
      lekerdez_kategoriak()
    },[])

    const ellenorzes_kviz_nem_foglalt = async (email, kviz_nev) => {
      let adatok = 
      {
        "felhasznalo_email": email,
        "kviz_nev": kviz_nev,
        "kategoria_nev": "%%",
        "kviz_leiras": "%%"
      }
      let x = await fetch(`${Ipcim.Ipcim1}/kvizek_szures`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.json()
      console.log(y)
      if (y.length == 0) { return true }
      else {
        Alert.alert("Már létezik ilyen című kvíze a felhasználónak")
        return false
      }
    }

    const kviz_felvitel = async (email, kviz_nev, kategoria, leiras) => {
      let adatok = 
      {
        "felhasznalo_email": email,
        "kviz_nev": kviz_nev,
        "kategoria_id": kategoria.kategoria_id,
        "kviz_leiras": leiras
      }
      let x = await fetch(`${Ipcim.Ipcim1}/kviz_felvitel`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.text()
      if(y == "Sikeres kvíz felvitel!") {return true}
      else {
        Alert.alert("Hiba történt a kvíz létrehozása közben!")
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
      let x = await fetch(`${Ipcim.Ipcim1}/kvizek_szures`, {
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

    const kerdes_felvitel = async (id, kerdes, jo, rossz1, rossz2, rossz3) => {
      let adatok = 
      {
        "kviz_id": id,
        "kerdes": kerdes,
        "valasz_jo": jo,
        "valasz_rossz1": rossz1,
        "valasz_rossz2": rossz2,
        "valasz_rossz3": rossz3,
      }
      let x = await fetch(`${Ipcim.Ipcim1}/kerdes_felvitel`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.text()
      console.log(y)
    }

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
          setModalVisible(!modalVisible)
        }
        else{ Alert.alert("Már van ilyen kérdés!")}
      }
    }

    const letrehoz = async () => {
      if(ujCim == "") {Alert.alert("A kvíznek nincs címe.")}
      else if (kerdesek.length == 5) { Alert.alert("Legalább 5 kérdés kell egy kvíz létrehozásához.")}
      else{
        const kvizNemFoglalt = await ellenorzes_kviz_nem_foglalt(email, ujCim)
        if (kvizNemFoglalt) {
          const sikeresKvizLetrehozas = await kviz_felvitel(email, ujCim, selectedKategoria, ujLeiras)
          if (sikeresKvizLetrehozas){
            const kvizId = await leker_kviz_id(email, ujCim, selectedKategoria, ujLeiras)
            for (const kerdes of kerdesek) {
              kerdes_felvitel(kvizId, kerdes.kerdes, kerdes.jo_valasz, kerdes.rossz_valasz_1, kerdes.rossz_valasz_2, kerdes.rossz_valasz_3)
            }
            Alert.alert("Kvíz sikeresen létrehozva.")
            setUjCim("")
            setUjLeiras("")
            setKerdesek([])
          }
        }
      }
    }

    const torol = (elem) => {
      console.log(elem);
      const updatedKerdesek = kerdesek.filter(item => item !== elem);
      setKerdesek(updatedKerdesek);
      Alert.alert("Kérdés törölve");
    }

    return (
        <View style={styles.container}>
          <Text>Név</Text>
          <TextInput style={{backgroundColor: 'grey', height: 40, width: '90%'}} onChangeText={setUjCim} value={ujCim} maxLength={50}/>
          <Text>Leírás</Text>
          <TextInput style={{backgroundColor: 'grey', height: 120, width: '90%'}} onChangeText={setUjLeiras} value={ujLeiras} multiline={true} maxLength={255}/>
          <Picker
            style={{backgroundColor: 'white', width: '100%'}}
            selectedValue={selectedKategoria}
            onValueChange={(itemValue) =>
              {setSelectedKategoria(itemValue)}
            }>
            {kategoriak.map((item) => <Picker.Item value={item} label={item.kategoria_nev} key={item.kategoria_id}/>)}
          </Picker>
          <View style={{height: 40, width: "90%", backgroundColor: 'black', flexDirection: "row"}}>
            <Text style={{color: "white", flex: 1}}>Kérdések</Text>
            <Pressable style={{flex: 1}} onPress={() => setModalVisible(true)}><Text style={{backgroundColor: "white"}}>Új Kérdés</Text></Pressable>
          </View>
          <View style={{height: 200, width: "90%"}}>
            <FlatList style={{borderWidth: 2}}
              data={kerdesek}
              renderItem={({item}) =>
                <View
                  style={{flexDirection: "row", height: 40}}
                >
                  <Text style={{flex: 4}} numberOfLines={1}>{item.kerdes}</Text>
                  <Pressable style={{flex: 1}} onPress={() => torol(item)}>
                    <Text style={{borderWidth: 1, width: 30, height: 30, textAlignVertical: "center", textAlign: "center"}}>-</Text>
                  </Pressable>
                </View>
            }
              keyExtractor={item => item.kerdes}
            />
          </View>
          <View>
            <Modal
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text>Kérdés</Text>
                  <TextInput style={{backgroundColor: 'grey', height: 80, width: 300}} onChangeText={setUjKerdes} value={ujKerdes} multiline={true} maxLength={255}/>
                  <Text>Jó válasz</Text>
                  <TextInput style={{backgroundColor: 'lightgreen', height: 40, width: 300}} onChangeText={setJoValasz} value={joValasz} maxLength={50}/>
                  <Text>Rossz válaszok</Text>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz1} value={rosszValasz1} maxLength={50}/>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz2} value={rosszValasz2} maxLength={50}/>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz3} value={rosszValasz3} maxLength={50}/>
                  <Pressable
                    style = {{backgroundColor: "gold", height: 40}}
                    onPress={() => hozzaad()}>
                    <Text>Hozzáad</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text>Hide Modal</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
          <View>
            <Pressable
              style = {{backgroundColor: "lightgreen", height: 40}}
              onPress={() => letrehoz()}>
              <Text>Létrehoz</Text>
            </Pressable>
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
});

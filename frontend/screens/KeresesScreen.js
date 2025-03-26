import { View, StyleSheet, FlatList, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'
import { useState, useEffect, use } from "react";
import { AntDesign } from 'react-native-vector-icons';
import Ipcim from "../Ipcim";

const getData = async () => {
    const felhasznalo = await AsyncStorage.getItem('@felhasznalo_nev');
    const email = await AsyncStorage.getItem('@felhasznalo_email');
    return email != null && felhasznalo != null ? email : "";
  };

export default function App({navigation}) {
    const [email,setEmail] = useState("")
    const [felhasznaloErtekelesek, setFelhasznaloErtekelesek] = useState([])
    const [adatok,setAdatok] = useState([])
    const [megjelenit, setMegjelenit] = useState([])
    const [keresesBemenet, setKeresesBemenet] = useState([""])
    const [kategoriak, setKategoriak] = useState([])
    const [selectedKategoria, setSelectedKategoria] = useState({"kategoria_id": 0, "kategoria_nev": ""})
    const [modalLathato, setModalLathato] = useState(false);
    const [ujKomment, setUjKomment] = useState("")
    const [kommentek, setKommentek] = useState([])
    const [modalKommentekToggle, setModlaKommnetekToggle] = useState(false);
    const [kivalasztottKviz, setKivalasztottKviz] = useState({});
    const [gombLetiltva, setGombLetiltva] = useState(true);
    const [rendezesTipus, setRendezesTipus] = useState(['',''])

    const lekerdez = async () => {
        let x = await fetch(`${Ipcim.Server}/kvizek_bovitett`)
        let y = await x.json()
        setAdatok(y)
        setMegjelenit(y)
    }

    const lekerdez_kategoriak = async () => {
        let x = await fetch(`${Ipcim.Server}/kategoriak`)
        let y = await x.json()
        setKategoriak(y)
    }

    const lekerdez_ertekelesek = async () => {
        let adatok = { "ertekeles_felhasznalo": email}
        let x = await fetch(`${Ipcim.Server}/ertekeles_felhasznalo_alapjan`, {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        if(x.status != 200){
            let y = await x.text()
            console.log(y)
        }
        else {
            let y = await x.json()
            setFelhasznaloErtekelesek(y)
        }
    }

    const lekerdez_kommentek = async () => {
        let adatok = { "komment_kviz": kivalasztottKviz.kviz_id}
        let x = await fetch(`${Ipcim.Server}/kommentek_kviz_id_alapjan`, {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        if(x.status == 200){
            let y = await x.json()
            setKommentek(y)
        }
        else {
            let y = await x.text()
            console.log(y)
        }
    }

    useEffect(() => {
        getData().then(adat => {setEmail(adat)})
    },[])

    useEffect(() => {
        lekerdez()
        lekerdez_kategoriak()
        lekerdez_ertekelesek()
        if(email != "") {setGombLetiltva(false)}
    },[email])

    useEffect(() => {
        if (Object.keys(kivalasztottKviz).length > 0) {
            lekerdez_kommentek()
            setModalLathato(true)
        }
    }, [kivalasztottKviz]);
    useEffect(() => {
        if (Object.keys(kivalasztottKviz).length > 0 && modalLathato == false) {
            setKivalasztottKviz({})
            setModlaKommnetekToggle(false)
            setKommentek([])
        }
    }, [modalLathato]);

    const kereses = (keresettKategoria, rendezesSzempont, rendezesMod) => {
        let talalatok = adatok;

        if(keresettKategoria.kategoria_id != 0){
            let jo_kategoria = []
            for (const adat of talalatok) {
                if(adat.kviz_kategoria == keresettKategoria.kategoria_id) {jo_kategoria.push(adat)}
            }
            talalatok = jo_kategoria
        }
        if(keresesBemenet != "") {
            let keresett = []
            for (const adat of talalatok) {
                if(adat.kviz_nev.toLowerCase().includes(keresesBemenet.toLowerCase())) { keresett.push(adat); }
            }
            talalatok = keresett
        }

        if(rendezesSzempont == "") { setRendezesTipus(["",""]) }
        else {
            talalatok = talalatok.sort(function (a,b) {
                if (a.kviz_kitoltesek > b.kviz_kitoltesek) { return -1 }
                if (a.kviz_kitoltesek < b.kviz_kitoltesek) { return 1 }
                return 0
            })
        }

        setMegjelenit(talalatok)
    }

    const szam_formatum = (szam) =>{
        if(szam > 999999999) {return Math.floor(szam/1000000000) + " MM"}
        else if(szam > 999999) {return Math.floor(szam/1000000) + " M"}
        else if (szam > 999) {return Math.floor(szam/1000) + " E"}
        else {return szam}
    }
    const szam_szin = (szam) => {
        if (szam > 0) { return "green" }
        else if (szam == 0) { return "black" }
        else { return "red" }
    }

    const ertekeles_megjelenit = (ertekelesKviz, keresett, jo, rossz) => {
        for (const ertekeles of felhasznaloErtekelesek) {
            if(ertekeles.ertekeles_kviz == ertekelesKviz && ertekeles.ertekeles_pont == keresett) { return jo }
        }
        return rossz
    }

    const ertekeles = async (ertekelesKviz, pont) => {
        let x = 0
        for (const ertekeles of felhasznaloErtekelesek) {
            if(ertekeles.ertekeles_kviz == ertekelesKviz) {
                if(ertekeles.ertekeles_pont == pont) { x = await ertekeles_modositas(0, ertekeles.ertekeles_id) }
                else { x = await ertekeles_modositas(pont, ertekeles.ertekeles_id) }
            }
        }
        if (x == 0) { x = await ertekeles_felvitel(ertekelesKviz, pont) }
    }

    const ertekeles_felvitel = async (id, pont) => {
        let adatok = {
            "ertekeles_felhasznalo": email,
            "ertekeles_kviz": id,
            "ertekeles_pont": pont
        }
        let x = await fetch(`${Ipcim.Server}/ertekeles_felvitel`, {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        lekerdez_ertekelesek()
        return x.status()
    }

    const ertekeles_modositas = async (pont, id) => {
        let adatok = {
            "ertekeles_pont": pont,
            "ertekeles_id": id
        }
        let x = await fetch(`${Ipcim.Server}/ertekeles_modositas`, {
            method: "PUT",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        lekerdez_ertekelesek()
        return x.status()
    }

    const uj_komment = async () => {
        let adatok = {
            "komment_felhasznalo": email,
            "komment_kviz": kivalasztottKviz.kviz_id,
            "komment_szoveg": ujKomment
        }
        let x = await fetch(`${Ipcim.Server}/komment_felvitel`, {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        let y = x.text()
        if(x.status == 200) {
            setUjKomment("")
            lekerdez_kommentek()
        }
    }

    const rendezes = (uj_szempont) => {
        console.log(uj_szempont)
        console.log(rendezesTipus)
        let rendezes_szempont = rendezesTipus[0]
        let rendezes_tipus = rendezesTipus[1]
        if(rendezes_szempont == uj_szempont) {
            rendezes_szempont = uj_szempont
            if( rendezes_tipus = "") { rendezes_tipus = "novekvo"}
            if( rendezes_tipus = "novekvo") { rendezes_tipus = "csokkeno"}
            if( rendezes_tipus = "csokkeno") { rendezes_tipus = "", rendezes_szempont = ""}
            setRendezesTipus([rendezes_szempont, rendezes_tipus])
        }
        else {
            rendezes_tipus = "novekvo"
            setRendezesTipus([uj_szempont, rendezes_tipus])
        }
        console.log(rendezes_szempont + " " + rendezes_tipus)
        kereses(selectedKategoria, uj_szempont, rendezes_tipus)
    }

    const jatek = (kviz) =>{
        setKivalasztottKviz({})
        setModalLathato(false)
        navigation.navigate('Kvíz', {kvizId: kviz.kviz_id, kvizNev: kviz.kviz_nev})
    }

    return (
        <View style={styles.container}>
            <View style={{borderBottomWidth: 2, borderColor: 'white', width: '100%'}}>
                <View style={styles.kereses}>
                    <TextInput style={styles.keres_input} placeholder="Keresés..." value={keresesBemenet} onChangeText={setKeresesBemenet} />
                    <TouchableOpacity style={styles.keres_gomb} onPress={() => kereses(selectedKategoria, "", "")}>
                        <Text style={styles.keres_gomb_szoveg}>Keres</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.szures}>
                    <Picker
                        style={{width: '100%', backgroundColor: 'white'}}
                        selectedValue={selectedKategoria}
                        onValueChange={(itemValue) =>
                        {setSelectedKategoria(itemValue); kereses(itemValue, "", "")}
                        }>
                        <Picker.Item value={{"kategoria_id": 0, "kategoria_nev": ""}} label={'--- Kategóriák ---'} key={0}/>
                        {kategoriak.map((item) => <Picker.Item value={item} label={item.kategoria_nev} key={item.kategoria_id}/>)}
                    </Picker>
                </View>
            </View>

            <View style={{width: '100%', flex: 1}}>
                {megjelenit.length == 0 ?
                <Text style={styles.nincs_talalat}>0 találat</Text>
                :
                <View>
                    <View style={{flexDirection: 'row', backgroundColor: '#3399ff', borderBottomWidth: 2, borderColor: 'white', height: 50}}>
                        <TouchableOpacity onPress={() => rendezes("nev")}>
                            <Text style={{flex: 4, paddingHorizontal: 20, height: '100%'}}>Kvíz neve</Text>
                            {rendezesTipus[0] != "nev" ? "" :
                                <AntDesign style={{textAlign: 'right'}} name={rendezesTipus[1] == "novekvo" ? "arrowup" : "arrowdown"} size={20} color='white'/>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rendezes("nepszeruseg")}>
                            <AntDesign style={{flex: 1, borderLeftWidth: 1, borderColor: 'white', textAlign: 'center', height: '100%'}} name="eye" size={20} color='white'/>
                            {rendezesTipus[0] != "nepszeruseg" ? "" :
                                <AntDesign style={{textAlign: 'right'}} name={rendezesTipus[1] == "novekvo" ? "arrowup" : "arrowdown"} size={20} color='white'/>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rendezes("ertekeles")}>
                            <AntDesign style={{flex: 1, borderLeftWidth: 1, borderColor: 'white', textAlign: 'center', height: '100%'}} name="heart" size={20} color='white'/>
                            {rendezesTipus[0] != "ertekeles" ? "" :
                                <AntDesign style={{textAlign: 'right'}} name={rendezesTipus[1] == "novekvo" ? "arrowup" : "arrowdown"} size={20} color='white'/>
                            }
                        </TouchableOpacity>
                    </View>
                    <FlatList
                    data={megjelenit}
                    renderItem={({item}) =>
                        <View>
                            <TouchableOpacity style={styles.kviz} onPress={() => setKivalasztottKviz(item)}>
                                <View style={{flex: 4, paddingHorizontal: 20, justifyContent: 'center'}}>
                                    <Text style={styles.kviz_cim} numberOfLines={1} ellipsizeMode="tail">{item.kviz_nev}</Text>
                                    <Text style={styles.kviz_keszito} numberOfLines={1} ellipsizeMode="tail">Készítette - {item.felhasznalo_nev}</Text>
                                </View>
                                <Text style={styles.kviz_szam}>{szam_formatum(item.kviz_kitoltesek)}</Text>
                                <Text style={[styles.kviz_szam, {color: szam_szin(item.kviz_ertekeles)}]}>{szam_formatum(item.kviz_ertekeles)}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    keyExtractor={item => item.kviz_id}
                    />
                </View>
                
                }
            </View>

            <View>
                <Modal
                    transparent={true}
                    visible={modalLathato}
                    onRequestClose={() => { setModalLathato(false) }}>
                    <View style={styles.modal_hatter}>
                    {
                        modalKommentekToggle ?
                        <View style={styles.modal}>
                            <View style={[styles.uj_komment, {height: 80}]}>
                                <TextInput multiline={true} maxLength={255} style={[styles.keres_input, {borderWidth: 1, borderColor: 'gray'}]} placeholder="Írj kommentet..." value={ujKomment} onChangeText={setUjKomment}/>
                                <TouchableOpacity style={styles.keres_gomb} onPress={() => uj_komment()}>
                                    <Text style={styles.keres_gomb_szoveg}>Küld</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                style={{width: '100%', height: '50%', padding: 10, borderBottomWidth: 1, borderTopWidth: 1, marginBottom: 20}}
                                data={kommentek}
                                renderItem={({item}) =>
                                <View style={{borderWidth: 2, borderBottomWidth: 5, marginBottom: 5, borderColor: 'lightgray', padding: 5}}>
                                    <Text style={{marginBottom: 10, fontSize: 16}}>{item.komment_szoveg}</Text>
                                    <Text style={{textAlign: 'right', color: 'gray', fontStyle: 'italic'}}>- {item.felhasznalo_nev} -</Text>
                                </View>
                            } keyExtractor={item => item.komment_id}/>

                            <TouchableOpacity onPress={() => setModlaKommnetekToggle(false)}>
                                <AntDesign name="leftcircle" size={70} color='#3399ff'/>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.modal}>
                            <Text style={styles.reszletek_cim}>{kivalasztottKviz.kviz_nev}</Text>
                            <Text style={styles.reszletek_leiras}>{kivalasztottKviz.kviz_leiras == "" ? "- nincs leírás -" : kivalasztottKviz.kviz_leiras}</Text>
                            <View style={styles.reszletek_gombok}>
                                <TouchableOpacity disabled={gombLetiltva} style={styles.reszletek_gomb} onPress={() => ertekeles(kivalasztottKviz.kviz_id,1)}>
                                    <AntDesign name={ertekeles_megjelenit(kivalasztottKviz.kviz_id,1,'like1','like2')} size={55} color={gombLetiltva ? 'gray' : 'green'}/>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={gombLetiltva} style={styles.reszletek_gomb} onPress={() => ertekeles(kivalasztottKviz.kviz_id,-1)}>
                                    <AntDesign name={ertekeles_megjelenit(kivalasztottKviz.kviz_id,-1,'dislike1','dislike2')} size={55} color={gombLetiltva ? 'gray' : 'red'}/>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={gombLetiltva} style={styles.reszletek_gomb} onPress={() => setModlaKommnetekToggle(true)}>
                                    <AntDesign name="message1" size={55} color={gombLetiltva ? 'gray' : 'black'}/>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => jatek(kivalasztottKviz)}>
                                <AntDesign name="play" size={70} color='#3399ff'/>
                            </TouchableOpacity>
                        </View>
                    }
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
      },
    kereses: {
        flexDirection: 'row',
        height: 60,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    keres_input: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginRight: 5,
    },
    keres_gomb: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3399ff',
        borderRadius: 10,
    },
    keres_gomb_szoveg: {
        color: 'white',
        fontSize: 18,
        fontWeight: 500,
    },
    szures:{
        height: 60,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    nincs_talalat: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    kviz: {
        backgroundColor: 'white',
        height: 100,
        marginBottom: 20,
        flexDirection: 'row',
    },
    kviz_cim: {
        fontSize: 18,
        fontWeight: 500,
    },
    kviz_keszito: {
        fontSize: 12,
        color: 'gray',
    },
    kviz_szam: {
        borderLeftWidth: 1,
        borderColor: 'lightgray',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 500,
    },
    modal_hatter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 10,
        paddingVertical: 40,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    reszletek_cim: {
        width: '90%',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        textAlign: 'center',
        fontSize: 24,
        paddingBottom: 20,
        fontWeight: 600,
    },
    reszletek_leiras: {
        paddingHorizontal: '5%',
        fontSize: 14,
        paddingVertical: 25,
        textAlign: 'justify',
    },
    reszletek_gombok: {
        flexDirection: 'row',
        width: '90%',
        paddingVertical: 30,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'lightgray'
    },
    reszletek_gomb: {
        flex: 1,
        alignItems: 'center',
    },
    uj_komment: {
        flexDirection: 'row',
        height: 60,
        paddingHorizontal: 10,
        marginBottom: 10,
    }
});

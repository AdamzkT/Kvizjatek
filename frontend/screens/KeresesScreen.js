import { View, StyleSheet, FlatList, Text, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import Ipcim from "../Ipcim";

export default function App({navigation}) {
    const [adatok,setAdatok] = useState([])
    const [megjelenit, setMegjelenit] = useState([])
    const [keresesBemenet, setKeresesBemenet] = useState([""])

    const lekerdez = async () => {
        let x = await fetch(`${Ipcim.Server}/kvizek`)
        let y = await x.json()
        setAdatok(y)
        setMegjelenit(y)
    }

    useEffect(() => {
        lekerdez()
    },[])

    const kereses = () => {
        if(keresesBemenet == "") {
            setMegjelenit(adatok)
        }
        else{
            let keresett = []
            for (const adat of adatok) {
                if(adat.kviz_nev.toLowerCase().includes(keresesBemenet.toLowerCase())) { keresett.push(adat); }
            }
            setMegjelenit(keresett)
        }
    }

    return (
        <View>
            <View style={styles.kereses}>
                <TextInput style={styles.keres_input} placeholder="Keresés..." value={keresesBemenet} onChangeText={setKeresesBemenet} />
                <TouchableOpacity style={styles.keres_gomb} onPress={() => kereses()}>
                    <Text>Keres</Text>
                </TouchableOpacity>
            </View>
            
            <View>
                {megjelenit.length == 0 ?
                <Text style={styles.nincs_talalat}>0 találat</Text>
                :
                <FlatList
                data={megjelenit}
                renderItem={({item}) =>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate('Kvíz', {kvizId: item.kviz_id, kvizNev: item.kviz_nev})}>
                            <Text style={styles.kerdes}>{item.kviz_nev}</Text>
                        </TouchableOpacity>
                    </View>
                }
                keyExtractor={item => item.kviz_id}
                />}
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
  kerdes: {
    width: "100%",
    height: 50,
    marginTop: 10,
    backgroundColor: "white",
    textAlignVertical: "center",
    paddingLeft: 15,
    fontSize: 14,
  },
  kereses: {
    borderBottomWidth: 1,
    borderBlockColor: "lightgray",
    flexDirection: "row",
    height: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  keres_input: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginRight: 5,
  },
  keres_gomb: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
    borderRadius: 10,
  },
  nincs_talalat: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  }
});

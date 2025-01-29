import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Ipcim from "../Ipcim";

export default function App({navigation}) {
    const [adatok,setAdatok] = useState([]);

    const lekerdez = async () => {
        let x = await fetch(`${Ipcim.Ipcim1}/kvizek`)
        let y = await x.json()
        setAdatok(y)
    }

    useEffect(() => {
        lekerdez()
    },[])

    return (
        <View>
            <FlatList
                data={adatok}
                renderItem={({item}) =>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate('Kvíz', {kvizId: item.kviz_id})}>
                            <Text style={styles.kerdes}>{item.kviz_nev}</Text>
                        </TouchableOpacity>
                    </View>
                }
                keyExtractor={item => item.kviz_id}
            />
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
  }
});

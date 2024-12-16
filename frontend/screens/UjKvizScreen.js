import { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';


export default function UjKvizScreen() {
    const [ujCim, setUjCim] = useState("")
    const [ujLeiras, setUjLeiras] = useState("")

    return (
        <View style={styles.container}>
        <Text>Új kvíz</Text>
        <Text>Cím</Text>
        <TextInput style={{backgroundColor: 'grey', height: 40, width: '90%'}} onChangeText={setUjCim} value={ujCim}/>
        <Text>Leírás</Text>
        <TextInput style={{backgroundColor: 'grey', height: 200, width: '90%'}} onChangeText={setUjLeiras} value={ujLeiras}/>
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

import { StyleSheet, View, Pressable, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

const getData = async () => {
    const felhasznalo = await AsyncStorage.getItem('@felhasznalo_nev');
    const email = await AsyncStorage.getItem('@felhasznalo_email');
    return email != null && felhasznalo != null ? [felhasznalo, email] : ["",""];
};

export default function FooldalScreen({navigation}) {
    const [felhasznalo,setFelhasznalo] = useState("")
    const [email,setEmail] = useState("")
    const [nyomKviz, setNyomKviz] = useState(false)
    const [nyomUjKviz, setNyomUjKviz] = useState(false)
    const [nyomProfil, setNyomProfil] = useState(false)
    const [nyomKapcsolat, setNyomKapcsolat] = useState(false)

    useEffect(() => {
        getData().then(adat => setFelhasznalo(adat[0]))
        getData().then(adat => setEmail(adat[1]))
    },[])
    
    useFocusEffect(
        useCallback(() => {
            getData().then(adat => setFelhasznalo(adat[0]))
            getData().then(adat => setEmail(adat[1]))
            return () => {}
    },[]))

    return (
        <View style={styles.container}>
            <Pressable  style={[styles.gomb, nyomKviz ? {backgroundColor: '#fff00f'} : {backgroundColor: '#00f0f0'}]}
                        onPressIn={() => setNyomKviz(true)} onPressOut={() => {setNyomKviz(false), navigation.navigate('Kvíz')}}>
                <Text>Kvíz</Text>
            </Pressable>
            <Pressable  style={[styles.gomb, nyomUjKviz ? {backgroundColor: '#fff00f'} : {backgroundColor: '#00f0f0'}]}
                        onPressIn={() => setNyomUjKviz(true)}
                        onPressOut={() => {setNyomUjKviz(false), felhasznalo == "" ? navigation.navigate('Bejelentkezés') : navigation.navigate('ÚjKvíz')}}>
                <Text>Új Kvíz</Text>
            </Pressable>
            <Pressable  style={[styles.gomb, nyomProfil ? {backgroundColor: '#fff00f'} : {backgroundColor: '#00f0f0'}]}
                        onPressIn={() => setNyomProfil(true)}
                        onPressOut={() => {setNyomProfil(false), felhasznalo == "" ? navigation.navigate('Bejelentkezés') : navigation.navigate('Profil', {email:email})}}>
                <Text>Profil</Text>
            </Pressable>
            <Pressable  style={[styles.gomb, nyomKapcsolat ? {backgroundColor: '#fff00f'} : {backgroundColor: '#00f0f0'}]}
                        onPressIn={() => setNyomKapcsolat(true)}
                        onPressOut={() => {setNyomKapcsolat(false), felhasznalo == "" ? navigation.navigate('Bejelentkezés') : navigation.navigate('Kapcsolat', {email:email})}}>
                <Text>Kapcsolat</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 200
  },
  gomb: {
    width: '45%',
    borderWidth: 0.5,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 100,
    margin: '2.5%',
  }
});

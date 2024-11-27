import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import KvizScreen from './screens/KvizScreen'
import KapcsolatScreen from './screens/KapcsolatScreen';
import BejelentkezesScreen from './screens/BejelentkezesScreen';
import RegisztracioScreen from './screens/RegisztracioScreen';
import ProfilScreen from './screens/ProfilScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator()

function BejelentkezesStack() {
  return (
    <Stack.Navigator initialRouteName="Bejelentkezés">
      <Stack.Screen name="Bejelentkezés" component={BejelentkezesScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Regisztráció" component={RegisztracioScreen} />
    </Stack.Navigator>
  );
}

const getData = async () => {
    const felhasznalo = await AsyncStorage.getItem('@felhasznalo_email');
    return felhasznalo != null ? felhasznalo : "";
};

export default function DrawerScreen() {
    const [felhasznalo,setFelhasznalo] = useState("")

    useEffect(() => {
        getData().then(adat => setFelhasznalo(adat))
    },[])

    return (
        <Drawer.Navigator initialRouteName="Kvíz">
            <Drawer.Screen name="Kvíz" component={KvizScreen} />
            <Drawer.Screen name="Kapcsolat" component={KapcsolatScreen} />
            {felhasznalo == "" ? <Drawer.Screen name="BejelentkezesStack" component={BejelentkezesStack} options={{ title: 'Bejelentkezés' }}/> : <Drawer.Screen name="Profil" component={ProfilScreen} />}
        </Drawer.Navigator>
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
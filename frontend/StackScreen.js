import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import KvizScreen from './screens/KvizScreen'
import ProfilScreen from './screens/ProfilScreen';
import BejelentkezesScreen from './screens/BejelentkezesScreen';
import RegisztracioScreen from './screens/RegisztracioScreen';
import FooldalScreen from './screens/FooldalScreen';
import KapcsolatScreen from './screens/KapcsolatScreen';
import UjKvizScreen from './screens/UjKvizScreen';
import KeresesScreen from './screens/KeresesScreen';

const Stack = createStackNavigator()

export default function StackScreen() {
    return (
        <Stack.Navigator initialRouteName="Főoldal">
            <Stack.Screen name="Főoldal" component={FooldalScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Kvízek" component={KeresesScreen}/>
            <Stack.Screen name="Kvíz" component={KvizScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Új Kvíz" component={UjKvizScreen}/>
            <Stack.Screen name="Profil" component={ProfilScreen}/>
            <Stack.Screen name="Bejelentkezés" component={BejelentkezesScreen}/>
            <Stack.Screen name="Regisztráció" component={RegisztracioScreen}/>
            <Stack.Screen name="Kapcsolat" component={KapcsolatScreen}/>
        </Stack.Navigator>
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
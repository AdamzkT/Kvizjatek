import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import KvizScreen from './screens/KvizScreen'
import KapcsolatScreen from './screens/KapcsolatScreen';
import BejelentkezesScreen from './screens/BejelentkezesScreen';
import RegisztracioScreen from './screens/RegisztracioScreen';

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

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Kvíz">
        <Drawer.Screen name="Kvíz" component={KvizScreen} />
        <Drawer.Screen name="Kapcsolat" component={KapcsolatScreen} />
        <Drawer.Screen name="BejelentkezesStack" component={BejelentkezesStack} options={{ title: 'Bejelentkezés' }}/>
      </Drawer.Navigator>
    </NavigationContainer>
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

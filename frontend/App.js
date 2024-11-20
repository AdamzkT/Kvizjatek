import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import KvizScreen from './screens/KvizScreen'
import KapcsolatScreen from './screens/KapcsolatScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Kvíz">
        <Drawer.Screen name="Kvíz" component={KvizScreen} />
        <Drawer.Screen name="Kapcsolat" component={KapcsolatScreen} />
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

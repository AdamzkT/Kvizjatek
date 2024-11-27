import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerScreen from './DrawerScreen';

export default function App() {

  return (
    <NavigationContainer>
      < DrawerScreen />
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

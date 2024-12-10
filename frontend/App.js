import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackScreen from './StackScreen'

export default function App() {

  return (
    <NavigationContainer>
      < StackScreen />
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

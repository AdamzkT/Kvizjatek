import { Button, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfilScreen({navigation, route}) {
    const {email} = route.params;

    const storeData = async (email, nev) => {
      await AsyncStorage.setItem('@felhasznalo_email', email);
      await AsyncStorage.setItem('@felhasznalo_nev', nev);
    };

    const kijelentkezes = async() => {
        await storeData("","")
        navigation.popToTop()
    }

    return (
        <View style={styles.container}>
        <Text>{email}</Text>
        <Button title='Kijelentkezés' onPress={() => kijelentkezes()}/>
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

import { Button, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilScreen(navigation) {
    const storeData = async (value) => {
        await AsyncStorage.setItem('@felhasznalo_email', value);
    };

    return (
        <View style={styles.container}>
        <Button title='Kijelentkezés' onPress={() => storeData("").then(navigation.navigate('Kvíz'))}/>
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

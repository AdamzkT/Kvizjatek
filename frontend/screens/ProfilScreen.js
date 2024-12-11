import { Button, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfilScreen({navigation}) {
    const storeData = async (value) => {
        await AsyncStorage.setItem('@felhasznalo_email', value);
    };

    function kijelentkezes(){
        storeData("")
        navigation.popToTop()
    }

    return (
        <View style={styles.container}>
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

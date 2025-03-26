import { StyleSheet, View, Pressable, Text} from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

export default function FooldalScreen({navigation}) {
  return (
      <View style={styles.container}>
          <View>
              <View style={styles.cim}>
                  <Text style={styles.szoveg}>Pocket</Text>
                  <Text style={[styles.szoveg, {textAlign: 'right'}]}>Kvíz</Text>
              </View>
              <Pressable style={{alignItems: 'flex-start', marginBottom: 0}} onPress={() => {navigation.navigate('Kvízek')}}>
                  <FontAwesome5 name="play-circle" size={210} color='#3399ff'/>
              </Pressable>
              <Pressable style={{alignItems: 'flex-end'}} onPress={() => navigation.navigate('Profil')}>
                  <FontAwesome5 name="user-circle" size={120} color='#3399ff'/>
              </Pressable>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100
  },
  cim: {
    marginBottom: '10%'
  },
  szoveg: {
    fontSize: 72,
    fontStyle: 'italic',
    fontVariant: 'small-caps',
    color: '#3399ff',
    fontWeight: 600,
  }
});

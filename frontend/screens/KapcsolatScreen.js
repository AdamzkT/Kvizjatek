import { StyleSheet, Text, View, TextInput, Button, } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Ipcim from '../Ipcim';

export default function KapcsolatScreen() {
  const [tema, setTema] = useState("")
  const [tipus, setTipus] = useState("javaslat")
  const [uzenet, setUzenet] = useState("")
  const [email, setEmail] = useState("valaki@gmail.com")

  const kuldes = (email, tema, tipus, uzenet) => {
    let adatok = 
    {
        "felhasznalo_email":email,
        "visszajelzes_tema":tema,
        "visszajelzes_tipus":tipus,
        "visszajelzes_uzenet":uzenet
    }
    
    const felvitel = async () =>{
      let x = await fetch(`${Ipcim.Ipcim2}/uzenet_kuldes`, {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      let y = await x.text()
      alert(y)
    }
    felvitel()
  }

  return (
    <View style={styles.container}>
      <Text>Kapcsolat</Text>

      <Text>Téma</Text>
      <TextInput
        value={tema}
        onChangeText={tema => setTema(tema)}
        style={[styles.bemenet, {
          height: 40,
        }]}
      />

      <Text>Típus</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={tipus}
          onValueChange={(itemValue, itemIndex) =>
            setTipus(itemValue)
          }>
          <Picker.Item label="Javaslat" value="javaslat"/>
          <Picker.Item label="Probléma bejelentés" value="probléma"/>
          <Picker.Item label="Egyéb" value="egyéb"/>
        </Picker>
      </View>

      <Text>Üzenet</Text>
      <TextInput
        multiline={true}
        value={uzenet}
        numberOfLines={4}
        onChangeText={uzenet => setUzenet(uzenet)}
        style={[styles.bemenet, {
          height: 120,
        }]}
      />


    <Button title='Küldés' onPress={() => kuldes(email, tema, tipus, uzenet)}/>
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
  bemenet: {
    width: '70%',
    borderColor: 'black',
    borderWidth: 1,
  },
  picker: {
    width: '70%',
    borderColor: 'black',
    borderWidth: 1,
  },
});

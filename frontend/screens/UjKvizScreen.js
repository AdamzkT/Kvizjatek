import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Modal, Pressable, Alert } from 'react-native';


export default function UjKvizScreen() {
    const [ujCim, setUjCim] = useState("")
    const [ujLeiras, setUjLeiras] = useState("")
    const [kerdesek, setKerdesek] = useState([{kerdes: "aaammm?", valasz: "aaa"}])
    const [modalVisible, setModalVisible] = useState(false);
    const [kerdes, setKerdes] = useState("")
    const [joValasz, setJoValasz] = useState("")
    const [rosszValasz1, setRosszValasz1] = useState("")
    const [rosszValasz2, setRosszValasz2] = useState("")
    const [rosszValasz3, setRosszValasz3] = useState("")

    return (
        <View style={styles.container}>
          <Text>Cím</Text>
          <TextInput style={{backgroundColor: 'grey', height: 40, width: '90%'}} onChangeText={setUjCim} value={ujCim} maxLength={50}/>
          <Text>Leírás</Text>
          <TextInput style={{backgroundColor: 'grey', height: 120, width: '90%'}} onChangeText={setUjLeiras} value={ujLeiras} multiline={true} maxLength={255}/>
          <View style={{height: 40, width: "90%", backgroundColor: 'black', flexDirection: "row"}}>
            <Text style={{color: "white", flex: 1}}>Kérdések</Text>
            <Pressable style={{flex: 1}} onPress={() => setModalVisible(true)}><Text style={{backgroundColor: "white"}}>Új Kérdés</Text></Pressable>
          </View>
          <View style={{height: 200, width: "90%"}}>
            <FlatList style={{borderWidth: 2}}
              data={kerdesek}
              renderItem={({item}) => <Text numberOfLines={1}>{item.kerdes}</Text>}
              keyExtractor={item => item.kerdes}
            />
          </View>
          <View>
            <Modal
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text>Kérdés</Text>
                  <TextInput style={{backgroundColor: 'grey', height: 80, width: 300}} onChangeText={setKerdes} value={kerdes} multiline={true} maxLength={255}/>
                  <Text>Jó válasz</Text>
                  <TextInput style={{backgroundColor: 'lightgreen', height: 40, width: 300}} onChangeText={setJoValasz} value={joValasz} maxLength={50}/>
                  <Text>Rossz válaszok</Text>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz1} value={rosszValasz1} maxLength={50}/>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz2} value={rosszValasz3} maxLength={50}/>
                  <TextInput style={{backgroundColor: 'pink', height: 40, width: 300}} onChangeText={setRosszValasz3} value={rosszValasz1} maxLength={50}/>
                  <Pressable
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text>Hide Modal</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

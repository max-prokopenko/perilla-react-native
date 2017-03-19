import React from 'react';
import { View, Text, ListView, StyleSheet, Image, TextInput, Button, AsyncStorage, } from 'react-native';
import Row from './Row';

const styles = StyleSheet.create({
 container: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  input: {
   
    height: 40, 
    borderWidth: 0,   
    textAlign: 'left',
    flex:2,
  },
  button: {
    flex:1,
    
  },
});
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let data = [
  {
    "adress": "Viljelijäntie"
  },
];

class MyPlaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      dataSource: ds.cloneWithRows(data),
      text: '',
    };
    
    
  }
  save(someArray) {
    let that = this;
    return AsyncStorage.setItem('places', JSON.stringify(someArray))
      .then(json => that.getArray())
      .catch(error => console.log(error));
  }
  getArray() {
    let that = this; 
    return AsyncStorage.getItem('places')
      .then(req => JSON.parse(req))
      .then(json => that.setState(
        {
          data: json, 
          dataSource: ds.cloneWithRows(json)
        }
      ))
      .catch(error => console.log('error!'));
  }
  componentWillMount() {
     this.getArray();
     this.setState({dataSource: ds.cloneWithRows(this.state.data)});
  }
  onAdd() {
    let dataNew = this.state.data;
    dataNew.push({"adress": this.state.text});   
    this.setState({data: dataNew});
    console.log(this.state.data);
    this.save(this.state.data);

    
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', padding: 10,}}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  autoFocus={false}
                  autoCapitalize='sentences'
                  placeholder="Add place"
                  placeholderTextColor="rgba(0,0,0, 0.6)"
                  underlineColorAndroid={"rgba(0,0,0, 1)"}
                />
                <Button
                  color="#1d1d1d"
                  onPress={this.onAdd.bind(this)}
                  title="Set destination"
                  accessibilityLabel="See an informative alert"
                  style={styles.button}
                />
        </View>
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

export default MyPlaces;
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Button,
  Vibration,
  Switch,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

//Map
import MapView from 'react-native-maps';
import mapStyle from './map.json';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
      },
      destination: {
            latitude: 0,
            longitude: 0,
      },
      text: '',
      on: false,
      loading: true,
      animated: true,
      hidden: true,
      showHideTransition: 'slide',
      routes: [],
      open: true
    };
    
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {},
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({
        region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      });

      this.setState({loading: false});
      this.setState({hidden: true});
    });
    
  }
  getCoords() {
    let that = this; 
    return fetch('http://api.digitransit.fi/geocoding/v1/search?text=' + this.state.text + '&size=1')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({loading: false});
        let destination = {
          latitude: responseJson.features[0].geometry.coordinates[1],
          longitude: responseJson.features[0].geometry.coordinates[0],
        };
        that.setState({destination: destination});
        that.setState({
          region: {
            ...this.state.region,
            latitude: responseJson.features[0].geometry.coordinates[1],
            longitude: responseJson.features[0].geometry.coordinates[0],
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  calcCrow(lat1, lon1, lat2, lon2) {
       var R = 6371; // Radius of the earth in km
      var dLat = (Math.PI/180) * (lat2-lat1);  // (Math.PI/180) *  below
      var dLon = (Math.PI/180) * (lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos((Math.PI/180) * (lat1)) * Math.cos((Math.PI/180) * (lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  wakeUp() {
    let that = this;
    let d = this.calcCrow(this.state.destination.latitude, this.state.destination.longitude, this.state.region.latitude, this.state.region.longitude);
    console.log(d);
    if((d <= 1) && (d != 0) && (this.state.on == true)) {
      let pattern, patternLiteral, patternDescription;
      pattern = [0, 500, 200, 500];
      for (var i = 0; i < 10; i++) {
        setTimeout(function() {
          if(that.state.on == true) {
            Vibration.vibrate(pattern);
          }
        }, 1000*i);
      }
    }
  }

  turnOn(){
       this.setState({loading: true});
       this.getCoords();
       this.setState({on: true});
  }
  turnOff() {
    this.setState({on: false});
  }
  render() {
    this.wakeUp();
    const { region } = this.props; 
    console.log(this.state.routes);
    return (
       <View style ={styles.container}>
        <StatusBar
            hidden={this.state.hidden}
            showHideTransition={this.state.showHideTransition}
            animated={this.state.animated}
          />
          <MapView
           style={styles.map}
           region={this.state.region}
           customMapStyle={mapStyle}
           showsUserLocation={true}
           followUserLocation={true}
           showsMyLocationButton={false}
            overlays={[{
              strokeColor: '#ffeb3b',
              lineWidth: 10,
            }]}
          >
            <MapView.Marker
              coordinate={this.state.destination}
              title={"Destination"}
              pinColor="rgba(255, 235, 59, 1)"
            />
         </MapView>
         
         <View style={{flex: 1, alignSelf: 'flex-start'}}>
           <Switch
              onValueChange={(value) => this.setState({on: value})}
              value={this.state.on}
              onTintColor="rgba(255, 235, 59, 0.8)"
              thumbTintColor="rgba(255, 235, 59, 1)"
              style={styles.switch}
            />
        </View>
        
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            { this.state.loading && 
             <ActivityIndicator
                color="rgba(255, 235, 59, 1)"
                style={styles.centering}
                size={75}
              />
            }
          </View>
          <View style={styles.bottomBar}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  autoFocus={false}
                  autoCapitalize='sentences'
                  placeholder="Your destination"
                  placeholderTextColor="rgba(255,255,255, 0.6)"
                  underlineColorAndroid={"rgba(255, 235, 59, 1)"}
                />
                <Button
                  onPress={this.turnOn.bind(this)}
                  color="#1d1d1d"
                  title="Set destination"
                  accessibilityLabel="See an informative alert"
                  style={styles.button}
                />
              </View>
            
          </View>
       </View>
    );
  }
}


const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
 bottomBarHeader: {
    color: '#fff',    
    marginHorizontal: 30,
  },
  input: {
    width: 80,
    height: 40, 
    borderWidth: 0,
    color: '#fff',    
    textAlign: 'center',
    marginHorizontal: 5,
    flex:3,
  },
  button: {
    flex:1,
    marginHorizontal: 5,
  },
  bottomBar: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    paddingVertical: 50,
    paddingHorizontal: 10,
    alignSelf: 'stretch',
    alignItems : 'center'
  },
  switch: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  centering: {
    marginVertical: -20
  }

});



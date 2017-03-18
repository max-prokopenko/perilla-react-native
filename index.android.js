/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import App from './App.js'
import MyPlaces from './MyPlaces.js'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';

export default class AwesomeProject extends Component {
   state = {
    index: 0,
    routes: [
      { key: '1', title: 'Map' },
      { key: '2', title: 'My places' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({ index });
  };

  _renderHeader = (props) => {
    return <TabBar {...props}  style={{backgroundColor: '#1d1d1d'}}/>;
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <App />;
    case '2':
      return <MyPlaces />;
    default:
      return null;
    }
  };
  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

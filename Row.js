import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

const Row = (props) => (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>
        {`${props.name.first} ${props.name.last}`}
      </Text>
     </TouchableOpacity>

);

export default Row;
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const UserCard = ({ name, age, photo, role, isOnline }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photo }} style={styles.image} />
        {isOnline && <View style={styles.onlineBadge} />}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.age}>Edad: {age}</Text>
        {role ? <Text style={styles.role}>{role}</Text> : null}
      </View>
    </View>
  );
};


UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  photo: PropTypes.string.isRequired,
  role: PropTypes.string,
  isOnline: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffef4be',
    borderRadius: 12,
    shadowColor: '#050000cb',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e7e1e1',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  onlineBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a333b',
    marginBottom: 4,
  },
  age: {
    fontSize: 12,
    color: '#27ae60', 
    fontWeight: '600',
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    color: '#7f8c8d', 
  },
});

export default UserCard;
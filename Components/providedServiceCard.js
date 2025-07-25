import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const ProvidedServiceCard = ({
  title,
  price,
  image,
  rating,
  reviews,
  avatar,
  provider,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        {rating && (
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFC107" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewsText}>{reviews}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.infoText}>
            <View style={styles.titleRow}>
              <Text style={styles.price}>{price} ج.م</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
            {provider && <Text style={styles.provider}>{provider}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookmarkIcon: {
    width: 17,
    height: 18,
    resizeMode: 'contain',
  },
  ratingContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
   ratingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
      ratingText: {
        fontSize: 12,
        color: '#000',
        marginHorizontal: 3,
        fontWeight: '600'
    },
    reviewsText: {
        fontSize: 10,
        color: '#000',
        fontWeight: '600'
    },
  info: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  infoText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  provider: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  bookButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#004AAD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: '#004AAD',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProvidedServiceCard;

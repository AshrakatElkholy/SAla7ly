import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProviderCard = ({ provider, isFavorite, onToggleFavorite, onDetailsPress }) => {
  const toggleFavoriteStatus = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteServices');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const exists = favorites.some((fav) => fav.id === provider.id);

      if (exists) {
        favorites = favorites.filter((item) => item.id !== provider.id);
      } else {
        favorites = [...favorites, provider];
      }

      await AsyncStorage.setItem('favoriteServices', JSON.stringify(favorites));

      if (onToggleFavorite) {
        onToggleFavorite(provider);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={provider.image} style={styles.image} />

      <View style={styles.info}>
        <TouchableOpacity style={styles.favoriteBadge} onPress={toggleFavoriteStatus}>
          <Image
            source={
              isFavorite
                ? require('../assets/bookmark-filled.png')
                : require('../assets/bookmark-outline.png')
            }
            style={styles.bookmarkIcon}
          />
        </TouchableOpacity>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{provider.name}</Text>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{provider.rating || '4.5'}</Text>
            <Text style={styles.reviewsText}>({provider.reviews || '23'})</Text>
          </View>
        </View>

        <Text style={styles.address}>{provider.address}</Text>

        <View style={styles.bottomRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{provider.category || 'كهربائي'}</Text>
          </View>
          <TouchableOpacity style={styles.detailsButton} onPress={() => onDetailsPress?.(provider)}>
            <Text style={styles.detailsButtonText}>تفاصيل</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    minHeight: 150,
    position: 'relative',
  },
  image: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 15,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    marginHorizontal: 3,
    fontSize: 12,
    color: '#000',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  address: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 13,
    color: '#0C9D61',
    fontWeight: '600',
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#004AAD',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  detailsButtonText: {
    fontSize: 13,
    color: '#004AAD',
    fontWeight: '600',
  },
  bookmarkIcon: {
    width: 17,
    height: 18,
    resizeMode: 'contain',
  },
});

export default ProviderCard;

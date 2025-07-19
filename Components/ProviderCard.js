import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// ... same imports

const ProviderCard = ({ provider, isFavorite, onToggleFavorite, onDetailsPress }) => {
  return (
    <View style={styles.card}>
      <Image source={provider.image} style={styles.image} />

      <View style={styles.info}>
        {/* Bookmark top left */}
        <TouchableOpacity onPress={() => onToggleFavorite(provider)} style={styles.bookmarkWrapper}>
          <FontAwesome
            name="bookmark"
            size={16}
            color={isFavorite ? '#004AAD' : '#D3D3D3'}
          />
        </TouchableOpacity>

        {/* Name + Rating */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{provider.name}</Text>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{provider.rating || '4.5'}</Text>
            <Text style={styles.reviewsText}>({provider.reviews || '23'})</Text>
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address}>{provider.address}</Text>

        {/* Bottom row: category + details */}
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
  bookmarkWrapper: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 20,
    zIndex: 2,
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
});

export default ProviderCard;
;

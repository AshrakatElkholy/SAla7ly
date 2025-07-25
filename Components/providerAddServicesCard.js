import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const ProviderAddServicesCard = ({
  category,
  rating,
  reviews,
  image,
  priceRange,
  onPress,
  onEdit,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.serviceCard, styles.verticalCard]}>
      <View style={styles.serviceImageContainer}>
        <Image source={image} style={styles.serviceImage} />
        <View style={styles.ratingBadge}>
          <FontAwesome name="star" size={12} color="#FFC107" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews})</Text>
        </View>
      </View>

      <View style={styles.serviceInfo}>
        {/* Category & Price Range */}
        <View style={styles.rowBetween}>
          <Text style={styles.serviceCategory}>{category}</Text>
          <Text style={styles.priceRange}>({priceRange}) ج.م</Text>
        </View>

        {/* Book & Edit Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.bookButton} onPress={onPress}>
            <Text style={styles.bookButtonText}>تفاصيل </Text>
          </TouchableOpacity>

           <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Feather name="edit-3" size={16} color="#004AAD" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
    marginBottom: 15,
    overflow: 'hidden',
  },
  verticalCard: {
    width: '100%',
  },
  serviceImageContainer: {
    position: 'relative',
    height: 140,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#000',
    marginHorizontal: 3,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 10,
    color: '#000',
    fontWeight: '600',
  },
  serviceInfo: {
    padding: 12,
  },
  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  serviceCategory: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  priceRange: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  buttonsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#004AAD',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    width: '75%',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#004AAD',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    borderWidth: 2,
    borderColor: '#004AAD',
    borderRadius: 13,
    padding: 6,
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProviderAddServicesCard;

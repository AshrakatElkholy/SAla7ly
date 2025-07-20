import React from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const HorizontalCategoryList = ({ categories, onPressCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryWrapper}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => onPressCategory(category)}
          >
            <View style={styles.iconContainer}>
              <Image source={category.icon} style={{ width:60,height: 45, resizeMode: 'contain' }} />
            </View>
          </TouchableOpacity>
          <Text style={styles.categoryText}>{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {},
  contentContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  categoryCard: {
    width: 90,
    height: 80,
    backgroundColor: '#E6EDF7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 30,
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
});

export default HorizontalCategoryList;

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CustomServiceCard = ({
  category,
  rating,
  reviews,
  image,
  priceRange,
  craftsmanName,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.ratingBadge}>
          <FontAwesome name="star" size={12} color="#FFC107" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews})</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.price}>({priceRange}) ج.م</Text>
        </View>

        {craftsmanName && (
          <Text style={styles.craftsmanName}>{craftsmanName}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,

    margin: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  imageContainer: {
    position: "relative",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#000",
    marginHorizontal: 3,
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 10,
    color: "#000",
    fontWeight: "600",
  },
  info: {
    padding: 12,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  category: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  craftsmanName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#004AAD",
    textAlign: "right",
    marginTop: 8,
  },
});

export default CustomServiceCard;

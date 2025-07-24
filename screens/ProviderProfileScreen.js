import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  SafeAreaView,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import ServiceCard from "../Components/ServiceCard";

export default function ProviderProfileScreen({ navigation }) {
  // Dummy images for horizontal scroll row
  const galleryImages = [
    require("../assets/Rectangle 5626.png"),
    require("../assets/Rectangle 5627.png"),
  ];

  // Multiple services for ServiceCard
  const services = [
    {
      id: 1,
      title: "صيانة مكيفات",
      provider: "احمد محمد",
      price: "250ج.م",
      rating: "4.5",
      reviews: "(6)",
      image: require("../assets/providerBG.png"),
      avatar: require("../assets/providerBG.png"),
    },
    {
      id: 2,
      title: "تصليح كهرباء",
      provider: "احمد محمد",
      price: "300ج.م",
      rating: "4.8",
      reviews: "(10)",
      image: require("../assets/Rectangle 5626.png"),
      avatar: require("../assets/providerBG.png"),
    },
    {
      id: 3,
      title: "سباكة منزلية",
      provider: "احمد محمد",
      price: "200ج.م",
      rating: "4.2",
      reviews: "(4)",
      image: require("../assets/Rectangle 5627.png"),
      avatar: require("../assets/providerBG.png"),
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Cover Photo */}
        <View style={styles.headerImageWrapper}>
          <Image
            source={require("../assets/Frame 133867.png")}
            style={styles.headerImage}
          />
          {/* Top Buttons */}
          <View style={styles.imageTopButtons}>
            <TouchableOpacity style={styles.circleBtn} onPress={handleBackPress}>
              <Entypo name="chevron-right" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtnBookmark}>
              <Image
                source={require("../assets/bookmark.png")}
                width={20}
                height={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Provider Info Section (matches design, no card) */}
          <View style={{ marginBottom: 10, marginTop: 20 }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Text style={styles.providerName}>احمد علي</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>كهربائي</Text>
                </View>
              </View>
              <Text style={styles.ratingText}>⭐ 4.5 (51)</Text>
            </View>
            <Text style={styles.providerSubtitle}>مرسى علم، مطروح</Text>
          </View>
          <View style={styles.divider} />

          {/* Gallery Scroll Row */} 
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10 }}
            contentContainerStyle={{ flexDirection: "row-reverse" }}
          >
            {galleryImages.map((img, idx) => (
              <Image
                key={idx}
                source={img}
                style={{ width: 200, height: 140, borderRadius: 10, marginLeft: 10 }}
              />
            ))}
          </ScrollView>

          <View style={styles.divider} />
        </View>

        {/* Service Card Section (replaces old 'خدمات أخرى' section) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>خدمات أحمد</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row-reverse' }}
          >
            {services.map((service) => (
              <View key={service.id} style={{ marginLeft: 10 }}>
                <ServiceCard service={service} navigation={navigation} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  headerImageWrapper: { position: "relative" },
  headerImage: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  imageTopButtons: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  circleBtn: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  circleBtnBookmark: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#8A8AA3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  content: { padding: 20 },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    marginBottom: 10,
  },
  providerName: { fontWeight: "bold", fontSize: 14, textAlign: "right" },
  providerSubtitle: { fontSize: 12, color: "#666", textAlign: "right" },
  // providerName: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#333',
  //   marginRight: 10,
  // },

  categoryTag: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    marginHorizontal: 12, // increased space between name and category
    alignSelf: "flex-end",
  },
  categoryText: { color: "#2e8b57", fontSize: 12 },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  // providerSubtitle: {
  //   fontSize: 14,
  //   color: '#888',
  //   marginTop: 5,
  //   textAlign: 'right',
  // },
});
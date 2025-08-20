import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceCard from "../Components/ServiceCard";
import { UserContext } from "../screens/Context/UserContext";

export default function ProviderProfileScreen({ navigation, route }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useContext(UserContext);

  const userId = route.params?.userId;
  const BASE_URL =
    route.params?.baseUrl || "https://45df9571624f.ngrok-free.app";

  const fetchProvider = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/getProfile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProvider(res.data);
    } catch (err) {
      console.error("Error fetching provider profile:", err);
      setProvider(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) fetchProvider();
  }, [token, userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProvider();
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#336EBD" />
      </View>
    );

  if (!provider)
    return (
      <View style={styles.loadingContainer}>
        <Text>لم يتم العثور على بيانات البروفايدر</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Image */}
        <View style={styles.headerImageWrapper}>
          <Image
            source={{ uri: provider.profilePic?.secure_url }}
            style={styles.headerImage}
          />
          <View style={styles.imageTopButtons}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
            >
              <Entypo name="chevron-right" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtnBookmark}>
              <Image
                source={require("../assets/bookmark.png")}
                style={styles.bookmarkIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.content}>
          <View style={styles.providerInfo}>
            <View style={styles.providerHeader}>
              <View style={styles.nameAndCategory}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>
                    {provider.profession || "مزود خدمة"}
                  </Text>
                </View>
              </View>
              <Text style={styles.ratingText}>
                ⭐ {provider.rating || "4.5"}
              </Text>
            </View>
            <Text style={styles.providerSubtitle}>{provider.address}</Text>
          </View>

          <View style={styles.divider} />

          {/* Workshops Gallery */}
          {provider.workshops && provider.workshops.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>معرض الأعمال</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryScroll}
              >
                {provider.workshops.map((workshop, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: workshop.mainImage.secure_url }}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
              <View style={styles.divider} />
            </>
          )}

          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <View style={styles.servicesWrapper}>
              <Text style={styles.sectionTitle}>خدمات {provider.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesScroll}
              >
                {provider.services.map((service) => (
                  <View key={service._id} style={styles.serviceCardWrapper}>
                    <ServiceCard
                      service={{
                        id: service._id,
                        title: service.title,
                        provider: provider.name,
                        price: service.price || "—",
                        rating: service.rating || "4.5",
                        reviews: service.reviews || "(0)",
                        image: { uri: service.mainImage.secure_url },
                        avatar: { uri: provider.profilePic?.secure_url },
                      }}
                      navigation={navigation}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
  providerInfo: { marginBottom: 15, marginTop: 10 },
  providerHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameAndCategory: { flexDirection: "row-reverse", alignItems: "center" },
  providerName: { fontWeight: "bold", fontSize: 16, textAlign: "right" },
  providerSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 2,
  },
  categoryTag: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 8,
    alignSelf: "flex-end",
  },
  categoryText: { color: "#2e8b57", fontSize: 12 },
  ratingText: { fontSize: 14, color: "#666", marginRight: 5 },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    marginBottom: 10,
  },
  galleryScroll: { flexDirection: "row-reverse" },
  galleryImage: { width: 200, height: 140, borderRadius: 10, marginLeft: 10 },
  servicesWrapper: { paddingVertical: 10 },
  servicesScroll: { flexDirection: "row-reverse" },
  serviceCardWrapper: { marginLeft: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

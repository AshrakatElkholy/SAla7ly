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
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ServiceDetailsScreen({ navigation }) {
  const services = [
    {
      id: 1,
      title: "صيانة مكيفات",
      provider: "احمد محمد",
      price: "250ج.م",
      rating: "4.5",
      reviews: "(6)",
      image: require("../assets/providerBG.png"),
    },
    {
      id: 2,
      title: "صيانة مكيفات",
      provider: "احمد محمد",
      price: "250ج.م",
      rating: "4.5",
      reviews: "(6)",
      image: require("../assets/providerBG.png"),
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBookNow = () => {
    Alert.alert(
      "تأكيد الحجز",
      "هل تريد تأكيد حجز هذه الخدمة؟",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "تأكيد",
          onPress: () => {
            Alert.alert("تم الحجز", "تم حجز الخدمة بنجاح!");
          },
        },
      ]
    );
  };

  const handleServiceBookNow = (service) => {
    Alert.alert(
      "تأكيد الحجز",
      `هل تريد حجز خدمة "${service.title}"؟`,
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "تأكيد",
          onPress: () => {
            Alert.alert("تم الحجز", `تم حجز خدمة ${service.title} بنجاح!`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* صورة الخدمة */}
        <View style={styles.headerImageWrapper}>
          <Image
            source={require("../assets/providerBG.png")}
            style={styles.headerImage}
          />
          {/* أزرار أعلى الصورة */}
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
          {/* العنوان والتقييم */}
          <View style={styles.titleSection}>
            <Text style={styles.serviceTitle}>صيانه مطبخ</Text>
            <Text style={styles.ratingText}>⭐ 4.5 (51)</Text>
          </View>

          <View style={styles.divider} />

          {/* وصف الخدمة */}
          <Text style={styles.sectionTitle}>عن الخدمة</Text>
          <Text style={styles.descriptionText}>
            هذه الخدمة تشمل أعمال صيانة المطبخ من تركيب وصيانة الأجهزة وتنظيم
            المساحات بطريقة احترافية. نقوم بفحص شامل لمشاكل السباكة والكهرباء،
            واستبدال الأجزاء التالفة، مع تحسين توزيع الأجهزة لتسهيل الاستخدام
            اليومي. كما نوفر حلولًا مبتكرة لتوفير المساحة وتعزيز كفاءة المطبخ
            بما يتناسب مع احتياجاتك.
          </Text>

          <View style={styles.divider} />

          {/* مقدم الخدمة */}
          <Text style={styles.sectionTitle}>مقدم الخدمة</Text>
          <View style={styles.providerSection}>
            <Image
              source={require("../assets/providerBG.png")}
              style={styles.avatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>أحمد محمد</Text>
              <Text style={styles.providerSubtitle}>مهندس عام - مطروح</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>كهربائي</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>تفاصيل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/* خدمات أخرى */}
          <Text style={styles.sectionTitle}>خدمات أخرى</Text>
        </View>
        <View style={styles.sectionContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScrollView}
            contentContainerStyle={{ flexDirection: "row-reverse" }}
          >
            <View style={styles.servicesContainer}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceImageContainer}>
                    <Image source={service.image} style={styles.serviceImage} />

                    <View style={styles.ratingBadge}>
                      {/* زر البوكمارك */}
                      <TouchableOpacity style={styles.circleBtnBookmark}>
                        <Image
                          source={require("../assets/bookmark.png")}
                          style={{ width: 16, height: 16 }}
                        />
                      </TouchableOpacity>
                      {/* النجمة والتقييم والمراجعات */}
                      <View style={styles.ratingInfo}>
                        <FontAwesome name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{service.rating}</Text>
                        <Text style={styles.reviewsText}>
                          {service.reviews}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.serviceInfo}>
                    <View style={styles.serviceTitleRow}>
                      <Text style={styles.servicePrice}>{service.price}</Text>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                    </View>
                    <Text style={styles.serviceProvider}>
                      {service.provider}
                    </Text>
                    <TouchableOpacity 
                      style={styles.bookButton}
                      onPress={() => handleServiceBookNow(service)}
                    >
                      <Text style={styles.bookButtonText}>احجز الان</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* الحجز والسعر */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.bookButtonFooter} onPress={handleBookNow}>
            <Text style={styles.bookButtonTextFooter}>احجز الآن</Text>
          </TouchableOpacity>
          <Text style={styles.priceRange}>(500-600)م.ج</Text>
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
  btnIcon: { fontSize: 16 },

  content: { padding: 20 },
  titleSection: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceTitle: { fontSize: 20, fontWeight: "bold", textAlign: "right" },
  ratingText: { fontSize: 14, color: "#666", textAlign: "left" },

  sectionTitle: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
  },
  descriptionText: {
    marginTop: 5,
    color: "#555",
    lineHeight: 22,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  providerSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
    // backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  providerInfo: { flex: 1, marginRight: 10 },
  providerName: { fontWeight: "bold", fontSize: 14, textAlign: "right" },
  providerSubtitle: { fontSize: 12, color: "#666", textAlign: "right" },
  categoryTag: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  categoryText: { color: "#2e8b57", fontSize: 12 },

  detailButton: {
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  detailButtonText: {
    color: "#004AAD",
    fontWeight: "600",
    paddingHorizontal: 20,
  },

  otherServiceCard: {
    width: 120,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  otherServiceImage: { width: "100%", height: 80 },
  otherRating: {
    textAlign: "center",
    padding: 5,
    fontSize: 12,
  },

  footer: {
    padding: 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRange: { fontSize: 16, fontWeight: "bold" },
  bookButtonFooter: {
    backgroundColor: "#004AAD",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  bookButtonTextFooter: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  moreButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  moreButtonText: {
    fontSize: 14,
    color: "#2196F3",
    textAlign: "left",
  },

  servicesScrollView: {
    flexGrow: 0,
  },
  servicesContainer: {
    flexDirection: "row",
    paddingRight: 20,
  },
  serviceCard: {
    width: 250,
    marginRight: 15,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    overflow: "hidden",
  },
  serviceImageContainer: {
    position: "relative",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    marginHorizontal: 3,
  },
  reviewsText: {
    fontSize: 10,
    color: "#666",
  },
  serviceInfo: {
    padding: 12,
  },
  serviceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  serviceProvider: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "right",
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: 700,
    color: "#000",
    textAlign: "left",
  },
  bookButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#004AAD",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#004AAD",
    fontSize: 14,
    fontWeight: "bold",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingInfo: {
    backgroundColor: "#FFFFFF5C",
    padding: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  circleBtnBookmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8A8AA3",
    justifyContent: "center",
    alignItems: "center",
  },
});

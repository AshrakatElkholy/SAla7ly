import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  I18nManager,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// تأكد من أن التطبيق يدعم RTL
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function AgreementDetailsScreen() {
  const navigation = useNavigation();

   const services = [
     {
       id: 1,
       title: "صيانة مكيفات",
       provider: "احمد محمد",
       price: "250ج.م",
       rating: "4.5",
       reviews: "(6)",
       image: require("../../assets/providerBG.png"),
     },
   ];

  return (
    <View style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الاتفاقيه الجديده</Text>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* المحفظة */}
        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>محفظتي</Text>
          <View style={styles.balanceBox}>
            <View>
              <Text style={styles.balanceLabel}>رصيد الان</Text>
            </View>
            <View style={styles.wallet}>
              <Text style={styles.balanceAmount}>20000 ج.م</Text>
              <Image
                source={require("../../assets/logo-icon.png")}
              />
            </View>
          </View>

          <View style={styles.walletButtons}>
            <TouchableOpacity style={styles.walletBtn}>
              <Text style={styles.walletBtnText}> - سحب رصيد</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletBtn}>
              <Text style={styles.walletBtnText}> + إضافة رصيد </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* مقدم الخدمة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقدم الخدمة</Text>
          <View style={styles.providerBox}>
            <Image
              source={require("../../assets/details.png")}
              //   style={styles.avatar}
            />
            <TouchableOpacity style={styles.detailsBtn}>
              <Text style={styles.detailsText}>تفاصيل</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>أحمد محمد</Text>
              <Text style={styles.city}>مرسى علم، مطروح</Text>
              <Text style={styles.tag}>كهربائي</Text>
            </View>

            <Image
              source={require("../../assets/chat-img.png")}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* الخدمة المقدمة */}
                  <Text style={styles.sectionTitle}>خدماتى</Text>
        
        <View style={styles.sectionContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.servicesScrollView}
                    contentContainerStyle={{ flexDirection: "row" }}
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
                                  source={require("../../assets/bookmark.png")}
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
                            {/* <TouchableOpacity style={styles.bookButton}>
                              <Text style={styles.bookButtonText}>احجز الان</Text>
                            </TouchableOpacity> */}
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>

        {/* الأزرار */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>احجز الآن</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>رفض العرض</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "right", // للنصوص العربية
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#F5F8FF",
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: "Almarai-Bold",
    marginRight: 10,
    fontWeight: "bold",
    color: "#121217",
  },
  arrowBtn: {
    backgroundColor: "#004AAD",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Almarai-Bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "right",
  },
  walletSection: {
    marginBottom: 24,
  },
  balanceBox: {
    backgroundColor: "#E8F0FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  balanceLabel: {
    fontFamily: "Almarai-Regular",
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  balanceAmount: {
    marginLeft: 6,
    color: "#004AAD",
    fontFamily: "Almarai-Bold",
    textAlign: "right",
  },
  walletButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  walletBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
  },
  walletBtnText: {
    color: "#004AAD",
    fontSize: 15,
    fontFamily: "Almarai-Bold",
  },
  providerBox: {
    flexDirection: "row", // تم تعديله ليتوافق مع RTL
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F8FF",
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontFamily: "Almarai-Bold",
    fontSize: 16,
    textAlign: "right",
  },
  city: {
    fontSize: 13,
    color: "#777",
    fontFamily: "Almarai-Regular",
    textAlign: "right",
  },
  tag: {
    fontSize: 13,
    color: "#00A86B",
    fontFamily: "Almarai-Bold",
    textAlign: "right",
  },
  detailsBtn: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#004AAD",
  },
  detailsText: {
    fontFamily: "Almarai-Bold",
    color: "#004AAD",
    textAlign: "center",
  },
  actionButtons: {
    paddingVertical:50,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 10,
  },
  bookBtn: {
    backgroundColor: "#004AAD",
    paddingVertical: 12,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  bookText: {
    color: "#fff",
    fontFamily: "Almarai-Bold",
  },
  cancelBtn: {
    // backgroundColor: "#FFE9E9",
    paddingVertical: 12,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#D40000",
    fontFamily: "Almarai-Bold",
  },
  wallet: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    // backgroundColor: "#F5F8FF",
    borderRadius: 12,
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

  servicesContainer: {
    // flexDirection: "row-reverse",
    paddingRight: 20,
  },
  serviceCard: {
    width: 350,
    justifyContent: "center",
    marginRight: 15,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    overflow: "hidden",
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
});

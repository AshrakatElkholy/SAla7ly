import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ProviderChats() {
  const navigation = useNavigation();
  const route = useRoute();
  const cost = route.params?.cost; 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>اسم العميل</Text>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {[1, 2, 3, 4].map((msg, index) => (
          <View key={index} style={styles.messageRow}>
            <View
              style={[
                styles.messageBubble,
                index % 2 === 0 ? styles.grey : styles.blue,
              ]}
            >
              <Text style={styles.messageSender}>اسم العميل</Text>
              <Text style={styles.messageText}>اهلا بيك</Text>
              <Text style={styles.messageDate}>31\2\2025</Text>
            </View>
            <Image
              source={require("../../assets/chat-img.png")}
              style={styles.avatar}
            />
          </View>
        ))}

        
        {cost && (
          <View style={styles.messageRow}>
            <View style={[styles.messageBubble, styles.costBubble]}>
              <Text style={styles.costAmount}>ج.م {cost}</Text>
              <Text style={styles.costTitle}>اتفاقيه جديده</Text>
              <Text style={styles.costDesc}>تصليح الحمام</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsText}>تفاصيل</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../assets/chat-img.png")}
              style={styles.avatar}
            />
          </View>
        )}
      </ScrollView>

      {/* Input Row with Button */}
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Image source={require("../../assets/send.png")} />
          <TextInput
            style={styles.input}
            placeholder="اكتب رساله للعميل"
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => navigation.navigate("AgreementDetails")}
        >
          <Image
            source={require("../../assets/add-btn.png")}
            style={styles.sendIcon}
          />
          <Text style={styles.sendText}>عرض جديد</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontWeight: "600",
    fontFamily: "Almarai-Bold",
    marginRight: 10,
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
  messagesContainer: {
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  grey: {
    backgroundColor: "#F1F3F6",
  },
  blue: {
    backgroundColor: "#E6EFFC",
  },
  messageSender: {
    fontWeight: "bold",
    fontFamily: "Almarai-Bold",
    marginBottom: 4,
  },
  messageText: {
    fontFamily: "Almarai-Regular",
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Almarai-Regular",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8AACD9",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: "Almarai-Regular",
    fontSize: 16,
  },
  sendButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
  sendText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
    marginTop: 4,
  },

  // Bubble cost styles
  costBubble: {
    backgroundColor: "#004AAD",
    padding: 16,
    borderRadius: 16,
    flex: 1,
    marginRight: 8,
  },
  costAmount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Almarai-Bold",
    marginBottom: 4,
    textAlign: "right",
  },
  costTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Almarai-Bold",
    textAlign: "right",
  },
  costDesc: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Almarai-Regular",
    marginBottom: 12,
    textAlign: "right",
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  detailsText: {
    color: "#fff",
    fontFamily: "Almarai-Bold",
  },
});

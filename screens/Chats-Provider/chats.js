import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const messages = [
  {
    id: "1",
    name: "Technician Name",
    message: "The weather will be perfect for th......",
    date: "31\\2\\2025",
    unreadCount: 16,
    avatar: require("../../assets/chat-img.png"),
  },
];

export default function MessagesListScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل</Text>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="بحث عن صنايعي"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ProviderChatScreen")}
            style={styles.messageRow}
          >
            <View style={styles.messageLeft}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.technicianName}>{item.name}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
            <Image source={item.avatar} style={styles.avatar} />
          </TouchableOpacity>
        )}
      />
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
    fontSize: 32,
    fontWeight: "bold",
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
  searchContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontFamily: "Almarai-Regular",
    fontSize: 16,
    textAlign: "right",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  messageLeft: {
    width: 60,
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Almarai-Regular",
  },
  badge: {
    backgroundColor: "#004AAD",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Almarai-Bold",
  },
  messageContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  technicianName: {
    fontFamily: "Almarai-Bold",
    fontSize: 14,
    color: "#000",
  },
  messageText: {
    fontFamily: "Almarai-Regular",
    fontSize: 13,
    color: "#555",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

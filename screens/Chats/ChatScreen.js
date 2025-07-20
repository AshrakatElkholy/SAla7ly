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
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Technician Name</Text>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {/* Message Bubble */}
        {[1, 2, 3, 4].map((msg, index) => (
          <View key={index} style={styles.messageRow}>
            <View
              style={[
                styles.messageBubble,
                index % 2 === 0 ? styles.grey : styles.blue,
              ]}
            >
              <Text style={styles.messageSender}>Technician Name</Text>
              <Text style={styles.messageText}>اهلا بيك</Text>
              <Text style={styles.messageDate}>31\2\2025</Text>
            </View>
            <Image
              source={require("../../assets/chat-img.png")}
              style={styles.avatar}
            />
          </View>
        ))}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <Image source={require("../../assets/send.png")} />
        <TextInput
          style={styles.input}
          placeholder="اكتب رساله لصنايعي"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Image source={require("../../assets/add-btn.png")} />
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
    fontWeight: "semi-bold",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#8AACD9",
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: "Almarai-Regular",
  },
  sendButton: {
    // backgroundColor: "#004AAD",
    width: 40,
    height: 40,
    padding: 5,
    borderRadius: 10,
  },
});

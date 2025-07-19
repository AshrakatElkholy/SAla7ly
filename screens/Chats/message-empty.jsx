import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export default function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل</Text>
        <TouchableOpacity style={styles.arrowBtn}>
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MessagesListScreen")}
        >
          {/* onPress hena to show MessagesScreen for testing and show chats screen bs we should remove it  */}
          <Image
            source={require("../../assets/message-empty.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.noMessagesText}>لا يوجد رسائل</Text>
        <Text style={styles.subText}>
          سيتم التواصل معك عند قبول عرضك من الصنايعي
        </Text>
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

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  image: {
    width: 500,
    height: 200,
    resizeMode: "contain",
    marginBottom: 24,
  },

  noMessagesText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Almarai-Bold",
    color: "#000",
    marginBottom: 2,
  },
 
  subText: {
    fontSize: 16,
    color: "#4B4B4B",
    fontFamily: "Almarai-Regular",
    textAlign: "center",
  },
});

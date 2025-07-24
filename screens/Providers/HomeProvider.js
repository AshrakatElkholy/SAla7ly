import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeProvider = () => {
  const navigation = useNavigation();

  const handleGoToChat = () => {
    navigation.navigate("ProviderChats"); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>مرحبًا بك يا صنايعي 👋</Text>

      <View style={styles.content}>
        <Text style={styles.description}>
          هذه هي شاشة الصفحة الرئيسية للصنايعي
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoToChat}>
          <Text style={styles.buttonText}>اذهب إلى المحادثة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3E50",
    textAlign: "center",
    marginBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

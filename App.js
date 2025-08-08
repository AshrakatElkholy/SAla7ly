import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserCategoryScreen from "./screens/user_category_screen";
import WelcomeScreen from "./screens/welcom_screen";
import SignupScreen from "./screens/user_screens/signup";
import LoginScreen from "./screens/user_screens/login";
import IndustrialSpecialtyScreen from "./screens/industrial_screens/onboarding/IndustrialSpecialtyScreen";
import IndustrialIdentityScreen from "./screens/industrial_screens/onboarding/IndustrialIdentityScreen";
import IndustrialLocationScreen from "./screens/industrial_screens/onboarding/IndustrialLocationScreen";
import Done from "./screens/acception-regection_screens/Done";
import Pending from "./screens/acception-regection_screens/pending";
import Refused from "./screens/acception-regection_screens/refused";
import HomeScreen from "./screens/HomeScreen";
import favoriteProviderScreen from "./screens/favoriteScreens/favoriteProviderScreen.js";
import favoriteServiceScreen from "./screens/favoriteScreens/favoriteServiceScreen.js";
import UserLocationScreen from "./screens/industrial_screens/onboarding/UserLocationScreen";
import OrdersScreen from "./screens/orders/OrdersScreen";
// import HomeScreen from "./screens/HomeScreen";
import ServiceDetailsScreen from "./screens/ServiceDetailsScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import ProviderProfileScreen from "./screens/ProviderProfileScreen";
import NewCard from "./screens/Payment/NewCard";
import TwoPopups from "./screens/Payment/2popups";

// import ProviderHomeScreen from "./screens/Providers/HomeProvider";
import ProviderOrdersScreen from "./screens/provider_screens/orders/ProviderOrdersScreen";
import ProviderServiceDetailsScreen from "./screens/provider_screens/ProviderServiceDetailsScreen";
import { Fonts } from "./constants";
import * as Font from "expo-font";
// Fonts
// import * as Font from 'expo-font';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
// import ServiceDetailsScreen from "./screens/ServiceDetailsScreen";
import MessagesScreen from "./screens/Chats/message-empty";
import MessagesListScreen from "./screens/Chats/chats";
import ChatScreen from "./screens/Chats/ChatScreen";
import CategoryScreen from "./screens/categoryScreen";
import serviceProviderScreen from "./screens/serviceProviderScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appointmentBookingScreen from "./screens/appointmentBookingScreen.js";
import serviceFeedbackScreen from "./screens/serviceFeedbackScreen.js";
import providerHomeScreen from "./screens/provider_screens/providerHomeScreen.js";
import providerServicesScreen from "./screens/provider_screens/providerServicesScreen.js";
import providerAddServiceScreen from "./screens/provider_screens/providerAddServiceScreen.js";
import ProviderSettingsScreen from "./screens/provider_screens/ProviderSettingsScreen";

import AgreementDetailsScreen from "./screens/Chats/AgreementDetailsScreen";
// PROVIDER CHATS SCREENS
import ProviderChatsList from "./screens/Chats-Provider/chatsp.js";
import ProviderChats from "./screens/Chats-Provider/chatScreenp.js";
import NewOfferScreen from "./screens/Chats-Provider/AgreementDetailsScreenp.js";

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const loadFontsAndSplash = async () => {
      try {
        await Font.loadAsync({
          "Almarai-Light": require("./assets/fonts/Almarai/Almarai-Light.ttf"),
          "Almarai-Regular": require("./assets/fonts/Almarai/Almarai-Regular.ttf"),
          "Almarai-Bold": require("./assets/fonts/Almarai/Almarai-Bold.ttf"),
          "Almarai-ExtraBold": require("./assets/fonts/Almarai/Almarai-ExtraBold.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.log("Font loading error:", error);
        setFontsLoaded(true); // Continue without fonts
      }

      // Check login and onboarding progress
      try {
        const user = await AsyncStorage.getItem("user");
        const userType = await AsyncStorage.getItem("userType");
        const onboardingStep = await AsyncStorage.getItem("onboardingStep");

        if (user && userType === "sanay3y") {
          setInitialRoute("providerHome");
        } else if (user && userType === "client") {
          setInitialRoute("userHome");
        } else if (onboardingStep) {
          setInitialRoute(onboardingStep);
        } else {
          setInitialRoute("Welcome");
        }
      } catch (e) {
        console.log("AsyncStorage error:", e);
        setInitialRoute("Welcome");
      }

      // Simulate splash screen delay
      const timer = setTimeout(() => {
        setIsLoading(false);
        setSplashVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    };

    loadFontsAndSplash();
  }, []);

  if (!fontsLoaded || splashVisible || !initialRoute) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" backgroundColor="#004AAD" />
        <Image
          source={require("./assets/logo.png")}
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#004AAD" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen
          name="UserCategoryScreen"
          component={UserCategoryScreen}
        />
        <Stack.Screen name="ClientLoginScreen" component={LoginScreen} />
        {/* Add other screens here */}
        <Stack.Screen
          name="ServiceDetailsScreen"
          component={ServiceDetailsScreen}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="favoriteServiceScreen"
          component={favoriteServiceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="favoriteProviderScreen"
          component={favoriteProviderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServicesCategoryScreen"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="serviceProviderScreen"
          component={serviceProviderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="appointmentBookingScreen"
          component={appointmentBookingScreen}
        />
        <Stack.Screen
          name="serviceFeedbackScreen"
          component={serviceFeedbackScreen}
        />
        <Stack.Screen
          name="providerHomeScreen"
          component={providerHomeScreen}
        />
        <Stack.Screen
          name="providerServicesScreen"
          component={providerServicesScreen}
        />
        <Stack.Screen
          name="providerAddServiceScreen"
          component={providerAddServiceScreen}
        />
        <Stack.Screen
          name="IndustrialSpecialtyScreen"
          component={IndustrialSpecialtyScreen}
          options={{ title: "التخصصات" }}
        />
        <Stack.Screen
          name="IndustrialIdentityScreen"
          component={IndustrialIdentityScreen}
        />
        <Stack.Screen
          name="IndustrialLocationScreen"
          component={IndustrialLocationScreen}
        />
        <Stack.Screen name="PendingScreen" component={Pending} />
        <Stack.Screen name="DoneScreen" component={Done} />
        <Stack.Screen name="RefusedScreen" component={Refused} />
        <Stack.Screen name="UserLocation" component={UserLocationScreen} />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="userHome" component={HomeScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        {/* <Stack.Screen
          name="ServiceDetailsScreen"
          component={ServiceDetailsScreen}
        /> */}
        <Stack.Screen
          name="ProviderProfileScreen"
          component={ProviderProfileScreen}
        />
        <Stack.Screen name="NewCardScreen" component={NewCard} />
        <Stack.Screen name="TwoPopups" component={TwoPopups} />
        <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
        <Stack.Screen
          name="MessagesListScreen"
          component={MessagesListScreen}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen
          name="AgreementDetailsScreen"
          component={AgreementDetailsScreen}
        />
        {/* <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
        <Stack.Screen name="providerHome" component={providerHomeScreen} />
        {/* PROVIDER CHATS SCREENS */}
        <Stack.Screen name="ProviderChatsList" component={ProviderChatsList} />
        <Stack.Screen name="ProviderChatScreen" component={ProviderChats} />
        <Stack.Screen name="AgreementDetails" component={NewOfferScreen} />
        <Stack.Screen
          name="ProviderOrdersScreen"
          component={ProviderOrdersScreen}
        />
        <Stack.Screen
          name="ProviderServiceDetailsScreen"
          component={ProviderServiceDetailsScreen}
        />
        <Stack.Screen
          name="ProviderSettingsScreen"
          component={ProviderSettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#004AAD",
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: {
    width: 200,
    height: 200,
  },
});

export default App;

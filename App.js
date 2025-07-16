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
// Fonts
// import { Fonts } from './constants';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);

  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
  });

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || splashVisible) {
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

  Text.defaultProps ||= {};
  Text.defaultProps.style ||= {};
  Text.defaultProps.style.fontFamily = "Cairo_400Regular";

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#004AAD" />
      <Stack.Navigator
        initialRouteName="Welcome"
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

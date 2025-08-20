import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProviderAddServicesCard from '../../Components/providerAddServicesCard';
import ProviderBottomNavigation from '../../Components/providerBottomNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../../screens/Context/UserContext';

const NGROK_URL = 'https://45df9571624f.ngrok-free.app';

const providerServicesScreen = ({ navigation }) => {
    const [myServices, setMyServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationIconActive, setNotificationIconActive] = useState(false);
    const [messageClicked, setMessageClicked] = useState(false);

    // Get token from UserContext
    const { token } = useContext(UserContext);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchServices = async () => {
        try {
            setLoading(true);

            // Get token and role from UserContext - UPDATED
            const userToken = token;
            const userRole = await AsyncStorage.getItem('userRole');

            if (!userToken) {
                Alert.alert("خطأ", "الرجاء تسجيل الدخول أولاً");
                setLoading(false);
                // navigation.navigate('LoginScreen'); // Redirect to login
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${userToken}`,
                'ngrok-skip-browser-warning': 'true', // Added for ngrok
            };
            if (userRole) headers['role'] = userRole;

            const response = await fetch(`${NGROK_URL}/provider/getMyServices`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            const data = await response.json();
            processServicesData(data);
        } catch (err) {
            console.error('Error fetching services:', err);
            Alert.alert(
                "خطأ في تحميل الخدمات",
                `تعذر جلب الخدمات من الخادم: ${err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const processServicesData = (data) => {
        const servicesArray = Array.isArray(data) ? data : data?.services || [];
        const transformedData = servicesArray.map((service, index) => ({
            id: service._id || service.id || `service-${index}`,
            title: service.title || "خدمة",
            description: service.description || "لا يوجد وصف",
            minPrice: service.minPrice || 0,
            maxPrice: service.maxPrice || 0,
            mainImage: service.mainImage || null,
            isConfirmed: service.isConfirmed !== undefined ? service.isConfirmed : true,
        }));
        setMyServices(transformedData);
    };

    const handleAddService = (newService) => setMyServices(prev => [...prev, newService]);
    const handleEditService = (updatedService) => setMyServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    const navigateToAddService = () => navigation.navigate('providerAddServiceScreen', { onAddService: handleAddService });
    const handleServicePress = (service) => navigation.navigate('ServiceDetails', { service });
    const handleEditPress = (service) => navigation.navigate('providerAddServiceScreen', { isEdit: true, service, onEditService: handleEditService });

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#004AAD" />
                    <Text style={styles.loadingText}>جاري تحميل خدماتك...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setNotificationIconActive(prev => !prev)}>
                            <Ionicons name={notificationIconActive ? 'notifications-sharp' : 'notifications-outline'} size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setMessageClicked(!messageClicked)}>
                            <MaterialCommunityIcons name={messageClicked ? 'message-reply-text' : 'message-reply-text-outline'} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>خدماتى</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.addServiceButton} onPress={navigateToAddService}>
                <Text style={styles.addServiceText}>اضافه خدمه</Text>
                <Image source={require('../../assets/element-plus.png')} style={styles.addIconImage} />
            </TouchableOpacity>

            <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
                {myServices.length > 0 ? (
                    myServices.map((service) => (
                        <View key={service.id} style={styles.serviceCardContainer}>
                            {!service.isConfirmed && (
                                <View style={styles.pendingBadge}>
                                    <Text style={styles.pendingBadgeText}>تحت المراجعة</Text>
                                </View>
                            )}
                            <ProviderAddServicesCard
                                category={service.title}
                                priceRange={`${service.minPrice} - ${service.maxPrice} جنيه`}
                                description={service.description}
                                image={service.mainImage?.secure_url ? { uri: service.mainImage.secure_url } : require('../../assets/service1.jpg')}
                                onPress={() => handleServicePress(service)}
                                onEdit={() => handleEditPress(service)}
                                isConfirmed={service.isConfirmed}
                            />
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="briefcase-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>لا توجد خدمات مضافة حالياً</Text>
                        <TouchableOpacity style={styles.addFirstServiceButton} onPress={navigateToAddService}>
                            <Text style={styles.addFirstServiceButtonText}>إضافة خدمة جديدة</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <ProviderBottomNavigation navigation={navigation} activeTab="services" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, fontSize: 16, color: '#666', textAlign: 'center' },
    header: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: 'transparent' },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconButton: { padding: 5 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    addServiceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#004AAD', marginHorizontal: 20, marginVertical: 10, paddingVertical: 12, borderRadius: 17 },
    addIconImage: { width: 18, height: 18, marginLeft: 8, resizeMode: 'contain' },
    addServiceText: { color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 5 },
    servicesList: { flex: 1, paddingHorizontal: 20 },
    serviceCardContainer: { position: 'relative', marginBottom: 10, width: '100%' },
    pendingBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFA500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
    pendingBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
    emptyText: { fontSize: 18, color: '#666', textAlign: 'center', marginTop: 20, fontWeight: '600' },
    addFirstServiceButton: { backgroundColor: '#004AAD', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    addFirstServiceButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default providerServicesScreen;
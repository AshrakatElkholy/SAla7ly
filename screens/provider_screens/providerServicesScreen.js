import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProviderAddServicesCard from '../../Components/providerAddServicesCard';
import ProviderBottomNavigation from '../../Components/providerBottomNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const providerServicesScreen = ({ navigation }) => {
    const initialServices = [
        {
            id: 1,
            category: "صيانه مطبخ",
            priceRange: '400 - 600',
            rating: "4.5",
            reviews: "50",
            description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
            image: require('../../assets/service1.jpg')
        },
        {
            id: 2,
            category: "صيانه مطبخ",
            priceRange: '400 - 600',
            rating: "4.5",
            reviews: "50",
            description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
            image: require('../../assets/service1.jpg')
        },
        {
            id: 3,
            category: "صيانه مطبخ",
            priceRange: '400 - 600',
            rating: "4.5",
            reviews: "50",
            description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
            image: require('../../assets/service1.jpg')
        },
    ];

    const [myServices, setMyServices] = useState(initialServices);
    const [notificationIconActive, setNotificationIconActive] = useState(false);
    const [messageClicked, setMessageClicked] = useState(false);

    const handleAddService = (newService) => {
        setMyServices(prevServices => [...prevServices, newService]);
    };

    const handleEditService = (updatedService) => {
        setMyServices(prevServices => 
            prevServices.map(service => 
                service.id === updatedService.id ? updatedService : service
            )
        );
    };

    const navigateToAddService = () => {
        navigation.navigate('providerAddServiceScreen', {
            onAddService: handleAddService
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.iconRow}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setNotificationIconActive(prev => !prev)}
                        >
                            <Ionicons
                                name={notificationIconActive ? 'notifications-sharp' : 'notifications-outline'}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setMessageClicked(!messageClicked)}
                        >
                            <MaterialCommunityIcons
                                name={messageClicked ? 'message-reply-text' : 'message-reply-text-outline'}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>خدماتى</Text>
                    </View>
                </View>
            </View>

            {/* Add Service Button */}
            <TouchableOpacity
                style={styles.addServiceButton}
                onPress={navigateToAddService}
            >
                <Text style={styles.addServiceText}>اضافه خدمه</Text>
                <Image source={require('../../assets/element-plus.png')} style={styles.addIconImage} />
            </TouchableOpacity>

            <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
                {myServices.map((service) => (
                    <ProviderAddServicesCard
                        key={service.id}
                        category={service.category}
                        priceRange={service.priceRange}
                        rating={service.rating}
                        reviews={service.reviews}
                        image={service.image}
                        onPress={() => navigation.navigate('ServiceDetails', { service })}
                        onEdit={() => navigation.navigate('providerAddServiceScreen', { 
                            isEdit: true,
                            service: service,
                            onEditService: handleEditService 
                        })}
                    />
                ))}
                
            </ScrollView>

            {/* Bottom Navigation */}
            <ProviderBottomNavigation
                navigation={navigation}
                activeTab="services"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationButton: {
        padding: 5,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconButton: {
        padding: 5,
    },
    iconImage: {
        width: 22,
        height: 22,
    },
    headerTitleContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        marginTop: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    addServiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004AAD',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingVertical: 12,
        borderRadius: 17,
        marginTop: 4,
    },
    addIconImage: {
        width: 18,
        height: 18,
        marginLeft: 8, 
        resizeMode: 'contain',
    },
    addServiceText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 5,
    },
    servicesList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    activeNavItem: {
        backgroundColor: '#F0F8FF',
        borderRadius: 8,
    },
});

export default providerServicesScreen;
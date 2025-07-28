import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import ProviderBottomNavigation from '../../Components/providerBottomNavigation';
import ProviderServiceCard from '../../Components/providerServiceCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const providerHomeScreen = () => {
    const serviceData = {
        name: "احمد علي",
        image: require('../../assets/service1.jpg'),
        services: [
            {
                id: 1,
                title: " محطة الرمل,اسكندريه ",
                category: "صيانه مطبخ",
                rating: "4.5",
                reviews: "50",
                description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
                image: require('../../assets/service1.jpg')

            },
            {
                id: 2,
                title: " محطة الرمل,اسكندريه ",
                category: "صيانه مطبخ",
                rating: "4.5",
                reviews: "50",
                description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
                image: require('../../assets/service1.jpg')

            },
            {
                id: 3,
                title: " محطة الرمل,اسكندريه ",
                category: "صيانه مطبخ",
                rating: "4.5",
                reviews: "50",
                description: " اهلا يباشا انا احمد من اسكندرديه ومفروض عندى مشكله فى حنفيه...",
                image: require('../../assets/service1.jpg')
            },
        ],
        stats: [

            { label: "إجمالي خدمات", value: "8", iconImage: require('../../assets/totalServices.png') },
            { label: "إجمالي الدخل", value: "20000ج.م", iconImage: require('../../assets/income.png') },
            { label: "التقييم النهائي", value: "4.5", iconImage: require('../../assets/star.png') },
            { label: "إجمالي عملاء", value: "50", iconImage: require('../../assets/userIcon.png') }

        ]
    };

    const [favoriteServices, setFavoriteServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [notificationIconActive, setNotificationIconActive] = useState(false);
    const [messageClicked, setMessageClicked] = useState(false);


    const toggleFavorite = (service) => {
        setFavoriteServices(prev => {
            const exists = prev.find(item => item.id === service.id);
            if (exists) {
                return prev.filter(item => item.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const isFavorite = (service) => {
        return favoriteServices.some(item => item.id === service.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

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
                            onPress={() => navigation.navigate('ProviderChatsList')}
                        >
                            <MaterialCommunityIcons
                                name="message-reply-text-outline"
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>

                    </View>

                    <View style={styles.userInfo}>
                        <Text style={styles.welcomeText}>أهلا أحمد علي</Text>
                        <View style={styles.subTextContainer}>
                            <Text style={styles.subText}>مرحباً بك في التطبيق</Text>
                            <Icon name="location-on" size={16} color="#666" style={styles.locationIcon} />
                        </View>
                    </View>
                </View>

            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Featured Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <Image
                            source={require('../../assets/providerBanner.jpg')}
                            style={styles.bannerImage}
                        />
                        <View style={styles.bannerOverlay} />
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTextLine1}>ضيف اعمالك وخدماتك</Text>
                            <Text style={styles.bannerTextLine2}>ضيف شغلك وخلى ناس تتعرف اعمالك من حد</Text>
                        </View>
                    </View>


                </View>

                {/* Services Categories */}
                <View style={styles.statsContainer}>
                    {serviceData.stats.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconWrapper}>
                                    <Image source={stat.iconImage} style={styles.statIconImage} />
                                </View>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                            {stat.label === "التقييم النهائي" ? (
                                <View style={styles.ratingValueWrapper}>
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.statValue}>({serviceData.services[0].reviews})</Text>
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                        <FontAwesome name="star" size={12} color="#FFC107" />
                                    </View>
                                </View>
                            ) : (
                                <Text style={styles.statValue}>{stat.value}</Text>
                            )}


                        </View>
                    ))}
                </View>



                {/* Best Services */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>الطلبات الجديده</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.servicesScrollView}
                        contentContainerStyle={styles.servicesContainer}
                    >
                        {serviceData.services.map((service) => (
                            <ProviderServiceCard
                                key={service.id}
                                title={service.title}
                                category={service.category}
                                rating={service.rating}
                                reviews={service.reviews}
                                description={service.description}
                                image={service.image}
                                avatar={service.image}
                                provider={serviceData.name}
                                providerBrief={service.description}
                                onPress={() => navigation.navigate('providerHomeScreen')}
                            />
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            {/* Bottom Navigation */}
            <ProviderBottomNavigation
                navigation={navigation}
                activeTab="home"
                favoriteServices={favoriteServices}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    userInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    subTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    locationIcon: {
        marginLeft: 5,
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

    content: {
        flex: 1,
    },
    bannerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 74, 173, 0.3)',
        zIndex: 1,
    },
    banner: {
        height: 170,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerTextContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'flex-end',
        zIndex: 2, // ensures text is above the overlay
    },

    bannerTextLine1: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 5,
        textAlign: 'right',
    },

    bannerTextLine2: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'left',
    },

    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    sectionContainer: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
        marginRight: 5
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        // marginBottom: 10,
        justifyContent: 'flex-end',
    },
    statItem: {
        width: '48%',
        height: 90,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E6EDF7',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: '1%',
        alignItems: 'flex-end',
    },
    statHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 15,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
        marginRight: 5,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        textAlign: 'right',
    },
    ratingValueWrapper: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
    },

    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#F5F5F5', 
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },

    ratingText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
        marginHorizontal: 3,
    },

    reviewsText: {
        fontSize: 10,
        color: '#666',
    },

    statIconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#E6EDF7',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },

    statIconImage: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    servicesScrollView: {
        flexGrow: 0,
    },
    servicesContainer: {
        flexDirection: 'row',
        paddingRight: 0,
    },

});

export default providerHomeScreen;
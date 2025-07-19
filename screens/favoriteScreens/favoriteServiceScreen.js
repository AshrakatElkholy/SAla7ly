import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import ServiceCard from '../../Components/ServiceCard';
import BottomNavigation from '../../Components/BottomNavigation';
import { useRoute } from '@react-navigation/native';

const FavoriteServiceScreen = ({ navigation }) => {
    const route = useRoute();
    const [favorites, setFavorites] = useState(route.params?.favorites || []);

    const toggleFavorite = (service) => {
        const exists = favorites.some((fav) => fav.id === service.id);
        if (exists) {
            setFavorites((prev) => prev.filter((item) => item.id !== service.id));
        } else {
            setFavorites((prev) => [...prev, service]);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>المفضلة</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, styles.inactiveTab]}
                    onPress={() => navigation.replace('favoriteProviderScreen')}
                >
                    <Text style={styles.tabText}>صنايعي</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>خدمات</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {favorites.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>لا توجد خدمات مفضلة</Text>
                    </View>
                ) : (
                    favorites.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isFavorite={true}
                            onToggleFavorite={() => toggleFavorite(service)}
                            cardStyle="vertical"
                            showBookButton={true}
                        />
                    ))
                )}
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                activeTab="favorites"
                favoriteServices={favorites}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#005BAC',
    },
    inactiveTab: {
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});

export default FavoriteServiceScreen;

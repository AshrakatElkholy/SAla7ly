import React, { useState, useEffect } from 'react';
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
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteServiceScreen = ({ navigation }) => {
    const route = useRoute();
    const [favorites, setFavorites] = useState([]);

    // Load favorites from AsyncStorage when component mounts or screen is focused
    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteServices');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    // Save favorites to AsyncStorage
    const saveFavorites = async (favoritesToSave) => {
        try {
            await AsyncStorage.setItem('favoriteServices', JSON.stringify(favoritesToSave));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    // Load favorites when component mounts
    useEffect(() => {
        loadFavorites();
    }, []);

    // Reload favorites every time the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const toggleFavorite = async (service) => {
        const exists = favorites.some((fav) => fav.id === service.id);
        let updatedFavorites;
        
        if (exists) {
            updatedFavorites = favorites.filter((item) => item.id !== service.id);
        } else {
            updatedFavorites = [...favorites, service];
        }
        
        setFavorites(updatedFavorites);
        await saveFavorites(updatedFavorites);
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
                            navigation={navigation}
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
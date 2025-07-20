import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import ProviderCard from '../../Components/ProviderCard';
import BottomNavigation from '../../Components/BottomNavigation';

const initialProviders = [
    {
        id: '1',
        name: 'أحمد محمد',
        address: 'محطه الرمل ,اسكندريه',
        image: require('../../assets/service1.jpg'), // Make sure this image exists
    },
    {
        id: '2',
        name: 'سعيد عبد الله',
        address: 'محطه الرمل ,اسكندريه',
        image: require('../../assets/service1.jpg'), // Make sure this image exists
    },
];

const favoriteProviderScreen = ({ navigation, route }) => {
    const [favoriteProviders, setFavoriteProviders] = useState(initialProviders);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>المفضلة</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>صنايعي</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, styles.inactiveTab]}
                    onPress={() => navigation.replace('favoriteServiceScreen')}
                >
                    <Text style={styles.tabText}>خدمات</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.servicesContainer}>
                    {favoriteProviders.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>لا يوجد صنايعي مفضل</Text>
                        </View>
                    ) : (
                        favoriteProviders.map((provider) => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                isFavorite={true}
                                onToggleFavorite={(selected) =>
                                    setFavoriteProviders(prev =>
                                        prev.filter(item => item.id !== selected.id)
                                    )
                                }
                            />

                        ))
                    )}
                </View>
            </ScrollView>

            <BottomNavigation
                navigation={navigation}
                activeTab="favorites"
                favoriteServices={[]}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    content: { flex: 1 },
    servicesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#888',
    },
});

export default favoriteProviderScreen;

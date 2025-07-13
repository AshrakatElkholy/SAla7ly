import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignupHeaderCard = ({ onBack, title = 'انشاء حساب', subtitle = 'قم بإنشاء حساب للوصول لجميع مستخدمين صلحى', style, children }) => (
  <View style={[styles.card, style]}>
    <View style={styles.arrowRow}>
      <TouchableOpacity style={styles.arrowButton} onPress={onBack}>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={{ minHeight: 40 }} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EAF2FB',
    borderBottomLeftRadius: 40,
    minHeight: 180,
    padding: 24,
    justifyContent: 'center',
    marginBottom: 24,
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1566C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 8,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default SignupHeaderCard; 
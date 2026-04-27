import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfileScreen() {
  const router = useRouter();
  const { username, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah kamu yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'time-outline' as const, label: 'Pencarian Terakhir', color: '#007AFF', onPress: () => {} },
    { icon: 'notifications-outline' as const, label: 'Notifikasi', color: '#FFB142', onPress: () => {} },
    { icon: 'chatbubbles-outline' as const, label: 'Pesan', color: '#45CE30', onPress: () => {} },
    { icon: 'settings-outline' as const, label: 'Pengaturan', color: '#8A95A5', onPress: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Bantuan & Dukungan', color: '#8A95A5', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Image source={{uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'}} style={{width: 96, height: 96, borderRadius: 48}} />
          </View>
          <Text style={styles.profileName}>Amanda Putri</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="star" size={14} color="#007AFF" />
            <Text style={styles.roleBadgeText}>Pencari Kost Aktif</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#dfe4ea" />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4757" />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </Pressable>

        <Text style={styles.versionText}>SmartKost v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F9FF',
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D23',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4757',
  },
  versionText: {
    textAlign: 'center',
    color: '#a4b0be',
    fontSize: 13,
    marginTop: 24,
  },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function AdminProfileScreen() {
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
            router.replace('/');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Informasi Akun', color: '#1e90ff' },
    { icon: 'notifications-outline' as const, label: 'Notifikasi', color: '#ffa502' },
    { icon: 'shield-outline' as const, label: 'Keamanan', color: '#2ed573' },
    { icon: 'help-circle-outline' as const, label: 'Bantuan', color: '#747d8c' },
    { icon: 'information-circle-outline' as const, label: 'Tentang Aplikasi', color: '#a4b0be' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#ff6348" />
          </View>
          <Text style={styles.profileName}>{username || 'Admin'}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#ff6348" />
            <Text style={styles.roleBadgeText}>Administrator</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}>
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

        <Text style={styles.versionText}>SmartKost Admin v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7f4',
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff0ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ff6348',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0ed',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ff6348',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
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
    borderBottomColor: '#f8f7f4',
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2f3542',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0ed',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4757',
  },
  versionText: {
    textAlign: 'center',
    color: '#a4b0be',
    fontSize: 13,
    marginTop: 24,
  },
});

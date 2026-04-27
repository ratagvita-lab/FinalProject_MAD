import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useKostData } from '../../hooks/useKostData';

export default function AdminDashboard() {
  const { username } = useAuth();
  const { kostList } = useKostData();

  const totalKost = kostList.length;
  const totalRooms = kostList.reduce((acc, k) => acc + (k.totalRooms ?? 0), 0);
  const availableRooms = kostList.reduce((acc, k) => acc + (k.availableRooms ?? 0), 0);
  const occupiedRooms = totalRooms - availableRooms;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const stats = [
    { label: 'Total Kost', value: totalKost.toString(), icon: 'business' as const, color: '#1e90ff', bg: '#e6f2ff' },
    { label: 'Kamar Kosong', value: availableRooms.toString(), icon: 'bed' as const, color: '#2ed573', bg: '#e8faf0' },
    { label: 'Kamar Terisi', value: occupiedRooms.toString(), icon: 'people' as const, color: '#ff6348', bg: '#fff0ed' },
    { label: 'Tingkat Hunian', value: `${occupancyRate}%`, icon: 'trending-up' as const, color: '#ffa502', bg: '#fff8e6' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, {username || 'Admin'}! 🛠️</Text>
            <Text style={styles.subtitle}>Dashboard Pengelolaan Kost</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#ff6348" />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Pressable key={index} style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Kost List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kost Terbaru</Text>
        </View>

        {kostList.slice(0, 3).map((kos) => (
          <View key={kos.id} style={styles.kostItem}>
            <View style={[styles.kostTypeIndicator, { backgroundColor: kos.type === 'Putri' ? '#ff6b81' : kos.type === 'Putra' ? '#1e90ff' : '#ffa502' }]} />
            <View style={styles.kostInfo}>
              <Text style={styles.kostTitle} numberOfLines={1}>{kos.title}</Text>
              <Text style={styles.kostLocation} numberOfLines={1}>{kos.location}</Text>
            </View>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{kos.availableRooms ?? 0} kosong</Text>
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionCard}>
            <Ionicons name="add-circle" size={28} color="#1e90ff" />
            <Text style={styles.actionText}>Tambah Kost</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Ionicons name="bar-chart" size={28} color="#2ed573" />
            <Text style={styles.actionText}>Laporan</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Ionicons name="notifications" size={28} color="#ffa502" />
            <Text style={styles.actionText}>Notifikasi</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f6f9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#747d8c',
    fontWeight: '500',
  },
  adminBadge: {
    width: 48,
    height: 48,
    backgroundColor: '#fff0ed',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6348',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#747d8c',
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2f3542',
  },
  kostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  kostTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 14,
  },
  kostInfo: {
    flex: 1,
  },
  kostTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2f3542',
    marginBottom: 2,
  },
  kostLocation: {
    fontSize: 13,
    color: '#747d8c',
  },
  roomBadge: {
    backgroundColor: '#e8faf0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  roomBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ed573',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2f3542',
    marginTop: 8,
    textAlign: 'center',
  },
});

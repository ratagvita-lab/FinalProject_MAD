import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import KosCard from '../../components/KosCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useKostData } from '../../hooks/useKostData';
import { useAuth } from '../../hooks/useAuth';

export default function FavoritesScreen() {
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const { kostList } = useKostData();
  const { logout } = useAuth();
  const router = useRouter();

  const favoriteKos = kostList.filter(kos => favorites.includes(kos.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Kost Favoritku ❤️</Text>
          <Text style={styles.subtitle}>Pilihan terbaik yang kamu simpan</Text>
        </View>

        <FlatList
          data={favoriteKos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="heart-dislike-outline" size={60} color="#dfe4ea" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
              <Text style={styles.emptyText}>Cari kost idamanmu dan tekan tombol hati untuk menyimpannya di sini.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <KosCard
              kos={{ ...item, isFavorite: isFavorite(item.id) }}
              onToggleFavorite={toggleFavorite}
            />
          )}
        />
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
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8A95A5',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#E8F4FD',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#8A95A5',
    textAlign: 'center',
    lineHeight: 24,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export type KosType = {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'Putra' | 'Putri' | 'Campur';
  imageUrl: string;
  facilities: string[];
  isFavorite?: boolean;
};

interface KosCardProps {
  kos: KosType;
  onToggleFavorite: (id: string) => void;
}

export default function KosCard({ kos, onToggleFavorite }: KosCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/kos/${kos.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: kos.imageUrl }} style={styles.image} />
        
        {/* Soft dark gradient overlay approximation via shadows/opacity could go here, but using badge is fine */}
        <View style={styles.topBadgesRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{kos.type}</Text>
          </View>
          <Pressable
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(kos.id);
            }}
          >
            <Ionicons
              name={kos.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={kos.isFavorite ? '#ff4757' : '#2f3542'}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{kos.title}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#747d8c" />
          <Text style={styles.locationText} numberOfLines={1}>{kos.location}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{kos.price}</Text>
            <Text style={styles.duration}>/bln</Text>
          </View>

          <View style={styles.facilitiesIcons}>
            {kos.facilities.includes('WiFi') && <View style={styles.iconBadge}><Ionicons name="wifi" size={14} color="#1e90ff" /></View>}
            {kos.facilities.includes('AC') && <View style={styles.iconBadge}><Ionicons name="snow" size={14} color="#1e90ff" /></View>}
            {kos.facilities.includes('Kamar mandi dalam') && <View style={styles.iconBadge}><Ionicons name="water" size={14} color="#1e90ff" /></View>}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  imageContainer: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  typeText: {
    color: '#2f3542',
    fontSize: 12,
    fontWeight: '800',
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoContainer: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2f3542',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#747d8c',
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e90ff',
  },
  duration: {
    fontSize: 14,
    color: '#747d8c',
    marginLeft: 4,
    fontWeight: '600',
  },
  facilitiesIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBadge: {
    width: 32,
    height: 32,
    backgroundColor: '#f1f6f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

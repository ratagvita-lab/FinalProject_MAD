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
  latitude?: number;
  longitude?: number;
  totalRooms?: number;
  availableRooms?: number;
  description?: string;
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
              color={kos.isFavorite ? '#ff4757' : '#2A2D34'}
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
            {kos.facilities.includes('WiFi') && <View style={styles.iconBadge}><Ionicons name="wifi" size={14} color="#007AFF" /></View>}
            {kos.facilities.includes('AC') && <View style={styles.iconBadge}><Ionicons name="snow" size={14} color="#007AFF" /></View>}
            {kos.facilities.includes('Kamar mandi dalam') && <View style={styles.iconBadge}><Ionicons name="water" size={14} color="#007AFF" /></View>}
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
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  imageContainer: {
    height: 220,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  typeText: {
    color: '#1A1D23',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1D23',
    flex: 1,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#8A95A5',
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
    color: '#007AFF',
  },
  duration: {
    fontSize: 14,
    color: '#8A95A5',
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
    backgroundColor: '#E8F4FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

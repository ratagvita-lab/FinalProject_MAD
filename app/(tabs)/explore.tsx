import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const kostData = [
  { 
    id: 1, 
    name: 'Kost 1', 
    description: 'Kost dekat kampus - Fasilitas Lengkap (Recommended)', 
    latitude: 1.4176812930463127, 
    longitude: 124.98771464298962, 
    recommended: true 
  },
  { 
    id: 2, 
    name: 'Kost 2', 
    description: 'Kost dekat kampus', 
    latitude: 1.4161931222337654, 
    longitude: 124.98681610294496 
  },
  { 
    id: 3, 
    name: 'Kost 3', 
    description: 'Kost dekat kampus', 
    latitude: 1.4161073177627952, 
    longitude: 124.9865747041442 
  },
  { 
    id: 4, 
    name: 'Kost 4', 
    description: 'Kost dekat kampus', 
    latitude: 1.4147424899371202, 
    longitude: 124.98637353846948 
  },
  { 
    id: 5, 
    name: 'Kost 5', 
    description: 'Kost dekat kampus', 
    latitude: 1.4147478527223005, 
    longitude: 124.98586928319152 
  },
  { 
    id: 6, 
    name: 'Kost 6', 
    description: 'Kost dekat kampus', 
    latitude: 1.418147854502046, 
    longitude: 124.98713528581337 
  },
];

export default function ExploreScreen() {
  // Calculate center of all coordinates
  const avgLat = kostData.reduce((acc, curr) => acc + curr.latitude, 0) / kostData.length;
  const avgLng = kostData.reduce((acc, curr) => acc + curr.longitude, 0) / kostData.length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Peta Kost Terdekat</Text>
      </SafeAreaView>
      
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        {kostData.map((kost) => (
          <Marker
            key={kost.id}
            coordinate={{
              latitude: kost.latitude,
              longitude: kost.longitude,
            }}
            pinColor={kost.recommended ? '#ff4757' : '#1e90ff'}
            title={kost.recommended ? `⭐ ${kost.name}` : kost.name}
            description={kost.description}
          >
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>
                  {kost.recommended ? `⭐ ${kost.name}` : kost.name}
                </Text>
                {kost.recommended && (
                  <View style={styles.recommendBadgeContainer}>
                    <Text style={styles.recommendBadge}>Recommended Kost</Text>
                  </View>
                )}
                <Text style={styles.calloutDesc}>{kost.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f6f9',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2f3542',
    textAlign: 'center',
    marginTop: 10,
  },
  map: {
    width: '100%',
    flex: 1,
  },
  calloutContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 10,
  },
  calloutTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: '#2f3542',
    marginBottom: 4,
  },
  recommendBadgeContainer: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  recommendBadge: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  calloutDesc: {
    color: '#747d8c',
    fontSize: 12,
  }
});

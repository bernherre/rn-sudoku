
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/state/store';
import type { Difficulty, Size } from '@/engine/sudoku';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { newGame } = useGame();
  const start = (size: Size, difficulty: Difficulty) => {
    newGame(size, difficulty);
    nav.navigate('Game');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RN Sudoku</Text>
      <View style={styles.section}>
        <Text style={styles.subtitle}>4x4</Text>
        <View style={styles.row}>
          {(['easy','medium','hard','expert'] as Difficulty[]).map(d => (
            <Pressable key={d} style={styles.btn} onPress={() => start(4, d)}>
              <Text style={styles.btnText}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>6x6</Text>
        <View style={styles.row}>
          {(['easy','medium','hard','expert'] as Difficulty[]).map(d => (
            <Pressable key={d} style={styles.btn} onPress={() => start(6, d)}>
              <Text style={styles.btnText}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 24 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 20, fontWeight: '700' },
  section: { gap: 8, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 8 },
  btn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: '#fff', textTransform: 'capitalize' }
});

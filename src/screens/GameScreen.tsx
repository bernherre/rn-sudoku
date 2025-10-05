import React, { useEffect } from 'react';
import {
    View, Text, Pressable, StyleSheet, ScrollView, Platform,
} from 'react-native';
import Grid from '@/components/Grid';
import { useGame } from '@/state/store';

const sizes: Array<4 | 6> = [4, 6];
const diffs = ['easy', 'medium', 'hard', 'expert'] as const;

export default function GameScreen() {
    const {
        size, difficulty, setSize, setDifficulty,
        current, input, tick, elapsedMs, pause, resume, paused,
        reset, solveNow, verify, clear, newGame, select, selected,
    } = useGame();

    // timer
    useEffect(() => {
        const id = setInterval(tick, 250);
        return () => clearInterval(id);
    }, [tick]);

    // keyboard (web)
    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Backspace') { input(null); return; }
            const n = size;
            if (/^[1-9]$/.test(e.key)) {
                const v = Number(e.key);
                if (v >= 1 && v <= n) input(v);
            }
            // flechas para moverse
            if (selected) {
                const { r, c } = selected;
                if (e.key === 'ArrowUp') select(Math.max(0, r - 1), c);
                if (e.key === 'ArrowDown') select(Math.min(n - 1, r + 1), c);
                if (e.key === 'ArrowLeft') select(r, Math.max(0, c - 1));
                if (e.key === 'ArrowRight') select(r, Math.min(n - 1, c + 1));
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [input, size, selected, select]);

    const minutes = Math.floor(elapsedMs / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedMs % 60000) / 1000).toString().padStart(2, '0');

    const numbers = Array.from({ length: size }, (_, i) => i + 1);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            {/* Top bar with horizontal scroll if needed */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbar}>
                <View style={styles.group}>
                    <Text style={styles.label}>Tamaño:</Text>
                    {sizes.map(s => (
                        <Pressable key={s} onPress={() => setSize(s)}
                            style={[styles.chip, s === size && styles.chipActive]}>
                            <Text style={styles.chipText}>{s}×{s}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Dificultad:</Text>
                    {diffs.map(d => (
                        <Pressable key={d} onPress={() => setDifficulty(d)}
                            style={[styles.chip, d === difficulty && styles.chipActive]}>
                            <Text style={styles.chipTextCap}>{d}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.groupRow}>
                    <Pressable style={styles.btn} onPress={() => newGame()}>
                        <Text style={styles.btnText}>Nuevo</Text>
                    </Pressable>
                    <Pressable style={styles.btn} onPress={verify}>
                        <Text style={styles.btnText}>Verificar</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.warn]} onPress={solveNow}>
                        <Text style={styles.btnText}>Resolver</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, styles.neutral]} onPress={clear}>
                        <Text style={styles.btnText}>Limpiar</Text>
                    </Pressable>
                </View>

                <View style={styles.timerBox}>
                    <Text style={styles.timerText}>Tiempo: {minutes}:{seconds} {paused ? '(pausa)' : ''}</Text>
                    <Pressable style={[styles.btnSm, paused ? styles.resume : styles.pause]}
                        onPress={paused ? resume : pause}>
                        <Text style={styles.btnText}>{paused ? 'Reanudar' : 'Pausar'}</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Board */}
            <View style={styles.boardWrap}>
                <Grid cellSize={72} />
            </View>

            {/* Numpad */}
            <View style={styles.pad}>
                {numbers.map(v => (
                    <Pressable key={v} style={styles.key} onPress={() => input(v)}>
                        <Text style={styles.keyText}>{v}</Text>
                    </Pressable>
                ))}
                <Pressable style={[styles.key, styles.erase]} onPress={() => input(null)}>
                    <Text style={styles.keyText}>⌫</Text>
                </Pressable>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Hecho como PWA • Instálame desde el navegador • Usa teclas 1–{size} y Backspace para borrar.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: '#0b1220' },
    container: { alignItems: 'stretch', gap: 16, paddingVertical: 16 },
    toolbar: {
        backgroundColor: '#0f172a',
        paddingVertical: 12, paddingHorizontal: 12,
        borderBottomWidth: 1, borderBottomColor: '#1f2a44',
    },
    group: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 16 },
    groupRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 16 },
    label: { color: '#cbd5e1', fontWeight: '700', marginRight: 4 },
    chip: {
        backgroundColor: '#0b1220', borderWidth: 1, borderColor: '#334155',
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    },
    chipActive: {
        backgroundColor: '#1f2937', borderColor: '#93c5fd',
    },
    chipText: { color: '#e5e7eb', fontWeight: '800' },
    chipTextCap: { color: '#e5e7eb', fontWeight: '800', textTransform: 'capitalize' },

    btn: {
        backgroundColor: '#1d4ed8', paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 10, borderWidth: 1, borderColor: '#1e40af',
    },
    btnSm: {
        backgroundColor: '#1d4ed8', paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 10, borderWidth: 1, borderColor: '#1e40af',
    },
    btnText: { color: '#e5e7eb', fontWeight: '800' },
    warn: { backgroundColor: '#b91c1c', borderColor: '#7f1d1d' },
    neutral: { backgroundColor: '#334155', borderColor: '#1f2937' },

    timerBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    timerText: { color: '#cbd5e1', fontWeight: '800' },
    pause: { backgroundColor: '#475569', borderColor: '#334155' },
    resume: { backgroundColor: '#16a34a', borderColor: '#166534' },

    boardWrap: { alignItems: 'center', paddingVertical: 8 },
    pad: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 8,
        justifyContent: 'center', paddingVertical: 8,
    },
    key: {
        paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10,
        backgroundColor: '#2563eb',
    },
    erase: { backgroundColor: '#ef4444' },
    keyText: { color: '#fff', fontWeight: '900', fontSize: 16 },

    footer: {
        textAlign: 'center', color: '#94a3b8', marginTop: 8, marginBottom: 24,
    },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/state/store';

type Props = { cellSize?: number };

function regionDims(n: number): [number, number] {
    return n === 4 ? [2, 2] : [2, 3];
}

export default function Grid({ cellSize = 64 }: Props) {
    const { current, puzzle, select, selected, size, errors } = useGame();
    const n = current.length;
    const [rh, rw] = regionDims(size);

    const renderCell = (r: number, c: number) => {
        const val = current[r][c];
        const isClue = puzzle[r][c] !== null;
        const isSelected = selected?.r === r && selected?.c === c;
        const hasError = errors.has(`${r},${c}`);

        const thick: any = {};
        if (r % rh === 0 && r !== 0) { thick.borderTopWidth = 2; thick.borderTopColor = '#94a3b8'; }
        if (c % rw === 0 && c !== 0) { thick.borderLeftWidth = 2; thick.borderLeftColor = '#94a3b8'; }

        return (
            <Pressable
                key={`${r}-${c}`}
                onPress={() => select(r, c)}
                style={[
                    styles.cell,
                    { width: cellSize, height: cellSize },
                    isSelected && styles.selected,
                    isClue ? styles.clue : styles.inputCell,
                    thick,
                    hasError && styles.error,
                ]}
                accessibilityLabel={`cell-${r}-${c}`}
            >
                <Text style={[styles.value, isClue && styles.clueText, hasError && styles.errorText]}>
                    {val ?? ''}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.grid}>
            {current.map((_, r) => (
                <View key={`row-${r}`} style={styles.row}>
                    {current[r].map((__, c) => renderCell(r, c))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#94a3b8',
        backgroundColor: '#0f172a', // slate-900
        padding: 8,
        borderRadius: 14,
    },
    row: { flexDirection: 'row' },
    cell: {
        borderWidth: 1,
        borderColor: '#334155', // slate-700
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        borderRadius: 12,
    },
    inputCell: {
        backgroundColor: '#111827', // gray-900
    },
    clue: {
        backgroundColor: '#0b1220',
    },
    selected: {
        backgroundColor: '#1f2937', // gray-800
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e5e7eb',
    },
    clueText: {
        color: '#cbd5e1',
        fontWeight: '900',
    },
    error: {
        borderColor: '#f87171',
    },
    errorText: {
        color: '#fecaca',
    },
});

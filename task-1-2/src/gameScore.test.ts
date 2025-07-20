import { getScore, generateStamps, Score, Stamp } from './gameScore';

describe('getScore', () => {
    it('returns {home: 0, away: 0} for empty gameStamps', () => {
        expect(getScore([], 10)).toEqual({ home: 0, away: 0 });
    });

    it('returns {home: 0, away: 0} if offset is before first stamp', () => {
        const stamps: Stamp[] = [
            { offset: 5, score: { home: 1, away: 0 } },
            { offset: 10, score: { home: 1, away: 1 } },
        ];
        expect(getScore(stamps, 2)).toEqual({ home: 0, away: 0 });
    });

    it('returns correct score for exact offset match', () => {
        const stamps: Stamp[] = [
            { offset: 3, score: { home: 1, away: 0 } },
            { offset: 7, score: { home: 1, away: 1 } },
            { offset: 12, score: { home: 2, away: 1 } },
        ];
        expect(getScore(stamps, 7)).toEqual({ home: 1, away: 1 });
    });

    it('returns last score before offset if no exact match', () => {
        const stamps: Stamp[] = [
            { offset: 2, score: { home: 0, away: 1 } },
            { offset: 5, score: { home: 1, away: 1 } },
            { offset: 8, score: { home: 2, away: 1 } },
        ];
        expect(getScore(stamps, 7)).toEqual({ home: 1, away: 1 });
    });

    it('returns last score if offset is after last stamp', () => {
        const stamps: Stamp[] = [
            { offset: 2, score: { home: 0, away: 1 } },
            { offset: 5, score: { home: 1, away: 1 } },
            { offset: 8, score: { home: 2, away: 1 } },
        ];
        expect(getScore(stamps, 100)).toEqual({ home: 2, away: 1 });
    });

    it('works with only one stamp', () => {
        const stamps: Stamp[] = [
            { offset: 10, score: { home: 1, away: 0 } },
        ];
        expect(getScore(stamps, 5)).toEqual({ home: 0, away: 0 });
        expect(getScore(stamps, 10)).toEqual({ home: 1, away: 0 });
        expect(getScore(stamps, 15)).toEqual({ home: 1, away: 0 });
    });

    it('works with generated stamps (smoke test)', () => {
        const stamps: Stamp[] = generateStamps();
        const last = stamps[stamps.length - 1];

        expect(getScore(stamps, 0)).toEqual({ home: 0, away: 0 });
        expect(getScore(stamps, last.offset + 100)).toEqual(last.score);

        const mid = Math.floor(stamps.length / 2);
        const before = stamps[mid - 1];
        const after = stamps[mid];

        expect(getScore(stamps, after.offset - 1)).toEqual(before.score);
        expect(getScore(stamps, after.offset)).toEqual(after.score);
    });
}); 
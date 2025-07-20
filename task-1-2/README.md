# Задание 1: Реализация getScore функции

## Цель

Предоставить фрагмент кода, который генерирует список состояний счёта игры (`gameStamps`) с течением времени. Реализовать функцию `getScore(gameStamps, offset)` для возврата счёта с заданным смещением.

## Фрагмент кода

```typescript
const TIMESTAMPS_COUNT = 50000;
const PROBABILITY_SCORE_CHANGED = 0.0001;
const PROBABILITY_HOME_SCORE = 0.45;
const OFFSET_MAX_STEP = 3;

type Score = {
    home: number;
    away: number;
};

type Stamp = {
    offset: number;
    score: Score;
};

const emptyScoreStamp: Stamp = {
    offset: 0,
    score: {
        home: 0,
        away: 0,
    },
};

export const generateStamps = (): Stamp[] => {
    const scoreStamps = Array(TIMESTAMPS_COUNT)
        .fill(emptyScoreStamp)
        .map(
            ((acc) => () => {
                const scoreChanged =
                    Math.random() > 1 - PROBABILITY_SCORE_CHANGED;
                const homeScoreChange =
                    scoreChanged && Math.random() < PROBABILITY_HOME_SCORE
                        ? 1
                        : 0;
                const awayScoreChange =
                    scoreChanged && !homeScoreChange ? 1 : 0;
                return {
                    offset: (acc.offset +=
                        Math.floor(Math.random() * OFFSET_MAX_STEP) + 1),
                    score: {
                        home: (acc.score.home += homeScoreChange),
                        away: (acc.score.away += awayScoreChange),
                    },
                };
            })(emptyScoreStamp)
        );

    return scoreStamps;
};

export const getScore = (gameStamps: Stamp[], offset: number): Score => {
    // continue the function's implementation
};
```

## Результаты

Предоставьте ссылку на github gist вашей реализации функции `getScore`.

---

# Задание 2: Написание тестов для getScore

## Цель

Используя Jest, напишите комплексные модульные тесты для вашей функции `getScore`. Тесты должны:
- Охватывать различные сценарии (пустой массив, offset до первого события, точное совпадение, между событиями, после последнего, один элемент, работа с сгенерированными данными и др.).
- Быть ориентированными на тестирование отдельных случаев.
- Иметь понятные, описательные имена.
- Использовать синтаксис и типы TypeScript.

## Результаты

Предоставьте ссылку на gist с вашими тестовыми файлами Jest. 
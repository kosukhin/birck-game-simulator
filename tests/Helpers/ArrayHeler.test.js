import ArrayHeler from "~~/src/Helpers/ArrayHeler";

test('array rotation', () => {
    const arr = [
        [0, 0],
        [1, 1]
    ];
    const afterRotateArr = [
        [1, 0],
        [1, 0]
    ];
    expect(ArrayHeler.rotate90(arr))
    .toEqual(afterRotateArr);
});

test('all elements equals', () => {
    expect(ArrayHeler.isAllElementsEqualsTo([1, 1, 1], 1)).toBe(true);
    expect(ArrayHeler.isAllElementsEqualsTo([0, 0, 0], 0)).toBe(true);
    expect(ArrayHeler.isAllElementsEqualsTo([0, 0, 1], 0)).toBe(false);
});

import ArrayHeler from "~~/src/Helpers/ArrayHeler";

test('adds 1 + 2 to equal 3', () => {
    const arr = [
        [0, 0],
        [1, 1]
    ];
    const afterRotateArr = [
        [1, 0],
        [1, 0]
    ];
    expect(JSON.stringify(ArrayHeler.rotate90(arr)))
    .toBe(JSON.stringify(afterRotateArr));
});

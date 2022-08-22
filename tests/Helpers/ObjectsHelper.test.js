import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";

test('objects clone test', () => {
    const obj1 = {name: 'john'};
    const obj2 = obj1;
    const obj3 = ObjectsHelper.clone(obj1);

    expect(obj1 === obj2).toBe(true);
    expect(obj1 === obj3).toBe(false);
});

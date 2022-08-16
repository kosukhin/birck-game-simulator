
export default new class ArrayHelper {
    rotate90(a) {
        const w = a.length;
        const h = a[0].length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
          b[y] = new Array(w);

          for (let x = 0; x < w; x++) {
            b[y][x] = a[w - 1 - x][y];
          }
        }

        return b;
      }
}
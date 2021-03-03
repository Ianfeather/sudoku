function chunk (arr, len) {
  var chunks = [], i = 0, n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}


// no. 125
const solved = [
  [3,1,6,7,8,9,5,2,4],
  [9,7,2,4,6,5,1,3,8],
  [5,8,4,2,1,3,6,9,7],
  [4,9,7,5,2,1,3,8,6],
  [6,2,1,9,3,8,7,4,5],
  [8,3,5,6,7,4,2,1,9],
  [7,6,9,1,4,2,8,5,3],
  [2,4,3,8,5,7,9,6,1],
  [1,5,8,3,9,6,4,7,2]
];

const unsolved = [
  [null,null,6,null,null,9,null,2,4],
  [null,null,2,null,null,null,null,null,8],
  [5,8,null,null,1,null,6,null,null],
  [null,null,null,5,null,null,null,null,6],
  [null,null,1,null,null,null,null,null,null],
  [8,null,null,null,null,null,2,1,null],
  [null,null,9,null,null,2,8,5,null],
  [2,null,null,null,null,7,9,null,1],
  [1,5,null,3,null,null,null,7,null],
];

class Sudoku {
  min = 1;
  max = 9;

  constructor(initialValues) {
    this.grid = initialValues || Array(9).fill(Array(9).fill(null).map((_, i) => i + 1));
  }

  isValid () {
    // Check rows are full and unique
    for (var i = 0; i < this.max; i++) {
      let row = new Set(this.grid[i]);
      if (row.size !== 9) {
        return false;
      }
    }
    console.log('valid rows')
    // Check columns are full and unique
    for (var i = 0; i < this.max; i++) {
      let arr = [];
      for (var j = 0; j < this.max; j++) {
        arr.push(this.grid[j][i]);
      }
      let column = new Set(arr);
      if (column.size !== 9) {
        return false;
      }
    }
    console.log('valid columns')


    // [0,0 - > 3,3]
    // [0,3 - > 3,6]
    // [0,3 - > 3,9]
    // [3,0 - > 6,3]
    // [0,4 - > 3,6]
    // [0,7 - > 3,9]
    // Check minigrids are full and unique
    const miniGrids = [];
    let chunks = chunk(this.grid.flat(), 3);

    for (var i = 0; i < this.max; i++) {
      let arr = [chunks[i], chunks[i+3], chunks[i+6]].flat();
      miniGrids.push(arr)
    }
    console.log("miniGrids")
    console.log(miniGrids.forEach((mg => console.log(mg))))
    for (var i = 0; i < this.max; i++) {
      let miniGrid = new Set(miniGrids[i]);
      if (miniGrid.size !== 9) {
        return false;
      }
    }
    console.log('valid minigrids')

    // All pass
    return true;
  }

  print () {
    let output = `-------------------------------------`;
    this.grid.forEach(row => {
      output += `\n| ${row.join(' | ')} |`
    })
    output += `\n-------------------------------------`;
    console.log(output);
  }
}

const sud = new Sudoku(solved);
sud.print();
console.log(sud.isValid());

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

class Cell {
  constructor(value) {
    this.values = value ? [value] : Array(9).fill(null).map((_, i) => i + 1)
  }
  get value() {
    return this.values.length == 1 ? this.values[0] : null;
  }
}

class Sudoku {
  min = 1;
  max = 9;

  constructor(initialValues) {
    const cell = (value) => ({
      values: value ? [value] : Array(9).fill(null).map((_, i) => i + 1)
    });
    const emptyGrid = Array(9).fill(Array(9).fill(new Cell()));

    if (!initialValues) {
      this.grid = emptyGrid;
    } else {
      this.grid = initialValues.map(row =>  {
        return row.map(c => new Cell(c));
      })
    }
  }

  getRowVals(rowIndex) {
    return this.grid[rowIndex].map(cell => cell.value).filter(Boolean)
  }

  getColumnVals(columnIndex) {
    return this.grid.map(row => row[columnIndex].value).filter(Boolean)
  }

  getMiniGrids() {
    let chunks = chunk(this.grid.flat(), 3);
    return [0,1,2,9,10,11,18,19,20].map(i => {
      return [chunks[i], chunks[i+3], chunks[i+6]].flat();
    });
  }

  getGridIndex(rowIndex,columnIndex) {
    if (rowIndex < 3) {
      if (columnIndex < 3) return 0;
      return columnIndex < 6 ? 1 : 2;
    }
    if (rowIndex < 6) {
      if (columnIndex < 3) return 3;
      return columnIndex < 6 ? 4 : 5;
    }
    if (columnIndex < 3) return 6;
    return columnIndex < 6 ? 7 : 8;
  }

  getGridVals(x,y) {
    return this.getMiniGrids()[this.getGridIndex(x, y)].map(c => c.value)
  }

  solveCell (cell, [x,y]) {
    let excluded = [
      ...this.getRowVals(x),
      ...this.getColumnVals(y),
      ...this.getGridVals(x, y)
    ]
    return cell.values.filter(v => !excluded.includes(v))
  }

  isFirstValid() {
    return this.solveCell(this.grid[8][8], [8,8])
  }

  isGridValid () {
    this.print();
    // Check rows are full and unique
    for (var i = 0; i < this.max; i++) {
      let row = new Set(this.grid[i].map(c => c.value));
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
      let column = new Set(arr.map(c => c.value));
      if (column.size !== 9) {
        return false;
      }
    }
    console.log('valid columns')

    // Check grids are full and unique
    const miniGrids = getMiniGrids();
    for (var i = 0; i < this.max; i++) {
      let miniGrid = new Set(miniGrids[i].map(c => c.value));
      if (miniGrid.size !== 9) {
        return false;
      }
    }
    console.log('valid grids')

    // All pass
    return true;
  }

  print () {
    let output = `-------------------------------------`;
    this.grid.forEach(row => {
      output += `\n| ${row.map(c => c.value || 'X').join(' | ')} |`
    })
    output += `\n-------------------------------------`;
    console.log(output);
  }
}

const sud = new Sudoku(unsolved);
console.log(sud.isFirstValid());

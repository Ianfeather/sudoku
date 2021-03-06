function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function chunk (arr, len) {
  var chunks = [], i = 0, n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}

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

const unsolvedEasy = [
  [6,3, null,null,null,null,7,null,null],
  [4,2,null,null,null,null,null,5,null],
  [null,null,7,null,null,null,1,null,4],
  [null,null,6,5,null,null,null,null,null],
  [3,1,null,8,null,null,null,null,null],
  [null,8,null,null,3,4,null,null,null],
  [7,6,null,null,null,5,9,null,null],
  [null,null,5,1,4,null,null,6,7],
  [null,null,8,null,9,null,null,2,3]
];

class Cell {
  constructor(value) {
    this.values = value ? [value] : Array(9).fill(null).map((_, i) => i + 1)
    this.value = null;
    this.solved = false;
  }
  setValues(values) {
    this.values = values;
    if (values.length == 1) {
      this.value = values[0];
      this.solved = true;
    }
  }
  setValue(value) {
    this.value = value;
  }
  reset() {
    if (!this.solved) {
      this.value = null;
    }
  }
}

class Sudoku {
  constructor(initialValues) {
    if (!initialValues) {
      throw new Error('Feed me a starting grid')
    }
    this.grid = initialValues.map(row =>  {
      return row.map(c => new Cell(c));
    });
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
    return this.getMiniGrids()[this.getGridIndex(x, y)].map(c => c.value).filter(Boolean);
  }

  solveCell (cell, [x,y], { randomize = false } = {}) {
    let excluded = [
      ...this.getRowVals(x),
      ...this.getColumnVals(y),
      ...this.getGridVals(x, y)
    ]
    let newPossibleValues = cell.values.filter(v => !excluded.includes(v))
    if (!newPossibleValues.length) {
      throw new Error('failed attempt');
    }
    if (randomize) {
      shuffle(newPossibleValues);
      cell.setValue(newPossibleValues[0])
    } else {
      cell.setValues(newPossibleValues)
    }

    return cell;
  }

  solve() {
    // let it run through a few times and solve the obvious ones
    for (var j = 0; j < 3; j++) {
      this.grid = this.grid.map((row, rowIndex) => row.map((cell, columnIndex) => cell.solved ? cell : this.solveCell(cell, [rowIndex, columnIndex])));
    }

    let highestValue = 0;

    // Brute force the rest
    var i = 0;
    let startTime = new Date();
    while (true) {
      i++;
      try {
        this.grid = this.grid.map((row, rowIndex) => row.map((cell, columnIndex) => {
          return cell.solved ? cell : this.solveCell(cell, [rowIndex, columnIndex], { randomize: true })
        }))

        if (this.isGridValid()) {
          break;
        }

      } catch (e) {
        let valueCount = this.grid.map(row => row.filter(cell => !!cell.value)).flat().length;
        if (valueCount > highestValue) {
          highestValue = valueCount;
        }
        if (i % 100000 === 0) {
          let diff = (new Date() - startTime) / 1000
          console.log(`${i}, ${highestValue}, ${diff} seconds`);

        }
        this.grid.forEach(row => row.forEach(cell => cell.reset()))
      }
    }
    let diff = (new Date() - startTime) / 1000
    console.log(`valid in ${i} attempts in ${diff} seconds`);
    this.print({ showUnsolved: true })
  }

  isValid() {
    const solvedItems = this.grid.map(row => row.filter(cell => cell.solved)).flat().length;
    return solvedItems == 81;
  }

  isGridValid () {
    // Check rows are full and unique
    for (var i = 0; i < 9; i++) {
      let row = new Set(this.grid[i].map(c => c.value));
      if (row.size !== 9) {
        return false;
      }
    }
    // Check columns are full and unique
    for (var i = 0; i < 9; i++) {
      let arr = [];
      for (var j = 0; j < 9; j++) {
        arr.push(this.grid[j][i]);
      }
      let column = new Set(arr.map(c => c.value));
      if (column.size !== 9) {
        return false;
      }
    }

    // Check grids are full and unique
    const miniGrids = this.getMiniGrids();
    for (var i = 0; i < 9; i++) {
      let miniGrid = new Set(miniGrids[i].map(c => c.value));
      if (miniGrid.size !== 9) {
        return false;
      }
    }

    // All pass
    return true;
  }

  print ({ showUnsolved = false } = {}) {
    let output = `-------------------------------------`;
    this.grid.forEach(row => {
      output += `\n| ${row.map(c => (c.solved || showUnsolved) ? c.value : 'X').join(' | ')} |`
    })
    output += `\n-------------------------------------`;
    console.log(output);
  }
}

const sud = new Sudoku(unsolved);
console.log(sud.solve());

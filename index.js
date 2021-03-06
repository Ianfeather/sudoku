// A very inefficient brute force sudoku solver
// Every time it fails it starts again.
// Just a learning experiment to see how a brute force approach can be written

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const hard = [
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

const middle = [
  [5, null, 4, null, 8, null,null,null,null],
  [null,7,null,2,5,null,null,null,null],
  [null,null,null,null,null,3,null,null,null],
  [null,null,1,null,null,6,5,null,null],
  [null,6,null,1,7,null,null,3,4],
  [null,4,5,null,9,null,null,2,null],
  [2,null,null,9,null,1,null,null,8],
  [null,null,null,8,6,null,null,9,null],
  [null,null,7,null,null,null,null,null,1]
];

const easy = [
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
    return this.grid[rowIndex]
  }

  getColumnVals(columnIndex) {
    return this.grid.map(row => row[columnIndex])
  }

  getGridVals(x, y) {
    let vals = [];
    this.grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (Math.ceil((rowIndex + 1) / 3) === Math.ceil((x + 1) / 3) && Math.ceil((columnIndex + 1) / 3) === Math.ceil((y+1)/3)) {
          vals.push(cell)
        }
      })
    })
    return vals;
  }

  solveCell (cell, [x,y], { randomize = false } = {}) {
    let excluded = [
      ...this.getRowVals(x),
      ...this.getColumnVals(y),
      ...this.getGridVals(x, y)
    ].map(c => c.value).filter(Boolean);

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

        break;

      } catch (e) {
        let valueCount = this.grid.map(row => row.filter(cell => !!cell.value)).flat().length;
        if (valueCount > highestValue) {
          highestValue = valueCount;
        }
        if (i % 100000 === 0) {
          let diff = (new Date() - startTime) / 1000
          console.log(`${i}, ${highestValue}, ${diff} seconds`);
          console.log(`${(i / diff).toFixed(2)} attempts per second`);
        }
        this.grid.forEach(row => row.forEach(cell => cell.reset()))
      }
    }
    let diff = (new Date() - startTime) / 1000;
    console.log(`valid in ${i} attempts in ${diff} seconds`);
    console.log(`${(i / diff).toFixed(2)} attempts per second`);
    this.print({ showUnsolved: true })
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

const sud = new Sudoku(middle);
sud.solve();

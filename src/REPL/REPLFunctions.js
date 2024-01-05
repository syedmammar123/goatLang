export default `function add (a, b) {
  return a + b;
}
function sub (a, b) {
  return a - b;
}   
function mul (a, b) {
  return a * b;
}
function div (a, b) {
  return a / b;
}
function mod (a, b) {
  return a % b;
}
function pow (a, b) {
    return a ** b;
    }   
function log (a) {
    return Math.log(a);
    }
function sqrt (a) { 
    return Math.sqrt(a);
    }
function sin (a) {
    return Math.sin(a);
    }
function cos (a) {
    return Math.cos(a);
    }
function tan (a) {
    return Math.tan(a);
    }
function asin (a) {
    return Math.asin(a);
    }
function acos (a) {
    return Math.acos(a);
    }
function atan (a) {
    return Math.atan(a);
    }
function sinh (a) {
    return Math.sinh(a);
    }

function cosh (a) {
    return Math.cosh(a);
    }
function tanh (a) {
    return Math.tanh(a);
    }

    function sum(a){
        return a.reduce((a, b) => a + b, 0);
    }

    function avg(a){
        return a.reduce((a, b) => a + b, 0)/a.length;
    }
    function min(a){
        return Math.min(...a);
    }
    function max(a){
        return Math.max(...a);
    }
    function len(a){
        return a.length;
    }
    function sort(a){
        return a.sort();
    }
    function reverse(a){
        return a.reverse();
    }
    function range(a){
        return [...Array(a).keys()];
    }
    function abs(a){
        return Math.abs(a);
    }
    function ceil(a){
        return Math.ceil(a);
    }
    function floor(a){
        return Math.floor(a);
    }
    function round(a){
        return Math.round(a);
    }
    function random(a){
        return Math.random(a);
    }

    function factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        } else {
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
    }

    function gcd(a, b) {
        if (b === 0) {
            return a;
        } else {
            return gcd(b, a % b);
        }
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);
    }

    
    function matrixAdd(matrixA, matrixB) {
        let result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixA[i].length; j++) {
                result[i][j] = matrixA[i][j] + matrixB[i][j];
            }
        }
        return result;
    }

    function matrixSub(matrixA, matrixB) {
        let result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixA[i].length; j++) {
                result[i][j] = matrixA[i][j] - matrixB[i][j];
            }
        }
        return result;
    }
    
    function matrixMul(matrixA, matrixB) {
        let result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < matrixA[0].length; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }
    function matrixDeterminant(matrix) {
        if (matrix.length === 1) {
            return matrix[0][0];
        } else if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else {
            let result = 0;
            for (let i = 0; i < matrix.length; i++) {
                let temp = [];
                for (let j = 1; j < matrix.length; j++) {
                    temp.push(matrix[j].filter((_, index) => index !== i));
                }
                result += matrix[0][i] * matrixDeterminant(temp) * (i % 2 === 0 ? 1 : -1);
            }
            return result;
        }
    }


    function matrixInverse(matrix) {
        let determinant = matrixDeterminant(matrix);
        if (determinant === 0) {
            throw new Error("Matrix is not invertible");
        }
        let result = [];
        for (let i = 0; i < matrix.length; i++) {   
            result[i] = [];
            for (let j = 0; j < matrix.length; j++) {   
                let temp = [];
                for (let k = 0; k < matrix.length; k++) {
                    if (k !== i) {
                        temp.push(matrix[k].filter((_, index) => index !== j));
                    }
                }

                result[i][j] = matrixDeterminant(temp) * ((i + j) % 2 === 0 ? 1 : -1);
            }
        }
        result = matrixTranspose(result);
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length; j++) {
                result[i][j] /= determinant;
            }
        }

        return result;
    }


    function matrixTranspose(matrix) {
        let result = [];
        for (let i = 0; i < matrix[0].length; i++) {
            result[i] = [];
            for (let j = 0; j < matrix.length; j++) {
                result[i][j] = matrix[j][i];
            }
        }
        return result;
    }


    function isSymmetricMatrix(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== matrix[j][i]) {
                    return false;
                }
            }
        }
        return true;
    }
    function isSquareMatrix(matrix) {
        return matrix.every(row => row.length === matrix.length);
    }
    function identityMatrix(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            result[i] = [];
            for (let j = 0; j < n; j++) {
                result[i][j] = i === j ? 1 : 0;
            }
        }
        return result;
    }
    
    function fibonacci(n) {
        let sequence = [];
        let a = 0, b = 1;
        for (let i = 0; i < n; i++) {
            sequence.push(a);
            let temp = a;
            a = b;
            b = temp + b;
        }
        return sequence;
    }

    function levenshteinDistance(s, t) {
        const m = s.length;
        const n = t.length;
        const d = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
    
        for (let i = 0; i <= m; i++) {
            d[i][0] = i;
        }
    
        for (let j = 0; j <= n; j++) {
            d[0][j] = j;
        }
    
        for (let j = 1; j <= n; j++) {
            for (let i = 1; i <= m; i++) {
                const cost = s.charAt(i - 1) !== t.charAt(j - 1) ? 1 : 0;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
    
        return d[m][n];
    }
    
    
function isSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] < arr[i]) {
            return false;
        }
    }
    return true;
}
function isSortedDescending(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] > arr[i]) {
            return false;
        }
    }
    return true;
}
function isSortedUntil(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] < arr[i]) {
            return i;
        }
    }
    return arr.length - 1;
}

function isSortedUntilDescending(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] > arr[i]) {
            return i;
        }
    }
    return arr.length - 1;
}
function isPalindrome(str) {
    return str === str.split("").reverse().join("");
}
function isAnagram(str1, str2) {
    return str1.split("").sort().join("") === str2.split("").sort().join("");
}
function isPrime(n) {
    if (n === 1) {
        return false;
    } else if (n === 2) {
        return true;
    } else {
        for (let i = 2; i < n; i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }
}

function flattenArray(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}
function sumOfPrimesInRange(start, end) {
    
    let sum = 0;
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            sum += i;
        }
    }
    return sum;
}


function generateRandomHexColor() {
   
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function generateRandomRGBColor() {
    return 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
}
`

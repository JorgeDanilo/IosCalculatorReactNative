import { useRef, useState } from 'react';

enum Operator {
  add,
  subtract,
  multiply,
  divide
}

export const useCalculator = () => {

  const [ number, setNumber ] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lastOperation = useRef<Operator>();


  const clean = () => {
    setNumber('0')
    setPrevNumber('0');
  }


  const deleteOperation = () => {
    // deletar ultimo número...
    const newNumber = number.substring(0, number.length -1)

    if (newNumber === "") {
      clean()
      return;
    }
    setNumber(newNumber)
  }

  const toggleSign = ()=> {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''))
    }

    setNumber('-' + number);
  }

  const buildNumber = ( newNumber: string ) => {

    if (number.includes('.') && newNumber === '.') return;

    if (number.startsWith('0') || number.startsWith('-0')) {

      // punto decimal
      if (newNumber === '.') {
        return setNumber(number + newNumber);
      }

      // evaluar si es otro cero y no ha punto
      if (newNumber === '0' && number.includes('.')) {
        return setNumber(number + newNumber);
      }

      // evaluar si es diferente de cero, no hay punto, y es el primer numero
      if (newNumber !== '0' && !number.includes('.')) {
        return setNumber(newNumber);
      }

      // evitar 0000000.00
      if (newNumber === '0' && !number.includes('.')) {
        return;
      }

      return setNumber(number + newNumber);
    }

    setNumber(number + newNumber);

  };

  const setLastNumber = () => {
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }
    setNumber('0');
  }

  const divideOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.divide;
  }

  const multiplyOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.multiply;
  }

  const subtractOperation=() => {
    setLastNumber()
    lastOperation.current = Operator.subtract;
  }

  const addOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.add
  }

  const calculateResult = () => {

    const num1 = Number(number);
    const num2 = Number(prevNumber);

    switch(lastOperation.current) {

      case Operator.add:
        setNumber(`${ num1 + num2 }`);
        break;

      case Operator.subtract:
        setNumber( `${ num2 - num1 }` );
        break;

      case Operator.multiply:
        setNumber(`${ num1 * num2 }`);
        break;

      case Operator.divide:
        setNumber(`${ num2 / num1 }`);
        break;


      default:
        throw new Error('Operation not Implemented');
    }
  }

  return {
    // Properties
    number,
    prevNumber,

    // methods
    buildNumber,
    clean,
    deleteOperation,
    toggleSign,
    setLastNumber,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    calculateResult
  }
}
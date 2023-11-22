import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear-all",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate"
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite : false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state; //no extra 0 if the output panel is zero already
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state; //no aditional decimal sign
      return {
        ...state,
        currentOperand: `${state.currentOperand || " "}${payload.digit}`
      };

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null)  //No operator will be added if there is no operand
        {
          return state
        }

        if(state.currentOperand == null)         //I meant + 
        {
          return{
          ...state,
          operation : payload.operation,
          }
        }

        if(state.previousOperand == null)   //previous number goes in top and next operand down
        return{
...state,
operation: payload.operation,
previousOperand : state.currentOperand,
currentOperand: null,
        }

        return{               //34+87/7 perform 
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
    case ACTIONS.CLEAR:
      return {};     //to clear the output panel

      case ACTIONS.DELETE_DIGIT:                  
        if(state.overwrite)
        {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if(state.currentOperand == null) return state
        if(state.currentOperand.length === 1)
        {
          return {
            ...state,
            currentOperand : null }
        }
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)   //DELETES LAST DIGIT WHEN DEL IS PRESSED
        }

      case ACTIONS.EVALUATE:                      //to check if evaluation can be performed or not
        if((state.operation == null)||
        (state.currentOperand == null) || 
        (state.previousOperand == null))
        {
          return state
        }
        return{                // 15-3 is 12 so 12 will be displayed bigger as the current operand
          ...state,
          previousOperand: null,
          overwrite: true,
          operation: null,
          currentOperand: evaluate(state)
        }
  }
}

function evaluate({currentOperand, previousOperand, operation})
{
  const current = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if(isNaN(current) || isNaN(prev)) return ""
  let computation = ""
  switch(operation)
  {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '/':
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits : 0,
})
function formatOperand(operand)
{
  if(operand == null)  return
  const[integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
export default function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
        {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two" style= {{backgroundColor: "#8bc34a" ,/* Green */
          color: "#ffffff"}}
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

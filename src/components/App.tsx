import * as React from 'react'
import { useReducer, useEffect } from 'react'
import { newRandGen, randNext, RandGen } from 'fn-mt'

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initial)
  useEffect(() => {
    setTimeout(() => {
      if(state.gen === null){
        const now = Date.now()
        dispatch(startInit(newRandGen(now)))
      }else if(!state.initDone && state.cnt < 1000){
        dispatch(initializing(randNext(state.gen)))
      }else if(!state.initDone){
        dispatch(initDone(randNext(state.gen)))
      }else{
        if(state.generating && state.cnt < 500){
          dispatch(generating(randNext(state.gen)))
        }else if(state.generating){
         dispatch(generated(randNext(state.gen)))
        }
      }
    })
  }, [state.initDone, state.generating, state.gen])
  return (
    <main>
      <h1>{state.text}</h1>
      <button onClick={() => dispatch(generate())} className={state.initDone ? '' : "disable"} disabled={!state.initDone}>Generate</button>
    </main>
  )
}

type State = {
  initDone: boolean;
  generating: boolean;
  gen: RandGen | null;
  cnt: number;
  text: string;
}

const StartInit = Symbol("StartInit")
const Initializing = Symbol("Initializing")
const InitDone = Symbol("InitDone")
const Generate = Symbol("Gnerate")
const Generating = Symbol("Generating")
const Generated = Symbol("Generated")

const startInit = (payload: RandGen) => ({type: StartInit, payload})
const initializing = (payload: [number, RandGen]) => ({type: Initializing, payload})
const initDone = (payload: [number, RandGen]) => ({type: InitDone, payload})
const generate = () => ({type: Generate})
const generating = (payload: [number, RandGen]) => ({type: Generating, payload})
const generated = (payload: [number, RandGen]) => ({type: Generated, payload})
type Actions = ReturnType <
  typeof startInit|
  typeof initializing|
  typeof initDone|
  typeof generate|
  typeof generating|
  typeof generated
  >

const initial: State = {
  initDone: false,
  generating: false,
  gen: null,
  cnt: 0,
  text: 'initilize...',
}

const reducer = (state: State | null, action: Actions): State => {
  if(!state){
    return initial
  }

  switch(action.type){
    case StartInit:
      return {...state, gen: action.payload}
    case Initializing:
      const [n1, gen1] = action.payload
      return {...state, cnt: state.cnt+1, text: n1.toString(), gen: gen1}
    case InitDone:
      const [n2, gen2] = action.payload
      return {...state, cnt: 0, initDone: true, text: n2.toString(), gen: gen2}
    case Generate:
      return {...state, generating: true}
    case Generating:
      const [n3, gen3] = action.payload
      return {...state, cnt: state.cnt+1, text: n3.toString(), gen: gen3}
    case Generated:
      const [n4, gen4] = action.payload
      return {...state, generating: false, cnt: 0, text: n4.toString(), gen: gen4}
    default:
      return initial
  }
}

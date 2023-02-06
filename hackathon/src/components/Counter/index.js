import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import usePrevious from '../hooks/usePrevious';
import './index.scss';

const Counter = ({count, maxCount}) => {
  const [isEnter, setIsEnter] = useState(false)
  const previousCount = usePrevious(count)

  useEffect(() => {
    if(count !== previousCount)
      setIsEnter(!isEnter)
  }, [count, previousCount, isEnter])

  const getCount = useCallback(() => {
    const remainder = maxCount - count
    return remainder < 0 ? 0 : remainder
  }, [count, maxCount])

  return (
    <div className='counter-container'>
      <CSSTransition
        in={isEnter}
        timeout={1000}
        className="counter-transition"
        appear={true}
      >
        <div className='counter'>{getCount()}</div>
      </CSSTransition>
    </div>
  )
}

export default Counter

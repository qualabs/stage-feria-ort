import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import usePrevious from '../../hooks/usePrevious';
import './index.scss';

const Counter = ({count, maxCount}) => {
  const [isEnter, setIsEnter] = useState(false)
  const previousCount = usePrevious(count)

  useEffect(() => {
    if(count !== previousCount)
      setIsEnter(!isEnter)
  }, [count, previousCount, isEnter])

  const getCount = useCallback(() => {
    if (!maxCount)
      return 'Joining...'
    const remainder = maxCount - count
    return remainder < 0 ? 0 : remainder
  }, [count, maxCount])

  return (
    <div className='counter-container'>
      <SwitchTransition>
        <CSSTransition
          in={isEnter}
          timeout={200}
          className="counter-transition"
          appear={true}
          key={count}
        >
          <div className='counter'>{getCount()}</div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default Counter

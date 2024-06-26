import '../main.css'

import { useEffect, useMemo, useState } from 'react'
import { useCardSwiper } from '../hooks/useCardSwiper'
import { CardSwiperProps, SwipeAction, SwipeDirection } from '../types/types'
import { Swiper } from '../utils/swiper'
import CardSwiperActionButton from './CardSwiperActionButton'
import CardSwiperEmptyState from './CardSwiperEmptyState'
import { CardSwiperLeftActionButton } from './CardSwiperLeftActionButton'
import CardSwiperRibbons from './CardSwiperRibbons'
import { CardSwiperRightActionButton } from './CardSwiperRightActionButton'

import "./FlipCard.css"

export const CardSwiper = (props: CardSwiperProps) => {
  const { data, likeButton, dislikeButton, withActionButtons = false, emptyState, onDismiss, onFinish, onEnter } = props
  const { handleEnter, handleClickEvents, handleNewCardSwiper, dynamicData, isFinish, swiperIndex, swiperElements } =
    useCardSwiper({
      onDismiss,
      onFinish,
      onEnter,
      data,
    })
  const [currentSwiper, setCurrentSwiper] = useState<Swiper | undefined>(swiperElements.current[swiperIndex])
  const [hideActionButtons, setHideActionButtons] = useState('')

  useEffect(() => {
    setCurrentSwiper(swiperElements.current[swiperIndex - 1])
    //console.log("index", swiperIndex)
  }, [swiperElements, swiperIndex])

  useEffect(() => {
    currentSwiper && handleEnter(currentSwiper.element, currentSwiper.meta, currentSwiper.id)
    //console.log(currentSwiper)
  }, [currentSwiper])

  useEffect(() => {
    console.log('gotNewData', dynamicData)
    //console.log("index", swiperIndex)
  }, [dynamicData])

  const CardComponents = useMemo(
    () =>{
      console.log("inMemo")
      console.log(dynamicData.length)
      return dynamicData.map(({ id, frontContent, backContent, meta }) => (
        <div
          key={id}
          ref={(ref) => handleNewCardSwiper(ref, id, meta)}
          className="swipe-card__container"
          id="swipe-card__container"
        >

        <div className="flip-card" onClick={flipIt}>
          <div className="flip-card-front">

            {props.withRibbons && (
              <CardSwiperRibbons
                likeRibbonText={props.likeRibbonText}
                dislikeRibbonText={props.dislikeRibbonText}
                ribbonColors={props.ribbonColors}
              />
            )}

            { frontContent }
            {/*
            {header && (
              <div className="swipe-card__header-container" id="swipe-card__header-container">
                <h2 id="swipe-card__header">{header}</h2>
              </div>
            )}
            {props.withRibbons && (
              <CardSwiperRibbons
                likeRibbonText={props.likeRibbonText}
                dislikeRibbonText={props.dislikeRibbonText}
                ribbonColors={props.ribbonColors}
              />
            )}

            <div className="swipe-card__image-container">
              <img className="swipe-card__image" src={src} alt={src} id="swipe-card__image" />
            </div>
            {content && <div className="swipe-card__content">{content}</div>}
            */}
          </div> 

          <div className="flip-card-back">
            { backContent }
          </div>

          </div>
        </div>
      ))},
    [props.data, dynamicData , ],
  )

  useEffect(() => {
    if (isFinish) setHideActionButtons('hide-action-buttons')
  }, [isFinish])

/*   useEffect(() => {
    const handleWindowBlur = () => {
      currentSwiper?.handleTouchEnd()
      currentSwiper?.handleMoveUp()
    }

    window.addEventListener('blur', handleWindowBlur)

    return () => window.removeEventListener('blur', handleWindowBlur)
  }, [currentSwiper])
 */

  return (
    <div className="swipe-card" id="swipe-card">
      <div className="swipe-card__cards" id="swipe-card__cards">
        {CardComponents}
        {/* {emptyState && isFinish && <CardSwiperEmptyState children={emptyState} isFinish={isFinish} />} */}
      </div>
      {withActionButtons && (
        <div className={`swipe-card__children ${hideActionButtons}`} id="swipe-card__children">
          {likeButton && dislikeButton ? (
            <>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleClickEvents}
                buttonContent={dislikeButton}
              />
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleClickEvents}
                buttonContent={likeButton}
              />
            </>
          ) : (
            <>
              <CardSwiperActionButton
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleClickEvents}
                buttonContent={<CardSwiperLeftActionButton />}
              />
              <CardSwiperActionButton
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleClickEvents}
                buttonContent={<CardSwiperRightActionButton />}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function flipIt(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const div = event.currentTarget as HTMLDivElement;
  div.classList.toggle('fliped');
  //event.preventDefault();
}


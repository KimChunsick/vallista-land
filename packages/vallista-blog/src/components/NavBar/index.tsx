import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useLocation } from '@reach/router'
import { Text, Tooltip, useWindowSize } from '@vallista-land/core'
import { navigate } from 'gatsby'
import { useEffect, useMemo, useState, VFC } from 'react'

import { NavCategory, NavFooter } from '../../../config/navbar'

export const NavBar: VFC = () => {
  const location = useLocation()
  const categories = useMemo(() => Object.values(NavCategory), [])
  const footer = useMemo(() => Object.values(NavFooter), [])
  const [visibleTooltip, setVisibleTooltip] = useState(true)
  const windowSize = useWindowSize()

  useEffect(() => {
    setVisibleTooltip(!((windowSize.width ?? 0) <= 1024))
  }, [windowSize])

  return (
    <Container>
      <Section>
        <Wrapper>
          {categories.map((it) => (
            <Category checked={isCategoryActive(it.link)} key={it.name} onClick={() => moveToLocation(it.link)}>
              {visibleTooltip ? (
                <Tooltip text={<Text>{it.name}</Text>} position='right'>
                  <div>{it.icon}</div>
                </Tooltip>
              ) : (
                it.icon
              )}
            </Category>
          ))}
        </Wrapper>
        <Wrapper>
          {footer.map((it) =>
            it.link === '' ? undefined : (
              <Category key={it.name} onClick={() => moveToLocation(it.link, true)}>
                {visibleTooltip ? (
                  <Tooltip text={<Text>{it.name}</Text>} position='right'>
                    <div>{it.icon}</div>
                  </Tooltip>
                ) : (
                  it.icon
                )}
              </Category>
            )
          )}
        </Wrapper>
      </Section>
    </Container>
  )

  function moveToLocation(target: string, isNewTab = false): void {
    if (isNewTab) {
      window.open(target, '_blank')
      return
    }

    navigate(target)
  }

  function isCategoryActive(target: string): boolean {
    return location.pathname === target
  }
}

const Container = styled.aside`
  position: fixed;
  top: 0;
  left: 0;

  ${({ theme }) => css`
    background: ${theme.colors.PRIMARY.ACCENT_2};
    z-index: ${theme.layers.AFTER_STANDARD + 1};
  `}

  @media screen and (min-width: 1025px) {
    min-width: 80px;
    height: 100vh;
  }

  @media screen and (max-width: 1024px) {
    top: 43px;
    min-height: 60px;
    width: 100vw;
    overflow-y: hidden;
    overflow-x: auto;

    /** 파이어폭스 스크롤 대응 */
    scrollbar-width: 8px;
    // thumb background 순
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-background);

    /** 사파리 크롬 스크롤 대응 */
    &::-webkit-scrollbar {
      background: var(--scrollbar-background);
      height: 8px;
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 0;
    }
  }
`

const Section = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 1025px) {
    flex-direction: column;
    height: 100vh;
  }

  @media screen and (max-width: 1024px) {
    flex-direction: row;
  }
`

const Wrapper = styled.nav`
  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: row;
  }
`

const Category = styled.a<{ checked?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: background 0.2s ease;

  & > div > div > div > svg {
    width: 32px;
    height: 32px;
  }

  @media screen and (max-width: 1024px) {
    width: 60px;
    height: 60px;

    & > figure {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      overflow: hidden;
    }

    & > svg {
      width: 24px;
      height: 24px;
    }
  }

  & > div {
    width: inherit;
    height: inherit;

    & img {
      border-radius: 12px;
    }
  }

  ${({ theme, checked }) => css`
    & > div > div:first-of-type {
      width: inherit;
      height: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${theme.colors.PRIMARY.FOREGROUND};
    }

    &:hover {
      background: ${theme.colors.PRIMARY.ACCENT_3};
    }

    &:hover > div > div:first-of-type {
      color: ${theme.colors.PRIMARY.BACKGROUND};
    }

    ${checked &&
    css`
      &:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 80px;
        height: 80px;
        content: '';
        border-left: 3px solid ${theme.colors.HIGHLIGHT.PINK};
        box-sizing: border-box;

        @media screen and (max-width: 1024px) {
          width: 60px;
          height: 60px;
          border-left: none;

          border-bottom: 3px solid ${theme.colors.HIGHLIGHT.PINK};
        }
      }
    `}
  `}
`

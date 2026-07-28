import { Card, Text } from '@nextui-org/react'
import React from 'react'

export default function HomeCards({ cards = [] }) {
  const safeCards = Array.isArray(cards) ? cards : []

  return ( 
    <footer>
        <div className="mx-auto max-w-4xl flex flex-col items-center justify-between py-4 text-sm lg:flex-row lg:items-stretch font-bold text-center gap-7">
          {safeCards.map((card, index) => {
            const cardText = typeof card === 'string' ? card : (typeof card === 'object' && card !== null ? (card.title || card.text || JSON.stringify(card)) : String(card || ''))
            return (
              <Card
                key={index}
                variant={'bordered'}
                borderWeight={'bold'}
                css={ { display:'flex' } }
              >
                <Card.Body css={{  }} >
                  <Text css={ { textAlign:'center' } } >{cardText}</Text>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      <br />
    </footer>
  )
}

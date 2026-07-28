import Image from 'next/image'
import React from 'react'

export default function Cover(props) {
  const src = props.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/web3dev-bootcamp.appspot.com/o/courses_cover%2FSolana_NFTs.png?alt=media&token=fcdba884-7e66-46b8-9282-fced339907da'
  return <Image width={350} height={350} src={src} className="rounded-3xl" />
}

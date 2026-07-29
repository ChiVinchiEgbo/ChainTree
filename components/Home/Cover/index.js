import Image from 'next/image'
import React from 'react'

export default function Cover(props) {
  const src = props.imageUrl || '/assets/img/solidity_course_cover.png'
  return <Image width={350} height={350} src={src} className="rounded-3xl" unoptimized={true} alt="Course cover" />
}

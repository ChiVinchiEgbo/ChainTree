import { db } from '../firebase/initFirebase.js'
import { doc, getDoc } from 'firebase/firestore'
import { branch, user, repo } from './utils/github.js'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'

const fetch = require('node-fetch')

export async function getPage(course, section, lesson, language) {
  const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${course}/${language}/${section}/${lesson}`
  const result = await fetch(url)
  const text = await result.text()
  return text
}

export async function getStudyGroup(groupSlug) {
  try {
    const colRef = collection(db, 'study_groups')
    const q = query(colRef, where('slug', '==', groupSlug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const groupDoc = querySnapshot.docs[0]
      const groupData = groupDoc.data()
      const group = {
        id: groupDoc.id,
        ...groupData,
        scheduled_at: groupData?.scheduled_at?.toDate ? groupData.scheduled_at.toDate().toISOString() : groupData?.scheduled_at || new Date().toISOString(),
      }
      return { ...group }
    }
  } catch (error) {
    console.error('Error fetching study group:', error)
  }
  return null
}

export async function getCourse(course_id) {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore getCourse timeout')), 3000)
    )
    const fetchCourse = async () => {
      const docRef = doc(db, 'courses', course_id)
      const courseDoc = await getDoc(docRef)
      if (courseDoc.exists()) {
        const course = { id: course_id, ...courseDoc.data() }
        return { ...course }
      }
      return { id: course_id, ...defaultCourse }
    }
    return await Promise.race([fetchCourse(), timeout])
  } catch (error) {
    console.error('Error fetching course:', error)
  }
  return { id: course_id, ...defaultCourse }
}

export const defaultCourse = {
  id: 'Solidity_And_Smart_Contracts',
  title: 'Crie seu Primeiro Smart Contract com Solidity',
  description:
    'Um projeto de nove dias onde você irá aprender Solidity, escrever e implementar smart-contracts na blockchain e desenvolver um Web3 App para interagir com seu contrato. Perfeito para entusiastas em blockchain e desenvolvedores de Web3.',
  image_url:
    'https://firebasestorage.googleapis.com/v0/b/web3dev-bootcamp.appspot.com/o/courses_cover%2FSolana_NFTs.png?alt=media&token=fcdba884-7e66-46b8-9282-fced339907da',
}

export async function getHomeCourse() {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore getHomeCourse timeout')), 3000)
    )
    const fetchHome = async () => {
      const q = query(collection(db, 'courses'), where('home', '==', true))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0]
        const course = { id: docSnapshot.id, ...docSnapshot.data() }
        return course
      }
      return defaultCourse
    }
    return await Promise.race([fetchHome(), timeout])
  } catch (error) {
    console.error('Error fetching home course from Firestore:', error)
  }
  return defaultCourse
}

export function getFieldContent(object, field, i18n) {
  const defaultLanguage = 'en'
  const language = i18n.resolvedLanguage || defaultLanguage

  let content = object?.metadata?.[language]?.[field]

  if (content === undefined) {
    content = object?.[field]
  }

  return content || ''
}

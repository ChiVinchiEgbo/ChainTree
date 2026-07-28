import * as fb from '../firebase/initFirebase.js'
import { doc, getDoc } from 'firebase/firestore'
import { branch, user, repo } from './utils/github.js'
import { collection, query, getDocs, where } from 'firebase/firestore'

const db = fb.db || fb.default?.db || fb

if (typeof window === 'undefined' && typeof process !== 'undefined' && process.on) {
  process.on('unhandledRejection', (reason) => {
    console.warn('Unhandled Rejection caught safely in Node server environment:', reason?.message || reason)
  })
}

const fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require('node-fetch')

export async function getPage(course, section, lesson, language) {
  try {
    const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${course}/${language}/${section}/${lesson}`
    const result = await fetch(url)
    const text = await result.text()
    return text
  } catch (err) {
    console.error('Error fetching page:', err)
    return ''
  }
}

export async function getStudyGroup(groupSlug) {
  try {
    const colRef = collection(db, 'study_groups')
    const q = query(colRef, where('slug', '==', groupSlug))
    const querySnapshot = await getDocs(q).catch((e) => {
      console.error('Firestore getStudyGroup getDocs catch:', e?.message || e)
      return { empty: true, docs: [] }
    })

    if (querySnapshot && !querySnapshot.empty && querySnapshot.docs.length > 0) {
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
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve({ id: course_id, ...defaultCourse }), 2500)
    )
    const fetchCourse = async () => {
      const docRef = doc(db, 'courses', course_id)
      const courseDoc = await getDoc(docRef).catch((e) => {
        console.error('Firestore getCourse catch:', e?.message || e)
        return { exists: () => false }
      })
      if (courseDoc && courseDoc.exists && courseDoc.exists()) {
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
  active: true,
}

export async function getHomeCourse() {
  try {
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve(defaultCourse), 2500)
    )
    const fetchHome = async () => {
      const q = query(collection(db, 'courses'), where('home', '==', true))
      const querySnapshot = await getDocs(q).catch((e) => {
        console.error('Firestore getHomeCourse getDocs catch:', e?.message || e)
        return { empty: true, docs: [] }
      })
      if (querySnapshot && !querySnapshot.empty && querySnapshot.docs.length > 0) {
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
  const language = i18n?.resolvedLanguage || defaultLanguage

  let content = object?.metadata?.[language]?.[field]

  if (content === undefined) {
    content = object?.[field]
  }

  return content || ''
}

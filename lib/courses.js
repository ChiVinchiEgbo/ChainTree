import { db } from '../firebase/initFirebase.js'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { defaultCourse } from './course.js'

export async function getAllCourses() {
  try {
    const timeout = new Promise((resolve) => setTimeout(() => resolve([defaultCourse]), 2000))
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), orderBy('index'))
      const querySnapshot = await getDocs(q).catch((e) => {
        console.error('Firestore getAllCourses getDocs error:', e?.message || e)
        return { empty: true, docs: [] }
      })
      if (querySnapshot && !querySnapshot.empty && querySnapshot.docs.length > 0) {
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      }
      return [defaultCourse]
    }
    return await Promise.race([fetchCourses(), timeout])
  } catch (error) {
    console.error('Error fetching courses:', error)
    return [defaultCourse]
  }
}
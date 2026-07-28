import { db } from '../firebase/initFirebase.js'
import { collection, query, getDocs, addDoc } from 'firebase/firestore'

export async function getAllCohorts() {
  try {
    const q = query(collection(db, 'cohorts'))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        courseId: doc.data()?.course_id,
        startDate: new Date(doc.data().startDate?.toDate ? doc.data().startDate.toDate() : doc.data().startDate || Date.now()),
        endDate: new Date(doc.data().endDate?.toDate ? doc.data().endDate.toDate() : doc.data().endDate || Date.now()),
        kickoffStartTime: new Date(doc.data().kickoffStartTime?.toDate ? doc.data().kickoffStartTime.toDate() : doc.data().kickoffStartTime || Date.now()),
        kickoffEndTime: new Date(doc.data().kickoffEndTime?.toDate ? doc.data().kickoffEndTime.toDate() : doc.data().kickoffEndTime || Date.now()),
        name: doc.data().name,
      }
    })
  } catch (error) {
    console.error('Error fetching cohorts:', error)
    return []
  }
}

const userIsRegisteredInPreviousCohort = (user, cohorts, course) => {
  const userCohort = user?.cohorts?.find((userCohort) => userCohort?.course_id == course.id)
  return userCohort ? cohorts?.find((cohort) => cohort?.id === userCohort?.cohort_id) : null
}

export const getCurrentCohort = (user, cohorts, course, currentDate) => {
  const sortCohortsByDate = cohorts.sort((a, b) => {
    return new Date(a.endDate) - new Date(b.endDate)
  })
  return (
    userIsRegisteredInPreviousCohort(user, cohorts, course) ??
    sortCohortsByDate.find((cohort) => {
      return (
        cohort.courseId == course.id &&
        ((cohort.startDate <= new Date(currentDate) && cohort.endDate >= new Date(currentDate)) ||
          cohort.startDate >= new Date(currentDate))
      )
    })
  )
}

export async function createCohortInFirestore(cohortData) {
  await addDoc(collection(db, 'cohorts'), { ...cohortData })
}

import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Evaluation } from '@/lib/types';

const COLLECTION_NAME = 'evaluations';

export const saveEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...evaluation,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const getRecentEvaluations = async (count: number = 10) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Evaluation[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
};

import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseEnabled, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Evaluation } from '@/lib/types';

const COLLECTION_NAME = 'evaluations';

export const saveEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'timestamp'>) => {
  if (!isFirebaseEnabled) {
    // Offline Storage Fallback
    const id = 'local_' + Math.random().toString(36).substring(2, 11);
    const newEval: Evaluation = {
      ...evaluation,
      id,
      timestamp: new Date().toISOString()
    };
    const stored = localStorage.getItem(COLLECTION_NAME);
    const list = stored ? JSON.parse(stored) : [];
    list.push(newEval);
    localStorage.setItem(COLLECTION_NAME, JSON.stringify(list));
    return id;
  }

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
  if (!isFirebaseEnabled) {
    const stored = localStorage.getItem(COLLECTION_NAME);
    const list: Evaluation[] = stored ? JSON.parse(stored) : [];
    return list
      .sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime())
      .slice(0, count);
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      let ts = data.timestamp;
      if (ts && typeof ts.toDate === 'function') {
        ts = ts.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data,
        timestamp: ts
      };
    }) as Evaluation[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
};

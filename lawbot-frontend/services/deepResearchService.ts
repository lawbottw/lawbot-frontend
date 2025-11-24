import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeepResearchDocument } from "@/types/deepresearch";

/**
 * 建立 initial deep research document
 */
export async function createInitialDeepResearchDoc(
  deepResearchId: string,
  userId: string,
  searchQuery: string,
  websearch: boolean,
  projectId: string = ""
) {
  const deepResearchDocRef = doc(db, "deepResearch", deepResearchId);
  const initialDeepResearchData: DeepResearchDocument = {
    userId,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    initialQuery: searchQuery,
    status: 'planning',
    statusMessage: '規劃研究中...',
    plan: null,
    researchResult: null,
    websearch,
    projectId: projectId || ''
  };
  await setDoc(deepResearchDocRef, initialDeepResearchData);
}

/**
 * 更新 deep research document 狀態為 error
 */
export async function setDeepResearchDocError(
  deepResearchId: string,
  errorMessage: string
) {
  const deepResearchDocRef = doc(db, "deepResearch", deepResearchId);
  await setDoc(deepResearchDocRef, {
    status: 'error',
    statusMessage: errorMessage,
    lastUpdated: serverTimestamp()
  }, { merge: true });
}

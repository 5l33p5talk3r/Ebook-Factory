import { Project, Chapter } from '../types';

const DB_NAME = 'EbookForgeOffline';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export function initDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      
      // Store project documents
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      
      // Store chapter documents and fetched markdown content
      if (!db.objectStoreNames.contains('chapters')) {
        const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' });
        chapterStore.createIndex('projectId', 'projectId', { unique: false });
      }

      // Store pending sync actions for when we are back online
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: any) => {
      dbInstance = event.target.result;
      resolve(dbInstance!);
    };

    request.onerror = (event: any) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// --- Project Caching ---
export async function cacheProject(project: Project): Promise<void> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    if (!project.id) {
      resolve();
      return;
    }
    const transaction = db.transaction('projects', 'readwrite');
    const store = transaction.objectStore('projects');
    const request = store.put(project);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedProject(projectId: string): Promise<Project | null> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('projects', 'readonly');
    const store = transaction.objectStore('projects');
    const request = store.get(projectId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedProjects(): Promise<Project[]> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('projects', 'readonly');
    const store = transaction.objectStore('projects');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// --- Chapter Caching ---
export interface CachedChapter extends Chapter {
  projectId: string;
  localContent?: string; // Cache the full markdown content offline!
  isDirty?: boolean; // Modified locally while offline
}

export async function cacheChapter(projectId: string, chapter: Chapter, localContent?: string, isDirty: boolean = false): Promise<void> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    if (!chapter.id) {
      resolve();
      return;
    }
    const transaction = db.transaction('chapters', 'readwrite');
    const store = transaction.objectStore('chapters');
    
    // First read the existing cached chapter to preserve fields if they are missing
    const getRequest = store.get(chapter.id);
    
    getRequest.onsuccess = () => {
      const existing = getRequest.result || {};
      const updated: CachedChapter = {
        ...existing,
        ...chapter,
        projectId,
        isDirty: isDirty || existing.isDirty || false,
      };
      
      if (localContent !== undefined) {
        updated.localContent = localContent;
      }
      
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function getCachedChapter(chapterId: string): Promise<CachedChapter | null> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('chapters', 'readonly');
    const store = transaction.objectStore('chapters');
    const request = store.get(chapterId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedChaptersForProject(projectId: string): Promise<CachedChapter[]> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('chapters', 'readonly');
    const store = transaction.objectStore('chapters');
    const index = store.index('projectId');
    const request = index.getAll(projectId);

    request.onsuccess = () => {
      const results = request.result || [];
      // Sort them by index
      results.sort((a: CachedChapter, b: CachedChapter) => a.index - b.index);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

// --- Offline Queue Handling ---
export interface OfflineAction {
  id?: number;
  type: 'update-project' | 'save-chapter' | 'toggle-review' | 'save-draft';
  projectId: string;
  chapterId?: string;
  data: any;
  timestamp: number;
}

export async function queueOfflineAction(action: Omit<OfflineAction, 'timestamp'>): Promise<void> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const item: OfflineAction = {
      ...action,
      timestamp: Date.now(),
    };
    const request = store.add(item);

    request.onsuccess = () => {
      console.log('Queued offline action:', action.type);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingOfflineActions(): Promise<OfflineAction[]> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readonly');
    const store = transaction.objectStore('syncQueue');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function removeOfflineAction(id: number): Promise<void> {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('syncQueue', 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

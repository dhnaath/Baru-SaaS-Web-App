import { useState, useEffect } from "react";
import {
  KnowledgeBaseData,
  Article,
  Category,
  Source,
  ArticleRelation,
  ArticleRevision,
  Contributor,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";
import { filterExactSeedRecords, LEGACY_DYNAMIC_SEED_FIELDS } from "../../core/legacySeed";
import { LEGACY_KB_SEED_FINGERPRINTS } from "./legacySeedFingerprints";

const STORAGE_KEY = "aio_knowledge_base_data_v1";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-tech", name: "Keuangan & Valuasi", parentCategoryId: null, description: "Valuasi bisnis, analisis keuangan, dan pemodelan" },
  { id: "cat-dcf", name: "Valuasi Arus Kas (DCF)", parentCategoryId: "cat-tech", description: "Proyeksi arus kas, tingkat diskonto, dan nilai terminal" },
  { id: "cat-arch", name: "Sistem Terdistribusi", parentCategoryId: "cat-tech", description: "Konsistensi data, event sourcing, dan microservices" },
  { id: "cat-biz", name: "Operasional & Bisnis", parentCategoryId: null, description: "Proses operasional, kepatuhan, dan strategi" },
];

export const DEFAULT_ARTICLES: Article[] = [];

export const DEFAULT_SOURCES: Source[] = [];

export const DEFAULT_RELATIONS: ArticleRelation[] = [];

export const DEFAULT_REVISIONS: ArticleRevision[] = [];

export const DEFAULT_CONTRIBUTORS: Contributor[] = [];

export const INITIAL_DATA: KnowledgeBaseData = {
  articles: DEFAULT_ARTICLES,
  categories: DEFAULT_CATEGORIES,
  sources: DEFAULT_SOURCES,
  relations: DEFAULT_RELATIONS,
  revisions: DEFAULT_REVISIONS,
  contributors: DEFAULT_CONTRIBUTORS,
  reviewReminderIntervalDays: 180,
};

function loadKBData(): KnowledgeBaseData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      articles: Array.isArray(parsed.articles)
        ? filterExactSeedRecords(parsed.articles, LEGACY_KB_SEED_FINGERPRINTS.articles, LEGACY_DYNAMIC_SEED_FIELDS)
        : INITIAL_DATA.articles,
      categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_DATA.categories,
      sources: Array.isArray(parsed.sources)
        ? filterExactSeedRecords(parsed.sources, LEGACY_KB_SEED_FINGERPRINTS.sources, LEGACY_DYNAMIC_SEED_FIELDS)
        : INITIAL_DATA.sources,
      relations: Array.isArray(parsed.relations)
        ? filterExactSeedRecords(parsed.relations, LEGACY_KB_SEED_FINGERPRINTS.relations)
        : INITIAL_DATA.relations,
      revisions: Array.isArray(parsed.revisions)
        ? filterExactSeedRecords(parsed.revisions, LEGACY_KB_SEED_FINGERPRINTS.revisions, LEGACY_DYNAMIC_SEED_FIELDS)
        : INITIAL_DATA.revisions,
      contributors: Array.isArray(parsed.contributors)
        ? filterExactSeedRecords(parsed.contributors, LEGACY_KB_SEED_FINGERPRINTS.contributors, LEGACY_DYNAMIC_SEED_FIELDS)
        : INITIAL_DATA.contributors,
    };
  } catch (e) {
    console.error("Failed to load Knowledge Base data:", e);
    return INITIAL_DATA;
  }
}

function saveKBData(data: KnowledgeBaseData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Knowledge Base data:", e);
  }
}

export function useKnowledgeBaseStore() {
  const [data, setData] = useState<KnowledgeBaseData>(loadKBData);

  useEffect(() => {
    saveKBData(data);
  }, [data]);

  const addArticle = (article: Omit<Article, "id" | "createdAt" | "updatedAt">): Article => {
    const now = new Date().toISOString();
    const newArt: Article = {
      ...article,
      id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      lastReviewedAt: now,
    };

    const initialRevision: ArticleRevision = {
      id: `rev-${Date.now()}`,
      articleId: newArt.id,
      content: newArt.content,
      editedBy: "Current User",
      editedAt: now,
      changeSummary: "Dibuat pertama kali",
    };

    const initialContributor: Contributor = {
      articleId: newArt.id,
      userId: "current-user",
      role: "author",
      contributedAt: now,
    };

    setData((prev) => ({
      ...prev,
      articles: [newArt, ...prev.articles],
      revisions: [initialRevision, ...prev.revisions],
      contributors: [initialContributor, ...prev.contributors],
    }));

    return newArt;
  };

  const updateArticle = (
    id: string,
    updates: Partial<Omit<Article, "id" | "createdAt">>,
    changeSummary?: string
  ) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const existing = prev.articles.find((a) => a.id === id);
      if (!existing) return prev;

      const updatedArticle: Article = {
        ...existing,
        ...updates,
        updatedAt: now,
      };

      const newRevisions = [...prev.revisions];
      if (updates.content && updates.content !== existing.content) {
        newRevisions.unshift({
          id: `rev-${Date.now()}`,
          articleId: id,
          content: updates.content,
          editedBy: "Current User",
          editedAt: now,
          changeSummary: changeSummary || "Pembaruan konten artikel",
        });
      }

      return {
        ...prev,
        articles: prev.articles.map((a) => (a.id === id ? updatedArticle : a)),
        revisions: newRevisions,
      };
    });
  };

  const deleteArticle = (id: string) => {
    setData((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
      sources: prev.sources.filter((s) => s.articleId !== id),
      relations: prev.relations.filter((r) => r.fromArticleId !== id && r.toArticleId !== id),
      revisions: prev.revisions.filter((r) => r.articleId !== id),
      contributors: prev.contributors.filter((c) => c.articleId !== id),
    }));
  };

  const duplicateArticle = (id: string) => {
    const sourceArt = data.articles.find((a) => a.id === id);
    if (!sourceArt) return;
    addArticle({
      title: `${sourceArt.title} (Salinan)`,
      content: sourceArt.content,
      summary: sourceArt.summary,
      categoryId: sourceArt.categoryId,
      tags: [...sourceArt.tags],
      reviewStatus: "draft",
    });
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
    return newCat;
  };

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      articles: prev.articles.map((a) => (a.categoryId === id ? { ...a, categoryId: null } : a)),
    }));
  };

  const addSource = (source: Omit<Source, "id" | "addedAt">) => {
    const newSrc: Source = {
      ...source,
      id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      addedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      sources: [...prev.sources, newSrc],
    }));
    return newSrc;
  };

  const deleteSource = (id: string) => {
    setData((prev) => ({
      ...prev,
      sources: prev.sources.filter((s) => s.id !== id),
    }));
  };

  const addRelation = (relation: Omit<ArticleRelation, "id">) => {
    const newRel: ArticleRelation = {
      ...relation,
      id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRel],
    }));
    return newRel;
  };

  const deleteRelation = (id: string) => {
    setData((prev) => ({
      ...prev,
      relations: prev.relations.filter((r) => r.id !== id),
    }));
  };

  const markOutdated = (id: string) => {
    updateArticle(id, { reviewStatus: "outdated" }, "Ditandai perlu ditinjau ulang (outdated)");
  };

  const verifyArticle = (id: string) => {
    const now = new Date().toISOString();
    updateArticle(
      id,
      { reviewStatus: "verified", lastReviewedAt: now },
      "Divalidasi kebenarannya & sumber telah diverifikasi"
    );
  };

  const promoteFromNote = (noteId: string, noteTitle: string, noteContent: string) => {
    return addArticle({
      title: noteTitle,
      content: noteContent,
      summary: `Dipromosikan dari Catatan #${noteId}`,
      tags: ["From-Notes"],
      reviewStatus: "draft",
    });
  };

  const isNeedsReview = (article: Article) => {
    if (article.reviewStatus === "outdated") return true;
    if (!article.lastReviewedAt) return true;
    const diffDays =
      (Date.now() - new Date(article.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > data.reviewReminderIntervalDays;
  };

  return {
    data,
    articles: data.articles,
    categories: data.categories,
    sources: data.sources,
    relations: data.relations,
    revisions: data.revisions,
    contributors: data.contributors,
    addArticle,
    updateArticle,
    deleteArticle,
    duplicateArticle,
    addCategory,
    deleteCategory,
    addSource,
    deleteSource,
    addRelation,
    deleteRelation,
    markOutdated,
    verifyArticle,
    promoteFromNote,
    isNeedsReview,
  };
}

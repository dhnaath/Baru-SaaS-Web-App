import { useState, useEffect } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import { filterExactSeedRecords, getRecordFingerprint, LEGACY_DYNAMIC_SEED_FIELDS } from "../../core/legacySeed";
import { LEGACY_WIKI_SEED_FINGERPRINTS } from "./legacySeedFingerprints";
import {
  WikiData,
  WikiSpace,
  WikiPage,
  WikiLink,
  WikiRevision,
  WikiTemplate,
} from "./types";

const STORAGE_KEY = "aio_wiki_data_v1";

const DEFAULT_SPACES: WikiSpace[] = [
  { id: "spc-eng", name: "Engineering & Architecture", description: "Dokumentasi teknis, pipeline, dan SOP infrastruktur", visibility: "team" },
  { id: "spc-prod", name: "Product & Operations", description: "Roadmap, desain fungsional, dan panduan pengguna", visibility: "team" },
];

export const DEFAULT_PAGES: WikiPage[] = [];

const DEFAULT_TEMPLATES: WikiTemplate[] = [
  {
    id: "tmpl-runbook",
    name: "Runbook / Incident Response",
    contentStructure: `# [Nama Service] Incident Runbook\n\n## 1. Gejala & Alert Trigger\n- Alert Name:\n- Ambang Batas:\n\n## 2. Langkah Penanganan Cepat (Mitigasi)\n1. Langkah 1\n2. Langkah 2\n\n## 3. Investigasi Akar Masalah\n- Log Query:\n- Metrik Grafana:\n\n## 4. Eskalasi & Rujukan\nTautkan ke [[Team On-Call Directory]].`,
    spaceId: null,
  },
  {
    id: "tmpl-adr",
    name: "Architecture Decision Record (ADR)",
    contentStructure: `# ADR: [Judul Keputusan]\n\n## Status\nProposed | Accepted | Superseded\n\n## Konteks & Permasalahan\nJelaskan latar belakang teknis...\n\n## Opsi yang Dipertimbangkan\n1. Opsi A\n2. Opsi B\n\n## Keputusan & Konsekuensi\nOpsi yang dipilih dan dampaknya terhadap arsitektur.`,
    spaceId: null,
  },
];

// Helper to extract wikilinks from text [[Title]]
export function extractWikiLinks(content: string): string[] {
  const matches = content.match(/\[\[(.*?)\]\]/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(2, -2).trim()).filter(Boolean)));
}

// Compute links table from all pages
function computeLinks(pages: WikiPage[]): WikiLink[] {
  const links: WikiLink[] = [];
  pages.forEach((page) => {
    const titles = extractWikiLinks(page.content);
    titles.forEach((targetTitle, idx) => {
      const targetPage = pages.find(
        (p) => p.title.toLowerCase() === targetTitle.toLowerCase()
      );
      links.push({
        id: `lnk-${page.id}-${idx}`,
        fromPageId: page.id,
        toPageId: targetPage ? targetPage.id : null,
        toPageTitle: targetTitle,
        isBroken: false,
      });
    });
  });
  return links;
}

export const INITIAL_DATA: WikiData = {
  spaces: DEFAULT_SPACES,
  pages: DEFAULT_PAGES,
  links: computeLinks(DEFAULT_PAGES),
  revisions: [],
  contributors: [],
  templates: DEFAULT_TEMPLATES,
};

function loadData(): WikiData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw) as Partial<WikiData>;
    const pages = Array.isArray(parsed.pages)
      ? filterExactSeedRecords<WikiPage>(parsed.pages, LEGACY_WIKI_SEED_FINGERPRINTS.pages, LEGACY_DYNAMIC_SEED_FIELDS)
      : INITIAL_DATA.pages;
    return {
      ...INITIAL_DATA,
      ...parsed,
      spaces: Array.isArray(parsed.spaces) ? parsed.spaces : INITIAL_DATA.spaces,
      pages,
      links: computeLinks(pages),
      revisions: Array.isArray(parsed.revisions)
        ? filterExactSeedRecords<WikiRevision>(parsed.revisions, LEGACY_WIKI_SEED_FINGERPRINTS.revisions, LEGACY_DYNAMIC_SEED_FIELDS)
        : INITIAL_DATA.revisions,
      // Contributors have a composite pageId/userId identity rather than an `id` field;
      // compare the complete record fingerprint so only the exact legacy entry is retired.
      contributors: Array.isArray(parsed.contributors)
        ? parsed.contributors.filter((contributor) =>
            !Object.values(LEGACY_WIKI_SEED_FINGERPRINTS.contributors).includes(
              getRecordFingerprint(contributor, LEGACY_DYNAMIC_SEED_FIELDS),
            ),
          )
        : INITIAL_DATA.contributors,
      templates: Array.isArray(parsed.templates) ? parsed.templates : INITIAL_DATA.templates,
    };
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: WikiData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Wiki data:", e);
  }
}

export function useWikiStore() {
  const [data, setData] = useState<WikiData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addPage = (page: Omit<WikiPage, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newPage: WikiPage = {
      ...page,
      id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    const newPages = [newPage, ...data.pages];
    const newLinks = computeLinks(newPages);

    const initialRevision: WikiRevision = {
      id: `rev-${Date.now()}`,
      pageId: newPage.id,
      content: newPage.content,
      editedBy: "Current User",
      editedAt: now,
      changeSummary: "Pembuatan halaman baru",
    };

    setData((prev) => ({
      ...prev,
      pages: newPages,
      links: newLinks,
      revisions: [initialRevision, ...prev.revisions],
    }));

    return newPage;
  };

  const updatePage = (
    id: string,
    updates: Partial<Omit<WikiPage, "id" | "createdAt">>,
    changeSummary?: string
  ) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const existing = prev.pages.find((p) => p.id === id);
      if (!existing) return prev;

      let newPages = prev.pages.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates, updatedAt: now };
        }
        // Business Rule: Rename Page updates all inbound wikilinks!
        if (updates.title && updates.title !== existing.title) {
          const oldLinkRegex = new RegExp(`\\[\\[${existing.title}\\]\\]`, "g");
          const replacedContent = p.content.replace(oldLinkRegex, `[[${updates.title}]]`);
          if (replacedContent !== p.content) {
            return { ...p, content: replacedContent, updatedAt: now };
          }
        }
        return p;
      });

      const newLinks = computeLinks(newPages);
      const newRevs = [...prev.revisions];
      if (updates.content && updates.content !== existing.content) {
        newRevs.unshift({
          id: `rev-${Date.now()}`,
          pageId: id,
          content: updates.content,
          editedBy: "Current User",
          editedAt: now,
          changeSummary: changeSummary || "Pembaruan isi halaman",
        });
      }

      return {
        ...prev,
        pages: newPages,
        links: newLinks,
        revisions: newRevs,
      };
    });
  };

  const deletePage = (id: string) => {
    setData((prev) => {
      const deletedPage = prev.pages.find((p) => p.id === id);
      const remainingPages = prev.pages.filter((p) => p.id !== id);

      // Business Rule (§3.3): Links to deleted page become broken
      const updatedLinks = computeLinks(remainingPages).map((l) => {
        if (deletedPage && l.toPageTitle.toLowerCase() === deletedPage.title.toLowerCase()) {
          return { ...l, isBroken: true };
        }
        return l;
      });

      return {
        ...prev,
        pages: remainingPages,
        links: updatedLinks,
        revisions: prev.revisions.filter((r) => r.pageId !== id),
        contributors: prev.contributors.filter((c) => c.pageId !== id),
      };
    });
  };

  const addSpace = (space: Omit<WikiSpace, "id">) => {
    const newSpace: WikiSpace = {
      ...space,
      id: `spc-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      spaces: [...prev.spaces, newSpace],
    }));
    return newSpace;
  };

  // Get automatic Backlinks for a page (§4)
  const getBacklinks = (pageId: string) => {
    const page = data.pages.find((p) => p.id === pageId);
    if (!page) return [];
    return data.links.filter(
      (l) =>
        l.toPageId === pageId ||
        l.toPageTitle.toLowerCase() === page.title.toLowerCase()
    );
  };

  return {
    data,
    spaces: data.spaces,
    pages: data.pages,
    links: data.links,
    revisions: data.revisions,
    contributors: data.contributors,
    templates: data.templates,
    addPage,
    updatePage,
    deletePage,
    addSpace,
    getBacklinks,
  };
}

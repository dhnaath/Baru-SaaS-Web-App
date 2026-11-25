import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  Project,
  Phase,
  Milestone,
  Member,
  Objective,
  Risk,
  ProjectActivity,
  ProjectStatus,
  ProjectTemplate,
  PhaseStatus,
  MilestoneStatus,
  MemberRole,
} from "./types";
import { Task, TaskStatus, TaskPriority } from "../task-manager/types";
import { filterExactSeedRecords, LEGACY_DYNAMIC_SEED_FIELDS } from "../../core/legacySeed";
import { LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS } from "./legacySeedFingerprints";
import { LEGACY_TASK_MANAGER_SEED_FINGERPRINTS } from "../task-manager/legacySeedFingerprints";

const PROJECT_STORAGE_KEY = "aio_project_manager_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";

interface ProjectManagerState {
  projects: Project[];
  phases: Phase[];
  milestones: Milestone[];
  members: Member[];
  risks: Risk[];
  objectives: Objective[];
  activities: ProjectActivity[];
}

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_PHASES: Phase[] = [];

export const DEFAULT_MILESTONES: Milestone[] = [];

export const DEFAULT_MEMBERS: Member[] = [];

export const DEFAULT_RISKS: Risk[] = [];

export const DEFAULT_OBJECTIVES: Objective[] = [];

export const DEFAULT_ACTIVITIES: ProjectActivity[] = [];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "tmpl-product-launch",
    name: "Product Launch (Peluncuran Produk X)",
    description: "Alur standar peluncuran produk: Research, Design, Development, Testing, hingga Go-live.",
    category: "Product & Technology",
    phases: [
      {
        name: "Phase 1: Research",
        order: 1,
        relativeStartDays: 0,
        relativeDueDays: 14,
        tasks: [
          { title: "Market analysis & target audience segmentation", priority: "high", relativeDueDays: 7 },
          { title: "Competitor research & pricing benchmarking", priority: "medium", relativeDueDays: 14 },
        ],
        milestones: [
          { title: "Research Findings Approved", relativeDueDays: 14 },
        ],
      },
      {
        name: "Phase 2: Design",
        order: 2,
        relativeStartDays: 15,
        relativeDueDays: 30,
        tasks: [
          { title: "Wireframing & user flow validation", priority: "high", relativeDueDays: 22 },
          { title: "High-fidelity prototype & stakeholder review", priority: "high", relativeDueDays: 30 },
        ],
        milestones: [
          { title: "Design Sign-off", relativeDueDays: 30 },
        ],
      },
      {
        name: "Phase 3: Development",
        order: 3,
        relativeStartDays: 31,
        relativeDueDays: 60,
        tasks: [
          { title: "Core backend architecture & schema setup", priority: "urgent", relativeDueDays: 45 },
          { title: "Frontend interface build & integration", priority: "high", relativeDueDays: 60 },
        ],
        milestones: [
          { title: "Alpha Build Ready", relativeDueDays: 60 },
        ],
      },
      {
        name: "Phase 4: Testing",
        order: 4,
        relativeStartDays: 61,
        relativeDueDays: 75,
        tasks: [
          { title: "UAT (User Acceptance Testing) with beta users", priority: "urgent", relativeDueDays: 70 },
          { title: "Bug fixing & security audit", priority: "high", relativeDueDays: 75 },
        ],
        milestones: [
          { title: "Release Candidate Certified", relativeDueDays: 75 },
        ],
      },
      {
        name: "Phase 5: Launch",
        order: 5,
        relativeStartDays: 76,
        relativeDueDays: 90,
        tasks: [
          { title: "Go-live checklist & deployment verification", priority: "urgent", relativeDueDays: 80 },
          { title: "Public announcement & PR release", priority: "medium", relativeDueDays: 85 },
        ],
        milestones: [
          { title: "Official Launch Completed", relativeDueDays: 90 },
        ],
      },
    ],
  },
  {
    id: "tmpl-management-audit",
    name: "Audit Manajemen & Kepatuhan Tata Kelola",
    description: "Struktur pemeriksaan menyeluruh kepatuhan operasional, finansial, dan audit hukum.",
    category: "Consulting & Audit",
    phases: [
      {
        name: "Tahap 1: Persiapan & Scoping Dokumen",
        order: 1,
        relativeStartDays: 0,
        relativeDueDays: 10,
        tasks: [
          { title: "Surat tugas & pengumpulan dokumen induk", priority: "high", relativeDueDays: 5 },
          { title: "In-depth interview dewan pimpinan", priority: "medium", relativeDueDays: 10 },
        ],
        milestones: [{ title: "Ruang Lingkup Disepakati", relativeDueDays: 10 }],
      },
      {
        name: "Tahap 2: Pengujian Lapangan & Sampel",
        order: 2,
        relativeStartDays: 11,
        relativeDueDays: 25,
        tasks: [
          { title: "Uji sampling transaksi finansial", priority: "urgent", relativeDueDays: 18 },
          { title: "Pemeriksaan klausul kontrak kerja sama", priority: "high", relativeDueDays: 25 },
        ],
        milestones: [{ title: "Temuan Awal Selesai", relativeDueDays: 25 }],
      },
      {
        name: "Tahap 3: Pelaporan & Exit Meeting",
        order: 3,
        relativeStartDays: 26,
        relativeDueDays: 40,
        tasks: [
          { title: "Penyusunan Executive Summary Opini Audit", priority: "high", relativeDueDays: 35 },
          { title: "Exit conference bersama komisaris", priority: "urgent", relativeDueDays: 40 },
        ],
        milestones: [{ title: "Laporan Final Diserahkan", relativeDueDays: 40 }],
      },
    ],
  },
];

export function useProjectManager() {
  const [state, setState] = useState<ProjectManagerState>(() => {
    try {
      const saved = getRaw(PROJECT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ProjectManagerState>;
        return {
          projects: filterExactSeedRecords(Array.isArray(parsed.projects) ? parsed.projects : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.projects, LEGACY_DYNAMIC_SEED_FIELDS),
          phases: filterExactSeedRecords(Array.isArray(parsed.phases) ? parsed.phases : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.phases, LEGACY_DYNAMIC_SEED_FIELDS),
          milestones: filterExactSeedRecords(Array.isArray(parsed.milestones) ? parsed.milestones : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.milestones, LEGACY_DYNAMIC_SEED_FIELDS),
          members: filterExactSeedRecords(Array.isArray(parsed.members) ? parsed.members : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.members, LEGACY_DYNAMIC_SEED_FIELDS),
          risks: filterExactSeedRecords(Array.isArray(parsed.risks) ? parsed.risks : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.risks),
          objectives: filterExactSeedRecords(Array.isArray(parsed.objectives) ? parsed.objectives : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.objectives),
          activities: filterExactSeedRecords(Array.isArray(parsed.activities) ? parsed.activities : [], LEGACY_PROJECT_MANAGER_SEED_FINGERPRINTS.activities, LEGACY_DYNAMIC_SEED_FIELDS),
        };
      }
    } catch (e) {
      console.error("Failed to load project manager state", e);
    }
    return {
      projects: DEFAULT_PROJECTS,
      phases: DEFAULT_PHASES,
      milestones: DEFAULT_MILESTONES,
      members: DEFAULT_MEMBERS,
      risks: DEFAULT_RISKS,
      objectives: DEFAULT_OBJECTIVES,
      activities: DEFAULT_ACTIVITIES,
    };
  });

  // Track Task Manager state directly from localStorage so Task Manager is the single source of truth for tasks!
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = getRaw(TASK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return filterExactSeedRecords(
          Array.isArray(parsed.tasks) ? parsed.tasks : [],
          LEGACY_TASK_MANAGER_SEED_FINGERPRINTS.tasks,
          LEGACY_DYNAMIC_SEED_FIELDS,
        );
      }
    } catch (e) {
      console.error("Failed to load tasks for project manager", e);
    }
    return [];
  });

  // Save project manager state
  useEffect(() => {
    try {
      setRaw(PROJECT_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist project manager state", e);
    }
  }, [state]);

  // Synchronize with storage updates from Task Manager or other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = getRaw(TASK_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.tasks)) {
            setTasks(
              filterExactSeedRecords(
                parsed.tasks,
                LEGACY_TASK_MANAGER_SEED_FINGERPRINTS.tasks,
                LEGACY_DYNAMIC_SEED_FIELDS,
              ),
            );
          }
        }
      } catch (e) {
        console.error("Error reading task storage", e);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("aio_data_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("aio_data_updated", handleStorageChange);
    };
  }, []);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // Compute progress for a specific project
  // project.progress = COUNT(task WHERE projectId = X AND status = 'completed') / COUNT(task WHERE projectId = X AND status NOT IN ('cancelled','archived'))
  const calculateProjectProgress = useCallback(
    (projectId: string): { progressPercent: number; totalTasks: number; completedTasks: number; overdueTasks: number; activeTasks: number } => {
      const projectTasks = tasks.filter((t) => t.projectId === projectId);
      const validTasks = projectTasks.filter((t) => t.status !== "cancelled" && t.status !== "archived");
      const completedTasks = validTasks.filter((t) => t.status === "completed").length;
      const totalTasks = validTasks.length;

      const now = new Date();
      const overdueTasks = validTasks.filter((t) => {
        if (t.status === "completed") return false;
        if (!t.dueAt) return false;
        return new Date(t.dueAt) < now;
      }).length;

      if (totalTasks > 0) {
        const percent = Math.round((completedTasks / totalTasks) * 100);
        return {
          progressPercent: percent,
          totalTasks,
          completedTasks,
          overdueTasks,
          activeTasks: totalTasks - completedTasks,
        };
      }

      // If project has no tasks, fallback to milestone-based progress (§9.1)
      // project.progress = COUNT(milestone WHERE status = 'achieved') / COUNT(milestone)
      const projectMilestones = state.milestones.filter((m) => m.projectId === projectId);
      if (projectMilestones.length > 0) {
        const achieved = projectMilestones.filter((m) => m.status === "achieved").length;
        const percent = Math.round((achieved / projectMilestones.length) * 100);
        return {
          progressPercent: percent,
          totalTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
          activeTasks: 0,
        };
      }

      return {
        progressPercent: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        activeTasks: 0,
      };
    },
    [tasks, state.milestones]
  );

  // Check auto-achievement of milestones based on linkedTaskIds
  useEffect(() => {
    let hasUpdates = false;
    const updatedMilestones = state.milestones.map((m) => {
      if (m.status !== "achieved" && m.linkedTaskIds && m.linkedTaskIds.length > 0) {
        const allCompleted = m.linkedTaskIds.every((tId) => {
          const t = tasks.find((item) => item.id === tId);
          return t && t.status === "completed";
        });
        if (allCompleted) {
          hasUpdates = true;
          return { ...m, status: "achieved" as MilestoneStatus };
        }
      }
      return m;
    });

    if (hasUpdates) {
      setState((prev) => ({ ...prev, milestones: updatedMilestones }));
    }
  }, [tasks, state.milestones]);

  // Log activity
  const logActivity = useCallback(
    (projectId: string, type: string, fieldChanged?: string, oldValue?: string, newValue?: string) => {
      const newAct: ProjectActivity = {
        id: "act-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        projectId,
        type,
        fieldChanged,
        oldValue,
        newValue,
        userName: "Konsultan",
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        activities: [newAct, ...prev.activities].slice(0, 100),
      }));
    },
    []
  );

  // PROJECT ACTIONS (§3.2)
  const createProject = useCallback(
    (data: {
      name: string;
      description?: string;
      status?: ProjectStatus;
      startAt?: string;
      dueAt?: string;
      tags?: string[];
      budgetSummary?: { allocated: number; spent: number; currency: string };
      folderId?: string;
    }) => {
      const newProject: Project = {
        id: "p-" + Date.now().toString(36),
        name: data.name.trim(),
        description: data.description?.trim(),
        status: data.status || "planning",
        startAt: data.startAt,
        dueAt: data.dueAt,
        tags: data.tags || [],
        budgetSummary: data.budgetSummary || { allocated: 0, spent: 0, currency: "IDR" },
        folderId: data.folderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
      }));

      logActivity(newProject.id, "project_created", "name", undefined, newProject.name);
      notifyChange();
      return newProject;
    },
    [logActivity, notifyChange]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      setState((prev) => {
        const existing = prev.projects.find((p) => p.id === id);
        if (!existing) return prev;

        const updated = prev.projects.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        );

        return { ...prev, projects: updated };
      });
      notifyChange();
    },
    [notifyChange]
  );

  // State Machine transitions (§6)
  const transitionProjectStatus = useCallback(
    (projectId: string, nextStatus: ProjectStatus) => {
      setState((prev) => {
        const project = prev.projects.find((p) => p.id === projectId);
        if (!project) return prev;

        const currentStatus = project.status;

        // Valid transition checks from §6:
        // Planning -> Active, Cancelled, Archived
        // Active -> On Hold, Completed, Cancelled
        // On Hold -> Active, Cancelled
        // Completed -> Archived, Reopened (-> Active)
        // Cancelled -> Archived, Reopened (-> Planning)
        // Archived -> Restore (-> status sebelumnya)

        const updates: Partial<Project> = {
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };

        if (nextStatus === "completed") {
          updates.completedAt = new Date().toISOString();
        } else if (nextStatus === "archived") {
          updates.archivedAt = new Date().toISOString();
        } else if (currentStatus === "completed" && nextStatus === "active") {
          updates.completedAt = undefined;
        }

        const updatedProjects = prev.projects.map((p) =>
          p.id === projectId ? { ...p, ...updates } : p
        );

        return {
          ...prev,
          projects: updatedProjects,
        };
      });

      logActivity(projectId, "status_changed", "status", undefined, nextStatus);
      notifyChange();
    },
    [logActivity, notifyChange]
  );

  // Duplicate Project (§3.2)
  const duplicateProject = useCallback(
    (projectId: string) => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) return;

      const newProjectId = "p-" + Date.now().toString(36);
      const duplicatedProject: Project = {
        ...project,
        id: newProjectId,
        name: `${project.name} (Salinan)`,
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: undefined,
        archivedAt: undefined,
      };

      // Copy phases
      const relatedPhases = state.phases.filter((ph) => ph.projectId === projectId);
      const phaseIdMap = new Map<string, string>();
      const newPhases = relatedPhases.map((ph) => {
        const newPhId = "ph-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5);
        phaseIdMap.set(ph.id, newPhId);
        return {
          ...ph,
          id: newPhId,
          projectId: newProjectId,
          status: "upcoming" as PhaseStatus,
        };
      });

      // Copy milestones
      const relatedMilestones = state.milestones.filter((m) => m.projectId === projectId);
      const newMilestones = relatedMilestones.map((m) => ({
        ...m,
        id: "ms-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        projectId: newProjectId,
        phaseId: m.phaseId ? phaseIdMap.get(m.phaseId) : undefined,
        status: "upcoming" as MilestoneStatus,
        linkedTaskIds: [],
      }));

      // Copy members
      const relatedMembers = state.members.filter((mem) => mem.projectId === projectId);
      const newMembers = relatedMembers.map((mem) => ({
        ...mem,
        id: "m-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        projectId: newProjectId,
        joinedAt: new Date().toISOString(),
      }));

      setState((prev) => ({
        ...prev,
        projects: [duplicatedProject, ...prev.projects],
        phases: [...prev.phases, ...newPhases],
        milestones: [...prev.milestones, ...newMilestones],
        members: [...prev.members, ...newMembers],
      }));

      logActivity(newProjectId, "project_duplicated", undefined, undefined, duplicatedProject.name);
      notifyChange();
    },
    [state, logActivity, notifyChange]
  );

  // Delete Project (§3.2 & §3.3)
  // Menghapus Project tidak menghapus Task di dalamnya secara default — Task menjadi tanpa projectId (independen) kecuali pengguna memilih “hapus beserta task”.
  const deleteProject = useCallback(
    (projectId: string, deleteAssociatedTasks: boolean = false) => {
      // 1. Handle tasks in Task Manager
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.tasks) {
            let updatedTasks: Task[];
            if (deleteAssociatedTasks) {
              updatedTasks = parsed.tasks.filter((t: Task) => t.projectId !== projectId);
            } else {
              // Detach projectId
              updatedTasks = parsed.tasks.map((t: Task) =>
                t.projectId === projectId ? { ...t, projectId: undefined, phaseId: undefined } : t
              );
            }
            parsed.tasks = updatedTasks;
            setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
            setTasks(updatedTasks);
          }
        }
      } catch (e) {
        console.error("Failed to update tasks on project deletion", e);
      }

      // 2. Remove project objects
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
        phases: prev.phases.filter((ph) => ph.projectId !== projectId),
        milestones: prev.milestones.filter((m) => m.projectId !== projectId),
        members: prev.members.filter((mem) => mem.projectId !== projectId),
        risks: prev.risks.filter((r) => r.projectId !== projectId),
        objectives: prev.objectives.filter((o) => o.projectId !== projectId),
        activities: prev.activities.filter((a) => a.projectId !== projectId),
      }));

      notifyChange();
    },
    [notifyChange]
  );

  // PHASE ACTIONS (§4)
  const addPhase = useCallback(
    (data: { projectId: string; name: string; order?: number; startAt?: string; dueAt?: string; status?: PhaseStatus }) => {
      const existingPhases = state.phases.filter((ph) => ph.projectId === data.projectId);
      const nextOrder = data.order || existingPhases.length + 1;

      const newPhase: Phase = {
        id: "ph-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        projectId: data.projectId,
        name: data.name.trim(),
        order: nextOrder,
        startAt: data.startAt,
        dueAt: data.dueAt,
        status: data.status || "upcoming",
      };

      setState((prev) => ({
        ...prev,
        phases: [...prev.phases, newPhase],
      }));

      logActivity(data.projectId, "phase_added", "phase", undefined, newPhase.name);
      notifyChange();
      return newPhase;
    },
    [state.phases, logActivity, notifyChange]
  );

  const updatePhase = useCallback((phaseId: string, updates: Partial<Phase>) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, ...updates } : ph)),
    }));
    notifyChange();
  }, [notifyChange]);

  const deletePhase = useCallback((phaseId: string) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.filter((ph) => ph.id !== phaseId),
      // Clean up phaseId from milestones
      milestones: prev.milestones.map((m) => (m.phaseId === phaseId ? { ...m, phaseId: undefined } : m)),
    }));
    notifyChange();
  }, [notifyChange]);

  // MILESTONE ACTIONS (§7)
  const addMilestone = useCallback(
    (data: {
      projectId: string;
      phaseId?: string;
      title: string;
      targetDate: string;
      status?: MilestoneStatus;
      linkedTaskIds?: string[];
    }) => {
      const newMilestone: Milestone = {
        id: "ms-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        projectId: data.projectId,
        phaseId: data.phaseId,
        title: data.title.trim(),
        targetDate: data.targetDate,
        status: data.status || "upcoming",
        linkedTaskIds: data.linkedTaskIds || [],
      };

      setState((prev) => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone],
      }));

      logActivity(data.projectId, "milestone_added", "milestone", undefined, newMilestone.title);
      notifyChange();
      return newMilestone;
    },
    [logActivity, notifyChange]
  );

  const updateMilestone = useCallback((milestoneId: string, updates: Partial<Milestone>) => {
    setState((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === milestoneId ? { ...m, ...updates } : m)),
    }));
    notifyChange();
  }, [notifyChange]);

  const deleteMilestone = useCallback((milestoneId: string) => {
    setState((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== milestoneId),
    }));
    notifyChange();
  }, [notifyChange]);

  // RISK ACTIONS (§8)
  const addRisk = useCallback(
    (data: {
      projectId: string;
      title: string;
      description: string;
      likelihood: Risk["likelihood"];
      impact: Risk["impact"];
      status?: Risk["status"];
      mitigationPlan?: string;
      ownerName?: string;
    }) => {
      const newRisk: Risk = {
        id: "r-" + Date.now().toString(36),
        projectId: data.projectId,
        title: data.title.trim(),
        description: data.description.trim(),
        likelihood: data.likelihood,
        impact: data.impact,
        status: data.status || "identified",
        mitigationPlan: data.mitigationPlan,
        ownerName: data.ownerName,
      };

      setState((prev) => ({
        ...prev,
        risks: [...prev.risks, newRisk],
      }));

      logActivity(data.projectId, "risk_added", "risk", undefined, newRisk.title);
      notifyChange();
      return newRisk;
    },
    [logActivity, notifyChange]
  );

  const updateRisk = useCallback((riskId: string, updates: Partial<Risk>) => {
    setState((prev) => ({
      ...prev,
      risks: prev.risks.map((r) => (r.id === riskId ? { ...r, ...updates } : r)),
    }));
    notifyChange();
  }, [notifyChange]);

  const deleteRisk = useCallback((riskId: string) => {
    setState((prev) => ({
      ...prev,
      risks: prev.risks.filter((r) => r.id !== riskId),
    }));
    notifyChange();
  }, [notifyChange]);

  // MEMBER ACTIONS (§5)
  const addMember = useCallback(
    (data: { projectId: string; userId?: string; name: string; email?: string; role: MemberRole }) => {
      const newMember: Member = {
        id: "mem-" + Date.now().toString(36),
        projectId: data.projectId,
        userId: data.userId || "u-" + Math.random().toString(36).substring(2, 6),
        name: data.name.trim(),
        email: data.email?.trim(),
        role: data.role,
        joinedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        members: [...prev.members, newMember],
      }));

      logActivity(data.projectId, "member_added", "member", undefined, newMember.name);
      notifyChange();
      return newMember;
    },
    [logActivity, notifyChange]
  );

  const updateMemberRole = useCallback((memberId: string, role: MemberRole) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
    notifyChange();
  }, [notifyChange]);

  const removeMember = useCallback((memberId: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    notifyChange();
  }, [notifyChange]);

  // OBJECTIVE ACTIONS
  const addObjective = useCallback(
    (data: { projectId: string; description: string; targetMetric?: string }) => {
      const newObj: Objective = {
        id: "obj-" + Date.now().toString(36),
        projectId: data.projectId,
        description: data.description.trim(),
        targetMetric: data.targetMetric?.trim(),
      };
      setState((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObj],
      }));
      notifyChange();
    },
    [notifyChange]
  );

  const deleteObjective = useCallback((objId: string) => {
    setState((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((o) => o.id !== objId),
    }));
    notifyChange();
  }, [notifyChange]);

  // ADD TASK TO PROJECT (§3.3 & §4: directly writes to Task Manager store)
  const addTaskToProject = useCallback(
    (data: {
      projectId: string;
      title: string;
      phaseId?: string;
      priority?: TaskPriority;
      dueAt?: string;
      assigneeName?: string;
    }) => {
      const newTask: Task = {
        id: "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        title: data.title.trim(),
        priority: data.priority || "medium",
        status: "planned",
        projectId: data.projectId,
        phaseId: data.phaseId,
        dueAt: data.dueAt,
        assigneeName: data.assigneeName,
        checklist: [],
        tags: [],
        attachments: [],
        links: [],
        dependencies: [],
        reminders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = [newTask, ...(parsed.tasks || [])];
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to add task to Task Manager store", e);
      }

      notifyChange();
      return newTask;
    },
    [notifyChange]
  );

  // UPDATE TASK STATUS (from Project Manager Kanban / list)
  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = (parsed.tasks || []).map((t: Task) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  completedAt: status === "completed" ? new Date().toISOString() : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : t
          );
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to update task status in store", e);
      }
      notifyChange();
    },
    [notifyChange]
  );

  // APPLY TEMPLATE (§11)
  const applyProjectTemplate = useCallback(
    (templateId: string, projectName: string, anchorStartDate: string = new Date().toISOString()) => {
      const template = PROJECT_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;

      const anchor = new Date(anchorStartDate);
      const newProjectId = "p-" + Date.now().toString(36);

      // Calculate total duration for dueAt
      let maxDueDays = 30;
      template.phases.forEach((p) => {
        if (p.relativeDueDays > maxDueDays) maxDueDays = p.relativeDueDays;
      });

      const projectDue = new Date(anchor.getTime() + maxDueDays * 86400000).toISOString();

      const newProject: Project = {
        id: newProjectId,
        name: projectName.trim() || template.name,
        description: template.description,
        status: "active",
        startAt: anchor.toISOString(),
        dueAt: projectDue,
        tags: [template.category],
        budgetSummary: {
          allocated: 100000000,
          spent: 0,
          currency: "IDR",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newPhases: Phase[] = [];
      const newMilestones: Milestone[] = [];
      const newTasksToAdd: Task[] = [];

      template.phases.forEach((p) => {
        const phaseId = "ph-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
        const phaseStart = new Date(anchor.getTime() + p.relativeStartDays * 86400000).toISOString();
        const phaseDue = new Date(anchor.getTime() + p.relativeDueDays * 86400000).toISOString();

        newPhases.push({
          id: phaseId,
          projectId: newProjectId,
          name: p.name,
          order: p.order,
          startAt: phaseStart,
          dueAt: phaseDue,
          status: p.order === 1 ? "active" : "upcoming",
        });

        // Tasks in phase
        p.tasks.forEach((t) => {
          const taskDue = new Date(anchor.getTime() + t.relativeDueDays * 86400000).toISOString();
          newTasksToAdd.push({
            id: "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: "planned",
            projectId: newProjectId,
            phaseId,
            dueAt: taskDue,
            checklist: [],
            tags: [template.category],
            attachments: [],
            links: [],
            dependencies: [],
            reminders: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });

        // Milestones in phase
        p.milestones.forEach((m) => {
          const msDate = new Date(anchor.getTime() + m.relativeDueDays * 86400000).toISOString();
          newMilestones.push({
            id: "ms-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
            projectId: newProjectId,
            phaseId,
            title: m.title,
            targetDate: msDate,
            status: "upcoming",
            linkedTaskIds: [],
          });
        });
      });

      // Commit to Project Manager state
      setState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        phases: [...prev.phases, ...newPhases],
        milestones: [...prev.milestones, ...newMilestones],
        members: [
          {
            id: "mem-" + Date.now().toString(36),
            projectId: newProjectId,
            userId: "u-owner",
            name: "Project Lead",
            role: "owner",
            joinedAt: new Date().toISOString(),
          },
          ...prev.members,
        ],
      }));

      // Commit tasks to Task Manager store
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = [...newTasksToAdd, ...(parsed.tasks || [])];
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to append template tasks to task manager", e);
      }

      logActivity(newProjectId, "template_applied", "template", undefined, template.name);
      notifyChange();
      return newProject;
    },
    [logActivity, notifyChange]
  );

  return {
    state,
    tasks,
    calculateProjectProgress,
    createProject,
    updateProject,
    transitionProjectStatus,
    duplicateProject,
    deleteProject,
    addPhase,
    updatePhase,
    deletePhase,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addRisk,
    updateRisk,
    deleteRisk,
    addMember,
    updateMemberRole,
    removeMember,
    addObjective,
    deleteObjective,
    addTaskToProject,
    updateTaskStatus,
    applyProjectTemplate,
  };
}

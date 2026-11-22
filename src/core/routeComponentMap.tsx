import React from "react";
import { slugify, SLUG_TO_FRAMEWORK_NAME } from "@/frameworkData";
import { CURRICULUM_DISCIPLINES } from "@/features/curated/curriculumData";

import {
  HomeDashboardPage,
  PartnerWorkspacePage,
  PortalWorkspacePage,
} from "@/routes/CorePortals";

import {
  CatatanView,
  CommodityView,
  FrameworkByNameView,
  IncotermsView,
  InvestmentAppView,
  KlienWorkspaceView,
  LainnyaView,
  MatrixAssetView,
  MatrixEarningView,
  MatrixExpenseView,
  MatrixFinancialHealthView,
  MatrixLiabilityView,
  MatrixSwotView,
  MatrixTowsView,
  ShariaAkadView,
  ShariaTerlarangView,
  SocietyView,
  SpectrumStageView,
  TaxAppView,
  ValuationView,
  WaterView,
  WorkspaceModuleView,
  ZakatAppView,
} from "@/features/nonWhiteApps/NonWhiteAppRenderer";
import { resolveAkadId } from "@/features/syariah/components/AkadStandaloneViews";
import { resolveProhibitedId } from "@/features/syariah/components/ProhibitedStandaloneViews";
import { LainnyaWorkspace } from "@/features/standalone/LainnyaWorkspace";
import { ValueTreatedPage } from "@/features/value-treated/ValueTreatedPage";
import { IslamicPrinciplesShariaValuesPage } from "@/features/syariah/IslamicPrinciplesShariaValuesPage";
import { KnowledgeAndLearningPage } from "@/features/knowledge-learning/KnowledgeAndLearningPage";
import { FamilyCommunityPage } from "@/features/family-community/FamilyCommunityPage";
import { HomeLeisurePage } from "@/features/home-leisure/HomeLeisurePage";

import CuratedApp from "@/features/curated/App";
import CreditApp from "@/features/credit/App";
import ProductApp from "@/features/product/App";

import { ApprovalManagerApp } from "@/features/approval-manager/ApprovalManagerApp";
import { AssetManagerApp } from "@/features/asset-manager/AssetManagerApp";
import { BookmarkManagerApp } from "@/features/bookmark-manager/BookmarkManagerApp";
import { CalendarApp } from "@/features/calendar/CalendarApp";
import { CollaborationApp } from "@/features/collaboration/CollaborationApp";
import { CountdownApp } from "@/features/countdown/CountdownApp";
import { DatabaseApp } from "@/features/database/DatabaseApp";
import { DeliverableManagerApp } from "@/features/deliverable-manager/DeliverableManagerApp";
import { DocumentsApp } from "@/features/documents/DocumentsApp";
import { EisenhowerApp } from "@/features/eisenhower/EisenhowerApp";
import { ExpenseTrackerApp } from "@/features/expense-tracker/ExpenseTrackerApp";
import { FocusTimerApp } from "@/features/focus-timer/FocusTimerApp";
import { FormsApp } from "@/features/forms/FormsApp";
import { GoalManagerApp } from "@/features/goal-manager/GoalManagerApp";
import { HabitTrackerApp } from "@/features/habit-tracker/HabitTrackerApp";
import { InteractionManagerApp } from "@/features/interaction-manager/InteractionManagerApp";
import { KanbanApp } from "@/features/kanban/KanbanApp";
import { KnowledgeBaseApp } from "@/features/knowledge-base/KnowledgeBaseApp";
import { KomunitasWargaApp } from "@/features/komunitas/KomunitasWargaApp";
import { MeetingManagerApp } from "@/features/meeting-manager/MeetingManagerApp";
import { MilestoneManagerApp } from "@/features/milestone-manager/MilestoneManagerApp";
import { NotesApp } from "@/features/notes/NotesApp";
import { NotificationCenterApp } from "@/features/notification-center/NotificationCenterApp";
import { PeopleManagerApp } from "@/features/people-manager/PeopleManagerApp";
import { PlannerApp } from "@/features/planner/PlannerApp";
import { ProjectManagerApp } from "@/features/project-manager/ProjectManagerApp";
import { ReminderManagerApp } from "@/features/reminder-manager/ReminderManagerApp";
import { ResearchManagerApp } from "@/features/research-manager/ResearchManagerApp";
import { ResourceManagerApp } from "@/features/resource-manager/ResourceManagerApp";
import { ScheduleManagerApp } from "@/features/schedule-manager/ScheduleManagerApp";
import { SearchManagerApp } from "@/features/search-manager/SearchManagerApp";
import { StatisticsApp } from "@/features/statistics/StatisticsApp";
import { SubscriptionManagerApp } from "@/features/subscription-manager/SubscriptionManagerApp";
import { TaskManagerApp } from "@/features/task-manager/TaskManagerApp";
import { TemplateManagerApp } from "@/features/template-manager/TemplateManagerApp";
import { TimeTrackerApp } from "@/features/time-tracker/TimeTrackerApp";
import { TimelineApp } from "@/features/timeline/TimelineApp";
import { WebClipperApp } from "@/features/web-clipper/WebClipperApp";
import { WikiApp } from "@/features/wiki/WikiApp";
import { WorkflowManagerApp } from "@/features/workflow-manager/WorkflowManagerApp";

import {
  AdvocacyRecordView,
  AssetsRecordView,
  BudgetRecordView,
  CapTableRecordView,
  CharityRecordView,
  ChoresRecordView,
  CivicRecordView,
  CommunityEventsRecordView,
  ComplianceRecordView,
  ContactsRecordView,
  DocumentsRecordView,
  EcosystemComparisonRecordView,
  FamilyBudgetRecordView,
  FamilyHealthRecordView,
  FamilyRecipesRecordView,
  FamilyTreeRecordView,
  FitnessRecordView,
  GiftsRecordView,
  GlobalOverviewRecordView,
  GoalsRecordView,
  HabitsRecordView,
  IncidentsRecordView,
  InnovationsHubRecordView,
  InsuranceRecordView,
  IntroductionsRecordView,
  InvestmentsRecordView,
  IpLicensesRecordView,
  JournalRecordView,
  KnowledgeRecordView,
  MaintenanceRecordView,
  MeetingsRecordView,
  MentorshipRecordView,
  MilestonesRecordView,
  PantryRecordView,
  PetCareRecordView,
  PlantsRecordView,
  ProcurementRecordView,
  ProjectsRecordView,
  ReadingRecordView,
  RealEstateRecordView,
  SleepRecordView,
  SubscriptionsRecordView,
  TasksRecordView,
  TimeAuditRecordView,
  TraditionsRecordView,
  VaultRecordView,
  VehiclesRecordView,
  VendorsRecordView,
  VolunteeringRecordView,
  WorkflowsRecordView,
} from "@/features/workspace-records/DomainRecordViews";

import {
  PersonalAssetsSuiteView,
  BudgetTrackerSuiteView,
  CertificateSuiteView,
  PersonalContactsSuiteView,
  DoctorConsultationSuiteView,
  FinanceOSSuiteView,
  GrocerySuiteView,
  PersonalHabitsSuiteView,
  HouseholdSuiteView,
  PersonalJournalSuiteView,
  MovieTrackerSuiteView,
  PersonalNotesSuiteView,
  PersonalPlannerSuiteView,
  RecipeBookSuiteView,
  SimpleFinanceSuiteView,
  PersonalSubscriptionsSuiteView,
  TravelBackpackSuiteView,
  WeightTrackerSuiteView,
  WishlistSuiteView,
} from "@/features/personal-life/PersonalSuiteViews";

import { FinancialWealthSection } from "@/features/launcher/FinancialWealthSection";
import { getGradient } from "@/features/launcher/ModeSectionView";
import { useFavorites } from "@/hooks/useFavorites";

function EmbeddedFinancialWealth() {
  const { favorites, toggleFavorite } = useFavorites();
  return (
    <FinancialWealthSection
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      getGradient={getGradient}
    />
  );
}

const STATIC_ROUTE_FACTORIES: Record<string, () => React.ReactNode> = {
  "/home": () => <HomeDashboardPage />,
  "/partner": () => <PartnerWorkspacePage />,
  "/portal": () => <PortalWorkspacePage defaultTab="overview" />,
  "/portal/pesan": () => <PortalWorkspacePage defaultTab="messages" />,
  "/klien": () => <KlienWorkspaceView />,
  "/client-hub": () => <KlienWorkspaceView />,
  "/catatan": () => <CatatanView />,
  "/lainnya": () => <LainnyaView />,

  "/financial-planning-and-wealth-management": () => <EmbeddedFinancialWealth />,
  "/financial-planning": () => <EmbeddedFinancialWealth />,
  "/financial-wealth": () => <EmbeddedFinancialWealth />,
  "/value-treated": () => <ValueTreatedPage />,
  "/applied-value": () => <ValueTreatedPage />,
  "/valuetreated": () => <ValueTreatedPage />,
  "/kurasi-wealth": () => <ValueTreatedPage />,
  "/kurasi": () => <CuratedApp />,
  "/100-komoditas": () => <CommodityView />,
  "/10-indeks": () => <CommodityView />,
  "/physical-commodities": () => <CommodityView />,
  "/valuasi": () => <ValuationView />,
  "/incoterms": () => <IncotermsView />,
  "/water": () => <WaterView />,
  "/zakat": () => <ZakatAppView />,
  "/pajak": () => <TaxAppView />,
  "/investasi": () => <InvestmentAppView />,
  "/syariah": () => <IslamicPrinciplesShariaValuesPage />,
  "/kredit": () => <CreditApp />,
  "/katalog-produk": () => <ProductApp />,
  "/knowledge-and-learning": () => <KnowledgeAndLearningPage />,
  "/family-and-community": () => <FamilyCommunityPage />,
  "/family-community": () => <FamilyCommunityPage />,
  "/home-and-leisure": () => <HomeLeisurePage />,
  "/home-leisure": () => <HomeLeisurePage />,

  // Matrix & Spectrum
  "/asset": () => <MatrixAssetView />,
  "/earning": () => <MatrixEarningView />,
  "/liability": () => <MatrixLiabilityView />,
  "/expense": () => <MatrixExpenseView />,
  "/financial-health": () => <MatrixFinancialHealthView />,
  "/swot": () => <MatrixSwotView />,
  "/tows": () => <MatrixTowsView />,
  "/surety": () => <SpectrumStageView stage="surety" />,
  "/flow": () => <SpectrumStageView stage="flow" />,
  "/build": () => <SpectrumStageView stage="build" />,
  "/grow": () => <SpectrumStageView stage="grow" />,
  "/legacy": () => <SpectrumStageView stage="legacy" />,
  "/liquid-reserves": () => <SpectrumStageView stage="surety" />,
  "/paper-securities": () => <SpectrumStageView stage="grow" />,
  "/finance": () => <SpectrumStageView stage="flow" />,

  // Society & Phase Side
  "/development": () => <SocietyView type="development" />,
  "/improvement": () => <SocietyView type="improvement" />,
  "/reliance": () => <SocietyView type="reliance" />,
  "/sufficient": () => <SocietyView type="sufficient" />,
  "/interact": () => <SocietyView type="interact" />,
  "/interdependence": () => <SocietyView type="interdependence" />,
  "/interest": () => <SocietyView type="interest" />,
  "/intersect": () => <SocietyView type="intersect" />,
  "/insider": () => <SocietyView type="insider" />,
  "/insight": () => <SocietyView type="insight" />,
  "/outward": () => <SocietyView type="outward" />,
  "/outlook": () => <SocietyView type="outlook" />,

  // Dedicated Framework Paths
  "/pestel": () => <FrameworkByNameView name="PESTEL Analysis" />,
  "/porter": () => <FrameworkByNameView name="Porter's Five Forces" />,
  "/vrio": () => <FrameworkByNameView name="VRIO Framework" />,
  "/value-chain": () => <FrameworkByNameView name="Value Chain Analysis" />,
  "/bcg": () => <FrameworkByNameView name="BCG Matrix" />,
  "/ge-mckinsey": () => <FrameworkByNameView name="GE-McKinsey Matrix" />,
  "/ansoff": () => <FrameworkByNameView name="Ansoff Matrix" />,
  "/blue-ocean": () => <FrameworkByNameView name="Blue Ocean Strategy (ERRC)" />,
  "/value-disciplines": () => <FrameworkByNameView name="Value Disciplines Model" />,
  "/bmc": () => <FrameworkByNameView name="Business Model Canvas (BMC)" />,
  "/lean-canvas": () => <FrameworkByNameView name="Lean Canvas" />,
  "/value-proposition-canvas": () => <FrameworkByNameView name="Value Proposition Canvas" />,
  "/empathy-map": () => <FrameworkByNameView name="Empathy Map" />,
  "/stp": () => <FrameworkByNameView name="STP Framework" />,
  "/marketing-mix": () => <FrameworkByNameView name="4P/7P Marketing Mix" />,
  "/customer-journey-map": () => <FrameworkByNameView name="Customer Journey Map (CJM)" />,
  "/kano-model": () => <FrameworkByNameView name="Kano Feature Prioritization" />,
  "/product-life-cycle": () => <FrameworkByNameView name="Product Life Cycle (PLC)" />,

  // Workspace modules
  "/budget": () => <WorkspaceModuleView type="budget" />,
  "/code": () => <WorkspaceModuleView type="code" />,
  "/contacts": () => <WorkspaceModuleView type="contacts" />,
  "/courses": () => <WorkspaceModuleView type="courses" />,
  "/design": () => <WorkspaceModuleView type="design" />,
  "/exams": () => <WorkspaceModuleView type="exams" />,
  "/flashcards": () => <WorkspaceModuleView type="flashcards" />,
  "/games": () => <WorkspaceModuleView type="games" />,
  "/health": () => <WorkspaceModuleView type="health" />,
  "/ideas": () => <WorkspaceModuleView type="ideas" />,
  "/inventory": () => <WorkspaceModuleView type="inventory" />,
  "/journal": () => <WorkspaceModuleView type="journal" />,
  "/kalkulator": () => <WorkspaceModuleView type="kalkulator" />,
  "/languages": () => <WorkspaceModuleView type="languages" />,
  "/movies": () => <WorkspaceModuleView type="movies" />,
  "/music": () => <WorkspaceModuleView type="music" />,
  "/passwords": () => <WorkspaceModuleView type="passwords" />,
  "/photography": () => <WorkspaceModuleView type="photography" />,
  "/podcasts": () => <WorkspaceModuleView type="podcasts" />,
  "/proyek-personal": () => <WorkspaceModuleView type="proyek-personal" />,
  "/reading": () => <WorkspaceModuleView type="reading" />,
  "/recipes": () => <WorkspaceModuleView type="recipes" />,
  "/shopping": () => <WorkspaceModuleView type="shopping" />,
  "/subscriptions": () => <WorkspaceModuleView type="subscriptions" />,
  "/trips": () => <WorkspaceModuleView type="trips" />,
  "/weather": () => <WorkspaceModuleView type="weather" />,
  "/workouts": () => <WorkspaceModuleView type="workouts" />,
  "/writing": () => <WorkspaceModuleView type="writing" />,

  // Standalone Apps
  "/approval-manager": () => <ApprovalManagerApp />,
  "/asset-manager": () => <AssetManagerApp />,
  "/bookmarks": () => <BookmarkManagerApp />,
  "/calendar": () => <CalendarApp />,
  "/kalender": () => <CalendarApp />,
  "/collaboration": () => <CollaborationApp />,
  "/countdown": () => <CountdownApp />,
  "/database": () => <DatabaseApp />,
  "/deliverable-manager": () => <DeliverableManagerApp />,
  "/documents": () => <DocumentsApp />,
  "/eisenhower": () => <EisenhowerApp />,
  "/expense-tracker": () => <ExpenseTrackerApp />,
  "/pomodoro": () => <FocusTimerApp />,
  "/forms": () => <FormsApp />,
  "/goal-manager": () => <GoalManagerApp />,
  "/habit-tracker": () => <HabitTrackerApp />,
  "/interaction-manager": () => <InteractionManagerApp />,
  "/kanban": () => <KanbanApp />,
  "/knowledge-base": () => <KnowledgeBaseApp />,
  "/komunitas-warga": () => <KomunitasWargaApp />,
  "/meeting-manager": () => <MeetingManagerApp />,
  "/milestone-manager": () => <MilestoneManagerApp />,
  "/notes": () => <NotesApp />,
  "/notification-center": () => <NotificationCenterApp />,
  "/people-manager": () => <PeopleManagerApp />,
  "/planner": () => <PlannerApp />,
  "/proyek": () => <ProjectManagerApp />,
  "/reminder-manager": () => <ReminderManagerApp />,
  "/research-manager": () => <ResearchManagerApp />,
  "/resource-manager": () => <ResourceManagerApp />,
  "/schedule-manager": () => <ScheduleManagerApp />,
  "/search-manager": () => <SearchManagerApp />,
  "/statistics": () => <StatisticsApp />,
  "/subscription-manager": () => <SubscriptionManagerApp />,
  "/task-manager": () => <TaskManagerApp />,
  "/template-manager": () => <TemplateManagerApp />,
  "/time-tracker": () => <TimeTrackerApp />,
  "/timeline": () => <TimelineApp />,
  "/web-clipper": () => <WebClipperApp />,
  "/wiki": () => <WikiApp />,
  "/workflow-manager": () => <WorkflowManagerApp />,

  // Special Drawer, Registry & Aliases
  "/digital-assets": () => <LainnyaWorkspace initialAppId="digital-assets" />,
  "/real-estate": () => <RealEstateRecordView />,
  "/intellectual-property": () => <IpLicensesRecordView />,
  "/shareholder-registry": () => <CapTableRecordView />,
  "/reports": () => <LainnyaWorkspace initialAppId="custom-reports" />,
  "/audit-log": () => <LainnyaWorkspace initialAppId="access-matrix" />,
  "/decision-log": () => <LainnyaWorkspace initialAppId="minutes" />,
  "/risk-management": () => <IncidentsRecordView />,
  "/wallet": () => <WorkspaceModuleView type="budget" />,
  "/pocket": () => <WorkspaceModuleView type="subscriptions" />,
  "/pouch": () => <TravelBackpackSuiteView />,
  "/vault": () => <VaultRecordView />,
  "/trunk": () => <HouseholdSuiteView />,

  // Domain Records
  "/records/global-overview": () => <GlobalOverviewRecordView />,
  "/records/innovations-hub": () => <InnovationsHubRecordView />,
  "/records/ecosystem-comparison": () => <EcosystemComparisonRecordView />,
  "/records/habits": () => <HabitsRecordView />,
  "/records/journal": () => <JournalRecordView />,
  "/records/goals": () => <GoalsRecordView />,
  "/records/reading": () => <ReadingRecordView />,
  "/records/fitness": () => <FitnessRecordView />,
  "/records/sleep": () => <SleepRecordView />,
  "/records/vault": () => <VaultRecordView />,
  "/records/documents": () => <DocumentsRecordView />,
  "/records/subscriptions": () => <SubscriptionsRecordView />,
  "/records/budget": () => <BudgetRecordView />,
  "/records/insurance": () => <InsuranceRecordView />,
  "/records/chores": () => <ChoresRecordView />,
  "/records/maintenance": () => <MaintenanceRecordView />,
  "/records/pantry": () => <PantryRecordView />,
  "/records/plants": () => <PlantsRecordView />,
  "/records/vehicles": () => <VehiclesRecordView />,
  "/records/family-tree": () => <FamilyTreeRecordView />,
  "/records/family-health": () => <FamilyHealthRecordView />,
  "/records/family-recipes": () => <FamilyRecipesRecordView />,
  "/records/traditions": () => <TraditionsRecordView />,
  "/records/family-budget": () => <FamilyBudgetRecordView />,
  "/records/pet-care": () => <PetCareRecordView />,
  "/records/workflows": () => <WorkflowsRecordView />,
  "/records/vendors": () => <VendorsRecordView />,
  "/records/incidents": () => <IncidentsRecordView />,
  "/records/procurement": () => <ProcurementRecordView />,
  "/records/compliance": () => <ComplianceRecordView />,
  "/records/assets": () => <AssetsRecordView />,
  "/records/ip-licenses": () => <IpLicensesRecordView />,
  "/records/cap-table": () => <CapTableRecordView />,
  "/records/investments": () => <InvestmentsRecordView />,
  "/records/real-estate": () => <RealEstateRecordView />,
  "/records/contacts": () => <ContactsRecordView />,
  "/records/milestones": () => <MilestonesRecordView />,
  "/records/gifts": () => <GiftsRecordView />,
  "/records/introductions": () => <IntroductionsRecordView />,
  "/records/mentorship": () => <MentorshipRecordView />,
  "/records/knowledge": () => <KnowledgeRecordView />,
  "/records/meetings": () => <MeetingsRecordView />,
  "/records/projects": () => <ProjectsRecordView />,
  "/records/tasks": () => <TasksRecordView />,
  "/records/time-audit": () => <TimeAuditRecordView />,
  "/records/civic": () => <CivicRecordView />,
  "/records/volunteering": () => <VolunteeringRecordView />,
  "/records/charity": () => <CharityRecordView />,
  "/records/community-events": () => <CommunityEventsRecordView />,
  "/records/advocacy": () => <AdvocacyRecordView />,

  // Personal Suite
  "/personal/life-planner": () => <PersonalPlannerSuiteView />,
  "/personal/finance-os": () => <FinanceOSSuiteView />,
  "/personal/simple-finance": () => <SimpleFinanceSuiteView />,
  "/personal/budget-tracker": () => <BudgetTrackerSuiteView />,
  "/personal/weight-tracker": () => <WeightTrackerSuiteView />,
  "/personal/doctor-consultation": () => <DoctorConsultationSuiteView />,
  "/personal/household-tracker": () => <HouseholdSuiteView />,
  "/personal/wishlist": () => <WishlistSuiteView />,
  "/personal/grocery-list": () => <GrocerySuiteView />,
  "/personal/movie-tracker": () => <MovieTrackerSuiteView />,
  "/personal/recipe-book": () => <RecipeBookSuiteView />,
  "/personal/certificate-tracker": () => <CertificateSuiteView />,
  "/personal/travel-backpack": () => <TravelBackpackSuiteView />,
  "/personal/notes": () => <PersonalNotesSuiteView />,
  "/personal/journal": () => <PersonalJournalSuiteView />,
  "/personal/habits": () => <PersonalHabitsSuiteView />,
  "/personal/contacts": () => <PersonalContactsSuiteView />,
  "/personal/subscriptions": () => <PersonalSubscriptionsSuiteView />,
  "/personal/assets": () => <PersonalAssetsSuiteView />,
};

export function resolveEmbeddedRouteElement(rawRoute?: string): React.ReactNode | null {
  if (!rawRoute) return null;
  const [rawPath, rawQuery] = rawRoute.split("?");
  const cleanPath = rawPath.trim();
  if (!cleanPath) return null;

  const queryParams = rawQuery ? new URLSearchParams(rawQuery) : null;
  const appQuery = queryParams?.get("app") || undefined;

  if (cleanPath === "/syariah/akad") {
    const resolved = resolveAkadId(appQuery);
    return resolved ? <ShariaAkadView appOverride={resolved} /> : null;
  }

  if (cleanPath === "/syariah/terlarang") {
    const resolved = resolveProhibitedId(appQuery);
    return resolved ? <ShariaTerlarangView appOverride={resolved} /> : null;
  }

  const factory = STATIC_ROUTE_FACTORIES[cleanPath];
  if (factory) {
    return factory();
  }

  if (cleanPath.startsWith("/framework/")) {
    const slug = cleanPath.slice("/framework/".length);
    const normalized = slugify(slug);
    const name = SLUG_TO_FRAMEWORK_NAME[normalized] || SLUG_TO_FRAMEWORK_NAME[slug] || slug;
    return <FrameworkByNameView name={name} />;
  }

  if (cleanPath.startsWith("/kurasi/")) {
    const chapter = cleanPath.slice("/kurasi/".length).toLowerCase();
    const disc = CURRICULUM_DISCIPLINES.find((d) => d.slug === chapter);
    return <CuratedApp initialChapterId={disc?.id ?? 1} />;
  }

  return null;
}

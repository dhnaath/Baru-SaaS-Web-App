import {
  TaskItem,
  TransactionItem,
  BudgetCategory,
  GoalItem,
  HabitItem,
  JournalItem,
  AccountItem,
  SubscriptionItem,
  SavingGoalItem,
  DebtItem,
  ContactItem,
  AssetItem,
  DoctorConsultationItem,
  DoctorContactItem,
  HouseholdItem,
  WishlistItem,
  GroceryItem,
  LifeCanvasBudget,
  WeightLogEntry,
  WeightProfile,
  NoteItem,
  DetailedJournalEntry,
  MovieItem,
  RecipeItem,
  CertificateItem,
  TravelBackpackItem,
} from '../types';

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_EXPENSES: TransactionItem[] = [];

export const INITIAL_INCOMES: TransactionItem[] = [];

export const INITIAL_BUDGETS: BudgetCategory[] = [];

export const INITIAL_GOALS: GoalItem[] = [];

export const INITIAL_HABITS: HabitItem[] = [];

export const INITIAL_JOURNALS: JournalItem[] = [];

export const INITIAL_ACCOUNTS: AccountItem[] = [];

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [];

export const INITIAL_SAVINGS: SavingGoalItem[] = [];

export const INITIAL_DEBTS: DebtItem[] = [];

export const INITIAL_CONTACTS: ContactItem[] = [];

export const INITIAL_ASSETS: AssetItem[] = [];

export const INITIAL_DOCTOR_CONTACTS: DoctorContactItem[] = [];

export const INITIAL_DOCTOR_CONSULTATIONS: DoctorConsultationItem[] = [];

export const INITIAL_HOUSEHOLD_ITEMS: HouseholdItem[] = [];

export const INITIAL_WISHLIST: WishlistItem[] = [];

export const INITIAL_GROCERY_LIST: GroceryItem[] = [];

export const INITIAL_LIFECANVAS_BUDGETS: LifeCanvasBudget[] = [];

export const INITIAL_WEIGHT_PROFILE: WeightProfile = {
  startingWeight: 0,
  currentWeight: 0,
  targetWeight: 0,
  heightCm: 0,
  startDate: '',
  targetDate: '',
  unit: 'kg',
};

export const INITIAL_WEIGHT_LOGS: WeightLogEntry[] = [];

export const INITIAL_LIFE_NOTES: NoteItem[] = [];

export const INITIAL_DETAILED_JOURNALS: DetailedJournalEntry[] = [];

export const INITIAL_MOVIES: MovieItem[] = [];

export const INITIAL_RECIPES: RecipeItem[] = [];

export const INITIAL_CERTIFICATES: CertificateItem[] = [];

export const INITIAL_TRAVEL_ITEMS: TravelBackpackItem[] = [];







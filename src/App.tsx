import { useEffect, useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Beef,
  ChefHat,
  Droplets,
  Flame,
  Home,
  MoonStar,
  Pencil,
  Search,
  Target,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
  UserRound,
} from 'lucide-react'

type Tab = 'home' | 'foodlog' | 'recipes' | 'progress' | 'profile'
type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner'
type Sex = 'male' | 'female'
type Goal = 'fat loss' | 'maintenance' | 'muscle gain'
type Diet = 'vegetarian' | 'eggetarian' | 'non-vegetarian'
type ActivityLevel = 'sedentary' | 'lightly active' | 'moderately active' | 'very active'

type FoodCatalogItem = {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  image: string
  unit: 'g' | 'ml' | 'serving'
}

type FoodEntry = {
  id: string
  name: string
  meal: MealType
  quantity: number
  unit: 'g' | 'ml' | 'serving'
  calories: number
  protein: number
  carbs: number
  fat: number
  dateKey: string
  source: 'database' | 'custom'
}

type Recipe = {
  id: string
  name: string
  diet: 'vegetarian' | 'eggetarian' | 'non-vegetarian'
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
  protein: number
  calories: number
  prepTime: number
  cookTime: number
  cost: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image: string
  tags: string[]
  ingredients: string[]
  instructions: string[]
}

type UserProfile = {
  age: number
  sex: Sex
  height: number
  weight: number
  activity: ActivityLevel
  goal: Goal
  diet: Diet
  allergies: string
  dislikes: string
  calorieTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
  waterTarget: number
  completed: boolean
}

const STORAGE_KEY = 'fitness-app-premium-v1'
const MEAL_OPTIONS: MealType[] = ['breakfast', 'lunch', 'snacks', 'dinner']
const TAB_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'foodlog', label: 'Food Log', icon: UtensilsCrossed },
  { id: 'recipes', label: 'Recipes', icon: ChefHat },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

const foodCatalog: FoodCatalogItem[] = [
  { id: 'paneer', name: 'Paneer', category: 'Indian', calories: 265, protein: 18, carbs: 3, fat: 21, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'soy-chunks', name: 'Soy chunks', category: 'Protein', calories: 345, protein: 52, carbs: 33, fat: 2, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'curd', name: 'Curd', category: 'Dairy', calories: 60, protein: 10, carbs: 3, fat: 2, image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'Legume', calories: 164, protein: 15, carbs: 27, fat: 3, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'tofu', name: 'Tofu', category: 'Plant protein', calories: 144, protein: 18, carbs: 4, fat: 8, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'chicken-breast', name: 'Chicken breast', category: 'Lean protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'egg', name: 'Egg', category: 'Protein', calories: 70, protein: 6, carbs: 1, fat: 5, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'brown-rice', name: 'Brown rice', category: 'Carbs', calories: 111, protein: 2.6, carbs: 23, fat: 1, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'banana', name: 'Banana', category: 'Fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80', unit: 'g' },
  { id: 'oats', name: 'Oats', category: 'Breakfast', calories: 389, protein: 16, carbs: 66, fat: 7, image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=900&q=80', unit: 'g' },
]

const recipes: Recipe[] = [
  {
    id: 'paneer-bhurji',
    name: 'High-protein paneer bhurji',
    diet: 'vegetarian',
    type: 'breakfast',
    protein: 29,
    calories: 420,
    prepTime: 8,
    cookTime: 10,
    cost: 90,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    tags: ['high protein', 'budget-friendly', 'Indian'],
    ingredients: ['200 g paneer, crumbled', '1 tomato, finely chopped', '1 onion, sliced', '1 green chilli', '1 tsp ginger garlic paste', '1/2 tsp turmeric', '1 tbsp oil'],
    instructions: ['Sauté onion and spices in oil.', 'Add tomato and cook until soft.', 'Fold in paneer and chilli, cook for 3 minutes.', 'Finish with coriander and serve hot.'],
  },
  {
    id: 'soy-chunk-masala',
    name: 'Soy chunk masala',
    diet: 'vegetarian',
    type: 'lunch',
    protein: 32,
    calories: 390,
    prepTime: 10,
    cookTime: 15,
    cost: 80,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    tags: ['high protein', 'budget-friendly', 'Indian'],
    ingredients: ['35 g soy chunks', '1/2 onion', '1 tomato', '1/2 tsp garam masala', '1 tbsp oil', '1/2 cup water'],
    instructions: ['Soak soy chunks until soft.', 'Sauté onion, tomato, and spices.', 'Add soy chunks and water to finish.', 'Cook until thick and flavorful.'],
  },
  {
    id: 'curd-wrap',
    name: 'Paneer and curd wrap',
    diet: 'vegetarian',
    type: 'lunch',
    protein: 27,
    calories: 450,
    prepTime: 12,
    cookTime: 0,
    cost: 95,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    tags: ['high protein', 'quick', 'Indian'],
    ingredients: ['1 whole wheat wrap', '100 g paneer cubes', '2 tbsp curd', '1/2 cucumber', 'mint chutney'],
    instructions: ['Mix curd with spices and paneer.', 'Fill wrap with paneer and vegetables.', 'Roll tightly and toast lightly if desired.'],
  },
  {
    id: 'besan-chilla',
    name: 'Besan chilla with curd',
    diet: 'vegetarian',
    type: 'breakfast',
    protein: 24,
    calories: 360,
    prepTime: 10,
    cookTime: 12,
    cost: 65,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
    tags: ['budget-friendly', 'under 20 minutes', 'vegetarian'],
    ingredients: ['1/2 cup besan', '1/2 cup water', '1 onion', '1 green chilli', '2 tbsp curd', '1 tsp oil'],
    instructions: ['Whisk besan with water and spices.', 'Pour onto a non-stick pan.', 'Cook both sides until set and serve with curd.'],
  },
  {
    id: 'chicken-rice-bowl',
    name: 'Chicken breast rice bowl',
    diet: 'non-vegetarian',
    type: 'dinner',
    protein: 41,
    calories: 560,
    prepTime: 10,
    cookTime: 15,
    cost: 160,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    tags: ['high protein', 'budget-friendly', 'meal prep'],
    ingredients: ['150 g chicken breast', '3/4 cup cooked rice', '1 cup mixed vegetables', '1 tsp olive oil', 'lemon and herbs'],
    instructions: ['Cook seasoned chicken until done.', 'Warm rice and vegetables.', 'Assemble bowl and finish with lemon.'],
  },
  {
    id: 'egg-omelette-wrap',
    name: 'Egg omelette wrap',
    diet: 'eggetarian',
    type: 'breakfast',
    protein: 26,
    calories: 390,
    prepTime: 7,
    cookTime: 8,
    cost: 75,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
    tags: ['quick', 'high protein', 'under 10 minutes'],
    ingredients: ['3 eggs', '1 whole wheat wrap', 'spinach', 'tomato', '1 tsp oil'],
    instructions: ['Whisk eggs and pour into a pan.', 'Add vegetables and cook gently.', 'Fold into wrap and serve.'],
  },
  {
    id: 'tuna-sandwich',
    name: 'Tuna sandwich',
    diet: 'non-vegetarian',
    type: 'lunch',
    protein: 35,
    calories: 430,
    prepTime: 8,
    cookTime: 0,
    cost: 130,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    tags: ['quick', 'protein rich', 'easy'],
    ingredients: ['1 can tuna', '2 slices whole wheat bread', '1 tbsp yogurt', 'cucumber', 'onion'],
    instructions: ['Mix tuna with yogurt and seasoning.', 'Assemble sandwich with vegetables.', 'Toast lightly and serve.'],
  },
  {
    id: 'dal-rice-bowl',
    name: 'Protein-rich dal and rice bowl',
    diet: 'vegetarian',
    type: 'dinner',
    protein: 30,
    calories: 510,
    prepTime: 10,
    cookTime: 20,
    cost: 70,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    tags: ['budget-friendly', 'Indian', 'meal prep'],
    ingredients: ['1 cup cooked dal', '3/4 cup cooked rice', 'onion, tomato, cumin', '1 tsp ghee', 'spinach'],
    instructions: ['Cook dal with spices until thick.', 'Serve over rice with vegetables.', 'Finish with lemon and herbs.'],
  },
]

const defaultProfile: UserProfile = {
  age: 24,
  sex: 'male',
  height: 176,
  weight: 72,
  activity: 'moderately active',
  goal: 'muscle gain',
  diet: 'vegetarian',
  allergies: '',
  dislikes: '',
  calorieTarget: 2450,
  proteinTarget: 140,
  carbsTarget: 250,
  fatTarget: 70,
  waterTarget: 2.8,
  completed: true,
}

function safeLoadState() {
  if (typeof window === 'undefined') return { profile: defaultProfile, logs: [] as FoodEntry[] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { profile: defaultProfile, logs: [] as FoodEntry[] }
    const parsed = JSON.parse(raw) as { profile?: UserProfile; logs?: FoodEntry[] }
    return {
      profile: { ...defaultProfile, ...parsed.profile },
      logs: parsed.logs ?? [],
    }
  } catch {
    return { profile: defaultProfile, logs: [] as FoodEntry[] }
  }
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function numberFormat(value: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: value < 10 ? 1 : 0 }).format(value)
}

function calculateTargets(profile: UserProfile) {
  const baseBmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.sex === 'male' ? 5 : -161)
  const multiplierMap: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
  }
  const maintenance = Math.round(baseBmr * multiplierMap[profile.activity])
  const calorieAdjustment = profile.goal === 'fat loss' ? -400 : profile.goal === 'muscle gain' ? 250 : 0
  const calorieTarget = Math.max(1800, maintenance + calorieAdjustment)
  const proteinBase = profile.goal === 'muscle gain' ? 1.9 : profile.goal === 'fat loss' ? 1.7 : 1.6
  const proteinTarget = Math.round(profile.weight * proteinBase)
  const carbsTarget = Math.round((calorieTarget * 0.42) / 4)
  const fatTarget = Math.round((calorieTarget * 0.25) / 9)
  const waterTarget = Number((profile.weight * 0.035).toFixed(1))

  return {
    maintenance,
    calorieTarget,
    proteinTarget,
    carbsTarget,
    fatTarget,
    waterTarget,
  }
}

function calculateMacroFromFood(item: FoodCatalogItem, qty: number, unit: 'g' | 'ml' | 'serving') {
  const multiplier = unit === 'serving' ? qty : qty / 100
  return {
    calories: Number((item.calories * multiplier).toFixed(1)),
    protein: Number((item.protein * multiplier).toFixed(1)),
    carbs: Number((item.carbs * multiplier).toFixed(1)),
    fat: Number((item.fat * multiplier).toFixed(1)),
  }
}

function App() {
  const initialState = useMemo(() => safeLoadState(), [])
  const [profile, setProfile] = useState<UserProfile>(initialState.profile)
  const [logs, setLogs] = useState<FoodEntry[]>(initialState.logs)
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [search, setSearch] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
  const [customFood, setCustomFood] = useState({ name: '', calories: '0', protein: '0', carbs: '0', fat: '0', quantity: '100', unit: 'g' as 'g' | 'ml' | 'serving' })
  const [recipeFilters, setRecipeFilters] = useState<string[]>(['high protein'])
  const [editingId, setEditingId] = useState<string | null>(null)

  const todayKey = formatDateKey(new Date())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, logs }))
  }, [profile, logs])

  const targetData = useMemo(() => calculateTargets(profile), [profile])

  const todaysLogs = useMemo(
    () => logs.filter((entry) => entry.dateKey === todayKey),
    [logs, todayKey],
  )

  const totals = useMemo(() => {
    return todaysLogs.reduce(
      (sum, entry) => {
        sum.calories += entry.calories
        sum.protein += entry.protein
        sum.carbs += entry.carbs
        sum.fat += entry.fat
        return sum
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }, [todaysLogs])

  const remaining = {
    calories: Math.max(profile.calorieTarget - totals.calories, 0),
    protein: Math.max(profile.proteinTarget - totals.protein, 0),
  }

  const recommendations = useMemo(() => {
    return recipes
      .filter((recipe) => {
        if (profile.diet === 'vegetarian' && recipe.diet === 'non-vegetarian') return false
        if (profile.diet === 'eggetarian' && recipe.diet === 'non-vegetarian') return false
        if (profile.allergies.toLowerCase().includes('dairy') && recipe.ingredients.some((item) => item.toLowerCase().includes('paneer'))) return false
        return true
      })
      .sort((a, b) => Math.abs(a.protein - remaining.protein) - Math.abs(b.protein - remaining.protein))
      .slice(0, 3)
  }, [profile, remaining.protein])

  const filteredCatalog = useMemo(() => {
    const query = search.trim().toLowerCase()
    return foodCatalog.filter((item) => item.name.toLowerCase().includes(query))
  }, [search])

  const recipeResults = useMemo(() => {
    return recipes.filter((recipe) => {
      const textMatch = recipe.name.toLowerCase().includes(search.toLowerCase()) || search.length === 0
      const filterMatch = recipeFilters.length === 0 || recipeFilters.every((filter) => {
        if (filter === 'high protein') return recipe.protein >= 25
        if (filter === 'budget-friendly') return recipe.cost <= 100
        if (filter === 'under 10 minutes') return recipe.prepTime + recipe.cookTime <= 10
        if (filter === 'under 20 minutes') return recipe.prepTime + recipe.cookTime <= 20
        if (filter === 'vegetarian') return recipe.diet === 'vegetarian' || recipe.diet === 'eggetarian'
        if (filter === 'non-vegetarian') return recipe.diet === 'non-vegetarian'
        if (filter === 'eggetarian') return recipe.diet === 'eggetarian'
        if (filter === 'breakfast') return recipe.type === 'breakfast'
        if (filter === 'lunch') return recipe.type === 'lunch'
        if (filter === 'dinner') return recipe.type === 'dinner'
        if (filter === 'snacks') return recipe.type === 'snacks'
        if (filter === 'Indian food') return recipe.tags.some((tag) => tag.toLowerCase().includes('indian'))
        if (filter === 'no-cook') return recipe.cookTime === 0
        return true
      })
      return textMatch && filterMatch
    })
  }, [recipeFilters, search])

  const recentFoods = useMemo(() => {
    return [...logs].reverse().slice(0, 5)
  }, [logs])

  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      const key = formatDateKey(date)
      const entries = logs.filter((entry) => entry.dateKey === key)
      const total = entries.reduce((sum, entry) => sum + entry.protein, 0)
      return { key, label: date.toLocaleDateString('en-IN', { weekday: 'short' }), total }
    })
    return last7Days
  }, [logs])

  const averageDailyProtein = weeklyData.reduce((sum, day) => sum + day.total, 0) / 7
  const reachedProteinDays = weeklyData.filter((day) => day.total >= profile.proteinTarget).length
  const mostLoggedFoods = useMemo(() => {
    const counts = new Map<string, number>()
    logs.forEach((entry) => counts.set(entry.name, (counts.get(entry.name) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [logs])

  const handleProfileSave = () => {
    const nextProfile = { ...profile, ...targetData, completed: true }
    setProfile(nextProfile)
    setActiveTab('home')
  }

  const handleAddItem = (item: FoodCatalogItem, qty: number, unit: 'g' | 'ml' | 'serving', meal: MealType) => {
    const result = calculateMacroFromFood(item, qty, unit)
    const entry: FoodEntry = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      meal,
      quantity: qty,
      unit,
      calories: Number(result.calories.toFixed(1)),
      protein: Number(result.protein.toFixed(1)),
      carbs: Number(result.carbs.toFixed(1)),
      fat: Number(result.fat.toFixed(1)),
      dateKey: todayKey,
      source: 'database',
    }
    setLogs((prev) => [entry, ...prev])
    setSearch('')
    setActiveTab('home')
  }

  const handleAddCustomFood = () => {
    const calories = Number(customFood.calories)
    const protein = Number(customFood.protein)
    const carbs = Number(customFood.carbs)
    const fat = Number(customFood.fat)
    if (!customFood.name.trim() || Number(customFood.quantity) <= 0) return
    const multiplier = customFood.unit === 'serving' ? Number(customFood.quantity) : Number(customFood.quantity) / 100
    const entry: FoodEntry = {
      id: `${customFood.name}-${Date.now()}`,
      name: customFood.name.trim(),
      meal: selectedMeal,
      quantity: Number(customFood.quantity),
      unit: customFood.unit,
      calories: Number((calories * multiplier).toFixed(1)),
      protein: Number((protein * multiplier).toFixed(1)),
      carbs: Number((carbs * multiplier).toFixed(1)),
      fat: Number((fat * multiplier).toFixed(1)),
      dateKey: todayKey,
      source: 'custom',
    }
    setLogs((prev) => [entry, ...prev])
    setCustomFood({ name: '', calories: '0', protein: '0', carbs: '0', fat: '0', quantity: '100', unit: 'g' })
  }

  const handleDeleteEntry = (id: string) => {
    setLogs((prev) => prev.filter((entry) => entry.id !== id))
  }

  const handleUpdateEntry = (id: string, nextQty: number) => {
    setLogs((prev) => prev.map((entry) => {
      if (entry.id !== id) return entry
      const factor = nextQty > 0 && entry.quantity > 0 ? nextQty / entry.quantity : 0
      return {
        ...entry,
        quantity: nextQty,
        calories: Number((entry.calories * factor).toFixed(1)),
        protein: Number((entry.protein * factor).toFixed(1)),
        carbs: Number((entry.carbs * factor).toFixed(1)),
        fat: Number((entry.fat * factor).toFixed(1)),
      }
    }))
  }

  const renderHome = () => (
    <div className="space-y-6">
      <header className="flex items-center justify-between rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-border">
        <div>
          <p className="text-sm text-muted">Good afternoon</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-ink">Riya</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accentSoft text-sm font-semibold text-accent">R</div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-stone text-muted">
            <MoonStar size={18} />
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Calories</span>
            <Flame size={16} className="text-accent" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat(totals.calories)}</div>
            <div className="text-sm text-muted">/ {profile.calorieTarget} kcal</div>
            <div className="h-2.5 rounded-full bg-stone">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((totals.calories / profile.calorieTarget) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Protein</span>
            <Beef size={16} className="text-accent" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat(totals.protein)}</div>
            <div className="text-sm text-muted">/ {profile.proteinTarget} g</div>
            <div className="h-2.5 rounded-full bg-stone">
              <div className="h-full rounded-full bg-[#6C9D88]" style={{ width: `${Math.min((totals.protein / profile.proteinTarget) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Hydration</span>
            <Droplets size={16} className="text-accent" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat((totals.protein / 10) * 0.7 + 0.4)}</div>
            <div className="text-sm text-muted">/ {profile.waterTarget} L</div>
            <div className="h-2.5 rounded-full bg-stone">
              <div className="h-full rounded-full bg-[#9AB3A0]" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Quick actions</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">Keep momentum</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Log a meal', tab: 'foodlog' },
              { label: 'Add food', tab: 'foodlog' },
              { label: 'Find a recipe', tab: 'recipes' },
              { label: 'Today report', tab: 'progress' },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => setActiveTab(action.tab as Tab)}
                className="rounded-2xl border border-border bg-stone px-4 py-3 text-left transition hover:border-accent/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{action.label}</span>
                  <ArrowRight size={16} className="text-accent" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[#E8EEE9] p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Remaining today</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-muted">Calories left</p>
              <p className="mt-1 text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat(profile.calorieTarget - totals.calories)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Protein left</p>
              <p className="mt-1 text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat(profile.proteinTarget - totals.protein)} g</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Complete your protein</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">You need approx {numberFormat(Math.max(profile.proteinTarget - totals.protein, 0))} g more</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {recommendations.map((recipe) => (
            <div key={recipe.id} className="rounded-2xl border border-border bg-stone p-3">
              <img src={recipe.image} alt={recipe.name} className="h-28 w-full rounded-xl object-cover" />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{recipe.name}</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-accent">{recipe.diet}</span>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-muted">
                <span>{recipe.protein} g protein</span>
                <span>{recipe.calories} kcal</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>₹{recipe.cost}</span>
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <h2 className="mb-4 text-xl font-semibold text-ink">Today’s meals</h2>
        <div className="space-y-4">
          {MEAL_OPTIONS.map((meal) => {
            const entries = todaysLogs.filter((entry) => entry.meal === meal)
            const total = entries.reduce((sum, entry) => sum + entry.calories, 0)
            return (
              <div key={meal} className="rounded-2xl border border-border bg-stone p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-[0.14em] text-muted">{meal}</span>
                  <span className="text-sm text-muted">{Math.round(total)} kcal</span>
                </div>
                <div className="space-y-2">
                  {entries.length === 0 ? (
                    <p className="text-sm text-muted">No meals logged yet.</p>
                  ) : (
                    entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-border">
                        <div>
                          <p className="font-medium text-ink">{entry.name}</p>
                          <p className="text-xs text-muted">{entry.quantity} {entry.unit} • {entry.protein} g protein</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setEditingId(entry.id)} className="p-2 text-muted hover:text-ink">
                            <Pencil size={15} />
                          </button>
                          <button type="button" onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-muted hover:text-ink">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#171916]/30 p-4 md:items-center">
          <div className="w-full max-w-md rounded-[28px] bg-white p-5 ring-1 ring-border">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Edit food</h3>
              <button type="button" onClick={() => setEditingId(null)} className="text-muted">✕</button>
            </div>
            {logs.filter((entry) => entry.id === editingId).map((entry) => (
              <div key={entry.id} className="space-y-3">
                <label className="block text-sm text-muted">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={entry.quantity}
                  onChange={(event) => handleUpdateEntry(entry.id, Number(event.target.value))}
                  className="w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none ring-0"
                />
              </div>
            ))}
            <button type="button" onClick={() => setEditingId(null)} className="mt-5 w-full rounded-2xl bg-accent px-4 py-3 font-medium text-white">Done</button>
          </div>
        </div>
      )}
    </div>
  )

  const renderFoodLog = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Food log</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Track today’s intake</h2>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-stone px-3 py-2">
          <Search size={16} className="text-muted" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search foods or meals" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted" />
        </div>

        <div className="mb-5 grid grid-cols-4 gap-2">
          {MEAL_OPTIONS.map((meal) => (
            <button
              key={meal}
              type="button"
              onClick={() => setSelectedMeal(meal)}
              className={`rounded-xl px-3 py-2 text-sm font-medium ${selectedMeal === meal ? 'bg-accent text-white' : 'bg-stone text-muted'}`}
            >
              {meal}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {filteredCatalog.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border bg-stone p-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium text-ink">{item.name}</p>
                    <button type="button" onClick={() => handleAddItem(item, 100, 'g', selectedMeal)} className="rounded-xl bg-white px-2 py-1 text-xs font-medium text-accent ring-1 ring-border">Add</button>
                  </div>
                  <p className="text-xs text-muted">{item.calories} kcal / 100 g • {item.protein} g protein</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-border bg-stone p-4">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Custom food</p>
            <div className="mt-4 space-y-3">
              <input value={customFood.name} onChange={(event) => setCustomFood((prev) => ({ ...prev, name: event.target.value }))} placeholder="Food name" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={customFood.calories} onChange={(event) => setCustomFood((prev) => ({ ...prev, calories: event.target.value }))} placeholder="Calories" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
                <input value={customFood.protein} onChange={(event) => setCustomFood((prev) => ({ ...prev, protein: event.target.value }))} placeholder="Protein g" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
                <input value={customFood.carbs} onChange={(event) => setCustomFood((prev) => ({ ...prev, carbs: event.target.value }))} placeholder="Carbs g" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
                <input value={customFood.fat} onChange={(event) => setCustomFood((prev) => ({ ...prev, fat: event.target.value }))} placeholder="Fat g" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <input value={customFood.quantity} onChange={(event) => setCustomFood((prev) => ({ ...prev, quantity: event.target.value }))} placeholder="Quantity" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none" />
                <select value={customFood.unit} onChange={(event) => setCustomFood((prev) => ({ ...prev, unit: event.target.value as 'g' | 'ml' | 'serving' }))} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none">
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="serving">serving</option>
                </select>
              </div>
              <button type="button" onClick={handleAddCustomFood} className="mt-2 w-full rounded-2xl bg-accent px-4 py-3 font-medium text-white">Save food entry</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Recently logged</h2>
          <button type="button" onClick={() => setActiveTab('home')} className="text-sm font-medium text-accent">View dashboard</button>
        </div>
        <div className="space-y-2">
          {recentFoods.length === 0 ? (
            <p className="text-sm text-muted">No meals logged yet.</p>
          ) : (
            recentFoods.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                <div>
                  <p className="font-medium text-ink">{entry.name}</p>
                  <p className="text-xs text-muted">{entry.meal} • {entry.quantity} {entry.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink">{entry.calories} kcal</p>
                  <p className="text-xs text-muted">{entry.protein} g protein</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  const renderRecipes = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Recipes</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Protein-packed picks</h2>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-stone px-3 py-2">
            <Search size={16} className="text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipe" className="w-40 bg-transparent text-sm text-ink outline-none placeholder:text-muted" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['high protein', 'budget-friendly', 'under 10 minutes', 'under 20 minutes', 'vegetarian', 'eggetarian', 'non-vegetarian', 'breakfast', 'lunch', 'dinner', 'snacks', 'Indian food', 'no-cook'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setRecipeFilters((prev) => prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag])}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${recipeFilters.includes(tag) ? 'bg-accent text-white' : 'bg-stone text-muted'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recipeResults.map((recipe) => (
          <div key={recipe.id} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-border">
            <img src={recipe.image} alt={recipe.name} className="h-52 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-ink">{recipe.name}</h3>
                <span className="rounded-full bg-accentSoft px-2 py-1 text-[10px] font-medium text-accent">{recipe.difficulty}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                <span>{recipe.protein} g protein</span>
                <span>{recipe.calories} kcal</span>
                <span>{recipe.prepTime + recipe.cookTime} min</span>
                <span>₹{recipe.cost}</span>
              </div>
              <div className="mt-4 rounded-2xl bg-stone p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Ingredients</p>
                <ul className="mt-2 space-y-1 text-sm text-ink">
                  {recipe.ingredients.slice(0, 3).map((ingredient) => <li key={ingredient}>• {ingredient}</li>)}
                </ul>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={() => handleAddItem({ id: recipe.id, name: recipe.name, category: recipe.type, calories: recipe.calories, protein: recipe.protein, carbs: 0, fat: 0, image: recipe.image, unit: 'serving' }, 1, 'serving', selectedMeal)} className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white">Add to diary</button>
                <button type="button" className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-ink">View details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Average protein</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-ink">{numberFormat(averageDailyProtein)} g</p>
        </div>
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Goal days</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-ink">{reachedProteinDays}/7</p>
        </div>
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Most logged</p>
          <p className="mt-3 text-lg font-semibold text-ink">{mostLoggedFoods[0]?.[0] ?? 'No foods yet'}</p>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Weekly trend</h2>
          <span className="text-sm text-muted">Last 7 days</span>
        </div>
        <div className="flex h-40 items-end gap-3">
          {weeklyData.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end justify-center rounded-t-2xl bg-stone">
                <div className="w-full rounded-t-2xl bg-accent" style={{ height: `${Math.min((day.total / Math.max(profile.proteinTarget, 1)) * 100, 100)}%` }} />
              </div>
              <span className="text-xs text-muted">{day.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <h2 className="text-xl font-semibold text-ink">Consistency summary</h2>
        <p className="mt-2 text-base text-muted">You’re building momentum — keep going with a few simple protein-first meals and balanced dinners.</p>
        <div className="mt-4 space-y-3">
          {mostLoggedFoods.map(([food, count]) => (
            <div key={food} className="flex items-center justify-between rounded-2xl bg-stone px-3 py-2">
              <span className="font-medium text-ink">{food}</span>
              <span className="text-sm text-muted">{count} entries</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accentSoft text-lg font-semibold text-accent">R</div>
          <div>
            <h2 className="text-xl font-semibold text-ink">Profile</h2>
            <p className="text-sm text-muted">Estimates update instantly</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Nutrition targets</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-muted">Calories<input value={profile.calorieTarget} onChange={(event) => setProfile((prev) => ({ ...prev, calorieTarget: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Protein<input value={profile.proteinTarget} onChange={(event) => setProfile((prev) => ({ ...prev, proteinTarget: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Carbs<input value={profile.carbsTarget} onChange={(event) => setProfile((prev) => ({ ...prev, carbsTarget: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Fat<input value={profile.fatTarget} onChange={(event) => setProfile((prev) => ({ ...prev, fatTarget: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Body stats</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-muted">Age<input value={profile.age} onChange={(event) => setProfile((prev) => ({ ...prev, age: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Height<input value={profile.height} onChange={(event) => setProfile((prev) => ({ ...prev, height: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Weight<input value={profile.weight} onChange={(event) => setProfile((prev) => ({ ...prev, weight: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Water L<input value={profile.waterTarget} onChange={(event) => setProfile((prev) => ({ ...prev, waterTarget: Number(event.target.value) }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none" /></label>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 ring-1 ring-border">
        <p className="text-sm uppercase tracking-[0.18em] text-muted">Preferences</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-muted">Sex<select value={profile.sex} onChange={(event) => setProfile((prev) => ({ ...prev, sex: event.target.value as Sex }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none"><option value="male">Male</option><option value="female">Female</option></select></label>
          <label className="text-sm text-muted">Activity<select value={profile.activity} onChange={(event) => setProfile((prev) => ({ ...prev, activity: event.target.value as ActivityLevel }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none"><option value="sedentary">Sedentary</option><option value="lightly active">Lightly active</option><option value="moderately active">Moderately active</option><option value="very active">Very active</option></select></label>
          <label className="text-sm text-muted">Goal<select value={profile.goal} onChange={(event) => setProfile((prev) => ({ ...prev, goal: event.target.value as Goal }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none"><option value="fat loss">Fat loss</option><option value="maintenance">Maintenance</option><option value="muscle gain">Muscle gain</option></select></label>
          <label className="text-sm text-muted">Diet<select value={profile.diet} onChange={(event) => setProfile((prev) => ({ ...prev, diet: event.target.value as Diet }))} className="mt-1 w-full rounded-xl border border-border bg-stone px-3 py-2 text-ink outline-none"><option value="vegetarian">Vegetarian</option><option value="eggetarian">Eggetarian</option><option value="non-vegetarian">Non-vegetarian</option></select></label>
        </div>
        <div className="mt-4 space-y-3">
          <input value={profile.allergies} onChange={(event) => setProfile((prev) => ({ ...prev, allergies: event.target.value }))} placeholder="Food allergies" className="w-full rounded-xl border border-border bg-stone px-3 py-2 text-sm text-ink outline-none" />
          <input value={profile.dislikes} onChange={(event) => setProfile((prev) => ({ ...prev, dislikes: event.target.value }))} placeholder="Disliked ingredients" className="w-full rounded-xl border border-border bg-stone px-3 py-2 text-sm text-ink outline-none" />
        </div>
        <button type="button" onClick={handleProfileSave} className="mt-5 w-full rounded-2xl bg-accent px-4 py-3 font-medium text-white">Save profile</button>
      </div>
    </div>
  )

  const renderOnboarding = () => (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] bg-white p-6 ring-1 ring-border shadow-soft">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Nutrition profile</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-ink">Build your daily nutrition plan</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted">Age<input value={profile.age} onChange={(event) => setProfile((prev) => ({ ...prev, age: Number(event.target.value) }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Sex<select value={profile.sex} onChange={(event) => setProfile((prev) => ({ ...prev, sex: event.target.value as Sex }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none"><option value="male">Male</option><option value="female">Female</option></select></label>
            <label className="text-sm text-muted">Height (cm)<input value={profile.height} onChange={(event) => setProfile((prev) => ({ ...prev, height: Number(event.target.value) }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Weight (kg)<input value={profile.weight} onChange={(event) => setProfile((prev) => ({ ...prev, weight: Number(event.target.value) }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none" /></label>
            <label className="text-sm text-muted">Activity<select value={profile.activity} onChange={(event) => setProfile((prev) => ({ ...prev, activity: event.target.value as ActivityLevel }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none"><option value="sedentary">Sedentary</option><option value="lightly active">Lightly active</option><option value="moderately active">Moderately active</option><option value="very active">Very active</option></select></label>
            <label className="text-sm text-muted">Goal<select value={profile.goal} onChange={(event) => setProfile((prev) => ({ ...prev, goal: event.target.value as Goal }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none"><option value="fat loss">Fat loss</option><option value="maintenance">Maintenance</option><option value="muscle gain">Muscle gain</option></select></label>
            <label className="text-sm text-muted md:col-span-2">Diet preference<select value={profile.diet} onChange={(event) => setProfile((prev) => ({ ...prev, diet: event.target.value as Diet }))} className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none"><option value="vegetarian">Vegetarian</option><option value="eggetarian">Eggetarian</option><option value="non-vegetarian">Non-vegetarian</option></select></label>
            <label className="text-sm text-muted md:col-span-2">Food allergies<input value={profile.allergies} onChange={(event) => setProfile((prev) => ({ ...prev, allergies: event.target.value }))} placeholder="e.g. peanuts, dairy" className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none" /></label>
            <label className="text-sm text-muted md:col-span-2">Disliked ingredients<input value={profile.dislikes} onChange={(event) => setProfile((prev) => ({ ...prev, dislikes: event.target.value }))} placeholder="e.g. mushrooms, bitter gourd" className="mt-1 w-full rounded-2xl border border-border bg-stone px-3 py-3 text-ink outline-none" /></label>
          </div>
          <button type="button" onClick={handleProfileSave} className="mt-6 inline-flex items-center rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-white">Finish setup <ArrowRight className="ml-2" size={16} /></button>
        </div>

        <div className="rounded-[32px] bg-[#E8EEE9] p-6 ring-1 ring-border">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Estimated targets</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-muted">Maintenance calories</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-ink">{targetData.maintenance}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between"><p className="text-sm text-muted">Daily calorie target</p><Target size={16} className="text-accent" /></div>
              <p className="mt-2 text-3xl font-semibold text-ink">{targetData.calorieTarget} kcal</p>
            </div>
            <div className="flex justify-between text-sm text-muted"><span>Protein target</span><span className="font-medium text-ink">{targetData.proteinTarget} g</span></div>
            <div className="flex justify-between text-sm text-muted"><span>Carbs target</span><span className="font-medium text-ink">{targetData.carbsTarget} g</span></div>
            <div className="flex justify-between text-sm text-muted"><span>Fat target</span><span className="font-medium text-ink">{targetData.fatTarget} g</span></div>
            <div className="flex justify-between text-sm text-muted"><span>Water reminder</span><span className="font-medium text-ink">{targetData.waterTarget} L</span></div>
            <p className="text-xs text-muted">Estimates use the Mifflin–St Jeor equation and are intended for guidance rather than medical advice.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const currentPage = profile.completed ? (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 md:px-6">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden rounded-[28px] bg-white p-4 ring-1 ring-border lg:block">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accentSoft text-lg font-semibold text-accent">N</div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Nourish</p>
              <p className="font-semibold text-ink">Nutrition</p>
            </div>
          </div>
          <nav className="space-y-2">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium ${activeTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-stone'}`}>
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="space-y-6">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'foodlog' && renderFoodLog()}
          {activeTab === 'recipes' && renderRecipes()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'profile' && renderProfile()}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#F7F7F2]/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <nav className="grid grid-cols-5 gap-2">
          {TAB_ITEMS.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] ${active ? 'bg-accent text-white' : 'text-muted'}`}>
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  ) : renderOnboarding()

  return currentPage
}

export default App

"use client"

import { useEffect, useState } from "react"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { CategoryManagement } from "@/components/category-management"
import { LoginDialog } from "@/components/login-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogIn, Ticket, PlusSquare, FolderTree } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard-shell"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"

const initialCategoriesData = {
  hardware: {
    label: "مشکلات سخت‌افزاری",
    description: "مشکلات مربوط به تجهیزات فیزیکی",
    subIssues: {
      "computer-not-working": {
        label: "رایانه کار نمی‌کند",
        description: "رایانه روشن نمی‌شود یا به درستی کار نمی‌کند",
      },
      "printer-issues": {
        label: "مشکلات چاپگر",
        description: "چاپگر کار نمی‌کند یا کیفیت چاپ مناسب نیست",
      },
      "monitor-problems": {
        label: "مشکلات مانیتور",
        description: "مانیتور تصویر نمایش نمی‌دهد یا مشکل در نمایش دارد",
      },
    },
  },
  software: {
    label: "مشکلات نرم‌افزاری",
    description: "مشکلات مربوط به نرم‌افزارها و سیستم عامل",
    subIssues: {
      "os-issues": {
        label: "مشکلات سیستم عامل",
        description: "مشکلات ویندوز، مک یا لینوکس",
      },
      "application-problems": {
        label: "مشکلات نرم‌افزار",
        description: "نرم‌افزار کار نمی‌کند یا خطا می‌دهد",
      },
      "software-installation": {
        label: "نصب نرم‌افزار",
        description: "نیاز به نصب یا به‌روزرسانی نرم‌افزار",
      },
    },
  },
  network: {
    label: "مشکلات شبکه",
    description: "مشکلات اتصال به اینترنت و شبکه",
    subIssues: {
      "internet-connection": {
        label: "مشکل اتصال اینترنت",
        description: "عدم دسترسی به اینترنت یا اتصال کند",
      },
      "wifi-problems": {
        label: "مشکلات وای‌فای",
        description: "عدم اتصال به شبکه بی‌سیم",
      },
      "network-drive": {
        label: "دسترسی به درایو شبکه",
        description: "عدم دسترسی به فولدرهای مشترک",
      },
    },
  },
  email: {
    label: "مشکلات ایمیل",
    description: "مشکلات مربوط به ایمیل و پیام‌رسانی",
    subIssues: {
      "email-not-working": {
        label: "ایمیل کار نمی‌کند",
        description: "عدم دریافت یا ارسال ایمیل",
      },
      "email-setup": {
        label: "تنظیم ایمیل",
        description: "نیاز به تنظیم حساب ایمیل جدید",
      },
      "email-sync": {
        label: "همگام‌سازی ایمیل",
        description: "مشکل در همگام‌سازی ایمیل‌ها",
      },
    },
  },
  security: {
    label: "مسائل امنیتی",
    description: "مشکلات امنیتی و حفاظت از اطلاعات",
    subIssues: {
      "virus-malware": {
        label: "ویروس یا بدافزار",
        description: "احتمال آلودگی سیستم به ویروس",
      },
      "password-reset": {
        label: "بازنشانی رمز عبور",
        description: "فراموشی رمز عبور حساب کاربری",
      },
      "security-incident": {
        label: "حادثه امنیتی",
        description: "مشکوک بودن فعالیت‌های غیرعادی",
      },
    },
  },
  access: {
    label: "درخواست دسترسی",
    description: "درخواست دسترسی به سیستم‌ها و منابع",
    subIssues: {
      "system-access": {
        label: "دسترسی به سیستم",
        description: "نیاز به دسترسی به سیستم یا نرم‌افزار خاص",
      },
      "permission-change": {
        label: "تغییر سطح دسترسی",
        description: "نیاز به تغییر مجوزهای کاربری",
      },
      "new-account": {
        label: "حساب کاربری جدید",
        description: "درخواست ایجاد حساب کاربری جدید",
      },
    },
  },
}

const initialTickets = [
  {
    id: "TK-2024-001",
    title: "رایانه کار نمی‌کند",
    description: "رایانه من صبح که آمدم کار کار نمی‌کند. وقتی دکمه پاور را می‌زنم هیچ چراغی روشن نمی‌شود.",
    status: "in-progress",
    priority: "high",
    category: "hardware",
    subcategory: "computer-not-working",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    department: "حسابداری",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    assignedTo: "2",
    assignedTechnicianName: "علی تکنسین",
    assignedTechnicianEmail: "ali@company.com",
    responses: [
      {
        message:
          "سلام احمد جان، تیکت شما را دریافت کردم. لطفاً بررسی کنید که کابل برق به درستی وصل باشد و پریز برق کار کند.",
        status: "in-progress",
        technicianName: "علی تکنسین",
        technicianEmail: "ali@company.com",
        timestamp: "2024-01-15T09:00:00Z",
      },
    ],
  },
  {
    id: "TK-2024-002",
    title: "مشکل اتصال به اینترنت",
    description: "از دیروز اینترنت من قطع و وصل می‌شود. نمی‌توانم به درستی کار کنم.",
    status: "resolved",
    priority: "medium",
    category: "network",
    subcategory: "internet-connection",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    clientPhone: "09187654321",
    department: "بازاریابی",
    createdAt: "2024-01-14T10:15:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    assignedTo: "2",
    assignedTechnicianName: "علی تکنسین",
    assignedTechnicianEmail: "ali@company.com",
    responses: [
      {
        message: "مشکل از طرف اپراتور بود. اکنون برطرف شده است.",
        status: "resolved",
        technicianName: "علی تکنسین",
        technicianEmail: "ali@company.com",
        timestamp: "2024-01-14T14:30:00Z",
      },
    ],
  },
  {
    id: "TK-2024-003",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید دارم. لطفاً کمک کنید.",
    status: "open",
    priority: "low",
    category: "software",
    subcategory: "software-installation",
    clientName: "حسن رضایی",
    clientEmail: "hassan@company.com",
    clientPhone: "09198765432",
    department: "حسابداری",
    createdAt: "2024-01-16T11:20:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
    assignedTo: "2",
    assignedTechnicianName: "علی تکنسین",
    assignedTechnicianEmail: "ali@company.com",
    responses: [],
  },
  {
    id: "TK-2024-004",
    title: "مشکل چاپگر اداری",
    description: "چاپگر در بخش اداری کاغذ گیر می‌کند و نمی‌توان از آن استفاده کرد.",
    status: "in-progress",
    priority: "medium",
    category: "hardware",
    subcategory: "printer-issues",
    clientName: "مریم احمدی",
    clientEmail: "maryam@company.com",
    clientPhone: "09123456780",
    department: "اداری",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
    assignedTo: "2",
    assignedTechnicianName: "علی تکنسین",
    assignedTechnicianEmail: "ali@company.com",
    responses: [
      {
        message: "در حال بررسی مشکل چاپگر هستم. به زودی حل خواهد شد.",
        status: "in-progress",
        technicianName: "علی تکنسین",
        technicianEmail: "ali@company.com",
        timestamp: "2024-01-16T10:30:00Z",
      },
    ],
  },
  {
    id: "TK-2024-005",
    title: "درخواست دسترسی به سیستم CRM",
    description: "نیاز به دسترسی به سیستم مدیریت ارتباط با مشتری دارم تا بتوانم گزارش‌های فروش را مشاهده کنم.",
    status: "open",
    priority: "medium",
    category: "access",
    subcategory: "system-access",
    clientName: "سارا موسوی",
    clientEmail: "sara@company.com",
    clientPhone: "09123456781",
    department: "فروش",
    createdAt: "2024-01-17T08:45:00Z",
    updatedAt: "2024-01-17T08:45:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    assignedTechnicianEmail: null,
    responses: [],
  },
  {
    id: "TK-2024-006",
    title: "مشکل امنیتی - ایمیل مشکوک",
    description: "ایمیل مشکوکی دریافت کردم که ممکن است فیشینگ باشد. لطفاً بررسی کنید.",
    status: "open",
    priority: "urgent",
    category: "security",
    subcategory: "security-incident",
    clientName: "رضا نوری",
    clientEmail: "reza@company.com",
    clientPhone: "09123456782",
    department: "مالی",
    createdAt: "2024-01-17T10:20:00Z",
    updatedAt: "2024-01-17T10:20:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    assignedTechnicianEmail: null,
    responses: [],
  },
  {
    id: "TK-2024-007",
    title: "مانیتور تصویر نمایش نمی‌دهد",
    description: "مانیتور من از صبح روشن نمی‌شود. چراغ پاور روشن است اما صفحه سیاه است.",
    status: "open",
    priority: "high",
    category: "hardware",
    subcategory: "monitor-problems",
    clientName: "نازنین کریمی",
    clientEmail: "nazanin@company.com",
    clientPhone: "09123456783",
    department: "طراحی",
    createdAt: "2024-01-17T11:30:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    assignedTechnicianEmail: null,
    responses: [],
  },
  {
    id: "TK-2024-008",
    title: "بازنشانی رمز عبور ایمیل",
    description: "رمز عبور ایمیل کاری خود را فراموش کرده‌ام و نمی‌توانم وارد شوم.",
    status: "open",
    priority: "medium",
    category: "security",
    subcategory: "password-reset",
    clientName: "علی محمدی",
    clientEmail: "alim@company.com",
    clientPhone: "09123456784",
    department: "منابع انسانی",
    createdAt: "2024-01-17T13:15:00Z",
    updatedAt: "2024-01-17T13:15:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    assignedTechnicianEmail: null,
    responses: [],
  },
  {
    id: "TK-2024-009",
    title: "مشکل اتصال وای‌فای",
    description: "لپ‌تاپ من به شبکه وای‌فای اداری متصل نمی‌شود. سایر دستگاه‌ها مشکلی ندارند.",
    status: "open",
    priority: "low",
    category: "network",
    subcategory: "wifi-problems",
    clientName: "فرهاد رضایی",
    clientEmail: "farhad@company.com",
    clientPhone: "09123456785",
    department: "IT",
    createdAt: "2024-01-17T14:00:00Z",
    updatedAt: "2024-01-17T14:00:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    assignedTechnicianEmail: null,
    responses: [],
  },
]

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [tickets, setTickets] = useState(initialTickets)
  const [categoriesData, setCategoriesData] = useState(initialCategoriesData)
  const [view, setView] = useState<string>("tickets")

  // Redirect unauthenticated users to the new login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user?.role !== "admin" && view === "categories") {
      setView("tickets")
    }
  }, [user?.role, view])

  const handleTicketCreate = (newTicket: any) => {
    setTickets((prev) => [newTicket, ...prev])
  }

  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
      ),
    )
  }

  const handleCategoryUpdate = (updatedCategories: any) => {
    setCategoriesData(updatedCategories)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">سیستم مدیریت خدمات IT</h1>
            <p className="text-gray-600">برای دسترسی به سیستم وارد شوید</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Button onClick={() => setLoginDialogOpen(true)} className="w-full gap-2" size="lg">
              <LogIn className="w-5 h-5" />
              ورود به سیستم
            </Button>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 text-center mb-3">حساب‌های نمونه:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>کاربر: ahmad@company.com / 123456</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>تکنسین: ali@company.com / 123456</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>مدیر: admin@company.com / 123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      </div>
    )
  }

  // ناوبری اصلی بر اساس نقش کاربر
  const navItems: DashboardNavItem[] = [
    {
      key: "tickets-module",
      label: "مدیریت تیکت‌ها",
      icon: Ticket,
      children: [
        { key: "tickets", label: "لیست تیکت‌ها", icon: Ticket },
        { key: "create", label: "ثبت تیکت جدید", icon: PlusSquare },
      ],
    },
  ]

  if (user.role === "admin") {
    navItems.push({
      key: "system-config",
      label: "پیکربندی سامانه",
      icon: FolderTree,
      children: [{ key: "categories", label: "مدیریت دسته‌بندی‌ها", icon: FolderTree }],
    })
  }


  return (
    <DashboardShell title="سامانه پشتیبانی IT" items={navItems} activeKey={view} onSelect={setView}>
      {view === "create" && (
        <div className="max-w-5xl mx-auto" dir="rtl">
          <div className="mb-4 text-right">
            <h2 className="text-xl font-bold">ثبت تیکت جدید</h2>
            <p className="text-sm text-muted-foreground">لطفا فرم زیر را تکمیل کنید</p>
          </div>
          <TwoStepTicketForm
            onSubmit={(t) => {
              handleTicketCreate(t)
              setView("tickets")
            }}
            onClose={() => setView("tickets")}
            categoriesData={categoriesData}
          />
        </div>
      )}

      {view === "tickets" && (
        <div>
          {user.role === "client" && (
            <ClientDashboard
              tickets={tickets}
              onTicketCreate={handleTicketCreate}
              currentUser={user}
              categoriesData={categoriesData}
            />
          )}
          {user.role === "engineer" && (
            <TechnicianDashboard tickets={tickets} onTicketUpdate={handleTicketUpdate} currentUser={user} />
          )}
          {user.role === "admin" && (
            <AdminTicketManagement tickets={tickets} onTicketUpdate={handleTicketUpdate} />
          )}
        </div>
      )}

      {view === "categories" && user.role === "admin" && (
        <CategoryManagement categoriesData={categoriesData} onCategoryUpdate={handleCategoryUpdate} />
      )}
    </DashboardShell>
  )

}



"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { UserMenu } from "@/components/user-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  Search,
  Sun,
} from "lucide-react"

type DashboardNavSubItem = {
  key: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export type DashboardNavItem = {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: DashboardNavSubItem[]
}

interface DashboardShellProps {
  title?: string
  items: DashboardNavItem[]
  activeKey: string
  onSelect: (key: string) => void
  children: React.ReactNode
}

export function DashboardShell({ title, items, activeKey, onSelect, children }: DashboardShellProps) {
  const { user } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", onFullScreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange)
  }, [])

  React.useEffect(() => {
    setExpandedItems((prev) => {
      let changed = false
      const next = { ...prev }
      items.forEach((item) => {
        if (item.children?.some((child) => child.key === activeKey) && !next[item.key]) {
          next[item.key] = true
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [items, activeKey])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = React.useCallback(() => {
    if (!mounted) return
    setTheme(isDark ? "light" : "dark")
  }, [isDark, mounted, setTheme])

  const toggleFullscreen = React.useCallback(() => {
    if (typeof document === "undefined") return
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => undefined)
    } else {
      document.documentElement.requestFullscreen?.().catch(() => undefined)
    }
  }, [])

  const handleParentClick = (item: DashboardNavItem) => {
    if (item.children?.length) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.key]: !prev[item.key],
      }))
    } else {
      onSelect(item.key)
      setMobileOpen(false)
    }
  }

  const handleChildClick = (childKey: string, closeOnSelect?: boolean) => {
    onSelect(childKey)
    if (closeOnSelect) {
      setMobileOpen(false)
    }
  }

  const roleMeta =
    user?.role
      ? {
          admin: {
            label: "مدیر سامانه",
            badge: "border-violet-500/40 bg-violet-500/15 text-violet-100",
          },
          engineer: {
            label: "کارشناس فنی",
            badge: "border-sky-500/40 bg-sky-500/15 text-sky-100",
          },
          client: {
            label: "مراجع",
            badge: "border-emerald-500/40 bg-emerald-500/15 text-emerald-100",
          },
        }[user.role]
      : undefined

  const renderNavigation = (closeOnSelect?: boolean) => (
    <div className="flex h-full flex-col bg-slate-900/95 text-slate-100 shadow-2xl dark:bg-slate-950/95" dir="rtl">
      <div className="border-b border-white/10 px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-bold shadow-lg">
            IT
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">{title ?? "سامانه مدیریت خدمات"}</p>
            <p className="text-xs text-slate-400">راهکار یکپارچه پشتیبانی</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-inner backdrop-blur">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name ?? "کاربر"} />
              <AvatarFallback>{user?.name?.slice(0, 2) ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <span className="block text-sm font-semibold text-slate-100">{user?.name ?? "کاربر مهمان"}</span>
              <span className="block text-xs text-slate-400">{user?.email ?? "برای دسترسی وارد شوید"}</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Badge
              variant="outline"
              className={cn(
                "w-full justify-center rounded-xl border-slate-600/40 bg-slate-800/40 text-xs font-medium text-slate-100",
                roleMeta?.badge,
              )}
            >
              {roleMeta?.label ?? "نقش تعیین نشده"}
            </Badge>
            {user?.department ? (
              <div className="rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-center text-[11px] text-slate-300">
                {user.department}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-8">
        <div className="space-y-1">
          {items.map((item) => {
            const hasChildren = Boolean(item.children?.length)
            const parentActive =
              item.key === activeKey || item.children?.some((child) => child.key === activeKey)
            const showChildren =
              hasChildren && (expandedItems[item.key] || hoveredItem === item.key || parentActive)

            return (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem((current) => (current === item.key ? null : current))}
                className="group rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => handleParentClick(item)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors",
                    parentActive
                      ? "bg-slate-800/90 text-slate-100 shadow-lg shadow-slate-900/40"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white",
                  )}
                >
                  <span className="flex flex-row-reverse items-center gap-3">
                    <item.icon className="h-4 w-4 opacity-80" />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {hasChildren ? (
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", showChildren ? "rotate-180" : "")}
                    />
                  ) : (
                    <ChevronLeft className="h-4 w-4 opacity-30" />
                  )}
                </button>

                {hasChildren ? (
                  <div
                    className={cn(
                      "mr-3 mt-2 flex flex-col gap-1 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 pr-3 pl-2 transition-all duration-200",
                      showChildren ? "max-h-96 py-3 opacity-100" : "max-h-0 py-0 opacity-0",
                    )}
                  >
                    {item.children?.map((child) => {
                      const childActive = child.key === activeKey
                      return (
                        <button
                          key={child.key}
                          type="button"
                          onClick={() => handleChildClick(child.key, closeOnSelect)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                            childActive
                              ? "bg-slate-800 text-white shadow shadow-slate-900/40"
                              : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                          )}
                        >
                          <span className="flex flex-row-reverse items-center gap-3">
                            {child.icon ? (
                              <child.icon className="h-4 w-4 opacity-80" />
                            ) : (
                              <ChevronLeft className="h-3.5 w-3.5 opacity-40" />
                            )}
                            <span>{child.label}</span>
                          </span>
                          <ChevronLeft className="h-3.5 w-3.5 opacity-20" />
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-[11px] text-slate-400">
        حالت نمایش فعال: {isDark ? "تاریک" : "روشن"}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden w-80 shrink-0 lg:flex">{renderNavigation()}</aside>

      <div className="flex flex-1 flex-col" dir="rtl">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">باز کردن منوی اصلی</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-0 bg-slate-950 p-0 text-slate-100 shadow-2xl">
                {renderNavigation(true)}
              </SheetContent>
            </Sheet>

            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">فضای کاری</span>
              <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {title ?? "سامانه پشتیبانی IT"}
              </h1>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="relative hidden w-full max-w-xs md:flex">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="جستجو در تیکت‌ها، کاربران یا دسته‌بندی‌ها"
                className="w-full rounded-2xl border border-slate-200 bg-white pe-10 ps-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full border border-transparent bg-white/60 text-slate-700 shadow-sm transition hover:border-slate-200 hover:bg-white dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                onClick={toggleTheme}
              >
                {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-transparent bg-white/60 text-slate-700 shadow-sm transition hover:border-slate-200 hover:bg-white dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sky-500" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full border border-transparent bg-white/60 text-slate-700 shadow-sm transition hover:border-slate-200 hover:bg-white dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 px-6 py-8 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  AlertCircle,
  Ticket,
  Send,
  Calendar,
  CheckCircle,
} from "lucide-react"

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

interface TechnicianDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  currentUser: any
}

export function TechnicianDashboard({ tickets, onTicketUpdate, currentUser }: TechnicianDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [responseStatus, setResponseStatus] = useState("")

  const technicianTickets = tickets.filter((ticket) => {
    return ticket.assignedTechnicianEmail === currentUser?.email
  })

  const filteredTickets = technicianTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const handleResponseTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setResponseStatus(ticket.status || "open")
    setResponseMessage("")
    setResponseDialogOpen(true)
  }

  const handleSubmitResponse = () => {
    if (!responseMessage.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً پیام پاسخ را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const response = {
      message: responseMessage,
      status: responseStatus,
      technicianName: currentUser?.name,
      technicianEmail: currentUser?.email,
      timestamp: new Date().toISOString(),
    }

    const updatedResponses = selectedTicket?.responses ? [...selectedTicket.responses, response] : [response]

    onTicketUpdate(selectedTicket.id, {
      status: responseStatus,
      responses: updatedResponses,
      updatedAt: new Date().toISOString(),
      lastResponseBy: currentUser?.name,
      lastResponseAt: new Date().toISOString(),
    })

    toast({
      title: "پاسخ ارسال شد",
      description: "پاسخ شما با موفقیت ثبت و در سیستم به‌روزرسانی شد",
    })

    setResponseDialogOpen(false)
    setResponseMessage("")
    setSelectedTicket(null)
  }

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold font-iran">پنل تکنسین</h2>
          <p className="text-muted-foreground font-iran">مدیریت و پاسخ‌دهی به تیکت‌های واگذار شده</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right font-iran">کل تیکت‌های من</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right font-iran">{technicianTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right font-iran">نیاز به پاسخ</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right font-iran">
              {technicianTickets.filter((t) => t.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right font-iran">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right font-iran">
              {technicianTickets.filter((t) => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right font-iran">حل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right font-iran">
              {technicianTickets.filter((t) => t.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-iran">تیکت‌های واگذار شده</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در تیکت‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right font-iran"
                dir="rtl"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
              <SelectTrigger className="text-right font-iran">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent className="font-iran">
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in-progress">در حال انجام</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
              <SelectTrigger className="text-right font-iran">
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent className="font-iran">
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterPriority("all")
              }}
              className="gap-2 font-iran"
            >
              <Filter className="w-4 h-4" />
              پاک کردن فیلترها
            </Button>
          </div>

          {/* Tickets Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right font-iran">شماره تیکت</TableHead>
                  <TableHead className="text-right font-iran">عنوان</TableHead>
                  <TableHead className="text-right font-iran">وضعیت</TableHead>
                  <TableHead className="text-right font-iran">اولویت</TableHead>
                  <TableHead className="text-right font-iran">دسته‌بندی</TableHead>
                  <TableHead className="text-right font-iran">درخواست‌کننده</TableHead>
                  <TableHead className="text-right font-iran">تاریخ ایجاد</TableHead>
                  <TableHead className="text-right font-iran">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm font-iran">{ticket.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate font-iran" title={ticket.title}>
                          {ticket.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[ticket.status]} font-iran`}>
                          {statusLabels[ticket.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${priorityColors[ticket.priority]} font-iran`}>
                          {priorityLabels[ticket.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-iran">{categoryLabels[ticket.category]}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs font-iran">{ticket.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-iran">{ticket.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-iran">
                        {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                            className="gap-1 font-iran"
                          >
                            <Eye className="w-3 h-3" />
                            مشاهده
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResponseTicket(ticket)}
                            className="gap-1 font-iran"
                          >
                            <MessageSquare className="w-3 h-3" />
                            پاسخ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground font-iran">
                          {technicianTickets.length === 0 ? "هیچ تیکتی به شما واگذار نشده است" : "تیکتی یافت نشد"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto font-iran" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-iran">جزئیات تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="flex justify-between items-start">
                <div className="text-right space-y-2">
                  <h3 className="text-xl font-semibold font-iran">{selectedTicket.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={`${statusColors[selectedTicket.status]} font-iran`}>
                      {statusLabels[selectedTicket.status]}
                    </Badge>
                    <Badge className={`${priorityColors[selectedTicket.priority]} font-iran`}>
                      {priorityLabels[selectedTicket.priority]}
                    </Badge>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm text-muted-foreground font-iran">شماره تیکت</p>
                  <p className="font-mono text-lg font-iran">{selectedTicket.id}</p>
                </div>
              </div>

              <Separator />

              {/* Ticket Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 font-iran">اطلاعات کلی</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">دسته‌بندی:</span>
                        <span className="font-iran">{categoryLabels[selectedTicket.category]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">زیر دسته:</span>
                        <span className="font-iran">{selectedTicket.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">تاریخ ایجاد:</span>
                        <span className="font-iran">
                          {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">آخرین به‌روزرسانی:</span>
                        <span className="font-iran">
                          {new Date(selectedTicket.updatedAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 font-iran">اطلاعات تماس</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">نام:</span>
                        <span className="font-iran">{selectedTicket.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">ایمیل:</span>
                        <span className="font-iran">{selectedTicket.clientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">تلفن:</span>
                        <span className="font-iran">{selectedTicket.clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">بخش:</span>
                        <span className="font-iran">{selectedTicket.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2 font-iran">شرح مشکل</h4>
                <div className="bg-muted p-4 rounded-lg text-right">
                  <p className="whitespace-pre-wrap font-iran">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2 font-iran">
                    <MessageSquare className="w-4 h-4" />
                    پاسخ‌ها و به‌روزرسانی‌ها
                  </h4>
                  <div className="space-y-4">
                    {selectedTicket.responses.map((response: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs font-iran">
                                {response.technicianName?.charAt(0) || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm font-iran">{response.technicianName}</span>
                          </div>
                          <div className="text-left">
                            <Badge className={`${statusColors[response.status]} mb-1 font-iran`}>
                              {statusLabels[response.status]}
                            </Badge>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-iran">
                              <Calendar className="w-3 h-3" />
                              {new Date(response.timestamp).toLocaleDateString("fa-IR")} -
                              {new Date(response.timestamp).toLocaleTimeString("fa-IR")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded text-right">
                          <p className="whitespace-pre-wrap font-iran">{response.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-2xl font-iran" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-iran">پاسخ به تیکت {selectedTicket?.id}</DialogTitle>
            <DialogDescription className="text-right font-iran">
              پاسخ خود را وارد کرده و وضعیت تیکت را به‌روزرسانی کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Ticket Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium font-iran">{selectedTicket?.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 font-iran">درخواست‌کننده: {selectedTicket?.clientName}</p>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium font-iran">وضعیت جدید تیکت</label>
              <Select value={responseStatus} onValueChange={setResponseStatus} dir="rtl">
                <SelectTrigger className="text-right font-iran">
                  <SelectValue placeholder="انتخاب وضعیت جدید" />
                </SelectTrigger>
                <SelectContent className="font-iran">
                  <SelectItem value="open">باز</SelectItem>
                  <SelectItem value="in-progress">در حال انجام</SelectItem>
                  <SelectItem value="resolved">حل شده</SelectItem>
                  <SelectItem value="closed">بسته</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Response Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium font-iran">پیام پاسخ</label>
              <Textarea
                placeholder="پاسخ خود را اینجا بنویسید..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="min-h-[120px] text-right font-iran"
                dir="rtl"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)} className="font-iran">
                انصراف
              </Button>
              <Button onClick={handleSubmitResponse} className="gap-2 font-iran">
                <Send className="w-4 h-4" />
                ارسال پاسخ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

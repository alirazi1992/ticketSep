"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Controller } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, CheckCircle, FolderOpen, FileText, User } from "lucide-react"

import { TicketFormStep1 } from "@/components/ticket-form-step1"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { issueSelectionSchema, ticketDetailsSchema } from "@/lib/validation-schemas"
import { useAuth } from "@/lib/auth-context"
import type { UploadedFile } from "@/lib/file-upload"

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

interface TwoStepTicketFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  categoriesData: any
}

export function TwoStepTicketForm({ onClose, onSubmit, categoriesData }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(currentStep === 1 ? issueSelectionSchema : ticketDetailsSchema),
    defaultValues: {
      
      priority: "",
      mainIssue: "",
      subIssue: "",

      
      title: "",
      description: "",

      
      deviceBrand: "",
      deviceModel: "",
      powerStatus: "",
      lastWorking: "",
      printerBrand: "",
      printerType: "",
      printerProblem: "",
      monitorSize: "",
      connectionType: "",
      displayIssue: "",
      operatingSystem: "",
      osVersion: "",
      osIssueType: "",
      softwareName: "",
      softwareVersion: "",
      applicationIssue: "",
      internetProvider: "",
      connectionIssue: "",
      wifiNetwork: "",
      deviceType: "",
      wifiIssue: "",
      networkLocation: "",
      emailProvider: "",
      emailClient: "",
      errorMessage: "",
      emailAddress: "",
      incidentTime: "",
      securitySeverity: "",
      affectedData: "",
      requestedSystem: "",
      accessLevel: "",
      accessReason: "",
      urgencyLevel: "",
      trainingTopic: "",
      currentLevel: "",
      preferredMethod: "",
      equipmentType: "",
      maintenanceType: "",
      preferredTime: "",
    },
  })

  
  const watchedValues = watch()

  const handleNext = async () => {
    const isValid = await trigger()
    if (isValid) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      
      const ticketId = `TK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`

      
      // Extract dynamic fields: map keys starting with dyn_ to clean IDs
      const dynEntries = Object.entries(data)
        .filter(([k, v]) => k.startsWith("dyn_") && v !== undefined && v !== "")
        .map(([k, v]) => [k.replace(/^dyn_/, ""), v])

      const ticketData = {
        id: ticketId,
        title: data.title,
        description: data.description,
        status: "open",
        priority: data.priority,
        category: data.mainIssue,
        subCategory: data.subIssue,
        clientName: user?.name || "",
        clientEmail: user?.email || "",
        clientPhone: user?.phone || "",
        createdAt: new Date().toISOString(),
        attachments: attachedFiles,
        dynamicFields: {
          // New dynamic fields (admin-defined)
          ...Object.fromEntries(dynEntries),
          // Legacy fields fallback (keep any remaining non-base values)
          ...Object.fromEntries(
            Object.entries(data).filter(
              ([key, value]) =>
                value &&
                !key.startsWith("dyn_") &&
                ![
                  "title",
                  "description",
                  "priority",
                  "mainIssue",
                  "subIssue",
                  "clientName",
                  "clientEmail",
                  "clientPhone",
                ].includes(key),
            ),
          ),
        },
      }

      onSubmit(ticketData)

      toast({
        title: "تیکت با موفقیت ثبت شد",
        description: `شماره تیکت شما: ${ticketId}`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "خطا در ثبت تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    }
  }

  const renderContactInfo = () => (null as any /*
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <User className="w-5 h-5" />
          اطلاعات تماس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-right">
            نام و نام خانوادگی *
          </Label>
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="نام کامل خود را وارد کنید" className="text-right" dir="rtl" />
            )}
          />
          {errors.clientName && <p className="text-sm text-red-500 text-right">{errors.clientName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientEmail" className="text-right">
              ایمیل *
            </Label>
            <Controller
              name="clientEmail"
              control={control}
              render={({ field }) => (
                <Input {...field} type="email" placeholder="email@example.com" className="text-right" dir="rtl" />
              )}
            />
            {errors.clientEmail && <p className="text-sm text-red-500 text-right">{errors.clientEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="text-right">
              شماره تماس *
            </Label>
            <Controller
              name="clientPhone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="09123456789" className="text-right" dir="rtl" />}
            />
            {errors.clientPhone && <p className="text-sm text-red-500 text-right">{errors.clientPhone.message}</p>}
          </div>
        </div>

        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 text-right">
              <strong>توجه:</strong> اطلاعات تماس از پروفایل شما تکمیل شده است. در صورت نیاز می‌توانید آن‌ها را ویرایش
              کنید.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  */)

  const renderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <CheckCircle className="w-5 h-5" />
          خلاصه انتخاب‌های شما
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Information hidden */}{false && (
        <div className="space-y-2">
          <h4 className="font-medium text-right flex items-center gap-2">
            <User className="w-4 h-4" />
            اطلاعات تماس
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">نام:</span>
              <span className="text-sm font-medium">{watchedValues.clientName || "وارد نشده"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">تلفن:</span>
              <span className="text-sm font-medium">{watchedValues.clientPhone || "وارد نشده"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ایمیل:</span>
              <span className="text-sm font-medium">{watchedValues.clientEmail || "وارد نشده"}</span>
            </div>
          </div>
        </div>

        )}

        <Separator />

        {/* Issue Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-right flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            اطلاعات مشکل
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">اولویت:</span>
              <Badge variant="outline" className="text-xs">
                {watchedValues.priority ? priorityLabels[watchedValues.priority] : "انتخاب نشده"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">مشکل اصلی:</span>
              <span className="text-sm font-medium">
                {watchedValues.mainIssue && categoriesData[watchedValues.mainIssue]
                  ? categoriesData[watchedValues.mainIssue].label
                  : "انتخاب نشده"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">زیر دسته:</span>
              <span className="text-sm font-medium">
                {watchedValues.mainIssue &&
                watchedValues.subIssue &&
                categoriesData[watchedValues.mainIssue]?.subIssues[watchedValues.subIssue]
                  ? categoriesData[watchedValues.mainIssue].subIssues[watchedValues.subIssue].label
                  : "انتخاب نشده"}
              </span>
            </div>
          </div>
        </div>

        {currentStep === 2 && watchedValues.title && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right flex items-center gap-2">
                <FileText className="w-4 h-4" />
                جزئیات تیکت
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">عنوان:</span>
                  <span className="text-sm font-medium text-right max-w-xs">{watchedValues.title}</span>
                </div>
                {watchedValues.description && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">شرح:</span>
                    <span className="text-sm text-right max-w-xs line-clamp-3">{watchedValues.description}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {attachedFiles.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right">فایل‌های پیوست</h4>
              <div className="space-y-1">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="text-sm text-muted-foreground text-right">
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
          </div>
          <span className="mr-2 text-sm font-medium">انتخاب مشکل</span>
        </div>

        <div className={`w-12 h-0.5 ${currentStep >= 2 ? "bg-primary" : "bg-muted-foreground"}`} />

        <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm font-medium">جزئیات تیکت</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {}
            {/* contact info removed */}

            {/* Step Content */}
            {currentStep === 1 && <TicketFormStep1 control={control} errors={errors} categoriesData={categoriesData} />}

            {currentStep === 2 && (
              <TicketFormStep2
                control={control}
                errors={errors}
                selectedIssue={watchedValues.mainIssue}
                selectedSubIssue={watchedValues.subIssue}
                categoriesData={categoriesData}
                attachedFiles={attachedFiles}
                onFilesChange={setAttachedFiles}
              />
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">{renderSummary()}</div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            {currentStep === 2 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronRight className="w-4 h-4 ml-1" />
                مرحله قبل
              </Button>
            )}
          </div>

          <div>
            {currentStep === 1 ? (
              <Button type="button" onClick={handleNext}>
                مرحله بعد
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "در حال ثبت..." : "ثبت تیکت"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

"use client";

import type * as React from "react";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ExportToPdf from "./ExportToPdf";
import { useTranslations } from "next-intl";

// This is a placeholder for your actual ExportToPdf component
// Replace this with your actual implementation

interface ExportPdfModalProps {
  course: any;
  t: (key: string) => string;
}

export function ExportPdfModal({ course }: ExportPdfModalProps) {
  const t = useTranslations();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("exportPdf")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("exportPdfOptions")}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="arabic">Arabic</TabsTrigger>
          </TabsList>

          {/* English Tab Content */}
          <TabsContent value="english" className="space-y-2 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="all" course={course} isArabic={false} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfAllDetails")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="withoutPrice" course={course} isArabic={false} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfWithoutPrice")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="withoutCity" course={course} isArabic={false} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfWithoutCity")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsContent>

          {/* Arabic Tab Content */}
          <TabsContent value="arabic" className="space-y-2 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="all" course={course} isArabic={true} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfAllDetails")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="withoutPrice" course={course} isArabic={true} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfWithoutPrice")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExportToPdf type="withoutCity" course={course} isArabic={true} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("exportPdfWithoutCity")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

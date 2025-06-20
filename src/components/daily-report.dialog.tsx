"use client"

import { DownloadIcon, Loader2Icon, PrinterIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { formatFullDatePtBr } from "../util/date.util";
import { ReportService } from "../services/report.service";
import { PeriodFilter } from "../types/period-filter";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis } from "recharts";
import { ScrollArea } from "./ui/scroll-area";

const DailyReport = () => {
    const date = new Date();
    const reportService = new ReportService();
    const { isLoading, data: report } = useQuery({
        queryKey: ['report-daily'],
        queryFn: () => reportService.generateReport(undefined, PeriodFilter.TODAY),
    });
    const chartData = report ? [
        { appointment: report!.appointmentCount },
        { task: report!.taskCount },
        { event: report!.eventCount },
        { document: report!.documentCount },
        { newAssociate: report!.newAssociateCount },
        { associate: report!.associateCount },
        { lawsuit: report!.lawsuitCount },
    ] : [];
    const chartConfig = {
        appointment: {
            label: "Atendimentos",
            color: "#2563eb",
        },
        task: {
            label: "Tarefas",
            color: "#22c55e",
        },
        event: {
            label: "Eventos",
            color: "#f97316",
        },
        document: {
            label: "Documentos",
            color: "#9333ea",
        },
        newAssociate: {
            label: "Novos Associados",
            color: "red",
        },
        associate: {
            label: "Total Associados",
            color: "green",
        },
        lawsuit: {
            label: "Processos",
            color: "#eab308",
        },
    } satisfies ChartConfig;

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline">
                    <DownloadIcon />
                    Download Relatório Diário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[950px] sm:max-h-[90vh] px-0">
                <DialogHeader className="px-6">
                    <DialogTitle>Relatório Diário - {formatFullDatePtBr(date)}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[75vh] px-6">
                    <div>
                        {isLoading && <div className="flex justify-center items-center">
                            <Loader2Icon className="animate-spin" />
                        </div>}
                        {
                            !isLoading && report && date && <>
                                <div className="flex items-center">
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Atendimentos
                                        </h1>
                                        Total: {report.appointmentCount}
                                    </div>
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Tarefas
                                        </h1>
                                        Total: {report.taskCount}
                                    </div>
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Eventos
                                        </h1>
                                        Total: {report.eventCount}
                                    </div>
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Documentos
                                        </h1>
                                        Total: {report.documentCount}
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Novos Associados
                                        </h1>
                                        Total: {report.newAssociateCount}
                                    </div>
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Total de Associados
                                        </h1>
                                        Total: {report.associateCount}
                                    </div>
                                    <div className="w-1/4">
                                        <h1 className="text-xl font-bold">
                                            Processos Registrados
                                        </h1>
                                        Total: {report.lawsuitCount}
                                    </div>
                                    <div className="w-1/4">
                                    </div>
                                </div>
                                <div>
                                    <h1 className="mt-4 text-xl font-bold">
                                        Total de Registros:
                                    </h1>
                                    <div>
                                        Atendimentos: {report.appointmentCount}
                                    </div>
                                    <div>
                                        Tarefas: {report.taskCount}
                                    </div>
                                    <div>
                                        Eventos: {report.eventCount}
                                    </div>
                                    <div>
                                        Documentos: {report.documentCount}
                                    </div>
                                    <div>
                                        Novos Associados: {report.newAssociateCount}
                                    </div>
                                    <div>
                                        Total Associados: {report.associateCount}
                                    </div>
                                    <div>
                                        Processos Registrados: {report.lawsuitCount}
                                    </div>
                                </div>
                            </>
                        }
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-5">
                            <BarChart accessibilityLayer data={chartData}>
                                <YAxis
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <CartesianGrid vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="appointment" fill="var(--color-appointment)" barSize={30} radius={2} />
                                <Bar dataKey="task" fill="var(--color-task)" barSize={30} radius={2} />
                                <Bar dataKey="event" fill="var(--color-event)" barSize={30} radius={2} />
                                <Bar dataKey="document" fill="var(--color-document)" barSize={30} radius={2} />
                                <Bar dataKey="associate" fill="var(--color-associate)" barSize={30} radius={2} />
                                <Bar dataKey="lawsuit" fill="var(--color-lawsuit)" barSize={30} radius={2} />
                                <Bar dataKey="newAssociate" fill="var(--color-newAssociate)" barSize={30} radius={2} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </ScrollArea>
                <DialogFooter className="px-6">
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                    <Button onClick={() => { window.print(); }}>
                        <PrinterIcon />
                        Imprimir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DailyReport;

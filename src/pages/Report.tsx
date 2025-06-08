"use client"

import { CalendarIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatFullDatePtBr } from "../util/date.util";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";
import React from "react";
import { Calendar } from "../components/ui/calendar";
import { pt } from "date-fns/locale";
import { ReportService } from "../services/report.service";
import { Report } from "../types/report";
import MonthlyReport from "../components/monthly-report.dialog";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis } from "recharts";
import DailyReport from "../components/daily-report.dialog";

const ReportPage = () => {
    const reportService = new ReportService();
    const [date, setDate] = React.useState<Date>();
    const [report, setReport] = React.useState<Report>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const chartData = report ? [
        { appointment: report!.appointmentCount },
        { task: report!.taskCount },
        { event: report!.eventCount },
        { document: report!.documentCount },
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
        associate: {
            label: "Associados",
            color: "red",
        },
        lawsuit: {
            label: "Processos",
            color: "#eab308",
        },
    } satisfies ChartConfig;

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const response = await reportService.generateReport(date);
            setReport(response);
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Header back />
            <div className="flex flex-col items-center justify-center mt-4">
                <Card className="w-full">
                    <CardContent>
                        <div className="flex gap-2 items-end">
                            <div className="w-full">
                                <Label>Data do Relatório</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[210px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? formatFullDatePtBr(date) : <span>Selecione uma data</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            locale={pt}
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <DailyReport />
                            <MonthlyReport />
                            <Button onClick={handleGenerateReport} disabled={loading}>
                                {loading ? (
                                    <span className="animate-spin">
                                        <Loader2Icon />
                                    </span>
                                ) : (
                                    <DownloadIcon />
                                )}
                                {loading ? "Gerando..." : "Gerar Relatório"}
                            </Button>
                        </div>
                        {
                            report && date && <>
                                <h1 className="mt-4 text-2xl font-bold">
                                    Relatório do Dia - {formatFullDatePtBr(date)}
                                </h1>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Atendimentos
                                        </h1>
                                        Total: {report.appointmentCount}
                                    </div>
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Tarefas
                                        </h1>
                                        Total: {report.taskCount}
                                    </div>
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Eventos
                                        </h1>
                                        Total: {report.eventCount}
                                    </div>
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Documentos
                                        </h1>
                                        Total: {report.documentCount}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Novos Associados
                                        </h1>
                                        Total: {report.associateCount}
                                    </div>
                                    <div className="w-15">
                                    </div>
                                    <div>
                                        <h1 className="mt-4 text-xl font-bold">
                                            Processos Registrados
                                        </h1>
                                        Total: {report.lawsuitCount}
                                    </div>
                                    <div></div>
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
                                        Novos Associados: {report.associateCount}
                                    </div>
                                    <div>
                                        Processos Registrados: {report.lawsuitCount}
                                    </div>
                                </div>
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
                                    </BarChart>
                                </ChartContainer>
                            </>
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReportPage;

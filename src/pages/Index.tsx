import { ChartBar, Download, FileText, ListTodo, Upload, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Link } from "react-router-dom";
import { Header } from "../components/header";

const Index = () => {
  const events = [
    { title: 'Meeting', start: new Date() }
  ]
  const navItems = [
    {
      title: "Agenda",
      url: "/agenda",
      icon: ChartBar,
    },
    {
      title: "Atendimentos",
      url: "/appointment",
      icon: Users,
    },
    {
      title: "Registros de Processos",
      url: "/proceeding",
      icon: FileText,
    },
    {
      title: "Painel de Tarefas",
      url: "#",
      icon: ListTodo,
    },
    {
      title: "Relatório",
      url: "#",
      icon: ChartBar,
    },
    {
      title: "Área Associados",
      url: "#",
      icon: Users,
    },
  ];
  const footerItems = [
    {
      title: "Links Úteis",
      url: "#",
      icon: Download,
    }, {
      title: "Exportar Dados",
      url: "#",
      icon: Download,
    }, {
      title: "Importar Dados",
      url: "#",
      icon: Upload,
    },
  ]

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  return (
    <div>
      <Header/>
      <nav className="flex bg-[#E5EEF1] p-4 items-center justify-between">
        {navItems.map((item) => (
          <div key={item.title}>
            <Link to={item.url}>
              <Button size="lg" variant="outline" className="border-2 border-[#61A5C2] justify-start rounded-full bg-white hover:bg-[#267393] hover:text-white text-[#267393]">
                <item.icon />
                {item.title}
              </Button>
            </Link>
          </div>
        ))}
      </nav>
      <div className="m-5">
        <Card className="p-6">
          <FullCalendar
            locale={"pt-br"}
            plugins={[dayGridPlugin]}
            initialView='dayGridMonth'
            weekends={false}
            events={events}
            eventContent={renderEventContent}
          />
        </Card>
      </div>
      <footer className="flex bg-[#E5EEF1] p-4 items-center justify-center gap-10">
        {footerItems.map((item) => (
          <div key={item.title}>
            <Button size="lg" variant="outline" className="border-2 border-[#61A5C2] justify-start rounded-full bg-white hover:bg-[#267393] hover:text-white text-[#267393]">
              <item.icon />
              {item.title}
            </Button>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default Index;

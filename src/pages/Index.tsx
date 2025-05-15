import { Button } from "../components/ui/button";
import { CakeIcon, ChartBar, EyeOffIcon, FileText, LinkIcon, ListTodo, Loader2Icon, TriangleAlertIcon, Users, UsersIcon } from "lucide-react";
import { Card } from "../components/ui/card";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { useQuery } from "@tanstack/react-query";
import { AssociateService } from "../services/associate.service";
import { EventService } from "../services/event.service";
import { combineIsoDateAndTime, formatDateToPtBr, getDateDifference, getStringDateDifference } from "../util/date.util";
import { useEffect, useState } from "react";
import { toast, ToastContainer, ToastContentProps } from 'react-toastify';
import { Input } from "../components/ui/input";
import { Associate } from "../types/associate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { EducationLevel } from "../types/education-level";
import AssociateFullDetails from "../components/associate-full-details.dialog";
import { DocumentType } from "../types/document-type";

const Index = () => {
  const events: { title: string, start: Date }[] = [];
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [associateSearched, setAssociateSearched] = useState(false);
  const [filterValue, setFilterValue] = useState("name");
  const [associateList, setAssociateList] = useState<Associate[]>([]);
  const navigate = useNavigate();
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
      url: "/lawsuit",
      icon: FileText,
    },
    {
      title: "Painel de Tarefas",
      url: "/tasks",
      icon: ListTodo,
    },
    {
      title: "Relatório",
      url: "/report",
      icon: ChartBar,
    },
    {
      title: "Área Associados",
      url: "/associate",
      icon: Users,
    },
  ];
  const associateService = new AssociateService();
  const eventService = new EventService();
  const { data: associateBirthdayList } = useQuery({
    queryKey: ['associates-birthday'],
    queryFn: () => associateService.getTomorrowBirthday(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  const { data: expirationDocumentList } = useQuery({
    queryKey: ['associates-document-expiration'],
    queryFn: () => associateService.getExpirationDocuments(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  const { data: eventList } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.filter(),
  });

  if (eventList != null && eventList.data.length > 0) {
    eventList.data.map((item) => {
      events.push({
        title: item.name,
        start: combineIsoDateAndTime(item.date, item.time),
      });
    });
  }

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  const expirationDocumentToast = ({ closeToast }: ToastContentProps) => <div className="w-full">
    <div className="flex items-center gap-2">
      <TriangleAlertIcon />
      Documentos a Expirar
    </div>
    <div>
      {expirationDocumentList != null && expirationDocumentList.map((item) => (
        <div className="flex border-b-2 border-b-gray-200 mt-3 py-2 items-center gap-2" key={item.id}>
          <div key={item.id} className="flex flex-col text-sm">
            <span className="font-bold text-foreground">
              {item.fullName}
            </span>
            Validade do CC: {formatDateToPtBr(new Date(item.documentExpirationDate!))}
          </div>
          <div className={`text-xs text-white ml-auto font-bold bg-red-500 rounded-md p-1 ${getDateDifference(new Date(item.documentExpirationDate!)) <= 15 ? "bg-red-500" : "bg-yellow-500"}`}>
            Vence {getStringDateDifference(new Date(item.documentExpirationDate!))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-2 mt-3">
      <Button onClick={() => { localStorage.setItem("expirationDocumentNotifications", "false"); closeToast(); }} variant="outline">
        <EyeOffIcon />
        Não mostrar novamente
      </Button>
      <Button onClick={() => navigate("/associate")}>
        <UsersIcon />
        Ver associados
      </Button>
    </div>
  </div>

  const birthdayAssociateToast = ({ closeToast }: ToastContentProps) => <div className="w-full">
    <div className="flex items-center gap-2">
      <CakeIcon />
      Aniversariantes Amanhã
    </div>
    <div className="text-foreground font-bold mt-4">
      {associateBirthdayList != null && associateBirthdayList.map((items) => items.fullName).join(", ")}
    </div>
    <div className="flex justify-end gap-2 mt-3">
      <Button onClick={() => { localStorage.setItem("birthdayNotifications", "false"); closeToast(); }} variant="outline">
        <EyeOffIcon />
        Não mostrar novamente
      </Button>
      <Button onClick={() => navigate("/associate")}>
        <UsersIcon />
        Ver associados
      </Button>
    </div>
  </div>

  useEffect(() => {
    if (localStorage.getItem("birthdayNotifications") === "true") {
      if (associateBirthdayList != null && associateBirthdayList.length >= 1) {
        toast(birthdayAssociateToast, {
          position: "top-right",
          hideProgressBar: true,
          theme: localStorage.getItem("vite-ui-theme") === "dark" ? "dark" : "light",
          autoClose: false,
          className: 'react-toastify-width',
        });
      }
    }
  }, [associateBirthdayList]);

  useEffect(() => {
    if (localStorage.getItem("expirationDocumentNotifications") === "true") {
      if (expirationDocumentList != null && expirationDocumentList.length >= 1) {
        toast(expirationDocumentToast, {
          position: "top-right",
          hideProgressBar: true,
          theme: localStorage.getItem("vite-ui-theme") === "dark" ? "dark" : "light",
          autoClose: false,
          className: 'react-toastify-width',
        });
      }
    }
  }, [expirationDocumentList]);

  const filterAssociates = async () => {
    setLoading(true);
    switch (filterValue) {
      case "name":
        setAssociateList(await associateService.filterAll(search));
        break;
      case "phone":
        setAssociateList(await associateService.filterAll(undefined, search));
        break;
      case "associateNumber":
        setAssociateList(await associateService.filterAll(undefined, undefined, search));
        break;
      default:
        setAssociateList(await associateService.filterAll(search));
        break;
    }
    setAssociateSearched(true);
    setLoading(false);
  }

  useEffect(() => {
    if (search.length >= 1) {
      const timeout = setTimeout(() => filterAssociates(), 500);
      return () => clearTimeout(timeout);
    } else {
      setAssociateList([]);
      setAssociateSearched(false);
    }
  }, [search]);

  useEffect(() => {
    if (search.length >= 1) {
      filterAssociates();
    } else {
      setAssociateList([]);
      setAssociateSearched(false);
    }
  }, [filterValue]);

  return (
    <div>
      <ToastContainer autoClose={false} />
      <Header />
      <nav className="flex bg-card p-4 items-center justify-between">
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
      <div className="flex justify-between items-center mt-5 gap-10">
        <Input onChange={(e) => setSearch(e.target.value)} placeholder="Buscar associados..." />
        <Select onValueChange={setFilterValue} defaultValue="name">
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Selecione o tipo de filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">
              Nome
            </SelectItem>
            <SelectItem value="phone">
              Telemóvel
            </SelectItem>
            <SelectItem value="associateNumber">
              Número de Associado
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading && (
        <div className="flex mt-5 flex-col items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
      {associateSearched && !loading && associateList.length === 0 && (
        <div className="flex mt-5 flex-col items-center justify-center">
          <UsersIcon />
          <span className="text-foreground font-bold">Nenhum associado encontrado</span>
        </div>
      )}
      {!loading && associateList.length > 0 && (
        <div>
          {associateList.map((item) => (
            <div className="flex flex-col mt-2">
              <div className="font-bold flex items-center justify-between text-foreground">
                {item.fullName}
                <AssociateFullDetails associate={item} />
              </div>
              <div key={item.id} className="flex border-b-2 border-b-gray-200 items-center gap-2">
                <div key={item.id} className="flex flex-col w-4/12 text-sm">
                  <span>
                    <b>Género:</b> {item.gender == 'MASCULINE' ? "Masculino" : "Feminino"}
                  </span>
                  <span>
                    <b>Telemóvel:</b> {item.phone}
                  </span>
                  <span>
                    <b>Email:</b> {item.email}
                  </span>
                </div>
                <div className='flex flex-col text-sm w-4/12'>
                  <span>
                    <b>Escolaridade:</b> {EducationLevel[item.educationLevel as keyof typeof EducationLevel]}
                  </span>
                  <span>
                    <b>Data de Nascimento:</b> {formatDateToPtBr(new Date(item.birthday))}
                  </span>
                  <span>
                    <b>Número de Associado:</b> {item.associateNumber ?? "N/A"}
                  </span>
                </div>
                <div className='flex flex-col text-sm w-4/12'>
                  <span>
                    <b>Número do Documento:</b> {item.document ?? "N/A"}
                  </span>
                  <span>
                    <b>Data de Validade:</b> {item.documentExpirationDate != null ? formatDateToPtBr(new Date(item.documentExpirationDate)) : "N/A"}
                  </span>
                  <span>
                    <b>Tipo de documento:</b> {item.documentType ? DocumentType[item.documentType as unknown as keyof typeof DocumentType] : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="m-5">
        <Card className="p-6">
          <FullCalendar
            locale={"pt-br"}
            plugins={[dayGridPlugin]}
            initialView='dayGridMonth'
            events={events}
            eventContent={renderEventContent}
            eventClick={() => {
              navigate("/agenda");
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Index;

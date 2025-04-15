import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button } from "../components/ui/button";

const Index = () => {
  const { token } = useAuth();

  const getUsers = () => {
    console.log(token)
  }
  return (
    <div className="container-fluid">
      <header className="app-header">
        <div className="header-logo-container">
          <img className='align-self-center' src='logo.png' width={1000} height={1000}></img>
        </div>
        <h1>Assistente ADEP</h1>
      </header>
      <nav className="main-navigation">
        <div className="nav-buttons">
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-calendar"></i> Agenda
          </Link>
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-users"></i> Atendimentos
          </Link>
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-file-alt"></i> Registo de Processos
          </Link>
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-tasks"></i> Painel de Tarefas
          </Link>
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-chart-bar"></i> Relatório
          </Link>
          <Link to="/agenda" className="nav-button">
            <i className="fas fa-users"></i> Área Associados
          </Link>
          <Button onClick={getUsers}>
            Teste
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;

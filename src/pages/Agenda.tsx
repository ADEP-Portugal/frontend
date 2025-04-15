const Agenda = () => {
    return (
        <div>
            <div className="container-fluid">
                <header className="app-header">
                    <a href="/" className="back-button">
                        <i className="fas fa-arrow-left"></i>
                    </a>
                    <h1>Agenda - ADEP Assistente</h1>
                </header>

                <main id="agenda-content" className="app-content">
                    <div className="agenda-container">
                        <div className="agenda-header">
                            <button type="button" className="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fas fa-plus-circle"></i> Adicionar Evento
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form id="evento-form">
                                                <div className="row">
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label">Título do Evento</label>
                                                        <input type="text" className="form-control" id="titulo" required />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Data</label>
                                                        <input type="date" className="form-control" id="data" required />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Hora</label>
                                                        <input type="time" className="form-control" id="hora" required />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label">Local</label>
                                                        <input type="text" className="form-control" id="local" required />
                                                    </div>
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label">Descrição</label>
                                                        <textarea className="form-control" id="descricao" rows={3}></textarea>
                                                    </div>
                                                </div>
                                                <div id="error-message" className="error-message"></div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                <i className="fas fa-times"></i> Cancelar
                                            </button>
                                            <button type="button" id="salvar-evento" className="btn btn-primary">
                                                <i className="fas fa-save"></i> Salvar Evento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="agenda-filters">
                                <input type="text" id="search-eventos" className="form-control" placeholder="Buscar eventos..." />
                                <select id="filter-eventos" className="form-select">
                                    <option value="">Todos os Eventos</option>
                                    <option value="hoje">Hoje</option>
                                    <option value="esta-semana">Esta Semana</option>
                                    <option value="este-mes">Este Mês</option>
                                </select>
                            </div>
                        </div>

                        <div id="lista-eventos" className="eventos-grid">
                        </div>
                    </div>
                </main>
            </div>

            <div className="modal fade" id="eventoModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Adicionar Novo Evento</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form id="evento-form">
                                <div id="error-message" className="error-message"></div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" id="salvar-evento" className="btn btn-primary">
                                <i className="fas fa-save"></i> Salvar Evento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Agenda;

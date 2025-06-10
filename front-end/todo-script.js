document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://localhost:8181/tarefas";
  const taskForm = document.getElementById("todo-form");
  const taskTitleInput = document.getElementById("task-title-input");
  const taskDescInput = document.getElementById("task-desc-input");
  const prioritySelect = document.getElementById("priority-select");
  const taskList = document.getElementById("todo-list");
  const taskCount = document.getElementById("task-count");
  const filterSelect = document.getElementById("filter-select");

  // Carregar tarefas ao iniciar
  loadTasks();

  // Adicionar nova tarefa
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = taskTitleInput.value.trim();
    const descricao = taskDescInput.value.trim();
    const prioridade = prioritySelect.value;

    if (titulo) {
      await addTask({
        titulo,
        descricao: descricao || null,
        prioridade,
        concluida: false,
        dataCriacao: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      });
      resetForm();
      loadTasks();
    }
  });

  // Filtro de tarefas
  filterSelect.addEventListener("change", loadTasks);

  // Função para resetar o formulário
  function resetForm() {
    taskTitleInput.value = "";
    taskDescInput.value = "";
    prioritySelect.value = "media";
    taskTitleInput.focus();
  }

  // Carregar tarefas da API
  async function loadTasks() {
    try {
      showLoading(true);
      const response = await fetch(`${API_BASE_URL}/buscarTodos`);
      if (!response.ok) throw new Error("Erro ao carregar tarefas");

      let tarefas = await response.json();

      // Aplicar filtro
      tarefas = applyFilter(tarefas, filterSelect.value);

      renderTasks(tarefas);
      updateTaskCount(tarefas);
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao carregar tarefas", "error");
    } finally {
      showLoading(false);
    }
  }

  // Aplicar filtro às tarefas
  function applyFilter(tarefas, filter) {
    switch (filter) {
      case "pendentes":
        return tarefas.filter((t) => !t.concluida);
      case "concluidas":
        return tarefas.filter((t) => t.concluida);
      case "alta":
      case "media":
      case "baixa":
        return tarefas.filter((t) => t.prioridade === filter);
      default:
        return tarefas;
    }
  }

  // Renderizar tarefas na tela
  function renderTasks(tarefas) {
    taskList.innerHTML = "";

    if (tarefas.length === 0) {
      taskList.innerHTML =
        '<li class="no-tasks">Nenhuma tarefa encontrada</li>';
      return;
    }

    tarefas.forEach((tarefa) => {
      const taskItem = document.createElement("li");
      taskItem.className = `task-item priority-${tarefa.prioridade}`;
      taskItem.dataset.id = tarefa.id;

      if (tarefa.concluida) {
        taskItem.classList.add("completed");
      }

      taskItem.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${
                      tarefa.concluida ? "checked" : ""
                    }>
                    <span class="task-title">${tarefa.titulo}</span>
                    <span class="task-priority ${tarefa.prioridade}">
                        ${getPriorityLabel(tarefa.prioridade)}
                    </span>
                </div>
                ${
                  tarefa.descricao
                    ? `<div class="task-desc">${tarefa.descricao}</div>`
                    : ""
                }
                <div class="task-footer">
                    <span class="task-date">
                        Criada em: ${formatDate(tarefa.dataCriacao)}
                        ${
                          tarefa.dataConclusao
                            ? ` | Concluída em: ${formatDate(
                                tarefa.dataConclusao
                              )}`
                            : ""
                        }
                    </span>
                    <div class="task-actions">
                        <button class="edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;

      taskList.appendChild(taskItem);
    });

    addTaskEventListeners();
  }

  // Adicionar nova tarefa
  async function addTask(tarefa) {
    try {
      const response = await fetch(`${API_BASE_URL}/salvar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefa),
      });

      if (!response.ok) throw new Error("Erro ao adicionar tarefa");

      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao adicionar tarefa", "error");
      throw error;
    }
  }

  // Atualizar tarefa
  async function updateTask(tarefa) {
    try {
      const response = await fetch(`${API_BASE_URL}/editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefa),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tarefa");

      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao atualizar tarefa", "error");
      throw error;
    }
  }

  // Deletar tarefa
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/deletar/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar tarefa");

      return true;
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao deletar tarefa", "error");
      return false;
    }
  }

  // Buscar tarefa por ID
  async function getTaskById(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/buscarPorId/${taskId}`);
      if (!response.ok) throw new Error("Tarefa não encontrada");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao carregar tarefa", "error");
      return null;
    }
  }

  // Adicionar event listeners para as ações
  function addTaskEventListeners() {
    // Checkbox - Alternar status
    document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const taskItem = e.target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        const tarefa = await getTaskById(taskId);
        if (!tarefa) return;

        // Atualizar status
        tarefa.concluida = e.target.checked;
        tarefa.dataConclusao = tarefa.concluida
          ? new Date().toISOString().split("T")[0]
          : null;

        await updateTask(tarefa);
        loadTasks();
      });
    });

    // Botão de deletar
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const taskId = e.target.closest(".task-item").dataset.id;
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
          const success = await deleteTask(taskId);
          if (success) loadTasks();
        }
      });
    });

    // Botão de editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const taskItem = e.target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        const tarefa = await getTaskById(taskId);
        if (!tarefa) return;

        // Criar formulário de edição
        const editForm = document.createElement("div");
        editForm.className = "edit-form";
        editForm.innerHTML = `
                    <h3>Editar Tarefa</h3>
                    <div class="form-group">
                        <label>Título:</label>
                        <input type="text" id="edit-title" value="${
                          tarefa.titulo
                        }" required>
                    </div>
                    <div class="form-group">
                        <label>Descrição:</label>
                        <textarea id="edit-desc">${
                          tarefa.descricao || ""
                        }</textarea>
                    </div>
                    <div class="form-group">
                        <label>Prioridade:</label>
                        <select id="edit-priority">
                            <option value="alta" ${
                              tarefa.prioridade === "alta" ? "selected" : ""
                            }>Alta</option>
                            <option value="media" ${
                              tarefa.prioridade === "media" ? "selected" : ""
                            }>Média</option>
                            <option value="baixa" ${
                              tarefa.prioridade === "baixa" ? "selected" : ""
                            }>Baixa</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="save-edit">Salvar</button>
                        <button type="button" id="cancel-edit">Cancelar</button>
                    </div>
                `;

        // Mostrar modal de edição
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.appendChild(editForm);
        document.body.appendChild(modal);

        // Event listeners para os botões do modal
        document
          .getElementById("save-edit")
          .addEventListener("click", async () => {
            const novoTitulo = document
              .getElementById("edit-title")
              .value.trim();
            const novaDescricao = document
              .getElementById("edit-desc")
              .value.trim();
            const novaPrioridade =
              document.getElementById("edit-priority").value;

            if (novoTitulo) {
              tarefa.titulo = novoTitulo;
              tarefa.descricao = novaDescricao || null;
              tarefa.prioridade = novaPrioridade;

              await updateTask(tarefa);
              loadTasks();
              document.body.removeChild(modal);
            } else {
              alert("O título da tarefa é obrigatório");
            }
          });

        document.getElementById("cancel-edit").addEventListener("click", () => {
          document.body.removeChild(modal);
        });
      });
    });
  }

  // Atualizar contador de tarefas
  function updateTaskCount(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluida).length;
    taskCount.textContent = `${concluidas} de ${total} tarefas ${
      concluidas === 1 ? "concluída" : "concluídas"
    }`;
  }

  // Funções auxiliares
  function formatDate(dateString) {
    if (!dateString) return "Não definida";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  }

  function getPriorityLabel(prioridade) {
    const labels = {
      alta: "Alta Prioridade",
      media: "Média Prioridade",
      baixa: "Baixa Prioridade",
    };
    return labels[prioridade] || prioridade;
  }

  function showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.classList.add("fade-out");
      setTimeout(() => document.body.removeChild(alert), 300);
    }, 3000);
  }

  function showLoading(show) {
    const loader = document.getElementById("loading-overlay");
    if (show) {
      if (!loader) {
        const overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(overlay);
      }
    } else {
      if (loader) {
        document.body.removeChild(loader);
      }
    }
  }
});

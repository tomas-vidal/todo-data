let modal = document.querySelectorAll("[data-modal]");
const onSubmitButton = document.querySelector(".modal__submit-btn");
const todoDate = document.querySelector("#todoDate");
let tags = ["Default", "Homework", "University"];
const selectTag = document.querySelectorAll(".selectTag");
let todos = [];

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month < 10 ? "0" + month : month}-${
  day < 10 ? "0" + day : day
}`;

todoDate.value = currentDate;
// TODO: see if i can import the code before
// TODO: CREATE SETTINGS MODAL
// TODO: CREATE FILTER
// TODO: SAVE TO LOCAL STORAGE

const updateTags = () => {
  selectTag.forEach((selectedTag) => {
    tags.forEach((tag) => {
      const optionElement = document.createElement("option");
      optionElement.value = tag.toLowerCase();
      optionElement.textContent = tag;
      selectedTag.appendChild(optionElement);
    });
  });
};

updateTags();

modal.forEach(function (trigger) {
  // TODO: check what this does

  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    console.log(todoDesc);
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});

onSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const todoDesc = document.querySelector("#todoDesc");
  const todoSelect = document.querySelector("#todoSelect");
  const todoImportant = document.querySelector("#todoImportant");
  const todoDate = document.querySelector("#todoDate");

  if (todoDesc.value !== "") {
    const newTodo = new TodoItem(
      todoDesc.value,
      todoSelect.value,
      todoImportant.checked,
      todoDate.value
    );

    todos.push(newTodo);

    // TODO: add reset function

    // * Close modal, render todos and add events listeners to them

    const closeModal = document.querySelector(".modal");
    closeModal.classList.remove("open");
    renderTodos();
  } else {
    return;
  }
});

class TodoItem {
  constructor(todoDesc, todoSelect, todoImportant, todoDate) {
    this.todoDesc = todoDesc;
    this.todoSelect = todoSelect;
    this.todoImportant = todoImportant;
    this.todoDate = todoDate;
    this.todoDone = false;
    this.todoId = uid();
    // TODO: add priority
  }
}

const renderTodos = () => {
  const allTasks = document.querySelector(".all-tasks__list");
  const importantTasks = document.querySelector(".content__list");
  allTasks.innerHTML = "";
  importantTasks.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const newItemTodo = document.createElement("li");
    newItemTodo.classList.add("all-tasks__item");
    newItemTodo.dataset.id = todos[i].todoId;
    if (todos[i].todoDone) {
      newItemTodo.classList.add("itemChecked");
    } else {
      newItemTodo.classList.remove("itemChecked");
    }

    // ? FORMAT DATE
    const formatDate = todos[i].todoDate.split("-");

    newItemTodo.innerHTML = `
              <p class="all-tasks__item-name">${todos[i].todoDesc}</p>
              <div class="content__item-details"  >
                  <span class="item__badge">${todos[
                    i
                  ].todoSelect.toUpperCase()}</span>
                <span class="content__item-due">${
                  formatDate[2] + "/" + formatDate[1]
                }</span>

                <input class="checkButton" type="checkbox" name="" id="" ${
                  todos[i].todoDone ? "checked" : ""
                }/>
                <div class="dropdown">
                <div class="dropdown-bg"></div>

                <span class="material-symbols-rounded dropdownButton">
                  more_vert
                </span>
                
                <div class="dropdown-content">
                  <p class="buttonEditTodo" data-modal="modal-two">Edit Todo</p>
                  <p class="buttonDeleteTodo">Delete Todo</p>
                </div>
              </div>`;

    if (todos[i].todoImportant) {
      newItemImportant = document.createElement("li");
      newItemImportant.classList.add("content__item");
      newItemImportant.dataset.id = todos[i].todoId;
      if (todos[i].todoDone) {
        newItemImportant.classList.add("itemChecked");
      } else {
        newItemImportant.classList.remove("itemChecked");
      }

      newItemImportant.innerHTML = `
            <p class="content__item-name">${todos[i].todoDesc}</p>
           
            <div class="content__item-details">
              <span class="item__badge">${todos[
                i
              ].todoSelect.toUpperCase()}</span>
              <span class="content__item-due">${
                formatDate[2] + "/" + formatDate[1]
              }</span>
              <input class="checkButton" type="checkbox" name="" id="" ${
                todos[i].todoDone ? "checked" : ""
              }/>
              <div class="dropdown">
                <div class="dropdown-bg"></div>
                <span class="material-symbols-rounded dropdownButton">
                  more_vert
                </span>               
                <div class="dropdown-content">
                  <p class="buttonEditTodo" data-modal="modal-two">Edit Todo</p>
                  <p class="buttonDeleteTodo">Delete Todo</p>
              </div>
            </div>
             `;
      importantTasks.appendChild(newItemImportant);
    }

    allTasks.appendChild(newItemTodo);
  }
  if (!importantTasks.firstChild) {
    const noElements = document.createElement("p");
    noElements.classList.add("noElements");
    noElements.textContent = "No todo important yet...";
    importantTasks.appendChild(noElements);
  }
  onHandleDropdown();
  onHandleChecks();
  onHandleTodos();
  modal = document.querySelectorAll("[data-modal]");
  modal.forEach(function (trigger) {
    // TODO: check what this does
  });
};

const onHandleDropdown = () => {
  const dropdownButton = document.querySelectorAll(".dropdown");
  dropdownButton.forEach((todoDropdownBtn) => {
    todoDropdownBtn.addEventListener("click", () => {
      todoDropdownBtn.parentElement.classList.toggle("show");
    });
  });
};

const onHandleChecks = () => {
  // TODO: RENDER BOTH TODOS FOR CHECKS

  const checksInput = document.querySelectorAll(".checkButton");
  checksInput.forEach((checkInput) => {
    checkInput.addEventListener("click", () => {
      const currentTodo = getCurrentTodo(
        checkInput.parentElement.parentElement.dataset.id
      );
      currentTodo.todoDone = !currentTodo.todoDone;

      renderTodos();
    });
  });
};

const onHandleTodos = () => {
  addDeleteListener();
  addEditListener();
};

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const onDeleteTodo = (id) => {
  todos = todos.filter((todo) => todo.todoId !== id);
  renderTodos();
};

const onEditTodo = (id) => {
  console.log(id);
  const currentTodo = getCurrentTodo(id);
  const editTodoModal = document.getElementById("edit-todo");
  editTodoModal.classList.add("open");
  const exit = editTodoModal.querySelector(".modal-exit");
  exit.addEventListener("click", function (event) {
    console.log("dona");
    event.preventDefault();
    editTodoModal.classList.remove("open");
  });
  console.log(todoDesc);

  const editTodoDesc = document.getElementById("editTodoDesc");
  editTodoDesc.value = currentTodo.todoDesc;
  const editTodoTag = document.getElementById("editTodoTag");
  editTodoTag.value = currentTodo.todoSelect;
  const editTodoDate = document.getElementById("editTodoDate");
  editTodoDate.value = currentTodo.todoDate;
  const editTodoImportant = document.getElementById("editTodoImportant");
  editTodoImportant.checked = currentTodo.todoImportant;

  console.log(currentTodo.todoDate);
  editTodoModal;

  const editTodoBtn = document.getElementById("editTodoBtn");

  editTodoBtn.addEventListener("click", (event) => {
    event.preventDefault();
    currentTodo.todoDesc = editTodoDesc.value;
    currentTodo.todoSelect = editTodoTag.value;
    currentTodo.todoDate = editTodoDate.value;
    currentTodo.todoImportant = editTodoImportant.checked;
    renderTodos();
    editTodoModal.classList.remove("open");
  });
};

const addEditListener = () => {
  const buttonEditTodo = document.querySelectorAll(".buttonEditTodo");
  buttonEditTodo.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("odnedoneodne");
      onEditTodo(
        button.parentElement.parentElement.parentElement.parentElement.getAttribute(
          "data-id"
        )
      );
    });
  });
};

const addDeleteListener = () => {
  const buttonDeleteTodo = document.querySelectorAll(".buttonDeleteTodo");
  buttonDeleteTodo.forEach((button) => {
    button.addEventListener("click", () => {
      onDeleteTodo(
        button.parentElement.parentElement.parentElement.parentElement.getAttribute(
          "data-id"
        )
      );
    });
  });
};

const getCurrentTodo = (id) => {
  return todos.find((todo) => todo.todoId === id);
};

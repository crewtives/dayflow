const STORAGE_KEY = "dayflow-mvp-v2";
const ONBOARDING_KEY = "dayflow-onboarding-seen";
const DAY_START = 8 * 60;
const DAY_END = 19 * 60;
const SLOT = 30;
const STATUS = { pending: "PENDIENTE", focus: "EN FOCO", done: "HECHO" };
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const today = new Date();
const key = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parse = (value) => { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); };
const shift = (date, amount) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next; };
const todayKey = key(today);
const fmt = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const toMinutes = (value) => value ? value.split(":").reduce((total, part, index) => total + Number(part) * (index === 0 ? 60 : 1), 0) : null;
const dateLabel = (value, options) => new Intl.DateTimeFormat("es-ES", options).format(parse(value));
const slots = Array.from({ length: (DAY_END - DAY_START) / SLOT + 1 }, (_, index) => DAY_START + index * SLOT);

function seed() {
  const date = (amount) => key(shift(today, amount));
  return { tasks: [
    { id: crypto.randomUUID(), title: "Ordenar objetivos de la semana", date: date(0), startMinute: 480, endMinute: 540, status: "done", recurrence: "weekly" },
    { id: crypto.randomUUID(), title: "Preparar propuesta para Clara", date: date(0), startMinute: 540, endMinute: 630, status: "pending", recurrence: "none" },
    { id: crypto.randomUUID(), title: "Diseñar el flujo del prototipo", date: date(0), startMinute: 600, endMinute: 720, status: "focus", recurrence: "none" },
    { id: crypto.randomUUID(), title: "Llamada de coordinación", date: date(0), startMinute: 630, endMinute: 690, status: "pending", recurrence: "weekly" },
    { id: crypto.randomUUID(), title: "Pausa y paseo corto", date: date(0), startMinute: 720, endMinute: 750, status: "pending", recurrence: "weekdays" },
    { id: crypto.randomUUID(), title: "Revisar notas de investigación", date: date(0), startMinute: 840, endMinute: 930, status: "pending", recurrence: "none" },
    { id: crypto.randomUUID(), title: "Responder correos importantes", date: date(0), startMinute: 960, endMinute: 1020, status: "done", recurrence: "daily" },
    { id: crypto.randomUUID(), title: "Definir preguntas para las pruebas", date: date(0), startMinute: null, endMinute: null, status: "pending", recurrence: "none" }
  ], energies: { [date(-6)]: 2, [date(-5)]: 3, [date(-4)]: 4, [date(-3)]: 3, [date(-2)]: 5, [date(-1)]: 2 } };
}

function migrate(raw) {
  raw.tasks = raw.tasks.map((task) => ({ ...task, startMinute: task.startMinute ?? (Number.isInteger(task.hour) ? task.hour * 60 : null), endMinute: task.endMinute ?? (Number.isInteger(task.hour) ? task.hour * 60 + 60 : null), recurrence: task.recurrence ?? "none" }));
  return raw;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("dayflow-mvp-v1");
    const data = raw ? migrate(JSON.parse(raw)) : seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return seed();
  }
}

let state = load();
let selectedDate = todayKey;
let activeStatus = "focus";
let lastFocus = null;
let isLoading = true;
let dragging = null;

const el = {
  agenda: $("#agenda"), rail: $("#task-columns"), day: $("#day-heading"), kicker: $("#date-kicker"), short: $("#selected-date-short"),
  drawer: $("#task-drawer"), backdrop: $("#drawer-backdrop"), form: $("#task-form"), id: $("#task-id"), title: $("#task-title"),
  date: $("#task-date"), start: $("#task-start"), end: $("#task-end"), recurrence: $("#task-recurrence"), status: $("#task-status"),
  del: $("#delete-task"), titleError: $("#title-error"), timeError: $("#time-error"), toast: $("#toast-region"),
  today: $("#today-view"), week: $("#week-view"), weekChart: $("#week-chart"), weekEmpty: $("#week-empty")
};

function toast(message, { error = false, actionLabel, onAction } = {}) {
  const notice = document.createElement("div");
  notice.className = `toast${error ? " is-error" : ""}`;
  notice.setAttribute("role", error ? "alert" : "status");
  notice.innerHTML = `<p>${escape(message)}</p>`;
  if (actionLabel && onAction) {
    const action = document.createElement("button");
    action.type = "button";
    action.className = "toast-action";
    action.textContent = actionLabel;
    action.onclick = () => { onAction(); notice.remove(); };
    notice.append(action);
  }
  el.toast.append(notice);
  setTimeout(() => notice.remove(), 4200);
}

function commit(next, message, options) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = next;
    toast(message, options);
    return true;
  } catch {
    toast("No pudimos guardar el cambio. Revisa el almacenamiento del navegador e inténtalo de nuevo.", { error: true });
    return false;
  }
}

function occurs(task, date) {
  if (task.date > date) return false;
  if (task.recurrence === "none") return task.date === date;
  const elapsed = Math.round((parse(date) - parse(task.date)) / 86400000);
  if (task.recurrence === "daily") return true;
  if (task.recurrence === "weekdays") return parse(date).getDay() > 0 && parse(date).getDay() < 6;
  return task.recurrence === "weekly" && elapsed % 7 === 0;
}

function dayTasks(date = selectedDate) { return state.tasks.filter((task) => occurs(task, date)); }
function escape(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }

function updateHeader() {
  el.day.textContent = selectedDate === todayKey ? "Hoy" : dateLabel(selectedDate, { weekday: "long", day: "numeric" });
  el.kicker.textContent = dateLabel(selectedDate, { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
  el.short.textContent = dateLabel(selectedDate, { day: "2-digit", month: "2-digit" });
}

function lanes(events) {
  const sorted = [...events].sort((a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute);
  const active = [];
  sorted.forEach((event) => {
    for (let index = active.length - 1; index >= 0; index -= 1) if (active[index].endMinute <= event.startMinute) active.splice(index, 1);
    let lane = 0;
    while (active.some((item) => item.lane === lane)) lane += 1;
    event.lane = lane;
    active.push(event);
    event.total = Math.max(...active.map((item) => item.lane)) + 1;
    active.forEach((item) => { item.total = Math.max(item.total, event.total); });
  });
  return sorted;
}

function renderAgenda() {
  if (isLoading) {
    el.agenda.setAttribute("aria-busy", "true");
    el.agenda.innerHTML = '<div class="agenda-loading"><span aria-hidden="true"></span><p>Preparando tu jornada…</p></div>';
    return;
  }
  el.agenda.removeAttribute("aria-busy");
  const tasks = dayTasks().filter((task) => task.startMinute !== null);
  el.agenda.innerHTML = `<p class="agenda-hint">Arrastra entre bloques de 30 min. Para una hora exacta, abre el evento.</p><div class="timeline-grid">${slots.slice(0, -1).map((minute, index) => `<div class="time-row" data-minute="${minute}"><time>${index % 2 === 0 ? fmt(minute) : ""}</time><button class="slot-add" type="button" aria-label="Crear evento a las ${fmt(minute)}">＋</button></div>`).join("")}<div class="event-layer"></div></div>`;
  const layer = $(".event-layer", el.agenda);
  lanes(tasks).forEach((task) => {
    const event = document.createElement("button");
    event.className = `agenda-event is-${task.status}`;
    event.type = "button";
    event.draggable = true;
    const top = ((task.startMinute - DAY_START) / SLOT) * 44;
    const height = Math.max(42, ((task.endMinute - task.startMinute) / SLOT) * 44 - 4);
    event.style.cssText = `top:${top}px;height:${height}px;left:calc(${task.lane / task.total * 100}% + 5px);width:calc(${100 / task.total}% - 10px)`;
    event.innerHTML = `<strong class="event-title">${escape(task.title)}</strong><span class="event-time">${fmt(task.startMinute)}–${fmt(task.endMinute)}</span>`;
    event.setAttribute("aria-label", `${task.title}, ${fmt(task.startMinute)} a ${fmt(task.endMinute)}. Arrastra para mover en bloques de 30 minutos o abre para editar.`);
    event.onclick = () => open(task);
    event.ondragstart = (dragEvent) => { dragging = task.id; dragEvent.dataTransfer.effectAllowed = "move"; event.classList.add("is-dragging"); };
    event.ondragend = () => { dragging = null; event.classList.remove("is-dragging"); $$(".time-row", el.agenda).forEach((row) => row.classList.remove("is-over")); };
    layer.append(event);
  });
  $$(".slot-add", el.agenda).forEach((button) => { button.onclick = () => open(null, Number(button.closest(".time-row").dataset.minute)); });
  $$(".time-row", el.agenda).forEach((row) => {
    row.ondragover = (dragEvent) => { if (dragging) { dragEvent.preventDefault(); dragEvent.dataTransfer.dropEffect = "move"; row.classList.add("is-over"); } };
    row.ondragleave = () => row.classList.remove("is-over");
    row.ondrop = (dragEvent) => { dragEvent.preventDefault(); row.classList.remove("is-over"); if (dragging) moveTime(dragging, Number(row.dataset.minute)); };
  });
  if (!tasks.length) {
    const empty = document.createElement("div");
    empty.className = "agenda-empty";
    empty.innerHTML = "<h3>Tu agenda está abierta</h3><p>Empieza por reservar un bloque para lo que merece atención.</p><button class='paper-button' type='button'>Crear primer evento</button>";
    $("button", empty).onclick = () => open();
    el.agenda.append(empty);
  }
}

function railItem(task) {
  const item = document.createElement("div");
  item.className = "rail-item";
  item.innerHTML = `<button type="button" class="rail-item-title"><strong>${escape(task.title)}</strong><span>${task.startMinute === null ? "Sin hora" : `${fmt(task.startMinute)}–${fmt(task.endMinute)}`}</span></button><select aria-label="Cambiar estado de ${escape(task.title)}"><option value="pending">Pendiente</option><option value="focus">En foco</option><option value="done">Hecho</option></select>`;
  $("button", item).onclick = () => open(task);
  const select = $("select", item);
  select.value = task.status;
  select.onchange = () => changeStatus(task.id, select.value);
  return item;
}

function renderRail() {
  el.rail.innerHTML = "";
  ["focus", "pending", "done"].forEach((status) => {
    const items = dayTasks().filter((task) => task.status === status);
    const group = document.createElement("section");
    group.className = `status-group ${status === activeStatus ? "is-active" : ""}`;
    group.dataset.status = status;
    group.innerHTML = `<header><h3>${STATUS[status]}</h3></header><div class="status-list"></div>`;
    const list = $(".status-list", group);
    if (!items.length) list.innerHTML = `<p class="status-empty">${status === "focus" ? "Elige una tarea para empezar." : "Sin tareas en este estado."}</p>`;
    else items.sort((a, b) => (a.startMinute ?? 9999) - (b.startMinute ?? 9999)).forEach((task) => list.append(railItem(task)));
    el.rail.append(group);
  });
  $$('[data-status-tab]').forEach((button) => {
    const status = button.dataset.statusTab;
    $("span", button).textContent = dayTasks().filter((task) => task.status === status).length;
    button.classList.toggle("is-active", status === activeStatus);
    button.setAttribute("aria-selected", String(status === activeStatus));
  });
}

function renderEnergy() {
  const value = state.energies[selectedDate] ?? null;
  $$('[data-energy-scale]').forEach((scale) => $$('[data-energy]', scale).forEach((button) => {
    const selected = Number(button.dataset.energy) === value;
    button.setAttribute("aria-checked", String(selected));
    button.tabIndex = selected || (!value && button.dataset.energy === "1") ? 0 : -1;
  }));
  $$('[data-energy-status]').forEach((node) => { node.textContent = value ? `${value} de 5` : "Sin registrar"; });
}

function weekKeys() { return Array.from({ length: 7 }, (_, index) => key(shift(today, index - 6))); }
function renderWeek() {
  const keys = weekKeys();
  const hasEnergy = keys.some((date) => state.energies[date]);
  el.weekChart.hidden = !hasEnergy;
  el.weekEmpty.hidden = hasEnergy;
  el.weekChart.innerHTML = "";
  if (!hasEnergy) return;
  keys.forEach((date) => {
    const tasks = dayTasks(date);
    const done = tasks.filter((task) => task.status === "done").length;
    const energy = state.energies[date];
    const day = document.createElement("article");
    day.className = `week-day${date === todayKey ? " is-today" : ""}`;
    const bar = energy ? `<i class="energy-bar" style="height:${energy * 20}%"></i>` : "<i class='energy-missing'>—</i>";
    day.innerHTML = `<header><strong>${dateLabel(date, { weekday: "short" }).toUpperCase()}</strong><span>${dateLabel(date, { day: "numeric", month: "short" })}</span></header><div class="energy-column">${bar}</div><footer>${energy ? `Energía ${energy}/5` : "Sin energía"}<span>${done}/${tasks.length} hechas</span></footer>`;
    el.weekChart.append(day);
  });
}

function render() { updateHeader(); renderAgenda(); renderRail(); renderEnergy(); renderWeek(); }
function open(task = null, preset = null) {
  lastFocus = document.activeElement;
  el.form.reset();
  el.id.value = task?.id ?? "";
  el.title.value = task?.title ?? "";
  el.date.value = task?.date ?? selectedDate;
  el.start.value = task?.startMinute !== undefined && task?.startMinute !== null ? fmt(task.startMinute) : preset !== null ? fmt(preset) : "";
  el.end.value = task?.endMinute !== undefined && task?.endMinute !== null ? fmt(task.endMinute) : preset !== null ? fmt(Math.min(DAY_END, preset + 60)) : "";
  el.recurrence.value = task?.recurrence ?? "none";
  el.status.value = task?.status ?? "pending";
  el.del.hidden = !task;
  $("#drawer-title").textContent = task ? "Editar evento" : "Nuevo evento";
  $("#drawer-step").textContent = task ? "AJUSTAR EVENTO" : "NUEVO EVENTO";
  clearErrors();
  el.backdrop.hidden = false;
  el.drawer.classList.add("is-open");
  el.drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => el.title.focus(), 0);
}

function close() { el.drawer.classList.remove("is-open"); el.drawer.setAttribute("aria-hidden", "true"); el.backdrop.hidden = true; document.body.style.overflow = ""; lastFocus?.focus(); }
function clearErrors() { $$('[aria-invalid]', el.form).forEach((field) => field.removeAttribute("aria-invalid")); el.titleError.hidden = true; el.timeError.hidden = true; }
function valid() {
  clearErrors();
  let okay = true;
  if (!el.title.value.trim()) { el.title.setAttribute("aria-invalid", "true"); el.titleError.hidden = false; okay = false; }
  const start = toMinutes(el.start.value);
  const end = toMinutes(el.end.value);
  if ((start !== null && end === null) || (start === null && end !== null) || (start !== null && end !== null && end <= start)) { el.start.setAttribute("aria-invalid", "true"); el.end.setAttribute("aria-invalid", "true"); el.timeError.hidden = false; okay = false; }
  if (!okay) (!el.title.value.trim() ? el.title : el.start).focus();
  return okay;
}

function save(event) {
  event.preventDefault();
  if (!valid()) return;
  const next = structuredClone(state);
  const id = el.id.value;
  const payload = { title: el.title.value.trim(), date: el.date.value || selectedDate, startMinute: toMinutes(el.start.value), endMinute: toMinutes(el.end.value), recurrence: el.recurrence.value, status: el.status.value };
  if (id) {
    const task = next.tasks.find((item) => item.id === id);
    if (!task) return toast("Ese evento ya no está disponible. Cierra y vuelve a intentarlo.", { error: true });
    Object.assign(task, payload);
  } else next.tasks.push({ id: crypto.randomUUID(), ...payload });
  if (commit(next, id ? "Evento actualizado." : "Evento creado en tu agenda.")) { selectedDate = payload.date; close(); view("today", false); render(); }
}

function changeStatus(id, status) {
  const before = state.tasks.find((task) => task.id === id);
  if (!before) return;
  const previousStatus = before.status;
  const next = structuredClone(state);
  const task = next.tasks.find((item) => item.id === id);
  task.status = status;
  const message = status === "done" ? `“${task.title}” está hecho.` : `“${task.title}” pasó a ${STATUS[status].toLowerCase()}.`;
  if (commit(next, message, { actionLabel: "Deshacer", onAction: () => {
    const restored = structuredClone(state);
    const item = restored.tasks.find((candidate) => candidate.id === id);
    if (item) { item.status = previousStatus; if (commit(restored, "Cambio deshecho.")) render(); }
  } })) render();
}

function moveTime(id, startMinute) {
  const next = structuredClone(state);
  const task = next.tasks.find((item) => item.id === id);
  if (!task || task.startMinute === null || task.endMinute === null) return;
  const previous = { startMinute: task.startMinute, endMinute: task.endMinute, date: task.date };
  const duration = task.endMinute - task.startMinute;
  const endMinute = Math.min(DAY_END, startMinute + duration);
  task.startMinute = endMinute - duration;
  task.endMinute = endMinute;
  task.date = selectedDate;
  if (commit(next, `“${task.title}” se movió a las ${fmt(task.startMinute)}.`, { actionLabel: "Deshacer", onAction: () => {
    const restored = structuredClone(state);
    const item = restored.tasks.find((candidate) => candidate.id === id);
    if (item) { Object.assign(item, previous); if (commit(restored, "Movimiento deshecho.")) render(); }
  } })) render();
}

function remove() {
  const id = el.id.value;
  const task = state.tasks.find((item) => item.id === id);
  if (!task || !confirm(`¿Eliminar “${task.title}”?`)) return;
  const next = structuredClone(state);
  next.tasks = next.tasks.filter((item) => item.id !== id);
  if (commit(next, "Evento eliminado.")) { close(); render(); }
}

function view(name, focusMain = true) {
  const isToday = name === "today";
  el.today.hidden = !isToday;
  el.today.classList.toggle("is-visible", isToday);
  el.week.hidden = isToday;
  el.week.classList.toggle("is-visible", !isToday);
  $$('[data-view]').forEach((button) => { const active = button.dataset.view === name; button.classList.toggle("is-active", active); button.setAttribute("aria-current", active ? "page" : "false"); });
  if (!isToday) renderWeek();
  if (focusMain) $("#main-content").focus();
}

function trap(event) {
  if (event.key === "Escape" && el.drawer.classList.contains("is-open")) return close();
  if (event.key !== "Tab" || !el.drawer.classList.contains("is-open")) return;
  const focusable = $$('button,input,select', el.drawer).filter((item) => !item.disabled && item.offsetParent);
  if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
  if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
}

function bind() {
  $$('[data-view]').forEach((button) => { button.onclick = () => view(button.dataset.view); });
  $("#previous-day").onclick = () => { selectedDate = key(shift(parse(selectedDate), -1)); render(); };
  $("#next-day").onclick = () => { selectedDate = key(shift(parse(selectedDate), 1)); render(); };
  $("#go-today").onclick = () => { selectedDate = todayKey; render(); };
  $("#new-task-button").onclick = () => open();
  $("#mobile-new-task").onclick = () => open();
  $("#close-drawer").onclick = close;
  el.backdrop.onclick = close;
  el.form.onsubmit = save;
  el.del.onclick = remove;
  document.onkeydown = trap;
  $$('[data-energy]').forEach((button) => {
    button.onclick = () => { const next = structuredClone(state); next.energies[selectedDate] = +button.dataset.energy; if (commit(next, `Energía registrada: ${button.dataset.energy} de 5.`)) render(); };
    button.onkeydown = (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const all = $$('[data-energy]', button.closest('[data-energy-scale]'));
      const adjacent = all[(all.indexOf(button) + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + all.length) % all.length];
      adjacent.focus(); adjacent.click();
    };
  });
  $$('[data-status-tab]').forEach((button) => { button.onclick = () => { activeStatus = button.dataset.statusTab; renderRail(); }; });
  $$('[data-return-today]').forEach((button) => { button.onclick = () => view("today"); });
  $("#dismiss-onboarding").onclick = () => { localStorage.setItem(ONBOARDING_KEY, "true"); $("#onboarding-fold").hidden = true; };
}

bind();
$("#onboarding-fold").hidden = localStorage.getItem(ONBOARDING_KEY) === "true";
render();
setTimeout(() => { isLoading = false; render(); }, 220);

const form = document.getElementById('form')
const formInputText = document.getElementById('form-input-text')
const formInputDate = document.getElementById('form-input-date')
const formRadio = document.querySelectorAll('.form__radio')
const listError = document.getElementById('list-error')
const list = document.getElementById('list')

let arrayTask = JSON.parse(localStorage.getItem('todo_list')) ?? []

document.addEventListener("DOMContentLoaded", () => {
    let df = document.createDocumentFragment()
    arrayTask.forEach(element => {
        df = createTask(element, df)
    });
    list.appendChild(df)
})

const handleSubmit = e => {
    e.preventDefault();
    listError.textContent = ''
    if(formInputText.value.length === 0) {
        errorMsg('Nombre de tarea obligatorio')
        return
    }
    if(!formInputDate.value) {
        errorMsg('Fecha obligatoria')
        return
    }
    const ms = new Date(formInputDate.value).getTime()
    const msDifference = ms - Date.now()
    if(msDifference <= 0) {
        errorMsg('La fecha no puede ser anterior a hoy')
        return
    }
    
    const obj = {
        id: Date.now(),
        title: formInputText.value,
        ms: ms,
        completed: false
    }
    for(let i = 0; i < formRadio.length; i++) {
        if(formRadio[i].checked) {
            obj.color = formRadio[i].value
            break
        }
    }
    arrayTask = [...arrayTask, obj]
    localStorage.setItem('todo_list', JSON.stringify(arrayTask))
    const df = document.createDocumentFragment()
    const fragment = createTask(obj, df)
    list.appendChild(df)
}

form.addEventListener("submit", handleSubmit)

const errorMsg = msg => {
    const p = document.createElement('p')
    p.textContent = msg
    p.classList.add('text__error')
    listError.appendChild(p)
}

const msToDate = ms => {
    const msDifference = ms - Date.now()
    if(msDifference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }
    let s, m, h, d;
    s = Math.floor(msDifference / 1000)
    m = Math.floor(s / 60)
    s = s % 60
    h = Math.floor(m / 60)
    m = m % 60
    d = Math.floor(h / 24)
    h = h % 24
    return {
        days: d,
        hours: h,
        minutes: m,
        seconds: s
    }
}

const createTask = (obj, df) => {
    let idInterval
    const task = document.createElement('article')
    task.classList.add('task', `task--${obj.color}`)

    const taskLeft = document.createElement('div')
    taskLeft.classList.add('task__left')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = obj.completed ? true : false
    const h3 = document.createElement('h3')
    h3.classList.add('task__title')
    if(checkbox.checked) {
        h3.classList.add('task__title--crossed')
        task.classList.add('task--opacity')
    }

    const taskRight = document.createElement('div')
    taskRight.classList.add('task__right')

    const taskTimeDays = document.createElement('div')
    taskTimeDays.classList.add('task__time')
    const taskDays = document.createElement('p')
    const taskD = document.createElement('p')
    taskD.textContent = 'D'

    const taskTimeHours = document.createElement('div')
    taskTimeHours.classList.add('task__time')
    const taskHours = document.createElement('p')
    const taskH = document.createElement('p')
    taskH.textContent = 'H'

    const taskTimeMinutes = document.createElement('div')
    taskTimeMinutes.classList.add('task__time')
    const taskMinutes = document.createElement('p')
    const taskM = document.createElement('p')
    taskM.textContent = 'M'

    const taskTimeSeconds = document.createElement('div')
    taskTimeSeconds.classList.add('task__time')
    const taskSeconds = document.createElement('p')
    const taskS = document.createElement('p')
    taskS.textContent = 'S'
    let time = msToDate(obj.ms)
    const bool = (time.days <= 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0)
    taskDays.textContent = time.days
    taskHours.textContent = time.hours
    taskMinutes.textContent = time.minutes
    taskSeconds.textContent = time.seconds

    function intervalJob() {
        if(bool || obj.completed) clearInterval(idInterval)
        time = msToDate(obj.ms)
        taskDays.textContent = time.days
        taskHours.textContent = time.hours
        taskMinutes.textContent = time.minutes
        taskSeconds.textContent = time.seconds
    }

    idInterval = setInterval(intervalJob, 1000)
    checkbox.onclick = () => {
        if(checkbox.checked) {
            obj.completed = true
            h3.classList.add('task__title--crossed')
            task.classList.add('task--opacity')
            completedLS(obj)
        }
        else {
            obj.completed = false
            h3.classList.remove('task__title--crossed')
            task.classList.remove('task--opacity')
            idInterval = setInterval(intervalJob, 1000)
            completedLS(obj)
        }
    }
    h3.textContent = obj.title
    taskLeft.append(checkbox, h3)

    taskDelete = document.createElement('button')
    taskDelete.classList.add('task__delete')
    taskDeleteImg = document.createElement('img')
    taskDeleteImg.src = '../assets/images/close.svg'

    taskDelete.onclick = () => {
        clearInterval(idInterval)
        arrayTask = arrayTask.filter(task => task.id !== obj.id)
        localStorage.setItem('todo_list', JSON.stringify(arrayTask))
        task.remove()
    }

    taskDelete.appendChild(taskDeleteImg)
    taskTimeDays.append(taskDays, taskD)
    taskTimeHours.append(taskHours, taskH)
    taskTimeMinutes.append(taskMinutes, taskM)
    taskTimeSeconds.append(taskSeconds, taskS)
    taskRight.append(taskTimeDays, taskTimeHours, taskTimeMinutes, taskTimeSeconds, taskDelete)
    task.append(taskLeft, taskRight)
    df.appendChild(task)
    return df
}

const completedLS = obj => {
    const completedLS = arrayTask.map(task => (task.id === obj.id) ? obj : task)
    localStorage.setItem('todo_list', JSON.stringify(completedLS))
}
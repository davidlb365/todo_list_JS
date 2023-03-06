const form = document.getElementById('form')
const formInputText = document.getElementById('form-input-text')
const formInputDate = document.getElementById('form-input-date')
const formRadio = document.querySelectorAll('.form__color > input[type="radio"]')
const listError = document.getElementById('list-error')
const list = document.getElementById('list')

let arrayTask = JSON.parse(localStorage.getItem('todo_list')) ?? []

document.addEventListener("DOMContentLoaded", () => {
    arrayTask.forEach(element => {
        createTask(element)
    });
})

const handleSubmit = e => {
    e.preventDefault();
    while(listError.firstChild) listError.removeChild(listError.firstChild)
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
        ms: ms
    }
    for(let i = 0; i < formRadio.length; i++) {
        if(formRadio[i].checked) {
            obj.color = formRadio[i].value
            break
        }
    }
    arrayTask = [...arrayTask, obj]
    localStorage.setItem('todo_list', JSON.stringify(arrayTask))
    console.log(arrayTask)
    createTask(obj)
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

const createTask = obj => {
    const a = document.createElement('article')
    a.classList.add('task')
    a.style.backgroundColor = obj.color
    const h3 = document.createElement('h3')
    h3.classList.add('task__title')
    h3.textContent = obj.title
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
    taskDays.textContent = time.days
    taskHours.textContent = time.hours
    taskMinutes.textContent = time.minutes
    taskSeconds.textContent = time.seconds

    const myInterval = setInterval(() => {
        time = msToDate(obj.ms)
        taskDays.textContent = time.days
        taskHours.textContent = time.hours
        taskMinutes.textContent = time.minutes
        taskSeconds.textContent = time.seconds
    } , 1000)

    taskDelete = document.createElement('button')
    taskDelete.classList.add('task__delete')
    taskDeleteImg = document.createElement('img')
    taskDeleteImg.src = '../assets/images/close.svg'

    taskDelete.onclick = () => {
        const arrayTaskMod = arrayTask.filter(task => task.id !== obj.id)
        localStorage.setItem('todo_list', JSON.stringify(arrayTaskMod))
        a.remove()
    }

    taskDelete.appendChild(taskDeleteImg)
    taskTimeDays.append(taskDays, taskD)
    taskTimeHours.append(taskHours, taskH)
    taskTimeMinutes.append(taskMinutes, taskM)
    taskTimeSeconds.append(taskSeconds, taskS)
    taskRight.append(taskTimeDays, taskTimeHours, taskTimeMinutes, taskTimeSeconds, taskDelete)
    a.append(h3, taskRight)
    list.appendChild(a)
}
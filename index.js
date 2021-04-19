const db = firebase.firestore()
let editing = false
let id = ""

console.log("inciando...")

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container')


const save = (title, description) => {
	if (title != "" || description != "") {
		db.collection("tareas").doc().set({
			title,
			description
		})
	}else{
		alert("Rellene todos los campos.")
	}
}

const update = (id, updateTarea) => db.collection("tareas").doc(id).update(updateTarea)

const deleteTarea = id => db.collection("tareas").doc(id).delete()
const editTarea = id => db.collection("tareas").doc(id).get()

const getTareas = () => db.collection("tareas").get();
async function mostrarTareas() {
	taskContainer.innerHTML = ""
	const getTareasData = await getTareas()
	getTareasData.forEach(doc => {
		const tarea = doc.data()
		tarea.id = doc.id
		/*console.log(tarea)*/

		taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
			<h3>${tarea.title}</h3>
			<p>${tarea.description}</p>

			<div>
				<button class="btn btn-primary btn-delete" data-id=${tarea.id}>Eliminar</button>
				<button class="btn btn-secondary btn-edit" data-id=${tarea.id}>Editar</button>
			</div>
		</div>`

		const btnsDelete = document.querySelectorAll(`.btn-delete`)
		btnsDelete.forEach(btn => {
			btn.addEventListener('click',async (e) => {
				console.log(e.target.dataset.id)
				await deleteTarea(e.target.dataset.id)
				await mostrarTareas()
			})
		})

		const btnsEdit = document.querySelectorAll(`.btn-edit`)
		btnsEdit.forEach(btn => {
			btn.addEventListener('click',async (e) => {
				console.log(e.target.dataset.id)
				const doc = await editTarea(e.target.dataset.id)

				editing = true
				id = e.target.dataset.id

				taskForm["task-title"].value = doc.data().title
				taskForm["task-description"].value = doc.data().description

				taskForm["btn-task-form"].innerText = "Editar"

			})
		})

	})
}
window.addEventListener("DOMContentLoaded", async (e) => {
	mostrarTareas()
})

taskForm.addEventListener('submit', async (e) => {
	e.preventDefault()

	const title = taskForm['task-title'].value
	const description = taskForm['task-description'].value
	if (!editing) {
		await save(title, description)
	}else{
		console.log(id)
		if (title != "" || description != "") {
			await update(id, {
			title: title,
			description: description
			})
			editing = false
			taskForm["btn-task-form"].innerText = "Guardar"
		}else{
			alert("Rellene todos los campos.")
		}
	}

	console.log(`enviando => ${title}: ${description}`)

	taskForm.reset()
	mostrarTareas()
})
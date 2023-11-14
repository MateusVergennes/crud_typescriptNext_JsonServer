"use client"//coisas dentro da pasta (app) nao suportam useState por padrao, entao se usa este comando p/ poder usa-lo

import { ITask } from "@/types/tasks"
import { FormEventHandler, useState } from "react"
import {FiEdit, FiTrash2} from 'react-icons/fi'
import Modal from "./Modal"
import { useRouter } from "next/navigation"
import { deleteTodo, editTodo } from "@/api"

interface TaskProps {
    task: ITask
}

const Task: React.FC<TaskProps> = ({task}) => {//react functionality component
  const router = useRouter()
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false)
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false)
  const [takToEdit, setTaskToEdit] = useState<string>(task.text)

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    await editTodo({
        id: task.id,
        text: takToEdit,
    })
    setOpenModalEdit(false)
    router.refresh()
  }
  
  const handleDeleteTask = async (id:string) => {
    await deleteTodo(id)
    setOpenModalDeleted(false)
    router.refresh()
  }

  return (
    <tr key={task.id}>
        <td className="w-full">{task.text}</td>
        <td className="flex gap-5">
          <FiEdit onClick={() => {setTaskToEdit(task.text); setOpenModalEdit(true)}} cursor='pointer' className='text-blue-500' size={25}/>
            <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit} >
              <form onSubmit={handleSubmitEditTodo}>
                  <h3 className='font-bold text-lg'>Edit Task</h3>
                  <div className='modal-action'>
                      <input type="text" placeholder="Type here" className="input input-bordered w-full" value={takToEdit} onChange={e => setTaskToEdit(e.target.value)}/>
                      <button type='submit' className='btn'>SUBMIT</button>
                  </div>
              </form>
            </Modal>
          <FiTrash2 onClick={() => {setOpenModalDeleted(true)}} cursor='pointer' className='text-red-500' size={25}/>
          <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted} >
            <h3 className="text-lg">Are you sure, you want to delete this task ?</h3>
            <div className="modal-action">
              <button onClick={() => handleDeleteTask(task.id)} className="btn" > Yes</button>
            </div>
          </Modal>
        </td>
    </tr>
  )
}

export default Task
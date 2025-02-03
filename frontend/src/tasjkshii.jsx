import React from "react"
const { useState, useEffect } = React
import { ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import abi from "./abi.json"

const contractAddress = "Y0xd29cB566b7ea69c60920183444ddAf4835C5d818" // Replace with your actual contract address

export default function TaskManager() {
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskText, setNewTaskText] = useState("")

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      const contract = new ethers.Contract(contractAddress, abi, provider)
      setContract(contract)
    } else {
      toast.error("Please install MetaMask!")
    }
  }, [])

  function connectWallet() {
    if (provider) {
      provider
        .send("eth_requestAccounts", [])
        .then(() => provider.getSigner().getAddress())
        .then((address) => {
          setAccount(address)
          fetchTasks()
          toast.success("Wallet connected successfully!")
        })
        .catch(() => {
          toast.error("Failed to connect wallet")
        })
    }
  }

  function fetchTasks() {
    if (contract && account) {
      const signer = provider.getSigner()
      const contractWithSigner = contract.connect(signer)
      contractWithSigner
        .getMyTask()
        .then((fetchedTasks) => {
          setTasks(fetchedTasks)
        })
        .catch(() => {
          toast.error("Failed to fetch tasks")
        })
    }
  }

  function addTask() {
    if (contract && account && newTaskTitle && newTaskText) {
      const signer = provider.getSigner()
      const contractWithSigner = contract.connect(signer)
      contractWithSigner
        .addTask(newTaskText, newTaskTitle, false)
        .then((tx) => tx.wait())
        .then(() => {
          setNewTaskTitle("")
          setNewTaskText("")
          fetchTasks()
          toast.success("Task added successfully!")
        })
        .catch(() => {
          toast.error("Failed to add task")
        })
    }
  }

  function deleteTask(taskId) {
    if (contract && account) {
      const signer = provider.getSigner()
      const contractWithSigner = contract.connect(signer)
      contractWithSigner
        .deleteTask(taskId)
        .then((tx) => tx.wait())
        .then(() => {
          fetchTasks()
          toast.success("Task deleted successfully!")
        })
        .catch(() => {
          toast.error("Failed to delete task")
        })
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Task Manager</h1>
      {!account ? (
        <button onClick={connectWallet} style={{ display: "block", margin: "20px auto", padding: "10px 20px" }}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <textarea
              placeholder="Task Description"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button onClick={addTask} style={{ display: "block", width: "100%", padding: "10px" }}>
              Add Task
            </button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h2>Your Tasks:</h2>
            {tasks.map((task) => (
              <div key={task.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h3>{task.taskTitle}</h3>
                <p>{task.taskText}</p>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  )
}
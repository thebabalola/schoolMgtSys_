import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import abi from "../abi.json"
import "./App.css"

const CONTRACT_ADDRESS = "0xaf23a66689e55f08B24271Ce2dB6c5522F666d05"

export default function App() {
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [studentInfo, setStudentInfo] = useState(null)
  const [allStudents, setAllStudents] = useState([])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
    } else {
      setAccount(null)
      setContract(null)
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const schoolContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
        setContract(schoolContract)
        toast.success("Wallet connected successfully!")
      } catch (error) {
        console.error("Error connecting wallet:", error)
        toast.error("Failed to connect wallet.")
      }
    } else {
      toast.error("Please install MetaMask!")
    }
  }

  const registerStudent = async () => {
    if (!contract) return
    try {
      const tx = await contract.registerStudent(studentName)
      await tx.wait()
      toast.success(`Student ${studentName} registered successfully!`)
      setStudentName("")
    } catch (error) {
      console.error("Error registering student:", error)
      toast.error("Failed to register student.")
    }
  }

  const removeStudent = async () => {
    if (!contract) return
    try {
      const tx = await contract.removeStudent(studentId)
      await tx.wait()
      toast.success(`Student with ID ${studentId} removed successfully!`)
      setStudentId("")
    } catch (error) {
      console.error("Error removing student:", error)
      toast.error("Failed to remove student.")
    }
  }

  const getStudent = async () => {
    if (!contract) return
    try {
      const result = await contract.getStudent(studentId)
      setStudentInfo({ id: result[0].toString(), name: result[1] })
    } catch (error) {
      console.error("Error getting student:", error)
      toast.error("Failed to get student information.")
    }
  }

  const getAllStudents = async () => {
    if (!contract) return
    try {
      const result = await contract.getAllStudents()
      setAllStudents(result.map((id) => id.toString()))
    } catch (error) {
      console.error("Error getting all students:", error)
      toast.error("Failed to get all students.")
    }
  }

  return (
    <div className="container">
      <ToastContainer />
      <h1>School Management System</h1>
      <p>Interact with the smart contract to manage students</p>

      {!account ? <button onClick={connectWallet}>Connect Wallet</button> : <p>Connected Account: {account}</p>}

      {account && (
        <div>
          <div className="section">
            <h2>Register Student</h2>
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button onClick={registerStudent}>Register</button>
          </div>

          <div className="section">
            <h2>Remove Student</h2>
            <input
              type="number"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button onClick={removeStudent}>Remove</button>
          </div>

          <div className="section">
            <h2>Get Student</h2>
            <input
              type="number"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button onClick={getStudent}>Get Student</button>
            {studentInfo && (
              <div>
                <p>Student ID: {studentInfo.id}</p>
                <p>Student Name: {studentInfo.name}</p>
              </div>
            )}
          </div>

          <div className="section">
            <h2>All Students</h2>
            <button onClick={getAllStudents}>Get All Students</button>
            {allStudents.length > 0 && (
              <ul>
                {allStudents.map((id) => (
                  <li key={id}>Student ID: {id}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


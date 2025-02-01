import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abi from '../abi.json';
import './App.css';

const CONTRACT_ADDRESS = "0x15b1a0818a0b475d889A3FF01EF53Ef8349fD3Ac";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        setContract(contractInstance);
      } catch {
        toast.error('An error occurred while connecting to MetaMask.');
      }
    } else {
      toast.error('Please install MetaMask!');
    }
  }, []);
  
  

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWalletAddress(accounts[0]);
    toast.success(`Wallet connected: ${accounts[0]}`);
  };

  const getStudent = async () => {
    if (!contract || !studentId) {
      toast.error('Please enter a valid student ID!');
      return;
    }
    try {
      const student = await contract.getStudent(studentId);
      toast.success(`Student: ${student.name}, Age: ${student.age}`);
    } catch {
      toast.error('Error fetching student data');
    }
  };

  const getAllStudents = async () => {
    if (!contract) {
      toast.error('Error connecting to contract');
      return;
    }
    try {
      const allStudents = await contract.getAllStudents();
      setStudents(allStudents);
      toast.success('Fetched all students');
    } catch {
      toast.error('Error fetching all students');
    }
  };

  const registerStudent = async () => {
    if (!contract || !studentName || !studentAge) {
      toast.error('Please provide student name and age!');
      return;
    }
    try {
      const tx = await contract.registerStudent(studentName, studentAge);
      await tx.wait();
      toast.success('Student registered successfully!');
      setStudentName('');
      setStudentAge('');
    } catch{
      toast.error('Error registering student');
    }
  };

  return (
    <div className="App">
      <h1>Student Registration</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>Wallet Connected: {walletAddress}</div>
      )}

      <div className="actions">
        <div>
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button onClick={getStudent}>Get Student</button>
        </div>

        <div>
          <button onClick={getAllStudents}>Get All Students</button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Student Age"
            value={studentAge}
            onChange={(e) => setStudentAge(e.target.value)}
          />
          <button onClick={registerStudent}>Register Student</button>
        </div>
      </div>

      <div className="students-list">
        <h2>All Students</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              <strong>ID:</strong> {student.id} | <strong>Name:</strong> {student.name} | <strong>Age:</strong> {student.age}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;

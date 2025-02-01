import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abi from '../abi.json';
import './App.css';

const CONTRACT_ADDRESS = "0xaf23a66689e55f08B24271Ce2dB6c5522F666d05";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentInfo, setStudentInfo] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const tempProvider =  new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);
    } else {
      toast.error("Please install MetaMask!");
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());
      setContract(tempContract);
      toast.success("Wallet connected successfully!");
    } catch{
      toast.error("Failed to connect wallet!");
    }
  };

  const registerStudent = async () => {
    if (!contract || !studentId || !studentName) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      toast.success("Student registered successfully!");
    } catch {
      toast.error("Failed to register student!");
    }
  };

  const getStudent = async () => {
    if (!contract || !studentId) {
      toast.error("Please provide a student ID!");
      return;
    }

    try {
      const student = await contract.getStudent(studentId);
      setStudentInfo(`Student Name: ${student.name}, ID: ${student.id}`);
      toast.success("Student data retrieved successfully!");
    } catch {
      toast.error("Failed to retrieve student data!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Registration DApp</h1>

      {account ? (
        <div>
          <p>Connected as: {account}</p>
        </div>
      ) : (
        <button style={styles.button} onClick={connectWallet}>Connect Wallet</button>
      )}

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={registerStudent}>Register Student</button>
      </div>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Student ID to Get Info"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={getStudent}>Get Student Info</button>
      </div>

      {studentInfo && <div style={styles.infoBox}>{studentInfo}</div>}

      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#00985B',
    color: 'white',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  input: {
    padding: '10px',
    margin: '10px',
    width: '250px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    border: '1px solid #ccc',
    borderRadius: '5px',
  }
};

export default App;

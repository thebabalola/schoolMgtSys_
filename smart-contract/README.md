A simple Ethereum-based school management system that allows for student registration and management.

## Smart Contract Implementation

Contract Address: 0x15b1a0818a0b475d889A3FF01EF53Ef8349fD3Ac

The `SchoolMgtSys` contract implements a basic class registration system with the following key features:

### Core Concepts Used

1. **Access Control**
   - Used `modifier onlyAdmin` to restrict sensitive functions
   - Admin is set during contract deployment
   - Ensures only authorized users can modify student data

2. **Data Structures**
   - `struct Student`: Stores student information (name and registration status)
   - `mapping(uint256 => Student)`: Maps student IDs to their data
   - `uint256[] studentIds`: Maintains a list of all student IDs

3. **Events**
   - `StudentRegistered`: Emitted when a new student is registered
   - `StudentRemoved`: Emitted when a student is removed
   - Useful for frontend updates and blockchain history

4. **Functions**
   - `registerStudent`: Adds new students to the system
   - `removeStudent`: Removes students from the system
   - `getStudent`: Retrieves individual student information
   - `getAllStudentIds`: Returns all registered student IDs
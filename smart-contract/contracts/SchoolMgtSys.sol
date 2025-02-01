// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SchoolMgtSys {
    address public admin;
    
    struct Student {
        uint256 id;
        string name;
        bool registered;
    }
    
    mapping(uint256 => Student) public students;
    uint256 public nextStudentId = 1;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerStudent(string memory name) public onlyAdmin {
        uint256 studentId = nextStudentId;
        students[studentId] = Student(studentId, name, true);
        nextStudentId++;
    }

    function removeStudent(uint256 studentId) public onlyAdmin {
        require(students[studentId].registered, "Student not found");
        students[studentId].registered = false;
    }

    function getStudent(uint256 studentId) public view returns (uint256, string memory) {
        require(students[studentId].registered, "Student not found");
        Student memory student = students[studentId];
        return (student.id, student.name);
    }

    function getAllStudents() public view returns (uint256[] memory) {
        uint256[] memory studentIds = new uint256[](nextStudentId - 1);
        uint256 index = 0;

        for (uint256 i = 1; i < nextStudentId; i++) {
            if (students[i].registered) {
                studentIds[index] = i;
                index++;
            }
        }
        
        return studentIds;
    }
}

import { Employee } from "./employee";
import { OutOfHMRSEmp } from "./outOfHRMSEmp";

export class EmployeeSync{
    matchedEmployee : Array<Employee>
    newEmployee : Array<Employee>
    outOfHRMS : Array<OutOfHMRSEmp>
}
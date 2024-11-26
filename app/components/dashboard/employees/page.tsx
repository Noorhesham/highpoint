import Image from "next/image";
import GridContainer from "../components/GridContainer";
import connect from "../utils/connect";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import ModalCustom from "../components/ModalCustom";
import { buttonVariants } from "@/components/ui/button";
import EmployeeForm from "../components/EmployeeForm";
import Employee from "../models/employeeModel";

export default async function Home() {
  const data1 = await Employee.find();
  const data = JSON.parse(JSON.stringify(data1));
  await connect();
  console.log(data);
  return (
    <main>
      <GridContainer className=" gap-5 min-h-screen" cols={12}>
        <div className="  border-r-2  pr-4  border-input col-span-2 ">
          <h1 className=" text-2xl font-semibold text-white">MOHAMED</h1>
        </div>
        <div className=" gap-4 col-span-3 px-3 lg:col-span-10 flex flex-col ">
          <div className=" w-full flex justify-between">
            <h1 className=" text-3xl text-white font-bold">Employees</h1>
            <ModalCustom
              content={<EmployeeForm />}
              btn={<div className={`${buttonVariants({ variant: "default" })} w-full`}>Add Employee</div>}
            />
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </GridContainer>
    </main>
  );
}

import { User } from "lucide-react";
import { CompanyInformationProps } from "./CompanyInformation.types";
import Image from "next/image";
import { CompanyForm } from "../CompanyForm";
import { NewContact } from "../NewContact";
import { ListContacts } from "../ListContact";

export function CompanyInformation(props: CompanyInformationProps) {
  const { company } = props;

  return (
    <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-10">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <Image
            src={company.profileImage}
            alt="Company logo"
            width={100}
            height={100}
            className="rounded-lg mb-2"
          />
          <p className="text-2xl font-semibold mb-6">{company.name}</p>
          {/*TODO: Add company name*/}
          <CompanyForm company={company} />
        </div>
      </div>

      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4 h-min">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <User className="w-5 h-5" />
            Contacts
          </div>
          <div>
            {/*TODO: New contacts*/}
            <NewContact />
          </div>
        </div>
        <ListContacts company={company} />
      </div>
    </div>
  );
}

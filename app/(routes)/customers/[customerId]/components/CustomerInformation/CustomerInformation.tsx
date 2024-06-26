
import { CustomerInformationProps } from "./CustomerInformation.types";
import { CustomerForm } from "../CustomerForm";

export function CustomerInformation(props: CustomerInformationProps) {
  const { customer } = props;

  return (
    <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-x-10">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <CustomerForm customer={customer} />
        </div>
      </div>
    </div>
  );
}

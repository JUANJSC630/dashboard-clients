import { HeaderCustomers } from "./components/HeaderCustomers";
import { ListCustomers } from "./components/ListCustomers";

export default function PageCustomers() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <HeaderCustomers />
      <ListCustomers />
    </div>
  );
}

import SecurityStats from "@/components/dashboard/security-stats";
import EmailList from "@/components/dashboard/email-list";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto">
      <SecurityStats />
      <EmailList />
    </div>
  );
}

import { redirect } from 'next/navigation';

export default function FinancialLedgerPage() {
  // Financial ledger has been decommissioned per administrative request
  redirect('/admin');
}

import { getAdminDashboardData } from '@/lib/server-data';
import AdminDashboard from '@/app/admin/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  return <AdminDashboard data={data} />;
}

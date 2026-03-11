import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        Failed to fetch dashboard data
      </p>
    );

  const purchasedCourse = data?.purchasedCourse || [];

  const courseData = purchasedCourse.map((item) => ({
    name: item.courseId?.courseTitle || "Unknown",
    price: item.courseId?.coursePrice || 0,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  const totalSales = purchasedCourse.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Platform performance overview
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Sales" value={totalSales} />
          <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        </div>

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Course Pricing Overview</CardTitle>
          </CardHeader>

          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Price"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

/* ============================
   Reusable Stat Card
============================ */
const StatCard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
    </CardContent>
  </Card>
);

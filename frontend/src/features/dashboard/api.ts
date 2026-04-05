import axiosClient from "@/api/axiosClient"

export const getDashboardData = async () => {
  const response = await axiosClient.get("/admin")
  return response.data
}
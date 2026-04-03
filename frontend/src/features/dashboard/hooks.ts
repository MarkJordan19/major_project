import { useQuery } from "@tanstack/react-query"
import axiosClient from "@/api/axiosClient"

export const useDashboard = () => {
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axiosClient.get("/projects")
      return res.data
    }
  })

  const rooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axiosClient.get("/rooms")
      return res.data
    }
  })

  const images = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await axiosClient.get("/images")
      return res.data
    }
  })

  const enquiries = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const res = await axiosClient.get("/enquiries")
      return res.data
    }
  })

  return {
    projects,
    rooms,
    images,
    enquiries
  }
}